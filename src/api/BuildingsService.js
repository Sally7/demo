import http from '@/utils/Request'
const BuildingsService = {

  /**
   * 查询园区所有办公室
   * @param {
   * token:'b8f987b3317b38e7fce77d62d0ad55a9'
   *   search:{groupId:'2c9326de739654410173965e1d7c0000',status:1}
   * }
   * @return {Promise<void>}
   */
  async searchAllOfficeForTerritory(params) {
    var res = await http({
      url: 'goods/goods_doPage.do',
      data:params,
    });
    return res;
  },

  /**
   * 查询 楼层的所有有办公室
   * @param {
     token:b8f987b3317b38e7fce77d62d0ad55a9
      search.groupId:2c9326de739654410173965e1d7c0000
      search.status:1
      search.levelId:1000000000000000
   * }
   * @return {Promise<void>}
   */
  async searchAllOfficeForBuilding(params) {
    var res = await http({
      url: 'goods/goods_doPage.do',
      data:params,
    });
    return res;
  },

  /**
   * 新增园区办公室
   * @param {
   *   token:'cfebaaefd0f311eab242c54fd076ff8d',
   *   sellStatus:1,//(固定)
   *   discountStatus：1,//(固定)
   *   isWeight:0,//(固定)
   *   isUnited:0,//(固定)
   *   bookingStatus:0,//(固定)
   *   sellToWeixin:1,//(固定)
   *   sellToRepresentatives:1,//(固定)
   *   sellToWeb:1,//(固定)
   *   sellToAPP:1,//(固定)
   *   sellToTakeout:1,//(固定)
   *   distributionAwardRatio:0,//(固定)
   *   sendType:3,//(固定)
   *   tempUnitName:'',//单位 平方米/天
   *   categoryId:'',//选择的分类 办公室 水电
   *   title:'' //办公室名称
   *   presentPrice：100, //presentPrice 同 originalPrice
   *   imageUrl:'' //图片
   *   quantity: 1//(固定)
   *   shopCategoryList:[{
   *   shopCategoryId:'2c92ebd1767de7a801767def2ed20000',//园区楼栋 楼层查询中 选择 获取
   *   shopId:'2c9326de739654410173965e1d7c0000', //园区楼栋 楼层查询中获取选择
   *   levelId:'1001000000000000' //园区楼栋 楼层查询中选择获取
   *   }]
   *
   *
   * }
   * @return {Promise<void>}
   */
  async doAddOffice(params) {
    var res = await http({
      url: 'goods/goods/goods_doAdd.do',
      data:params,
    });
    return res;
  },

  /**
   * 园区楼栋 楼层查询
   * @param {token:'' //登录园区账号获取,定义某个园区}
   * @return {Promise<void>}
   */
  async searchBuilding(params) {
    var res = await http({
      url: 'goods/shopcategory_doSearchTreeJson.do',
      data:params,
    });
    return res;
  },

  /**
   * 查询办公室的租赁信息
   * @param params
   * @return {Promise<void>}
   */
  async searchHireInfoForOffice(params) {
    console.log('租赁订单的goodsId：',params.orderSearchModel.goodsId)
    var res = await http({
      url: 'order_doPage.do',
      data:params,
    });
    return res;
  },

//  办公室租赁购买下单
  /**
   *
   * @param {
   *  token:cfebaaefd0f311eab242c54fd076ff8d,//园区负责人登录账号
      orderType:2,//固定值
      groupId:2c9326de739654410173965e1d7c0000,//园区的id
      businessType:211000000000000000,//固定值 办公室
      goodsId:2c92ebd17678c22301767dc3d01b0034,//购买人的办公室
      count:1,//固定
      notes:,//备注
      serviceStartDate:1608433461000,//开始时间
      serviceEndDate:1609211061000,//结束时间
      buyerId:2ce4e482760464420176057d95bc04ae,//购买人室公司管理员id
      buyerName:'中诚区块链研究院(南京)有限公司'
   * }
   * @return {Promise<void>}
   */
  async createHireOrder(params) {
    var res = await http({
      url: 'order_doAdd.do',
      data:params,
    });
    return res;
  },

  /**
   * 园区办公室租赁订单查询
   * @param {
      token:b8f987b3317b38e7fce77d62d0ad55a9
      orderSearchModel.ptradingAreaId:2c9326de73a39f940173a4a17dd80000
      orderSearchModel.businessType:211000000000000000 //固定值 表示园区租赁订单
      orderSearchModel.groupId:2c9326de739654410173965e1d7c0000 //园区的groupid
   * }
   * @return {Promise<void>}
   */
  async searchHireOrder(params) {
    var res = await http({
      url: 'order_doPage.do',
      data:params,
    });
    return res;
  },

  /**
   * 园区的办公室面积统计
   * @param {
    token:cfebaaefd0f311eab242c54fd076ff8d,//登录园区账号获取
    search.sellStatus:1,//固定
    search.deleteStatus:0,
    search.groupId:2c9326de739654410173965e1d7c0000,//园区的id
    search.categoryId:211005000000000000,//固定
    search.quantity:1,//不填为全部 1 为未租赁 可租赁 0 为以租赁
   * }
   * @return {Promise<void>}
   */
  async getSumQuadratureForTerritory(params) {
    var res = await http({
      url: 'goods/goods/goods_doSumQuadrature.do',
      data:params,
    });
    return res;
  },

  /**
   * 楼栋 楼层 办公室面积统计
   * @param params
   * @return {Promise<void>}
   */
  async getSumQuadratureForBuilding(obj) {
    let params = {
      search:{
        sellStatus: 1,
        deleteStatus: 0,
        groupId: obj.search.groupId,
        categoryId: '211005000000000000',
        quantity: obj.search.quantity,
        levelId:obj.search.levelId,
      }
    }
    
    var res = await http({
      url: 'goods/goods/goods_doSumQuadrature.do',
      data:params,
    });
    return res;
  },

  /**
   * 园区管理面积
   */
  async getQuadrature(params) {
    var res = await http({
      url: 'goods/goods/goods_doSumQuadrature.do',
      data:params,
    });
    return res;
  },

  /**
   * 实时均价
   * @param {} params 
   */
  async getAvgPresentPrice(params) {
    var res = await http({
      url: 'goods/goods/goods_doAvgPresentPrice.do',
      data:params,
    });
    return res;
  },
}
export default BuildingsService