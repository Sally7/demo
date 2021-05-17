<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">时间流失分布<el-button type="text" style="float: right;margin-right: 20px" @click="exportToExcel()">导出Excel</el-button></div>
    <div class="app__content">
      <el-row :gutter="5">
        <el-col :span="16" class="text-left">
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
          <el-select v-model="waitingTimeType" filterable placeholder="等位时间间隔">
            <el-option
              v-for="item in waitingTimeTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="text-left">
          <el-button type="primary" @click="doSearch" :loading="searching">搜索</el-button>
          <el-button type="success" @click="doReset(),currentPage=1">重置</el-button>
        </el-col>
      </el-row>

      <el-table :empty-text="loadingText"
                :data="customerRankList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          prop="name"
          label="时间段">
        </el-table-column>

        <el-table-column
          label="取号桌数"
          align="center"
          prop="totalData">
        </el-table-column>

        <el-table-column
          label="就餐桌数"
          align="center"
          prop="compeleteData">
        </el-table-column>

        <el-table-column
          label="流失桌数"
          align="center"
          prop="lossData">
        </el-table-column>
        <el-table-column
          label="流失率(按桌)"
          align="center"
          prop="lossRate">
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
          label="流失人数"
          align="center"
          prop="lossNum">
        </el-table-column>
        <el-table-column
          label="流失率(按人)"
          align="center"
          prop="lossNumRate">
        </el-table-column>
      </el-table>

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
        searching:false,
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
        startTime: null,
        endTime: null,
        generalId: null,
        belong: null,
        id: null,
        customerRankList:[],
        groups: [],
        waitingTimeList:[],
        waitingTimeType:10,
        waitingTimeTypeList:[{name:"以10分钟为间隔",value:10},{name:"以5分钟为间隔",value:5}],
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
          waitingTimes:null
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
      var res =await this.doSearchRank();

    },
    methods: {
      // 导出
      exportToExcel() {
        var that=this;
        console.log('export2Excel() '+this.sm.startDate,'-'+this.sm.endDate);
        require.ensure([], () => {
          const { export_json_to_excel } = require('./../../../static/Export2Excel');
          const tHeader = ['时间段', '取号桌数', '就餐桌数', '流失桌数', '流失率(按桌)', '取号人数', '就餐人数', '流失人数','流失率(按人)'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['name', 'totalData', 'compeleteData', 'lossData', 'lossRate', 'totalNum', 'ompeleteNum', 'lossNum','lossNumRate'];
          // 上面的 goodsName、goodsId、是tableData里对象的属性
          const list = this.customerRankList;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          var  start= TimeUtils.formatTime(this.sm.startDate, 'Y-M-D');
          var  end= TimeUtils.formatTime(this.sm.endDate, 'Y-M-D');
          var date='('+start+'至'+end+')';
          export_json_to_excel(tHeader, data, '时间流失分析报表'+date);
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      doSearch() {
        this.searching = true;
        this.doSearchRank();
      },
      doReset(){
        this.dateRange = [];
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.dateRange.push(start);
        this.dateRange.push(end);
        this.sm.selectedGroupId = this.generalId;

        this.waitingTimeType = 10;

        this.doSearch();
      },
      createWaitingTimeList(waitingTimeType){
       if(waitingTimeType==null){
          waitingTimeType=10;
        }
        console.log('createWaitingTimeList():'+waitingTimeType);
        this.waitingTimeList=[];
        var minTime=0;
        var maxTime=0;
        while(minTime<120){
          maxTime=minTime+waitingTimeType;
          this.waitingTimeList.push({value:(minTime*1000*60)+"-"+(maxTime*1000*60),name:minTime+"-"+maxTime+"分钟"})
          minTime=maxTime;
        }
        this.waitingTimeList.push({value:(maxTime*1000*60),name:maxTime+"分钟以上"});
        return this.waitingTimeList;
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
        this.customerRankList=[];
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

      async doStatistic(generalId,belong, statisticType, rankStatus,waitingTimes) {
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }
        //开始结束时间
        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        this.sm.waitingTimes = waitingTimes;
        var res = await CustomerRankService.doStatistic({
          generalId: generalId,
          belong:belong,
          statisticType: statisticType,
          rankStatus: rankStatus,
          sm: this.sm
        });
        return res;
      },


      async doSearchRank() {
        console.log('doPageCustomerRank()--this.generalId'+this.generalId);
        if (this.generalId == null) {
          this.belong = cacheCookies.getGroupId();
        } else {
          if ((this.sm.selectedGroupId != null||this.sm.selectedGroupId != "")&& this.sm.selectedGroupId == this.generalId) {
            this.belong = null;
          } else {
            this.belong = this.sm.selectedGroupId;
          }
        }
        this.waitingTimeList=this.createWaitingTimeList(this.waitingTimeType);
        this.waitingTimeList.forEach(function (customerRank) {
          console.log('时间范围'+customerRank.name);
          customerRank.totalData='-';
          customerRank.compeleteData='-';
          customerRank.lossData='-';
          customerRank.lossRate='-%';
          customerRank.totalNum='-';
          customerRank.ompeleteNum='-';
          customerRank.lossNum='-';
          customerRank.lossNumRate='-%';

        });
        this.customerRankList =this.waitingTimeList;
        var that = this;
        this.customerRankList.forEach(async function (customerRank, index) {
          var totalCountRes = await that.doStatistic(that.generalId, that.belong, "total",null, customerRank.value );
          var totalData = totalCountRes.data[0].data;
          if (totalData > 0) {
            customerRank.totalData = totalData;
            //完成数/就餐数
            var compeleteres = await that.doStatistic(that.generalId, that.belong, "compelete",null,customerRank.value);
            var compeleteData = compeleteres.data[0].data;
            customerRank.compeleteData = compeleteData;
            //流失数
            var lossDataRes = await that.doStatistic(that.generalId, that.belong, "total",-4, customerRank.value );
            var  lossData = lossDataRes.data[0].data;
            customerRank.lossData = lossData;

            //流失人数率
            if(lossData>0&&totalData>0){
              customerRank.lossRate =  parseFloat(lossData * 100 / totalData).toFixed(2) + "%";

            }

            //取号人数
            var totalNumres = await that.doStatistic(that.generalId, that.belong,"totalNum",null,customerRank.value);
            var totalNum=totalNumres.data[0].data;
            customerRank.totalNum=totalNum;

            //就餐人数
            var compeleteNumres = await that.doStatistic(that.generalId, that.belong,"compeleteNum",null,customerRank.value);
            var compeleteNum=compeleteNumres.data[0].data;
            customerRank.ompeleteNum=compeleteNum;

            //流失人数
            var lossNumRes = await that.doStatistic(that.generalId, that.belong, "totalNum",-4, customerRank.value );
            var  lossNum = lossNumRes.data[0].data;
            customerRank.lossNum = lossNum;
            //流失人数率
            if(lossNum>0&&totalNum>0){
              customerRank.lossNumRate =  parseFloat(lossNum * 100 / totalNum).toFixed(2) + "%";

            }
          }
          that.customerRankList.push();
        });
        this.searching = false;

      }
    }
  }
</script>
