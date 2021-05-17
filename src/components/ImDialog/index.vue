<template>
  <div class="im-dialog">
    <div class="icon-close">
      <i class="el-icon-close" @click="closeDialog"></i>
    </div>
    <iframe :src="imUrl"></iframe>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // imUrl:'https://im.suconnected.com/#/conversation'
        imUrl:'http://swdev.suconnected.com/su_chat/#/conversation?mobile=13900000000&code=66666'
      }
    },
    methods: {
      closeDialog() {
        this.$store.dispatch('doOpenChat',false);
      }
    }
  }
</script>
<style lang="less">
  .im-dialog{
    position: fixed;
    z-index:999;
    top:0;
    left:0;
    bottom:0;
    right: 0;
    /*background-color: rgba(0,0,0,.6);*/
    .icon-close{
      position: absolute;
      right: 15px;
      top: 15px;
      z-index: 999999;
      i{
        font-size: 30px;
        color: #fff;
      }
    }
    iframe{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
