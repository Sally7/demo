<template>
  <div class="resetpsw-container">
    <div class="resetpsw-box">
      <img class="logo" src="~@/assets/backend/suconnect_logo.png">
      <p class="title" v-if="btnType!==4">忘记密码</p>
      <el-form class="login-form" :model="resetForm" :rules="resetRules" ref="resetForm" v-if="btnType!==4">
        <el-form-item prop="phone">
          <el-input name="phone" type="text" placeholder="填写你绑定的手机号" v-model="resetForm.phone" :disabled="btnType>1">
            <template slot="prepend" v-if="btnType>1">+86</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="vcode" v-if="btnType==3">
          <el-input name="vcode" type="text" placeholder="短信验证码" v-model="resetForm.vcode" />
        </el-form-item>
        <el-form-item prop="newPassword" v-if="btnType==3">
          <el-input name="newPassword" type="text" placeholder="密码" v-model="resetForm.newPassword" />
        </el-form-item>
        <div id="nc" style="margin-top: 10px; margin-bottom: 30px;" v-if="btnType==2"></div>
        <el-button type="primary" style="width:100%;margin-top:10px;" :loading="loading" :disabled="(!ncValidatePass) && btnType==2" @click="doClick">{{btnText}}</el-button>
      </el-form>
      <div class="reset-success" v-else>
        <p>+86-{{resetForm.phone}}</p>
        <p>密码重置成功，请前往登录</p>
        <el-button type="primary" style="width:100%;margin-top:20px;" @click="toLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SendShortMessageService from '@/api/SendShortMessageService'
import OpenuserService from '@/api/OpenuserService'

export default {
  data() {
    return {
      loading: false,
      resetForm: {
        phone: '',
        vcode: '',
        newPassword: ''
      },
      resetRules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        vcode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      btnType: 1,
      btnText: '重置密码',
      ncValidatePass: false,
      appkey: 'FFFF00000000017CC0E1',
      nc_token: null,
      NC_Opt: null
    }
  },
  created() {

  },
  methods: {
    init(){
      var that = this;
      this.nc_token = [this.appkey, (new Date()).getTime(), Math.random()].join(':');
      this.NC_Opt = {
        renderTo: '#nc',
        appkey: this.appkey,
        scene: 'nc_message',
        token: this.nc_token,
        trans: {"key1": "code200"},
        //elementID: ["usernameID"],
        is_Opt: 0,
        isEnabled: true,
        language: "cn",
        timeout: 10000,
        times: 5,
        //retryTimes: 5,
        //errorTimes: 5,
        apimap: {},
        //bannerHidden:false,
        //initHidden:false,
        callback: function (data) {
            OpenuserService.doMachineverification({
              token: that.nc_token,
              sessionId: data.csessionid,
              sig: data.sig,
              scene: that.NC_Opt.scene
            }).then(result => {
              if(result.status == 1){
                that.ncValidatePass = true;
              }
            }).catch(error => {
              Message.error(error)
              this.loading = false
            });
        },
      }
      this.generate();

      //nc.reset();//请务必确保这里调用一次reset()方法
    },
    generate(){
      var nc = new noCaptcha(this.NC_Opt);
      //nc.init(this.NC_Opt);
      nc.upLang('cn', {
          _startTEXT: "请按住滑块，拖动到最右边",
          _yesTEXT: "验证通过",
          _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
          _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
      })
    },
    doClick(){
      this.$refs.resetForm.validate(valid => {
        if(valid){
          if(this.btnType === 1){
            this.btnType = 2;
            this.btnText = "获取短信验证码";
            this.$nextTick(function(){
              this.init();
            })
          }else if(this.btnType === 2){
            this.sendVcode();
          }else if(this.btnType === 3){
            this.doResetPassword();
          }
        }else{
          console.log('error submit!!')
          return false
        }
      })
    },
    //获取验证码
    async sendVcode(){
      var res = await SendShortMessageService.doSendVerificationCode({
        phone: this.resetForm.phone,
        smsType: 2 //2修改密码验证码 3绑定手机号验证码 4找回登录名验证码
      });
      switch(res.status){
        case 1:
          this.btnType = 3;
          this.btnText = "重置密码";
          break;
        case 0:
          this.$message.error('发送验证码失败');
          break;
        case -4:
          this.$message.error('发送过于频繁，请稍后再试');
          break;
        default:
          this.$message.error('手机号码异常');
      }
    },
    //重置密码
    async doResetPassword(){
      var response = await OpenuserService.doUpdatePassword({
        phone: this.resetForm.phone,
        password: this.resetForm.newPassword,
        code: this.resetForm.vcode
      });
      switch(response.status){
        case 5:
          this.$message.error('该验证码已失效，请重新发送');
          break;
        case 1:
          this.$message.success('密码重置成功');
          this.btnType = 4;
          this.btnText = "登录";
          break;
        case -1:
          this.$message.error('密码不能为空');
          break;
        default:
          this.$message.error('验证码错误');
      }
    },
    toLogin(){
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped>
    .resetpsw-container{
      width: 100%;
      height: 100%;
      background-color: #fff;
      overflow: hidden;
    }
    .resetpsw-box{
      width: 500px;
      margin: 200px auto 0;
    }
    .logo{
      display: block;
      margin: 0 auto;
    }
    .title{
      margin-top: 40px;
      margin-bottom: 20px;
      text-align: center;
      color: #999;
    }
    .reset-success{
      margin-top: 80px;
    }
    .reset-success p{
      text-align: center;
      color: #666;
    }
</style>
