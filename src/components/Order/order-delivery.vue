<style scoped>
    .dialog-title {
        font-weight: bold;
        margin-bottom: 20px;
    }
    .order-info-content {
        margin-bottom: 20px;
        padding: 20px;
        border: solid 1px #f5f5f5;
    }
    .order-info-content p {
        margin-bottom: 10px;
    }
</style>
<template>
    <el-dialog
            :title="order.orderEditLabel"
            :visible.sync="dialogVisible"
            width="50%">
        <!-- 待确认的订单 -->
        <div v-if="order.orderStatus ==1">
            <el-table
                    :data="[order]"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
                <el-table-column
                        label="商品"
                        align="center"
                        prop="items[0].goodsTitle">
                </el-table-column>
                <el-table-column
                        label="数量"
                        align="center"
                        prop="items[0].count">
                </el-table-column>
                <el-table-column
                        label="下单时间"
                        align="center"
                        prop="orderTime">
                </el-table-column>
                <el-table-column
                        label="状态"
                        align="center"
                        prop="orderStatusLabel">
                </el-table-column>
            </el-table>
            <div style="display: flex;margin-top: 20px">
                <p style="flex: none">备注：</p>
                <p style="flex: auto">{{order.notes}}</p>
            </div>
            <el-button type="primary" style="margin-top: 20px;" @click="doConfirm">确认订单</el-button>
        </div>
        <!-- 待发货的订单 -->
        <div v-else-if="order.orderStatus ==2">
            <p class="dialog-title">第一步 确认交易详情及收货信息</p>
            <el-table
                    :data="[order]"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
                <el-table-column
                        label="商品"
                        align="center"
                        prop="items[0].goodsTitle">
                </el-table-column>
                <el-table-column
                        label="数量"
                        align="center"
                        prop="items[0].count">
                </el-table-column>
                <el-table-column
                        label="下单时间"
                        align="center"
                        prop="orderTime">
                </el-table-column>
                <el-table-column
                        label="状态"
                        align="center"
                        prop="orderStatusLabel">
                </el-table-column>
            </el-table>
            <p style="margin-top: 20px;margin-bottom: 20px" v-if="address && address.province">买家收货信息： {{address.province}}{{address.city}}{{address.district}}{{address.detailAddress}}，{{address.post}}，{{address.receiveName}}，{{address.mobile}}</p>
            <p class="dialog-title" style="margin-top: 20px">第二步 选择物流服务</p>
            <el-form ref="form">
                <el-form-item>
                    <el-radio-group v-model="expressRadio">
                        <el-radio :label=0>自己联系快递</el-radio>
                        <el-radio :label=1>无需物流</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="*快递单号" v-if="expressRadio==0">
                    <el-input v-model="expressNo" clearable></el-input>
                </el-form-item>
            </el-form>
            <p style="" v-if="expressRadio==0">*请仔细填写快递单号，发货后24小时内仅支持做一次更正，逾期不可修改</p>
            <el-button type="primary" style="margin-top: 20px;" @click="doConfirm">确认发货</el-button>
        </div>
        <div v-else-if="order.orderStatus ==3 || order.orderStatus ==4">
            <p class="dialog-title" v-if="expressList.length">物流动态（{{expressList[0].companyName}}快递-{{order.expressNo}}）</p>
            <div class="order-info-content" v-if="expressList.length">
                <p v-for="express in expressList">{{express.updateTime}}<span style="margin-left:20px">{{express.description}} </span></p>
            </div>
            <p class="dialog-title">订单信息</p>
            <div class="order-info-content">
                <p>买家昵称：{{order.buyerName}}</p>
                <p>联系电话：{{order.buyerPhone}}</p>
                <p>订单编号：{{order.id}}</p>
                <p>订单来源：{{order.groupName}}</p>
                <p>下单时间：{{order.orderTime}}</p>
                <p v-if="address && address.province">收货地址：{{address.province}}{{address.city}}{{address.district}}{{address.detailAddress}}，{{address.post}}，{{address.receiveName}}，{{address.mobile}}</p>
            </div>
            <el-table
                    :data="[order]"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
                <el-table-column
                        label="商品"
                        align="center"
                        prop="items[0].goodsTitle">-
                </el-table-column>
                <el-table-column
                        label="单价（元）"
                        align="center"
                        prop="items[0].goodsPrice">
                </el-table-column>
                <el-table-column
                        label="数量"
                        align="center"
                        prop="items[0].count">
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
            <div style="display: flex;margin-top: 20px">
                <p style="flex: none">备注：</p>
                <p style="flex: auto">{{order.notes}}</p>
            </div>
        </div>
    </el-dialog>
</template>

<script>
  import OrderService from '@/api/OrderService'
  import TimeUtil from '@/utils/TimeUtil'
  export default {
    components: {},
    props: {
    },
    data() {
      return {
        order:{},
        tableHeaderClass: {background: '#f0f0f0'},
        dialogVisible:false,
        expressRadio:0,
        expressNo:null,
        address:{},
        expressList:[]
      }
    },
    created() {
    },
    methods: {
      doClickOrder(e) { //获取点击的order信息
        if(e.orderStatus < 0) {
          return;
        }
        this.order = e;
        console.log(this.order);
        console.log(e.payStatus)
        if(e.orderStatus ==1) { //待确认
          if(e.payStatus!=1) { //如果是未支付的状态抛错
            return this.$message.error('该订单尚未支付，请核实！');
          }
        }
        if(e.orderStatus ==2) { //发货
          this.doGetAddress();
        }
        if(e.orderStatus ==3 || e.orderStatus ==4) { //查看物流
          this.doGetAddress();
          this.doSearchExpress();
        }
        this.dialogVisible = true;
      },
      async doGetAddress() {
        var res = await OrderService.doGetAddress(this.order.buyerId,this.order.receiveAddressId);
        if(res.status!=1){
          return;
        }
        this.address = res.data;
      },
      async doSearchExpress(){
        var res = await OrderService.doSearchExpress('',this.order.expressNo,'','');
        if(res.status!=1 || !res.data || !res.data.length) {
          return
        }
        res.data.forEach(function (express) {
          express.updateTime = TimeUtil.formatTime(express.updateDate*1000, 'Y-M-D H:m');
        });
        console.log(res.data)
        this.expressList = res.data;
      },
      async doConfirm() {
        var res = null;
        if(this.order.orderStatus ==1) { //确认订单
          console.log('确认订单。。。。。。')
          res = await OrderService.doConfirmOrder(this.order.id);
        }else if(this.order.orderStatus ==2) { //确认发货
          if(this.expressRadio==0 && (!this.expressNo || this.expressNo=='')) {
            return this.$message.error('请输入快递单号！');
          }
          console.log('确认发货。。。。。。')
          res = await OrderService.doConfirmSend(this.order.id,this.expressRadio==0?this.expressNo:null);
        }
        if(!res || res.status !=1) {
          this.$message.error('处理订单出错了哦！');
          return;
        }
        this.dialogVisible = false;
        this.$emit('doConfirmSuccess');
        this.$message({
          message: '处理订单成功！',
          type: 'success'
        });
      }
    }
  }
</script>


