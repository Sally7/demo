import http from '@/utils/Request'
const AreaService = {
  async doSearchArea(generalId,tradingAreaId,areaId,groupType){
    var res = await http({
      url: 'group_doSearch.do',
      data: {generalId: true, tradingAreaId:"2c9326de73a39f940173a4a17dd80000", areaId: 16000900040000,groupType: 3
      }
    });
    return res;
  },
  // 查询所有省市区
  async doSearchAllTreeJson(params) {
    var res = await http({
      url: 'area_doSearchAllTreeJson.do',
      data:params,
    });
    return res;
  },
  // 根据areaId查询城市
  async doSearchCity(areaId) {
    var res = await http({
      url: 'area_searchCity.do',
      data:{areaId: areaId},
    });
    return res;
  },
  // 根据areaId获取当前所在区域
  async doGetArea(areaId) { //省id
    var res = await http({
      url: 'area_doGet.do',
      data:{id: areaId},
    });
    return res;
  },
  async doGet(areaId) { //区id
    var res = await http({
      url: 'area_doGet.do',
      data:{id: areaId},
    });
    return res;
  },
  async doGetSimple(areaId) { //区id
    var res = await http({
      url: 'area_doGetSimple.do',
      data:{id: areaId},
    });
    return res;
  },
  async doSearchCitysByGroupId(groupId) { //区id
    var res = await http({
      url: 'area_doSearchCitysByGroupId.do',
      data:{groupId: groupId},
    });
    return res;
  },
  async doSearchAreaIdByName(areaName) { //区id
    var res = await http({
      url: 'area_searchAreaIdByName.do',
      data:{cityName: areaName},
    });
    return res.data;
  },

}
export default AreaService
