<template>
    <div class="app-container" id="wrapper">
        <div class="module-title">对账单</div>
        <div class="app__content">
            <el-row :gutter="20">
                <el-col :span="4" class="text-left">
                    <el-input prefix-icon="el-icon-search" placeholder="请输入店铺名称" v-model="keyShopName"  clearable />
                </el-col>
                <el-col :span="10" class="text-left">
                    <el-date-picker type="date" v-model="startTime" placeholder="开始日期" /> 至
                    <el-date-picker type="date" v-model="endTime" placeholder="结束日期" />
                </el-col>
                <el-col :span="4" class="text-left">
                    <el-button type="primary" @click="doSearch">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :empty-text="loadingText"
                      :data="billList"
                      :header-row-style="tableHeaderClass"
                      style="width: 100%;margin-top: 20px;">
                <el-table-column
                        align="center"
                        label="商户名称"
                        prop="groupName">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="realPrice"
                        label="总营业额">
                </el-table-column>
                <el-table-column
                        label="报销金"
                        align="center"
                        prop="reimburseAmount">
                </el-table-column>
                <el-table-column
                        width="200"
                        label="服务费比例（%）"
                        align="center"
                        prop="chargeRate">
                </el-table-column>
                <el-table-column
                        label="分润"
                        align="center"
                        prop="profit">
                </el-table-column>
                <el-table-column
                        label="10%提现手续费"
                        align="center"
                        prop="charge">
                </el-table-column>
                <el-table-column
                        label="商家应付金额"
                        align="center"
                        prop="payment">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="counts-wrap mb15" v-if="billList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
            <el-pagination class="text-right"
                           background
                           layout="prev, pager, next"
                           :page-size="pageSize"
                           :total="totalCount"
                           :current-page="currentPage"
                           @current-change="handleCurrentChange"
                           v-if="billList.length>0">
            </el-pagination>
        </div>
    </div>
</template>
<script>
  import TimeUtils from '@/utils/TimeUtil'
  import cacheCookies from '@/utils/auth'
  import OrderService from '@/api/OrderService'
  export default {
    data(){
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        startTime:null,
        startDate:null,
        endTime:null,
        endDate:null,
        keyShopName:null, //查询店铺的关键字
        billList:[],

      }
    },
    created(){
      console.log('这里是评价管理');
      this.doPageAccountStatement();
    },
    methods: {
      doSearch() {
        if(this.endTime && new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) { //如果开始时间大于结束时间就互换两个值
          this.startTime=[this.endTime,this.endTime=this.startTime][0];
        }
        this.billList = [];
        this.doPageAccountStatement();
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageAccountStatement();
      },
      async doPageAccountStatement(){
        var startDate = null;
        var endDate = null;
        if(this.startTime){
          startDate = new Date(this.startTime).getTime()
        }
        if(this.endTime){
          endDate = new Date(this.endTime).getTime() + 86399000; //取到当前日期的23:59:59
        }
        var res = await OrderService.doPageAccountStatement(cacheCookies.getGroupId(),startDate,endDate,this.keyShopName,this.currentPage,this.pageSize);
        this.loadingText = '暂无数据';
        this.totalCount = res.total;
        if(res.status!=1){
          return;
        }
        res.data.forEach(function (order) {
          order.reimburseAmount = Math.floor(order.realPrice * 0.1 * 100) / 100; //报销金
          order.charge = Math.floor(parseInt(order.reimburseAmount/500) * 50 * 100) / 100; //提现手续费
          order.profit = Math.floor(order.realPrice * order.chargeRate) / 100; //分润
          order.payment = order.charge + order.profit; //商家应付金额
        });
        this.billList = this.billList.concat(res.data);
      }
    },

  }
</script>
