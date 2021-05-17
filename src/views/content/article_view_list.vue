<template>
  <div class="container">
    <aside class="new-aside">
      <div class="shop_logo" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 0px; border-bottom: 1px solid rgb(238, 238, 238);">
        <span class="el-avatar el-avatar--medium el-avatar--circle" slot="reference"><img src="https://splatformnew.oss-cn-shanghai.aliyuncs.com/file/8b1376f0da5711ea8882a16b901082dd.png" style="object-fit: cover;" /></span>
        <div class="class_name">
          民兵
        </div>
      </div>
      <ul role="menubar" class="el-menu">
        <div class="menu-wrapper">
          <a href="#" class="router-link-exact-active router-link-active"><li role="menuitem" tabindex="-1" class="el-menu-item is-active"><span>档案管理</span></li></a>
          <a href="#" class=""><li role="menuitem" tabindex="-1" class="el-menu-item"><span>政治教育</span></li></a>
          <a href="#" class=""><li role="menuitem" tabindex="-1" class="el-menu-item"><span>军事训练</span></li></a>
        </div>
      </ul>
    </aside>
    <div class="news_right">
      <div class="module-title" style="display: flex; justify-content: space-between;">
        退伍
      </div>
      <div class="news_box">
        <a href="#/open/article_detail" class="item_box" v-for="(item,index) in newsList" :key="index">
          <div class="title" > <p class="dot"></p><div class="title_content">{{item.title}}</div></div>
          <div class="time">{{item.time}}</div>
        </a>
      </div>
    </div>
    </div>

</template>

<script>

  export default{
    name: "article_view_list",
    components: {

    },
    data() {
      return {
        newsList:[
          {
            id:1,
            title:'滨海新区2020年夏秋季征兵全面展开!',
            time:'2020-08-14'
          },{
            id:2,
            title:'滨海港经济区打造新型特色区!',
            time:'2020-08-13'
          },{
            title:'全县党委（党组）中心组学习四巡工作推进会召开了',
            time:'2020-08-14'
          },{
            title:'随着大学生征兵工作如火如荼地开展，日前社会征兵工作也全面启动',
            time:'2020-08-14'
          },{
            title:'按照统一部署，全国征兵将从8月1日开始，至9月30日结束，适龄青年8月5日前可登录“全国征兵网”',
            time:'2020-08-14'
          },{
            title:'破解大学生“当兵冷、征兵难”问题',
            time:'2020-08-14'
          },
        ],
      }
    },
    methods: {
      // toDetail() {
      //   this.$router.push("/content/article_list/article_detail");
      // }
    }
  }
</script>

<style rel="stylesheet/css" lang="scss" scoped>
  .container{
    display: flex;
    padding: 0;
    padding-bottom: 32px;
    min-width: 740px;
    min-height: 620px;
    -webkit-box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    .new-aside{
      width: 160px;
      margin-right: 10px;
      background-color: #fff;
      .class_name{
        margin-top: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      a {
        display: inline-block;
        width: 100%;
        text-align: center;
      }
      .svg-icon {
        margin-right: 5px;
      }
      .el-menu {
        border: none;
        width: 100%;
      }
      .el-menu-item {
        height: 44px;
        border-left: 2px solid #FFFFFF;
        line-height: 44px;
      }
      .el-menu-item.is-active {
        color: #409EFF;
        background-color:#e4edff;
        border-left: 3px solid #409EFF;
      }
      .el-menu-item:hover {
        color: #409EFF;
        background-color:#e4edff;
        border-left: 2px solid #F2C0C1;
      }
      .submenu .router-link-active .el-menu-item {
        color: #409EFF;
      }
    }
  }
  .news_right{
    width: 1050px;
    background-color: #fff;
    .news_box{
      width: 100%;
      height: 310px;
      padding: 30px;
      .item_box{
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .dot{
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background-color: #2B61B3;
          margin-right:15px ;
        }

        .title{
          display: flex;
          align-items: center;
        }
        .time{
          font-size: 15px;
        }
        .title_content{
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }
  }
</style>
