<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">赠送</div>
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
                    :data="couponList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              label="卡券名称"
              prop="couponName">
            </el-table-column>
            <el-table-column
              align="center"
              prop="logDate"
              label="转赠时间"
              width="200">
            </el-table-column>
            <el-table-column
              align="center"
              prop="nowUserPhone"
              label="当前持有人">
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
            <el-table-column
              align="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-popover
                  ref="popover"
                  placement="top"
                  width="200"
                  v-model="scope.row.visible">
                  <p>确定变更持有人吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="doChangeOwner(scope.row.couponId,scope.row.nowUserPhone),scope.row.visible = false">确定</el-button>
                  </div>
                  <el-button type="text" slot="reference">持有人变更</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="couponList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="couponList.length>0">
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
        couponList: [],
        groupId: cacheCookies.getGroupId(),
        queryPhone: "",
        loadingText:'暂无数据',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      //this.init();
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
      async doQuery(){
        this.couponList = [];
        var queryParam = {
          phone: this.queryPhone,
          groupId: this.groupId,
          logType: 8,
          page:this.currentPage,
          count:this.pageSize
        };

        var res = await KakaService.doPageCouponItemByUserPhone(queryParam);
        this.totalCount = res.total;
        if(res.status == 1 && res.data.length > 0) {
          res.data.forEach(function(item, index){
            item.logDate = TimeUtils.formatTime(item.logDate, 'Y-M-D');
          });
          this.couponList = res.data;
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
      async doChangeOwner(id,toUserPhone){
        var ownerParam = {
          groupId: this.groupId,
          couponId: id,
          toUserPhone: toUserPhone,
          userPhone: this.queryPhone
        };
        var res = await KakaService.doAmendGiveCouponItem(ownerParam);
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
