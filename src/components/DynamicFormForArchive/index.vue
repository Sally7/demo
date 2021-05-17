<template>
  <div class="dynamicform">
    <el-form :model="dynamicform" label-width="120px" class="form-content" ref="dynamicform">
      <el-row v-for="(dataItems, di) in data" :key="di+'i'">
        <el-col :span="24/col" v-for="(item,i) in dataItems" :key="item.id">
          <el-form-item
              :label="item.label"
              :prop="'items.' + (di*col+i) + '.' + item.dfkey"
              :rules="rules[item.dfkey]">
            <el-input :size="size" type="input" v-model="item[item.dfkey]" :placeholder="item.tips"
                      v-if="item.itemType==1"/>
            <el-input :size="size" type="textarea" v-model="item[item.dfkey]" :placeholder="item.tips"
                      v-if="item.itemType==2"/>
            <el-upload
                :size="size"
                class="avatar-uploader"
                :action="uploadServiceUrl"
                :file-list="item[item.dfkey]"
                :on-success="handleAvatarSuccess"
                v-if="item.itemType==3">
              <div @click="selectedDfkey=item.dfkey">
                <div v-if="item[item.dfkey]&&item[item.dfkey].length>0">
                  <img  v-for="file in item[item.dfkey]" :src="file.url" class="avatar">
                </div>

                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
            <el-upload
                    :size="size"
                    class="file-uploader"
                    :action="uploadFileUrl"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="handleFileSuccess"
                    v-if="item.itemType==5">
              <div @click="selectedDfkey=item.dfkey">
                <div v-if="item[item.dfkey]">
                  {{item[item.dfkey].name}}
                </div>
                <i v-else class="el-icon-upload" style="font-size: 30px"></i>
              </div>
            </el-upload>
            <el-upload
                :size="size"
                class="avatar-uploader"
                :action="uploadServiceUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                v-if="item.itemType==29">
              <div @click="selectedDfkey=item.dfkey">
                <div v-if="item[item.dfkey]&&item[item.dfkey].length>0">
                  <img  v-for="(file,index ) in item[item.dfkey]" :key="index" :src="file.url" class="avatar">
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>

            <el-input :size="size" type="number" v-model="item[item.dfkey]" :placeholder="item.tips"
                      v-if="item.itemType==6 || item.itemType==14"/>
            <el-input :size="size" type="number" v-model="item[item.dfkey]" step="0.1" :placeholder="item.tips"
                      v-if="item.itemType==15"/>
            <el-select style="width: 100%" :size="size" v-model="item[item.dfkey]" v-if="item.itemType==7"
                       :placeholder="item.tips" clearable>
              <el-option v-for="option in item.valueList" :key="option.id" :label="option.label" :value="option.id"/>
            </el-select>
            <el-date-picker
                :size="size"
                v-if="item.itemType==8"
                style="width: 100%"
                size="small"
                v-model="item[item.dfkey]"
                type="date"
                :editable=true
                format="yyyy年MM月dd日"
                :placeholder="item.tips"
                value-format="timestamp">
            </el-date-picker>

            <area-select v-if="item.itemType==11" type="area" :ref="item.dfkey"
                         :areaId="item[item.dfkey]+''"></area-select>

            <el-select style="width: 100%" :size="size" v-model="item[item.dfkey]" v-if="item.itemType==13"
                       :placeholder="item.tips" clearable multiple filterable>
              <el-option v-for="option in item.valueList" :key="option.id" :label="option.label" :value="option.id"/>
            </el-select>

            <el-row v-if="item.itemType==18" style="display: flex">
              <el-color-picker :size="size" v-model="item[item.dfkey]" style="margin-right: 10px"/>
              <el-input :size="size" v-model="item[item.dfkey]"/>
            </el-row>

            <el-slider
                :size="size"
                style="width: 100%"
                v-if="item.itemType==21"
                v-model="item[item.dfkey]"
                show-input>
            </el-slider>

            <el-radio-group v-model="item[item.dfkey]" v-if="item.itemType==25" size="small">
              <el-radio-button v-for="option in item.valueList" :key="option.value" :label="option.label"
                               :value="option.id"></el-radio-button>
            </el-radio-group>

            <el-switch
                v-if="item.itemType==4"
                v-model="item[item.dfkey]"
                size="small">
            </el-switch>

            <el-select
                :size="size"
                style="width: 100%"
                v-if="item.itemType==34"
                v-model="item[item.dfkey]"
                filterable
                allow-create
                @change="$forceUpdate()"
                default-first-option

                :placeholder="item.tips">
              <el-option
                  v-for="option in item.valueList"
                  :key="option.id"
                  :label="option.label"
                  :value="option.id">
              </el-option>
            </el-select>

            <el-select
                :size="size"
                style="width: 100%"
                v-if="item.itemType==35"
                v-model="item[item.dfkey]"
                filterable
                multiple
                allow-create
                default-first-option
                disabled
                @change="$forceUpdate()"
                :placeholder="item.tips">
              <el-option
                  v-for="option in item.valueList"
                  :key="option.id"
                  :label="option.label"
                  :value="option.id">
              </el-option>
            </el-select>
            <el-date-picker
                :size="size"
                v-if="item.itemType==38"
                style="width: 100%"
                size="small"
                v-model="item[item.dfkey]"
                type="year"
                :editable=true
                :placeholder="item.tips"
                value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import cacheCookies from '@/utils/auth';
