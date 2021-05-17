import http from '@/utils/Request';

const ArticleService = {
  async doSearchTreeJson() {
    var res = await http({
      url: 'newscategory_doSearchTreeJson.do',
      data: {type: 1},
    });
    return res.data;
  },
  async doDelete(id) {
    var res = await http({
      url: 'wxnews_doDelete.do',
      data: {id: id},
    });
    return res;
  },
  async doPage(sm) {
    var res = await http({
      url: 'wxnews_doPage.do',
      data: sm,
    });
    return res;
  },
  async doUpdate(model) {
    var res = await http({
      url: 'wxnews_doUpdate.do',
      data: model,
    });
    return res;
  },
  async doAdd(model) {
    var res = await http({
      url: 'wxnews_doAdd.do',
      data: model,
    });
    return res;
  },
  async doGet(id) {

    var res = await http({
      url: 'wxnews_doGet.do',
      data: {id: id},
    });
    return res.data;
  },

  async doSerch(param, page, count, loading) {
    param = param ? param : {};
    page = page ? page : 1;
    count = count ? count : 20;
    loading = loading ? loading : '正在搜索...';

    var res = await http({
      url: 'wxnews_doSearch.do',
      data: {param:JSON.stringify(param), page:page, count:count, loading:loading},
    });
    return res;
  },

  async doSearchById(id) {
    var res = await http({
      url: 'wxnews_dogetNewsById.do',
      data: {id: id},
    });
    return res.data;
  },
};
export default ArticleService;
