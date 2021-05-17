<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">参与人员
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toUserSelect()">报名</el-button>
      </el-row>
      <div class="search-box">
        <el-form :inline="true">
          <el-form-item label="人员姓名">
            <el-input v-model="sm.jionUserName" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button plain size="small">导出花名册</el-button>
            <el-button plain size="small">导出成绩表</el-button>
            <el-button type="text" v-if="false">查看已导出的列表</el-button>
            <el-button type="text" @click="currentPage=1;doReset()">重置筛选条件</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="pageList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            align="left"
            label="序号"
            type="index">
        </el-table-column>
        <el-table-column
            align="center"
            label="姓名"
            prop="name">
        </el-table-column>
        <el-table-column
            align="center"
            label="性别"
            prop="sex">
        </el-table-column>
        <el-table-column
            align="center"
            label="民族"
            prop="nation">
        </el-table-column>
        <el-table-column
            align="center"
            label="学历"
            prop="education">
        </el-table-column>
        <el-table-column
            align="center"
            label="政治面貌"
            prop="politicalIdentity">
        </el-table-column>
        <el-table-column
            align="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-popover
                ref="popover"
                placement="top"
                width="200"
                v-model="scope.row.visible">
              <p>确定删除{{pageList[scope.$index].title}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(pageList[scope.$index].id),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>移除</el-button>
            <!--<el-button class="ml10" type="text" size="small" v-popover:popover>查看成绩</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="pageList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="pageList.length>0">
      </el-pagination>
    </div>
    <user-select ref="userSelect" @jioned='doPage' :marketingSceneId='marketingSceneId' :archiveType="achiveType"></user-select>
  </div>
</template>

<script>
  import MarketingSceneService from '@/api/MarketingSceneService';
  import UserSelect from '@/components/UserSelect/index';
  import cacheCookies from '@/utils/auth';
  import GroupService from '@/api/GroupService';
  import ConfigUtil from '@/utils/ConfigUtil';

  export default {
    components: {UserSelect},
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {page: 1, count: 20, marketingSceneId: this.$route.query.marketingSceneId},
        totalCount: 0,
        pageList: [],
        pageSize: 20,
        currentPage: 1,
        achiveType: '1',
        marketingSceneId: this.$route.query.marketingSceneId || '',
      };
    },
    async created() {

      this.doPage();
      console.log('marketingSceneId:', this.marketingSceneId);
    },
    methods: {
      init() {

      },
      handleCurrentChange(page) { //点击分页的组件
        this.sm.page = page;
        this.doPage();
      },
      doReset() {
        console.log('doReset');
        this.sm = {};
        this.doPage();
      },
      async doPage() {
        var res = await MarketingSceneService.doPageJionUsers(this.sm);
        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;
        var joinUsers = [];
        res.data.forEach(function(joinUser) {
          joinUsers.push(joinUser.jionUser);
        });
        this.pageList = joinUsers;

        if (this.pageList.length == 0) {
          this.loadingText = '暂无参与人信息';
        }
      },
      doExport() {

      },
      toAU(id) {
        var url = '/equipment/equipment_list/equipment_au';
        if (id) {
          url += '?id=' + id;
        }
        this.$router.push(url);
      },
      toReceive() {
        var url = '/equipment/equipment_list/warehouse_receive';
        this.$router.push(url);
      },
      toSend() {
        var url = '/equipment/equipment_list/warehouse_send';
        this.$router.push(url);
      },
      handleSelectionChange() {

      },
      goodsCategorySelect() {

      },
      toUserSelect() {
        this.$refs.userSelect.open();
      },

      /**
       * 移除报名用户
       */
      async doDelete(joinUserId) {
        if (this.marketingSceneId && joinUserId){
          let res = await MarketingSceneService.doDeleteJoinUser(this.marketingSceneId, joinUserId);
          if(res.status==1){
            this.$message({
              showClose: true,
              message: '移除成功',
              type: 'success',
            });
            this.doPage();
          }
        }else {
          this.$message({
            showClose: true,
            message: '参数有误，请联系管理员',
            type: 'error',
          });
        }
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
