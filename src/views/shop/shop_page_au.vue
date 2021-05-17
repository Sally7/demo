<!--店铺页面au-->
<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="coms-lib-wrap">
      <div class="coms-lib coms-lib-active">
        <div class="coms-lib-tab">
          <div class="coms-lib-tab-icon">
            <i class="el-icon-caret-right"></i>
  <!--          <i class="el-icon-caret-bottom"></i>-->
          </div>
          <span class="coms-lib-tab-name">基础组件</span>
        </div>
        <div class="com-list">
          <div class="com-item com-item-active" draggable="true">
            <i class="com-item__icon" style="background-image: url(https://img.yzcdn.cn/public_files/2019/02/12/add4829af43def85a200029c3e485d77.png);"></i>
            <div class="com-item__name">
             商品组件
            </div>
          </div>
          <div class="com-item" draggable="true" @click="doAU">
            <i class="com-item__icon" style="background-image: url(https://img.yzcdn.cn/public_files/2019/02/12/add4829af43def85a200029c3e485d77.png);"></i>
            <div class="com-item__name">
              图片轮播
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview-wrap">
      <div class="preview-page">
        <div class="preview-page-options">
          <i class="preview-page-options-icon"></i>页面设置
        </div>
        <div class="preview-page-coms">
          <i class="preview-page-coms-icon"></i>组件管理
        </div>
      </div>
      <div class="preview">
        <div class="preview-head">
          <div class="preview-header-title">
            微页面标题
          </div>
        </div>
        <div class="preview-iframe-wrap">
          <div class="content">
            <div class="decorate-preview-container">
              <div class="com-item com-item--goods com-item-deletable"><!--商品 big-->
                <div class="cap-goods-layout">
                  <div class="cap-goods-layout__container big card" style="padding-left: 15px; padding-right: 15px; margin-left: -5px; margin-right: -5px;"><!-- big-->
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--0">
                      <div class="cap-goods-layout__item big card rect" style="margin: 5px;"><!-- big-->
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="com-item com-item--goods com-item-deletable"><!--商品 small-->
                <div class="cap-goods-layout">
                  <div class="cap-goods-layout__container small card" style="padding-left: 15px; padding-right: 15px; margin-left: -5px; margin-right: -5px;"><!-- small-->
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--0">
                      <div class="cap-goods-layout__item small card rect" style="margin: 5px;"><!-- small-->
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--1">
                      <div class="cap-goods-layout__item small card rect" style="margin: 5px;"><!-- small-->
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--2">
                      <div class="cap-goods-layout__item small card rect" style="margin: 5px;"><!-- small-->
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--3">
                      <div class="cap-goods-layout__item small card rect" style="margin: 5px;"><!-- small-->
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="com-item com-item--goods com-item-deletable"><!--商品 three-->
                <div class="cap-goods-layout">
                  <div class="cap-goods-layout__container three card" style="padding-left: 15px; padding-right: 15px; margin-left: -5px; margin-right: -5px;">
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--0">
                      <div class="cap-goods-layout__item three card rect" style="margin: 5px;">
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--1">
                      <div class="cap-goods-layout__item three card rect" style="margin: 5px;">
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--2">
                      <div class="cap-goods-layout__item threecard rect" style="margin: 5px;">
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--3">
                      <div class="cap-goods-layout__item three card rect" style="margin: 5px;">
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--4">
                      <div class="cap-goods-layout__item three card rect" style="margin: 5px;">
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="cap-goods-layout__wrapper cap-goods-layout__wrapper--5">
                      <div class="cap-goods-layout__item three card rect" style="margin: 5px;">
                        <div class="cap-goods__photo">
                          <div class="cap-goods__image-wrap" style="padding-top: 66.6667%;">
                            <div data-lazy-log="0" class="cap-goods__img cap-goods__img--cover" data-src="https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png!large.png" lazy="loaded" style="background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/179bbc6e77d7cd4f4b774f868b1b3c26.png');">

                            </div>
                          </div>
                        </div>
                        <div class="cap-goods-layout__info">
                          <div class="cap-goods-layout__info-title has-title-1 has-subtitle-1 big" goods-index="0" style="text-align: left;">
                            <div class="title" style="font-weight: normal;">这里显示商品名称，最多显示1行</div>
                            <div class="sub-title">这里显示商品描述，最多显示1行</div>
                          </div>
                          <div class="cap-goods-layout__info-price has-price-1 has-btn-1 big size--big left">
                            <div class="price-info" style="font-weight: normal; padding-right: 29px;">
                              <div class="sale-price">
                                <div class="cap-theme-view" style="color: rgb(255, 94, 21);">
                                  <div class="price-tag">¥</div>99
                                </div>
                              </div>
                            </div>
                            <div class="cap-goods-layout__buy-btn-wrapper big type-1">
                              <div class="cap-goods-layout__buy-btn-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="preview-height-tag">
          <span class="preview-height-tag-text">iPhone 8手机高度</span>
        </div>
      </div>
    </div>
<!--    右边内容-->
    <div class="decorate-editor-wrap">
      <div class="decorate-coupon-editor">

        <div class="deco-component-title deco-component-title--with-margin">
          <div class="deco-component-title__header">
            <span class="deco-component-title__name">商品</span>
            <a target="_blank" href="#" rel="noopener noreferrer" class="deco-component-title__link">查看教程</a>
          </div>
          <div class="deco-component-title__msg">最多添加10张优惠券</div>
        </div>

        <DynamicFormForPage moduleId="com_item_goods" :modelId="tileItem.id" ref="DynamicFormForPage"></DynamicFormForPage>


      </div>
      <div class="decorate-image-text-nav-editor">
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import DynamicFormForPage from '@/components/DynamicFormForPage'
  import GoodsSelect from '@/components/GoodsSelect'
  import TilesService from '@/api/TilesService'


  export default {
    data() {
      return {
        tiles:{},
        tileItem:{}
      }
    },
    components: {
      Breadcrumb,
      GoodsSelect,
      DynamicFormForPage
    },
    created() {


    },
    methods: {
      async doAU() {
        if(!this.tiles.id) {
          this.tiles.name="动态页面";
          this.tiles.groupId="2c933e6b6147d1c70162b928daec15ec";
          this.tiles = await TilesService.doAUTeTiles(this.tiles);
        }

        if(!this.tileItem.id) {
          this.tileItem.title = "商品组件";
          this.tileItem.moduleId = "com_item_goods";
          this.tileItem.tilesId = this.tiles.id;
          this.tileItem = await TilesService.doAUTileItem(this.tileItem);
        }

        this.$refs.DynamicFormForPage.doAUDynamicFormItemValueRelations(this.tileItem.id);
      }
    }
  }
</script>
<style scoped>
  @import 'shop_page_au.css';
  @import 'shop_page_au_mid.css';
</style>
