<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">订单管理</div>
    <div class="app__content">
      <el-col v-for="searchItem in searchList" :key="searchItem.type">
        <div style="flex: none;margin-right: 20px">{{searchItem.name}}</div>
        <el-date-picker type="datetime" :placeholder="'请选择'+searchItem.name" v-model="searchItem.value" v-if="searchItem.type==0" style="width: 300px"></el-date-picker>
        <el-input :placeholder="'请输入'+searchItem.name" v-model="searchItem.value" clearable v-if="searchItem.type==1" style="width: 300px"></el-input>
        <el-select v-model="searchItem.value" :placeholder="'请选择'+searchItem.name" v-if="searchItem.type==2" style="width: 300px">
          <el-option
            v-for="item in searchItem.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col>
        <el-button type="primary" @click="doSearching">搜索</el-button>
        <el-button @click="doResetting">重置</el-button>
        <el-button type="primary" @click="doExport">导出</el-button>
      </el-col>
      <el-table
        订单来源
        :data="orderList"
        border
        :header-row-style="tableHeaderClass"
        style="width: 100%">
        <el-table-column
          label="商品"
          align="center"
          prop="items[0].goodsTitle"
          width="360">
          <template slot-scope="scope">
            <div class="goods-item-body">
              <div class="goods-item-cell" v-for="item in scope.row.items">
                <img class="goods-info__img" :src="item.showGoodsImageUrl" alt="">
                <div class="goods-info__info">
                  <div class="goods-title">
                    <a href="" rel="noopener noreferrer" target="_blank">{{item.goodsTitle}}</a>
                  </div>
                  <div class="goods-skus">
                    <span class="goods-sku">{{item.skuLabel}}</span>
                  </div>
                  <div class="goods-tags">
                  </div>
                </div>
                <div class="goods-info__price">
                  <div>￥{{item.realPrice}}</div>
                  <div>{{item.count}}件</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="售后"
          align="center"
          prop="refundStatusLabel">
        </el-table-column>
        <el-table-column
          label="买家/收货人"
          align="center"
          prop="buyerName">
        </el-table-column>
        <el-table-column
          label="配送方式"
          align="center"
          prop="sendType">
        </el-table-column>
        <el-table-column
          label="实收金额(元)"
          align="center"
          prop="realPrice">
        </el-table-column>

        <el-table-column
          label="下单时间"
          align="center"
          prop="orderTime">
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.payStatus ==1">{{scope.row.orderStatusLabel}}</p>
            <p>{{scope.row.paymentStatusLabel}}</p>
          </template>
        </el-table-column>


        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <p style="color: #1685F8" @click="doClickOrder(scope.row)" v-if="(scope.row.refundStatus==1&&scope.row.payStatus==1)">{{scope.row.orderEditLabel}}</p>
            <div style="display: flex;justify-content:center;color: #1685F8" @click="toOrderDetail(scope.row)">
              <p>详情</p>
              <p>-备注</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="orderList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="orderList.length>0">
      </el-pagination>
      <orderDelivery ref="orderDelivery" v-on:doConfirmSuccess="doConfirmSuccess" />
    </div>
  </div>
