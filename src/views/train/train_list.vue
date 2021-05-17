<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">{{title}}
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <!--<el-button type="primary" size="small" @click="toAU()" v-if="groupId == treadingAreaId">新建培训</el-button>-->
        <el-button type="primary" size="small" @click="toAU()">新建政策</el-button>
      </el-row>
      <div class="search-box">
        <el-form :inline="true">
          <el-form-item label="政策主题">
            <el-input v-model="sm.title" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="sm.page=1;doPageMarketingScene()">搜索</el-button>
            <el-button plain size="small">导出</el-button>
            <el-button type="text">查看已导出的列表</el-button>
            <el-button type="text" @click="sm.page=1;doReset()">重置筛选条件</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px; ">
        <el-col :span="8" class="text-left" style="padding-left: 10px">
          <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
          <el-button plain size="small" style="margin-left: 10px">删除</el-button>
          <el-button plain size="small" @click="toBatch()">批量设置</el-button>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="sm.count"
                         :total="totalCount"
                         :current-page="sm.page"
                         @current-change="handleCurrentChange"
                         v-if="pageList.length>0">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                ref="table"
                :data="pageList"
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="title"
            label="政策主题">
        </el-table-column>
        <el-table-column
            align="center"
            prop="validDate"
            label="有效时间">
        </el-table-column>
        <el-table-column
            align="center"
            prop="description"
            label="政策简述">
        </el-table-column>
        <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="shortDesc"-->
        <!--label="参与情况(实到/应到)">-->
        <!--</el-table-column>-->
        <el-table-column
            align="right"
            label="操作"
            width="290">
          <template slot-scope="scope">
            <!--<el-button v-if="gr" type="text" size="small" @click="toMarketingSceneAU(pageList[scope.$index].marketingSceneType, pageList[scope.$index].id)">编辑</el-button>-->
            <!--<el-button type="text" size="small" @click="toMarketingSceneAU(pageList[scope.$index].marketingSceneType, pageList[scope.$index].id)">编辑</el-button>-->
            <el-popover
                ref="popover"
                placement="top"
                width="290"
                v-model="scope.row.visible">
              <p>确定删除{{pageList[scope.$index].title}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(pageList[scope.$index].id),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
            <el-button class="ml10" type="text" size="small" @click="toAU(pageList[scope.$index].id)">编辑</el-button>
            <el-button class="ml10" type="text" size="small">设置政策条件</el-button>
            <el-button class="ml10" type="text" size="small">查看对口企业</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="pageList.length>0">共{{totalCount}}条数据，每页显示{{sm.count}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="sm.count"
                     :total="totalCount"
                     :current-page="sm.page"
                     @current-change="handleCurrentChange"
                     v-if="pageList.length>0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth';
  import TimeUtils from '@/utils/TimeUtil';
  import ConfigUtil from '@/utils/ConfigUtil';
  import MarketingSceneService from '@/api/MarketingSceneService';
  import QRCodeService from '@/api/QRCodeService';
  import multiselect from '@/mixins/multiselect';
  import RecordSelected from '@/components/RecordSelected/index.vue';

  export default {
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        treadingAreaId: ConfigUtil.getTradingAreaId(),
        title: '',
        sm: {page: 1, count: 20, dateType: 1},
        pageList: [],
        status: [
          {text: '进行中', value: 1},
          {text: '已结束', value: -1},
        ],
        activeName: 'all',
        totalCount: 0,//总的数据页数
        mini: 'mini',
        queryString: '',
        loadingText: '正在加载,请稍后...',
        timeOut: null,
        tableHeaderClass: {background: '#f0f0f0'},
        trainType: 0,
        isTAuth: false,
        selectedIds: [],
        tranmap: {key: 'id', label: 'title', desc: 'desc'},
      };
    },
    components: {
      RecordSelected,
    },
    mixins: [multiselect],
    watch: {
      // 如果路由发生变化，再次执行该方法
      '$route': 'init',
    },
    created() {
      if (cacheCookies.getGroupId() == ConfigUtil.getTradingAreaId()) {
        this.isTAuth = true;
      }
      this.init();
    },
    filters: {
      getMarketingSceneTypeName(value) {
        var name = '';
        MarketingSceneService.getMarketingSceneTypes().forEach(function(item) {
          if (item.value == value) {
            name = item.text;
          }
        });
        return name;
      },
      getMarketingSceneStatusName(value) {
        switch (value) {
          case 1:
            return '进行中';
          case 2:
            return '已结束';
        }
      },
    },
    methods: {
      init() {
        var that = this;
        console.log(this.$route.name);
        var pathArr = this.$route.name.split('_');
        this.trainType = pathArr[pathArr.length - 1];
        this.sm.marketingSceneType = this.trainType;
        console.log(this.$route.name);
        switch (+this.trainType) {
          case 1017:
            that.title = '军事训练';
            break;
          case 1018:
            that.title = '政策管理';
            break;
          case 2000:
            that.title = '政治教育';
            break;
        }
        this.doPageMarketingScene();
      },
      async doPageMarketingScene() {// 查询营销场景列表
        this.pageList = [];
        if (this.queryString.length > 0) {
          this.loadingText = '正在搜索,请稍后...';
        } else {
          this.loadingText = '正在加载,请稍后...';
        }
        var response = await MarketingSceneService.doPage(this.sm);
        if (response.status === 1 && response.data && response.data.length > 0) {
          this.totalCount = response.total;
          this.tableData = this.pageList = response.data;
          this.$nextTick(() => {
            this.mixinSetSelectRow();
          });
          this.pageList.forEach(function(marketingScene) {
            if (marketingScene.startDate == 0) {
              marketingScene.validDate = '待定';
            } else {
              marketingScene.validDate = TimeUtils.formatTime(marketingScene.startDate, 'Y-M-D H:m:s') + '至' + TimeUtils.formatTime(marketingScene.endDate, 'Y-M-D H:m:s');
            }
          });
        } else {
          this.loadingText = '暂无数据';
        }
      },
      handleMarketingSceneTypeFilter(value, row) { //点击filter的方法
        return row.marketingSceneType === value;
      },
      handleStatusFilter(value, row) { //点击filter的方法
        return row.marketingSceneType === value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.mixinCurrentChange();
        this.sm.page = page;
        this.doPageMarketingScene();
        this.mixinSetSelectRow();
      },
      handleSelectionChange(rows) {
        var that = this;
        that.selectedIds = [];
        rows.forEach(function(item) {
          that.selectedIds.push(item.id);
        });
        this.mixinHandleSelectionChange(rows);
      },
      querySearchAsync() { //搜索的方法
        console.log('搜索到的关键字:' + this.queryString);
        this.queryString = this.queryString.toLowerCase();
        this.pageList = [];
        if (this.queryString.length > 0) {
          this.loadingText = '正在搜索,请稍后...';
        } else {
          this.loadingText = '正在加载,请稍后...';
        }
        if (this.timeOut) {
          clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => {
          //this.doPageMarketingScene(this.getStatusByActiveName());
        }, 1000);
      },
      toMarketingSceneAU(marketingSceneType, marketingSceneId) {//新建或者编辑场景营销
        var url = '';
        if (marketingSceneType == 4) {
          url = '/marketing/marketingscene/marketingscene_homepage_au';
        } else {
          url = '/marketing/marketingscene/marketingscene_au?marketingSceneType=' + marketingSceneType;
          if (typeof marketingSceneId != 'object') {
            url = url + '&id=' + marketingSceneId;
          }
        }
        this.$router.push(url);
      },
      async doDownloadQRCode(marketingScene) { //下载二维码
        var res = await QRCodeService.doCreateQRCode(19, marketingScene.id, marketingScene.groupId);
        console.log(res.data.relURL);
        window.location.href = process.env.BASE_API + '/qrcode_doDownLoadQRCode.do?id=' + res.data.id;

      },
      doCreateSubQRCode(marketingSceneId) { //生成字码
        console.log('生成字码');
      },
      async doDelete(marketingSceneId) { //删除场景营销
        var response = await MarketingSceneService.doDelete(marketingSceneId);
        if (response.status === 1) {
          this.doPageMarketingScene();
        }
      },
      toJoinUsers(marketingSceneId) {
        var auUrl = '';
        switch (+this.trainType) {
          case 1017:
            auUrl = '/archive/train_list_1017/train_users';
            break;
          case 1018:
            auUrl = '/archive/archive_train_1018/train_users';
            break;
          case 2000:
            auUrl = '/archive/train_list_2000/train_users';
            break;
        }
        this.$router.push(auUrl + '?marketingSceneId=' + marketingSceneId + '&trainType=' + this.trainType);
      },
      /**
       * 新建培训
       * @param id
       */
      toAU(id) {
        var url = '/archive/archive_train/train_au_1018';
        if (this.sm.marketingSceneType) {
          url += '?marketingSceneType=' + this.sm.marketingSceneType;
        }
        if (id) {
          url += '&id=' + id;
        }

        this.$router.push(url);
      },
      /**
       * 查看参加某培训所有人员的成绩单
       * @param id
       */
      toSeeScore(id) {
        var url = 'archive_train_' + this.sm.marketingSceneType + '/train_score';
        if (id) {
          url += '?marketingSceneId=' + id;
          this.$router.push(url);
        }
        return;
      },
      toImportScore(id, type, title) {
        var url = 'archive_train/score_import?';
        if (id && type) {
          url += 'marketingSceneId=' + id;
          url += '&marketingSceneType=' + type;
          url += '&title=' + title;
          this.$router.push(url);
        }
        return;
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
