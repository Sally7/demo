import http from '@/utils/Request'
const GroupMessageService = {
  // 查询所有省市区
  async doAddGroupMessage(param) {
    var res = await http({
      url: 'groupMessages_doAddGroupMessages.do',
      data:param,
    });
    return res;
  },
  async doPageGroupMessages(groupId,page,count) {
    var res = await http({
      url: 'groupMessages_doPageGroupMessages.do',
      data:{groupId:groupId,page:page,count:count},
    });
    return res;
  },
  async doPageMessagesVisit(messagesId,page) {
    var res = await http({
      url: 'groupMessages_doPageMessagesVisit.do',
      data:{messagesId:messagesId,page:page},
    });
    return res;
  },
  async doGetGroupMessages(messagesId) {
    var res = await http({
      url: 'groupMessages_doGetGroupMessages.do',
      data:{messagesId:messagesId},
    });
    return res;
  },
  async doSearchAllUserTags(){
    var res = await http({
      url: 'userTag_doSearchAllUserTags.do',
      data:null,
    });
    return res;
  }
}
export default GroupMessageService
