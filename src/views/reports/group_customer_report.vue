<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">取号分析  <el-button type="text" style="float: right;margin-right: 20px" @click="downloadGroupCustomerExcel()">导出Excel</el-button></div>
    <div class="app__content">
      <el-row :gutter="5">
        <el-col :span="12" class="text-left">
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
        </el-col>
        <el-col :span="10" class="text-left">
          <el-button type="primary" @click="doSearch">搜索</el-button>
          <el-button type="success" @click="currentPage=1,doReset()">重置</el-button>
        </el-col>
      </el-row>
      <el-table :empty-text="loadingText"
                :data="groupList"
                :header-row-style="tableHeaderClass"
                :default-sort = "{prop: 'totalData', order: 'descending'}"
                style="width: 100%;margin-top: 20px;">
        <el-table-column

          align="center"
          label="门店名称"
          width="100"
          prop="name">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="totalData"
          label="取号桌数">
        </el-table-column>
        <el-table-column
          label="取消桌数"
          align="center"
          prop="cancelData">
        </el-table-column>
        <el-table-column
          label="过号桌数"
          align="center"
          prop="overNumberData">
        </el-table-column>
        <el-table-column
          label="就餐桌数"
          align="center"
          prop="compeleteData">
        </el-table-column>
        <el-table-column
          sortable
          label="就餐率(按桌)"
          align="center"
          prop="compeleteRate">
        </el-table-column>
        <el-table-column
          label="取号人数"
          align="center"
          prop="totalNum">
        </el-table-column>
        <el-table-column
          label="就餐人数"
          align="center"
          prop="ompeleteNum">
        </el-table-column>
        <el-table-column
          sortable
          label="就餐率(按人)"
          align="center"
          prop="compeleteNumRate">
        </el-table-column>
        <el-table-column
          label="柜台取号数"
          align="center"
          prop="counterData">
        </el-table-column>
        <el-table-column
          label="柜台扫码取号数"
          align="center"
          prop="scanData">
        </el-table-column>
        <el-table-column
          label="柜台扫码就餐数"
          align="center"
          prop="scancompeleteData">
        </el-table-column>
        <el-table-column
          label="柜台扫码就餐率"
          align="center"
          prop="scancompeleteRate">
        </el-table-column>
        <el-table-column
          sortable
          label="微信取号数"
          align="center"
          prop="weixinData">
        </el-table-column>
        <el-table-column
          label=" 平均等位时间(分钟)"
          align="center"
          prop="countDate">
        </el-table-column>

      </el-table>
      <div class="counts-wrap mb15" v-if="groupList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="groupList.length>0">
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
        currentPage: 1, //当前选中的页数
        pageSize: 100,//每页放多少条数据
        totalCount: 0,//共有多少条数据
        startTime: null,
        endTime: null,
        dateRange: [],
        groupList: [],
        groups: [],
        groupSelectOptions: [],
        generalId: null,
        searchId: null,
        id: null,
        group: {},
        oneGroup: {},
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
        sm: {
          year: "",
          type: "",
          month: "",
          week: "",
          day: "",
          startDate: this.startTime,
          endDate: this.endTime,
          selectedGroupId: null
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
      var res = await this.doPageGroup();
    },
    methods: {
      doSearch() {
        this.groupList = [];
        this.doPageGroup();
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageGroup();
      },
      doReset(){
        this.dateRange = [];
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.dateRange.push(start);
        this.dateRange.push(end);
        this.sm.selectedGroupId = this.generalId;

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

      async doStatistic(groupId, statisticType, rankStatus) {
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }

        //开始结束时间
        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        var res = await CustomerRankService.doStatistic({
          belong: groupId,
          statisticType: statisticType,
          rankStatus: rankStatus,
          sm: this.sm
        });
        return res;
      },

      async downloadGroupCustomerExcel(){
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }

        //开始结束时间
        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        if (this.generalId == null) {
          this.searchId = cacheCookies.getGroupId();
        } else {
          if ((this.sm.selectedGroupId != null||this.sm.selectedGroupId != "")&& this.sm.selectedGroupId == this.generalId) {
            this.searchId = null;
          } else {
            this.searchId = this.sm.selectedGroupId;
          }
        }
        window.location.href = process.env.BASE_API + "/rank_doGroupCustomerExcel.do?generalId=" + this.generalId+"&belong="+this.searchId+"&sm.startDate="+ this.sm.startDate+"&sm.endDate="+ this.sm.endDate;
/*        var response = await CustomerRankService.doRankAnalysisExcel({
          generalId: this.generalId,
          belong: this.searchId,
          sm: this.sm
          /!* id:cacheCookies.getGroupId()*!/
        });*/
      },


      async doPageGroup() {
        console.log('doPageGroup()');

        if (this.generalId == null) {
          this.searchId = cacheCookies.getGroupId();
        } else {
          if ((this.sm.selectedGroupId != null||this.sm.selectedGroupId != "")&& this.sm.selectedGroupId == this.generalId) {
            this.searchId = null;
          } else {
            this.searchId = this.sm.selectedGroupId;
          }
        }
        if(this.searchId!=null){
          this.currentPage=1;
        }
        var response = await GroupService.doPage({
          page: this.currentPage,
          count: this.pageSize,
          generalId: this.generalId,
          id: this.searchId
          /* id:cacheCookies.getGroupId()*/
        });
        if (response.status && response.data && response.data.length > 0) {
          this.totalCount = response.total;
          response.data.forEach(function (group) {
            //取号桌数
            group.totalData = "0";
            //取消桌数
            group.cancelData = "0";
            //过号桌数
            group.overNumberData = "0";
            //就餐桌数
            group.compeleteData = "0";
            //就餐率（按桌）
            group.compeleteRate = "0%";
            //取号人数
            group.totalNum = "0";
            //就餐人数
            group.ompeleteNum = "0";
            //就餐率(按人)
            group.compeleteNumRate = "0%";
            //柜台取号数
            group.counterData = "0";
            //柜台扫码取号数
            group.scanData = "0";
            //柜台扫码就餐数
            group.scancompeleteData = "0";
            //柜台扫码就餐率
            group.scancompeleteRate = "0%";
            //微信取号数
            group.weixinData = "0";
            //平均等位时间(分钟)
            group.countDate = "0";

          });
          this.groupList = response.data;
          var that = this;
          //显示城市名称
          that.groupList.forEach(async function (group, index) {
            console.log('group.id' + group.id);
            var totalDatares = await that.doStatistic(group.id, "total");
            var totalData = totalDatares.data[0].data;
            console.log('totalData' + totalData);
            if (totalData > 0) {
              group.totalData = totalData;
              //过号数
              var overNumberres = await that.doStatistic(group.id, "overNumber");
              var overNumberData = overNumberres.data[0].data;
              group.overNumberData = overNumberData;

              //完成数/就餐数
              var compeleteres = await that.doStatistic(group.id, "compelete");
              var compeleteData = compeleteres.data[0].data;
              group.compeleteData = compeleteData;

              //柜台取号
              var counterres = await that.doStatistic(group.id, "counter");
              var counterData = counterres.data[0].data;
              group.counterData = counterData;

              //微信取号
              var weixinres = await that.doStatistic(group.id, "weixin");
              var weixinData = weixinres.data[0].data;
              group.weixinData = weixinData;

              //柜台扫码
              var scanres = await that.doStatistic(group.id, "scan");
              var scanData = scanres.data[0].data;
              group.scanData = scanData;

              //柜台扫码完成
              var scancompeleteres = await that.doStatistic(group.id, "scan", '2');
              var scancompeleteData = scancompeleteres.data[0].data;
              group.scancompeleteData = scancompeleteData;

              //柜台扫码就餐率
              group.scancompeleteRate = "0%";
              if (scanData > 0 && scancompeleteData > 0) {
                group.scancompeleteRate =parseFloat(scancompeleteData * 100 / scanData).toFixed(2) + "%";
              }

              //平均等位时间(分钟)
              var countdateres = await that.doStatistic(group.id, "countdate");
              var countDate = countdateres.data[0].data;
              group.countDate = countDate;

              //取消桌数
              var cancelData = totalData - overNumberData - compeleteData;
              group.cancelData = cancelData;

              //就餐率（按桌）
              var compeleteRate = "0%";
              group.compeleteRate = compeleteRate;
              if (totalData > 0 && compeleteData > 0) {
                group.compeleteRate =parseFloat(compeleteData * 100 / totalData).toFixed(2) + "%";
              }


              //取号人数
              var totalNumres = await that.doStatistic(group.id, "totalNum");
              var totalNum=totalNumres.data[0].data;
              group.totalNum=totalNum;
              //就餐人数
              var compeleteNumres = await that.doStatistic(group.id, "compeleteNum");
              var compeleteNum=compeleteNumres.data[0].data;
              group.ompeleteNum=compeleteNum;
              //就餐率(按人)
              group.compeleteNumRate = "0%";
              if (totalNum > 0 && compeleteNum > 0) {
                group.compeleteNumRate = parseFloat( compeleteNum * 100 /  group.totalNum).toFixed(2)+ "%";
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
