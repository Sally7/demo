<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">等位分析<el-button type="text" style="float: right;margin-right: 20px" @click="downloadRankAnalysisExcel()">导出Excel</el-button></div>
    <div class="app__content">
      <el-row :gutter="5">
        <el-col :span="20" class="text-left">
          <el-select v-model="sm.selectedGroupId" filterable placeholder="请选择门店">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-select v-model="timeQuantum" filterable placeholder="时间段">
            <el-option
              v-for="item in timeQuantums"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="tableNum" filterable placeholder="就餐人数范围">
            <el-option
              v-for="item in tableNums"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          </el-col>
          <el-col :span="4" class="text-left">
            <el-button type="primary" @click="doSearch">搜索</el-button>
            <el-button type="success" @click="doReset(),currentPage=1">重置</el-button>
          </el-col>

      </el-row>

      <el-table :empty-text="loadingText"
                :data="customerRankList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          label="日期"
          prop="rankBeginDate">
        </el-table-column>
        <el-table-column
          align="center"
          prop="timeQuantum"
          label="时间段">
        </el-table-column>
        <el-table-column
          label="就餐人数范围"
          align="center"
          prop="tableNum">
        </el-table-column>
        <el-table-column
          label="取号总数"
          align="center"
          prop="totalCount">
        </el-table-column>
        <el-table-column
          label="取号占比"
          align="center"
          prop="dayTotalRate">
        </el-table-column>
        <el-table-column
          label="就餐桌数"
          align="center"
          prop="compeleteData">
        </el-table-column>
        <el-table-column
          label="就餐率"
          align="center"
          prop="compeleteRate">
        </el-table-column>
        <el-table-column
          label="流失桌数"
          align="center"
          prop=lossCount"">
        </el-table-column>
        <el-table-column
          label="流失率"
          align="center"
          prop="lossRate">
        </el-table-column>
        <el-table-column
          label="最长等待时间（分钟）"
          align="center"
          prop="maxWait">
        </el-table-column>
        <el-table-column
          label="平均等待时间（分钟）"
          align="center"
          prop="avgWait">
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="customerRankList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="customerRankList.length>0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from "@/api/GroupService"
  import cacheCookies from '@/utils/auth'
  import CustomerRankService from "@/api/CustomerRankService";

  export default {
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        dateRange:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        currentPage: 1, //当前选中的页数
        pageSize: 10,//每页放多少条数据
        totalCount: 0,//共有多少条数据
        startTime: null,
        endTime: null,
        generalId: null,
        belong: null,
        id: null,
        timeQuantum:"",
        tableNum:"",
        customerRankList:[],
        groups: [],
        timeQuantums:[{name:"全时段",value:""},{name:"10点-15点",value:"9-15"},{name:"15点-21点",value:"15-21"},{name:"其他时段",value:"22-24"}],
        tableNums:[{name:"全部人数范围",value:""},{name:"1-2人",value:"1-2"},{name:"3-4人",value:"3-4"},{name:"5人及以上",value:"5"}],
        customerRank: {

        },
        oneGroup: {},
        sm: {
          year: "",
          type: "",
          month: "",
          week: "",
          day: "",
          selectId:null,
          startDate: this.startTime,
          endDate: this.endTime,
          selectDate:null,
          selectedGroupId: null,
          timeQuantum:null,
          tableNum:null
        },
      }
    },
    async created() {
      //默认查询一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.dateRange.push(start);
      this.dateRange.push(end);

      var res = await this.doGetOneGroup();
      var res = await this.doSearchGroup();
      var res =await this.doPageCustomerRank();

    },
    methods: {
      doSearch() {
        this.customerRankList = [];
        this.doPageCustomerRank();
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageCustomerRank();
      },
      doReset(){
        this.dateRange = [];
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.dateRange.push(start);
        this.dateRange.push(end);
        this.sm.selectedGroupId = this.generalId;

        this.timeQuantum="";
        this.tableNum="";

        this.doSearch();
      },
      //查询当前登陆的门店信息
      async doGetOneGroup() {
        var res = await GroupService.doGetOneGroup(cacheCookies.getGroupId());
        this.oneGroup = res.data;
        if (this.oneGroup.generalId == '' || this.oneGroup.generalId == null) {
          this.oneGroup.name = "所有门店";
          this.generalId = res.data.id;
          console.log('总店' + this.generalId);
        }
      },

      //查询所有的门店
      async doSearchGroup() {
        console.log('doSearchGroup()- this.generalId:' + this.generalId);
        if (this.generalId != null) {
          var res = await GroupService.doSearch({
            generalId: this.generalId
          });
          if (res.status && res.data && res.data.length > 0) {
            this.groups = res.data;
          }
        }
        console.log('doSearchGroup()-groups.unshift');
        this.groups.unshift(this.oneGroup);
        this.sm.selectedGroupId = this.generalId;
      },

      async doStatistic(generalId,belong, statisticType, rankStatus,selectDate) {
        console.log('doStatistic()');
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }
        //开始结束时间
        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        this.sm.selectDate=selectDate;
        var res = await CustomerRankService.doStatistic({
          generalId: generalId,
          belong:belong,
          statisticType: statisticType,
          rankStatus: rankStatus,
          sm: this.sm
        });
        return res;
      },
      async downloadRankAnalysisExcel(){
        if (this.generalId == null) {
          this.belong = cacheCookies.getGroupId();
        } else {
          if ((this.sm.selectedGroupId != null||this.sm.selectedGroupId != "")&& this.sm.selectedGroupId == this.generalId) {
            this.belong = null;
          } else {
            this.belong = this.sm.selectedGroupId;
          }
        }

        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }
        //开始结束时间
        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        this.sm.timeQuantum=this.timeQuantum;
        this.sm.tableNum=this.tableNum;
        window.location.href = process.env.BASE_API + "/rank_doRankAnalysisExcel.do?generalId=" + this.generalId+"&belong="+this.belong+"&sm.startDate="+ this.sm.startDate+"&sm.endDate="+ this.sm.endDate+"&sm.timeQuantum="+ this.sm.timeQuantum+"&sm.tableNum="+ this.sm.tableNum;

      },

      async doPageCustomerRank() {
        this.loadingText = "正在加载...";
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }

        this.customerRankList=[];
        console.log('doPageCustomerRank()--this.generalId')+this.generalId;
        if (this.generalId == null) {
          this.belong = cacheCookies.getGroupId();
        } else {
          if ((this.sm.selectedGroupId != null||this.sm.selectedGroupId != "")&& this.sm.selectedGroupId == this.generalId) {
            this.belong = null;
          } else {
            this.belong = this.sm.selectedGroupId;
          }
        }
        if(this.searchId!=null){
          this.currentPage=1;
        }
        console.log('this.currentPage:'+this.currentPage);
        this.sm.timeQuantum=this.timeQuantum;
        this.sm.tableNum=this.tableNum;
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }
        //开始结束时间
        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        var response = await CustomerRankService.doPageRankAnalysis({
          page: this.currentPage,
          count: this.pageSize,
          generalId: this.generalId,
          belong :this.belong,
          sm: this.sm
        });
        if (response.status && response.data && response.data.length > 0) {
          this.totalCount = response.total;
          response.data.forEach(function (customerRank) {
            //取号占比
            customerRank.dayTotalRate = "-%";
            //就餐率
            customerRank.compeleteRate = "-%";
            //流失率
            customerRank.lossRate = "-%";

          });
          this.customerRankList = response.data;
          var that = this;

          this.customerRankList.forEach(async function (customerRank, index) {
            var totalCount=customerRank.totalCount;
            var dayTotalres = await that.doStatistic(that.generalId,that.belong ,"total",null,customerRank.rankBeginDate);
            customerRank.rankBeginDate = TimeUtils.formatTime(customerRank.rankBeginDate, 'Y-M-D');
            var dayTotal=dayTotalres.data[0].data;
            var maxWait=customerRank.maxWait;
            customerRank.maxWait=Math.floor(maxWait/60);
            var avgWait=customerRank.avgWait;
            customerRank.avgWait=Math.floor(avgWait/60);
            if(dayTotal>0){
              if(totalCount>0){
                console.log('customerRank.rankBeginDate:'+customerRank.rankBeginDate+'--tableNum:'+customerRank.tableNum+'--dayTotal:'+dayTotal+"-totalCount"+totalCount);
                customerRank.dayTotalRate =parseFloat(totalCount * 100/ dayTotal).toFixed(2) + "%";
              }

              //就餐桌数
              var compeleteData=customerRank.data
              customerRank.compeleteData =compeleteData ;

              if(compeleteData>0&&totalCount>0){
                customerRank.compeleteRate =  parseFloat(compeleteData * 100 / totalCount).toFixed(2) + "%";

              }

              var lossCount=customerRank.lossCount;
              customerRank.lossCount=lossCount;
              if(lossCount>0&&totalCount>0){
                customerRank.lossRate =  parseFloat(lossCount * 100 / totalCount).toFixed(2) + "%";

              }
            }

          });
        } else {
          this.loadingText = "暂无数据";
        }
      }
    }
  }
</script>
