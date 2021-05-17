<template>
  <div class="app-fields-group">
    <div class="app-fields-group__package">
      <p class="app-fields-group__package-title">基础组件</p>
      <div class="app-fields-group__package-list">
        <a class="js-new-field">轮播图</a>
        <a class="js-new-field">服务分类</a>
        <a class="js-new-field">头条</a>
        <a class="js-new-field">优惠券</a>
        <a class="js-new-field">活动橱窗</a>
        <a class="js-new-field">专题</a>
        <a class="js-new-field">商品</a>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'shopWindow'
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .app-fields-group {
    position: relative;
    padding: 0 6px 4px 10px;
    background: #fff;
    width: 320px;
    margin: 0 auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .app-fields-group__package {
    overflow: auto;
  }
  .app-fields-group__package-title {
    font-size: 12px;
    margin-bottom: 8px;
    margin-top: 13px;
  }
  .app-fields-group__package-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .app-fields-group__package a {
    border: 1px dashed #e5e5e5;
    color: #666;
    background: #f8f8f8;
    outline: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 30px;
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 96px;
    -moz-box-flex: 0;
    -ms-flex: 0 0 96px;
    flex: 0 0 96px;
    font-size: 12px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 0;
    cursor: pointer;
    text-align: center;
    line-height: 28px;
  }
  .app-fields-group__package a:nth-child(3n+3) {
    margin-right: 0;
  }
  .app-fields-group__package a:hover {
    background: #e8f7fd;
    border-color: #bdf;
  }
</style>
