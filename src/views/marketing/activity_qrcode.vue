<template>
  <div class="app-container" id="wrapper">
    <div class="app__content">
      <el-tabs class="mtm10" v-model="activeName" @tab-click="handleClickPane">
        <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab,index) in ELTabPane" :key="index"></el-tab-pane>
        <div>
          <el-row class="mb15">
            <el-col :span="20"><el-button type="primary" size="mini" @click="doActivityCodeAU()">新建活动码</el-button></el-col>
            <el-col :span="4" class="text-right">
              <el-input
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
                    :data="QRCodeList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              prop="name"
              label="活动码名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="date"
              label="有效时间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="statusLabel"
              label="活动状态"
              width="200">
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="200">
              <template slot-scope="scope" v-if="QRCodeList.length>0">
                <el-button type="text" size="small" @click="doDownloadQRCode(QRCodeList[scope.$index].id)">下载二维码</el-button>
                <el-button type="text" size="small" @click="doActivityCodeAU(QRCodeList[scope.$index].id)">编辑</el-button>
                <el-popover
                  ref="popover"
                  placement="top"
                  width="200"
                  v-model="scope.row.visible">
                  <p>确定删除{{QRCodeList[scope.$index].name}}吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="ensureDeleteQRCode(QRCodeList[scope.$index].id),scope.row.visible = false">确定</el-button>
                  </div>
                </el-popover>
                <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="QRCodeList.length>0">共{{totalCount}}条数据，每页显示{{averageCount}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="averageCount"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="QRCodeList.length>0">
          </el-pagination>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import timeUtils from '@/utils/TimeUtil'
  import configUtil from '@/utils/ConfigUtil'
  import ActivityQRCodeService from '@/api/ActivityQRCodeService'

  export default {
    data() {
      return {
        ELTabPane:[{label:'所有码',name:'all'},{label:'未开始',name:'notStart'},{label:'进行中',name:'going'},{label:'已结束',name:'ended'}],
        QRCodeList:[],
        activeName: 'all',
        currentPage:1, //当前选中的页数
        averageCount:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        mini: 'mini',
        queryString:'',
        loadingText:'正在加载,请稍后...',
        timeOut:null,
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.doQueryActivityCode(0);
    },
    methods: {
      doQueryActivityCode(status){ //查询所有店铺的活动码
        this.QRCodeList = [];
        var self = this;
        if(this.queryString.length>0){
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        ActivityQRCodeService.doQueryActivityCode({
          belong:'402881ae4cd4a25a014cd4f8bbf3000f',
          keyName:self.queryString,
          status:status,
          type:16,
          page:this.currentPage,
          count:this.averageCount}).then(response => {
          if(response.status === 1 && response.data && response.data.length>0){
            self.totalCount = response.total;
            self.QRCodeList = response.data;
            self.QRCodeList.forEach(function (QRCode) {
              if (QRCode.dateType === 2){
                QRCode.date = "永久有效";
              }else {
                QRCode.date = timeUtils.formatTime(QRCode.startDate, 'Y-M-D H:m:s') +"至" + timeUtils.formatTime(QRCode.endDate, 'Y-M-D H:m:s');
              }
              switch(QRCode.status) {
                case 1:
                  QRCode.statusLabel="未开始";
                  break;
                case 2:
                  QRCode.statusLabel="进行中";
                  break;
                case 3:
                  QRCode.statusLabel="已结束";
                  break;
                default:
              }
            });
          }else{
            self.loadingText ="暂无数据";
          }
        });
      },
      removeArrayValue(arr,value) { //删除数组元素的方法
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == value) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      handleClickPane(tab) { //点击选项卡组件
        this.currentPage = 1;
        this.doQueryActivityCode(this.getActivityCodeTypeByActiveName());
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doQueryActivityCode(this.getActivityCodeTypeByActiveName());
      },
      doActivityCodeAU(QRCodeId) { //新建或者编辑活动码
        var url = "/marketing/activity_qrcode/activity_qrcode_au";
        if(typeof(QRCodeId)!="undefined") {
            url = "/marketing/activity_qrcode/activity_qrcode_au?id="+QRCodeId;
        }
        this.$router.push(url);
      },
      doDownloadQRCode(QRCodeId) { //下载二维码
        var downUrl = process.env.BASE_API + "/qrcode_doDownLoadQRCode.do?id=" + QRCodeId;
        console.log(downUrl);
        window.location.href = downUrl;
      },
      ensureDeleteQRCode(QRCodeId) { //确定删除
        var self = this;
        ActivityQRCodeService.doDeleteQRCode({id:QRCodeId}).then(response => {
          if(response.status === 1){
            self.doQueryActivityCode(self.getActivityCodeTypeByActiveName());
          }
        });
      },
      getActivityCodeTypeByActiveName(){ //根据activeName来获取活动码的类型
        if(this.activeName === "all"){
          return 0
        }else if(this.activeName === "notStart"){
          return 1
        }else if(this.activeName === "going"){
          return 2
        }else if(this.activeName === "ended"){
          return 3
        }
      },
      querySearchAsync() {
        console.log("搜索到的关键字:"+this.queryString);
        this.queryString = this.queryString.toLowerCase();
        this.QRCodeList = [];
        if(this.queryString.length>0){
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        if (this.timeOut) {
          clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => {
          this.doQueryActivityCode(this.getActivityCodeTypeByActiveName());
        }, 1000);
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  
</style>
