import http from '@/utils/Request'
const EvaluateService = {
  async doPage (groupId,dsrType,conditionFlag,page,count,startDate,endDate,shopName) {
    var res = await http({
      url: "commonDSR_doPage.do ",
      method: "POST",
      data: {
        belong:groupId,
        dsrType:dsrType,
        conditionFlag:conditionFlag,
        page:page,
        count:count,
        startDate:startDate,
        endDate:endDate,
        shopName:shopName
      }
    })
    return res
  },
}
export default EvaluateService
