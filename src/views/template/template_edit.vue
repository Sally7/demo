<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <div class="app-init-container">
        <div class="app__content">
          <div class="app-design clearfix">
            <!-- 左侧显示区域 -->
            <div class="app-preview">
              <div class="app-entry">
                <!-- 标题 -->
                <page-title></page-title>
                <div class="app-fields js-fields-region">
                  <div class="app-fields ui-sortable" v-for="tile in tileList" @click="showEditPanel(tile)">
                    <!-- 轮播图 -->
                    <div class="app-field clearfix editing" v-if="tile.style===1">
                      <div class="control-group">
                        <image-swiper v-bind:carouselTile="tile"></image-swiper>
                        <div class="component-border"></div>
                      </div>
                      <unit-action></unit-action>
                    </div>
                    <!-- 服务分类 -->
                    <div class="app-field clearfix editing" v-if="false">
                      <div class="control-group">
                        <service-nav v-bind:serviceTile="tile"></service-nav>
                        <div class="component-border"></div>
                      </div>
                      <unit-action></unit-action>
                    </div>
                    <!-- 公告 -->
                    <div class="app-field clearfix editing" v-if="false">
                      <div class="control-group">
                        <notice></notice>
                      </div>
                      <unit-action></unit-action>
                    </div>
                    <!-- 橱窗1 -->
                    <div class="app-field clearfix editing" v-if="tile.style===10">
                      <div class="control-group">
                        <shop-window v-bind:shopWindowTile="tile"></shop-window>
                      </div>
                      <unit-action></unit-action>
                    </div>
                    <!-- 橱窗2 -->
                    <div class="app-field clearfix editing" v-if="tile.style===11">
                      <div class="control-group">
                        <shop-window2 v-bind:shopWindowTile2="tile"></shop-window2>
                      </div>
                      <unit-action></unit-action>
                    </div>
                    <!-- 商品 -->
                    <div class="app-field clearfix editing" v-if="false">
                      <div class="control-group">
                        <goods-layout v-bind:goodsTile="tile"></goods-layout>
                      </div>
                      <unit-action></unit-action>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 组件菜单 -->
              <unit-menu-list></unit-menu-list>
            </div>

            <!-- 右侧编辑区域 -->
            <div class="app-sidebar" style="margin-top: 64px;" v-show="editTile.style">
              <div class="arrow"></div>
              <div class="app-sidebar-inner js-sidebar-region">
                <image-swiper-edit v-bind:carouselTile="editTile" v-if="editTile.style===1" v-on:addAdvertising="toAddAdvertising"></image-swiper-edit>
                <service-nav-edit v-if="false"></service-nav-edit>
                <notice-edit v-if="false"></notice-edit>
                <shop-window-edit v-bind:shopWindowTile="editTile" v-if="editTile.style===10 || editTile.style===11"></shop-window-edit>
                <unit-menu-list v-if="true"></unit-menu-list>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <!-- 确认删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 隐藏加.hide -->
    <div class="widget-attachment modal in" style="top: 0px;" v-show="uploadEditPanelShow">
      <div class="js-main-region">
        <div>
          <div class="modal-header">
            <a class="close" data-dismiss="modal">×</a>
            <span class="title">我的图片</span>
            <a href="javascript:;" class="title js-show-icon-view">图标库</a>
            <div class="search-region">
              <div class="ui-search-box" style="top: 6px; right: 60px;">
                <input class="txt js-search-input" type="text" placeholder="搜索" value="">
              </div>
            </div>
          </div>
          <div class="modal-body">
            <div class="category-list-region js-category-list-region">
              <ul class="category-list">
                <li class="js-category-item active" data-id="2">
                  未分组
                  <span>458</span>
                </li>
              </ul>
            </div>
            <div class="attachment-list-region js-attachment-list-region">
              <ul class="image-list">
                <li class="image-item js-image-item" data-id="671789989">
                  <div class="image-box" style="background-image: url(https://img.yzcdn.cn/upload_files/2016/08/04/Fif6cfwlhGdm30Yso3-RIDXD4foD.jpg?imageView2/2/w/240/h/240/q/75/format/webp)"></div>
                  <div class="image-meta">400*271</div>
                  <div class="image-title">t016d58eb355a1c757d.jpg</div>
                </li>
              </ul>
              <div class="attachment-pagination js-attachment-pagination" style="text-align: right">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage1"
                  :page-size="100"
                  layout="total, prev, pager, next"
                  :total="1000">
                </el-pagination>
              </div>
              <el-button type="success" class="upload-btn" style="position:absolute;left:180px;
                    bottom:16px;" @click="uploadLocalImg()">上传图片</el-button>
            </div>
          </div>
          <div class="modal-footer clearfix">
            <div class="selected-count-region js-selected-count-region hide" style="display: none;">
              已选择<span class="js-selected-count">2</span>张图片
            </div>
            <div class="text-center">
              <button class="ui-btn js-confirm ui-btn-disabled" @click="uploadAdvertisingPic()">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="widget-attachment modal in" style="top: 0px;" v-show="uploadLocalImgShow">
      <div class="js-main-region">
        <div>
          <div class="modal-header">
          </div>
          <div class="modal-body">
            <el-upload
              action="http://swdev.suconnected.com/file_uploadImg.do"
              list-type="picture-card"
              :file-list="carouselImages"
              :multiple="true"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <div class="modal-footer clearfix">
            <div class="selected-count-region js-selected-count-region hide" style="display: none;">
              已选择<span class="js-selected-count">2</span>张图片
            </div>
            <div class="text-center">
              <button class="ui-btn js-confirm ui-btn-disabled" @click="uploadAdvertisingPic()">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-show="uploadEditPanelShow"></div>
  </div>
