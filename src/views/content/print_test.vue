<template>
  <div class="container">
    <div @click="toDetail">22222</div>
  </div>

</template>

<script>

  export default{
    name: "article_view_list",
    components: {

    },
    data() {
      return {
      }
    },
    methods: {
      toDetail() {
        this.$router.push("/content/article_list/article_detail");
      }
    }
  }
</script>
<style scoped lang="scss">
  .container{
    margin-left: 10px;
    background-color: #fff;
    padding: 0;
    padding-bottom: 32px;
    min-width: 740px;
    min-height: 620px;
    -webkit-box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
  }

</style>
