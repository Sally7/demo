<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <el-form :model="marketingScene" :rules="rules" ref="marketingScene" label-width="100px" class="form-content">
          <el-row>
            <el-col :span="10">
              <el-form-item label="政策主题" prop="title">
                <el-input v-model="marketingScene.title" placeholder="请填写政策主题"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false">
            <el-col>
              <el-form-item label="政策标签">
                <el-tag
                    :key="tag.conditionDesc"
                    v-for="tag in marketingScene.conditions"
                    closable
                    :disable-transitions="false"
                    @close="handleTagClose(tag)">
                  {{tag.conditionDesc}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 创建课程</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="display: flex">
              <el-form-item label="有效时间" prop="startDate">
                <!--<el-radio v-model="marketingScene.dateType" :label=1 @change="onDateTypeChange(1)">-->
                <el-date-picker
                    v-model="marketingScene.startDate"
                    type="datetime"
                    :editable=false
                    @focus="tapDatePicker"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择培训开始时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至" style="margin-left: -60px"></el-form-item>
              <el-form-item style="margin-left: -95px" prop="endDate">
              <el-date-picker
                  v-model="marketingScene.endDate"
                  type="datetime"
                  :editable=false
                  @focus="tapDatePicker"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择培训结束时间">
              </el-date-picker>
              <!--</el-radio>-->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="简述" prop="description">
                <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入简述"
                    v-model="marketingScene.description">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="doCancel">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('marketingScene')" :loading="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb';
  import MarketingSceneService from '@/api/MarketingSceneService';
  import AreaService from '@/api/AreaService';
  import ConditionGifts from '@/components/ConditionGifts/index';
  import DynamicForm from '@/components/DynamicForm/index';
  import TimeUtils from '@/utils/TimeUtil';
  import ConfigUtil from '@/utils/ConfigUtil';
  import CouponSimpleSelect from '@/components/CouponSelect/simpleSelect';
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue';

  export default {
    data() {
      var validateDate = (rule, value, callback) => { //自定义有效时间的验证
        if (value === 1) {
          var startTime = this.dateToMs(this.marketingScene.startDate);
          var endTime = this.dateToMs(this.marketingScene.endDate);
          if (!startTime) {
            callback(new Error('请选择开始时间'));
          }
          if (!endTime) {
            callback(new Error('请选择结束时间'));
          }
          if (startTime > endTime) {
            callback(new Error('开始时间不能比结束时间大'));
          }
          callback();
        } else {
          callback();
        }
      };
      return {
        prizeIndex: null,
        modelId: this.$route.query.id,
        uploadUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',
        MarketingSceneType: MarketingSceneService.marketingSceneType,
        marketingSceneTypes: MarketingSceneService.getMarketingSceneTypes(),
        conditionTypes: [],
        isPerfectInfo: false,
        isUpdate: false,
        areaOptions: [],
        areaSelectedOptions: [],
        marketingScene: {
          marketingSceneType: 1002,
          giftType: 1,
          activeStatus: 0,
          startDate: 0,
          endDate: 0,
          dateType: 1,
          conditionTypes: [],
          conditions: [],
          imageUrl: '',
          areaId: '',
        },
        inputVisible: false,
        inputValue: '',
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          title: [
            {required: true, message: '请输入场景名称', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字', trigger: 'blur'},
          ],
          startDate: [
            {required: true, message: '请输入培训的开始时间', trigger: 'blur'},
          ],
          endDate: [
            {required: true, message: '请输入培训的结束时间', trigger: 'blur'},
          ],
          dateType: [
            {required: true, validator: validateDate, trigger: 'blur'},
          ],
          description: [{max: 500, message: '长度在500字以内'}],
          giftType: [{required: true, message: '请选择增送方式', trigger: 'change'}],
          activeStatus: [{required: true, message: '请选择激活设置', trigger: 'change'}],
        },
        disabled: false,
        dynamicTags: [],
      };
    },
    components: {
      ElFormItem,
      Breadcrumb,
      ConditionGifts,
      DynamicForm,
      CouponSimpleSelect,
    },
    async created() {
      //处理编辑逻辑
      if (this.$route.query.id) {
        this.isUpdate = true;
        this.marketingScene = await MarketingSceneService.doGet(this.$route.query.id);
        if (this.marketingScene.conditions && this.marketingScene.conditions.length > 0) {
          this.marketingScene.conditions.forEach(item => {
            this.dynamicTags.push(item.conditionDesc);
          });
        }

//        this.initConditions();
        if (this.marketingScene.activeStatus == 2) {
          this.isPerfectInfo = true;
        }
//        this.doGetArea(this.marketingScene.areaId);
        if (this.marketingScene.endDate == 9999999999999 && this.marketingScene.startDate == 0) {
          //永久时间修改为0，提交时在改回来，防止时间控件显示时间不正确
          this.marketingScene.endDate = 0;
          this.marketingScene.dateType = 0;
        } else {
          this.marketingScene.dateType = 1;
        }

      } else {// 创建逻辑
        this.marketingScene.marketingSceneType = parseInt(this.$route.query.marketingSceneType);
      }
    },
    methods: {
      async doGetArea(areaId) {
        var cityRes = await AreaService.doGetArea(areaId);
        if (cityRes.status != 1) {
          return;
        }
        var self = this;
        this.areaSelectedOptions.push(cityRes.data.id);
        cityRes.data.nodes.forEach(function(city) {
          self.areaSelectedOptions.push(city.id);
          city.nodes.forEach(function(area) {
            self.areaSelectedOptions.push(area.id);
          });
        });
      },
      async doSearchAllTreeJson() {
        var cityRes = await AreaService.doSearchAllTreeJson();
        if (cityRes.status != 1) {
          return;
        }
        var self = this;
        cityRes.data = this.mapAllTreeJson(cityRes.data);
        cityRes.data.forEach(function(province) {
          province.children = self.mapAllTreeJson(province.children);
          province.children.forEach(function(city) {
            city.children = self.mapAllTreeJson(city.children);
            city.children.forEach(function(area) {
              area.children = null;
            });
          });
        });
        this.areaOptions = cityRes.data;
      },
      mapAllTreeJson(cityList) {
        cityList = cityList.map(function(item) {
          return {
            value: item.id,
            label: item.name,
            children: item.nodes,
          };
        });
        return cityList;
      },
      tapDatePicker() { //将时间进行一个适配组件的转化
        this.onDateTypeChange(1);
        //由于使用的时间选择控件，使用的数据模型为中国标准时间，所以需要将查询到时间戳用timeUtils先转成标准时间，再通过new Date()转成中国标准时间
        this.marketingScene.startDate = this.msToDate(this.marketingScene.startDate);
        this.marketingScene.endDate = this.msToDate(this.marketingScene.endDate);
      },
      onDateTypeChange(value) { //切换Radio的选项
        this.marketingScene.dateType = value;
        if (value == 1) {
          if (this.marketingScene.startDate == 0) {
            this.marketingScene.startDate = new Date().getTime();
          }
          if (this.marketingScene.endDate == 0) {
            this.marketingScene.endDate = new Date().getTime();
          }
        } else {
          this.marketingScene.startDate = 0;
          this.marketingScene.endDate = 0;
        }
      },
      handleAvatarSuccess(res, file) { //图片上传成功的回调
        console.log(res);
//        this.marketingScene.headRelURL = res.absolute;
        this.marketingScene.imageUrl = res.absolute;
        console.log(this.marketingScene.imageUrl);
      },
      handlePrizeImgSuccess(res, file) {
        console.log(this.prizeIndex);
        for (var index in this.marketingScene.conditions) {
          if (index == this.prizeIndex) {
            this.marketingScene.conditions[index].imageUrl = res.absolute;
            break;
          }
        }
      },
      beforeAvatarUpload(file) { //上传图片之前的限制
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG或者PNG 格式!');
          return false;
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return false;
        }
        if (isJPG) {
          return isJPG && isLt5M;
        } else if (isPNG) {
          return isPNG && isLt5M;
        }
      },
      doCancel() {
        this.$router.back();
      },
      doAU(formName) {
        var self = this;
        this.disabled = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.disabled = false;
            return false;
          }

          self.doMarketingSceneAU();
          //验证动态表单
//          this.$refs.dynamicform.checkForm(function(valid) {
//            if (!valid) {
//              self.disabled = false;
//              return false;
//            }
//            self.isPerfectInfo = self.marketingScene.activeStatus != 0;
//            self.marketingScene.activeStatus = self.isPerfectInfo ? 2 : (self.marketingScene.activeStatus == 2 ? 1 : self.marketingScene.activeStatus);
//            self.marketingScene.startDate = self.dateToMs(self.marketingScene.startDate);
//            self.marketingScene.endDate = self.dateToMs(self.marketingScene.endDate);
//            self.marketingScene.areaId = self.areaSelectedOptions[self.areaSelectedOptions.length - 1];
//            self.marketingScene.endDate = self.marketingScene.endDate == 0 ? 9999999999999 : self.marketingScene.endDate;
//            self.doMarketingSceneAU();
//          });
        });
      },
      /**
       * 执行创建、修改培训操作
       * @return {Promise<void>}
       */
      async doMarketingSceneAU() {
        this.marketingScene.startDate = new Date(this.marketingScene.startDate).getTime();
        this.marketingScene.endDate = new Date(this.marketingScene.endDate).getTime();

//        this.dynamicTags.forEach(tagName => {
//          this.marketingScene.conditions.push({id:'',conditionDesc:tagName,conditionType:4006})
//        });

        var response = await MarketingSceneService.doAU(this.marketingScene);
        if (response.status === 1) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          });
