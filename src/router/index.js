import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router)
console.log('合并yuanqu')
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMaps = [
  { path: '/login', component: _import('login/from'), hidden: true },
  { path: '/resetpassword', component: _import('login/resetpassword'), hidden: true },
  { path: '/retrieve_account', component: _import('login/retrieve_account'), hidden: true },
  {
    path: '/',
    component: Layout,
    name: '',
    redirect: '/home',
    meta: {
      title: 'home',
      icon: 'home'
    },
    hidden: true
  },

//  {
//    path: '/demo',
//    component: Layout,
//    name: 'demo',
//    label: "测试演示",
//    hidden: true,
//    redirect: {
//      name: 'index_demo'
//    },
//    meta: {
//      title: 'demo',
//      icon: 'home'
//    },
//    children: [{
//      path: 'index_demo',
//      component: _import('demo/index'),
//      name: 'index_demo',
//      meta: { title: 'index_demo', icon: 'index_admin' }
//    }]
//  },
  {
    path: '/home',
    component: Layout,
    name: 'home',
    label: "首页",
    hide: true,
    redirect: {
      name: 'index_admin'
    },
    meta: {
      title: 'home',
      icon: 'home'
    },
    children: [{
      path: 'index_admin',
      component: _import('home/index_admin'),
      name: 'index_admin',
      meta: { title: 'index_admin', icon: 'index_admin' }
    }]
  },
  {
    path: '/open',
    component: Layout,
    name: 'open',
    label: "开放",
    rootHide: true,
    redirect: '/open/article_view_list',
    meta: {
      title: 'home',
      icon: 'home'
    },
    children: [{
      path: 'article_view_list',
      component: _import('content/article_view_list'),
      name: 'article_view_list',
      meta: { title: 'article_view_list', icon: 'article_view_list' }
    }, {
      path: 'article_detail',
      component: _import('content/article_detail'),
      name: 'article_detail',
      meta: { title: 'article_detail', icon: 'article_detail' }
    }]
  },
  {
    path: '/defence',
    component: Layout,
    name: 'defence',
    label: "企业",
    orderNum: 150,
    hide: true,
    redirect: '/defence/defence_list',
    meta: {
      title: 'defence',
      icon: 'defence'
    },
    children: [{
      path: 'defence_list',
      component: _import('defence/defence_list'),
      name: 'defence_list',
      belong: "defence",
      label: "企业",
      meta: { title: 'defence_list', icon: 'defence_list' }
    }, {
      path: 'defence_list/defence_au',
      component: _import('defence/defence_au'),
      name: 'defence_au',
      belong: "defence",
      label: "机构编辑",
      meta: { title: 'defence_au', hidden: true }
    }, {
      path: 'defence_list/defence_import',
      component: _import('defence/defence_import'),
      name: 'defence_import',
      belong: "defence",
      label: "企业导入",
      meta: { title: 'defence_import', hidden: true }
    },

    ]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMaps
})

