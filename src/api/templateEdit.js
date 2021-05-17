import request from '@/utils/request_dev'
// 获取商户首页
export function doGetTilesHomePage(params, callback) {
  return request({
    url: '/devices_doGetTilesHomePage.do',
    method: 'post',
    params: params
  }).then(res => {
    return callback(res.data.data);
  }).catch(err => {console.log(err);});
}
//查询单个模板及模块内的图片
export function doGetTilesbyId(params, callback) {
  return request({
    url: '/devices_doGetTilesbyId.do',
    method: 'post',
    params: params
  }).then(res => {
    return callback(res.data);
  }).catch(err => {console.log(err);});
}
//添加或者修改首页
export function doAddOrUpdateTilesHome(params, callback) {
  return request({
    url: '/devices_doAddOrUpdateTilesHome.do',
    method: 'post',
    params: params
  }).then(res => {
    return callback(res.data.data);
  }).catch(err => {console.log(err);});
}
//获取所有自定义模块
export function doSearchTilesHomeThemeCategory(callback) {
  return request({
    url: '/themecategory_doSearchTilesHomeThemeCategory.do',
    method: 'post'
  }).then(res => {
    return callback(res.data.data);
  }).catch(err => {console.log(err);});
}
//根据自定义模块的id获取模块所拥有的自定义风格
export function doSearchByThemeCategoryId(params, callback) {
  return request({
    url: '/interactivetheme_doSearchByThemeCategoryId.do',
    method: 'post',
    params: params
  }).then(res => {
    return callback(res.data.data);
  }).catch(err => {console.log(err);});
}
