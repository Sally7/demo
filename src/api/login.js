import http from '@/utils/Request'

const LoginService = {
  // 登录
  async loginByUsername(params) {
    var res = await http({
      url: 'openuser_doLogin.do',
      data:params,
    });
    return res;
  },

  // 登出
  async logout() {
    var res = await http({
      url: 'openuser_doLogOut.do'
    });
    return res;
  },

  //
  async getUserInfo(params) {
    var res = await http({
      url: 'hot_doSearchMyHots.do',
      data:params,
    });
    return res;
  },
}
export default LoginService
