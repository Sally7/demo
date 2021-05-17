<style>
</style>
<template>
    <div class="app-container" id="wrapper">
        <div class="module-title">视频配置</div>
        <div class="app__content">
            <el-button type="primary" @click="vedioSettingAUDialogVisible = true;cleanForm()" style="margin-bottom: 20px">+添加视频配置</el-button>
            <el-table class="mb15"
                      :empty-text="loadingText"
                      :data="mediaSettingList"
                      :header-row-style="tableHeaderClass"
                      style="width: 100%">
                <el-table-column
                  align="center"
                  label="序号"
                  type="index">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="名称"
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
                        <el-button type="text" size="small" @click="toUpdate(scope.row)">编辑</el-button>
                        <el-popover
                                ref="popover"
                                placement="top"
                                width="200"
                                trigger="click"
                                v-model="scope.row.visible">
                          <p>确定删除 {{scope.row.description}}吗？</p>
                          <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                              <el-button type="primary" size="mini" @click="doDelete(scope.row),scope.row.visible = false">确定</el-button>
                          </div>
                          <el-button class="ml10" type="text" size="small"  slot="reference">删除</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="视频配置" :visible.sync="vedioSettingAUDialogVisible">
          <el-form :model="form" :rules="rules" label-width="80px" ref="vedioSetting">
            <el-form-item label="配置名称" prop="description">
              <el-input v-model="form.description" autocomplete="off"  placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="链接地址" prop="url" >
              <el-input type="textarea" v-model="form.url" placeholder="多个视频地址使用英文逗号','隔开"></el-input>
            </el-form-item>
            <el-form-item label="投放地区">
                <el-checkbox v-for="area in groupAreas" v-bind:key="area.id" :label="area.name" name="type" v-model="area.checked"></el-checkbox>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="vedioSettingAUDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="vedioSettingAUDialogVisible = false;doConfirm()">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import CommonParamService from '@/api/CommonParamService'
  import AreaService from  '@/api/AreaService'
  import CustomerRankService from '@/api/CustomerRankService'
  export default{
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount:0,
        currentPage:1,
        pageSize:20,
        mediaSettingList:[],
        groupAreas:[],
        vedioSettingAUDialogVisible:false,
        form:{},
        rules:{
          description: [
            { required: true, message: '请输入配置名称', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
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
    methods:{
      async doSearch() {
        var res = await CommonParamService.doSearch(cacheCookies.getGroupId(), "rank_video_setting");
        this.loadingText = '暂无视频信息';
        if(res.status !=1) {
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
        this.mediaSettingList = res.data;
      },
      handleCurrentChange(){

      },
      cleanForm() {
        this.form = {};
        this.groupAreas.forEach(function (groupArea) {
          groupArea.checked = false;
        });

      },
      toUpdate(mediaSetting){
        var that = this;
        this.cleanForm();

        this.form = mediaSetting;

        mediaSetting.model.areas.forEach(function (area) {
          that.groupAreas.forEach(function (groupArea) {
            if(area.id == groupArea.id) {
              groupArea.checked = true;
            }
          })
        })

        this.vedioSettingAUDialogVisible = true;
      },
      async doDelete(e){
        var res = await CommonParamService.doDelete(e.id);
        if(res.status === 1){
          this.doSearch();
        }
      },
      doConfirm(){
        var that = this;
        this.$refs["vedioSetting"].validate((valid) => {
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
      async doAU(){
          var checkedAreas = [];
          this.groupAreas.forEach(function (area) {
            if(area.checked) {
              checkedAreas.push(area);
            }
          });
          var value = JSON.stringify({url:this.form.url, areas:checkedAreas, moduleId:"rank_video_setting"});
          var name = "";
          if(this.form.id) {
            name = this.form.name;
          } else {
            name = "rank_vedio_setting"+new Date().getTime();
          }
          var model = {value:value,description:this.form.description,type:999,modelId:cacheCookies.getGroupId(), moduleId:"rank_video_setting",groupId:cacheCookies.getGroupId(),name:name}
          console.log(model);
          await CommonParamService.doAU(model);
          await CustomerRankService.doPushMedia(value);

          this.$message.success("推送成功！");

          this.form={};
          this.doSearch();
      }
    }
  }
</script>
