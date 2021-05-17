<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">卡发送记录</div>
    <div class="app__content">
        <div>
          <el-row class="mb15" :gutter="20">
            <el-col :span="6">
              <el-input placeholder="请输入要查询的手机号" v-model.trim="queryPhone" clearable></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="doQuery">查询</el-button>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="couponSentList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              label="卡券名称"
              prop="name">
            </el-table-column>
            <el-table-column
              align="center"
              prop="drawDate"
              label="发送时间"
              width="150">
            </el-table-column>
            <el-table-column
              align="center"
              prop="userPhone"
              label="持有人">
            </el-table-column>
            <el-table-column
              align="center"
              prop="count"
              label="卡券数量">
            </el-table-column>
            <!-- <el-table-column
              align="center"
              prop="status"
              label="全部状态"
              :filters="status"
              :filter-multiple="false"
              filter-placement="bottom-end"
              :filter-method="couponStatusFilter">
              <template slot-scope="scope">
            
                {{ scope.row.status| getCouponStatusName}}
              </template>
            </el-table-column> -->
          </el-table>
          <div class="counts-wrap mb15" v-if="couponSentList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="couponSentList.length>0">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from '@/api/GroupService'
  import CouponService from '@/api/CouponService'
  import KakaService from '@/api/KakaService'

  export default {
    data() {
      return {
        queryPhone: "",
        couponSentList: [],
        groupId: cacheCookies.getGroupId(),
        couponId: this.$route.query.couponId,
        loadingText:'正在加载,请稍后...',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        tableHeaderClass: {background: '#f0f0f0'},
      }
    },
    created() {
      this.init();
    },
    filters: {
      getCouponStatusName(value){
        switch(value){
          case -4:
            return "已停止";
          case -3:
            return "已领完";
          case -1:
            return "已到期";
          case 0:
            return "领取中";
        }
      }
    },
    methods: {
      async init(){
        this.couponSentList=[];
        var queryParam = {
          groupId: this.groupId,
          couponId: this.couponId,
          //userPhone: this.queryPhone,
          page:this.currentPage,
          count:this.pageSize
        };
        if(this.queryPhone){
          queryParam.userPhone = this.queryPhone;
        }

        var response = await KakaService.doPageCouponItemDetails(queryParam);
        this.totalCount = response.total;
        if(response.status === 1 && response.data.length > 0){
          response.data.forEach(function(item, index){
            item.drawDate = TimeUtils.formatTime(item.drawDate, 'Y-M-D');
          });
          this.couponSentList = response.data;
        }else{
          this.loadingText ="暂无数据";
        }
      },
      couponStatusFilter(value, row) {
        return row.status === value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.init();
      },
      doQuery(){
        this.currentPage = 1;
        if(this.queryPhone == ""){
          return;
        }
        var pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if(pattern.test(this.queryPhone) === false){
          this.$message({
            message: '请输入正确的手机号码',
            type: 'error'
          });
          return;
        }
        this.init();
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .operation{
    margin-left: 10px;
  }
  .operation .el-icon-edit{
    cursor: pointer;
    color: #999;
    font-size: 14px;
  }
  .operation .el-icon-edit:hover{
    color: #333;
  }
</style>
