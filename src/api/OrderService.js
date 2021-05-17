/**
 * Created by mac on 18/1/9.
 */
import http from '@/utils/Request'
const OrderService = {
  // 增加或者修改场景营销
  async doPageAccountStatement(rootTradingAreaId,startOrderDate,endOrderDate,groupName,page,count) {
    var res = await http({
      url: 'order_doPageAccountStatement.do',
      data:{
        orderSearchModel:{
          rootTradingAreaId:rootTradingAreaId,
          orderStatus:4,
          refundStatus:1,
          deleteStatus:0,
          payType:1,
          payStatus:1,
          orderType:2,
          businessType:4003000000000000,
          sendType:4,
          startOrderDate:startOrderDate,
          endOrderDate:endOrderDate,
          groupName:groupName
        },
        page:page,
        count:count
      }
    });
    return res;
  },
  async doPageOrder(sm) {
    var res = await http({
      url: 'order_doPage.do',
      data:sm,
    });
    return res;
  },
  //获取订单详情信息
  async doGetOrderById (id) {
    var res = await http({
      url: "order_doGet.do",
      data: {id:id}
    })
    return res;
  },
  async doGetAddress(buyerId,receiveAddressId) {
    var res = await http({
      url: 'deliver_address_getById.do',
      data:{uid:buyerId,id:receiveAddressId},
    });
    return res;
  },
  async doConfirmOrder(orderId,expressNo) { //确认订单
    var res = await http({
      url: 'order_doConfirmOrder.do',
      data:{id:orderId},
    });
    return res;
  },
  async doConfirmSend(orderId,expressNo) { //发货
    var res = await http({
      url: 'order_doConfirmSend.do',
      data:{id:orderId,expressNo:expressNo},
    });
    return res;
  },
  async doSearchExpress(token, num, com, from, to, companyName) {
    var res = await http({
      url: "express_doSearchexpress.do",
      method: "POST",
      data: {
        token: token,
        num: num,
        com: com,
        from: from,
        to: to,
        companyName: companyName
      }
    })
    return res
  },
  async doStatisticalAmount(param) { //获取商户销售金额
    var res = await http({
      url: "order_doStatisticalTotalAmountNew.do",
      data: {
        orderSearchModel: param
      }
    })
    return res.data
  },

  /**
   * 添加商品到购物车
   * @param goods
   * @return {Promise<*>}
   */
  async doCartSetCount(goods) {
    var res = await http({
      url: "cart_doSetCount.do",
      data: {
          ...goods
      }
    })
    return res.data
  },

  /**
   *  生成一个出/入库订单
   * @param order
   * @return {Promise<*>}
   */
  async doOrderAdd(order) { //获取商户销售金额
    var res = await http({
      url: "order_doAdd.do",
      data: {
        ...order
      }
    })
    return res.data
  },
  async doUpdateRealPrice(orderSearchModel) { //获取商户销售金额
    var res = await http({
      url: "order_doUpdateRealPrice.do",
      data: {
       orderSearchModel:orderSearchModel
      }
    })
    return res.data
  },
  async doAdd(order) { //获取商户销售金额
    var res = await http({
      url: "order_doAdd.do",
      data: {
        ...order
      }
    })
    return res.data
  },
  async doDelete(id) { //获取商户销售金额
    var res = await http({
      url: "order_doDeleteOrder.do",
      data: {
        id:id
      }
    })
    return res.data
  }

}
export default OrderService
