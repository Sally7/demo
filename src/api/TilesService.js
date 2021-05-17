/**
 * Created by mac on 18/1/11.
 */
import http from '@/utils/Request'
const TilesService = {
  //添加页面
  async doAUTeTiles(model) {
    var res = await http({
      url: 'tiles_doAUTiles.do',
      data:model,
    });
    return res.data;
  },
  async doAUTileItem(model) {
    var res = await http({
      url: 'tileItem_doAdd.do',
      data:model,
    });
    return res.data;
  },
  async doPage(groupId) {
    var res = await http({
      url: 'tiles_doPage.do',
      data:params,
    });
    return res.data;
  }

}
export default TilesService;
