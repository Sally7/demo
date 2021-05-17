<template>
  <div class="services">
    <ul class="custom-nav-4 clearfix">
      <li v-for="item in serviceTile.itemlists">
        <a href="javascript:;">
            <span class="nav-img-wap">
              <img :src="item.showImgUrl">
            </span>
          <span class="title">{{item.title}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'serviceNav',
    props:['serviceTile']
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .custom-nav-4 {
    padding: 5px;
    text-align: center;
  }
  .custom-nav-4 li {
    width: 25%;
    float: left;
    overflow: hidden;
    text-align: center;
  }
  .custom-nav-4 li a {
    display: block;
    padding: 0 2px;
  }
  .custom-nav-4 li .nav-img-wap {
    display: block;
    overflow: hidden;
  }
  .custom-nav-4 li img {
    vertical-align: middle;
    max-width: 100%;
  }
  .custom-nav-4 li span.title {
    color: #333;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
</style>
