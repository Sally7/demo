<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">查看成绩
    </div>
    <div class="app__content">
      <div class="search-box">
        <el-form :inline="true">
          <el-form-item label="人员姓名">
            <el-input v-model="sm.userName" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <!--<el-button plain size="small">导出花名册</el-button>-->
            <el-button plain size="small" @click="exportScore">导出成绩表</el-button>
            <!--<el-button type="text" v-if="false">查看已导出的列表</el-button>-->
            <!--<el-button type="text" @click="currentPage=1;doReset()">重置筛选条件</el-button>-->
          </el-col>
        </el-row>
      </div>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="scoreInfos"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            v-if="hasScore"
            align="left"
            label="序号"
            width="50"
            type="index">
        </el-table-column>
        <el-table-column
            v-if="hasScore"
            width="100"
            align="center"
            label="姓名"
            prop="userName">
        </el-table-column>
        <el-table-column
            v-if="hasScore"
            width="200"
            align="center"
            label="身份证号"
            prop="idNo">
        </el-table-column>
        <el-table-column v-for="condition in this.conditions" :key="condition.id" :label="condition.conditionDesc">
          <template slot-scope="scope">
                        <span>{{scope.row.scoreMaps[condition.id] || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="scoreInfos.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="scoreInfos.length>0">
      </el-pagination>
    </div>
    <user-select ref="userSelect" :marketingSceneId='marketingSceneId' :archiveType="achiveType"></user-select>
  </div>
</template>

<script>
  import MarketingSceneService from '@/api/MarketingSceneService';
  import UserSelect from '@/components/UserSelect/index';
  import cacheCookies from '@/utils/auth';
  import GroupService from '@/api/GroupService';
  import ConfigUtil from '@/utils/ConfigUtil';
  import {keyvalmap} from '@/utils/index';

  export default {
    components: {UserSelect},
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {page: 1, count: 20, userName:'',marketingSceneId: this.$route.query.marketingSceneId || ''},
        totalCount: 0,
        pageSize: 20,
        currentPage: 1,
        achiveType: '1',
        marketingSceneId: this.$route.query.marketingSceneId || '',
        //该培训所关联课程
        conditions: [],
//        该培训下所有参与人员的各课程成绩信息集
        scoreInfos: [],
        hasScore: false,
        exportURL:ConfigUtil.getServerDomain()+'/marketingScene_doExportUserContentExcel.do?token=b8f987b3317b38e7fce77d62d0ad55a9&marketingSceneId='
      };
    },
    async created() {

      this.doPage();
      console.log('marketingSceneId:', this.marketingSceneId);
    },
    computed: {
      getDataName(scope, score) {
        return scope[score];
      },
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
        let res1 = await MarketingSceneService.getConditionsById(this.sm.marketingSceneId);
        let res2 = await MarketingSceneService.getAboutScore(this.sm);
        if (res2.status == 1 && res1.status == 1 && res1.data && res2.data) {
          this.conditions = res1.data.conditions;
          this.scoreInfos = res2.data;
          if (this.scoreInfos) {
            this.scoreInfos.forEach(item => {
              let scoreArr = item.content ? item.content.split('--') : [];
              let conIdArr = item.conditionId ? item.conditionId.split('--') : [];
              item.scoreMaps = keyvalmap(conIdArr, scoreArr);
            });
            this.totalCount = res2.total;
            this.hasScore = true;
          }
        } else {
          this.loadingText = '暂无数据';
          this.hasScore = false;
        }

//        this.conditions =
//        this.scoreInfos = await MarketingSceneService.getAboutScore(this.marketingSceneId);
//
//        console.log(cres);
//        console.log(sres);
//        if(res.status != 1) {
//          return
//        }
//        this.totalCount = res.total;
//        var joinUsers = [];
//        res.data.forEach(function (joinUser) {
//          joinUsers.push(joinUser.jionUser);
//        })
//        this.pageList = joinUsers;
//
//        if(this.pageList.length==0) {
//          this.loadingText = '暂无参与人信息';
//        }
      },

      getPageList() {

      },
      async exportScore() {
//        let param={marketingSceneId:this.marketingSceneId,idNo:'',userName:'',conditionDesc:''};
//        let res=await MarketingSceneService.exportScore(param);
//        console.log("导出成绩",res)
        window.location.href = this.exportURL+this.marketingSceneId;
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
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
