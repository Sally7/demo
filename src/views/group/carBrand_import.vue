<template>
  <div class="app-container" id="wrapper">
    <Breadcrumb class="breadcrumb-container"></Breadcrumb>
    <div class="app__content">
      <div class="content">
        <div class="upload-content-title">上传数据:</div>
        <div class="upload-content">
          <el-upload
            :action="uploadUrl"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <el-button type="text">添加Excel表</el-button>
            <div slot="tip" class="margin-space">• 推荐使用标准模板导入数据</div>
            <div slot="tip" class="margin-space">• 仅支持xls或xlsx格式的文件</div>
          </el-upload>
          <el-row class="margin-space">
            <el-button type="primary" size="small" @click="doBatchAddGroupPlateNumberByExcel" v-loading.fullscreen.lock="fullscreenLoading">导入</el-button>
            <el-button size="small" @click="doCancel">取消</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import cacheCookies from '@/utils/auth'
  import CarService from '@/api/CarService'
  export default {
    components: {
      Breadcrumb,
    },
    data() {
      return {
        fullscreenLoading:false,
        uploadUrl:process.env.BASE_API+'/file_uploadExcel.do?key=system.image.processor.1xxl',
        fileList:[],
      }
    },
    methods: {
      doCancel(){
        this.$router.back();
      },
      beforeAvatarUpload(file) { //上传之前的限制
        const isXls= file.type === 'application/vnd.ms-excel';
        const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXls && !isXlsx) {
          this.$message.error('上传文件只能是 xls或者xlsx 格式!');
          return false;
        }
        if (isXls){
          return isXls;
        }else if(isXlsx){
          return isXlsx;
        }
      },
      handleAvatarSuccess(res, file) { //上传成功的回调
        this.fileList = [{name:res.fileName,url:res.exceUrl}];
      },
      async doBatchAddGroupPlateNumberByExcel() { // 导入车牌excel
        if(this.fileList.length>0){
          var file = this.fileList[0];
          this.fullscreenLoading = true;
          var res = await CarService.doBatchAddGroupPlateNumberByExcel(file.url,file.name);
          this.fullscreenLoading = false;
          if(res.status == 1){
            this.$message({
              message: '您成功导入了'+res.data+'条客户信息',
              type: 'success'
            });
            this.$router.push("/group/regular_customer_manager");
          }else {
            this.$message.error('导入出错，请重试');
          }
        }else {
          this.$message.error('请先添加Excel表');
        }
      },
    }
  }
</script>
<style>
  .content{
    width: 30%;
    height: 50px;
    display: flex;
  }
  .upload-content-title{
    flex: none;
    margin-top: 10px;
  }
  .upload-content{
    flex: auto;
    padding-left: 20px;
  }
  .btn-color{
    color: #4378FF;
  }
  .margin-space{
    margin-top: 20px
  }
</style>
