<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">优惠券</div>
    <div class="app__content">
        <div>
          <el-row class="mb15">
            <el-col :span="20">
              <el-dropdown @command="toCouponAU">
                <!-- <span class="el-dropdown-link">
                  +新增一级优惠
                </span> -->
                <el-button type="primary" size="mini">
                  +添加优惠券
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="clearfix" v-for="couponType in couponTypes" :key="couponType.value" :command="couponType.value">
                    {{couponType.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-button type="primary" size="mini" @click="toCouponAU">添加优惠券</el-button> -->
            </el-col>
            <el-col :span="4" class="text-right">
              <el-input v-if="false"
                size="mini"
                placeholder="请输入搜索内容"
                clearable>
              </el-input>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="couponList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              prop="couponTypeName"
              label="卡券类型"
              width="100">
            </el-table-column>
            <el-table-column
              align="center"
              label="卡券名称"
              prop="name">
            </el-table-column>
            <el-table-column
              align="center"
              prop="validDate"
              label="卡券有效期">
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

                {{ scope.row.status| getCouponStatusName}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="库存"
              prop="count">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.count}}</span>
                  <el-popover
                    ref="couponPopover"
                    placement="top"
                    width="200"
                    v-model="scope.row.isCountShow">
                    <p style="color:#999;margin-bottom: 10px;">请输入要增加的库存数：</p>
                    <el-input size="mini" type="number" v-model="scope.row.count"></el-input>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="scope.row.count = 1;scope.row.isCountShow=false">取消</el-button>
                      <el-button type="primary" size="mini" @click="doAddCount(scope.row);scope.row.isCountShow=false">确定</el-button>
                    </div>
                  </el-popover>
                  <span class="operation" v-popover:couponPopover @click="scope.row.isCountShow=true"><i class="el-icon-edit"></i></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button class="ml10" type="text" size="small" v-popover:popover @click="toDrawDetail(scope.row.id)">领取详情</el-button>
                <el-button type="text" size="small" @click="toCancelStatic(scope.row.id)">核销统计</el-button>
                <el-popover
                  ref="popover"
                  placement="top"
                  width="200"
                  v-model="scope.row.visible">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="doDelete(couponList[scope.$index].id),scope.row.visible = false">确定</el-button>
                  </div>
                </el-popover>
                <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
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

  export default {
    data() {
      return {
        addCount: 1,
        couponList: [],
        groupId: cacheCookies.getGroupId(),
        groupRoleId: "2c933e6b62cd01560162cd2c8f570017", //报销平台店铺角色id
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
          {text:"已停止", value:-4},
          {text:"已领完", value:-3},
          {text:"已到期", value:-1},
          {text:"领取中", value:0}
        ],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      //查询商圈，如果存在则允许添加报销券
      this.doGetTradingAreaByGroupId();
      this.doPageAdmin();
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
      async doPageAdmin(){
        this.couponList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var that = this;
        var response = await CouponService.doPageAdmin({
          groupId: cacheCookies.getGroupId(),
          status: 0,
          userType: 'groupUser',
          couponType: '',
          page:this.currentPage,
          count:this.pageSize
        });

        this.totalCount = response.total;
        if(response.status === 1 && response.data.length > 0){
          //console.log(response);
          response.data.forEach(function(item,index){
            var newCoupon = {};
            newCoupon.id = item.id;
            newCoupon.name = item.name; //券名
            newCoupon.status = item.status;
            newCoupon.dateType = item.dateType; //日期类型
            newCoupon.pairStartDate = item.pairStartDate;
            newCoupon.pairEndDate = item.pairEndDate;
            newCoupon.count = item.count; //库存

            if(item.dateType == 1) { //如果是指定日期，需要转换为日期格式(年.月.日)
              newCoupon.validDate = TimeUtils.formatTime(item.pairStartDate, 'Y-M-D') +"至" + TimeUtils.formatTime(item.pairEndDate, 'Y-M-D');
            } else if(item.dateType == 3) {
              newCoupon.validDate = "永久";
            } else{
              newCoupon.validDate = "领取后"+item.pairStartDate+"天生效"+item.pairEndDate+"天有效";
            }

            switch(item.couponType) {
                case 1: //代金券
                    newCoupon.couponTypeName = '代金券';
                    break;
                case 3: //计次券
                    newCoupon.couponTypeName = '计次券';
                    break;
                case 4: //结伴券
                    newCoupon.couponTypeName = '结伴券';
                    break;
                case 5: //折扣券
                    newCoupon.couponTypeName = '折扣券';
                    break;
                case 8: //报销券
                    newCoupon.couponTypeName = '报销券';
                    break;
            }

            /*switch(item.status) {//券状态
                case -4:
                    newCoupon.statusName = '已停止';
                    break;
                case -3: //后期需要加上推广方式判断
                    newCoupon.statusName = '已领完';
                    break;
                case -1:
                    newCoupon.statusName = '已到期';
                    break;
                case 0: //后期需要加上推广方式判断
                    newCoupon.statusName = '领取中';
                    break;
            }
            switch(item.couponType) {
                case 1: //优惠券
                    newCoupon.couponTypeName = item.reducePrice + '元';
                    break;
                case 3: //计次券
                    newCoupon.couponTypeName = item.useCount + '次';
                    break;
                case 4: //结伴券
                    newCoupon.couponTypeName = item.companyMembers + '人';
                    break;
                case 5: //折扣券
                    newCoupon.couponTypeName = item.discount + '折';
                    break;
            }*/
            that.couponList.push(newCoupon);
          })
        }else{
          this.loadingText ="暂无数据";
        }
      },
      //查询所属商圈
      async doGetTradingAreaByGroupId(){
        var response = await GroupService.doGetTradingAreaByGroupId({
          groupId: this.groupId,
          groupRoleId: this.groupRoleId
        });
        if(response.status == 1){
          //根据groupType判断是否有商圈，如果有则允许添加报销券
          if(response.data.groupType && response.data.groupType == 101){
            var ct = {value:8, label: "报销券"};
            this.couponTypes.push(ct);
          }
        }else{
          this.$message({
            message: '获取商圈信息失败',
            type: 'error'
          });
        }
      },
      couponStatusFilter(value, row) {
        return row.status === value;
      },
      async doAddCount(row){
        if(this.addCount<=0){
          this.$message({
            message: '增加库存数不能少于1',
            type: 'error'
          });
          this.addCount = 1;
          return;
        }
        var res = await CouponService.doAddCouponCount({
          couponId: row.id,
          count: this.addCount
        });
        if(res.data == 0){
          this.$message({
            message: '增加库存成功',
            type: 'success'
          });
          this.doPageAdmin();
        }else{
          this.$message({
            message: '增加库存失败',
            type: 'error'
          });
        }
        this.addCount = 1;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageAdmin();
      },
      async doDelete(couponId) { //删除优惠券
        var response = await CouponService.doDeleteCoupon(couponId);
        if(response.status === 1){
          this.doPageAdmin();
        }
      },
      /**
       * 跳转到新增或修改券
       * 新增需要传券类型，修改则传券id
       */
      toCouponAU(param) {
        //console.log(param);
        var url = "/marketing/coupon/coupon_au?";
        if(typeof param === "string") {
          url = url + "id=" + param;
        } else{
          url = url + "couponType=" + param;
        }
        this.$router.push(url);
      },
      toDrawDetail(couponId) {
        this.$router.push("/marketing/coupon/coupon_draw_detail?couponId="+couponId);
      },
      toCancelStatic(couponId) {
        this.$router.push("/marketing/coupon/coupon_cancel_statistics?couponId="+couponId);
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
