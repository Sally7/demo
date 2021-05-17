<template>
  <div>
      <el-dialog title="图片采集"  width="440px" :visible="show" :before-close="handleClose">
        <img ref="gatheredImg" style="width: 400px; height: 300px" v-if="gatherSatus==1"/>
        <img ref="gatherImg" style="width: 400px; height: 300px" v-if="gatherSatus==0"/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="doClose">取 消</el-button>
          <el-button size="small" @click="gatherSatus=0" v-if="gatherSatus==1">重新采集</el-button>
          <el-button size="small" type="primary" @click="doGather" :loading="doing">{{gatherSatus==1?'确 定':'采 集'}}</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import GatherService from '@/api/GatherService'
  import UploadService from '@/api/UploadService'
  export default {
    name:"ScanImage",
    props: {
      type:String
    },
    data() {
      return {
        show:false,
        imageData:"",
        doing:false,
        gatherSatus:0
      }
    },
    mounted() {
      var that = this;
      eventBus.$on('onGatherImage',function(data){

          if(data.type == 0&&that.$refs.gatherImg) {
            that.$refs.gatherImg.src = data.data;
          } else if((data.type == 1&&that.$refs.gatheredImg) ){
            console.log("onGatherImage", data.data);
            that.$refs.gatheredImg.src = data.data;
            that.imageData = data.data;
          }
      });
    },
    methods: {
      start(){
        this.gatherSatus = 0;
        if(this.type=="main") {
          GatherService.sendCmd('bStartPlay');
        } else if(this.type=="vice") {
          GatherService.sendCmd('bStartPlay2');
        }
      },
      stop(){
        this.gatherSatus = 0;
        GatherService.sendCmd( "bStopPlay");
      },
      async doGather(){
        if(this.gatherSatus == 0) {
          this.doing = true;
          GatherService.sendCmd("sGetBase64");
          this.doing = false;
          this.gatherSatus = 1;
        } else {
          this.doing = true;
          var res = await UploadService.doUploadBase64Img(this.imageData);
          this.doClose();
          this.$emit("success", res);
          this.doing = false;
        }
        this.$forceUpdate();
      },
      doClose() {
        this.gatherSatus = 0;
        this.show = false;
        GatherService.sendCmd( "bStopPlay");
      },
      handleClose(){

        this.doClose();
      },
      doOpen() {
        this.show = true;
        this.start();
      },

    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
