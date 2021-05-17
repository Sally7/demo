<template>
  <div class="brands">
      <el-dialog title="选择品牌" :visible.sync="p_dialogBrandsVisible" :before-close="handleClose">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-tree
              :data="goodsCategories"
              default-expand-all
              :expand-on-click-node="false"
              node-key="id"
              @node-click="handleCategoryNodeClick">
            </el-tree>
          </el-col>
          <el-col :span="16">
            <p class="text-center" v-if="isBrandEmpty">暂无数据</p>
            <div v-else>
              <!-- <div class="retrieval-wrap">
                  <ul class="ui-retrieval" >
                      <li ng-show="false">
                          <div class="retrieval-item">
                              <span class="hot-icon"></span>
                          </div>
                      </li>
                      <li v-for="brandLetter in brandFirstLetters"  ng-click="doSelectBrandLetter(brandLetter)">
                          <div class="retrieval-item" ng-class="{'selected':brandLetter.key == currentBrandLetterKey}">{{brandLetter.key}}</div>
                      </li>
                  </ul>
              </div> -->
              <div class="brand-list">
                  <ul>
                      <li class="brand-box" v-for="brand in brandList">
                          <div class="brand-item" :class="{selected:brand.checked}" @click="brand.checked=!brand.checked;">
                              <div class="brand-icon"></div>
                              <div class="brand-info">
                                  <h4 class="ui-nowrap">{{brand.name}}</h4>
                              </div>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="doConfirm">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import GoodsService from '@/api/GoodsService'
  import propsync from '@/mixins/propsync'
  export default {
    name:"Brands",
    mixins: [propsync],
    props: {
      dialogBrandsVisible: {
        type: Boolean
      },
      goodsCategories:{
        type: Array,
        propsync:false
      },
      choosedBrandList:{
        type: Array,
        propsync:false
      }
    },
    data() {
      return {
        isBrandEmpty: false, //品牌是否为空
        brandList: [], //所有品牌
        couponList:[]
      }
    },
    created() {
      
    },
    watch: {
      selectedCoupons(val) {
        console.log("CouponSelect/index.vue->watch->selectedCoupons.......");
        var self = this;

        if(val) {
          //比较找出减少和添加的 减少的进行复位  增加的进行更新
          var cloneCoupons = [];
          self.selectedCouponList = [];

          val.forEach(function (scoupon) {
            cloneCoupons.push(JSON.parse(JSON.stringify(scoupon)));
          });

          //重置选项
          self.couponList.forEach(function (coupon) {
            coupon.combinationEnable = false;
            coupon.combination ='';
            coupon.count = 1;
          });

          if(typeof self.$refs.couponTable != "undefined"){
            self.$refs.couponTable.clearSelection();
          }

          //还原设置
          cloneCoupons.forEach(function (scoupon) {
            var isHas = false;
            self.couponList.forEach(function (coupon) {
              if(coupon.id == scoupon.id) {
                isHas = true;
                coupon.combination =scoupon.combination;
                if(coupon.combination) {
                  coupon.combinationEnable = true;
                }
                coupon.count = scoupon.count;
                if(typeof self.$refs.couponTable != "undefined") {
                  self.$refs.couponTable.toggleRowSelection(coupon);
                } else {
                  setTimeout(function () {
                    self.$refs.couponTable.toggleRowSelection(coupon);
                  }, 300);
                }
                self.selectedCouponList.push(coupon);
              }
            });
            if(!isHas) {
              self.selectedCouponList.push(scoupon);
            }
          });
        }
      }
    },
    methods: {
      handleCategoryNodeClick(data){
        this.doSearchByCategory(data.id);
      },
      // 根据分类id查询品牌
      async doSearchByCategory(id){
        var that = this;
        var response = await GoodsService.doSearchByCategory(id);
        if(response.status == 1 && response.data && response.data.length>0){
          this.isBrandEmpty = false;
          response.data.forEach(function(item, index){
            item.categoryId = id;
            item.checked = false;
            that.choosedBrandList.forEach(function(choosedBrand, index){
              if(choosedBrand.id == item.id){
                item.checked = true;
              }
            });
          });
          this.brandList = response.data;
        }else {
          this.isBrandEmpty = true;
        }
      },
      handleClose() {
          this.p_dialogBrandsVisible = false;
      },
      //确认品牌选择并赋给品牌标签
      doConfirm(){
        this.handleClose();
        var choosedBrands = [];
        this.brandList.forEach(function(brand){
          if(brand.checked){
            choosedBrands.push(brand);
          }
        });
        this.$emit("doChooseBrands", choosedBrands);
      },
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
/* dialog */
.ui-retrieval{
    padding: 10px 0;
    overflow: hidden;
}
.ui-retrieval>li{
    float: left;
    padding-left: 7px;
    padding-right: 6px;
    padding-bottom: 10px;
    -webkit-box-sizing: border-box;
}
.retrieval-item{
    width:24px;
    height:24px;
    color: #666;
    font-size:14px;
    border: 1px solid #cccccc;
    border-radius: 50%;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    cursor: pointer;
}
.retrieval-item.selected{
    color: #fff;
    background-color:#CD2B3A;
}
.hot-icon{
    display: block;
    width:12px;
    height: 12px;
    /* background-image: url("../img/hot_1.png"); */
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
}
.retrieval-item.selected .hot-icon{
    /* background-image: url("../img/hot_2.png"); */
}
.brand-list{
    margin: 0 -10px 0 2px;

}
.brand-list ul{
    overflow: hidden;
}
.brand-box{
    width: 25%;
    min-width: 110px;
    height: 65px;
    float: left;
    padding-right: 15px;
    padding-bottom:10px;
    box-sizing: border-box;
    background-color: #fff;
}
.brand-item{
    width:100%;
    height:100%;
    padding: 0 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #ddd;
    box-sizing: border-box;
    cursor: pointer;
}
.brand-item.selected{
    border-color:#F56C6C;
}
.brand-icon{
    width: 40px;
    height: 40px;
    margin-right: 10px;
    background-size: cover;
}
.brand-info{
}
.brand-info h4{
    font-size: 14px;
    line-height: 1.5;
}
.brand-info p{
    font-size: 12px;
    color: #777;
}
</style>
