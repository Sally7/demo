<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <el-form :model="model" :rules="rules" ref="modelForm" label-width="80px" class="form-content">
          <el-row>
            <el-col :span="10">
              <el-form-item label="机构分类" prop="groupCategoryIds" >
                <el-cascader
                        size="small"
                        style="width: 100%"
                        v-model="model.pids"
                        :props="{ value: 'id',label:'name',children:'nodes', emitPath:'false', checkStrictly: true}"
                        :options="groupCategorys"
                        filterable
                        ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="分类名称" prop="title" >
                <el-input v-model="model.name" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="footer">
          <el-button size="small" type="primary" @click="doAU()" :loading="doAUing">保存</el-button>
        </div>
        <!--右侧栏结束-->
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import GroupService from '@/api/GroupService'

  export default {
    data() {
      return {
        model:{id:this.$route.query.id,pids:[]},
        groupCategorys:[],
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'change' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字', trigger: 'change' }
          ]
        },
        doAUing:false,
      }
    },
    components: {
      Breadcrumb
    },
    async created(){
      var that = this;
      this.groupCategorys = await GroupService.doSearchGroupCategoryTree();

      var id = this.$route.query.id;
      if(id){
        var groupCategoryRes = await GroupService.doGetGroupCategory(id);
        this.model = groupCategoryRes;

        that.model.pids = [this.model.pid];
      }
    },
    methods: {
      doCancel() {
        this.$router.back();
      },
      async doAU() {
        var that = this;
        this.doAUing = true;
        this.$refs.modelForm.validate(async (valid) => {
          if(!valid) {
            that.$message({
              showClose: true,
              message: "请检查信息表单",
              type: 'warning'
            });
            that.doAUing = false;
            return;
          }
          that.model.pid = that.model.pids[0];

          var groupCategoryRes = null;
          if(that.model.id) {
            groupCategoryRes = await GroupService.doUpdateGroupCategory(that.model);
          } else {
            groupCategoryRes = await GroupService.doAddGroupCategory(that.model);
          }
          console.log('groupCategoryRes：',groupCategoryRes);
          if(groupCategoryRes){//保存后响应数据中不含data也不含ID，这段代码是否保留待确认
            that.model.id = groupCategoryRes.data.id;
          }
          that.$message({
            showClose: true,
            message: "保存成功",
            type: 'success'
          });
          that.doAUing = false;
        });
      },
      resetForm(formName) { //重置验证
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
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
