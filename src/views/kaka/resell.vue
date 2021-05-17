<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">转卖</div>
    <div class="app__content">
        <div>
          <el-row class="mb15" :gutter="20">
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="7">
              <el-input placeholder="请输入要查询的手机号" v-model.trim="queryPhone" clearable></el-input>
            </el-col>
            <el-col :xs="2" :sm="3" :md="4" :lg="7" :xl="6">
              <el-button type="primary" @click="doQuery">查询</el-button>
            </el-col>
            <el-col :xs="9" :sm="9" :md="9" :lg="7" :xl="8" style="min-width:350px">
              <div class="block">
                <el-date-picker
                  v-model="dateRange"
                  value-format="timestamp"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :xs="3" :sm="3" :md="4" :lg="4" :xl="5">
              <el-button type="primary" @click="handleDownload">导出Excel</el-button>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="couponResellList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <!-- <el-table-column
              prop="couponTypeName"
              label="卡券类型"
              width="100">
            </el-table-column> -->
            <el-table-column
              align="center"
              label="卡券名称"
              prop="couponName">
            </el-table-column>
            <el-table-column
              align="center"
              label="所属店铺"
              prop="groupName">
            </el-table-column>
            <el-table-column
              align="center"
              label="持有人手机号"
              prop="nowUserPhone">
            </el-table-column>
            <el-table-column
              align="center"
              label="转卖账户"
              prop="resellAccount">
            </el-table-column>
            <el-table-column
              align="center"
              label="转卖人姓名"
              prop="owner">
            </el-table-column>
            <el-table-column
              align="center"
              label="转卖价格"
              prop="resellPrice">
            </el-table-column>
            <el-table-column
              align="center"
              prop="logDate"
              label="转卖日期">
            </el-table-column>
            <el-table-column
              align="center"
              prop="status"
              label="全部状态"
              :filters="status"
              :filter-multiple="false"
              filter-placement="bottom-end"
              :filter-method="couponStatusFilter">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status?'success':'danger'">{{ scope.row.status| getCouponStatusName}}</el-tag>
              </template>
            </el-table-column>
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
                  <p>是否同意处理？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">不同意</el-button>
                    <el-button type="primary" size="mini" @click="doResell(scope.row.id,scope.row.status),scope.row.visible = false">同意</el-button>
                  </div>
                  <el-button v-if="!scope.row.status" type="primary" slot="reference">确认</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="couponResellList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="couponResellList.length>0">
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
        addCount: 1,
        addSendableCount: 1,
        couponResellList: [],
        groupId: cacheCookies.getGroupId(),
        couponTypes: [
          {value:1, label: "代金券"},
          //{value:2, label: "红包"},
          {value:3, label: "计次券"},
          //{value:4, label: "结伴券"},
          {value:5, label: "折扣券"}
          //{value:8, label: "报销券"}
        ],
        loadingText:'正在加载,请稍后...',
        status:[
          {text:"已处理", value:1},
          {text:"未处理", value:0}
        ],
        dateRange: '',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        queryString:'',
        filename: "转卖报表",
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      this.doPageResell();
    },
    filters: {
      getCouponStatusName(value){
        switch(value){
          case 1:
            return "已处理";
          case 0:
            return "未处理";
        }
      }
    },
    methods: {
      async doPageResell(){
        this.couponResellList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var that = this;
        var resellParam = {
          groupId: this.groupId,
          page:this.currentPage,
          count:this.pageSize
        };
        if(this.queryPhone){
          resellParam.userPhone = this.queryPhone;
        }
        var response = await KakaService.doPageResellOrderInquiry(resellParam);

        this.totalCount = response.total;
        if(response.status === 1 && response.data.length > 0){

          response.data.forEach(function(item, index){
            item.logDate = TimeUtils.formatTime(item.logDate, 'Y-M-D H:m:s');
          });

          var arr = ["owner","resellAccount","resellPrice"];
          response.data.forEach(function(item, index){
            var splitArr = item.logDesc?item.logDesc.split(","):[];
            splitArr.forEach(function(splitItem, i){
              item[arr[i]] = splitItem.split(":")[1];
            });
          });
          this.couponResellList = response.data;
        }else{
          this.loadingText ="暂无数据";
        }
      },
      couponStatusFilter(value, row) {
        return row.status === value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageResell();
      },
      async doResell(id, status){
        var reSellParam = {
          id: id,
          status: status
        };
        var res = await KakaService.doUpdateOrderInquiry(reSellParam);
        if(res.status == 1 && res.data == 1){
          this.$message({
            message: '转卖处理成功',
            type: 'success'
          });
          this.doPageResell();
        }
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
        this.doPageResell();
      },
      async handleDownload() {
        if(this.dateRange.length < 2){
          this.$message({
            message: '请选择开始和结束日期',
            type: 'error'
          });
          return;
        }else{
          var searchParams = {
            groupId: this.groupId,
            startingTime: this.dateRange[0],
            endTime: this.dateRange[1] + 3600 * 24 * 1000
          };
          var res = await KakaService.doPageResellOrderInquiry(searchParams);
          if(res.status === 1 && res.data.length > 0){
            res.data.forEach(function(item, index){
              item.logDate = TimeUtils.formatTime(item.logDate, 'Y-M-D H:m:s');
              item.status = item.status?'已处理':'未处理';
            });
            var arr = ["owner","resellAccount","resellPrice"];
            res.data.forEach(function(item, index){
              var splitArr = item.logDesc?item.logDesc.split(","):[];
              splitArr.forEach(function(splitItem, i){
                item[arr[i]] = splitItem.split(":")[1];
              });
            });
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['卡券名称', '所属店铺', '持有人手机号', '转卖账户', '转卖人姓名', '转卖价格', '转卖日期', '全部状态'];
              const filterVal = ['couponName', 'groupName', 'nowUserPhone', 'resellAccount', 'owner', 'resellPrice', 'logDate', 'status'];
              const list = res.data;
              const data = this.formatJson(filterVal, list);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: this.filename
              });
              this.$refs.multipleTable.clearSelection();
            });
          }else{
            this.$message({
              message: '没有数据记录！',
              type: 'error'
            });
          }
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
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
