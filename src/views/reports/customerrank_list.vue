<style>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">排队历史列表</div>
    <div class="app__content">
      <el-row :gutter="5">
        <el-col :span="3" class="text-left">
          <el-select v-model="sm.areaId" filterable placeholder="所有地区">
            <el-option
              v-for="item in areaSelectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="text-left">
          <el-select v-model="sm.groupId" filterable placeholder="所有分店" v-if="!this.group.generalId">
            <el-option
              v-for="item in groupSelectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="text-left">
          <el-select v-model="sm.timeType" placeholder="所有市别">
            <el-option
              v-for="item in timeTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="text-left">
          <el-select v-model="sm.status" placeholder="所有状态">
            <el-option
              v-for="item in customerRankStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="text-left">
          <el-select v-model="sm.makeType" placeholder="所有渠道">
            <el-option
              v-for="item in makeTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="9" class="text-left">
          <el-date-picker
            v-model="sm.dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="3" class="text-left">
          <el-input v-model="sm.phone" placeholder="手机号码" clearable></el-input>
        </el-col>
        <el-col :span="21" class="text-left">
          <el-button type="primary" @click="currentPage=1;doPage()">搜索</el-button>
          <el-button type="success" @click="currentPage=1;doReset()">重置</el-button>
        </el-col>
      </el-row>

      <el-table :empty-text="loadingText"
                :data="customerRanks"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          align="center"
          label="排队号码"
          prop="labelNum">
        </el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          prop="phone">
        </el-table-column>
        <el-table-column
          align="center"
          prop="rankBeginDateLabel"
          label="取号时间">
        </el-table-column>
        <el-table-column
          label="门店"
          align="center"
          prop="groupName">
        </el-table-column>
        <el-table-column
          label="微信昵称"
          align="center"
          prop="nickname">
        </el-table-column>
        <el-table-column
          label="渠道"
          align="center"
          prop="makeTypeLabel">
        </el-table-column>
        <el-table-column
          label="桌型"
          align="center"
          prop="mtCategoryName">
        </el-table-column>
        <el-table-column
          label="市别"
          align="center"
          prop="timeTypeLabel">
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          prop="statusLabel">
        </el-table-column>
        <el-table-column
          label="取号人数"
          align="center"
          prop="num">
        </el-table-column>
        <el-table-column
          label="等待时间(分钟)"
          align="center"
          prop="waitTime">
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="remark">
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="customerRanks.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="customerRanks.length>0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from "@/api/GroupService"
  import cacheCookies from '@/utils/auth'
  import CustomerRankService from "@/api/CustomerRankService";
  import AreaService from '@/api/AreaService'

  export default {
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        currentPage: 1, //当前选中的页数
        pageSize: 10,//每页放多少条数据
        totalCount: 0,//共有多少条数据
        customerRanks: [], //查询店铺的关键字: [],
        areaSelectOptions:[],
        generalId:null,
        group:{},
        id:null,
        timeTypeOptions:[{name:"所有市别",value:0},{name:"午市",value:1},{name:"晚市",value:2}],
        customerRankStatusOptions:[{name:"所有状态",value:0},{name:"已取号",value:97},{name:"已叫号",value:99},{name:"已就餐",value:2},{name:"已过号",value:-2},{name:"已取消",value:-1}],
        makeTypeOptions:[{name:"所有渠道",value:0},{name:"线上取号",value:1},{name:"线下取号",value:2}],
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
        groupSelectOptions:[],
        sm:{
          timeType:0,
          makeType:0,
          status:0,
          dateRange:[],
          groupId:null,
          generalId:null,
          phone:null,
          areaId:null
        },
      }
    },
    async created(){
      var that = this;
      var groupRes = await GroupService.doGetOneGroup(cacheCookies.getGroupId());
      this.group = groupRes.data;

      var groupAreasRes = await AreaService.doSearchCitysByGroupId(cacheCookies.getGroupId());
      groupAreasRes.data.unshift({name:"全部地区",id:null});
      this.areaSelectOptions = groupAreasRes.data;

      if(!this.group.generalId) {
        var groupSelectOptionsRes = await GroupService.doSearch({generalId: that.group.id});
        groupSelectOptionsRes.data.unshift({name:"所有分店",id:null});
        this.groupSelectOptions = groupSelectOptionsRes.data;
      }

      this.doPage();
    },
    methods: {
      async doPage() {
        this.loadingText = '正在加载,请稍后...';
        var that = this;
        if(this.group.generalId) {
          this.sm.groupId = this.group.id;
        } else {
          this.sm.generalId = this.group.id;
        }

        if(this.sm.dateRange.length>0) {
          if(this.sm.dateRange[0]) {
            this.sm.startDate = this.sm.dateRange[0].getTime();
          }
          if(this.sm.dateRange[1]) {
            this.sm.endDate = this.sm.dateRange[1].getTime();
          }
        }

        var searchModel = {sm:that.sm,count:that.pageSize,page:that.currentPage};

        var customerRanksRes = await CustomerRankService.doPage(searchModel);

        customerRanksRes.data.forEach(function (customerRank) {
          customerRank.rankBeginDateLabel = TimeUtils.formatTime(customerRank.rankBeginDate, 'Y-M-D H:m:s');
          customerRank.rankCallDateLabel = TimeUtils.formatTime(customerRank.rankCallDate, 'Y-M-D H:m:s');
          customerRank.rankOverDateLabel= TimeUtils.formatTime(customerRank.rankOverDate, 'Y-M-D H:m:s');

          var beginDate = new Date(customerRank.rankBeginDate);
          var hour = beginDate.getHours();
          if(hour > 10 && hour < 15) {
            customerRank.timeTypeLabel = "午市";
          } else if(hour > 15) {
            customerRank.timeTypeLabel = "晚市";
          }

          if(customerRank.nickname) {
            customerRank.makeTypeLabel = "线上取号";
          } else {
            customerRank.makeTypeLabel = "线下取号";
          }

          switch (customerRank.status) {
            case -2:
              customerRank.statusLabel = "已过号";
              break;
            case -1:
              customerRank.statusLabel = "自助取消";
              break;
            case 1:
              customerRank.statusLabel = "排队中";
              break;
            case 2:
              customerRank.statusLabel = "已就餐";
              break;
          }

          if(!customerRank.rankOverDate) {
            customerRank.rankOverDate = new Date().getTime();
          }

          customerRank.waitTime = ((customerRank.rankOverDate-customerRank.rankBeginDate)/1000/60).toFixed(0);

        });

        this.totalCount = customerRanksRes.total;
        this.customerRanks = customerRanksRes.data;

        this.loadingText = '暂无数据';
      },
      doReset() {
        this.sm = {
          timeType:0,
          makeType:0,
          status:0,
          dateRange:[],
          groupId:null,
          generalId:null,
          phone:null
        };
        this.doPage();
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPage();
      }
    }
  }
</script>
