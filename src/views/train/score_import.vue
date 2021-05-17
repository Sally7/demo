<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <div class="desc">
          <p style="font-weight: bold">导入【{{type}}/{{title}}】操作流程：</p>
          <p>第 1 步：下载模板。
            <el-link type="primary" @click="downloadTemplate">点我下载{{title}}模板</el-link>
          </p>
          <p>第 2 步：按模板要求填写相关数据。</p>
          <p>第 3 步：上传模板进行导入。</p>
        </div>
        <div class="mt10">
          <el-upload
              ref="upload"
              drag
              :auto-upload="false"
              :action="uploadUrl"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传标准模版文件</div>
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
  import Breadcrumb from '@/components/Breadcrumb';
  import MarketingSceneService from '../../api/MarketingSceneService';

  export default {
    data() {
      return {
        doing: false,
        model: {id: this.$route.query.id, archiveType: this.$route.query.archiveType},
        uploadUrl: process.env.BASE_API + '/conditions_doImportConditionsContent.do?token=b8f987b3317b38e7fce77d62d0ad55a9&marketingSceneId=',
        templateUrl: '',

        //培训ID
        marketingSceneId: this.$route.query.marketingSceneId,
        //培训类型
        marketingSceneType: this.$route.query.marketingSceneType,
        //类型名称
        type: '',
        //培训名称
        title: this.$route.query.title,
      };
    },
    components: {
      Breadcrumb,
    },
    async created() {

      switch (this.marketingSceneType) {
        case '1017':
          this.type = '民兵政治教育';
          break;
        case '1018':
          this.type = '民兵军事训练';
          break;
        case '2000':
          this.type = '退伍军人职业培训';
          break;
      }
      this.uploadUrl = this.uploadUrl + this.marketingSceneId;
      this.templateUrl =  process.env.BASE_API + '/conditions_doExportExcelTemplate.do?token=b8f987b3317b38e7fce77d62d0ad55a9&marketingSceneId=' + this.marketingSceneId;
    },
    methods: {
      doImport() {
        this.doing = true;
        this.$refs.upload.submit();
        this.doing = false;
      },
      async downloadTemplate() {
        window.location.href = this.templateUrl;
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .desc {
    background-color: rgb(247, 248, 250);
    padding: 20px;
    margin-top: 20px;
  }

  .footer {
    width: 1040px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -435px;
    padding: 10px 0;
    text-align: center;
    z-index: 99;
    background-color: #ffffcc;
  }
</style>
