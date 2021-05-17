/**
 * Created by mac on 18/1/5.
 */
import http from '@/utils/Request'
const CouponService = {
  // 查询所有获取商户的券
  async doPageAdmin(params) {
    var res = await http({
      url: 'coupon_doPageAdmin.do',
      data:params,
    });
    return res;
  },
  doGetCouponModel (coupon) { // 根据商户券的coupon对象封装需要显示的样式
    var tempCoupon = {id: '', couponItems:[],color: '', logoImage:'', receivedIdentImg:'',openWeChatCouponId:'',couponName: '', couponDes: '', couponStyle: '', couponCondition: '', receiveStatus: 0, receiveDes: ''}
    switch (coupon.couponType) {
      case 1: { // 代金券
        tempCoupon.id = coupon.id
        tempCoupon.couponItems=coupon.couponItems
        tempCoupon.logoImage = '../../assets/coupon_type1.jpg'
        tempCoupon.openWeChatCouponId = coupon.openWeChatCouponId
        tempCoupon.color = coupon.color
        tempCoupon.couponName = coupon.name
        tempCoupon.couponDes = coupon.couponDesc
        tempCoupon.couponStyle = '￥' + coupon.reducePrice
        if (coupon.meetPrice > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetPrice + '元可用'
        } else if (coupon.meetCount > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetCount + '件可用'
        }
        tempCoupon.receiveStatus = coupon.isReceives
        if (tempCoupon.receiveStatus === 0) {
          tempCoupon.receiveDes = '点击领取'
        } else if (coupon.isReceives === 1) {
          tempCoupon.receiveDes = '去使用'
          tempCoupon.receivedIdentImg= '../../assets/received.png'
        } else { // 已领取未到使用时间
          tempCoupon.receiveDes = '暂不可用'
        }

        break
      }
      case 3: { // 计次券
        tempCoupon.id = coupon.id
        tempCoupon.couponItems=coupon.couponItems
        tempCoupon.logoImage = '../../assets/coupon_type3.jpg'
        tempCoupon.openWeChatCouponId = coupon.openWeChatCouponId
        tempCoupon.color = coupon.color
        tempCoupon.couponName = coupon.name
        tempCoupon.couponDes = coupon.couponDesc
        tempCoupon.couponStyle = coupon.useCount + '次'
        if (coupon.meetPrice > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetPrice + '元可用'
        } else if (coupon.meetCount > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetCount + '件可用'
        }
        tempCoupon.receiveStatus = coupon.isReceives
        if (tempCoupon.receiveStatus === 0) {
          tempCoupon.receiveDes = '点击领取'
        } else if (coupon.isReceives === 1) {
          tempCoupon.receiveDes = '去使用'
          tempCoupon.receivedIdentImg= '../../assets/received.png'
        } else { // 已领取未到使用时间
          tempCoupon.receiveDes = '暂不可用'
        }

        break
      }
      case 4: { // 结伴券
        tempCoupon.id = coupon.id
        tempCoupon.couponItems=coupon.couponItems
        tempCoupon.logoImage = '../../assets/coupon_type4.jpg'
        tempCoupon.openWeChatCouponId = coupon.openWeChatCouponId
        tempCoupon.color = coupon.color
        tempCoupon.couponName = coupon.name
        tempCoupon.couponDes = coupon.couponDesc
        tempCoupon.couponStyle = coupon.companyMembers + '人'
        if (coupon.meetPrice > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetPrice + '元可用'
        } else if (coupon.meetCount > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetCount + '件可用'
        }
        tempCoupon.receiveStatus = coupon.isReceives
        if (tempCoupon.receiveStatus === 0) {
          tempCoupon.receiveDes = '点击领取'
        } else if (coupon.isReceives === 1) {
          tempCoupon.receiveDes = '去使用'
          tempCoupon.receivedIdentImg= '../../assets/received.png'
        } else { // 已领取未到使用时间
          tempCoupon.receiveDes = '暂不可用'
        }

        break
      }
      case 5: { // 折扣券
        tempCoupon.id = coupon.id
        tempCoupon.couponItems=coupon.couponItems
        tempCoupon.logoImage = '../../assets/coupon_type5.jpg'
        tempCoupon.openWeChatCouponId = coupon.openWeChatCouponId
        tempCoupon.color = coupon.color
        tempCoupon.couponName = coupon.name
        tempCoupon.couponDes = coupon.couponDesc
        tempCoupon.couponStyle = coupon.discount + '折'
        if (coupon.meetPrice > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetPrice + '元可用'
        } else if (coupon.meetCount > 0) {
          tempCoupon.couponCondition = '满' + coupon.meetCount + '件可用'
        }
        tempCoupon.receiveStatus = coupon.isReceives
        if (tempCoupon.receiveStatus === 0) {
          tempCoupon.receiveDes = '点击领取'
        } else if (coupon.isReceives === 1) {
          tempCoupon.receiveDes = '去使用'
          tempCoupon.receivedIdentImg= '../../assets/received.png'
        } else { // 已领取未到使用时间
          tempCoupon.receiveDes = '暂不可用'
        }

        break
      }
      case 8: { //报销券
        tempCoupon.id = coupon.id
        tempCoupon.couponItems=coupon.couponItems
        tempCoupon.logoImage = 'https://www.suconnected.com/xcx/assets/coupon_type1.jpg'
        tempCoupon.openWeChatCouponId = coupon.openWeChatCouponId
        tempCoupon.color = coupon.color
        tempCoupon.couponName = coupon.name
        tempCoupon.couponDes = coupon.couponDesc
        tempCoupon.couponStyle = '￥' + coupon.reducePrice
        tempCoupon.couponCondition = '消费' + coupon.meetPrice + '元可用'
        tempCoupon.receiveStatus = coupon.isReceives
        if (tempCoupon.receiveStatus === 0) {
          tempCoupon.receiveDes = '点击领取'
        } else if (coupon.isReceives === 1) {
          tempCoupon.receiveDes = '去使用'
          tempCoupon.receivedIdentImg= 'https://www.suconnected.com/xcx/assets/received.png'
        } else { // 已领取未到使用时间
          tempCoupon.receiveDes = '暂不可用'
        }

        break
      }
      default:
    }
    return tempCoupon
  },
  // 根据券的id获取商户详情
  async doGetCoupon(couponId) {
    var res = await http({
      url: 'coupon_doGetCoupon.do',
      data:{couponId:couponId},
    });
    return res.data;
  },
  // 新增券
  async doAddCoupon(params) {
    var res = await http({
      url: 'coupon_doAddCoupon.do',
      data:params,
    });
    return res;
  },
  // 修改库存
  async doAddCouponCount(params) {
    var res = await http({
      url: 'coupon_doAddCouponCount.do',
      data:params,
    });
    return res;
  },
  // 修改券
  async doUpdateCoupon(params) {
    var res = await http({
      url: 'coupon_doUpdateCoupon.do',
      data:params,
    });
    return res;
  },
  //删除券
  async doDeleteCoupon(id) {
    var res = await http({
      url: 'coupon_doDeletecoupon.do',
      data:{id:id},
    });
    return res;
  },
  //获取券详请
  async doGetCouponDetails(couponId) {
    var res = await http({
      url: 'coupon_doGetCouponDetails.do',
      data:{couponId:couponId},
    });
    return res;
  },
  //查看券的领取
  async doPageDrawCouponItem(couponId,page,count) {
    var res = await http({
      url: 'coupon_doPageDrawCouponItem.do',
      data:{couponId:couponId,page:page,count:count},
    });
    return res;
  },
  //查看券的核销统计
  async doPageUseCouponDetails(couponId,page,count) {
    var res = await http({
      url: 'coupon_doPageUseCouponDetails.do',
      data:{couponId:couponId,page:page,count:count},
    });
    return res;
  },
  //查看券的核销详情
  async doPageGroupUseCouponDetails(groupId,couponId,page,count) {
    var res = await http({
      url: 'coupon_doPageGroupUseCouponDetails.do',
      data:{groupId:groupId,couponId:couponId,page:page,count:count},
    });
    return res;
  },
  async doGetCouponItemByCouponNum(couponNum) { //根据券码查询券
    var res = await http({
      url: "coupon_doGetCouponItemByCouponNum.do",
      data: {couponNum:couponNum},
      bindToken:true
    });
    return res.data;
  },
  async doBatchConsumeCouponItems (couponItemIds) { //批量核销券
    var res = await http({
      url: "coupon_doBatchConsumeCouponItems.do",
      data: {id:couponItemIds},
      bindToken:true
    });
    return res
  },
  async doStatisticGroupByCoupon(sm, searchModel, page, count) { //获取订单
    var res = await http({
      url: "coupon_doStatisticGroupByCoupon.do",
      data: {
        searchModel: searchModel,
        sm:sm,
        count: count,
        page: page
      },
      bindToken: true
    })
    return res.data
  }
}
export default CouponService
