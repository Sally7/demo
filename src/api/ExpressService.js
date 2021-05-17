import http from '@/utils/Request'
const ExpressService = {
  async doSearchExpressTemplate (groupId,page,count) {
    var res = await http({
      url: "expressTemplate_doSearchExpressTemplate.do",
      method: "POST",
      data: {
        groupId: groupId,
        page: page,
        count: count
      }
    })
    return res
  },
  async doGetExpressTemplateById (id) {
    var res = await http({
      url: "expressTemplate_doGetExpressTemplateById.do",
      method: "POST",
      data: {
        id: id,
      }
    })
    return res
  },
  async doDeleteExpressTemplateById (id) {
    var res = await http({
      url: "expressTemplate_doDeleteExpressTemplateById.do",
      method: "POST",
      data: {
        id: id,
      }
    })
    return res
  },
  async doAddOrUpdateExpressTemplate (params) {
    var res = await http({
      url: "expressTemplate_doAddOrUpdateExpressTemplate.do",
      method: "POST",
      data: params
    })
    return res
  },
  async doSearchExpressTag (groupId) {
    var res = await http({
      url: "expressTemplate_doSearchExpressTag.do",
      method: "POST",
      data: {belong: groupId}
    })
    return res
  }
}
export default ExpressService
