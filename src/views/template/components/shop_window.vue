<template>
  <div class="custom-showcase-wrap custom-showcase-wrap-0">
    <div class="custom-showcase-header">
      <span class="header-decoration left">——</span>
      <span class="header-icon">
        <span :style="{backgroundImage:`url(${shopWindowTile.iconURL})`}"></span>
      </span>
      <div class="header-title">{{shopWindowTile.name}}</div>
      <span class="header-decoration right">——</span>
    </div>
    <div class="custom-showcase-body">
      <ul class="custom-showcase clearfix">
        <li class="custom-showcase-big">
          <h4 class="title">{{shopWindowTile.itemLists[0].title}}</h4>
          <p class="sub-title">{{shopWindowTile.itemLists[0].description}}</p>
          <img :src="shopWindowTile.itemLists[0].showImgUrl">
        </li>
        <li class="custom-showcase-small clearfix">
          <div class="col-txt">
            <h4 class="title">{{shopWindowTile.itemLists[1].title}}</h4>
            <p class="sub-title">{{shopWindowTile.itemLists[1].description}}</p>
          </div>
          <div class="col-img">
            <img :src="shopWindowTile.itemLists[1].showImgUrl">
          </div>
        </li>
        <li class="custom-showcase-small clearfix">
          <div class="col-txt">
            <h4 class="title">{{shopWindowTile.itemLists[2].title}}</h4>
            <p class="sub-title">{{shopWindowTile.itemLists[2].description}}</p>
          </div>
          <div class="col-img">
            <img :src="shopWindowTile.itemLists[2].showImgUrl">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'shopWindow',
    props:['shopWindowTile']
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .custom-showcase-header {
    position: relative;
    text-align: center;
    padding: 10px 0;
    line-height: 24px;
    font-size: 14px;
    color: #FF5757;
    border-bottom: 1px solid #e4e4e4;
  }
  .custom-showcase-header>span {
    display: inline-block;
    vertical-align: middle;
  }
  .header-decoration {
    width: 20px;
    overflow: hidden;
    position: relative;
  }
  .header-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    padding:6px;
    margin-left: 10px;
    background-color: #FF5757;
    border-radius: 50%;
    vertical-align: top;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .header-icon>span {
    display: block;
    width:100%;
    height:100%;
    -webkit-background-size: cover;
    background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
  }
  .header-title {
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
    font-size: 14px;
    vertical-align: bottom;
  }
  .custom-showcase-header .left:after {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -1px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #FF5757;
  }
  .custom-showcase-header .right:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -1px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #FF5757;
  }
  .custom-showcase-body {
    background-color: #fff;
  }
  .custom-showcase-wrap .custom-showcase {
    width: 320px;
    margin: 0 auto;
    padding: 1px 0 0;
    list-style: none;
  }
  .custom-showcase h4, .custom-showcase p {
    margin: 0;
    font-weight: normal;
  }
  .custom-showcase-wrap .custom-showcase li {
    float: left;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
  }
  .custom-showcase-wrap-0 .custom-showcase-big {
    width: 127px;
    height: 128px;
    border-right: 1px solid #e4e4e4;
  }
  .custom-showcase-big .title {
    padding: 10px 6px 0;
    font-size: 14px;
    text-align: left;
  }
  .custom-showcase-big .sub-title {
    height: 16px;
    padding: 0 6px;
    margin-top: 5px;
    font-size: 12px;
    text-align: left;
  }
  .custom-showcase-wrap-0 .custom-showcase-small {
    width: 192px;
    height: 63px;
    border-bottom: 1px solid #e4e4e4;
  }
  .col-txt {
    float: left;
    width: 70%;
    height: 100%;
    padding: 0 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .col-txt .title {
    font-size: 14px;
  }
  .col-txt .sub-title {
    font-size: 12px;
  }
  .col-img {
    float: left;
    width: 30%;
    height: 100%;
  }
  .custom-showcase-big img {
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 auto;
    margin-top: 25px;
  }
  .col-img img {
    display: block;
    width: 45px;
    height: 45px;
    margin-top: 9px;
  }
</style>