</template>

<script>
  import PageTitle from './components/page_title.vue'
  import UnitMenuList from './components/unit_menu_list.vue'
  import ImageSwiper from './components/image_swiper.vue'
  import UnitAction from './components/unit_action.vue'
  import ServiceNav from './components/service_nav.vue'
  import Notice from './components/notice.vue'
  import ShopWindow from './components/shop_window.vue'
  import ShopWindow2 from './components/shop_window_2.vue'
  import GoodsLayout from './components/goods_layout.vue'
  import ImageSwiperEdit from './components/image_swiper_edit.vue'
  import NoticeEdit from './components/notice_edit.vue'
  import ServiceNavEdit from './components/service_nav_edit.vue'
  import ShopWindowEdit from './components/shop_window_edit.vue'
  import {doGetTilesHomePage} from '@/api/templateEdit'
  export default {
    created() {
      this.doGetTilesHomePage();
    },
    data() {
      return {
        radio: '1',
        currentPage1: 5,
        carouselSize: '1',
        dialogImageUrl: '',
        dialogVisible: false,
        dialogVisible2: false,
        carouselEditPanelShow:false,
        uploadEditPanelShow:false,
        uploadLocalImgShow:false,
        tileList:[],
        editTile:{},
        carouselImages:[],//轮播的图片数组
        carouselTile:{},//轮播的tile
      }
    },
    components: {
      PageTitle, ImageSwiper, UnitAction, ServiceNav, Notice, ShopWindow,ShopWindow2, GoodsLayout, ImageSwiperEdit,NoticeEdit,ServiceNavEdit,ShopWindowEdit,UnitMenuList
    },
    mounted() {
    },
    methods: {
      doGetTilesHomePage(){ //获取商户首页
        var self = this;
        doGetTilesHomePage({belong:'2c933e675c5c1618015c5ddec48e003f'},function (response) {
          self.tileList = response;
        })
      },
      showEditPanel(tile){
        this.editTile  = tile
        console.log(this.editTile.style)
        this.carouselEditPanelShow = !this.carouselEditPanelShow;
      },
      toAddAdvertising(){
        this.uploadEditPanelShow = !this.uploadEditPanelShow;
      },
      uploadAdvertisingPic(){
        this.uploadEditPanelShow = false;
        this.uploadLocalImgShow = false;
        //doAddOrUpdateTilesHome(this.carouselTile,function (response) {
        //});
      },
      uploadLocalImg(){ //上传本地图片
        this.uploadEditPanelShow = false;
        this.uploadLocalImgShow = true;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleAvatarSuccess(res, file){
        this.doCarouselTileAU(res);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      doCarouselTileAU(res){ //查询单个模板及模块内的图片
        this.carouselTile.itemlists.push({id:'',actionParam:'',actionType:'',belong:'123456',description:'',tilesId:'',title:'',type:'',imageUrl:res.relative,showImgUrl:res.absolute,width:'',height:''});
      },
      showServiceEditPanel(){
        this.serviceEditPanelShow = !this.serviceEditPanelShow;
      }

    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .app-preview a {
    text-decoration: none;
  }
  .app-design .app-preview .app-fields-group:before, .app-design .app-preview .app-fields-group:after {
    position: absolute;
    content: ' ';
    border: 8px solid transparent;
    border-bottom-width: 10px;
    border-bottom-color: #fff;
    top: -17px;
    left: 148px;
  }
  .app-design .app-preview .app-fields-group:before {
    top: -19px;
    border-bottom-color: #ddd;
  }
  .app-preview .app-fields-group {
    -webkit-box-shadow: 0 0 0 1px #ddd;
    box-shadow: 0 0 0 1px #ddd;
    left: 0;
    top: 0;
  }
  .app-design {
    min-width: 750px;
    width: 750px;
    margin: 0 auto;
  }
  .app-design .app-preview {
    position: relative;
    float: left;
    width: 320px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 24px;
  }
  .app-design .app-preview .app-entry {
    width: 320px;
    margin: 0 auto;
    padding-bottom: 11px;
    min-height: 200px;
    background: #f9f9f9;
    -webkit-box-shadow: 0 0 0 1px #c5c5c5;
    box-shadow: 0 0 0 1px #c5c5c5;
    box-sizing: content-box;
    -webkit-box-sizing: content-box;
  }
  .app-preview .app-field {
    position: relative;
    cursor: pointer;
    background-color: #f9f9f9 ! important;
  }
  .app-design .app-preview .app-fields .app-field:last-child {
    border-bottom: none;
  }
  .app-design .app-preview .app-field .control-group {
    margin: 0;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    min-height: 10px;
  }
  /* sidebar --start */
  .app-design .app-sidebar {
    position: relative;
    float: left;
    width: 420px;
    margin: 0 0 50px 10px;
    font-size: 14px;
  }
  .app-design .app-sidebar .arrow, .app-design .app-sidebar .arrow:after {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 7px 6px 0;
    border-color: transparent #d1d1d1 transparent transparent;
    position: absolute;
    left: -6px;
    top: 19px;
  }
  .app-design .app-sidebar .arrow, .app-design .app-sidebar .arrow:after {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 7px 6px 0;
    border-color: transparent #d1d1d1 transparent transparent;
    position: absolute;
    left: -6px;
    top: 19px;
  }
  .app-design .app-sidebar .arrow:after {
    content: "";
    border-right-color: #f8f8f8;
    left: 2px;
    top: -6px;
  }
  .app-design .app-sidebar .app-sidebar-inner {
    padding: 12px 10px;
    min-height: 28px;
    background: #f8f8f8;
    border-radius: 5px;
    border: 1px solid #d1d1d1;
  }
  /* sidebar --end */
  /* 弹窗 */
  .modal {
    position: absolute;
    top: 10%;
    left: 50%;
    z-index: 1050;
    width: 560px;
    margin-left: -280px;
    margin-top: auto;
    outline: 0;
    background-color: #fff;
    border: 1px solid #999;
    border: 1px solid rgba(0,0,0,.3);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-box-shadow: 0 3px 7px rgba(0,0,0,.3);
    -moz-box-shadow: 0 3px 7px rgba(0,0,0,.3);
    box-shadow: 0 3px 7px rgba(0,0,0,.3);
    -moz-background-clip: padding-box;
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
  }
  .hide {
    display: none;
  }
  .widget-attachment {
    width: 862px;
    margin-left: -431px;
    border: 1px solid #ccc;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .modal-header {
    padding: 9px 15px;
    border-bottom: 1px solid #eee;
  }
  .widget-attachment .modal-header {
    padding: 6px 0 6px 15px;
    margin-right: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .close {
    float: right;
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .2;
    filter: alpha(opacity=20);
  }
  .modal-header .close {
    margin-top: 2px;
  }
  .widget-attachment .modal-header .close {
    font-size: 32px;
  }
  .modal-header .title, .modal-header h4 {
    margin: 0;
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
  }
  .widget-attachment .modal-header .title {
    font-size: 14px;
    line-height: 28px;
    margin-right: 20px;
  }
  .ui-search-box {
    top: 0px;
    right: 0px;
    position: absolute;
    z-index: 10;
    vertical-align: middle;
    margin: 0;
  }
  .ui-search-box .txt {
    width: 70px;
    height: 16px;
    padding: 5px;
    font-size: 12px;
    line-height: 16px;
    border: 1px solid #ddd;
    margin: 0;
    padding-left: 20px;
    background: #fff url(/v2/image/ico-search.png) 4px center no-repeat;
    background-image: -webkit-image-set( url(/v2/image/ico-search.png) 1x, url(/v2/image/ico-search@2x.png) 2x);
    border-radius: 2px;
    -webkit-transition: width linear 0.25s;
    -moz-transition: width linear 0.25s;
    transition: width linear 0.25s;
  }
  .modal-body {
    position: relative;
    max-height: 400px;
    padding: 15px;
    overflow-y: auto;
    max-height: none;
  }
  .widget-attachment .modal-body {
    padding: 0;
    height: 529px;
  }
  .widget-attachment .modal-body .category-list-region {
    float: left;
    width: 160px;
    height: 529px;
    padding: 9px 0;
    background: #f2f2f2;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
  }
  ol, ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .widget-attachment .modal-body .category-list-region li {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding: 0 40px 0 15px;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .widget-attachment .modal-body .category-list-region li.active {
    background: #fff;
  }
  .widget-attachment .modal-body .category-list-region li span {
    position: absolute;
    right: 10px;
    top: 0px;
    color: #999;
  }
  .widget-attachment .modal-body .attachment-list-region {
    padding: 20px 20px 10px 160px;
    width: 680px;
  }
  .widget-attachment .modal-body .image-list {
    height: 430px;
    margin-left: 5px;
  }
  .widget-attachment .modal-body .image-list .image-item {
    position: relative;
    float: left;
    width: 120px;
    height: 120px;
    margin-left: 15px;
    margin-bottom: 30px;
    cursor: pointer;
  }
  .widget-attachment .modal-body .image-list .image-box {
    background: #ccc;
    width: 120px;
    height: 120px;
    background-size: cover;
    background-position: 50% 50%;
  }
  .widget-attachment .modal-body .image-list .image-meta {
    position: absolute;
    width: 120px;
    height: 25px;
    line-height: 25px;
    color: #fff;
    text-align: center;
    background: rgba(0,0,0,0.2);
    bottom: 0;
  }
  .widget-attachment .modal-body .image-list .image-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-top: 5px;
  }
  .widget-attachment .modal-body .attachment-pagination {
    position: absolute;
    bottom: 10px;
    width: 680px;
    padding: 6px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #f8f8f8;
  }
  .upload-wrap {
    padding: 80px 20px;
  }
  .modal-footer {
    margin-bottom: 0;
    padding: 14px 15px 15px;
    text-align: right;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    -webkit-border-radius: 0 0 6px 6px;
    -moz-border-radius: 0 0 6px 6px;
    border-radius: 0 0 6px 6px;
    -webkit-box-shadow: inset 0 1px 0 #fff;
    -moz-box-shadow: inset 0 1px 0 #fff;
    box-shadow: inset 0 1px 0 #fff;
  }
  .widget-attachment .modal-footer {
    position: relative;
    background: #fff;
  }
  .widget-attachment .modal-footer .selected-count-region {
    position: absolute;
    left: 15px;
    top: 20px;
  }
  .center, .text-center {
    text-align: center;
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    background-color: #000;
  }
  .modal-backdrop {
    background: #000;
    opacity: 0.7;
  }
</style>
