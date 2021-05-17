<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">卡券核销</div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-col :span="8" class="text-left">
          <el-input ref="couponItemNumInput" v-model="couponItemNum" @input="inputChange" placeholder="扫码获取卡券ID" clearable ></el-input>
        </el-col>
        <el-col :span="8" class="text-left">
          <el-button type="primary" @click="doGetUseCouponItem()">搜索</el-button>
          <el-button type="primary" @click="usePrintToday()">打印今日统计</el-button>

        </el-col>
      </el-row>
      <el-table :empty-text="loadingText"
                :data="couponItemList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          prop="user.name"
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
          label="全部状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==4?'success':'warning'">
              {{ scope.row.statusLabel }}
            </el-tag>
          </template>
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
          label="操作">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="200"
              trigger="click"
              v-if="scope.row.status==4"
              v-model="scope.row.visible">
              <p>确定核销{{couponItemList[scope.$index].name}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doUse(couponItemList[scope.$index].id),scope.row.visible = false">确定</el-button>
              </div>
              <el-button  class="ml10" type="text" slot="reference">核销</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import CouponService from '@/api/CouponService'
  import UserService from '@/api/UserService'
  import TimeUtil from '@/utils/TimeUtil'
  import Breadcrumb from '@/components/Breadcrumb'
  import AreaService from '@/api/AreaService'
  import PrinterService from '@/api/PrinterService'
  import UserCardTypeService from '@/api/UserCardTypeService'

  export default {
    components: {Breadcrumb},
    data() {
      return {
        area:'',
        empUser:null,
        userCard:null,
        coupon:{},
        couponItemNum:"",
        couponItemList:[],
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
    async created() {
      this.$nextTick(() => {
        this.$refs['couponItemNumInput'].focus();
      })

      this.empUser = await  UserService.doGetMyInfo();
      this.doGetUseCouponItem();
    },
    methods: {
      usePrint(){
        var couponItem = this.couponItemList[0];
        var printModel = { "name": couponItem.name, "couponNum": couponItem.couponNum, "userName": couponItem.user.name, "phone": couponItem.user.phone, "empName": this.empUser.name,account:this.empUser.account, useDate: TimeUtil.formatTime(new Date().getTime(), 'M-D H:m:s')};

       if(this.userCard) {
         printModel.userName = printModel.userName+"("+this.userCard.userCardType.name+")"
       }
        //console.log(printModel);
        var printT = {"id":"1","type":"1","name":"核销单","lines":[{"type":"text","items":[{"pos":"12","size":"3","align":"center","key":"title","type":"text","text":"核销单"}]},{"type":"br","count":1},{"type":"text","items":[{"pos":"12","size":"3","align":"left","key":"name","type":"var","text":"票种：%s"}]},{"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"couponNum","type":"var","text":"票号：%s"}]},{"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"userName","type":"var","text":"顾客：%s"}]},{"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"phone","type":"var","text":"电话：%s"}]},{"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"empName","type":"var","text":"核销员：%s"}]},{"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"account","type":"var","text":"工号：%s"}]},{"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"useDate","type":"var","text":"核销时间：%s"}]}]};
        var printData = PrinterService.genPrintData(printT, printModel);
        PrinterService.print(printData);
      },
      async usePrintToday(){
        var printModel = {"title":TimeUtil.formatTime(new Date(),'M-D H:m')+"核销统计","empName":this.empUser.name+" "+this.empUser.account};
        var printT = {"id":"1","type":"1","name":"","lines":[{"type":"text","items":[{"pos":"12","size":"3","align":"center","key":"title","type":"var","text":"%s"}]},{"type":"text","items":[{"pos":"12","size":"1","align":"center","key":"empName","type":"var","text":"%s"}]},{"type":"line","count":1}]};

        var dayRange = TimeUtil.getDayRange(new Date().getTime());
        var sm =  {type:"custom", startDate:dayRange[0], endDate:dayRange[1]};
        var searchModel = {groupId:this.empUser.companyId, logType:6, userId:this.empUser.id};
        var todayDatas = await CouponService.doStatisticGroupByCoupon(sm, searchModel, 1, 30);

        todayDatas.forEach(function (data, i) {
          printT.lines.push({"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"key"+i,"type":"text","text":data.key+":"+data.data}]});
        })
        printT.lines.push({"type":"text","items":[{"pos":"12","size":"2","align":"left","key":"key","type":"text","text":'---'}]});

        var printData = PrinterService.genPrintData(printT, printModel);

        PrinterService.print(printData);
      },
      statusFilter(value, row) {
        return row.status === value;
      },
      async doGetUseCouponItem() {
        var that = this;
        var coupon= await CouponService.doGetCouponItemByCouponNum(this.couponItemNum);
        console.log(coupon);
        if(!coupon || !coupon.couponItems) {
          this.loadingText = "暂无数据";
          return ;
        }

        for (var index =0; index < coupon.couponItems.length; index++) {
          var couponItem = coupon.couponItems[index];
          if(!couponItem.user) {
            couponItem.user = await UserService.doGetUserById(couponItem.userId);
          }

          couponItem.drawTime = TimeUtil.formatTime(couponItem.drawDate,'Y/M/D H:m');
          couponItem.useTime = couponItem.useDate?TimeUtil.formatTime(couponItem.useDate,'Y/M/D H:m'):'';
          couponItem.sexText = couponItem.user.sex==1?'男':couponItem.sex==2?'女':'';
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
            case 4:
              couponItem.statusLabel = '正常';
              break
            case 6:
              couponItem.statusLabel = '已废弃';
              break
            default:
          }
        }
        this.couponItemList = coupon.couponItems;

        //加载该会员的会员卡
        var userCards = await UserCardTypeService.doSearchUserCard(coupon.couponItems[0].user.id, this.empUser.companyId);
        if(userCards && userCards.length>0) {
          this.userCard = userCards[0];
        }
        console.log(this.couponItemList);
      },
      async doUse(couponItemId) {
        var consumeRes = await CouponService.doBatchConsumeCouponItems(couponItemId);
        if(consumeRes.status == 1) {
          this.$message({
            showClose: true,
            message: this.couponItemList[0].user.name+":"+this.couponItemList[0].name+"核销成功！",
            type: 'success'
          });

          this.usePrint();
        } else {
          this.$message({
            showClose: true,
            message: consumeRes.data+"，核销失败！",
            type: 'error'
          });
        }
        await this.doGetUseCouponItem();
        this.couponItemNum = "";
        this.$refs['couponItemNumInput'].focus();
      },
      inputChange(e){
        console.log(e);
        if(e.length > 5) {
          this.doGetUseCouponItem();
        }
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
