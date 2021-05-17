<template>
  <div class="findaccount-container">
    <!-- <aliyun-capcha appkey='FFFF00000000016C4A73' scene='login'></aliyun-capcha> -->

    <div class="findaccount-box" v-if="!isSendAccount">
      <img class="logo" src="~@/assets/backend/suconnect_logo.png">
      <p class="title">找回账号</p>
      <el-form :model="resetForm" :rules="resetRules" ref="resetForm">
        <el-form-item prop="phone" style="margin-bottom: 40px">
          <el-input name="phone" type="text" v-model="resetForm.phone" placeholder="填写你绑定的手机号" />
          <p class="tip">账号将发送到与阿里云账号绑定的手机号，请输入该手机号码</p>
        </el-form-item>
        <div id="nc" style="margin-top: 10px; margin-bottom: 30px;"></div>
        <el-button type="primary" style="width:100%;" :loading="loading" :disabled="!ncValidatePass" @click="doRetrieveAccount">立即找回</el-button>
      </el-form>
    </div>
    <div class="send-success" v-else>
      <p><i class="el-icon-circle-check-outline"></i>账号已发送到您手机（{{resetForm.phone}}），请注意查收。<el-button type="text" @click="toLogin">立即登录</el-button></p>
      <el-button style="margin-top:20px;width: 200px;" :disabled="!isSendable" @click="doRetrieveAccount">{{isSendable?'重新发送':seconds+'秒后可重新发送'}}</el-button>
    </div>
  </div>
</template>

<script>
//import AliyunCaptcha from 'vue-aliyun-captcha'
import OpenuserService from '@/api/OpenuserService'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      value1: 0,
      loading: false,
      resetForm: {
        phone: ''
      },
      resetRules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      isSendAccount: false,
      seconds: 59,
      isSendable: true,
      ncValidatePass: false,
      appkey: 'FFFF00000000017CC0E1',
      nc_token: null,
      NC_Opt: null
    }
  },
  /*components: {
    'aliyun-capcha': AliyunCaptcha
  },*/
  created() {
    var cookieTime = Cookies.get('reSendSeconds');
    var curTime = Date.parse(new Date());
    if(parseInt(curTime)/1000-parseInt(cookieTime)/1000 < 59){
      this.seconds = 59+parseInt(cookieTime)/1000-parseInt(curTime)/1000;
      this.resetForm.phone = Cookies.get('phone');
      this.isSendAccount = true;
      this.isSendable = false;
      this.countdown();
    }else{
      this.isSendable = true;
      Cookies.remove('reSendSeconds');
      Cookies.remove('phone');
    }
  },
  mounted(){
    this.init();
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
    //找回账号
    async doRetrieveAccount(){
      this.$refs.resetForm.validate(valid => {
        if(valid){
          this.doSendAccount();
        }else{
          console.log('error submit!!')
          return false
        }
      })
    },
    async doSendAccount(){
      var response = await OpenuserService.doSendAccount(this.resetForm);
      switch(response.status){
        case 2:
          this.$message.error('该手机号没有绑定的账号');
          break;
        case 1:
          this.isSendAccount = true;
          Cookies.set('reSendSeconds', Date.parse(new Date()));
          Cookies.set('phone', this.resetForm.phone);
          this.isSendable = false;
          this.countdown();
          break;
        case 0:
          this.$message.error('找回账号失败');
          break;
        case -4:
          this.$message.error('发送过于频繁，请稍后再试');
          break;
        default:
          this.$message.error('手机号码异常');
      }
    },
    countdown(){
      var that = this;
      var interval = setInterval(function(){
        if(that.seconds>1){
          that.seconds--;
        }else{
          that.isSendable = true;
          that.seconds = 59;
          clearInterval(interval);
          Cookies.remove('reSendSeconds');
          Cookies.remove('phone');
        }
      }, 1000);
    },
    toLogin(){
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped>
    .findaccount-container{
      width: 100%;
      height: 100%;
      background-color: #fff;
      overflow: hidden;
      position: relative;
    }
    .findaccount-box{
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
    .tip{
      position: absolute;
      top: 100%;
      margin-top: 15px;
      line-height: 1.5;
      color: #999;
    }
    .send-success{
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      width: 450px;
      margin-left: auto;
      margin-right: auto;
      margin-top: -100px;
    }
    .send-success p{
      font-weight: bold;
    }
    .send-success p i{
      font-size: 28px;
      margin-right: 10px;
      vertical-align: middle;
      color: #05e005;
    }
    .send-success p .el-button{
      font-weight: bold;
    }
</style>
