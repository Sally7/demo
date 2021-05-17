<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <p class="form-title">场景信息</p>
        <el-form :model="marketingScene" :rules="rules" ref="marketingScene" label-width="100px" class="form-content">
          <el-row>
            <el-col :span="10">
              <el-form-item label="场景名称" prop = "title">
                <el-input v-model="marketingScene.title" placeholder="请填写场景名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="场景描述" prop = "description">
                <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入详细描述"
                        v-model="marketingScene.description">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="封面图片">
            <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
              <img v-if="marketingScene.imageUrl" :src="marketingScene.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过5M,建议尺寸:750*260px</div>
              <div slot="tip" class="el-upload__tip" v-show="marketingScene.imageUrl">点击图片可进行更换</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="有效时间">
            <el-row>
              <el-col>
                <el-radio v-model="marketingScene.dateType" :label=0 @change="onDateTypeChange(0)">永久</el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-radio v-model="marketingScene.dateType" :label=1 @change="onDateTypeChange(1)">
                  <el-date-picker
                          v-model="marketingScene.startDate"
                          type="datetime"
                          :editable=false
                          @focus="tapDatePicker"
                          format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始时间">
                  </el-date-picker>
                  <span>至</span>
                  <el-date-picker
                          v-model="marketingScene.endDate"
                          type="datetime"
                          :editable=false
                          @focus="tapDatePicker"
                          format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择结束时间">
                  </el-date-picker>
                </el-radio>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" style="margin-top:-12px" v-if="false">
            <el-row>
              <el-col style="margin-left:25px">
                <el-checkbox>按周期重复</el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="用户信息" prop="activeStatus">
            <el-radio-group v-model="marketingScene.activeStatus">
              <el-radio :label=0>无需获取</el-radio>
              <el-radio :label=1 v-if="marketingScene.activeStatus!=2">需要获取</el-radio>
              <el-radio :label=2 v-if="marketingScene.activeStatus==2">需要获取</el-radio>
            </el-radio-group>
            <template>
              <div style="line-height: 16px" v-if="marketingScene.activeStatus!==0">
                <el-checkbox :disabled="true" :checked="true">填写手机号必选</el-checkbox>
              </div>
              <div style="line-height: 16px" v-if="marketingScene.activeStatus!==0">
                <el-checkbox v-model="isPerfectInfo">填写完整会员资料</el-checkbox>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="地理位置">
            <el-cascader
                    placeholder="请选择区域"
                    clearable
                    change-on-select
                    :options="areaOptions"
                    v-model="areaSelectedOptions">
            </el-cascader>
          </el-form-item>
        </el-form>
        <DynamicForm :moduleId="'marketingscene'+marketingScene.marketingSceneType" :modelId="modelId" ref="dynamicform"></DynamicForm>
        <p class="form-title">优惠设置</p>
        <el-table class="mb15"
                  :data="marketingScene.conditions"
                  :header-row-style="tableHeaderClass"
                  style="width: 100%">
          <el-table-column
                  type="index"
                  label="序号"
                  width="50">
          </el-table-column>
          <el-table-column
                  align="center"
                  label="优惠门槛"
                  width="400">
            <template slot-scope="scope">
              <p>{{ scope.row.conditionDesc }}：
                <el-input v-if="scope.row.valueType=='int'" size="mini" style="width:100px" v-model="marketingScene.conditions[scope.$index].targetValue" placeholder="请输入"></el-input>
                <CouponSimpleSelect v-if="scope.row.valueType=='coupon'" :index="scope.$index" :selectedId="marketingScene.conditions[scope.$index].targetValue" @onConditionTargetValueSet="onConditionTargetValueSet"></CouponSimpleSelect>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="优惠方式(可多选)">
            <template slot-scope="scope">
              <ConditionGifts :conditionGifts="marketingScene.conditions[scope.$index].conditionGifts" :index="scope.$index" @onConditionGiftChange="onConditionGiftChange"></ConditionGifts>
            </template>
          </el-table-column>
          <el-table-column label="奖品图片" align="center" width="400" show-overflow-tooltip v-if="marketingScene.marketingSceneType==1005">
            <template slot-scope="scope">
              <el-upload
                      class="avatar-uploader"
                      :action="uploadServiceUrl"
                      :show-file-list="false"
                      :on-success="handlePrizeImgSuccess">
                <div @click="prizeIndex=scope.$index">
                  <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" style="width: 50px;height: 50px">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
        <el-dropdown v-if="conditionTypes.length > 0" @command="handleAddConditionTypesCommand">
          <!-- <span class="el-dropdown-link">
            +新增一级优惠
          </span> -->
          <el-button type="primary">
            +新增一级优惠
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" v-for="conditionType in conditionTypes" :key="conditionType.value" :command="conditionType.value" v-if="conditionType.show">
              {{conditionType.text}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="doCancel">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('marketingScene')" :loading="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import MarketingSceneService from '@/api/MarketingSceneService'
  import AreaService from '@/api/AreaService'
  import ConditionGifts from '@/components/ConditionGifts/index'
  import DynamicForm from '@/components/DynamicForm/index'
  import TimeUtils from '@/utils/TimeUtil'
  import ConfigUtil from '@/utils/ConfigUtil'
  import CouponSimpleSelect from '@/components/CouponSelect/simpleSelect'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    data() {
      var validateDate = (rule, value, callback) => { //自定义有效时间的验证
        if (value===1) {
          var startTime = this.dateToMs(this.marketingScene.startDate);
          var endTime = this.dateToMs(this.marketingScene.endDate);
          if (!startTime){
            callback(new Error('请选择开始时间'));
          }
          if (!endTime){
            callback(new Error('请选择结束时间'));
          }
          if(startTime > endTime){
            callback(new Error('开始时间不能比结束时间大'));
          }
          callback();
        }else {
          callback();
        }
      };
      return {
        prizeIndex:null,
        uploadServiceUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        modelId:this.$route.query.id,
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        MarketingSceneType:MarketingSceneService.marketingSceneType,
        marketingSceneTypes:MarketingSceneService.getMarketingSceneTypes(),
        conditionTypes:[],
        isPerfectInfo:false,
        isUpdate:false,
        areaOptions:[],
        areaSelectedOptions:[],
        marketingScene:{
          marketingSceneType:1002,
          giftType:1,
          activeStatus:0,
          startDate:0,
          endDate:0,
          dateType:0,
          conditionTypes:[],
          conditions:[],
          imageUrl:"",
          areaId:''
        },
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          title: [
            { required: true, message: '请输入场景名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字', trigger: 'blur' }
          ],
          dateType :[
            { required: true, validator: validateDate, trigger: 'blur' }
          ],
          description:[{max:500, message:'长度在500字以内'}],
          giftType:[{required: true, message: '请选择增送方式', trigger: 'change' }],
          activeStatus:[{required: true, message: '请选择激活设置', trigger: 'change' }]
        },
        disabled:false
      }
    },
    components: {
      ElFormItem,
      Breadcrumb,
      ConditionGifts,
      DynamicForm,
      CouponSimpleSelect
    },
    async created(){
      this.marketingScene.marketingSceneType = parseInt(this.$route.query.marketingSceneType);
      if(this.$route.query.id) { //处理编辑逻辑
        this.isUpdate = true;
        this.marketingScene = await MarketingSceneService.doGet(this.$route.query.id);
        this.initConditions();
        if( this.marketingScene.activeStatus == 2) {
          this.isPerfectInfo = true;
        }
        this.doGetArea(this.marketingScene.areaId);
        if(this.marketingScene.endDate == 9999999999999 && this.marketingScene.startDate == 0) {
          //永久时间修改为0，提交时在改回来，防止时间控件显示时间不正确
          this.marketingScene.endDate = 0;
          this.marketingScene.dateType = 0;
        } else {
          this.marketingScene.dateType = 1;
        }

      } else {
        this.initConditions();
      }
      this.doSearchAllTreeJson();
      this.initConditionTypes();
    },
    methods: {
      async doGetArea(areaId) {
        var cityRes = await AreaService.doGetArea(areaId);
        if(cityRes.status!=1){
          return;
        }
        var self = this;
        this.areaSelectedOptions.push(cityRes.data.id);
        cityRes.data.nodes.forEach(function (city) {
          self.areaSelectedOptions.push(city.id);
          city.nodes.forEach(function (area) {
            self.areaSelectedOptions.push(area.id);
          })
        });
      },
      async doSearchAllTreeJson() {
        var cityRes = await AreaService.doSearchAllTreeJson();
        if(cityRes.status !=1){
          return;
        }
        var self = this;
        cityRes.data=this.mapAllTreeJson(cityRes.data);
        cityRes.data.forEach(function (province) {
          province.children = self.mapAllTreeJson(province.children);
          province.children.forEach(function (city) {
            city.children = self.mapAllTreeJson(city.children);
            city.children.forEach(function (area) {
              area.children = null;
            })
          });
        });
        this.areaOptions = cityRes.data;
      },
      mapAllTreeJson(cityList) {
        cityList = cityList.map(function (item) {
          return {
            value: item.id,
            label: item.name,
            children: item.nodes
          }
        })
        return cityList;
      },
      tapDatePicker() { //将时间进行一个适配组件的转化
        this.onDateTypeChange(1);
        //由于使用的时间选择控件，使用的数据模型为中国标准时间，所以需要将查询到时间戳用timeUtils先转成标准时间，再通过new Date()转成中国标准时间
        this.marketingScene.startDate =this.msToDate(this.marketingScene.startDate);
        this.marketingScene.endDate = this.msToDate(this.marketingScene.endDate);
      },
      onDateTypeChange(value){ //切换Radio的选项
        this.marketingScene.dateType = value;
        if(value == 1) {
          if(this.marketingScene.startDate == 0) {
            this.marketingScene.startDate = new Date().getTime();
          }
          if(this.marketingScene.endDate == 0) {
            this.marketingScene.endDate = new Date().getTime();
          }
        } else {
          this.marketingScene.startDate = 0;
          this.marketingScene.endDate =0;
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
        for(var index in this.marketingScene.conditions) {
          if(index == this.prizeIndex) {
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
        if (isJPG){
          return isJPG && isLt5M;
        }else if(isPNG){
          return isPNG && isLt5M;
        }
      },
      doCancel () {
        this.$router.back();
      },
      doAU(formName) {
        var self = this;
        this.disabled = true;
        this.$refs[formName].validate((valid) => {
          if(!valid){
            this.disabled = false;
            return false;
          }
          //验证动态表单
            this.$refs.dynamicform.checkForm(function(valid){
              if(!valid) {
                self.disabled = false;
                return false;
              }
              self.isPerfectInfo = self.marketingScene.activeStatus != 0;
              self.marketingScene.activeStatus = self.isPerfectInfo?2:(self.marketingScene.activeStatus == 2?1:self.marketingScene.activeStatus);
              self.marketingScene.startDate = self.dateToMs(self.marketingScene.startDate);
              self.marketingScene.endDate = self.dateToMs(self.marketingScene.endDate);
              self.marketingScene.areaId = self.areaSelectedOptions[self.areaSelectedOptions.length-1];
              self.marketingScene.endDate = self.marketingScene.endDate == 0?9999999999999:self.marketingScene.endDate;
              self.doMarketingSceneAU();
            })
        });
      },
      async doMarketingSceneAU() {
        console.log(this.marketingScene)
        var response = await MarketingSceneService.doAU(this.marketingScene);
        if (response.status === 1){
          this.$message({
            message: '保存成功!',
            type: 'success'
          });
          this.$refs.dynamicform.doAUDynamicFormItemValueRelations(response.data.id);
          this.$router.back();
          this.disabled = false;
        } else {
          this.$message.error(response.data);
          this.disabled = false;
        }
      },
      msToDate(date) { //毫秒转中国标准时间,适配时间控件
        var getType=Object.prototype.toString;
        if (getType.call(date) !== "[object Date]") {
          return new Date(TimeUtils.formatTime(date, 'Y-M-D H:m:s'))
        }else {
          return date;
        }
      },
      dateToMs(date) { //因为日历控件会将date转成中国标准时间，所以需要转回到毫秒时间戳
        var getType=Object.prototype.toString;
        if (getType.call(date) === "[object Date]") { //该方法可以判断数据的类型
          return new Date(date).getTime();
        } else {
          return date ;
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
              {conditionDesc:"被邀请",conditionModelType:this.marketingScene.marketingSceneType,conditionType:6004, targetValue:true, conditionGifts:[], valueType:""},
              {conditionDesc:"邀请成功",conditionModelType:this.marketingScene.marketingSceneType,conditionType:6000, targetValue:true, conditionGifts:[], valueType:""}
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_SCANQRCODE:
            templateCoditions = [
              {conditionDesc:"扫场景码",conditionModelType:this.marketingScene.marketingSceneType,conditionType:8000, targetValue:true, conditionGifts:[], valueType:""}
            ];
            break;
          case  this.MarketingSceneType.MARKETINGSCENETYPE_REIMBURSEMENT:
            templateCoditions = [
              {conditionDesc:"每消费金额达",conditionModelType:this.marketingScene.marketingSceneType,conditionType:11000, targetValue:"", conditionGifts:[], valueType:"int"}
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_USECOUPON:
            templateCoditions = [
              {conditionDesc:"核销成功",conditionModelType:this.marketingScene.marketingSceneType,conditionType:6005, targetValue:"", conditionGifts:[], valueType:"coupon"}
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_lUCKDRAW:
            templateCoditions = [
              {conditionDesc:"抽奖送",conditionModelType:this.marketingScene.marketingSceneType,conditionType:6008,deleteStatus:0, targetValue:"", conditionGifts:[], valueType:""}
            ];
            break;
        }
        if(this.marketingScene.conditions.length > 0 && this.marketingScene.id) {
          templateCoditions.forEach(function (tcondition) {
            var isHas = false;
            self.marketingScene.conditions.forEach(function (condition) {
              if(tcondition.conditionType == condition.conditionType) {
                isHas = true;
              }
            });
            if(!isHas) {
              self.marketingScene.conditions.push(tcondition);
            }
          })
        } else {
          this.marketingScene.conditions = templateCoditions;
        }
      },
      initConditionTypes() {
        switch (this.marketingScene.marketingSceneType) {
          case this.MarketingSceneType.MARKETINGSCENETYPE_INVITE:
            //邀请成功数达  邀请成功消费金额达   邀请成功使用券  邀请成功使用红包
            this.conditionTypes = [
              {text:"邀请成功数达", value:6001, show:true, valueType:"int"},
              {text:"邀请成功消费金额达", value:6002, show:false, valueType:"double"},
              {text:"邀请成功使用券", value:6005, show:false,  valueType:"coupon"},
              {text:"邀请成功使用红包", value:6006, show:false, valueType:"hongbao"}
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_USECOUPON:
            this.conditionTypes = [
              {text:"核销送", value:6005, show:true, valueType:"coupon"}
            ];
            break;
          case this.MarketingSceneType.MARKETINGSCENETYPE_lUCKDRAW:
            this.conditionTypes = [
              {text:"抽奖送", value:6008, show:true, valueType:""}
            ];
            break;
        }
      },
      //Condition优惠选择回调
      onConditionGiftChange(index, conditionGifts) {
        this.marketingScene.conditions[index].conditionGifts = conditionGifts;
      },
      //处理新增一级优惠回调
      handleAddConditionTypesCommand(conditionType) {
        var self = this;
        this.conditionTypes.forEach(function (item) {
          if(item.value == conditionType) {
            self.marketingScene.conditions.push({conditionDesc:item.text, conditionModelType:self.marketingScene.marketingSceneType, conditionType:item.value, targetValue:"", conditionGifts:[], valueType:item.valueType})
          }
        })
      },
      onConditionTargetValueSet(index, targetValue) {
        console.log({index:index, targetValue:targetValue});
        this.marketingScene.conditions[index].targetValue = targetValue;
      }
    }
  }
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
    position: fixed;
    bottom: 0;
    left: 220px;
    right: 20px;
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
