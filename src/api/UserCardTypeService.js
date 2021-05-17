/**
 * Created by mac on 18/1/9.
 */
import http from '@/utils/Request'
const UserCardTypeService = {
  async doPage(searchModel, page, count) {
    searchModel.cout = count;
    searchModel.page = page;
    var res = await http({
      url: 'userCard_doPage.do',
      data:searchModel
    });
    return res;
  },
  async doPageUserCard(searchModel, page, count) {
    var res = await http({
      url: 'userCard_doPageUserCard.do',
      data:{
        userCardSearchModel:searchModel,
        page:page,
        count:count
      }
    });
    return res;
  },
  async doSearchUserCard (userId, groupId) { //扫码赠送会员特权
    var res = await http({
      url: "userCard_doSearchUserCard.do",
      method: "POST",
      data:{
        userId:userId,
        groupId:groupId
      }
    })
    return res.data
  },
}
export default UserCardTypeService
