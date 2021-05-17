<template>
  <div>
    <div class="custom-image-swiper">
      <div class="swiper-container" style="height: 224px">
        <div class="swiper-wrapper" v-for="item in carouselTile.itemLists">
          <div style="height: 224px" class="swiper-slide">
            <a href="javascript: void(0);" style="height: 224px;">
              <img :src="item.showImgUrl" style="max-height: 224px;">
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-pagination">
      <span class="swiper-pagination-switch swiper-active-switch"></span>
      <span class="swiper-pagination-switch"></span>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'imageSwiper',
    props:['carouselTile'],
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .custom-image-swiper {
    width: 100%;
    position: relative;
  }
  .swiper-container {
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
    z-index: 1;
  }
  .swiper-wrapper {
    position: relative;
    width: 100%;
    -webkit-transition-property: -webkit-transform, left, top;
    -webkit-transition-duration: 0s;
    -webkit-transform: translate3d(0px, 0, 0);
    -webkit-transition-timing-function: ease;
    -moz-transition-property: -moz-transform, left, top;
    -moz-transition-duration: 0s;
    -moz-transform: translate3d(0px, 0, 0);
    -moz-transition-timing-function: ease;
    -o-transition-property: -o-transform, left, top;
    -o-transition-duration: 0s;
    -o-transform: translate3d(0px, 0, 0);
    -o-transition-timing-function: ease;
    -o-transform: translate(0px, 0px);
    -ms-transition-property: -ms-transform, left, top;
    -ms-transition-duration: 0s;
    -ms-transform: translate3d(0px, 0, 0);
    -ms-transition-timing-function: ease;
    -webkit-transition-property: -webkit-transform, left, top;
    -moz-transition-property: -moz-transform, left, top;
    transition-property: transform, left, top;
    -webkit-transition-duration: 0s;
    -moz-transition-duration: 0s;
    transition-duration: 0s;
    -webkit-transform: translate3d(0px, 0, 0);
    -moz-transform: translate3d(0px, 0, 0);
    transform: translate3d(0px, 0, 0);
    -webkit-transition-timing-function: ease;
    -moz-transition-timing-function: ease;
    transition-timing-function: ease;
  }
  .swiper-slide {
    float: left;
  }
  .swiper-slide a {
    display: block;
    position: relative;
    text-align: center;
    width: 320px;
  }
  .swiper-slide a img {
    max-width: 100%;
    height: auto;
  }
  .app-preview .swiper-pagination {
    text-align: center;
    position: absolute;
    bottom: 5px;
    width: 100%;
    z-index: 1;
    margin: 0;
  }
  .swiper-pagination-switch {
    display: inline-block;
    margin: 7px 4px 0;
    width: 5px;
    height: 5px;
    cursor: pointer;
    background-color: rgba(255,255,255,.7);
    border-radius: 50%;
  }
  .swiper-active-switch {
    background-color: rgba(255,0,0,1);
  }
</style>
