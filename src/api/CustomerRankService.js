import http from '@/utils/Request'
const CustomerRankService = {
  // 查询所有省市区
  async doPushMedia(media) {
    var res = await http({
      url: 'rank_doPushMedia.do',
      data:{media:media},
    });
    return res;
  },
  //查询统计数据
  async doStatistic(params) {
    var res = await http({
      url: 'rank_doStatistic.do',
      data:params,
    });
    return res;
},

  //等位信息报表
  async doPageRankAnalysis(params) {
    var res = await http({
      url: 'rank_doPageRankAnalysis.do',
      data: params,
    });
    return res;
},
  async doPage(params) {
    var res = await http({
      url: 'rank_doPage.do',
      data:params,
    });
    return res;
  }

}



export default CustomerRankService
