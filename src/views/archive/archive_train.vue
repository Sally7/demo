<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">政策管理
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建培训</el-button>
      </el-row>
      <div class="search-box">
        <el-form :inline="true">
          <el-form-item label="培训名称">
            <el-input v-model="sm.title" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button plain size="small">导出</el-button>
            <el-button type="text">查看已导出的列表</el-button>
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
          prop="title"
          label="培训主题">
        </el-table-column>
        <el-table-column
          align="center"
          prop="validDate"
          label="培训时间">
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toMarketingSceneAU(pageList[scope.$index].marketingSceneType, pageList[scope.$index].id)">编辑</el-button>
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
            <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
            <el-button class="ml10" type="text" size="small" v-popover:popover>参与人员</el-button>
            <el-button class="ml10" type="text" size="small" v-popover:popover>查看成绩</el-button>
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
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import ConfigUtil from '@/utils/ConfigUtil'
  import MarketingSceneService from '@/api/MarketingSceneService'
  import QRCodeService from "@/api/QRCodeService"
  import multiselect from '@/mixins/multiselect';
  import RecordSelected from '@/components/RecordSelected/index.vue';

  export default {
    data() {
      return {
        sm:{},
        pageList:[],
        status:[
          {text:"进行中", value:1},
          {text:"已结束", value:-1}
        ],
        activeName: 'all',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        mini: 'mini',
        queryString:'',
        loadingText:'正在加载,请稍后...',
        timeOut:null,
        tranmap:{key:'id',label:'name',desc:'desc'},
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    components: {
      RecordSelected,
    },
    mixins: [multiselect],
    created() {
      this.doPageMarketingScene();
    },
    filters:{
      getMarketingSceneTypeName(value) {
        var name = "";
        MarketingSceneService.getMarketingSceneTypes().forEach(function (item) {
          if(item.value == value) {
            name = item.text;
          }
        });
        return name;
      },
      getMarketingSceneStatusName(value) {
        switch (value) {
          case 1:
            return "进行中";
          case 2:
            return "已结束";
        }
      }
    },
    methods: {
      async doPageMarketingScene(status){// 查询营销场景列表
        this.pageList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var response = await MarketingSceneService.doPage({
          groupId:cacheCookies.getGroupId(),
          status:status,
          page:this.currentPage,
          count:this.pageSize});
        if(response.status === 1 && response.data && response.data.length>0) {
          this.totalCount = response.total;
          this.pageList = response.data;
          this.pageList.forEach(function (marketingScene) {
            if (marketingScene.startDate == 0) {
              marketingScene.validDate = "永久有效";
            } else {
              marketingScene.validDate = TimeUtils.formatTime(marketingScene.startDate, 'Y-M-D H:m:s') +"至" + TimeUtils.formatTime(marketingScene.endDate, 'Y-M-D H:m:s');
            }
          })
        } else {
          this.loadingText ="暂无数据";
        }
      },
      handleMarketingSceneTypeFilter(value, row) { //点击filter的方法
        return row.marketingSceneType === value;
      },
      handleStatusFilter(value, row) { //点击filter的方法
        return row.marketingSceneType === value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageMarketingScene();
      },
      querySearchAsync() { //搜索的方法
        console.log("搜索到的关键字:"+this.queryString);
        this.queryString = this.queryString.toLowerCase();
        this.pageList = [];
        if(this.queryString.length>0){
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
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
        if(marketingSceneType == 4){
          url = '/marketing/marketingscene/marketingscene_homepage_au';
        }else{
          url = "/marketing/marketingscene/marketingscene_au?marketingSceneType="+marketingSceneType;
          if(typeof marketingSceneId != "object") {
            url = url + "&id=" + marketingSceneId;
          }
        }
        this.$router.push(url);
      },
      async doDownloadQRCode(marketingScene) { //下载二维码
        var res = await QRCodeService.doCreateQRCode(19, marketingScene.id, marketingScene.groupId);
        console.log(res.data.relURL);
        window.location.href = process.env.BASE_API +  "/qrcode_doDownLoadQRCode.do?id="+res.data.id;

      },
      doCreateSubQRCode(marketingSceneId) { //生成字码
        console.log('生成字码');
      },
      async doDelete(marketingSceneId) { //删除场景营销
        var response = await MarketingSceneService.doDelete(marketingSceneId);
        if(response.status === 1){
          this.doPageMarketingScene();
        }
      },
      toAU(){
        var url = '/archive/archive_train/train_au';
        this.$router.push(url);
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
