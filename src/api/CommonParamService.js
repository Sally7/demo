import http from '@/utils/Request'
const CommonParamService = {
  // 查询所有省市区
  async doSearch(groupId, moduleId) {
    var res = await http({
      url: 'commonParam_doList.do',
      data:{groupId:groupId,moduleId:moduleId},
    });
    return res;
  },
  async doDelete(id) {
    var res = await http({
      url: 'commonParam_doDelete.do',
      data:{id:id},
    });
    return res;
  },
  async doAU(model) {
    var res = await http({
      url: 'commonParam_doAU.do',
      data: model,
    });
    return res;
  },
  async doGet(groupId, name, moduleId) {
    var res = await http({
      url: 'commonParam_doGet.do',
      data: {groupId:groupId,name:name,moduleId:moduleId},
    });
    return res;
  }
}
export default CommonParamService
