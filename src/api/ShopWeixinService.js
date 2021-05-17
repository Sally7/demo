import http from '@/utils/Request'
const ShopWeixinService = {
  // 查询绑定的微信小程序/公众号
  async doSearchIMAccount(params) {
    var res = await http({
      url: 'shopWeixin_doSearchIMAccount.do',
      data:params,
    });
    return res;
  },
}
export default ShopWeixinService