export const asyncRouterMaps = [
  {
    path: 'activity_qrcode/activity_qrcode_au',
    component: _import('marketing/activity_qrcode_au'),
    name: 'activity_qrcode_au',
    meta: { title: 'activity_qrcode_au', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  {
    path: 'marketingscene/marketingscene_au',
    component: _import('marketing/marketingscene_au'),
    name: 'marketingscene_au',
    meta: { title: 'marketingscene_au', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  {
    path: 'marketingscene/marketingscene_homepage_au',
    component: _import('marketing/marketingscene_homepage_au'),
    name: 'marketingscene_homepage_au',
    meta: { title: 'marketingscene_homepage_au', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  {
    path: 'coupon/coupon_au',
    component: _import('marketing/coupon_au'),
    name: 'coupon_au',
    meta: { title: 'coupon_au', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  {
    path: 'coupon/coupon_draw_detail', //浏览器显示路径
    component: _import('marketing/coupon_draw_detail'), //项目路径
    name: 'coupon_draw_detail',
    meta: { title: 'coupon_draw_detail', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  {
    path: 'coupon/coupon_cancel_statistics',
    component: _import('marketing/coupon_cancel_statistics'),
    name: 'coupon_cancel_statistics',
    meta: { title: 'coupon_cancel_statistics', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  {
    path: 'coupon/coupon_cancel_statistics/coupon_cancel_detail',
    component: _import('marketing/coupon_cancel_detail'),
    name: 'coupon_cancel_detail',
    meta: { title: 'coupon_cancel_detail', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  /* 总店 */
  {
    path: 'group_manage/group_au',
    component: _import('group/group_au'),
    name: 'group_au',
    meta: { title: 'group_au', hidden: true },
    hidden: true,
    belong: 'group'
  },
  /* 店铺配置 */
  {
    path: 'group_manage/group_configure',
    component: _import('group/group_configure'),
    name: 'group_configure',
    meta: { title: 'group_configure', hidden: true },
    hidden: true,
    belong: 'group'
  },
  /* 代理商 */
  {
    path: 'agent_manage/agent_au',
    component: _import('group/agent_au'),
    name: 'agent_au',
    meta: { title: 'agent_au', hidden: true },
    hidden: true,
    belong: 'group'
  },
  /* 消息发送记录 */
  {
    path: 'message_group/message_record',
    component: _import('marketing/message_record'),
    name: 'message_record',
    meta: { title: 'message_record', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  /* 消息群发访问记录 */
  {
    path: 'message_group/message_visit_detail',
    component: _import('marketing/message_visit_detail'),
    name: 'message_visit_detail',
    meta: { title: 'message_visit_detail', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  /* 编辑幸运转盘 */
  {
    path: 'luck_turntable/luck_turntable_au',
    component: _import('marketing/luck_turntable_au'),
    name: 'luck_turntable_au',
    meta: { title: 'luck_turntable_au', hidden: true },
    hidden: true,
    belong: 'marketing'
  },
  /* 批量导入车牌*/
  {
    path: 'regular_customer_manager/carBrand_import',
    component: _import('group/carBrand_import'),
    name: 'carBrand_import',
    meta: { title: 'carBrand_import', hidden: true },
    hidden: true,
    belong: 'group'
  },
  /* 发卡记录*/
  {
    path: 'card/card_record',
    component: _import('kaka/card_record'),
    name: 'card_record',
    meta: { title: 'card_record', hidden: true },
    hidden: true,
    belong: 'kaka'
  },
  /* 套餐详情*/
  {
    path: 'card/card_subkinds',
    component: _import('kaka/card_subkinds'),
    name: 'card_subkinds',
    meta: { title: 'card_subkinds', hidden: true },
    hidden: true,
    belong: 'kaka'
  },
  /* 添加修改套餐*/
  {
    path: 'card/card_subkind_au',
    component: _import('kaka/card_subkind_au'),
    name: 'card_subkind_au',
    meta: { title: 'card_subkind_au', hidden: true },
    hidden: true,
    belong: 'kaka'
  },
  /* 订单详情 */
  {
    path: 'order/order_detail',
    component: _import('group/order_detail'),
    name: 'order_detail',
    meta: { title: 'order_detail', hidden: true },
    hidden: true,
    belong: 'group'
  },
  /* 运费模板详情 */
  {
    path: 'freight_template/freight_template_au',
    component: _import('group/freight_template_au'),
    name: 'freight_template_au',
    meta: { title: 'freight_template_au', hidden: true },
    hidden: true,
    belong: 'group'
  },
  /* 门店列表 */
  {
    path: 'branch_list/branch_au',
    component: _import('setting/branch_au'),
    name: 'branch_au',
    meta: { title: 'branch_au', hidden: true },
    hidden: true,
    belong: 'setting'
  },
  /* 用户列表 */
  {
    path: 'branch_list/user_list',
    component: _import('setting/user_list'),
    name: 'user_list',
    meta: { title: 'user_list', hidden: true },
    hidden: true,
    belong: 'setting'
  },
  {
    path: 'shop/shop_page_au',
    component: _import('shop/shop_page_au'),
    name: 'shop_page_au',
    meta: { title: 'shop_page_au', hidden: true },
    hidden: true,
    label: "档案编辑",
    belong: 'setting'
  },
  /* 角色 */
  {
    path: 'role_setting/role_au',
    component: _import('setting/role_au'),
    name: 'role_au',
    meta: { title: 'role_au', hidden: true },
    hidden: true,
    label: "角色编辑",
    belong: 'setting'
  },
  /* 资讯分类管理 */
  {
    path: 'newscategory_setting/news_category_au',
    component: _import('setting/news_category_au'),
    name: 'role_au',
    meta: { title: 'role_au', hidden: true },
    hidden: true,
    label: "角色编辑",
    belong: 'setting'
  },
  /* 装备分类管理 */
  {
    path: 'goodscategory_setting/goods_category_au',
    component: _import('setting/goods_category_au'),
    name: 'role_au',
    meta: { title: 'role_au', hidden: true },
    hidden: true,
    label: "角色编辑",
    belong: 'setting'
  },
  {
    path: 'equipment_list/warehouse_receive',
    component: _import('equipment/warehouse_receive'),
    name: 'warehouse_receive',
    meta: { title: 'warehouse_receive', hidden: true },
    hidden: true,
    label: "新建入库",
    belong: 'equipment'
  },
  {
    path: 'equipment_list/warehouse_send',
    component: _import('equipment/warehouse_send'),
    name: 'warehouse_send',
    meta: { title: 'warehouse_send', hidden: true },
    hidden: true,
    label: "新建出库",
    belong: 'equipment'
  },
  {
    path: 'equipment_list/equipment_au',
    component: _import('equipment/equipment_au'),
    name: 'equipment_au',
    meta: { title: 'equipment_au', hidden: true },
    hidden: true,
    label: "装备编辑",
    belong: 'equipment'
  },
  {
    path: 'article_list/article_au',
    component: _import('content/article_au'),
    name: 'article_au',
    meta: { title: 'article_au', hidden: true },
    hidden: true,
    label: "资讯编辑",
    belong: 'content'
  },
  {
    path: 'archive_train/train_au_1018',
    component: _import('train/train_au'),
    name: 'train_au',
    meta: { title: 'article_au', hidden: true },
    hidden: true,
    label: "培训编辑",
    belong: 'archive'
  },
  {
    path: 'archive_train_1018/train_users',
    component: _import('train/train_users'),
    name: 'train_users',
    meta: { title: 'train_users', hidden: true },
    hidden: true,
    label: "参与人员",
    belong: 'archive'
  },
  {
    path: 'train_list_1017/train_users',
    component: _import('train/train_users'),
    name: 'train_users',
    meta: { title: 'train_users', hidden: true },
    hidden: true,
    label: "参与人员",
    belong: 'militia'
  },
  {
    path: 'train_list_2000/train_users',
    component: _import('train/train_users'),
    name: 'train_users',
    meta: { title: 'train_users', hidden: true },
    hidden: true,
    label: "参与人员",
    belong: 'militia'
  },
  {
    path: 'archive_train_*/train_score',
    component: _import('train/train_score'),
    name: 'train_score',
    meta: { title: 'train_score', hidden: true },
    hidden: true,
    label: "查看成绩",
    belong: 'militia'
  },
  {
    path: 'archive_train/score_import',
    component: _import('train/score_import'),
    name: 'score_import',
    meta: { title: 'score_import', hidden: true },
    hidden: true,
    label: "成绩导入",
    belong: 'militia'
  },
  {
    path: 'archive_train_*/train_score',
    component: _import('train/train_score'),
    name: 'train_score',
    meta: { title: 'train_score', hidden: true },
    hidden: true,
    label: "查看成绩",
    belong: 'archive'
  },
  {
    path: 'archive_train/score_import',
    component: _import('train/score_import'),
    name: 'score_import',
    meta: { title: 'score_import', hidden: true },
    hidden: true,
    label: "成绩导入",
    belong: 'archive'
  },
  {
    path: 'defence_config/defence_category_au',
    component: _import('defence/defence_category_au'),
    name: 'defence_category_au',
    meta: { title: 'defence_category_au', hidden: true },
    hidden: true,
    label: "分类编辑",
    belong: 'setting'
  },
  {
    path: 'archive_list_1/archive_au',
    component: _import('archive/archive_au'),
    name: 'archive_au',
    meta: { title: 'archive_au', hidden: true },
    hidden: true,
    label: "档案编辑",
    belong: 'archive'
  },
  {
    path: 'archive_list_2/archive_au',
    component: _import('archive/archive_au'),
    name: 'archive_au',
    meta: { title: 'archive_au', hidden: true },
    hidden: true,
    label: "档案编辑",
    belong: 'archive'
  },
  {
    path: 'archive_list_3/archive_au',
    component: _import('archive/archive_au'),
    name: 'archive_au',
    meta: { title: 'archive_au', hidden: true },
    hidden: true,
    label: "档案编辑",
    belong: 'archive'
  },
  {
    path: 'archive_list_4/archive_au',
    component: _import('archive/archive_au'),
    name: 'archive_au',
    meta: { title: 'archive_au', hidden: true },
    hidden: true,
    label: "档案编辑",
    belong: 'archive'
  },
  {
    path: 'archive_list_5/archive_au',
    component: _import('archive/archive_au'),
    name: 'archive_au',
    meta: { title: 'archive_au', hidden: true },
    hidden: true,
    label: "档案编辑",
    belong: 'archive'
  },
  {
    path: 'archive_list_*/archive_import',
    component: _import('archive/archive_import'),
    name: 'archive_import',
    meta: { title: 'archive_import', hidden: true },
    hidden: true,
    label: "档案导入",
    belong: 'archive'
  },
  {
    path: 'archive_list_*/archive_log',
    component: _import('archive/archive_log'),
    name: 'archive_log',
    meta: { title: 'archive_log', hidden: true },
    hidden: true,
    label: "历史日志",
    belong: 'archive'
  },
  {
    path: 'contract_list/contract_au',
    component: _import('contract/contract_au'),
    name: 'contract_au',
    meta: { title: 'contract_au', hidden: true },
    hidden: true,
    label: "合同编辑",
    belong: 'contract'
  },
  {
    path: 'payment/paylist_import',
    component: _import('payment/paylist_import'),
    name: 'paylist_import',
    meta: { title: 'paylist_import', hidden: true },
    hidden: true,
    label: "合同编辑",
    belong: 'payment'
  },{
    path: 'building_managing',
    component: _import('buildings/building_managing'),
    name: 'building_managing',
    meta: { title: 'building_managing', hidden: true },
    hidden: true,
    label: "楼宇管理",
    belong: 'buildings'
  },{
    path: 'office_managing',
    component: _import('buildings/office_managing'),
    name: 'office_managing',
    meta: { title: 'office_managing', hidden: true },
    hidden: true,
    label: "办公室管理",
    belong: 'buildings'
  },
]
