<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <el-menu default-active="cooperation" class="breadcrumb-container" mode="horizontal" active-text-color="#4494E7" @select="handleMenuSelect">
        <el-menu-item index="cooperation">商家入驻</el-menu-item>
        <el-menu-item index="joinIn">代理商入驻</el-menu-item>
      </el-menu>
    </div>
    <div class="app__content">
      <el-table :empty-text="loadingText"
                :data="applicationList"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
          align="center"
          prop="userName"
          label="姓名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          align="center"
          prop="groupAddress"
          label="店铺所在城市">
        </el-table-column>
        <el-table-column
          align="center"
          prop="cooperationIntention"
          label="合作意向">
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="applicationList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="applicationList.length>0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import DynamicFormService from '@/api/DynamicFormService'
  export default {
    data() {
      return {
        applicationList:[],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        moduleId:'cooperation',
        modelId:cacheCookies.getGroupId()
      }
    },
    created(){
      console.log(cacheCookies.getGroupId());
      this.doPageDynamicFormItemValueRelations();
    },
    methods: {
      handleMenuSelect(key, keyPath){
        this.moduleId = key;
        this.doPageDynamicFormItemValueRelations();
      },
      async doPageDynamicFormItemValueRelations() {
        this.applicationList = [];
        var that = this;
        var res = await DynamicFormService.doPageDynamicFormItemValueRelations(this.moduleId,this.modelId,this.currentPage,this.pageSize);
        res.data.forEach(function (dynamicFormItem) {
          var object = {};
          dynamicFormItem.dynamicFormItemValueRelations.forEach(function (relation) {
            object[relation.dfkey] = relation.value;
          })
          that.applicationList.push(object);
        });
        this.loadingText = '暂无数据';
        this.totalCount = res.total;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageDynamicFormItemValueRelations();
      },
    }
  }
</script>
<style scoped>

</style>
