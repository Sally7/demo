<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">老客管理</div>
    <div class="app__content">
      <el-button type="primary" @click="dialogVisible = true">+添加客户</el-button>
      <el-button @click="doImportCarBrand">批量导入</el-button>
      <el-table :empty-text="loadingText"
                :data="customerList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 50px;">
        <el-table-column
          prop="plateNumber"
          label="车牌">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doEditPlateNumber(customerList[scope.$index])">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="customerList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="customerList.length>0">
      </el-pagination>
    </div>
    <el-dialog
      title="添加客户"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="车牌" prop="plateNumber">
          <el-input placeholder="请输入车牌号" v-model="ruleForm.plateNumber" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAU('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import CarService from '@/api/CarService'
  export default{
    data() {
      var plateNumberValidation = (rule, value, callback) => { //自定义有效时间的验证
        var myreg=/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;
        if (!myreg.test(value)) {
          callback('请输入正确车牌号');
        }else{
          callback();
        }
      };
      return {
        tableHeaderClass: {background: '#f0f0f0'},
        loadingText:'正在加载,请稍后...',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        dialogVisible:false,
        ruleForm:{},
        customerList:[],
        rules: {
          plateNumber:[{required: true, validator: plateNumberValidation, trigger: 'blur'}],
        }
      }
    },
    created(){
      this.doPageGroupPlateNumber();
    },
    methods:{
      doAU(formName){ //表单的确定按钮
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('表单验证通过...');
            console.log(this.ruleForm);
            this.dialogVisible = false;
            this.doAddOrUpdateGroupPlateNumber();
          }
        })
      },
      doEditPlateNumber(plate) { //编辑车牌信息
        this.dialogVisible = true;
        this.ruleForm = plate;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageGroupPlateNumber();
      },
      doImportCarBrand() {
        this.$router.push("/group/regular_customer_manager/carBrand_import");
      },
      async doPageGroupPlateNumber(){ //查询车牌信息
        var res = await CarService.doPageGroupPlateNumber(cacheCookies.getGroupId(),this.currentPage,this.pageSize);
        this.customerList = res.status==1 ? res.data : [];
        this.totalCount = res.total;
        this.loadingText = '暂无数据';
      },
      async doAddOrUpdateGroupPlateNumber() { // 增加或者修改车牌
        var res = await CarService.doAddOrUpdateGroupPlateNumber(this.ruleForm.id,this.ruleForm.plateNumber);
        this.doPageGroupPlateNumber();
      }
    }
  }
</script>
