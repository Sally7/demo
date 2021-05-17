import { asyncRouterMaps, constantRouterMaps } from '@/router'
//import { constantRouterMaps } from '@/router'
import Layout from '@/views/layout/Layout'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
/*function hasPermission(roles, route) {
 if (route.meta && route.meta.role) {
 return roles.some(role => route.meta.role.indexOf(role) >= 0)
 } else {
 return true
 }
 }*/

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
/*function filterAsyncRouter(asyncRouterMap, roles) {
 const accessedRouters = asyncRouterMap.filter(route => {
 if (hasPermission(roles, route)) {
 if (route.children && route.children.length) {
 route.children = filterAsyncRouter(route.children, roles)
 }
 return true
 }
 return false
 })
 return accessedRouters
 }*/

const permission = {
  state: {
    routers: constantRouterMaps,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMaps.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        var routers = [],
            parentRouters = [],
            asyncRouterMap = [];
        var pids = [];
        var child = {
            path: 'commission',
            component: _import('group/commission'),
            name: 'commission',
            meta: { title: 'commission', icon: 'documentation' },
            settingUrl:"#/group/commission"
        };


        console.log("******",data.routes);

        /**
         * 前后台统一规范
         * 后台url设置如果以'#/'开头表示前台存在该模块
         */
        data.routes.forEach(function(item, index) {
          if(item.settingUrl&&item.settingUrl.trim().slice(0, 2) === "#/") {
            routers.push(item);
            //如果parentId已存在数组中则不push（去重）
            if(pids.indexOf(item.parentId) === -1) {
              pids.push(item.parentId);
            }
          }
        });

        // 确认路由的层级关系：找出所有一级菜单(路由)
        pids.forEach(function(item, index) {
          for(var j = 0; j < data.routes.length; j++) {
            if(item === data.routes[j].id) {
              parentRouters.push(data.routes[j]);
              break;
            }
          }
        });

        /**
         * 路由配置
         * 配置路由参数
         * 规则：从后台获取的所有菜单项，分别对应左侧导航的一级导航和二级导航，
         *       按照此形式来配置路由（一级路由和二级路由），生成路由表；
         */
        // console.log(routers)
        parentRouters.forEach(function(parent, index) { //未处理包含参数配置情况，后面可以优化
          var routerMap = {}; //一级路由对象
          /**
           * 配置一级路由对象
           * 一级路由（菜单）的许多参数配置（主要是url）需要通过其子路由（子菜单）的url来截取
           */
          routerMap.component = Layout;
          routerMap.label = parent.hotName;
          routerMap.iconUrl = parent.showIconUrl;
          routerMap.path = '/' + parent.hotDesc;
          routerMap.name = parent.hotDesc;
          routerMap.orderNum = parent.orderNum;
          //查找子菜单，根据子菜单的url来截取
          for(var s = 0; s < routers.length; s++) {
            if(routers[s].parentId === parent.id) {
              routerMap.redirect = routers[s].settingUrl.slice(1);
              routerMap.meta = {
                title: routers[s].settingUrl.split('/')[1],
                icon: routers[s].settingUrl.split('/')[1]
              };
              break;
            }
          }
          //一级菜单下的二级菜单push到children中，生成子路由
          routerMap.children = [];
          if(parent.id==="402881954fcf42e8014fcf9ea0fe0000"){
            routerMap.children.push(child);
          }
          routers.forEach(function(item, index) {
            if(item.parentId === parent.id && item.hotType != 888) {
              //配置子路由
              var child = {};
              child.settingUrl = item.settingUrl;
              var subPath = item.settingUrl.split('/')[item.settingUrl.split('/').length-1];
              child.path = subPath;

              //处理带参数URL
              var paramIndex = item.settingUrl.indexOf("?");
              var pagePath = "";
              if(paramIndex==-1) {
                pagePath = item.settingUrl.slice(2);
              } else {
                pagePath = item.settingUrl.substr(0, paramIndex).slice(2);
              }

              if(item.hotDesc && item.hotDesc.indexOf("/")!=-1) {
                child.component = _import(item.hotDesc);
              } else {
                child.component = _import(pagePath);
              }
              child.label = item.hotName;
              var pathArr =  item.settingUrl.split("/");
              child.name = pathArr[pathArr.length-1];
              console.log("route-------------------------", child.name);

              child.meta = { title: child.name, icon: 'documentation' };
              routerMap.children.push(child);
            }
          });
          if(routerMap.name === "marketing"){
            //routerMap.children.push(marketingChild1);
            // routerMap.children.push(marketingChild2);
          }
          if(routerMap.name === "group"){
            routerMap.children.push(groupChild1);
            routerMap.children.push(groupChild2);
            routerMap.children.push(groupChild3);
            routerMap.children.push(groupChild4);
            routerMap.children.push(groupChild5);
            routerMap.children.push(groupChild6);
            routerMap.children.push(groupChild7);
          }

          /**
           * 添加/修改页面的url配置到相应模块下
           * 比如：店铺添加配置到店铺模块中
           */
          console.log(asyncRouterMaps);
          asyncRouterMaps.forEach(function(item, index) {
            if(item.belong.trim() === routerMap.path.slice(1)) {
              routerMap.children.push(item);
            }
          });
          asyncRouterMap.push(routerMap)

          console.log(routerMap);
        });
        //asyncRouterMap.push(parent1);
        //console.log(asyncRouterMap);
        //asyncRouterMap[0].alias = '';


        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
