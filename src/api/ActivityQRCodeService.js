import http from '@/utils/Request'
const ActivityQRCodeService = {
  // 查询所有店铺的活动码
  async doQueryActivityCode(params) {
    var res = await http({
      url: 'qrcode_doPage.do',
      data:params,
    });
    return res;
  },
  // 根据id查询活动码
  async doGetQRCodeById(params) {
    var res = await http({
      url: 'qrcode_dogetQRCodeById.do',
      data:params,
    });
    return res;
  },
  // 增加或者修改店铺的活动码
  async doAddOrUpdateActivityCode(params) {
    var res = await http({
      url: 'qrcode_doAddOrUpdateActivityCode.do',
      data:params,
    });
    return res;
  },
  // 删除活动码
  async doDeleteQRCode(params) {
    var res = await http({
      url: 'qrcode_doDeleteQRCode.do',
      data:params,
    });
    return res;
  }
}
export default ActivityQRCodeService
