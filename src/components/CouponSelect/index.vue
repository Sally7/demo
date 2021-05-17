<template>
  <div class="coupon">
      <el-dialog title="选择优惠券"  width="1200px" :visible.sync="p_couponSelectShow" :before-close="handleClose">
        <el-table ref="couponTable" :data="couponList" :header-row-style="tableHeaderClass" :empty-text="loadingText" :row-key="getRowKeys"  @select="handleSelectionSelect" @select-all="handleAllSelectionSelect">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column property="couponName" label="名称" width="150"></el-table-column>
          <el-table-column property="couponStyle" label="价值" width="100"></el-table-column>
          <el-table-column property="couponCondition" label="使用条件" width="150"></el-table-column>
          <el-table-column label="赠送方式" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.giveType">
                <el-radio :label=1>自动</el-radio>
                <el-radio :label=2>手动</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="组合规则">
            <template slot-scope="scope">
              <el-checkbox v-model="couponList[scope.$index].combinationEnable" @change="handleCombinationSelect(couponList[scope.$index])">{{couponList[scope.$index].combinationEnable?'':'添加组合'}}
                <el-input v-if="couponList[scope.$index].combinationEnable" v-model="couponList[scope.$index].combination" @blur="inputCombinationRule(couponList[scope.$index].combination)" :autofocus="couponList[scope.$index].combinationEnable" size="small" placeholder="请输入内容" style="width:100px"></el-input>
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="100">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入数量" v-model="couponList[scope.$index].count" @focus="inputCount(couponList[scope.$index])"></el-input>
            </template>
          </el-table-column>

        </el-table>
        <el-row style="margin-top:20px">
          <el-col :span="4">
            <el-button type="primary" @click="ensureUse" :loading="disabled">确定使用</el-button>
          </el-col>
          <el-col :span="20">
            <el-pagination
              background
              layout="prev, pager, next"
              style="text-align: right"
              :total="totalCount"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              v-if="couponList.length>0">
            </el-pagination>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import CouponService from '@/api/CouponService'
  import propsync from '@/mixins/propsync'
  export default {
    name:"CouponSelect",
    mixins: [propsync],
    props: {
      couponSelectShow: {
        type: Boolean
      },
      selectedCoupons:{
        type: Array,
        propsync:false
      }
    },
    data() {
      return {
        couponList:[],
        selectedCouponList:[],
        loadingText:'正在加载,请稍后...',
        currentPage:1, //当前选中的页数
        averageCount:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        combination: false,
        tableHeaderClass: {background: '#f0f0f0'},
        disabled:false
      }
    },
    created() {
      this.doPageAdmin();
    },
    watch: {
      selectedCoupons(val) {
        var self = this;

        if(val) {
          //比较找出减少和添加的 减少的进行复位  增加的进行更新
          var cloneCoupons = [];
          self.selectedCouponList  = [];

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
              tempCoupon.giveType = 2;
              this.couponList.push(tempCoupon);
            }

            this.doRecoverSelected();
        }else {
          this.loadingText ="暂无数据";
        }
      },
      doRecoverSelected() {
        //分页数据获取后，自动还原选中项目
        var self = this;
        self.couponList.forEach(function (coupon) {
          self.selectedCouponList.forEach(function (scoupon) {
            if(coupon.id == scoupon.id) {
              coupon.combinationEnable = scoupon.combinationEnable;
              coupon.combination =scoupon.combination;
              coupon.count = scoupon.count;
              self.$refs.couponTable.toggleRowSelection(coupon, true);

              self.removeFromSelectedCouponList(scoupon);
              self.addToSelectedCouponList(coupon);
            }
          });
        });
      },
      getRowKeys(row) { //搭配reserve-selection使用
        return row.id;
      },
      addToSelectedCouponList(addCoupon) {
        var isHas = false;
        this.selectedCouponList.forEach(function (coupon) {
          if(addCoupon.id == coupon.id) {
            isHas = true;
          }
        })
        if(!isHas) {
          this.selectedCouponList.push(addCoupon);
        }
      },
      isSelected(coupon) {
        var isHas = false;
        this.selectedCouponList.forEach(function (scoupon) {
          if(scoupon.id == coupon.id) {
            isHas = true;
          }
        })
        return isHas;
      },
      removeFromSelectedCouponList(removeCoupon) {
        console.log({selectedCouponList:this.selectedCouponList});
        for(var  i=0; i<this.selectedCouponList.length; i++) {
          if(this.selectedCouponList[i].id == removeCoupon.id) {
            console.log("CouponSelect/index.vue->removeFromSelectedCouponList......."+removeCoupon.couponName);
            this.selectedCouponList.splice(i, 1);
            break;
          }
        }
      },
      handleSelectionSelect(selection, row){//当用户手动勾选数据行的 Checkbox 时触发的事件
        console.log("handleSelectionSelect....");
        console.log({selection:selection, row:row});

        if(this.isSelected(row)) {
          this.removeFromSelectedCouponList(row);
          row.combinationEnable = false;
        } else {
          this.addToSelectedCouponList(row);
        }
      },
      handleAllSelectionSelect(selection){//当用户手动勾选全选 Checkbox 时触发的事件
        console.log("handleAllSelectionSelect....");
        console.log({selection:selection});

        //全不选
        if(selection.length == 0) {
          this.couponList.forEach(function (removeSelectCoupon) {
            this.removeFromSelectedCouponList(removeSelectCoupon);
            removeSelectCoupon.combinationEnable = false;
          })
        } else {//全选
          this.selection.forEach(function (addCoupon) {
            this.addToSelectedCouponList(addCoupon);
          });
        }
      },
      handleCombinationSelect(row){ //勾选组合规则
        if (row.combinationEnable){
          this.$refs.couponTable.toggleRowSelection(row, true);
        } else {
          row.combination = "";
          row.combinationName = "";
          row.combinationCount = 0;
          row.combinationTotalCount = 0;
        }
      },
      inputCount(row){ //输入数量
        this.$refs.couponTable.toggleRowSelection(row,true);
      },
      inputCombinationRule(combinationRule){
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageAdmin();
      },
      handleClose() {
          this.p_couponSelectShow = false;
      },
      ensureUse(){
          if (this.validateSelectedCouponList() !== false){//验证通过
            this.disabled = true;
            this.$emit("onCouponSelected",this.selectedCouponList);//发送副本给父组件
            this.handleClose();
            this.disabled = false;
          }
      },
      //验证选择的优惠券列表
      validateSelectedCouponList(){
        var self = this;
        //验证选择的数组是不是为空
        if (this.selectedCouponList.length<1){

          return true;
        }
        var numberReg= /^\+?[1-9][0-9]*$/;//正整数验证
        var characterReg= /^[A-Z]+$/;//字母验证

        var combinationCounter = {};

        for (var i=0;i<this.selectedCouponList.length;i++){
          var couponItem = this.selectedCouponList[i];
          //验证数量框内为数字
          if (!numberReg.test(couponItem.count)){
            self.$message.error('第'+(i+1)+'个数量类型不正确!');
            return false;
          }
          //验证组合规则是不是字母-数字
          if (couponItem.combinationEnable) {
            if(couponItem.combination.length !=3){
              self.$message.error('第'+(i+1)+'个组合规则格式不正确!');
              return false;
            } else {
              var character = couponItem.combination.substr(0,1);
              var symbol = couponItem.combination.substr(1,1);
              var number = couponItem.combination.substr(2,1);
              if (!characterReg.test(character) || symbol!=="-" ||!numberReg.test(number)){
                console.log('第'+(i+1)+'个组合规则格式不正确!');
                self.$message.error('第'+(i+1)+'个组合规则格式不正确!');
                return false;
              }
              //设置组别
              couponItem.combinationName = character;
              couponItem.combinationCount = number;
              if(combinationCounter[character]) {
                combinationCounter[character] = combinationCounter[character] + 1;
              } else {
                combinationCounter[character] = 1;
              }
            }
          }
        }
        //计算组合总数
        this.selectedCouponList.forEach(function (selectedCoupon) {
          if (selectedCoupon.combinationEnable) {
            selectedCoupon.combinationTotalCount = combinationCounter[selectedCoupon.combination.substr(0,1)];
          }
        });

      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
