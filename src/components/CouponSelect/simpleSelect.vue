<template>
  <el-select v-model="selectedCouponId" size="mini" filterable placeholder="请选择">
    <el-option
      v-for="item in couponList"
      :key="item.id"
      :label="item.couponName"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import CouponService from '@/api/CouponService'
  import propsync from '@/mixins/propsync'
  export default {
    name:"CouponSimpleSelect",
    mixins: [propsync],
    props: {
      index:Number,
      selectedId:String
    },
    data() {
      return {
        couponList:[],
        selectedCouponId:"",
        currentPage:1, //当前选中的页数
        averageCount:100,//每页放多少条数据
        totalCount:0//总的数据页数
      }
    },
    created() {
      this.selectedCouponId = this.selectedId;
      this.doPageAdmin();
    },
    watch: {
      selectedCouponId(val) {
        console.log("CouponSelect/index.vue->watch->selectedCoupon......."+val);
        if(val) {
          console.log(this.selectedCouponId);
          this.$emit("onConditionTargetValueSet", this.index, this.selectedCouponId);//发送副本给父组件
        }

      }
    },
    methods: {
      //获取所有获取商户的赠送券的接口
      async doPageAdmin(){
        var response = await CouponService.doPageAdmin({
          groupId: cacheCookies.getGroupId(),
          status: 0,
          userType: 'groupUser',
          couponType: '',
          page:this.currentPage,
          count:this.averageCount
        });
        this.couponList = [];
        this.totalCount = response.total;
        if(response.status === 1 && response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              var tempCoupon = await CouponService.doGetCouponModel(response.data[i]);
              tempCoupon.combinationEnable = false;
              tempCoupon.combination ='';
              tempCoupon.count = 1;
              this.couponList.push(tempCoupon);
            }

            this.doRecoverSelected();
        } else {
          this.loadingText ="暂无数据";
        }
      },
      doRecoverSelected() {

      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
