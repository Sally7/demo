<template>
  <div class="dynamicform">
    <div v-for="(item,index) in dynamicform.items" :key="item.id">
      <!--普通单选-->
      <div class="deco-control-group decorate-coupon-editor__source" v-if="item.itemType==22">
        <div class="deco-control-group-container">
          <div class="deco-control-group__header deco-control-group__header--center">
            <div class="deco-control-group__label">
              <i class="el-icon-star-on zenticon-star"></i>{{item.label}}
            </div>
          </div>
          <div class="deco-control-group__content">
            <el-radio-group v-model="item[item.dfkey]">
              <el-radio v-for="option in item.valueList" :key="option.id" :label="option.id">{{option.label}}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>

      <div class="deco-control-group deco-control-group--error has-error deco-control-group--bg-colored"
           style="display:none;">
        <el-button type="primary" icon="el-icon-plus" plain>添加优惠券</el-button>
        <div class="deco-help-desc deco-control-group__error deco-help-desc--error">请选择优惠券</div>
      </div>


      <!--Goods数据源-->
      <div class="deco-control-group deco-control-group--error has-error deco-control-group--bg-colored"
           v-if="item.itemType==23">
        <div style="width:100%; margin-bottom: -10px ">
          <el-row>
            <div v-for="(goods,i) in dynamicFormMultipleSelection">
              <el-col :span="4">
                <div class="showImage" @mousemove="move(goods.id)" @mouseleave="moveOut(goods.id)">
                  <i class="zent-icon el-icon-circle-close" :id="goods.id" @click="deselect(i)"></i>
                  <div class="img-size">
                    <img
                      :src="goods.showUrl"
                      style="width: 100%;height: 100%" alt="商品图" draggable="false">
                  </div>
                </div>
              </el-col>
            </div>
            <el-col :span="4">
              <el-upload
                action=""
                class="avatar-uploader"
                :disabled="true">
                <div @click="centerDialogVisible=true">
                  <img v-if="item[item.dfkey]" :src="item[item.dfkey]" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </el-col>

          </el-row>
        </div>
        <!--<div class="deco-control-group-container deco-control-group-container&#45;&#45;block">

        </div>-->
        <div class="deco-help-desc deco-control-group__error deco-help-desc&#45;&#45;error"
             v-if="!centerDialogVisible">
          请添加商品
        </div>

        <el-dialog
          :visible.sync="centerDialogVisible"
          title="已上架商品">
          <GoodsSelect @dynamicFormFucn="dialogShow" :dynamicFormData="dynamicFormMultipleSelection"></GoodsSelect>
        </el-dialog>
      </div>


      <div class="deco-control-group decorate-coupon-editor__coupon-num deco-control-group--bg-colored" v-if="false">
        <div class="deco-control-group-container deco-control-group-container--block">
          <div class="deco-control-group__header">
            <div class="deco-control-group__label">
              券活动数
            </div>
          </div>
          <div class="deco-control-group__content">
            <div class="deco-control-group deco-control-group--error has-error">
              <div class="deco-control-group-container deco-control-group-container--block">
                <div class="deco-control-group__content">
                  <template>
                    <el-radio v-model="coupon_num" label="1">全部</el-radio>
                    <el-radio v-model="coupon_num" label="2">
                      <el-input placeholder="请输入显示的券活动数" v-model="input" clearable class="input"></el-input>
                    </el-radio>
                  </template>
                </div>
              </div>
              <div class="deco-help-desc deco-control-group__error deco-help-desc--error">
                请填写10以内的数字
              </div>
            </div>

          </div>
        </div>
      </div>

      <!--带框单选-->
      <div class="deco-control-group" v-if="item.itemType==25">
        <div class="deco-control-group-container "
             :class="[item.valueList.length>4?'deco-control-group-container--block':'']">
          <div class="deco-control-group__header">
            <div class="deco-control-group__label">
              {{item.label}}
            </div>
            <div class="deco-control-group__value" v-if="false">
              大图模式
            </div>
          </div>
          <div class="deco-control-group__content">
            <el-radio-group v-model="item[item.dfkey]" size="mini"
                            class="deco-radio-button-group deco-radio-button-group--block ">
              <el-radio-button v-for="option in item.valueList" :key="option.id" :label="option.id">{{option.label}}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!--Silder-->
      <div class="deco-control-group" v-if="item.itemType==21">
        <div class="deco-control-group-container">
          <div class="deco-control-group__header deco-control-group__header--center">
            <div class="deco-control-group__label">
              {{item.label}}
            </div>
          </div>
          <div class="deco-control-group__content">
            <el-slider v-model="item.valueList[0].value" :min="parseInt(item.valueList[0].value)"
                       :max="parseInt(item.valueList[1].value)" show-input>
            </el-slider>
          </div>
        </div>
      </div>

      <!--颜色单选-->
      <div class="deco-control-group" v-if="item.itemType==27">
        <div class="deco-control-group-container">
          <div class="deco-control-group__header deco-control-group__header--center">
            <div class="deco-control-group__label"> {{item.label}}</div>
            <div class="deco-control-group__value"></div>
          </div>
          <div class="deco-control-group__content">
            <div class="deco-radio-button-group deco-radio-button-group--round">
              <div class="deco-radio-button deco-radio-button--active">
                <button type="button" v-for="option in item.valueList" :key="option.id"
                        @click="doSelect(item, option)"
                        class="zent-btn-primary-outline zent-btn">
                  <div class="coupon-color" :style="{'background-color': option.value}"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="deco-control-group" v-if="item.itemType==4">
        <div class="deco-control-group-container">
          <div class="deco-control-group__header deco-control-group__header--center">
            <div class="deco-control-group__label">{{item.label}}</div>
            <div class="deco-control-group__value">
              <p><span class="common-goods-layout__buy-button-tips">{{item.tips}}</span>
              </p>
            </div>
          </div>
          <div class="deco-control-group__content">
            <el-switch
              v-model="item[item.dfkey]">
            </el-switch>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import cacheCookies from '@/utils/auth'
  import DynamicFormService from '@/api/DynamicFormService'
  import GoodsSelect from '@/components/GoodsSelect'

  export default {
    name: "DynamicForm",
    props: {
      moduleId: {
        type: String
      },
      modelId: {
        type: String
      }
    },
    components: {
      GoodsSelect
    },
    data() {
      return {
        uploadServiceUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',
        selectedDfkey: '', //主要用于多张图片点击的区分
        dynamicform: {items: []}, //需要注意，v-for绑定的数组必须绑定在form对象里
        rules: {},
        centerDialogVisible: false,
        dynamicFormMultipleSelection: [],
        iconShow: false,
        defaultPage: this.doGetTilesDetailsById(),

      }
    },
    created() {
      /*  this.defaultPage = this.doGetTilesDetailsById();*/
      this.doSearchDynamicformItems();
      console.log(this.dynamicform);
    },
    methods: {
      move(data) {
        var ioc = document.getElementById(data);
        ioc.style.display = "block";
      },
      moveOut(data) {
        var ioc = document.getElementById(data);
        ioc.style.display = "none";
      },
      deselect(data) {
        console.log(data)
        this.dynamicFormMultipleSelection.splice(data, 1);
      },
      /*closeDialog() {
        console.log('clear------------')
        this.$refs.goodsSelect.clearMultipleSelection();
        console.log('clear+++++++')
      },*/
      dialogShow(data) {
        this.centerDialogVisible = false;
        this.dynamicFormMultipleSelection = data;
      },
      /* handleAvatarSuccess(res) { //图片上传成功的回调
         for (var index in this.dynamicform.items) {
           var item = this.dynamicform.items[index];
           if (item.dfkey == this.selectedDfkey) {
             item[item.dfkey] = res.absolute;
             break;
           }
         }
       },*/
      isInteger(rule, value, callback) { //数字验证规则
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(value)) {
          if (rule.min) {
            if (value < rule.min) {
              callback("请输入大于" + rule.min + "的数字");
            }
          }
          if (rule.max) {
            if (value > rule.max) {
              callback("请输入小于" + rule.max + "的数字");
            }
          }
          callback();
        }
        callback('请输入' + rule.min + '到' + rule.max + '的数字');
      },
      async doSearchDynamicformItems() {
        var self = this;
        this.dynamicform.items = await DynamicFormService.doSearchDynamicformItems(this.moduleId, this.modelId, true);
        this.dynamicform.items.forEach(function (item) {
          if (item.isMust != 1) {
            return;
          }
          self.rules[item.dfkey] = [{required: true, message: item.tips, trigger: 'blur,change'}];
          switch (item.itemType) {
            case 14:
              self.rules[item.dfkey].push({validator: self.isInteger, message: '请输入数字', trigger: 'blur'});
              break;
            case 16:
              self.rules[item.dfkey].push({validator: self.isInteger, min: 1, max: 100, trigger: 'blur'});
              break;
          }
        });
      },
      searchFor(value, searchStr) {
        var result = [];  //用result来存放查到的结果
        if (!searchStr) {
          return value;
        }
        /*searchStr = searchStr.trim().toLowerCase();*/   //把查询的内容转为小写的

        result = value.filter(function (item) {        //这里value是个数组,他也有filter方法的.item是value里面的。
          if (item.dfkey.indexOf(searchStr) != -1) {   //如果搜索的内容在title标题里面有的话就返回那个项目
            return item;
          }
        });
        return result;
      },
      async doGetTilesDetailsById() {
        /*  var res = await  DynamicFormService.doGetTilesDetailsById();
          this.defaultPage = res.itemLists;*/
      },
      async checkForm(callback) {
        this.$refs["dynamicform"].validate((valid) => {
          callback(valid);
        });
      },
      async doAUDynamicFormItemValueRelations(modelId) {
          if (!this.dynamicform.items || !this.dynamicform.items.length) {
            return true;
          }

          console.log('动态表单验证成功！！！！！！！！');
          console.log(this.dynamicform)
          var self = this;
          var submitForm = {dynamicFormItemValueRelations: []};
          this.dynamicform.items.forEach(function (item) {
            if (item[item.dfkey] && item[item.dfkey] != 'undefined' && item[item.dfkey] != ''||self.dynamicFormMultipleSelection.length>0) {
              switch (item.itemType) {
                case 13:
                  break;
                case 22:
                case 25:
                  console.log(item);
                  item.valueRelations = [];
                  for (var i = 0; i < item.valueList.length; i++) {
                    console.log(item.valueList[i].id+","+item[item.dfkey]);

                    if(item.valueList[i].id === item[item.dfkey]) {

                      console.log(item[item.dfkey]);

                      var valueRelation = {
                        formItemId: item.id,
                        newValueId: item.valueList[i].id,
                        value:item.valueList[i].value,
                        dfkey: item.dfkey,
                        moduleId: self.moduleId,
                        modelId: modelId
                      };
                      item.valueRelations.push(valueRelation);
                    }
                  }
                  submitForm.dynamicFormItemValueRelations = submitForm.dynamicFormItemValueRelations.concat(item.valueRelations);
                  console.log(submitForm);
                  break;
                case 23:
                  item.valueRelations = [];
                  console.log("+++++++++++++++")
                  for (var i = 0; i < self.dynamicFormMultipleSelection.length; i++) {
                    console.log(self.dynamicFormMultipleSelection)
                      var valueRelation = {
                        formItemId: item.id,
                        value: self.dynamicFormMultipleSelection[i].id,
                        dfkey: item.dfkey,
                        imgUrl:self.dynamicFormMultipleSelection[i].showUrl,
                        moduleId: self.moduleId,
                        modelId: modelId
                      };
                      item.valueRelations.push(valueRelation);
                  }
                  submitForm.dynamicFormItemValueRelations = submitForm.dynamicFormItemValueRelations.concat(item.valueRelations);
                  break;
                default:

              }
            }
          });
          //提交表单获得结果
          DynamicFormService.doAUDynamicFormItemValueRelations(submitForm);

      },
      async doAUTeTiles() {
        var res = await DynamicFormService.doAUTeTiles({
          tiles: {
            id: "",
            name: "",
            itemLists: [
              {
                title:"",
                moduleId:"",
                dynamicForm: {
                  dynamicFormItemValueRelations: [
                    {
                      formItemId: "",
                      value: "",
                      dfkey: "",
                      moduleId: ""
                    },
                    {
                      formItemId: "",
                      value: "",
                      dfkey: "",
                      moduleId: ""
                    }
                  ]
                }
              }
            ]
          }
        });
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css">
  .zent-icon {
    position: absolute;
    right: -5px;
    top: -5px;
    z-index: 999;
    background-color: #F7F8FA;
    border-radius: 50%;
    padding: 1.5px;
    display: none;
    cursor: pointer;
  }

  .showImage {
    width: 50px;
    position: relative;
    margin-bottom: 10px;
  }

  .img-size {
    width: 49px;
    height: 49px;
  }

  .avatar-uploader {
    background-color: #ffffff;
    border-radius: 5px;
    width: 50px;
    margin-bottom: 10px;
  }

</style>
