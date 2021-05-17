/**
 * Created by mac on 18/1/9.
 */
import http from '@/utils/Request';

const MarketingSceneService = {
  marketingSceneType: {
    MARKETINGSCENETYPE_BUY: 1001,//消费
    MARKETINGSCENETYPE_INVITE: 1002,//邀请
    MARKETINGSCENETYPE_NEW: 1003,//新客户
    MARKETINGSCENETYPE_REIMBURSEMENT: 1004,//消费报销
    MARKETINGSCENETYPE_lUCKDRAW: 1005,//消费报销
    MARKETINGSCENETYPE_SCANQRCODE: 1,//扫码
    MARKETINGSCENETYPE_ACTIVATEUSERCARD: 2,//激活会员卡
    MARKETINGSCENETYPE_USECOUPON: 3,//核销券送
    MARKETINGSCENETYPE_OPENHOMEPAGE: 4,//打开首页
    MARKETINGSCENETYPE_ADVERTISING: 1007,//动态广告

  },
  getMarketingSceneTypes() {
    var that = this;
    return [
      {
        text: '激活会员卡',
        value: that.marketingSceneType.MARKETINGSCENETYPE_ACTIVATEUSERCARD,
        show: false,
      },
      {
        text: '消费',
        value: that.marketingSceneType.MARKETINGSCENETYPE_BUY,
        show: false,
      },
      {
        text: '消费报销',
        value: that.marketingSceneType.MARKETINGSCENETYPE_REIMBURSEMENT,
        show: true,
      },
      {
        text: '邀请有礼',
        value: that.marketingSceneType.MARKETINGSCENETYPE_INVITE,
        show: true,
      },
      {
        text: '新客户',
        value: that.marketingSceneType.MARKETINGSCENETYPE_NEW,
        show: false,
      },
      {
        text: '扫码有礼',
        value: that.marketingSceneType.MARKETINGSCENETYPE_SCANQRCODE,
        show: true,
      },
      {
        text: '核销送',
        value: that.marketingSceneType.MARKETINGSCENETYPE_USECOUPON,
        show: true,
      },
      {
        text: '打开首页',
        value: that.marketingSceneType.MARKETINGSCENETYPE_OPENHOMEPAGE,
        show: true,
      },
      {
        text: '幸运转盘',
        value: that.marketingSceneType.MARKETINGSCENETYPE_lUCKDRAW,
        show: true,
      },
      {
        text: '动态广告',
        value: that.marketingSceneType.MARKETINGSCENETYPE_ADVERTISING,
        show: true,
      }];
  },
  // 查询营销场景列表
  async doPage(params) {
    var that = this;
    var res = await http({
      url: 'marketingScene_doPage.do',
      data: params,
    });
    if (res.status === 1 && res.data && res.data.length > 0) {
      var marketingSceneTypes = that.getMarketingSceneTypes();
      res.data.forEach(function(marketingScene) {
        marketingSceneTypes.forEach(function(marketingSceneType) {
          if (marketingScene.marketingSceneType == marketingSceneType.value) {
            marketingScene.marketingSceneLabel = marketingSceneType.text;
          }
        });
      });
    }
    return res;
  },
  getConditionGiftType() {
    return {
      GIFTTYPE_COUPON: 0,//优惠券类型
      GIFTTYPE_REDPACKETS: 1,//红包类型
      GIFTTYPE_DISCOUNT_ALL: 2,//折扣类型
      GIFTTYPE_REDUCE: 3,//减现金
      GIFTTYPE_REDUCEMIN: 4,//减免最低商品
      GIFTTYPE_SCORE: 5,//送积分
      GIFTTYPE_DISCOUNT_MINIMUMPRICE: 6,//最低价 折扣
      GIFTTYPE_CARDGRADE: 7,//送会员卡等级
      GIFTTYPE_REBATE_REDPACKETS: 8,//送返利现金
    };
  },
  // 根据场景营销的id查询对应的场景营销
  async doGet(id) {
    var res = await http({
      url: 'marketingScene_doGet.do',
      data: {id: id},
    });
    return res.data;
  },
  // 删除营销场景
  async doDelete(id) {
    var res = await http({
      url: 'marketingScene_doDelete.do',
      data: {id: id},
    });
    return res;
  },
  // 增加或者修改场景营销
  async doAU(params) {
    var res = await http({
      url: 'marketingScene_doAU.do',
      data: params,
    });
    return res;
  },
  async doPageJionUsers(sm) {
    var res = await http({
      url: 'marketingScene_doPageJionUsers.do',
      data: sm,
    });
    return res;
  },

  /**
   * 人员批量参加培训
   * @param param
   * @return {Promise<void>}
   */
  async doJionMarketingScene(param) {
    var res = await http({
      url: 'marketingScene_doJionMarketingScene.do',
      data: param,
    });
    return res;
  },

  /**
   * 根据培训ID获取相关课程
   * @param marketingSceneId
   * @return {Promise<void>}
   */
  async getConditionsById(marketingSceneId) {
    var res = await http({
      url: 'marketingScene_doGet.do',
      data: {id: marketingSceneId},
    });
//    return (res.data && res.data.conditions) ? res.data.conditions : [];
    return res;
  },

  /**
   * 某培训相关报名人员的各科成绩
   * @param marketingSceneId
   * @return {Promise<void>}
   */
  async getAboutScore(marketingScene) {
    var res = await http({
      url: 'marketingScene_doPageContentGroupByConditionsUser.do',
      data: {...marketingScene},
    });
    return res;
  },

  /**
   * 下载某个培训的成绩导入模板
   * @param marketingSceneId
   * @return {Promise<void>}
   */
  async downMarketingSceneTmpl(marketingSceneId) {
    var res = await http({
      url: 'conditions_doExportExcelTemplate.do',
      data: {marketingSceneId: marketingSceneId},
      method:'POST'
    });
    return res;
  },

  /**
   * 删除某个培训的某个报名成员
   * @param mId
   * @param joinId
   * @return {Promise<void>}
   */
  async doDeleteJoinUser(marketingSceneId,joinUserId){
    var res = await http({
      url: 'marketingScene_doDeleteMarketingSceneJoinUserRelation.do',
      data: {marketingSceneId: marketingSceneId,joinUserId:joinUserId},
    });
    return res;
  },

  /**
   * 导出某个培训的成绩表
   * @param param
   * @return {Promise<void>}
   */
  async exportScore(param){
    var res = await http({
      url: 'marketingScene_doExportUserContentExcel.do',
      data: param,
    });
    return res;
  }

};
export default MarketingSceneService;
