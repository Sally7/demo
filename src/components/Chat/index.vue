<template>
  <div class="chat-box-wrapper" v-if="openChat">
    <div class="chat-box-dialog">

    </div>
    <div class="chat-box-modal" @click="dialogTableVisible = false"></div>
  </div>
</template>

<script>
  import { mapGetters,mapState } from 'vuex'
  export default {
    props: {
    },
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters([
        'openChat'
      ])
    },
    watch: {
    },
    created(){

    },
    mounted() {

    },
    methods: {
      closeChat() {
        this.$store.dispatch('doOpenChat',false);
      }
    }

  }
</script>

<style scoped lang="scss">
.chat-box-wrapper{
  .chat-box-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 2000;
  }
  .chat-box-dialog {
    position: fixed;
    display: flex;
    margin-left: -500px;
    top: 15%;
    left: 50%;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    z-index: 999999;
    .chat-box-close{
      position: absolute;
      font-size: 30px;
      top:10px;
      right: 20px;
      color: #fff;
      cursor: pointer;
      z-index: 9999999;
    }
    .left{
      padding-top: 55px;
      width: 55px;
      height: 600px;
      font-size: 30px;
      background: #E8E9EE;
      color:#6E7580;
      .profile{
        text-align: center;
        img{
          width: 40px;
          border-radius: 5px;
        }
      }
      .icon{
        margin-top: 8px;
        text-align: center;
        img{
          width: 35px;
        }
      }
    }
    .middle{
      position: relative;
      width: 252px;
      background: #fff;
      border-right:1px solid #E9E9EB;
      .search-input{
        padding: 24px 20px 10px;
        background: #fff;
        border-bottom:1px solid #E9E9EB;
      }
      .link-list{
        height: 537px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-left:17px;
        .linker{
          padding: 13px 0 13px 2px;
          display: flex;
          border-bottom: 1px solid #F7F7F7;
          .profile{
            width: 40px;
            height: 40px;
            margin-right: 5px;
            border-radius: 3px;
          }
          .info{
            .name{
              width: 180px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .intro{
              width: 180px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-top: 7px;
              line-height: 12px;
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
      .link-list::-webkit-scrollbar {/*滚动条整体样式*/
        width: 7px;/*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      .link-list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.9);
        transition-duration: 0ms;
        transform: translate(0px, 10px) translateZ(0px);
        transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
      }
    }
  }
}

</style>
