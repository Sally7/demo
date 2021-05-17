<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">等待人数分布<el-button type="text" style="float: right;margin-right: 20px" @click="exportToExcel()">导出Excel</el-button></div>
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
                :data="customerRankList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">

        <el-table-column
          align="center"
          prop="name"
          label="人数">
        </el-table-column>

        <el-table-column
          label="取号桌数"
          align="center"
          prop="totalData">
        </el-table-column>
        <el-table-column
          label="取号桌数占比"
          align="center"
          prop="totalRate">
        </el-table-column>
        <el-table-column
          label="就餐桌数"
          align="center"
          prop="compeleteData">
        </el-table-column>
        <el-table-column
          label="就餐桌数占比"
          align="center"
          prop="compeleteRatio">
        </el-table-column>

        <el-table-column
          label="就餐率(按桌)"
          align="center"
          prop="compeleteRate">
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
        numbers:[{name:"1",value:"1"},{name:"2",value:"2"},{name:"3",value:"3"},{name:"4",value:"4"},{name:"5",value:"5"},{name:"6",value:"6"},{name:"7",value:"7"},{name:"8",value:"8"},{name:"9",value:"9"},{name:"10+",value:"-10"}],
        groups: [],
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
          selectedGroupId: null,
          num:null
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
        console.log('exportToExcel() '+this.sm.startDate,'-'+this.sm.endDate);
        require.ensure([], () => {
          const { export_json_to_excel } = require('./../../../static/Export2Excel');
          var  start= TimeUtils.formatTime(this.sm.startDate, 'Y-M-D');
          var  end= TimeUtils.formatTime(this.sm.endDate, 'Y-M-D');
          var date='('+start+'至'+end+')';
          const tHeader = ['人数"', '取号桌数', '取号桌数占比', '就餐桌数', '就餐桌数占比', '就餐率(按桌)'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['name', 'totalData', 'totalRate', 'compeleteData', 'compeleteRatio', 'compeleteRate'];
          // 上面的 goodsName、goodsId、是tableData里对象的属性
          const list = this.customerRankList;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '人数分布分析报表'+date);
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },

      doSearch() {
        console.log('测试开始查询');
        if (this.endTime && new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) { //如果开始时间大于结束时间就互换两个值
          this.startTime = [this.endTime, this.endTime = this.startTime][0];
        }
        console.log("this.startTime:" + this.startTime);
        this.customerRankList = [];
        this.doSearchRank();
      },

      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;

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

      async doStatistic(generalId,belong, statisticType,rankStatus,num) {
        if(this.dateRange.length > 0) {
          this.sm.startDate = this.dateRange[0].getTime();
          this.sm.endDate = this.dateRange[1].getTime();
        }

        this.sm.startDate = new Date( this.sm.startDate).getTime()
        this.sm.endDate = new Date( this.sm.endDate).getTime() + 86399000;
        this.sm.num=num;
        var res = await CustomerRankService.doStatistic({
          generalId: generalId,
          belong:belong,
          statisticType: statisticType,
          rankStatus: rankStatus,
          sm: this.sm
        });
        console.log('doStatistic()res:' + res);
        return res;
      },


      async doSearchRank() {
        this.customerRankList=[];
        console.log('doSearchRank()--this.generalId')+this.generalId;
        if (this.generalId == null) {
          this.belong = cacheCookies.getGroupId();
        } else {
          if ((this.sm.selectedGroupId != null||this.sm.selectedGroupId != "")&& this.sm.selectedGroupId == this.generalId) {
            this.belong = null;
          } else {
            this.belong = this.sm.selectedGroupId;
          }
        }
        this.numbers.forEach(function (customerRank, index) {
          customerRank.totalData='-';
          customerRank.compeleteData='-';
          customerRank.totalRate='-%';
          customerRank.compeleteRate='-%';
          customerRank.compeleteRatio='-%';
        });

        this.customerRankList=this.numbers;
        //全部的取号数
        var totalCountRes = await this.doStatistic(this.generalId, this.belong, "total",null);
        var totalData = totalCountRes.data[0].data;
        //全部的完成数/就餐数
        var compeleteres = await this.doStatistic(this.generalId, this.belong, "compelete",null);
        var compeleteData = compeleteres.data[0].data;

        var that = this;
        this.customerRankList.forEach(async function (customerRank, index) {
          //当前桌型的取号数
           var totalNumberCountRes = await that.doStatistic(that.generalId, that.belong, "total",null,customerRank.value);
           var totalNumberData = totalNumberCountRes.data[0].data;
           if (totalNumberData > 0) {
             customerRank.totalData =totalNumberData;

             //当前桌型的完成数/就餐数
             var compeleteNumberres = await that.doStatistic(that.generalId, that.belong, "compelete",null,customerRank.value);
             var compeleteNumberData = compeleteNumberres.data[0].data;
             customerRank.compeleteData = compeleteNumberData;

             //取号占比
             if(totalData>0){
               customerRank.totalRate=parseFloat(totalNumberData * 100 /totalData).toFixed(2) + "%";
             }

             //就餐占比
             if(compeleteNumberData>0&&compeleteData>0){
               customerRank.compeleteRatio=parseFloat(compeleteNumberData * 100 / compeleteData).toFixed(2) + "%";
             }

             if (totalNumberData > 0 && compeleteNumberData > 0) {
               customerRank.compeleteRate =parseFloat(compeleteNumberData * 100 / totalNumberData).toFixed(2) + "%";
             }

          }
          that.customerRankList.push();
        });

      }
    }
  }
</script>
