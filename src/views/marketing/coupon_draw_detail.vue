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
                :data="drawCouponList"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
          align="center"
          prop="userName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="券名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sexText"
          label="性别">
        </el-table-column>
        <el-table-column
          align="center"
          prop="statusLabel"
          label="全部状态"
          :filters="status"
          :filter-multiple="false"
          filter-placement="bottom-end"
          :filter-method="statusFilter">
        </el-table-column>
        <el-table-column
          align="center"
          prop="drawTime"
          label="领取时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="useTime"
          label="使用时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="area"
          label="地域">
        </el-table-column>
        <el-table-column
          align="center"
          prop="carBrandName"
          label="车品牌">
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="drawCouponList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="drawCouponList.length>0">
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
        area:'',
        couponId:this.$route.query.couponId,
        coupon:{},
        drawCouponList:[],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        status:[
          {text:"未使用", value:0},
          {text:"已使用", value:1},
          {text:"绑定中", value:2},
          {text:"已过期", value:3}
        ],
      }
    },
    created() {
      this.doGetCouponDetails();
      this.doPageDrawCouponItem();
    },
    methods: {
      statusFilter(value, row) {
        return row.status === value;
      },
      toMessageVisitDetail(messagesId){
        this.$router.push('/marketing/marketingscene/message_visit_detail?messagesId='+messagesId);
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageDrawCouponItem();
      },
      handleMenuSelect(key, keyPath){
        if(key ==1){
          this.$router.back();
        }
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
      async doPageDrawCouponItem() {
        var that = this;
        var response = await CouponService.doPageDrawCouponItem(this.couponId,this.currentPage,this.pageSize);
        this.loadingText = '暂无数据';
        this.drawCouponList = response.status==1 ? response.data : [];
        this.totalCount = response.total;
        this.drawCouponList.forEach(function (couponItem) {
          couponItem.drawTime = TimeUtil.formatTime(couponItem.drawDate,'Y/M/D H:m');
          couponItem.useTime =couponItem.useDate?TimeUtil.formatTime(couponItem.useDate,'Y/M/D H:m'):'';
          couponItem.sexText = couponItem.sex==1?'男':couponItem.sex==2?'女':'';
          switch(couponItem.status){
            case 0:
              couponItem.statusLabel = '未使用';
              break;
            case 1:
              couponItem.statusLabel = '已使用';
              break;
            case 2:
              couponItem.statusLabel = '绑定中';
              break;
            case 3:
              couponItem.statusLabel = '已过期';
              break
            case 6:
              couponItem.statusLabel = '已废弃';
              break
            default:
          }
          AreaService.doGetArea({id: couponItem.userAreaId}).then(res => {
            if(res.status == 1) {
              couponItem.area = res.data.name+res.data.nodes[0].name+res.data.nodes[0].nodes[0].name;
              console.log(couponItem.area)
            }
          });
        });
      }
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
