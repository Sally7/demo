<template>
  <div class="app-container" id="wrapper">
      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="app__content">
        <h4 class="title">{{title}}</h4>
        <div class="qrcode-box">
          <div class="qrcode"></div>
          <p>{{desc}}</p>
        </div>
        <h3>{{tip}}</h3>
      </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    data() {
      return {
        title: "",
        desc: "",
        tip: "让店铺管理员扫描此二维码根据提示进行绑定"
      }
    },
    components: {
      Breadcrumb
    },
    mounted() {
      this.init(this.$route.query.type);
    },
    methods: {
      init(type) {
        if(parseInt(type) === 1) {
          this.title = "小程序账号授权";
          this.desc = "使用小程序绑定的管理员个人微信号扫描";
        }
      }
    }
  }
</script>

<style scoped>
  .title {
    padding: 15px 0;
    font-size: 18px;
    font-weight: normal;
    text-align: center;
  }
</style>