import DynamicFormService from '@/api/DynamicFormService';
import AreaSelect from '@/components/AreaSelect/index';
import ConfigUtil from '@/utils/ConfigUtil';

export default {
  name: 'DynamicForm',
  components: {AreaSelect},
  props: {
    dyform:{type: Object},
    moduleId: {
      type: String,
    },
    size: {
      type: String,
      default: 'mini',
    },
    modelId: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
    keyId: {
      type: String
    },
    col: {
      type: Number,
      default: 2,
    },
    itemsReady: Number,
    autoLoad: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
//      校验结束日期
    var validStopDate = (rule, value, callback) => {
      let startDate = 0, items = this.dynamicform.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i]['dfkey'] == 'startingDate') {
          startDate = items[i].startingDate || 0;
          break;
        }
      }
      if (new Date(startDate).getTime() > new Date(value).getTime()) {
        callback(new Error('结束日期不能小于开始日期'));
      } else {
        callback();
      }
    };

    var validStartDate = (rule, value, callback) => {
      let stopDate = 0, items = this.dynamicform.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i]['dfkey'] == 'stopDate') {
          stopDate = items[i].stopDate || 0;
          break;
        }
      }
      if (new Date(value).getTime() > new Date(stopDate).getTime()) {
        callback(new Error('结束日期不能小于开始日期'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible:false,
      dialogImageUrl:"",
      uploadServiceUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',
      uploadFileUrl:process.env.BASE_API + '/file_uploadFile.do',
      fileInfo:{},
      selectedDfkey: '', //主要用于多张图片点击的区分
      dynamicform: {items: []}, //需要注意，v-for绑定的数组必须绑定在form对象里
      rules: {
        stopDate: [
          {validator: validStopDate, trigger: 'blur'},
        ],
      },
      data: [],
      pickerOptions: {
        disabledDate: function (time) {
          return (time.getTime() + 24 * 3600 * 1000) > Date.now();
        },
      },
    };
  },
  watch: {
    modelId: function (newValue) {
      console.log('DynamicFormForArchive modelId change......', newValue);
      this.doSearchDynamicformItems();
    },
    moduleId: function (newValue) {
      this.items = null;
      this.doSearchDynamicformItems();
      console.log('moduleId change......');
    },
    itemsReady: function (newValue) {
      console.log('moduleId itemsReady......' + newValue);
      this.doSearchDynamicformItems();
    },
  },
  created() {
    console.log("created......");
    this.doSearchDynamicformItems();
  },
  methods: {
    handleAvatarSuccess(res) { //图片上传成功的回调
      for (var index in this.dynamicform.items) {
        var item = this.dynamicform.items[index];
        if (item.dfkey == this.selectedDfkey) {
          item[item.dfkey] = res.absolute;
          break;
        }
      }
    },
    beforeUpload(res){
        this.fileInfo.name = res.name
    },
    handleFileSuccess(res){
          console.log(res)
          for (var index in this.dynamicform.items) {
              var item = this.dynamicform.items[index];
              if (item.dfkey == this.selectedDfkey) {
                  // this.fileInfo.absolute = res.
                  item[item.dfkey] ={
                      name: this.fileInfo.name,
                      absolute:res.absolute
                  }
                  break;
              }
          }
      },
    isInteger(rule, value, callback) { //数字验证规则
      var reg = /^[0-9]+.?[0-9]*$/;
      if (reg.test(value)) {
        if (rule.min) {
          if (value < rule.min) {
            callback('请输入大于' + rule.min + '的数字');
          }
        }
        if (rule.max) {
          if (value > rule.max) {
            callback('请输入小于' + rule.max + '的数字');
          }
        }
        callback();
      }
      callback('请输入' + rule.min + '到' + rule.max + '的数字');
    },
    validateIdNo(rule, value, callback) { //自定义有效时间的验证
      if (!value) {
        callback(new Error('请输入正确的身份证号码'));
        return;
      }
      var result = ConfigUtil.isLegal(value);
      if (!result) {
        callback(new Error('请输入正确的身份证号码'));
      }
      callback();
    },
    validateArea(rule, value, callback) { //自定义有效时间的验证
      var area = null;
      var coms = this.$refs[rule.key];
      if (Array.isArray(coms)) {
        area = this.$refs[rule.key][0].getArea();
      } else {
        area = this.$refs[rule.key].getArea();
      }
      this.dynamicform.items[rule.index][rule.key] = area.areaId;
      console.log('validateArea........');
      console.log(this.dynamicform.items[rule.index]);
      if (!area.areaId) {
        callback(new Error('请选择省市区'));
        return;
      }
      callback();
    },
    async doSearchDynamicformItems() {
      var self = this;
      this.data = [];
      this.dynamicform.items = await DynamicFormService.doSearchDynamicformItems(this.dyform.moduleId, this.modelId, true);
      if (!this.dynamicform.items || this.dynamicform.items.length == 0) {
        return;
      }
      var rowData = [];
      this.dynamicform.items.forEach(function (item, index) {
        if(item.itemType == 29) {
          item[item.dfkey] = [];
        }
        if (self.col > 1) {
          if (index % self.col == 0 && index != 0) {
            self.data.push(rowData);
            rowData = [];
            rowData.push(item);
            if (index == self.dynamicform.items.length - 1) {
              self.data.push(rowData);
            }
          } else {
            rowData.push(item);
            if (index == self.dynamicform.items.length - 1) {
              self.data.push(rowData);
            }
          }
        } else {
          rowData.push(item);
        }

        if (item.isMust != 1) {
          return;
        }

        self.rules[item.dfkey] = [{required: true, message: '请填写必填项', trigger: 'blur'}];
        switch (item.itemType) {
          case 11:
            self.rules[item.dfkey] = [{
              required: true,
              validator: self.validateArea,
              message: '请选择省市区',
              trigger: 'blur',
              key: item.dfkey,
              index: index
            }];
            break;
          case 14:
            self.rules[item.dfkey].push({validator: self.isInteger, message: '请输入数字', trigger: 'blur'});
            break;
          case 15:
            break;
          case 16:
            self.rules[item.dfkey].push({validator: self.isInteger, min: 1, max: 100, trigger: 'blur'});
            break;
        }
      });
      console.log('-----------------------');
      console.log(this.dynamicform.items);
      console.log(rowData);
      if (self.col == 1) {
        self.data.push(rowData);
      }
      if (this.isEdit && this.autoLoad && this.modelId) {
        DynamicFormService.doSearchDynamicFormItemValueRelations(this.moduleId, this.modelId, this.keyId, this.dynamicform.items);
      }
    },
    async resetFields() {
      this.$refs['dynamicform'].resetFields();
    },
    async checkForm(callback) {
      this.$refs['dynamicform'].validate((valid) => {
        callback(valid);
      });
    },
    async doAUDynamicFormItemValueRelations(modelId) {
      console.log(this.dynamicform);
      this.$refs['dynamicform'].validate(async (valid) => {
        if (!this.dynamicform.items || !this.dynamicform.items.length) {
          return true;
        }

        if (!valid) {
          return false;
        }

        console.log('动态表单验证成功！！！！！！！！');
        console.log(this.dynamicform);
        var self = this;
        var submitForm = {dynamicFormItemValueRelations: []};

        var isValueItemTypes = [1, 2, 3 , 5, 6, 8, 11, 14, 15, 16, 18, 20, 21,29, 38];

        //组装relation关系
        this.dynamicform.items.forEach(function (item) {
          var isValueItem = false;
          for (var i = 0; i < isValueItemTypes.length; i++) {
            if (item.itemType == isValueItemTypes[i]) {
              isValueItem = true;
              break;
            }
          }
          if (!isValueItem) {
            item.valueRelations = item.valueRelations ? item.valueRelations : [];

            var selectedValueIds = [];

            //element ui 单选至是普通字段形式存放，多选是数组形式存放，这里统一转换成 selectedValueIds数组，方便处理逻辑统一
            if (!item[item.dfkey]) {
              selectedValueIds = [];
            } else {
              if (!Array.isArray(item[item.dfkey])) {
                selectedValueIds = [item[item.dfkey]];
              } else {
                selectedValueIds = item[item.dfkey];
              }
            }

            //当清除所有选项，则删除所有关系
            if (selectedValueIds.length == 0) {
              for (var j = 0; j < item.valueRelations.length; j++) {
                item.valueRelations[j].modelId = null;
              }
            }

            for (var i = 0; i < selectedValueIds.length; i++) {
              var newValueId = selectedValueIds[i];
              var isHas = false;

              //多选，对还在的选项进行newvulueid赋值
              for (var j = 0; j < item.valueRelations.length; j++) {
                if (newValueId == item.valueRelations[j].valueId) {
                  isHas = true;
                  item.valueRelations[j].newValueId = newValueId;
                  break;
                }
              }
              //对新增选项进行添加，新增选项设置newValueId不加valueId
              if (!isHas) {
                var itemValueRelation = {
                  modelId: modelId,
                  formItemId: item.id,
                  dfkey: item.dfkey,
                  newValueId: newValueId,
                  moduleId: self.moduleId
                };
                item.valueRelations.push(itemValueRelation);
              }
            }
            //对剩余已经不在的选项进行modelid置空，后台根据空来集合删除
            for (var j = 0; j < item.valueRelations.length; j++) {
              if (!item.valueRelations[j].newValueId) {
                item.valueRelations[j].modelId = null;
              } else {
                //支持新增选项，如果发现新增选项id和uuid长度不一致，则判定为新增选项，使用remark进行特殊字段存储，后台进行新增-关联-清空
                if (item.valueRelations[j].newValueId.length != item.id.length) {
                  item.valueRelations[j].remark = item.valueRelations[j].newValueId;
                }
              }
            }
            submitForm.dynamicFormItemValueRelations = submitForm.dynamicFormItemValueRelations.concat(item.valueRelations);
          } else {
            console.log('input value attr:' + item.dfkey);
            console.log(item);
            if (item.valueRelation) {
              item.valueRelation.dfkey = item.dfkey;
              item.valueRelation.value = item.itemType==5? JSON.stringify(item[item.dfkey]) : item[item.dfkey];
              item.valueRelation.newValueId = item.itemType==5? JSON.stringify(item[item.dfkey]) : item[item.dfkey];
              submitForm.dynamicFormItemValueRelations.push(item.valueRelation);
            } else {
              var itemValueRelation = {
                modelId: modelId,
                formItemId: item.id,
                dfkey: item.dfkey,
                value:item.itemType==5? JSON.stringify(item[item.dfkey]) : item[item.dfkey],
                newValueId: item.valueId,
                moduleId: self.moduleId
              };
              submitForm.dynamicFormItemValueRelations.push(itemValueRelation);
            }
          }
        });
        //提交表单获得结果
        var auResult = await DynamicFormService.doAUDynamicFormItemValueRelations(submitForm);
        self.$emit('auCallback', auResult);
      });
    },
    async genPrintData() {
      var dataList = await DynamicFormService.doSearchValueRelationsForTable(this.moduleId, this.modelId, this.dynamicform.items);
      return dataList[0];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
};
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .file-uploader{
    display: flex;
    align-items: center;
  }
.el-form-item {
  margin-bottom: 14px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
