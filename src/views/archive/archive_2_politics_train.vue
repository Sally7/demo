<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">教育培训
      <el-button type="text" @click="toAU()" style="margin-right: 20px">+添加培训</el-button>
    </div>
    <div class="app__content">
      <div>
        <el-row class="mb15">
          <el-col :span="20">
            <el-dropdown @command="toMarketingSceneAU">
              <el-button type="primary" size="mini">
                +政治教育
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" v-for="marketingSceneType in addMarketingSceneTypes" :key="marketingSceneType.value" :command="marketingSceneType.value" v-if="marketingSceneType.show">
                  {{marketingSceneType.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-input v-if="false"
                      :size="mini"
                      placeholder="请输入搜索内容"
                      v-model.lazy="queryString"
                      @input="querySearchAsync"
                      clearable>
            </el-input>
          </el-col>
        </el-row>
        <el-table class="mb15"
                  :empty-text="loadingText"
                  :data="marketingSceneList"
                  :header-row-style="tableHeaderClass"
                  style="width: 100%">
          <el-table-column
            prop="title"
            label="培训内容">
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
              <el-button type="text" size="small" @click="toMarketingSceneAU(marketingSceneList[scope.$index].marketingSceneType, marketingSceneList[scope.$index].id)">编辑</el-button>
              <el-popover
                ref="popover"
                placement="top"
                width="200"
                v-model="scope.row.visible">
                <p>确定删除{{marketingSceneList[scope.$index].title}}吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="doDelete(marketingSceneList[scope.$index].id),scope.row.visible = false">确定</el-button>
                </div>
              </el-popover>
              <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="counts-wrap mb15" v-if="marketingSceneList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
        <el-pagination class="text-right"
                       background
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="totalCount"
                       :current-page="currentPage"
                       @current-change="handleCurrentChange"
                       v-if="marketingSceneList.length>0">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import ConfigUtil from '@/utils/ConfigUtil'
  import MarketingSceneService from '@/api/MarketingSceneService'
  import QRCodeService from "@/api/QRCodeService"
  export default {
    data() {
      return {
        addMarketingSceneTypes:MarketingSceneService.getMarketingSceneTypes(),
        marketingSceneTypes:MarketingSceneService.getMarketingSceneTypes(),
        marketingSceneList:[],
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
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      this.doPageMarketingScene();
    },
    filters:{
      getMarketingSceneTypeName(value) {
        var name = "";
        MarketingSceneService.getMarketingSceneTypes().forEach(function (item) {
          if(item.value == value) {
            name =  item.text;
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
        this.marketingSceneList=[];
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
          this.marketingSceneList = response.data;
          this.marketingSceneList.forEach(function (marketingScene) {
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
        this.marketingSceneList = [];
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
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
