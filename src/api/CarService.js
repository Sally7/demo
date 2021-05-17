/**
 * Created by mac on 18/1/11.
 */
import http from '@/utils/Request'
const CarService = {
  async doSearchAllCarBrand () { // 获取所有的品牌
    var res = await http({
      url: 'car_doSearchAllCarBrand.do',
      method: 'POST'
    });
    return res;
  },
  async doSearchCarSeriesByBrandId (brandId) { // 根据品牌id获取所有的车系
    var res = await http({
      url: 'car_doSearchCarSeriesByBrandId.do',
      method: 'POST',
      data:{brandId:brandId},
      loading:"正在获取车系信息...",
    });
    return res;
  },
  async doSeachCarDisplacementBycarDisplacementId (param) { // 根据车系获取所有的排量
    var res = await http({
      url: 'car_doSeachCarDisplacementBycarDisplacementId.do',
      method: 'POST',
      data:param,
      loading:"正在获取所有排量信息...",
    });
    return res;
  },
  async doSeachCarParticularYearBycarDisplacementId (param) { // 根据车排量获取所有的年份
    var res = await http({
      url: 'car_doSeachCarParticularYearBycarDisplacementId.do',
      method: 'POST',
      data:param,
      loading:"正在获取年份信息...",
    });
    return res;
  },
  async doGetMyNewestCar () { // 获取登录用户绑定的车辆信息
    var res = await http({
      url: 'car_doGetMyNewestCar.do',
      method: 'POST'
    });
    return res;
  },
  async doAUUserCarByPlate (param) { // 根据车牌更新用户信息
    var res = await http({
      url: 'car_doAddOrUpdateUserCarByPlateNumber.do',
      data:param,
      method: 'POST'
    });
    return res;
  },
  async doPageGroupPlateNumber (groupId,page,count) { // 分页查询店铺车牌
    var res = await http({
      url: 'car_doPageGroupPlateNumber.do',
      data:{groupId:groupId,page:page,count:count},
      method: 'POST'
    });
    return res;
  },
  async doAddOrUpdateGroupPlateNumber (id,plateNumber) { // 增加或者修改车牌
    var res = await http({
      url: 'car_doAddOrUpdateGroupPlateNumber.do',
      data:{id:id,plateNumber:plateNumber},
      method: 'POST'
    });
    return res;
  },
  async doBatchAddGroupPlateNumberByExcel (excelUrl,fileName) { // 导入车牌
    var res = await http({
      url: 'car_doBatchAddGroupPlateNumberByExcel.do',
      data:{excelUrl:excelUrl,fileName:fileName},
      method: 'POST'
    });
    return res;
  }

}
export default CarService;
