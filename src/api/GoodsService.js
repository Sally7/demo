import http from '@/utils/Request'
import ConfigUtil from "../utils/ConfigUtil";
const GoodsService = {
  // 查询所有行业商品分类
  async doSearchTree(params) {
    var res = await http({
      url: 'goods/category_doSearchTree.do',
      data:params,
    });
    return res;
  },
  // 根据groupid查询品牌
  async doSearchByGroupId(groupId) {
    var res = await http({
      url: 'goods/gscategorybrand_doSearchByGroupId.do',
      data:{groupId: groupId},
    });
    return res;
  },
  // 查询所有餐饮商品分类
  async doSearchTreeJson(params) {
    var res = await http({
      url: 'goods/shopcategory_doSearchTreeJson.do',
      data:params,
    });
    return res;
  },
  // 根据groupid查询分类
  async doSearchCategoryByGroupId(groupId) {
    var res = await http({
      url: 'goods/gscategorybrand_doSearchCategoryByGroupId.do',
      data:{groupId: groupId},
    });
    return res;
  },
  async doSearchTreeByGroup(groupId) {
    var res = await http({
      url: 'goods/gscategorybrand_doSearchTreeByGroup.do',
      data:{groupId: groupId},
    });
    return res.data;
  },
  // 查询商品
  async doSearchGoods(params) {
    var res = await http({
      url: 'goods/goods_doSearch.do',
      data:params,
    });
    return res;
  },
  // 根据商品分类查询商品
  async doPage(params) {
    var res = await http({
      url: 'goods/goods_doPage.do',
      data:params,
    });
    return res;
  },
  // 根据分类id查询品牌
  async doSearchByCategory(categoryId) {
    var res = await http({
      url: 'goods/brand_doSearchByCategory.do',
      data:{categoryId: categoryId},
    });
    return res;
  },
  async doGet(goodsId) {
    var res = await http({
      url: 'goods/goods_doGet.do',
      data:{id: goodsId},
    });
    return res.data;
  },
  async doUpdate(goods) {
    var res = await http({
      url: 'goods/goods_doUpdate.do',
      data:goods,
    });
    return res.data;
  },
  async doAdd(goods) {
    var res = await http({
      url: 'goods/goods_doAdd.do',
      data:goods,
    });
    return res;
  },
  async doGroupByThreeLevelsGoodsCount(sm) {
    var res = await http({
      url: 'goods/category_doGroupByThreeLevelsGoodsCount.do',
      data:sm,
    });
    return res.data;
  },
  async doUpdateQuantity(goodsId, quantity) {
    var res = await http({
      url: 'goods/goods_doUpdateQuantity.do',
      data:{goodsId:goodsId, quantity:quantity},
    });
    return res.data;
  },
  //上传图片的接口
  async fileUploadImg(file) {
    var res = await http({
      url: 'goods/file_uploadImg.do',
      data:{file:file}
    });
    return res;
  },
//  添加楼栋
  async doBigFloor(name,imageUrl,shopId,pid,parentName,value,visible,takeoutVisible) {
    var res = await http({
      url: 'goods/shopcategory_doAdd.do',
      data: {
        name:name,
        imageUrl:imageUrl,
        shopId:shopId,
        pid:pid,
        parentName:parentName,
        value:value,
        visible:visible,
        takeoutVisible:takeoutVisible,
      }
    });
    return res;
  },
//  根据楼栋查楼层
  async getFloor(id) {
    var res = await http({
      url: 'goods/shopcategory_doSearchByPid.do',
      data:{id:id}
    });
    return res;
  },
  //  根据楼层查询办公室
  async getOffice(params) {
    var res = await http({
      url: 'goods/goods_doPage.do',
      data:params
    });
    return res;
  },
  async doFloor(name,imageUrl,pid,parentName,visible,value,) {
    var res = await http({
      url: 'goods/shopcategory_doAdd.do',
      data:{
        name:name,
        imageUrl:imageUrl,
        pid:pid,
        parentName:parentName,
        visible:visible,
        value:value
      }
    });
    return res;
  },
//  删除楼层
  async deleteFloor(id,shopId) {
    var res = await http({
      url: 'goods/shopcategory_doDelete.do',
      data:{
        id:id,
        shopId:ConfigUtil.getTradingAreaId()
      }
    });
    return res;
  },
  //  更新信息楼层、楼栋
  async doUpdateFloor(params) {
    var res = await http({
      url: 'goods/shopcategory_doUpdate.do',
      data:params
    });
    return res;
  },
  //  更新办公室
  async doUpdateOffice(params) {
    var res = await http({
      url: 'goods/goods_doUpdate.do',
      data:params
    });
    return res;
  },
  //  删除办公室
  async deleteOffice(id) {
    var res = await http({
      url: 'goods/goods_doDelete.do',
      data: {id:id}
    });
    return res;
  },
  // 获取办公室信息
  async doGetgoods(id) {
    var res = await http({
      url: 'goods/goods_doGet.do',
      data: {id:id}
    });
    return res;
  },
}

export default GoodsService
