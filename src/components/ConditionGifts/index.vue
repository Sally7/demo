<template>
  <div>
    <div v-for="conditionGiftType in conditionGiftTypes">
      <el-checkbox :checked="conditionGiftType.checked" v-model="conditionGiftType.checked" @change="doConditionGiftTypeCheck(conditionGiftType)">{{conditionGiftType.text}}</el-checkbox>
      <el-button type="text" style="margin-left: 15px;" v-if="conditionGiftType.checked" @click="toSelectCoupon">添加</el-button>
      <template v-for="(conditionGift, index) in conditionGiftType.conditionGifts" v-if="conditionGiftType.checked">
        <div class="coupon-box" v-if="conditionGift.giftType == ConditionGiftType.GIFTTYPE_COUPON">
          <template>
            <div class="coupon">
              <span v-if="conditionGift.combination">{{conditionGift.combinationName}}</span>
              <i v-else>{{index+1}}.</i>

              <div class="spec" v-if="conditionGift.combination">{{conditionGift.combinationTotalCount}}选{{conditionGift.combinationCount}}</div>
              <i class="spec" v-else >必选</i>

              <div class="name">{{conditionGift.giftModel.couponName}}</div>

              <span class="limit" v-if="conditionGift.giftModel.couponCondition && conditionGift.giftModel.couponCondition!=''">({{conditionGift.giftModel.couponCondition}})</span>
              <i class="limit" v-else >(无限制)</i>

              <span class="amount">{{conditionGift.count}}张</span>
              <span class="del" @click="deleteSelectedConditionGift(conditionGift)">删除</span>

            </div>
          </template>
        </div>
      </template>
    </div>
    <CouponSelect :couponSelectShow="couponSelectShow" @onPropsChange="change" @onCouponSelected="onCouponSelected" :selectedCoupons="conditionGiftTypes[0].selectedCoupons"></CouponSelect>
  </div>
</template>

