/**
 * Created by mac on 18/1/5.
 */
import http from '@/utils/Request'

const GroupService = {
  // 根据id查询选中企业
  async doGetOneGroupById(id) {
    var res = await http({
      url: 'group_doGetOneGroup.do',
      data: {id: id},
    });
    return res;
  },
  // 根据id获取店铺信息
  async doGetOneGroup(groupId) {
    var res = await http({
      url: 'groupOpen_doGetOneGroup.do',
      data: {groupId: groupId},
    });
    return res;
  },
  // 查询所有店铺（总店）
  async doPageGroup(params) {
    var res = await http({
      url: 'group_doPageCompany.do',
      data: params,
    });
    return res;
  },
  // 查询所有店铺（总店）
  async doPage(params) {
    var res = await http({
      url: 'group_doPage.do',
      data: params,
    });
    return res;
  },

  // 查询所有分店
  async doPageBranch(params) {
    var res = await http({
      url: 'group_doSearchSubCompany.do',
      data: params,
    });
    return res;
  },
  // 查询企业类型
  async doSearchGrouptype(params) {
    var res = await http({
      url: 'grouptype_doSearch.do',
      data: params,
    });
    return res;
  },
  // 查询所有代理商
  async doPageAgentGroup(params) {
    var res = await http({
      url: 'group_doPageAgentGroup.do',
      data: params,
    });
    return res;
  },
  // 新增店铺
  async doAddCompany(params) {
    var res = await http({
      url: 'group_doAddCompany.do',
      data: params,
    });
    return res;
  },
  // 修改店铺
  async doUpdateGroup(params) {
    var res = await http({
      url: 'group_doUpdateGroup.do',
      data: params,
    });
    return res;
  },
  // 查询商圈
  async doSearchRations(groupType) {
    var res = await http({
      url: 'group_doSearch.do',
      data: {groupType: groupType},
    });
    return res;
  },

  //根据条件查询门店 不做分页
  async doSearch(params) {
    var res = await http({
      url: 'group_doSearch.do',
      data: params,
    });
    return res;
  },


  // 查询店铺所属商圈(仅限报销券)
  async doGetTradingAreaByGroupId(params) {
    var res = await http({
      url: 'groupOpen_doGetTradingAreaByGroupId.do',
      data: params,
    });
    return res;
  },
  // 删除店铺（总店）
  async doChangeStatus(params) {
    var res = await http({
      url: 'group_doChangeStatus.do',
      data: params,
    });
    return res;
  },
  async doAuditing(groupId, auditingStatus) {
    var res = await http({
      url: 'group_doUpdateAuditingStatus.do',
      data: {id: groupId, auditingStatus: auditingStatus}
    });
    return res;
  },
  async doUpdateGroupChargeRate(groupId, chargeRate) {
    var res = await http({
      url: 'group_doUpdateGroupChargeRate.do',
      data: {groupId: groupId, chargeRate: chargeRate}
    });
    return res;
  },
  async doUpdateGroupWithdrawCashRate(groupId, withdrawCashRate) {
    var res = await http({
      url: 'group_doUpdateGroupWithdrawCashRate.do',
      data: {groupId: groupId, withdrawCashRate: withdrawCashRate}
    });
    return res;
  },
  async doSearchGroupCategoryTree() {
    var res = await http({
      url: 'groupCategory_doSearchTree.do'
    });
    return res.data;
  },
  async doGetGroupCategory(id) {
    var res = await http({
      url: 'groupCategory_doGet.do',
      data:{id:id}
    });
    return res.data;
  },
  async doAddGroupCategory(model) {
    var res = await http({
      url: 'groupCategory_doAdd.do',
      data:model
    });
    return res.data;
  },
  async doUpdateGroupCategory(category) {
    var res = await http({
      url: 'groupCategory_doUpdate.do',
      data:{id:category.id,name:category.name}
    });
    return res;
  },

  async doDeleteGroupCategory(category){
    var res = await http({
      url: 'groupCategory_doDelete.do',
      data:{category}
    });
    return res;
  }
}
export default GroupService
