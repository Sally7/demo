<template>
  <div class="resetpsw-container">
    <div class="resetpsw-box">
      <img class="logo" src="~@/assets/backend/suconnect_logo.png">
      <p class="title">忘记密码</p>
      <el-form class="login-form" :model="resetForm" :rules="resetRules" ref="resetForm" v-if="btnType!==4">
        <el-form-item prop="password">
          <el-input name="password" type="text" placeholder="旧密码" v-model="resetForm.password" />
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input name="newPassword" type="text" placeholder="新密码" v-model="resetForm.newPassword" />
        </el-form-item>
        <el-form-item prop="newPasswordSecond">
          <el-input name="newPasswordSecond" type="text" placeholder="重复新密码" v-model="resetForm.newPasswordSecond" />
        </el-form-item>
        <el-button type="primary" style="width:100%;margin-top:10px;" :loading="loading" :disabled="(!ncValidatePass) && btnType==2" @click="doClick">{{btnText}}</el-button>
      </el-form>
      <div class="reset-success" v-else>
        <p>密码重置成功，请前往登录</p>
        <el-button type="primary" style="width:100%;margin-top:20px;" @click="toLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SendShortMessageService from '@/api/SendShortMessageService'
import UserService from '@/api/UserService.js'
import cacheCookies from '@/utils/auth'
export default {
  data() {
    return {
      loading: false,
      resetForm: {
        password: '',
        newPassword: '',
        newPasswordSecond:''
      },
      resetRules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        newPasswordSecond: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
      },
      btnType: 1,
      btnText: '重置密码',
      ncValidatePass: false,
    }
  },
  created() {

  },
  methods: {
    doClick(){
      this.$refs.resetForm.validate(valid => {
        if(valid){
          console.log(valid);
          this.doResetPassword();
        }
      })
    },
    //重置密码
    async doResetPassword(){
      if(this.resetForm.newPassword != this.resetForm.newPasswordSecond) {
        this.$message.error('请检查2次新密码是否一致！');
        return;
      }

      var response = await UserService.doChangePassword(this.resetForm.password, this.resetForm.newPassword);
      console.log(response);
      switch(response.status){
        case 5:
          this.$message.error('该验证码已失效，请重新发送');
          break;
        case 1:
          cacheCookies.removeAccount();
          cacheCookies.removePassword();
          cacheCookies.setRememberLogin(false);
          this.$message.success('密码重置成功');
          this.btnType = 4;
          this.btnText = "登录";
          break;
        case -1:
          this.$message.error('密码不能为空');
          break;
        case 0:
          this.$message.error(response.data);
          break;
        default:
          //this.$message.error('验证码错误');
      }
    },
    toLogin(){
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push("/login");
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
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