<script>
    import CouponSelect from '@/components/CouponSelect/index'
    import MarketingSceneService from '@/api/MarketingSceneService'
    import CouponService from '@/api/CouponService'
    export default{
      props: {
        conditionGifts:Array,
        index:Number
      },
      components: {
        CouponSelect
      },
      data(){
          return {
            couponSelectShow:false,
            ConditionGiftType:MarketingSceneService.getConditionGiftType(),
            conditionGiftTypes:[
              {text:"送优惠券", value:0, checked:false, conditionGifts:[]}
            ]
          }
        },
      created(){
        var self = this;
//        console.log("ConditionGifts/index.vue->created....");
        if(self.conditionGifts) {
          self.conditionGifts.forEach(function (conditionGift) {
            self.conditionGiftTypes.forEach(function (conditionGiftType) {
              if(conditionGift.giftType == conditionGiftType.value) {
                conditionGiftType.checked = true;
                conditionGiftType.conditionGifts.push(conditionGift);
                self.resetGiftModels(conditionGift.giftType);
              }
            })
            switch(conditionGift.giftType) {
              case self.ConditionGiftType.GIFTTYPE_COUPON:
                conditionGift.giftModel = CouponService.doGetCouponModel(conditionGift.giftModel);
                break;
            }
          });
        }
        //还原组合模型
        self.resetCombination();
      },
      methods: {
        onCouponSelected(selectedCoupons) { //接收添加优惠券组件传过来的list
          console.log("ConditionGifts/index.vue->onCouponSelected....");
          console.log(selectedCoupons);
          var self = this;
          if(selectedCoupons) {
            selectedCoupons.forEach(function (coupon) {
              var isHas = false;
              self.conditionGiftTypes.forEach(function (conditionGiftType) {
                conditionGiftType.conditionGifts.forEach(function (conditionGift) {
                  if (coupon.id == conditionGift.giftParam) {
                    //update conditionGift
                    conditionGift.count = coupon.count;
                    conditionGift.combination = coupon.combination;
                    conditionGift.combinationName = coupon.combinationName;
                    conditionGift.combinationTotalCount = coupon.combinationTotalCount;
                    conditionGift.combinationCount = coupon.combinationCount;
                    conditionGift.giftModel = coupon;
                    isHas = true;
                  }
                });
              });

              if(!isHas) {
                self.addToConditionGiftType({giftType:self.ConditionGiftType.GIFTTYPE_COUPON, count:coupon.count, giftParam:coupon.id, combination:coupon.combination, combinationName:coupon.combinationName, combinationTotalCount:coupon.combinationTotalCount, combinationCount:coupon.combinationCount, giftModel:coupon});
              }
            });

            self.conditionGiftTypes.forEach(function (conditionGiftType) {
              conditionGiftType.conditionGifts.forEach(function (conditionGift, index) {
                if(conditionGift.giftType == self.ConditionGiftType.GIFTTYPE_COUPON) {
                  var isHas = false;
                  selectedCoupons.forEach(function (coupon) {
                    if(conditionGift.giftParam == coupon.id) {
                      isHas = true;
                    }
                  });
                  if(!isHas){
                    conditionGiftType.conditionGifts.splice(index, 1);
                  }
                }
              });
            });

            self.onConditionGiftChange();
          }
        },
        resetCombination(){
          //还原组合模型
          this.conditionGiftTypes.forEach(function (conditionGiftType) {
            var combinationCounter = {};
            conditionGiftType.conditionGifts.forEach(function (conditionGift) {
              if(conditionGift.combination) {
                conditionGift.combinationName = conditionGift.combination.substr(0,1);
                conditionGift.combinationCount = conditionGift.combination.substr(2,1);
                conditionGift.combinationEnable = true;
                if(combinationCounter[conditionGift.combinationName]) {
                  combinationCounter[conditionGift.combinationName] = combinationCounter[conditionGift.combinationName] + 1;
                } else {
                  combinationCounter[conditionGift.combinationName] = 1;
                }
              }
            });

            conditionGiftType.conditionGifts.forEach(function (conditionGift) {
              conditionGift.combinationTotalCount = combinationCounter[conditionGift.combinationName];
            });

          });
        },
        //更新当前已选中组件对象
        resetGiftModels(conditionGiftTypeInt){
          console.log("resetGiftModels->conditionGiftType"+conditionGiftTypeInt);
          this.conditionGiftTypes.forEach(function (conditionGiftType) {
            console.log(conditionGiftType);
            if(conditionGiftType.value == conditionGiftTypeInt){
              var selectedCoupons = [];
              conditionGiftType.conditionGifts.forEach(function (conditionGift) {

                conditionGift.giftModel.count = conditionGift.count;
                conditionGift.giftModel.combination = conditionGift.combination;
                selectedCoupons.push(conditionGift.giftModel);

              });
              conditionGiftType.selectedCoupons = selectedCoupons;
            }
          });
        },
        //删除已选择的gift
        deleteSelectedConditionGift(conditionGift) {
          var self = this;
          this.conditionGiftTypes.forEach(function (conditionGiftType) {
            if(conditionGift.giftType == conditionGiftType.value) {
              for(var i=0;i<conditionGiftType.conditionGifts.length; i++) {
                if(conditionGift.giftParam == conditionGiftType.conditionGifts[i].giftParam) {
                  conditionGiftType.conditionGifts.splice(i, 1);
                }
              }
            }
          });
          //还原组合模型
          self.resetCombination();
          //通知父组件更新选中值
          self.onConditionGiftChange();
        },
        change:function(propName,newVal,oldVal){
          this[propName]=newVal;
        },
        addToConditionGiftType(conditionGift){
          this.conditionGiftTypes.forEach(function (conditionGiftType) {
            if(conditionGift.giftType == conditionGiftType.value) {
              conditionGiftType.conditionGifts.push(conditionGift);
            }
          })
        },
        onConditionGiftChange(){
          console.log("ConditionGifts/index.vue->onConditionGiftChange....");
          var selectedConditonGifts = [];
          this.conditionGiftTypes.forEach(function (conditionGiftType) {
            selectedConditonGifts = selectedConditonGifts.concat(conditionGiftType.conditionGifts);
          });

          this.$emit("onConditionGiftChange", this.index, selectedConditonGifts);
        },
        doConditionGiftTypeCheck(conditionGiftType){
          if(!conditionGiftType.checked) {
            conditionGiftType.conditionGifts = [];
            this.onConditionGiftChange();
          } else {
            this.toSelectCoupon();
          }
        },
        toSelectCoupon(){
          this.couponSelectShow = true;
          this.resetGiftModels(this.ConditionGiftType.GIFTTYPE_COUPON);
        }
      }
    }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .coupon-box {
    margin-left: 35px;
    max-width: 320px;
    background-color: #F8F8F8;
    border: 1px solid #D7D7D7;
  }
  .coupon-box + .coupon-box {
    margin-top: 10px;
  }
  .coupon-box .coupon {
    padding: 8px 0;
    margin: 0 20px 0 5px;
    vertical-align: middle;
  }
  .coupon-box .coupon + .coupon {
    border-top: 1px dashed #ccc;
  }
  .coupon>span, .coupon>.spec, .coupon>.name {
    vertical-align: middle;
  }
  .coupon>span {
    display: inline-block;
  }
  .spec {
    display: inline-block;
    padding: 2px 11px;
    font-size: 12px;
    color: #fff;
    background-color: #008000;
  }
  .name {
    display: inline-block;
    max-width: 80px;
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333;
  }
  .limit {
    color: #999;
  }
  .amount {
    margin-left: 10px;
    color: #333;
  }
  .del {
    margin-left: 10px;
    color: #aaa;
    cursor: pointer;
  }
</style>
