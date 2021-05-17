<style>
  .steps {
    padding: 50px 0;
    border-bottom: solid 1px #e5e5e5;
  }
  .order-status {
    border: solid 1px #e5e5e5;
    margin-top: 10px;
    padding: 20px;
  }
  .order-status p {
    padding-bottom: 20px;
  }
  .order-status button {
    width: 100px;
  }
  .order-info {
    margin-top: 20px;
  }
  .order-info-content {
    padding: 20px;
    border: solid 1px #f5f5f5;
  }
  .order-info-content p {
    margin-bottom: 10px;
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
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">订单详情</div>
    <div class="app__content">
      <el-steps :active="orderStatus.active" finish-status="success" align-center class="steps">
        <el-step :title="step.title" :description="step.time" v-for="(step,index) in orderStatus.steps" :key="index"></el-step>
      </el-steps>
      <div class="order-status" v-if="false">
        <p>当前订单状态：商品已拍下，等待买家付款</p>
        <el-button type="danger">关闭交易</el-button>
        <el-button>备注</el-button>
      </div>
      <div class="order-info">
        <p style="margin-bottom: 20px">订单信息</p>
        <div class="order-info-content">
          <p>买家昵称：{{order.buyerName}}</p>
          <p>联系电话：{{order.buyerPhone}}</p>
          <p>订单编号：{{order.id}}</p>
          <p>订单来源：{{order.groupName}}</p>
          <div style="display: flex;">
            <p style="flex: none">备注：</p>
            <p style="flex: auto">{{order.notes}}</p>
          </div>
          <p>下单时间：{{order.orderTime}}</p>
          <p>收货地址：{{address.province}}{{address.city}}{{address.district}}{{address.detailAddress}}，{{address.post}}，{{address.receiveName}}，{{address.mobile}}</p>
          <el-table
            :data="[order]"
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
              label="下单时间"
              align="center"
              prop="orderTime">
            </el-table-column>
            <el-table-column
              label="交易状态"
              align="center"
              prop="paymentStatusLabel">
            </el-table-column>
            <el-table-column
              label="实收款"
              align="center"
              prop="realPrice">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
        <el-button size="small" @click="back">返回</el-button>
        <el-button size="small" type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import OrderService from '@/api/OrderService'
  import ConfigUtil from '@/utils/ConfigUtil'
  import TimeUtil from '@/utils/TimeUtil'

  export default {
    data(){
      return {
        tableHeaderClass: {background: '#f0f0f0'},
        order:{},
        address:{},
        orderStatus:{active:0,steps:[]}
      }
    },
    created(){
      this.doGetOrderById();
    },
    methods: {
      async doGetOrderById() {
        var res = await OrderService.doGetOrderById(this.$route.query.orderId);
        if(res.status!=1){
          return;
        }
        res.data.orderTime = TimeUtil.formatTime(res.data.orderDate,'Y-M-D H:m');
        res.data.paymentStatusLabel = ConfigUtil.getPaymentStatus(res.data.payStatus);
        this.order = res.data;
        this.doGetOrderStatusSteps();
        this.doGetAddress();
      },
      async doGetAddress() {
        var res = await OrderService.doGetAddress(this.order.buyerId,this.order.receiveAddressId);
        if(res.status!=1){
          return;
        }
        this.address = res.data;
      },
      doGetOrderStatusSteps() {
        if(this.order.payStatus ==1) { //已付款
          this.orderStatus.active = 2;
        }
        if(this.order.orderStatus ==1) { //待确认
          this.orderStatus.active = 3;
        }
        if(this.order.orderStatus ==3) { //已处理完成，商户发货中
          this.orderStatus.active = 4;
        }
        if(this.order.orderStatus ==4) { //交易成功，确认(收货)
          this.orderStatus.active = 5;
        }
        this.orderStatus.steps = [{title:'买家下单',time:''},{title:'买家付款',time:''},{title:'待确认',time:''},{title:'发货',time:''},{title:'买家收货',time:''}];
        if(this.order.orderDate && this.order.orderDate!='') {
          this.orderStatus.steps[0].time = TimeUtil.formatTime(this.order.orderDate,'Y-M-D H:m')
        }
        if(this.order.completeDate && this.order.completeDate!='') {
          this.orderStatus.steps[4].time = TimeUtil.formatTime(this.order.completeDate,'Y-M-D H:m')
        }
      },
      back(){
        this.$router.go(-1);//返回上一层
      }
    }
  }
</script>
