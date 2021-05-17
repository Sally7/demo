import http from '@/utils/Request'

const NadminuserService = {
  // 绑定手机号
  async doBindUserPhone(params) {
    var res = await http({
      url: 'nadminuser_doBindUserPhone.do',
      data:params,
    });
    return res;
  },
  async doSearchByUserType(userType) {
    var res = await http({
      url: 'nadminuser_doSearchByUserType.do',
      data:{userType:userType},
    });
    return res;
  },
  async doAddEmpUser(user) {
    var res = await http({
      url: 'nadminuser_doAddEmpUser.do',
      data:user,
    });
    return res;
  },
  async doChangeInfor(user) {
    var res = await http({
      url: 'nuser_doChangeInfor.do',
      data:user,
    });
    return res;
  },
  async doDeleteUser(id) {
    var res = await http({
      url: 'nadminuser_doDeleteUser.do',
      data:{id:id},
    });
    return res;
  }

}
export default NadminuserService
