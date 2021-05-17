<template>
  <div class="login-container clearfix" style="">
    <div class="login-wrap">
      <div style="width: 100%;position: relative;display: flex;justify-content: center">
        <img style="height: 150px;" src="../../assets/logo/login_logo.png">
      </div>
      <el-row class="tabs">
        <el-col :class="['tab', {active: tabIndex==1}]" :span="12" @click.native="tabSwitch(1)">账号密码登录</el-col>
        <el-col :class="['tab', {active: tabIndex === 2}]" :span="12" @click.native="tabSwitch(2)">指纹登录</el-col>
        <el-col v-if="false" :class="['tab', {active: tabIndex==2}]" :span="12" @click.native="tabSwitch(3)">扫码登录</el-col>
      </el-row>
      <div class="login-box">
        <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm" v-if="tabIndex==1">
          <el-form-item prop="username" class="el-form-input">
            <span class="input-icon-wrap user-icon"><i></i></span>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号" />
          </el-form-item>
          <el-form-item prop="password" class="el-form-input">
            <span class="input-icon-wrap password-icon"><i></i></span>
            <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
              placeholder="密码" />
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </el-form-item>
          <el-form-item class="operations-wrap" prop="buffer">
            <el-row>
              <el-col :span="12">
                <el-checkbox label="记住账号" v-model="loginForm.checked"></el-checkbox>
              </el-col>
              <el-col class="help" :span="12" v-if="false">
                <a @click="toResetPassword">找回密码</a>
                <a @click="toRetrieveAccount">找回账号</a>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button type="primary" style="width:100%;margin-top:10px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        </el-form>
        <div class="login-qrcode-wrap" v-if="tabIndex === 2">
          <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm">
            <el-form-item prop="username" class="el-form-input">
              <span class="input-icon-wrap user-icon"><i></i></span>
              <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号" />
            </el-form-item>
          </el-form>
          <el-button type="primary" style="width:100%;margin-top:10px;" :loading="loading" @click.native.prevent="handleLogin">指纹认证登陆</el-button>
        </div>
        <div class="login-qrcode-wrap" v-if="false">
          <img class="login-qrcode" src="~@/assets/backend/qrcode_native.png">
          <p class="login-tip">请使用微信扫码登录</p>
        </div>
      </div>
    </div>
    <div class="download-wrap" v-if="false">
      <el-row class="download" :gutter="20">
        <el-col :span="6">
          <div class="download-title">客户端下载</div>
        </el-col>
        <el-col :span="6">
          <el-popover
            placement="top-end"
            width="300"
            trigger="click">
            <el-row>
              <el-col :span="16">
                <h4>扫码下载</h4>
                <p>超级助理手机客户端</p>
              </el-col>
              <el-col :span="8">
                <img src="~@/assets/backend/qrcode_native.png" width=90>
              </el-col>
            </el-row>
            <el-button slot="reference">安卓版</el-button>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            placement="top-end"
            width="300"
            trigger="click">
            <el-row>
              <el-col :span="16">
                <h4>扫码下载</h4>
                <p>超级助理手机客户端</p>
              </el-col>
              <el-col :span="8">
                <img src="~@/assets/backend/qrcode_native.png" width=90>
              </el-col>
            </el-row>
            <el-button slot="reference">IOS版</el-button>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-button @click="downloadPc">PC版</el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="手机验证" :visible.sync="dialogValidateVisible">
      <el-form :model="bindForm" :rules="bindRules" ref="bindForm">
        <el-form-item label="手机号码:" label-width="120px" prop="phone">
          <el-input size="small" v-model="bindForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-button size="mini" style="margin-left: 120px;" @click="sendVcode">发送验证码</el-button>
        <el-form-item class="mt10" label="验证码:" label-width="120px" prop="vcode">
          <el-input size="small" v-model="bindForm.vcode" placeholder="请输入验证码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doBindPhone">确 定</el-button>
        <el-button @click="dialogValidateVisible = false">取 消</el-button>
      </div>
    </el-dialog>


    <auth-finger
        ref="authFinger"
        :fingerCode="loginForm.fingerCode"
        @success="authFingerSuccess"
    ></auth-finger>
  </div>
