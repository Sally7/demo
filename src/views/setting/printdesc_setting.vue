<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">追加打印配置</div>
    <div class="app__content">
      <el-button type="primary" @click="printDescSettingAUDialogVisible = true;cleanForm()" style="margin-bottom: 20px">
        +添加追加打印
      </el-button>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="printDescList"
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
    <el-dialog title="打印" :visible.sync="printDescSettingAUDialogVisible">
      <el-form :model="form" :rules="rules" label-width="80px" ref="printDescSetting">
        <el-form-item label="配置名称" prop="description">
          <el-input v-model="form.description" autocomplete="off"  placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="打印展示:" ></el-form-item>
        <el-form-item v-for="(item, index) in printValueList" :key="index">
          <el-input type="textarea" disabled="true" autosize="true"  v-model="printValueList[index]"></el-input>
          <el-button  @click="deletePrint(index)">清除</el-button>
        </el-form-item>
        <el-form-item  label="追加打印:">
          <el-input
          type="text"
          clearable="true"
          placeholder="请输入追加的打印信息"
          v-model="printValue">
            <el-button  slot="append"  type="primary" @click="addPrint(printValue)" plain>点此追加</el-button>
          </el-input >
          </el-form-item>

        <el-form-item label="投放地区">
          <el-checkbox v-for="area in groupAreas" v-bind:key="area.id" :label="area.name" name="type" v-model="area.checked"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="printDescSettingAUDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printDescSettingAUDialogVisible = false;doConfirm()">确 定</el-button>
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
        printDescList: [],
        printDesc:'',
        printValue:'',
        printValueList:[],
        printDescSettingAUDialogVisible: false,
        groupAreas:[],
        oldPrint:'',
        oldAreas:[],
        fileList:[],
        form: {},
        rules: {
          description: [
            {required: true, message: '请输入简称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
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


      async doSearch() {
        var res = await CommonParamService.doSearch(cacheCookies.getGroupId(), "rank_printdesc_setting");
        this.loadingText = '暂无打印信息';
        if (res.status != 1 || !res.data) {
          return
        }
        this.totalCount = res.total;
        var that=this;
        res.data.forEach(function (mediaSetting) {
          mediaSetting.model = JSON.parse(mediaSetting.value);
          //原有追加信息

          mediaSetting.printValueList = (mediaSetting.model.print).split(',');
          mediaSetting.model.oldPrint=mediaSetting.model.print;
          mediaSetting.model.oldAreas= mediaSetting.model.areas;
          var areasLabel = "";
          mediaSetting.model.areas.forEach(function (area) {
            areasLabel+=area.name+"、";
          })
          if(areasLabel.length>0) {
            mediaSetting.areasLabel = areasLabel.substr(0, areasLabel.length-1);
          }

        });
        this.printDescList = res.data;
      },
      handleCurrentChange() {

      },

      cleanForm() {
        this.form = {};
        this.groupAreas.forEach(function (groupArea) {
          groupArea.checked = false;
        });
        this.printValueList=[];
        this.oldAreas='';
        this.oldPrint= '';

      },
      deletePrint(index){
        console.log("deletePrint(index):"+index);
        this.printValueList.splice(index,1)
        this.printValueList.push();

      },


      async addPrint(printValue){
        console.log("pushprintValue:"+printValue);
        if(printValue==''||printValue==null){
          this.$notify({
            title: '错误',
            message: '未输入打印信息',
            type: 'warning',
            offset: 100
          });
          return;
        }

        this.printValueList.push(printValue);
        this.printValue='';
       },

      toUpdate(mediaSetting){

        var that = this;
        this.cleanForm();
        this.form = mediaSetting;
        this.printValueList=mediaSetting.printValueList;
        this.oldAreas= mediaSetting.model.oldAreas;
        this.oldPrint= mediaSetting.model.oldPrint
          mediaSetting.model.areas.forEach(function (area) {
          that.groupAreas.forEach(function (groupArea) {
            if(area.id == groupArea.id) {
              groupArea.checked = true;
            }
          })
        })

        this.printDescSettingAUDialogVisible = true;
      },

      async doDelete(e){
        var res = await CommonParamService.doDelete(e.id);
        if(res.status === 1){
          this.doSearch();
        }
      },

      doConfirm(){
        var that = this;
        this.$refs["printDescSetting"].validate((valid) => {
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
        if(checkedAreas.length<1){
          this.$notify({
            title: '失败',
            message: '未选择门店地区！',
            type: 'warning',
            offset: 100
          });
          return ;
        }
        this.printDesc='';

        var that=this;
        for(var i=0;i<this.printValueList.length;i++){
          if(that.printDesc!=''&&this.printDesc!=null){
            that.printDesc=that.printDesc+',';
          }
          console.log("printDesc"+that.printDesc);
          that.printDesc=that.printDesc+that.printValueList[i];
        }
        if(this.printDesc==''||this.printDesc==null){
          this.$notify({
            title: '失败',
            message: '未输入打印信息',
            type: 'warning',
            offset: 100
          });
          return;
        }
        //添加或者修改是 当老追加打印为空 则
        if(this)
        if(this.oldPrint==null||this.oldPrint.length<1){
          this.oldPrint=this.printDesc;
        }
        if(this.oldAreas==null||this.oldAreas.length<1){
          this.oldAreas=checkedAreas;
        }
        var value = JSON.stringify({print:this.printDesc, oldPrint:this.oldPrint,areas:checkedAreas,oldAreas:this.oldAreas, moduleId:"rank_printdesc_setting"});
        var name = "";
        if(this.form.id) {
          name = this.form.name;
        } else {
          name = "rank_printdesc_setting"+new Date().getTime();
        }
        var model = {value:value,description:this.form.description,type:1,modelId:cacheCookies.getGroupId(), moduleId:"rank_printdesc_setting",groupId:cacheCookies.getGroupId(),name:name}
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
