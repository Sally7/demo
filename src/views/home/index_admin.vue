<template>
  <div class="main_container">
    <div class="top_tip">
      <div class="top_tip_left">
        <el-carousel height="360px">
          <el-carousel-item v-for="(article, index) in coverArticles" :key="article.id">
            <div v-if="article.showPicUrl">
              <div class="new_title" @{{article.title}}="toArticleDetail(article.id)">{{article.title}}</div>
              <a href="javascript:;"><img :src="article.showPicUrl.split(',')[0]" @click="toArticleDetail(article.id)"></a>
            </div>
          </el-carousel-item>
        </el-carousel>

      </div>
      <div class="top_tip_right">
        <div class="top_tip_nav">
          <el-menu :default-active="articleCategoryActiveIndex" class="el-menu-artilce" mode="horizontal" @select="handleArticleCategorySelect">
            <el-menu-item v-for="(category,index) in articleCategorys" :index="index+''" :key="category.id">{{category.name}}</el-menu-item>
          </el-menu>
          <a href="#/open/article_view_list" v-if="false">更多</a>
        </div>
        <div class="news_box">
          <div class="item_box" v-for="(article,index) in articles" :key="article.id">
            <div class="title" @click="toArticleDetail(article.id)"><p class="dot"></p><a class="title_content">{{article.title}}</a></div>
            <div class="time">{{article.creatTime | parseTime}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--结构-->
    <div class="resources_box">
      <el-row :gutter="20">
        <el-col :span="15">
          <section class="sec_box sec_left">
            <el-row>
              <el-col style="background-color: #FFFFFF">
                <div class="mod_box">
                  <h5 class="mod_title">
                    全部产业
                    <el-tooltip content="全部产业" placement="top" @click.stop.prevent>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </h5>
                  <div class="mode_content">
                    <div v-if="false">
                      <div>
                        <el-link :underline="true" type="primary" v-for="gcCounter in groupCategorysCounters" :key="gcCounter.id">{{ gcCounter.name }}</el-link>
                      </div>
                    </div>
                    <el-row class="category_list">
                      <el-col :span="5" v-for="gcCounter in groupCategorysCounters" :key="gcCounter.id">
                        <p class="category_item_title"><span>{{ gcCounter.name }}</span><i class="el-icon-s-data"></i></p>
                        <p class="category_item_data">{{ gcCounter.count }}</p>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="background-color: #FFFFFF">
                <div class="mod_box">
                  <h5 class="mod_title">
                    全部阶段
                    <el-tooltip content="全部阶段" placement="top" @click.stop.prevent>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </h5>
                  <div class="mode_content">
                    <div v-if="false">
                      <div>
                        <el-link :underline="true" type="primary" v-for="gpCounter in groupProgressCounters" :key="gpCounter.id">{{ gpCounter.name }}</el-link>
                      </div>
                    </div>
                    <el-row class="category_list">
                      <el-col :span="5" v-for="gpCounter in groupProgressCounters" :key="gpCounter.id">
                        <p class="category_item_title"><span>{{ gpCounter.name }}</span><i class="el-icon-s-data"></i></p>
                        <p class="category_item_data">{{ gpCounter.count }}</p>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col>
                <div class="mod_box">
                  <h5 class="mod_title" style="display: flex;justify-content: space-between">
                      <span>常用导航</span>
                      <el-form  style="margin-top: 10px" size="small" :inline="true">
                        <el-form-item>
                          <el-input  placeholder="搜索并添加入口"  prefix-icon="el-icon-search"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary">查询</el-button>
                        </el-form-item>
                      </el-form>
                  </h5>
                  <div class="mode_content">
                    <div>
                      <h6>快捷操作</h6>
                      <div>
                        <el-link :underline="false"  type="info">大数据</el-link>
                      </div>
                    </div>
                    <div style="margin-top: 20px">
                      <h6>自定义入口</h6>
                      <div>
                        <p style="color: #7d7e80">暂无数据</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </section>
        </el-col>
        <el-col :span="9">
          <section class="sec_box sec_right">
            <el-row>
              <el-col>
                <div class="mod_box">
                  <h5 class="mod_title">待办事项</h5>
                  <el-row class="mode_content content_todolist">
                    <el-col :span="8">
                      <span>待更新企业</span>
                      <p>0</p>
                    </el-col>
                    <el-col :span="8">
                      <span>待处理工单</span>
                      <p>0</p>
                    </el-col>
                    <el-col :span="8">
                      <span>待回访</span>
                      <p>0</p>
                    </el-col>

                  </el-row>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <div class="mod_box">
                  <h5 class="mod_title">
                    企业预警
                    <el-tooltip content="提示文字" placement="top" @click.stop.prevent>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </h5>
                  <el-row class="mode_content content_todolist">
                    <el-col :span="8">
                      <span>收入降低</span>
                      <p>0</p>
                    </el-col>
                    <el-col :span="8">
                      <span>流失</span>
                      <p>0</p>
                    </el-col>
                    <el-col :span="8">
                      <span>待扶持</span>
                      <p>0</p>
                    </el-col>

                  </el-row>
                  <el-row v-if="false">
                    <el-col>
                      <el-alert title="ESC实例负载正常" type="success" :closable="false" style="margin: 0 12px;width: 94.5%">
                      </el-alert>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </section>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style rel="stylesheet/css" lang="scss" scoped>
  @import "../../../src/styles/variables";

  .top_tip {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 380px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;

    .top_tip_left {
      width: 570px;
      height: 360px;

      .new_title {
        height: 40px;
        padding-left: 20px;
        width: 100%;
        color: #ffffff;
        background-color: rgba(0, 0, 0, 0.5);
        /*opacity: 0.7;*/
        z-index: 9999;
        line-height: 40px;
        font-size: 16px;
        position: absolute;
        bottom: 0;
      }

      img {
        background-color: #666666;
        height: 360px;
        width: 570px;
      }

      .top_tip_right {
        width: 590px;

      }

    }
    .top_tip_nav {
      width: 610px;
      height: 50px;
      display: flex;
      border-bottom: 2px solid $--color-primary;
      justify-content: space-between;
      align-items: center;

    }

    .el-menu-artilce {
      height: 50px;

      /deep/ .el-menu-item.is-active {
        color: white;
        background-color: $--color-primary;
      }

      /deep/ .el-menu-item {
        color: #000000;
        font-size: 16px;
        line-height: 50px;
        height: 50px;
        border-bottom: 1px solid $--color-primary !important;
      }

    }
    .news_box {
      width: 100%;
      height: 310px;
      padding: 30px;

      .item_box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: #666666;
          margin-right: 15px;
        }

        .title {
          display: flex;
          align-items: center;
        }

        .time {
          color: #666666;
        }

        .title_content {
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }

        .title_content:hover {
          color: #409EFF;
        }

      }
    }

  }

  .main_container {
    width: 100%;
    height: 100%;

  }

  .content_box {
    display: flex;
    justify-content: space-between;
  }

  .box_left {
    width: 990px;
  }

  .eye-logo {
    width: 18px;
    height: 21px;
    margin-left: 10px;
  }

  .nav_right {
    width: 210px;
  }

  .header-title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    align-items: center;
  }

  .sLthTnZe4RHtkKcqohA0P {
    padding: 20px;
    margin-bottom: 10px;
  }

  .hot-info-box {

    height: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;

    .info-logo {
      width: 45px;
      height: 45px;
      margin-right: 20px;
    }

    .hot-info-item-box {
      width: 160px;
    }

    .hot-info-item {
      display: flex;
      align-items: center;
      width: 460px;
    }

    .hot-info-title {
      color: #969799;
      font-size: 14px;
    }

    .hot-info-count {
      color: #323233;
      font-size: 26px;
      font-weight: bold;
      line-height: 1;
    }

  }

  .use-info-box {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    .use-logo {
      width: 24px;
      height: 24px;
      margin-right: 15px;
    }

    .use-info-item {
      display: flex;
      align-items: center;
      height: 40px;
      width: 232px;
      margin-bottom: 14px;
    }

  }

  .tip-item {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    box-sizing: border-box;
    padding-left: 20px;
    margin: 10px 0;

    .tip-header {
      font-size: 14px;
      color: #323233;
      margin-bottom: 6px;
    }

    .tip-item-box {
      display: flex;

    }

    .tip-item-title {
      color: #969799;
      font-size: 14px;
      margin-right: 10px;
    }

    .tip-item-count {
      color: #155bd4;
      font-size: 14px;
    }

  }
  /*首页。。。。*/
  .resources_box {
    margin-top: 20px;
    h5, h6 {
      margin: 0;
      padding: 0;
      font-size: 14px;
      color: #2a2a2a;
    }
    h6 {
      font-size: 12px;
    }
    .mod_title{
      line-height: 36px;

    }
    .sec_left .mod_box{
      padding-top: 8px;
      padding-left: 16px;
      box-sizing: border-box;
    }
    .sec_box {
      .el-row {
        margin-bottom: 10px;

      }
      .mod_box {
        background-color: #FFFFFF;
        box-sizing: border-box;
        padding-bottom: 10px;
      }
    }
    .sec_left {

    }

    .sec_right {
      .mod_title{
        margin-left: 10px;
        padding-top:6px;
      }

    }
    .el-link{
      border-radius: 10px;
      padding: 0 5px;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      margin-right: 3px;
    }
    .el-link.el-link--info{
      border:1px solid #bdbdbf;
    }

    .el-link.el-link--primary{
      border:1px solid #425688;
      color: #425688;
    }
    .category_list{
      margin-top: 10px;
    }
    .category_list .el-col{
      height: 86px;
      border:1px solid #f0f0f0;
      box-sizing: border-box;
      margin-right: 5px;
      margin-top: 7px;
      border-radius: 5px;
      min-width: 23.8%;
      border-left-color: #58749b;
      border-left-width: 3px;
      padding:10px 13px 0;
    }
    .category_list .el-col:nth-child(5),
    .category_list .el-col:nth-child(6),
    .category_list .el-col:nth-child(7),
    .category_list .el-col:nth-child(8){
      border-left-color: #6f7c46;
    }
    .category_item_title{
      display: flex;
      justify-content: space-between;
      color: #5a5a5a;
      font-size: 14px;
    }
    .category_item_data{
      margin-top: 2px;
      font-size: 24px;
      font-weight: bold;
    }
    .content_todolist{
      background-color:#FFFFFF ;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .el-col{
        box-sizing: border-box;
        margin: 5px;
        background-color:#f7f8fa ;
        height: 80px;
        width: 30%;
        broder:1px solid #909399;
        color: #303133;
        padding: 13px 13px 0;
        font-size: 12px;
      }
      span{
        display: block;
        margin-top: 5px;
      }
      p{
        font-size: 18px;
        color: #292a2c;

      }

    }
    .mode_content{
      h6{
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>
<script>
  import {mapGetters} from 'vuex';
  import home from '@/mixins/home';
  import cacheCookies from '@/utils/auth';
  import LoginService from '@/api/login';
  import ArticleService from '@/api/ArticleService';
  import DynamicFormService from '@/api/DynamicFormService';
  import Cookies from 'js-cookie';
  import ConfigUtil from '@/utils/ConfigUtil';

  export default {
    computed: {
      ...mapGetters([
        'permission_routers',
        'area',
      ]),

    },
    mixins: [home],
    data() {
      return {
        routers: [],
        articleCategorys: [],
        articles: [],
        articleCategoryActiveIndex: '0',
        coverArticles: [],
        hotList: [],
        commonUseList: [
        ],
        groupCategorysCounters:[],
        groupProgressCounters:[],
        loadingText: '正在加载,请稍后...',
      };
    },
    async created() {
      this.init();
      var that = this;
      var time = parseInt(Math.random() * 5);
      var interTime = 0;

      var sm = {formItemId:"2c92ebd175fa23190175ff6ec39b0013"};
      ConfigUtil.areaToSM(sm, this.area);
      var res = await DynamicFormService.doGroupByDynamicFormItemValueCount(sm);
      this.groupCategorysCounters = res;

      var progressSM = {formItemId:"2c92ebd175fa23190175ff7aed9a0046"};
      ConfigUtil.areaToSM(progressSM, this.area);
      this.groupProgressCounters = await DynamicFormService.doGroupByDynamicFormItemValueCount(progressSM);

      console.log("this.groupCategorysCounters:", this.groupProgressCounters);
    },
    methods: {
      async init() {
        var existSecondLevelRoutes = [];
        //找出前台路由中所有从后台获取的路由（菜单）的二级菜单
        //前三项不需要查询
        for (var j = 3; j < this.permission_routers.length; j++) {
          if (this.permission_routers[j].children && this.permission_routers[j].children.length > 0) {
            this.permission_routers[j].children.forEach(function(item) {
              if (item.settingUrl) {
                existSecondLevelRoutes.push(item);
              }
            });
          }
        }

        //加载图文列表
        this.articleCategorys = await ArticleService.doSearchTreeJson();
        this.articleCategorys.unshift({name: '全部', id: null});
        this.handleArticleCategorySelect(0);

        //加载带图新闻
        var sm = {count: 4, page: 1, hasCover: 1};
        var pageRes = await ArticleService.doPage(sm);
        pageRes.data.forEach(item => {
          if (item.showPicUrl) {
            this.coverArticles.push(item);
          }
        });
      },
      toHot(url) {
        this.$router.push('home/article_detail');
      },
      toArticleDetail(id) {
        this.$router.push('/open/article_detail?id=' + id);
      },
      async handleArticleCategorySelect(index) {
        var category = this.articleCategorys[index];
        var sm = {count: 8, page: 1, categoryId: category.id};
        var pageRes = await ArticleService.doPage(sm);
        this.articles = pageRes.data;
      },
      toCommonPage(tab) {
        this.permission_routers.sort(function sortNumber(a, b) {
          return a.orderNum - b.orderNum;
        });
        this.routes = this.permission_routers;
        let layout = this.$root.$children[0].$children[0];
        let topbar = layout.$children[0].$children[0].$children[0];

        localStorage.setItem('path', this.routes[+tab.name].path + '/' + this.routes[+tab.name].children[tab.selectTwo].path) + '?index=' + tab.index;
        localStorage.setItem('name', tab.name);
        localStorage.setItem('index', tab.index);
        localStorage.setItem('selectTwo', tab.selectTwo);
        this.$store.state.selectTwo = localStorage.getItem('selectTwo');
        layout.topMenuSelect(this.routes[+tab.name]);
        topbar.tagId = tab.name + '';
        layout.changeOne();

      },
    },
  };
</script>



