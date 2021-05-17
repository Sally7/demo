<template>
  <div class="coupon">
      <el-dialog title="扫描采集" width="650px" :visible="show" :before-close="handleClose">
        <img ref="gatheredImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAIAAAA3RD4GAAAARElEQVRIDe3SsQkAMAwDQcfbav8FQib4SqR510KGQyfJNG+b5a/bBygskUQogAFXJBEKYMAVSYQCGHBFEqEABlzRf6ILCmYBfddweUQAAAAASUVORK5CYII=" style="width: 600px; height: 450px" v-if="gatherSatus==1"/>
        <img ref="gatherImg" v-loading="true" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAIAAAA3RD4GAAAARElEQVRIDe3SsQkAMAwDQcfbav8FQib4SqR510KGQyfJNG+b5a/bBygskUQogAFXJBEKYMAVSYQCGHBFEqEABlzRf6ILCmYBfddweUQAAAAASUVORK5CYII="  style="width: 600px; height: 450px" v-if="gatherSatus==0"/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="doClose">取 消</el-button>
          <el-button size="small" @click="gatherSatus=0" v-if="gatherSatus==1&&!doing">重新采集</el-button>
          <el-button size="small" type="primary" @click="doGather" :loading="doing">{{gatherSatus==1?'确 定':'采 集'}}</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import GatherService from '@/api/GatherService'
  import UploadService from '@/api/UploadService'
  export default {
    name:"GatherScanImage",
    props: {
      type:String
    },
    data() {
      return {
        show:false,
        imageData:"",
        doing:false,
        gatherSatus:0,
        busHandle:null,
        startImage:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAIAAAA3RD4GAAAARElEQVRIDe3SsQkAMAwDQcfbav8FQib4SqR510KGQyfJNG+b5a/bBygskUQogAFXJBEKYMAVSYQCGHBFEqEABlzRf6ILCmYBfddweUQAAAAASUVORK5CYII="
      }
    },
    mounted() {
      var that = this;
      this.busHandle = eventBus.$on('onGatherImage',function(data){
        console.log(data.type,data);
        if(data&&data.data.length<200) {
          return;
        }
        if(data.type == 0&&that.$refs.gatherImg) {
          that.$refs.gatherImg.src = data.data;
        } else if(data.type == 2&&that.$refs.gatheredImg){
          that.$refs.gatheredImg.src = data.data;
          that.imageData = data.data;
          that.doing = false;

          that.$forceUpdate();

          that.doGather();
        }
      });
    },
    beforeDestroy() {
      eventBus.$off("onGatherImage", this.busHandle);
    },
    methods: {
      start(){
        if(this.$refs.gatherImg) {
          this.$refs.gatherImg.src = this.startImage;
        }
        this.gatherSatus = 0;
        if(this.type=="main") {
          var result = GatherService.sendCmd('bStartPlay');
          if(result) {
            GatherService.sendCmd('bSetMode(3)');
            GatherService.sendCmd('vSetSkewFlag(1)');
            GatherService.sendCmd('vSetDelHBFlag(1)');
            GatherService.sendCmd('vSetRotate(270)');
          } else {
            this.$message({
              showClose: true,
              message: '启动设备失败，请检查设备服务是否已开启。',
              type: 'error',
            });
          }
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
          GatherService.sendCmd("bSaveJPGEx");
          this.gatherSatus = 1;
        } else {
          this.doing = true;
          var res = await UploadService.doUploadBase64Img(this.imageData);
          this.$emit("success", res);
          this.gatherSatus=0
          this.doing = false;
          this.$message({
            showClose: true,
            message: '采集成功',
            type: 'success',
          });
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
      },
      doShow() {
        this.show = true;
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
