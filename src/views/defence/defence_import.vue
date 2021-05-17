<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <div class="desc" v-if="importResults.length>0">
          <p style="font-weight: bold">导入结果：</p>
          <p v-for="res in importResults">{{res.fileName}}<label style="color: red" v-if="res.status != 1">&nbsp&nbsp导入失败!</label><label style="color: green" v-if="res.status == 1">nbsp&nbsp导入成功!</label></p>
        </div>
        <div class="desc">
          <p style="font-weight: bold">导入{{title}}操作流程：</p>
          <p>第 1 步：下载模板。  <el-link type="primary" @click="downloadTemplate">点我下载{{title}}模板</el-link></p>
          <p>第 2 步：按模板要求填写相关数据。</p>
          <p>第 3 步：上传模板进行导入。</p>
        </div>
        <div class="mt10">
          <el-upload
            ref="upload"
            drag
            multiple
            :auto-upload="false"
            :action="uploadUrl"
            :on-success="handleUploadSuccess"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传标准xlsx模版文件</div>
          </el-upload>
        </div>
        <div class="footer">
          <el-button size="small" type="primary" @click="doImport()" :loading="doing">导入</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  export default {
    data() {
      return {
        doing:false,
        model:{id:this.$route.query.id,archiveType:this.$route.query.archiveType},
//      uploadUrl:process.env.BASE_API+'/splatform/dyformexcel_doImportXinGangGroups.do?groupcategoryId=',
        uploadUrl:process.env.BASE_API+'/dyformexcel_doImportXinGangGroups.do?groupCategoryId=',
        templateUrl:"",
        groupcategoryId:'',
        importResults:[]
      }
    },
    components: {
      Breadcrumb
    },
    async created(){

      switch (+this.model.archiveType) {
        case 1:
          this.title = "退伍军人档案";
          this.groupcategoryId = 2002001001000000;
          break;
        case 2:
          this.title = "民兵档案";
          this.groupcategoryId = 2002002001001000;
          break;
        case 3:
          this.title = "预征兵役档案";
          this.groupcategoryId = 2002001003000000;
          break;
        case 4:
          this.title = "地专对口档案";
          this.groupcategoryId = 2002001002000000;
          break;
        case 5:
          this.title = "兵役档案档案";
          this.groupcategoryId = 2004000000000000;
          break;
        case 6:
          this.title = "新港园区企业机构";
          this.groupcategoryId = 9010000000000000;
          break;
      }
      this.uploadUrl = this.uploadUrl+this.groupcategoryId;
      this.templateUrl = process.env.BASE_API+"/excelTemplate/"+this.groupcategoryId+".xls";
    },
    methods: {
      doImport() {
        this.doing = true;
        this.$refs.upload.submit();
        this.doing = false;
      },
      downloadTemplate() {
        window.location.href = this.templateUrl;
      },
      handleUploadSuccess(res, file) {
        if(res.data.failCount >= 1) {
          this.importResults.push({status:0,fileName:file.name})
        } else {
          this.importResults.push({status:1,fileName:file.name})
        }
        console.log("handleUploadSuccess", res, file);
      }

    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .desc {
    background-color: rgb(247, 248, 250);
    padding: 20px;
    margin-top:20px;
  }

  .footer {
    width: 1200px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -594px;
    padding: 10px 0;
    text-align: center;
    z-index: 99;
    background-color: #ffffcc;
  }
</style>
