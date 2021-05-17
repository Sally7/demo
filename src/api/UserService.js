import http from '@/utils/Request'
const UserService = {
  // 根据店铺id查询店铺角色
  async doPage(searchModel, page, count) {
    var res = await http({
      url: 'user_doPage.do',
      data:{'userSearch':searchModel,page:page, count:count},
    });
    return res;
  },
  async doSetGradeNum(userId, gradeNum) {
    var res = await http({
      url: 'user_doSetGradeNum.do',
      data:{userId:userId, gradeNum:gradeNum},
    });
    return res;
  },
  async doGetUserById(userId) {
    var res = await http({
      url: 'user_doGetUserById.do',
      method: 'POST',
      data: {
        userId: userId
      }
    })
    return res.data
  },
  async doGetUserByAccount(account) {
    var res = await http({
      url: 'openuser_doGetUserByAccount.do',
      method: 'POST',
      data: {
        account: account
      }
    })
    return res.data
  },
  async doGetMyInfo() { // 获取登录用户的信息
    var res = await http({
      url: 'nadminuser_doGetMyInfo.do',
      method: 'POST'
    });
    return res.data;
  },
  async doChangePassword(passwordOld, passwordNew) { // 获取登录用户的信息
    var res = await http({
      url: 'user_doChangePassword.do',
      method: 'POST',
      data: {
        passwordOld: passwordOld,
        passwordNew:passwordNew
      }
    });
    return res;
  },
  async doAddOutUser(user) { // 获取登录用户的信息
    var res = await http({
      url: 'user_doAddOutUser.do',
      method: 'POST',
      data:user
    });
    return res.data;
  },
  async doUpdateContactsInfo(user) { // 获取登录用户的信息
    var res = await http({
      url: 'user_doUpdateContactsInfo.do',
      method: 'POST',
      data:user
    });
    return res.data;
  },
  async doExport(param) { // 获取登录用户的信息
    var res = await http({
      url: 'user_doExportExcel.do',
      method: 'POST',
      data:param
    });
    return res.data;
  },
  async doBatch(batchType, batchValue, batchIds) { // 获取登录用户的信息
    var res = await http({
      url: 'user_doBatch.do',
      method: 'POST',
      data: {batchType:batchType, batchValue:batchValue, batchIds:batchIds}
    });
    return res.data;
  },
}
export default UserService
