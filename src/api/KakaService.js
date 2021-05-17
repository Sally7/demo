import http from '@/utils/Request'
const KakaService = {
  // 查询某种卡可发张数
  async doGetUsableCouponItemCount(groupId, couponId) {
    var res = await http({
      url: 'coupon_doGetUsableCouponItemCount.do',
      data: {groupId:groupId, couponId:couponId},
    });
    return res;
  },
  // 增加某种卡可发张数
  async doGenerateCouponItem(params) {
    var res = await http({
      url: 'coupon_doGenerateCouponItem.do',
      data: params,
    });
    return res;
  },
  // 批量发卡
  async doBatchIssueCouponItem(params) {
    var res = await http({
      url: 'coupon_doBatchIssueCouponItem.do',
      data:params,
    });
    return res;
  },
  // 查询某种卡的领取情况
  async doPageCouponItemDetails(params) {
    var res = await http({
      url: 'coupon_doPageCouponItemDetails.do',
      data:params,
    });
    return res;
  },
  // 根据用户手机号查询用户领取的卡
  async doPageCouponItemByUserPhone(params) {
    var res = await http({
      url: 'coupon_doPageCouponItemByUserPhone.do',
      data:params,
    });
    return res;
  },
  // 卡持有人变更
  async doAmendGiveCouponItem(params) {
    var res = await http({
      url: 'coupon_doAmendGiveCouponItem.do',
      data:params,
    });
    return res;
  },
  // 变现查询
  async doPageResellOrderInquiry(params) {
    var res = await http({
      url: 'coupon_doPageResellOrderInquiry.do',
      data:params,
    });
    return res;
  },
  // 兑换查询
  async doPageExchangeOrderInquiry(params) {
    var res = await http({
      url: 'coupon_doPageExchangeOrderInquiry.do',
      data:params,
    });
    return res;
  },
  // 转卖/兑换标记订单已处理
  async doUpdateOrderInquiry(params) {
    var res = await http({
      url: 'coupon_doUpdateOrderInquiry.do',
      data:params,
    });
    return res;
  },
  // 根据couponId查询套餐
  async searchKSku(params) {
      var res = await http({
          url: 'coupon_searchKSku.do',
          data: params,
      });
      return res;
  },
  // 添加套餐
  async addKSku(params) {
    var res = await http({
      url: 'coupon_addKSku.do',
      data:params,
    });
    return res;
  },
  // 修改套餐
  async updateKSku(params) {
    var res = await http({
      url: 'coupon_updateKSku.do',
      data:params,
    });
    return res;
  },
  // 删除套餐
  async deleltKSkuById(params) {
    var res = await http({
      url: 'coupon_deleltKSkuById.do',
      data:params,
    });
    return res;
  },
  // 修改价格区域显示内容
  async updateCoverSummary(params) {
    var res = await http({
      url: 'coupon_updateCoverSummary.do',
      data:params,
    });
    return res;
  },
  // 根据关键字搜索卡
  async pageSearchCoupon(name) {
    var res = await http({
      url: 'coupon_pageSearchCoupon.do',
      data: {name: name},
    });
    return res;
  },
  // 修改当前回收基准价
  async modifiedBasePrice(params) {
    var res = await http({
      url: 'coupon_modifiedBasePrice.do',
      data: params,
    });
    return res;
  },
  /*// 查询套餐
  async searchKSku(params) {
    var res = await http({
      url: 'coupon_searchKSku.do',
      data:params,
    });
    return res;
  },*/
}
export default KakaService
