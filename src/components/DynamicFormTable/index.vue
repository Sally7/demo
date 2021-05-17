<template>
  <el-row>
    <el-row>
      <!--<p class="form-title">{{dyform.title}}<el-button type="text" style="position: absolute;right: 10px;"  @click="formShow=true;itemsReady++" :disabled="!modelId">+添加</el-button></p>-->
      <p class="form-title">{{dyform.title}}<el-button v-if="isDetail" type="text" style="position: absolute;right: 10px;"  @click="formShow=true;itemsReady++;keyId=null;isEdit=false">+添加</el-button></p>
    </el-row>
    <el-row style="border:1px solid #409EFF;padding: 20px 0px;margin-bottom: 20px" v-if="formShow">
      <div style="margin-top: 20px;text-align: left;padding-right: 5px">

        <dynamic-form-for-archive @auCallback="auCallback" :items="rows"
                                  :itemsReady="itemsReady" :moduleId="dyform.moduleId" :isEdit="isEdit"
                                  :keyId="keyId"  :modelId="modelId" :ref="dyform.moduleId">
        </dynamic-form-for-archive>

        <div style="margin-top: 20px;text-align: center;">
          <el-button type="primary" @click="doAU()" :loading="doAUing" :disabled="doAUing">保存</el-button>
          <el-button @click="formShow=false">取消</el-button>
        </div>
      </div>
    </el-row>
    <el-row>
      <el-table class="mb15"
                size="small"
                :data="dataList"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
            v-for="(row,index) in rows"
            :key="index"
            :prop="row.dfkey"
            :label="row.label"
        >
        </el-table-column>

        <el-table-column label="经营范围" prop="busi_scope" class="over-flow"                                      >
                      <template slot-scope="scope">
                          <p class="over-flow">{{scope.row.busi_scope}}</p>
                          <el-button type="text" @click="getMore()">加载更多</el-button>
                          <el-dialog :visible.sync="getMoreStatus" width="30%" :append-to-body="true" top="30vh">
                                {{scope.row.busi_scope}}
                          </el-dialog>
                      </template>
        </el-table-column>

        <el-table-column
            fixed="right"
            label="操作"
        >
          <template slot-scope="scope">
            <el-button class="ml10" type="text" size="small"  @click="deEdit(scope.row)" slot="reference">编辑</el-button>

            <el-button  size="mini" class="ml10" type="text" @click="toDel(scope.row)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

    </el-row>
  </el-row>
</template>

<script>
import cacheCookies from '@/utils/auth'
import DynamicFormService from '@/api/DynamicFormService'
import DynamicFormForArchive from '@/components/DynamicFormForArchive/index'

export default {
  name:"DynamicFormTable",
  components:{DynamicFormForArchive},
  props: {
    dyform:Object,
    moduleId: {
      type: String
    },
    modelId:{
      type: String
    },
    isDetail:{
      type:Boolean
    }
  },
  data() {
    return {
      doAUing:false,
      rows:[],
      formShow:false,
      itemsReady:0,
      tableHeaderClass: {background: '#f0f0f0'},
      currentPage:1,
      pageSize:30,
      dataList:[],
      items:null,
      keyId:null,
      isEdit:true,
      getMoreStatus:false,
      status:false
    }
  },
  watch:{
    modelId:function (newValue) {
      console.log("DynamicFormTable->watch modelId", newValue);
      this.doSearchValueRelationsForTable();
    }
  },
  async created() {
    this.form = this.dyform;
    this.rows = await DynamicFormService.doSearchDynamicformItems(this.dyform.moduleId, this.modelId, true, this.dyform.id);
    // console.log(111111111111,JSON.stringify(this.rows.length));
    this.doSearchValueRelationsForTable();
    this.filter();
      // this.ifStatus();
    this.itemsReady = 1;

  },
  methods: {
     ifStatus() {
        if (busi_scope !== null) {
            this.ifStatus = true
        }
     },
    filter(){ this.rows = this.rows.filter(function(item,index,arr){
        return (item.label !== "经营范围"); }) },
    getMore() {
        this.getMoreStatus = true;
    },
    async toDel(row) {
      var that = this;
      console.log(`删除行`,row);
      this.$confirm('确认删除么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var delRes = await DynamicFormService.doDeleteDynamicFormItemValueRelations(this.modelId, row.keyId);
        if(delRes.status == 1) {
          that.$message({
            showClose: true,
            message: "删除成功",
            type: 'success'
          });
          await that.doSearchValueRelationsForTable();
        } else {
          that.$message({
            showClose: true,
            message: "删除失败",
            type: 'error'
          });
        }
      }).catch(() => {

      });
    },
    deEdit(row){
      this.isEdit = true
      this.keyId = row.keyId
      this.formShow = true;
    },
    async auCallback() {
      this.formShow = false;
      this.doAUing = false;
      this.$refs[this.dyform.moduleId].resetFields();
      await this.doSearchValueRelationsForTable();
    },
    doAU(){
      var that = this;
      this.$refs[that.dyform.moduleId].checkForm((valid) => {
        if(valid) {
          if(!this.modelId){
            that.$message({
              showClose: true,
              message: "请先填写并保存基本信息",
              type: 'error'
            });
            window,scrollTo(0,0)
          }else{
            this.$refs[that.dyform.moduleId].doAUDynamicFormItemValueRelations(this.modelId);
          }

        } else {
          that.$message({
            showClose: true,
            message: "请检查"+that.dyform.title+"是否填写有误",
            type: 'warning'
          });
        }
      });
    },
    async doSearchValueRelationsForTable() {
      this.dataList = await DynamicFormService.doSearchValueRelationsForTable(this.dyform.moduleId, this.modelId, this.rows);
      console.log(this.dataList);
    },
    genPrintData() {
      return {rows:this.rows, data:this.dataList};
    }
  }
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
.el-form-item {
  margin-bottom: 14px;
}
.over-flow{
  display: -webkit-box;
  -webkit-line-clamp:5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