//          this.$refs.dynamicform.doAUDynamicFormItemValueRelations(response.data.id);
          this.$router.back();
          this.disabled = false;
        } else {
          this.$message.error(response.data);
          this.disabled = false;
        }
      },
      msToDate(date) { //毫秒转中国标准时间,适配时间控件
        var getType = Object.prototype.toString;
        if (getType.call(date) !== '[object Date]') {
          return new Date(TimeUtils.formatTime(date, 'Y-M-D H:m:s'));
        } else {
          return date;
        }
      },
      dateToMs(date) { //因为日历控件会将date转成中国标准时间，所以需要转回到毫秒时间戳
        var getType = Object.prototype.toString;
        if (getType.call(date) === '[object Date]') { //该方法可以判断数据的类型
          return new Date(date).getTime();
        } else {
          return date;
        }
      },
      resetForm(formName) { //重置验证
        this.$refs[formName].resetFields();
      },
      initConditions() {
        var self = this;
        var templateCoditions = [];
        switch (this.marketingScene.marketingSceneType) {
          case this.MarketingSceneType.MARKETINGSCENETYPE_INVITE:
            templateCoditions = [
              {conditionDesc: '被邀请', conditionModelType: this.marketingScene.marketingSceneType, conditionType: 6004, targetValue: true, conditionGifts: [], valueType: ''},
              {conditionDesc: '邀请成功', conditionModelType: this.marketingScene.marketingSceneType, conditionType: 6000, targetValue: true, conditionGifts: [], valueType: ''},
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_SCANQRCODE:
            templateCoditions = [
              {conditionDesc: '扫场景码', conditionModelType: this.marketingScene.marketingSceneType, conditionType: 8000, targetValue: true, conditionGifts: [], valueType: ''},
            ];
            break;
          case  this.MarketingSceneType.MARKETINGSCENETYPE_REIMBURSEMENT:
            templateCoditions = [
              {conditionDesc: '每消费金额达', conditionModelType: this.marketingScene.marketingSceneType, conditionType: 11000, targetValue: '', conditionGifts: [], valueType: 'int'},
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_USECOUPON:
            templateCoditions = [
              {conditionDesc: '核销成功', conditionModelType: this.marketingScene.marketingSceneType, conditionType: 6005, targetValue: '', conditionGifts: [], valueType: 'coupon'},
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_lUCKDRAW:
            templateCoditions = [
              {conditionDesc: '抽奖送', conditionModelType: this.marketingScene.marketingSceneType, conditionType: 6008, deleteStatus: 0, targetValue: '', conditionGifts: [], valueType: ''},
            ];
            break;
        }
        if (this.marketingScene.conditions.length > 0 && this.marketingScene.id) {
          templateCoditions.forEach(function(tcondition) {
            var isHas = false;
            self.marketingScene.conditions.forEach(function(condition) {
              if (tcondition.conditionType == condition.conditionType) {
                isHas = true;
              }
            });
            if (!isHas) {
              self.marketingScene.conditions.push(tcondition);
            }
          });
        } else {
          this.marketingScene.conditions = templateCoditions;
        }
      },
      initConditionTypes() {
        switch (this.marketingScene.marketingSceneType) {
          case this.MarketingSceneType.MARKETINGSCENETYPE_INVITE:
            //邀请成功数达  邀请成功消费金额达   邀请成功使用券  邀请成功使用红包
            this.conditionTypes = [
              {text: '邀请成功数达', value: 6001, show: true, valueType: 'int'},
              {text: '邀请成功消费金额达', value: 6002, show: false, valueType: 'double'},
              {text: '邀请成功使用券', value: 6005, show: false, valueType: 'coupon'},
              {text: '邀请成功使用红包', value: 6006, show: false, valueType: 'hongbao'},
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_USECOUPON:
            this.conditionTypes = [
              {text: '核销送', value: 6005, show: true, valueType: 'coupon'},
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_lUCKDRAW:
            this.conditionTypes = [
              {text: '抽奖送', value: 6008, show: true, valueType: ''},
            ];
            break;
        }
      },
      //Condition优惠选择回调
//      onConditionGiftChange(index, conditionGifts) {
//        this.marketingScene.conditions[index].conditionGifts = conditionGifts;
//      },
      //处理新增一级优惠回调
//      handleAddConditionTypesCommand(conditionType) {
//        var self = this;
//        this.conditionTypes.forEach(function(item) {
//          if (item.value == conditionType) {
//            self.marketingScene.conditions.push({conditionDesc: item.text, conditionModelType: self.marketingScene.marketingSceneType, conditionType: item.value, targetValue: '', conditionGifts: [], valueType: item.valueType});
//          }
//        });
//      },
//      onConditionTargetValueSet(index, targetValue) {
//        console.log({index: index, targetValue: targetValue});
//        this.marketingScene.conditions[index].targetValue = targetValue;
//      },
      handleTagClose(tag) {
        this.marketingScene.conditions.splice(this.marketingScene.conditions.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.marketingScene.conditions.push({id: '', conditionDesc: inputValue, conditionType: 4006});
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .form-title {
    padding: 15px 0;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
  }

  .form-content {
    padding-left: 20px;
  }

  .counts-wrap {
    padding: 0 10px;
    text-align: right;
    color: #333;
    font-size: 14px;
  }

  .pagination {
    text-align: right;
  }

  .avatar-uploader {
    line-height: 14px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }

  .avatar {
    width: 140px;
    height: 48px;
    display: block;
  }

  .el-upload__tip {
    line-height: 13px;
  }

  .footer {
    width: 1040px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -435px;
    padding: 10px 0;
    text-align: center;
    z-index: 99;
    background-color: #ffffcc;
  }

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

  .coupon > span, .coupon > .spec, .coupon > .name {
    vertical-align: middle;
  }

  .coupon > span {
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

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
