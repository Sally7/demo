<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <el-button type="primary" v-if="false" @click="userAUDialogVisible = true;cleanForm();doSearch()" style="margin-bottom: 20px">+添加页面</el-button>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="users"
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
          prop="createDate">
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createDate">
        </el-table-column>
        <el-table-column
          align="center"
          label="类型"
          prop="type"
        >
        </el-table-column>
        <el-table-column v-if = false
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
              <p>确定删除 {{scope.row.name}}吗？</p>
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
  </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import Breadcrumb from '@/components/Breadcrumb'
  import TimeUtils from '@/utils/TimeUtil'

  export default{
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount:0,
        currentPage:1,
        pageSize:20,

      }
    },
    components: {
      Breadcrumb
    },
    async created() {
      if(this.$route.query.groupId){//处理修改逻辑
        this.groupId = this.$route.query.groupId;
      }

      this.doSearch();
    },
    methods:{
      async doSearch() {

      },
      handleCurrentChange(){

      },
      async doDelete(e){

        if(res.status === 1){
          this.doSearch();
        }
      }
    }
  }
</script>
