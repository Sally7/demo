import http from '@/utils/Request'

const SendShortMessageService = {
  // 发送验证码
  async doSendVerificationCode(params) {
    var res = await http({
      url: 'sendshortmessage_doSendVerificationCode.do',
      data:params,
    });
    return res;
  }
}
export default SendShortMessageService
