<template>
  <div class="article-detail">
    <h1 class="title">{{model.title}}</h1>
    <div class="time">时间：{{model.creatTime | parseTime}}</div>
    <el-divider></el-divider>
    <article v-html="model.content">
    </article>
  </div>
</template>

<script>
  import ArticleService from '@/api/ArticleService'

  export default {
      name: "article_detail",
      data() {
        return {
          model:{id:this.$route.query.id},
        }
      },
      async created() {
        this.model = await ArticleService.doGet(this.model.id);
      }
    }
</script>

<style rel="stylesheet/css" lang="scss" scoped>
  .article-detail {
    padding: 0;
    padding-bottom: 32px;
    min-width: 740px;
    min-height: 620px;
    -webkit-box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    h1.title{
      padding-top: 30px;
      text-align: center;
      line-height: 100px;
    }
    .el-divider--horizontal{
      margin-top: 12px;
    }
    .time{
      color: #666666;
    }
    h2, h3{
      text-align: center;
      line-height: 60px;
    }
    p{
      margin-top: 30px;
      text-indent: 40px;
      line-height: 30px;
    }
    .el-image{
      margin-top: 20px;
    }
  }
</style>
