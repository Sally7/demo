<template>
    <div>
        <ul class="choices ui-sortable">
            <li class="choice" v-for="item in imageTile.itemLists">
              <div class="choice-image">
                <img :src="item.showImgUrl" width="118" height="118" class="thumb-image">
                  <a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>
              </div>
              <div class="choice-content">
                  <div class="control-group">
                      <label class="control-label">标题：</label>
                      <div class="controls">
                          <input class="" type="text" name="title[c2133]" v-model="item.title">
                      </div>
                  </div>
                  <div class="control-group">
                      <label class="control-label">链接：</label>
                      <div class="controls">
                          <input type="hidden" name="link_url">
                      <div class="dropdown hover">
                          <a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a>
                          <ul class="dropdown-menu">
                          <li>
                              <a class="js-modal-magazine" data-type="feature" href="javascript:void(0);">微页面及分类</a>
                          </li>
                          <li>
                              <a class="js-modal-links" data-type="links" href="javascript:void(0);">自定义外链</a>
                          </li>
                      </ul>
                      </div>
                      </div>
                  </div>
              </div>
              <div class="actions">
                  <span class="action add close-modal" title="添加">+</span><span class="action delete close-modal" title="删除">×</span>
              </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    props:['imageTile'],
  	data() {
      	return {
        }
    },
    created() {
        console.log('ppppppppp');
        console.log(this.imageTile);
    },
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .control-group {
      margin-bottom: 10px;
  }
  .control-group:after, .control-group:before {
      display: table;
      line-height: 0;
      content: "";
  }
	.choice {
      position: relative;
      border: 1px solid #e5e5e5;
      margin: 10px 0 0;
      padding: 14px;
      background: #fff;
      zoom: 1;
  }
  .choice:after {
      content: "";
      display: table;
      clear: both;
  }
  .choice .choice-image {
      position: relative;
      float: left;
      width: 120px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
  }
  .choice .choice-image img {
      min-height: 120px;
      border: 1px solid #e5e5e5;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      vertical-align: bottom;
      position: relative;
  }
  .choice .choice-image .modify-image {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 118px;
      height: 32px;
      line-height: 32px;
      color: #fff;
      background: rgba(0,0,0,0.5);
  }
  .controls {
    word-break: break-all;
  }
  .choice .choice-image .controls {
      margin-left: 0;
  }
  .choice .choice-content {
      float: left;
      width: 248px;
  }
  .choice-content .control-group:last-of-type {
      margin-bottom: 0;
  }
  .choice .choice-content .control-label {
      float: left;
      width: 54px;
      text-align: right;
      padding-top: 5px;
      margin-bottom: 0;
      font-size: 14px;
      line-height: 18px;
  }
  .choice .choice-content .controls {
      margin-left: 54px;
  }
  .choice .choice-content .controls input {
      width: 180px;
      font-size: 12px;
  }
  .dropdown, .dropup {
      display: inline-block;
      position: relative;
  }
  .control-action {
      padding-top: 5px;
      display: inline-block;
      font-size: 14px;
      line-height: 18px;
  }
  .caret {
      display: inline-block;
      width: 0;
      height: 0;
      vertical-align: top;
      border-top: 4px solid #000;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      content: "";
  }
  .dropdown .caret {
      margin-top: 8px;
      margin-left: 2px;
  }
  .dropdown-menu {
      min-width: 110px;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      display: none;
      float: left;
      padding: 5px 0;
      margin: 2px 0 0;
      background-color: #fff;
      -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);
      -moz-box-shadow: 0 5px 10px rgba(0,0,0,.2);
      box-shadow: 0 5px 10px rgba(0,0,0,.2);
      -webkit-background-clip: padding-box;
      -moz-background-clip: padding;
      background-clip: padding-box;
      border: 1px solid rgba(0,0,0,0.125);
      border-radius: 4px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
  }
  .dropdown.hover:hover .dropdown-menu, .dropup.hover:hover .dropdown-menu {
      display: block;
  }
  .dropdown ul.dropdown-menu {
    margin: 0;
  }
  .dropdown-menu>li>a {
    display: block;
      padding: 3px 15px;
      font-weight: 400;
      line-height: 20px;
      color: #333;
      white-space: nowrap;
  }
  .actions {
      position: absolute;
      top: -10px;
      right: -10px;
      display: none;
  }
  .choice:hover .actions {
      display: block;
  }
  .close-modal {
    display: inline-block;
      z-index: 2;
      top: -9px;
      right: -9px;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      font-size: 16px;
      line-height: 18px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: rgba(153,153,153,0.6);
      border-radius: 10px;
  }
  .actions .close-modal:last-of-type {
      margin-right: 0;
  }
</style>
