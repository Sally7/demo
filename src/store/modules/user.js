//import { loginByUsername, logout, getUserInfo } from '@/api/login'
import LoginService from '@/api/login'
import NadminuserService from '@/api/NadminuserService'
import cacheCookies from '@/utils/auth'
import GroupService from '@/api/GroupService'
import AreaService from "../../api/AreaService";

const user = {
  state: {
    user: '',
    status: '',
    tagId:'4',
    code: '',
    token: cacheCookies.getToken(),
    groupId: cacheCookies.getGroupId(),
    generalId: cacheCookies.getGeneralId(),
    name: cacheCookies.getName(),
    avatar: cacheCookies.getAvatar(),
    area:{townId:cacheCookies.getTownId(),villageId:cacheCookies.getVillageId(),areaId:cacheCookies.getAreaId(), areaLevel:cacheCookies.getAreaLevel(),curAreaName:cacheCookies.getCurAreaName()},
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    openChat: false,
    idNo:''
  },
  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_GROUPID: (state, groupId) => {
      state.groupId = groupId
    },
    SET_GENERALID: (state, generalId) => {
      state.generalId = generalId
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_TAGID:(state,tagId) => {
      state.tagId = tagId
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CUR_AREA_NAME: (state, areaName) => {
      state.area.curAreaName = areaName;
    },
    SET_TOWNID: (state, townId) => {
      state.area.townId = townId;
    },
    SET_VILLAGEID: (state, villageId) => {
      state.area.villageId = villageId;
    },
    SET_AREAID: (state, areaId) => {
      state.area.areaId = areaId;
    },
    SET_AREALEVEL: (state, areaLevel) => {
      state.area.areaLevel = areaLevel;
    },
    SET_OPENCHAT: (state, openChat) => {
      state.openChat = openChat;
    },
    SET_IDNO: (state, idNo) => {
      state.idNo = idNo;
    }
  },
  actions: {
    // 用户名登录
    updateArea({ commit }, userInfo) {


    },
    // 用户名登录
    LoginByFinger({ commit }, userInfo) {
      console.log("LoginByFinger........", userInfo);
      var response = {};
      response.data = userInfo;
      response.status = 1;
      return new Promise(async (resolve, reject) => {
        if(response.status != 1) {
          var error = response.data;
          reject(error)
        } else if(response.data.phone || response.data.phone=="" || !response.data.phone) { //已绑定手机号

          console.log("LoginByFingered........",response);
          commit('SET_TOKEN', response.data.token)
          cacheCookies.setToken(response.data.loginToken)
          commit('SET_GROUPID', response.data.companyId)
          cacheCookies.setGroupId(response.data.companyId)
          commit('SET_GENERALID', response.data.generalId)
          cacheCookies.setGeneralId(response.data.generalId)
          commit('SET_NAME', response.data.name)
          cacheCookies.setName(response.data.name)

          var groupRes = await GroupService.doGetOneGroupById(response.data.companyId);
          commit('SET_AVATAR', groupRes.data.showUrl)
          cacheCookies.setAvatar(groupRes.data.showUrl);
          var group = groupRes.data;

          if(group.groupType == 101) {
            //代表人武部
            //根据其areadId的层级确定其是省 市 区
            commit('SET_AREAID', group.areaId);
            cacheCookies.setAreaId(group.areaId);
            var areaRes = await AreaService.doGetSimple(group.areaId)
            commit('SET_CUR_AREA_NAME', areaRes.data.name);
            cacheCookies.setCurAreaName(areaRes.data.name);

            //group.areaId/10000
            var areaStr = (group.areaId/10000).toString();
            var spAreaStr = areaStr.split("");
            var lastNum = Number.parseInt(spAreaStr[spAreaStr.length-1]);
            if(lastNum>0) {
              commit('SET_AREALEVEL', 3);
              cacheCookies.setAreaLevel(3);
            } else {
              areaStr = (group.areaId/10000/10000).toString();
              spAreaStr = areaStr.split("");
              lastNum = Number.parseInt(spAreaStr[spAreaStr.length-1]);
              if(lastNum>0) {
                commit('SET_AREALEVEL', 4);
                cacheCookies.setAreaLevel(4);
              } else {
                commit('SET_AREALEVEL', 5);
                cacheCookies.setAreaLevel(5);
              }
            }
          } else {
            //反之代表镇和村5001100000000
            //如果generalId为null 则代表是镇，反之为村
            if(group.generalId) {
              commit('SET_VILLAGEID', group.id);
              commit('SET_TOWNID', group.generalId);
              commit('SET_AREALEVEL', 1);
              cacheCookies.setAreaLevel(1);
              cacheCookies.setTownId(group.generalId);
              cacheCookies.setVillageId(group.id);
            } else {
              commit('SET_TOWNID', group.id);
              commit('SET_AREALEVEL', 2);
              cacheCookies.setAreaLevel(2);
              cacheCookies.setTownId(group.id);
            }
            commit('SET_CUR_AREA_NAME', group.name);
            cacheCookies.setCurAreaName(group.name);
          }
          resolve();
        } else{ //未绑定手机号
          if(userInfo.isNeedBind){ //绑定操作
            resolve(response.data.token)
          }else{
            resolve("nophone")
          }
        }
      });
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      var loginAccount = {
        account: username,
        password: userInfo.password
      };
      return new Promise((resolve, reject) => {
        LoginService.loginByUsername(loginAccount).then(async response => {
          if(response.status != 1) {
            var error = response.data;
            reject(error)
          } else if(response.data.phone || response.data.phone=="" || !response.data.phone) { //已绑定手机号
            commit('SET_TOKEN', response.data.token);
            cacheCookies.setToken(response.data.token);
            commit('SET_GROUPID', response.data.companyId);
            cacheCookies.setGroupId(response.data.companyId);
            commit('SET_GENERALID', response.data.generalId);
            cacheCookies.setGeneralId(response.data.generalId);
            commit('SET_NAME', response.data.name);
            cacheCookies.setName(response.data.name);

            var groupRes = await GroupService.doGetOneGroupById(response.data.companyId);
            commit('SET_AVATAR', groupRes.data.showUrl);
            cacheCookies.setAvatar(groupRes.data.showUrl);
            var group = groupRes.data;

            if(group.groupType == 101) {
              //代表人武部
              //根据其areadId的层级确定其是省 市 区
              commit('SET_AREAID', group.areaId);
              cacheCookies.setAreaId(group.areaId);
            /*  var areaRes = await AreaService.doGetSimple(group.areaId)
              commit('SET_CUR_AREA_NAME', areaRes.data.name);*/
              cacheCookies.setCurAreaName(group.name);

              //group.areaId/10000
              var areaStr = (group.areaId/10000).toString();
              var spAreaStr = areaStr.split("");
              var lastNum = Number.parseInt(spAreaStr[spAreaStr.length-1]);
              if(lastNum>0) {
                commit('SET_AREALEVEL', 3);
                cacheCookies.setAreaLevel(3);
              } else {
                areaStr = (group.areaId/10000/10000).toString();
                spAreaStr = areaStr.split("");
                lastNum = Number.parseInt(spAreaStr[spAreaStr.length-1]);
                if(lastNum>0) {
                  commit('SET_AREALEVEL', 4);
                  cacheCookies.setAreaLevel(4);
                } else {
                  commit('SET_AREALEVEL', 5);
                  cacheCookies.setAreaLevel(5);
                }
              }
            } else {
              //反之代表镇和村5001100000000
              //如果generalId为null 则代表是镇，反之为村
              if(group.generalId) {
                commit('SET_VILLAGEID', group.id);
                commit('SET_TOWNID', group.generalId);
                cacheCookies.setTownId(group.generalId);
                commit('SET_AREALEVEL', 1);
                cacheCookies.setAreaLevel(1);
                cacheCookies.setVillageId(group.id);
              } else {
                commit('SET_TOWNID', group.id);
                commit('SET_AREALEVEL', 2);
                cacheCookies.setAreaLevel(2);
                cacheCookies.setTownId(group.id);
              }
              commit('SET_CUR_AREA_NAME', group.name);
              cacheCookies.setCurAreaName(group.name);
            }
            resolve();
          } else{ //未绑定手机号
            if(userInfo.isNeedBind){ //绑定操作
              resolve(response.data.token)
            }else{
              resolve("nophone")
            }
          }
        })
      })
    },
    doTagId({ commit }, tagId){
      commit('SET_TAGID',tagId)
    },
    doOpenChat({ commit }, status){
      commit('SET_OPENCHAT', status)
    },
    doIdNo({ commit }, idNo){
      commit('SET_IDNO', idNo)
    },
    //绑定手机号
    async LoginByBindPhone({ commit }, bindInfo){
      var bindParam = {
        phone: bindInfo.phone.trim(),
        code: bindInfo.vcode.trim(),
        token: bindInfo.token.trim()
      }
      var response = await NadminuserService.doBindUserPhone(bindParam);
      return response
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      var roleParams = {
        token: state.token,
        withPHot: 1,
        type: 1,
        updateTime: -1
      };
      return new Promise((resolve, reject) => {
        LoginService.getUserInfo(roleParams).then(response => {
          if(response.status === -1001) {
            reject('error')
          } else {
            /*if(data.status != 1) {

            }*/
            var roles = ['admin']
            //commit('SET_ROLES', data.role)
            commit('SET_ROLES', roles)
            //commit('SET_NAME', data.name)
            //commit('SET_AVATAR', data.avatar)
            commit('SET_INTRODUCTION', '我是超级管理员')
            resolve(response.data)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        LoginService.logout(state.token).then(response => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          cacheCookies.removeToken()
          cacheCookies.removeGroupId()
          cacheCookies.removeGeneralId()
          cacheCookies.removeName()
          cacheCookies.removeAvatar()
          cacheCookies.loginOut();
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        cacheCookies.removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        cacheCookies.setToken(role)
        LoginService.getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
