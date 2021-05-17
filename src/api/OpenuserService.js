import http from '@/utils/Request'

const OpenuserService = {
  // 修改密码
  async doUpdatePassword(params) {
    var res = await http({
      url: 'openuser_doUpdatePassword.do',
      data:params,
    });
    return res;
  },
  // 找回账号
  async doSendAccount(params) {
    var res = await http({
      url: 'openuser_doSendAccount.do',
      data:params,
    });
    return res;
  },
  // aliyun滑块验证
  async doMachineverification(params) {
    var res = await http({
      url: 'openuser_doMachineverification.do',
      data:params,
    });
    return res;
  },
}
export default OpenuserService