</template>

<script>
//import { isvalidUsername } from '@/utils/validate'
import socialSign from './socialsignin'
import { Message } from 'element-ui'
import cacheCookies from '@/utils/auth'
import SendShortMessageService from '@/api/SendShortMessageService'
import GatherService from '@/api/GatherService'
import UserService from "../../api/UserService";
import AuthFinger from '@/components/AuthFinger/index';

export default {
  components: { socialSign,AuthFinger },
  name: 'login',
  data() {
    /*const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }*/
    const validatePassword = (rule, value, callback) => {
      if (value) {
        callback()
      }
    }
    return {
      tabIndex: 1,
      loginForm: {
        username: '',
        password: '',
        buffer: false,
        checked: false,
        isNeedBind: 0,
        fingerCode:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      bindForm: {
        phone: '',
        vcode: '',
        token: ''
      },
      bindRules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        vcode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      dialogValidateVisible: false,
      pwdType: 'password',
      fingerAuthed:false,
      fingerUser:null,
      loading: false,
      showDialog: false
    }
  },
  created() {
    if(cacheCookies.getRememberLogin() === 'true') {
      this.loginForm.username = cacheCookies.getAccount();
      this.loginForm.password = cacheCookies.getPassword();
      this.loginForm.checked = true;
    }
  },
  methods: {
    tabSwitch(num){
      this.tabIndex = num;
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    authFingerSuccess(res) {
      if(!this.fingerAuthed) {
        this.fingerAuthed = true;
        if(+res.data > 50) {
          this.loading = true
          this.$store.dispatch('LoginByFinger', this.fingerUser, 2).then((result) => {
            if(result === "nophone"){
              console.log('nophone........')
              /** 暂时去掉手机短信验证的操作 **/
              this.loading = false
              this.$router.push({ path: '/' })

              //this.dialogValidateVisible = true;
              //this.loading = false;
            }else{
              this.loading = false
              this.$router.push({ path: '/' })
            }
          }).catch(error => {
            Message.error(error)
            this.loading = false
          })
        } else {
          this.fingerAuthed = false;
        }
      }
      console.log("authFingerSuccess",res);
    },
    toResetPassword(){
      this.$router.push({ path: '/resetpassword' });
    },
    toRetrieveAccount(){
      this.$router.push({ path: '/retrieve_account' });
    },
    async handleLogin() {
      if(this.tabIndex == 2) {
        var user = await UserService.doGetUserByAccount(this.loginForm.username);
        console.log(user);
        if(user) {
          this.fingerUser = user;
          this.loginForm.fingerCode = user.fingerOneCode;
          if(!user.fingerOneCode) {
            this.$message.error('当前登陆的账号没有采集指纹，请采集后重试！');
            return;
          }
          this.$refs.authFinger.doOpen();
        } else {
          this.$message.error('登陆的账号不存在，请重试！');
        }
        return ;
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if(this.loginForm.checked) {
            console.log('loginForm.checked.....')
            cacheCookies.setAccount(this.loginForm.username);
            cacheCookies.setPassword(this.loginForm.password);
            cacheCookies.setRememberLogin(true);
          } else {
            console.log('loginForm.nochecked.....')
            cacheCookies.removeAccount();
            cacheCookies.removePassword();
            cacheCookies.setRememberLogin(false);
          }
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm, 2).then((result) => {
            if(result === "nophone"){
              console.log('nophone........')
              /** 暂时去掉手机短信验证的操作 **/
              this.loading = false
              this.$router.push({ path: '/' })

              //this.dialogValidateVisible = true;
              //this.loading = false;
            }else{
              this.loading = false
              this.$router.push({ path: '/' })
            }
          }).catch(error => {
            Message.error(error)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //发送验证码（绑定手机号）
    async sendVcode(){
      var res = await SendShortMessageService.doSendVerificationCode({
        phone: this.bindForm.phone,
        smsType: 3 //2修改密码验证码 3绑定手机号验证码 4找回登录名验证码
      });
    },
    //绑定手机号
    async doBindPhone(){
      var that = this;
      this.$refs.bindForm.validate(valid => {
        if (valid){
          this.loginForm.isNeedBind = 1;
          this.$store.dispatch('LoginByUsername', this.loginForm).then((result) => {
            that.bindForm.token = result;
            that.$store.dispatch('LoginByBindPhone', that.bindForm).then(data => {
              switch(data.status){
                case 5:
                  Message.error('该验证码已失效');
                  break;
                case 4:
                  Message.error('该手机未发送验证码');
                  break;
                case 3:
                case 2:
                  Message.error('验证码错误');
                  break;
                case 1:
                  Message.success('绑定成功')
                  that.dialogValidateVisible = false;
                  that.handleLogin();
                  break;
                case 0:
                  Message.error('绑定手机号失败');
                  break;
                case -1:
                  Message.error('手机号不一致');
                  break;
              }
            })
          }).catch(error => {
            Message.error(error)
            this.loading = false
          })
        }else{
          console.log('error submit!!')
          return false
        }
      })
    },
    downloadPc() {
      window.location.href = "http://t.cn/RHVzJA4";
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    @include relative;
    height: 100%;
    min-width: 1000px;
    background: url('~@/assets/backend/login.jpg') no-repeat;
    background-size: 100% 100%;
    background-color: #fff;
    .login-wrap {
      position: absolute;
      top: 20%;
      right: 150px;
      width: 460px;
      padding-top: 20px;
      border-radius: 20px;
      background-color:rgba(255, 255, 255, .8);
      border: 1px solid #E6E6E6;


    }
    .tabs{

      .tab{
        height: 90px;
        line-height: 90px;
        color: rgba(0,0,0,.5);
        text-align: center;
        font-size: 18px;
        border-bottom: 1px solid #E6E6E6;
        cursor: pointer;
      }
      .tab+.tab{
        border-left: 1px solid #E6E6E6;
      }
      .tab:hover{
        background-color: #f9f9f9;
      }
      .tab.active{
        color: #000;
        border-bottom: none;
      }
      .tab.active:hover{
        background-color: transparent;
      }
    }
    .login-box {
      padding: 0px 60px;
      padding-bottom: 40px;
      input {
        background: #ffffff;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 10px 5px 10px 5px;
        color: #888;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
      .el-input {
        display: inline-block;
        height: 50px;
        width: 85%;
        vertical-align: middle;
      }
      .el-form-item {
        border: 1px solid #CBCBCB;
        border-radius: 5px;
        color: #454545;
      }
      .el-form-input {
        background: #fff;
      }
      .operations-wrap {
        border: none;
        .el-form-item__content {
          line-height: 20px;
        }
      }
      a {

      }
      .logo {
        display: block;
        width: 120px;
        height: 120px;
        margin: 0 auto;
      }
    }
    .login-qrcode-wrap{
      margin-top: 40px;
      text-align: center;
    }
    .fingerprint-img{
      width: 80px;
      // height: 80px
    }
    .login-qrcode{
      display: block;
      margin: 0 auto;
      width: 160px;
      height: 160px;
    }
    .login-tip{
      margin-top: 10px;
      color: #666;
      text-align: center;
      font-size: 16px;
    }
    .login-form{
      /*margin-top: 50px;*/
    }
    .input-icon-wrap {
      display: inline-block;
      height: 50px;
      padding: 12px 5px 12px 15px;
      vertical-align: middle;
      box-sizing: border-box;
      i {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: cover;
      }
    }
    .user-icon {
      i {
        background-image: url('~@/assets/backend/user.png');
      }
    }
    .password-icon {
      i {
        background-image: url('~@/assets/backend/password.png');
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .help {
      text-align: right;
      color: #01A1C5;
    }
    .help a+a{
      margin-left: 10px;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .download-wrap {
      position: absolute;
      bottom: 40px;
      width: 100%;
    }
    .download {
      width: 420px;
      margin: 0 auto !important;
    }
    .download-title {
      line-height: 40px;
    }
    .box {
      height: 36px;
      line-height: 36px;
      min-width: 85px;
      text-align: center;
      border: 1px solid #CDCDCD;
      border-radius: 3px;
      cursor: pointer;
    }
    .el-popover {
      z-index: 2000;
    }
  }
</style>
