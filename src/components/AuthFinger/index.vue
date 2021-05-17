<template>
  <div class="coupon">
      <el-dialog title="指纹认证"  width="440px" :visible="show" :before-close="handleClose" style="text-align: center">
        <img ref="gatheredImg" style="width: 200px;" :src="imageData" v-if="gatherSatus==1"/>
        <img ref="gatherImg" style="width: 200px;" src="~@/assets/img/finger-gather.gif" v-if="gatherSatus==0"/>
        <p><h2>{{message}}</h2></p>
      </el-dialog>
  </div>
</template>

<script>
  import GatherService from '@/api/GatherService'
  import UploadService from '@/api/UploadService'
  import UserService from "@/api/UserService";

  export default {
    name:"GatherFinger",
    props: {
      fingerCode:String
    },
    data() {
      return {
        show:false,
        imageData:"",
        doing:false,
        gatherSatus:0,
        message:"请按压手指",
        fingerCode1:""
      }
    },
    mounted() {

    },
    methods: {
      start(){
        var that = this;
        this.message = "请按压手指";
        this.gatherSatus = 0;
        eventBus.$on('onGatherFinger',function(data){
          console.log("onGatherFinger.....",data);
          switch(data.status)
          {
            case "1":that.message = "执行成功";
              that.imageData = data.data;
              that.gatherSatus = 1;
              that.fingerCode1 = data.fingerCode;
              that.doGather();
              break;
            case "2": that.message = "指纹图像太差";break;
            case "3": that.message = "设备生成特征错误";break;
            case "-99": that.message = "未知异常";break;
            case "-100": that.message = "参数错误";break;
            case "-101": that.message = "设备打开失败";break;
            case "-102": that.message = "设备没有指纹，请按压指纹";break;
            case "-103": that.message = "设备通讯异常";break;
            case "-104": that.message= "设备合成模板失败";break;
            default:that.message = "其他错误 错误代码"+result;break;
          }

          that.$forceUpdate();
        });

        GatherService.doGetFingerInterval();
      },
      stop(){
        this.gatherSatus = 0;

      },
      async doGather(){
        if(this.gatherSatus == 0) {
          this.doing = true;
          this.doing = false;
          this.gatherSatus = 1;
        } else {
          this.doing = true;
          var res = await GatherService.doMatchFinter(this.fingerCode.trim(), this.fingerCode1.trim());
          this.$emit("success", res);
          this.doing = false;
          this.doClose();
        }
        this.$forceUpdate();
      },
      doClose() {
        this.gatherSatus = 0;
        this.show = false;
      },
      handleClose(){
        this.doClose();
      },
      doOpen() {
        this.show = true;
        this.start();
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
