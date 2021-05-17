<template>
    <div class="goods">
      	<ul class="sc-goods-list clearfix size-3 card list">
          <!-- 大图  -->
          <!-- 列表 -->
          <li class="goods-card card" v-for="item in goodsTile.itemlists">
              <a href="javascript: void(0);" class="link js-goods clearfix">
                 <div class="photo-block">
                     <img class="goods-photo js-goods-lazy" :src="item.showImgUrl">
                 </div>
                 <div class="info">
                      <p class="goods-title">{{item.title}}</p>
                      <p class="goods-price"><em>￥9999.00</em></p>
                      <p class="goods-price-taobao"></p>
                      <el-button class="goods-buy btn4" size="small">购买</el-button>
                 </div>
              </a>
          </li>
      </ul>
  	</div>
</template>

<script>

export default {
  name: 'goodsLayout',
  props:['goodsTile'],
  created() {
    console.log('goods goods goods!');
    console.log(this.goodsTile);
  },
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
	.sc-goods-list {
	    font-size: 12px;
	    padding: 5px;
	    list-style: none;
	    margin: 0;
	    -webkit-font-smoothing: antialiased;
	}
	.sc-goods-list .goods-card {
	    position: relative;
	}
	.sc-goods-list.list .goods-card.card {
	    -webkit-border-image: url(/v2/image/wap/border-line-2.png) 2 stretch;
	    -moz-border-image: url(/v2/image/wap/border-line-2.png) 2 stretch;
	    border-image: url(/v2/image/wap/border-line-2.png) 2 stretch;
	    border-top: 2px solid #e5e5e5;
	    border-right: 2px solid #e5e5e5;
	    border-bottom: 2px solid #e5e5e5;
	    border-left: 2px solid #e5e5e5;
	    margin: 8px 4px;
	    background: #fff;
	}
	.sc-goods-list .link {
	    display: block;
	    background: #fff;
	    min-height: 100px;
	}
	.sc-goods-list .photo-block {
	    text-align: center;
	    overflow: hidden;
	    position: relative;
	    background-color: #f8f8f8;
	    background-size: 6px 6px;
	}
	.sc-goods-list.list .goods-card .photo-block {
	    float: left;
	    margin-right: 13px;
	    width: 125px;
	    height: 125px;
	}
	.sc-goods-list .photo-block img {
	    position: absolute;
	    left: 0;
	    right: 0;
	    top: 0;
	    bottom: 0;
	    margin: auto;
	    vertical-align: bottom;
	    max-width: 100%;
	}
	.sc-goods-list.list .goods-card .photo-block img {
	    max-width: 125px;
	    max-height: 125px;
	}
	.sc-goods-list .info {
	    position: relative;
	}
	.sc-goods-list.list .goods-card .info {
	    height: 125px;
	    margin-left: 138px;
	}
	.sc-goods-list .info p {
	    margin: 0px;
	}
	.sc-goods-list .info p.goods-title {
	    line-height: 1.3;
	    overflow: hidden;
	    color: #333;
	}
	.sc-goods-list.list .goods-card .info .goods-title {
	    font-size: 14px;
	    max-height: 52px;
	    margin-bottom: 12px;
	}
	.sc-goods-list.list .goods-card.card .goods-title {
	    padding: 10px 6px 0 0;
	}
	.sc-goods-list .info p.goods-price {
	    padding: 0px;
	}
	.sc-goods-list.list .goods-card .info .goods-price {
	    position: absolute;
	    left: 0;
	    bottom: 15px;
	    font-size: 16px;
	}
	.sc-goods-list .info p.goods-price>em {
	    font-style: normal;
	    color: #ff4444;
	}
	.sc-goods-list .goods-buy {
	    position: absolute;
	}
	.sc-goods-list .goods-buy.btn4 {
	    right: 10px;
	    bottom: 8px;
	}
	.sc-goods-list.card.size-3 .goods-card .goods-buy.btn3, .sc-goods-list.card.size-3 .goods-card .goods-buy.btn4 {
	    bottom: 12px;
	}
</style>
