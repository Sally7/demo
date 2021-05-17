<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">音频配置</div>
    <div class="app__content">
      <el-button type="primary" @click="voiceSettingAUDialogVisible = true;cleanForm()" style="margin-bottom: 20px">
        +添加音频
      </el-button>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="voices"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          align="center"
          label="简称"
          prop="description">
        </el-table-column>
        <el-table-column
          align="center"
          label="推送地区"
          prop="areasLabel"
        >
        </el-table-column>
        <el-table-column
          align="right"
          label="操作">
          <template slot-scope="scope">
            <el-popover
              ref="popover"
              placement="top"
              width="200"
              trigger="click"
              v-model="scope.row.visible">
              <p>确定删除 {{scope.row.description}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(scope.row),scope.row.visible = false">确定
                </el-button>
              </div>
              <el-button class="ml10" type="text" size="small"  slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="音频" :visible.sync="voiceSettingAUDialogVisible">
      <el-form :model="form" :rules="rules" label-width="80px" ref="voiceSetting">
        <el-form-item label="音频简称" prop="description" placeholder="请输入名称">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="音频文件" prop="description" placeholder="请输入名称">
          <el-upload
            class="upload-demo"
            action="https://jh.njdapaidang.com/file_uploadFile.do"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个wav文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="投放地区">
          <el-checkbox v-for="area in groupAreas" v-bind:key="area.id" :label="area.name" name="type" v-model="area.checked"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="voiceSettingAUDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="voiceSettingAUDialogVisible = false;doConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import CommonParamService from '@/api/CommonParamService'
  import AreaService from '@/api/AreaService'
  import CustomerRankService from '@/api/CustomerRankService'

  export default {
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount: 0,
        currentPage: 1,
        pageSize: 20,
        voices: [],
        voiceSettingAUDialogVisible: false,
        groupAreas:[],
        fileList:[],
        form: {},
        rules: {
          description: [
            {required: true, message: '请输入简称', trigger: 'blur'},
            {min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur'}
          ],
          url: [
            { required: true, message: '请输入媒体地址', trigger: 'blur' },
            { min: 1, max: 2000, message: '长度在 1 到 2000 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    async created() {
      this.doSearch();
      var groupAreasRes = await AreaService.doSearchCitysByGroupId(cacheCookies.getGroupId());
      groupAreasRes.data.forEach(function (groupArea) {
        groupArea.checked = false;
      });
      this.groupAreas = groupAreasRes.data;
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
      },
      handleSuccess(response, file, fileList){
        if(response && response.absolute) {
          file.url = response.absolute;
          this.fileList = fileList;
        }
      },
      handleBeforeUpload(file) {
        if(file.name.indexOf(".wav")==-1) {
          this.$message.warning("请上传wav格式的音频文件");
          return false;
        }
      },
      async doSearch() {
        var res = await CommonParamService.doSearch(cacheCookies.getGroupId(), "rank_voice_setting");
        this.loadingText = '暂无音频信息';
        if (res.status != 1 || !res.data) {
          return
        }
        this.totalCount = res.total;
        res.data.forEach(function (mediaSetting) {
          mediaSetting.model = JSON.parse(mediaSetting.value);
          mediaSetting.url = mediaSetting.model.url;
          var areasLabel = "";
          mediaSetting.model.areas.forEach(function (area) {
            areasLabel+=area.name+"、";
          })
          if(areasLabel.length>0) {
            mediaSetting.areasLabel = areasLabel.substr(0, areasLabel.length-1);
          }

        });
        this.voices = res.data;
      },
      handleCurrentChange() {

      },
      cleanForm() {
        this.form = {};
        this.groupAreas.forEach(function (groupArea) {
          groupArea.checked = false;
        });
      },

      async doDelete(e){
        var res = await CommonParamService.doDelete(e.id);
        if(res.status === 1){
          this.doSearch();
        }
      },
      doConfirm() {
        if(this.fileList.length<1){
          this.$notify({
            title: '错误',
            message: '未上传音频文件！',
            type: 'warning',
            offset: 100
          });
          return false;
        }
        var that = this;
        this.$refs["voiceSetting"].validate((valid) => {
          if (valid) {
            that.doAU();
          } else {
            that.$notify({
              title: '错误',
              message: '输入项未按规则输入！',
              type: 'warning',
              offset: 100
            });
            return false;
          }
        });
      },
      async doAU() {
        var checkedAreas = [];
        this.groupAreas.forEach(function (area) {
          if(area.checked) {
            checkedAreas.push(area);
          }
        });

        if( this.groupAreas.length>0&&checkedAreas.length<1){
          this.$notify({
            title: '错误',
            message: '未选择选择地区！',
            type: 'warning',
            offset: 100
          });
          return false;
        }
        this.voices=[];
        var that = this;
        //组装新value
        this.fileList.forEach(function (file) {
          console.log(file);
          that.voices.push({description:that.form.description, url:file.url});
        });

        var url = "";
        this.voices.forEach(function (voice) {
          url += voice.url + ",";
        });
        if(url) {
          url = url.substr(0, url.length-1);
        }

        var name = "";
        if(this.form.id) {
          name = this.form.description;
        } else {
          name = "rank_voice_setting"+new Date().getTime();
        }
        var value = JSON.stringify({url:url, areas:checkedAreas, moduleId:"rank_voice_setting",description:this.form.description});
        var model = {value:value,description:this.form.description,type:999,modelId:cacheCookies.getGroupId(), moduleId:"rank_voice_setting",groupId:cacheCookies.getGroupId(),name:name}
        console.log(model);
        await CommonParamService.doAU(model);
        await CustomerRankService.doPushMedia(value);
        //将上传得文件清空
        this.fileList=[]
        this.$message.success("推送成功！");
        this.form={};
        this.doSearch();
      }
    }
  }
</script>