</template>
<script>
  import GroupService from '@/api/GroupService'
  import OrderService from '@/api/OrderService'
  import ConfigUtil from '@/utils/ConfigUtil'
  import cacheCookies from '@/utils/auth'
  import TimeUtil from '@/utils/TimeUtil'
  import orderDelivery from '@/components/Order/order-delivery'
  import Cookies from 'js-cookie'
  import configUtil from '@/utils/ConfigUtil'

  export default {
    data(){
      return {
        input: '',
        tableHeaderClass: {background: '#f0f0f0'},
        searchList:[{
          key:'startOrderDate',type:0,name:'开始时间',value:''},{
          key:'endOrderDate',type:0,name:'结束时间',value:''},{
          key:'id',type:1,name:'订单号',value:''},{
          key:'buyerName',type:1,name:'下单人',value:''},{
          key:'buyerPhone',type:1,name:'下单人手机',value:''},{
          key:'orderStatus',type:2,name:'订单状态',value:'',options:[{value:null,label:'全部'},{value:1,label:'用户新提交的订单'},{value:2,label:'商户处理中(待发货)'},{value:3,label:'已处理(已发货)'},{value:4,label:'完成'},{value:5,label:'取消'}]},{
          key:'payStatus',type:2,name:'支付状态',value:'',options:[{value:null,label:'全部'},{value:0,label:'等待支付'},{value:1,label:'支付成功'},{value:-1,label:'支付失败'},{value:-2,label:'支付作废'}]},{
          key:'refundStatus',type:2,name:'退款状态',value:'',options:[{value:null,label:'全部'},{value:1,label:'未退款'},{value:2,label:'申请退款中'},{value:3,label:'退款中'},{value:4,label:'已退款'},{value:5,label:'拒绝退款'}]}],
        orderList:[],
        currentPage:1, //当前选中的页数
        totalCount:0,//总的数据页数
        pageSize:10,//每页放多少条数据
        orderSearchModel:{orderSearchModel:{}},
      }
    },
    components: {
      orderDelivery
    },
    created(){
      this.doGetOneGroup();
    },
    methods: {
      async doGetOneGroup() {
        var res = await GroupService.doGetOneGroup(cacheCookies.getGroupId());
        if(res.status ==1 && res.data && res.data.groupType==101) { //商圈
          this.orderSearchModel.orderSearchModel.tradingAreaId = res.data.id;
        } else { //普通店铺
          this.orderSearchModel.orderSearchModel.groupId = res.data.id;
        }
        this.doPageOrder();
      },
      doResetting() {
        console.log('重置。。。。。。。');
        this.searchList.forEach(function (searchItem) {
          searchItem.value = "";
        });
        this.orderSearchModel={orderSearchModel:{}};
        this.doGetOneGroup();
      },
      doSearching() {
        console.log('搜索。。。。。。。');
        this.currentPage = 1;
        var that = this;
        this.searchList.forEach(function (searchItem) {
          if(searchItem.value=='' && searchItem.value!=0) {
            return
          }
          if(searchItem.key== 'startOrderDate' || searchItem.key== 'endOrderDate') {
            that.orderSearchModel['orderSearchModel'][searchItem.key] = new Date(searchItem.value).getTime(); //中国标准时间转时间戳
          }else {
            that.orderSearchModel.orderSearchModel[searchItem.key] = searchItem.value;
          }
        });
        this.doPageOrder();
      },
      handleCurrentChange(page) {
        this.currentPage = page;
        this.doPageOrder();
      },
      async doPageOrder() {
        if(Cookies.get("currentPage")) {
          this.currentPage = Cookies.get("currentPage");
          Cookies.remove("currentPage");
        }
        this.orderSearchModel['page'] = this.currentPage;
        this.orderSearchModel.orderSearchModel.needItems = 1;
        this.orderSearchModel['count'] = this.pageSize;
        this.orderSearchModel.orderSearchModel.orderType = 1;
        var res = await OrderService.doPageOrder(this.orderSearchModel);
        if(res.status!=1) {
          return
        }
        res.data.forEach(function (order) {
          order.paymentStatusLabel = ConfigUtil.getPaymentStatus(order.payStatus);
          order.refundStatusLabel = ConfigUtil.getRefundStatus(order.refundStatus);
          order.orderStatusLabel = ConfigUtil.getOrderStatus(order.orderStatus)[0];
          order.orderEditLabel = ConfigUtil.getOrderStatus(order.orderStatus)[1];
          order.orderTime = TimeUtil.formatTime(order.orderDate,'Y-M-D H:m');
        });
        this.totalCount = res.total;
        this.orderList = res.data;
      },
      async doExport() {
        var that = this;
        this.orderSearchModel.orderSearchModel.needItems = 1;
        this.orderSearchModel.orderSearchModel.payType = 4;
        this.searchList.forEach(function (searchItem) {
          if(searchItem.value=='' && searchItem.value!=0) {
            return
          }
          if(searchItem.key== 'startOrderDate' || searchItem.key== 'endOrderDate') {
            that.orderSearchModel['orderSearchModel'][searchItem.key] = new Date(searchItem.value).getTime(); //中国标准时间转时间戳
          }else {
            that.orderSearchModel.orderSearchModel[searchItem.key] = searchItem.value;
          }
        });

        window.location.href = process.env.BASE_API + "/order_doExportOrdersExcel.do?"+configUtil.toTransformRequestBodyParameters(this.orderSearchModel);
      },
      toOrderDetail(order) {
        console.log(order);
        Cookies.set("currentPage", this.currentPage);
        this.$router.push("/group/order/order_detail?orderId="+ order.id);
      },
      doClickOrder(e) {
        console.log(e);
        this.$refs.orderDelivery.doClickOrder(e); //调用子组件的方法
      },
      doConfirmSuccess() { //发货或者确认订单的回调
        this.doPageOrder();
      }
    },

  }
</script>
<style>
  .el-col {
    flex: none;
    width: 30%;
    height: 50px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    margin-right: 20rpx;
  }

  .el-table-column {
    border: solid 1rpx red;
  }

  .goods-item-body{
  }

  .cell .goods-item-cell:last-child {
    border-bottom:  none;
  }

  .goods-item-cell {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    border-bottom:1px solid #ebeef5;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .goods-item-cell .goods-info__img {
    width: 60px;
    height: 60px;
    max-width: 60px;
    max-height: 60px;
    min-width: 60px;
    margin-right: 10px;
  }

  .goods-item-cell .goods-info__info {
    flex-grow: 1;
    text-align: left;
  }

  .goods-item-cell .goods-info__info .goods-title {
    margin-bottom: 10px;
    word-break: break-all;
  }

  .goods-item-cell .goods-info__info .goods-skus {
    margin-bottom: 4px;
  }

  .goods-item-cell .goods-info__price {
    min-width: 120px;
    text-align: right;
    box-sizing: border-box;
  }
</style>
