import http from '@/utils/Request'
const RoleService = {
  // 根据企业类型查询所有店铺角色
  async doSearchRoleByGroupTypeId(groupTypeId) {
    var res = await http({
      url: 'role_doSearchRoleByGroupTypeId.do',
      data:{groupTypeId: groupTypeId},
    });
    return res;
  },
  // 根据店铺id查询店铺角色
  async doSearchTheGroupRoles(groupId) {
    var res = await http({
      url: 'role_doSearchTheGroupRoles.do',
      data:{groupId: groupId},
    });
    return res;
  },
  // 根据角色id查询店铺样板
  async doGetTempleteGroupByRoleIds(roleIds) {
    var res = await http({
      url: 'role_doGetTempleteGroupByRoleIds.do',
      data:{roleIds: roleIds},
    });
    return res;
  },
  async doSearchRoleListAll() {
    var res = await http({
      url: 'role_doSearchRoleListAll.do',
    });
    return res;
  },
  async doGetRoleByEmployeeId(empId) {
    var res = await http({
      url: 'role_doGetRoleByEmployeeId.do',
      data:{empId:empId}
    });
    return res;
  },

  /**
   * 查询角色列表
   * @return {Promise<void>}
   */
  async getRoles() {
    var res = await http({
      url: 'webapp/admin/role_doSearchRoleListAll.do',
    });
    return res;
  },

  /**
   *
   * @param roleId
   * @return {Promise<void>}
   */
  async getRoleHots(roleId) {
    var res = await http({
      url: 'webapp/admin/hot_doSearchRoleHots.do',
      data:{roleId:roleId}
    });
    return res;
  },

  /**
   *
   * @param roleId
   * @return {Promise<void>}
   */
  async getOneRole(id) {
    var res = await http({
      url: 'webapp/admin/role_doGetOneRole.do',
      data:{id:id}
    });
    return res;
  },


  /**
   * 删除指定角色
   * @param roleId
   * @return {Promise<void>}
   * https://swdev.suconnected.com/webapp/admin/role_doDeleteRole.do
   */
  async doDeleteRole(roleId) {
    var res = await http({
      url: 'webapp/admin/role_doDeleteRole.do',
      data:{id:roleId}
    });
    return res;
  },

  /**
   *
   * @param roleId
   * @return {Promise<void>}
   */
  async getMyGroupHot() {
    var res = await http({
      url: 'webapp/admin/hot_doSearchMyGroupHot.do',
      data:{withPHot:1}
    });
    return res;
  },

  async doAddRole(role){
    var res = await http({
      url: 'webapp/admin/role_doAddRole.do',
      data:role
    });
    return res;
  }

}
export default RoleService
