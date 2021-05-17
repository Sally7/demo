<template>
    <div class="app-container" id="wrapper">
        <div class="app__content">
            <Breadcrumb class="breadcrumb-container"></Breadcrumb>
            <div class="coupon_tip">
                <div class="coupon_tip_content">
                    <p class="coupon_name">{{coupon.name}}</p>
                    <p class="coupon_center">
                        <span class="coupon_desc">{{coupon.couponDesc}}</span><br />
                        <span class="coupon_condition">{{coupon.useKnow}}</span>
                    </p>
                    <p class="coupon_drawTime">有效日期: {{coupon.carValidity}}</p>
                </div>
            </div>
            <el-table :empty-text="loadingText"
                      :data="couponDetailList"
                      :header-row-style="tableHeaderClass"
                      style="width: 100%">
                <el-table-column
                        align="center"
                        prop="groupName"
                        label="商户名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="toUserName"
                        label="用户">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="sex"
                        label="性别">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="cancelTime"
                        label="核销时间">
                </el-table-column>
            </el-table>
            <div class="counts-wrap mb15" v-if="couponDetailList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
            <el-pagination class="text-right"
                           background
                           layout="prev, pager, next"
                           :page-size="pageSize"
                           :total="totalCount"
                           :current-page="currentPage"
                           @current-change="handleCurrentChange"
                           v-if="couponDetailList.length>0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import CouponService from '@/api/CouponService'
  import TimeUtil from '@/utils/TimeUtil'
  import Breadcrumb from '@/components/Breadcrumb'
  import AreaService from '@/api/AreaService'
  export default {
    components: {Breadcrumb},
    data() {
      return {
        couponId:this.$route.query.couponId,
        groupId:this.$route.query.groupId,
        coupon:{},
        couponDetailList:[],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
      }
    },
    created() {
      this.doGetCouponDetails();
      this.doPageUseCouponDetails();
    },
    methods: {
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageUseCouponDetails();
      },
      async doGetCouponDetails(){
        var response = await CouponService.doGetCouponDetails(this.couponId);
        this.coupon = response.data;
        switch(response.data.dateType){
          case 1: //正常的时间
            this.coupon.carValidity = TimeUtil.formatTime(this.coupon.pairStartDate,'Y-M-D H:m:s')+' 至 '+TimeUtil.formatTime(this.coupon.pairEndDate,'Y-M-D H:m:s');
            break;
          case 2: //规定了领取生效时间和领取结束时间
            this.coupon.carValidity = '领取后'+this.coupon.pairStartDate+'天生效'+this.coupon.pairEndDate+'天有效'
            break;
          case 3: //永久有效
            this.coupon.carValidity = '永久有效'
            break;
          default:
        }

        this.coupon.drawStartTime = TimeUtil.formatTime(this.coupon.pairStartDate,'Y-M-D H:m:s')
        this.coupon.drawEndTime = TimeUtil.formatTime(this.coupon.pairEndDate,'Y-M-D H:m:s')
      },
      async doPageUseCouponDetails() {
        var response = await CouponService.doPageGroupUseCouponDetails(this.groupId,this.couponId,this.currentPage,this.pageSize);
        this.loadingText = '暂无数据';
        this.totalCount = response.total;
        if(response.status!=1) {
          return;
        }
        response.data.forEach(function (coupon) {
          coupon.cancelTime = TimeUtil.formatTime(coupon.logDate,'Y-M-D H:m:s');
          coupon.sex = coupon.toUserSex==1?'男':'女';
        });
        this.couponDetailList=this.couponDetailList.concat(response.data);
      },
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
    .breadcrumb-container{
        padding-left:8px;
    }
    .coupon_tip{
        height: 220px;
        width:100%;
        padding-top:20px;
        padding-bottom: 50px;
    }
    .coupon_tip_content{
        width: 35%;
        height: 150px;
        background-color: #fe3851;
        padding: 10px;
    }
    .coupon_name{
        font-family:Arial,Verdana,Sans-serif;
        font-size: 130%;
        color: white;
    }
    .coupon_center{
        text-align: center;
    }
    .coupon_desc{
        font-family:Arial,Verdana,Sans-serif;
        font-size: 160%;
        color: white;
    }
    .coupon_condition{
        font-family:Arial,Verdana,Sans-serif;
        font-size: 130%;
        color: white;
    }
    .coupon_drawTime{
        font-family:Arial,Verdana,Sans-serif;
        font-size: 100%;
        color: white;
    }
</style>
