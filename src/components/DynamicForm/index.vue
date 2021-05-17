<template>
  <div class="dynamicform">
    <el-form :model="dynamicform" label-width="100px" class="form-content" ref="dynamicform">
      <el-form-item
              v-for="(item,index) in dynamicform.items"
              :label="item.label"
              :key="index"
              :prop="'items.' + index + '.' + item.dfkey"
              :rules="rules[item.dfkey]">
        <el-input type="textarea" v-model="item[item.dfkey]"  :placeholder="item.tips" v-if="item.itemType==1 || item.itemType==14 || item.itemType==15 || item.itemType == 16" />
        <el-row v-if="item.itemType==18" style="display: flex">
          <el-color-picker v-model="item[item.dfkey]" style="margin-right: 10px" />
          <el-input v-model="item[item.dfkey]" />
        </el-row>
        <el-select v-model="item[item.dfkey]" v-if="item.itemType==7" :placeholder="item.tips" clearable>
          <el-option v-for="option in item.valueList" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
        <el-upload
                class="avatar-uploader"
                :action="uploadServiceUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                v-if="item.itemType==3">
          <div @click="selectedDfkey=item.dfkey">
            <img v-if="item[item.dfkey]" :src="item[item.dfkey]" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import DynamicFormService from '@/api/DynamicFormService'
  export default {
    name:"DynamicForm",
    props: {
      moduleId: {
        type: String
      },
      modelId:{
        type: String
      }
    },
    data() {
      return {
        uploadServiceUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        selectedDfkey:'', //主要用于多张图片点击的区分
        dynamicform:{items:[]}, //需要注意，v-for绑定的数组必须绑定在form对象里
        rules: {},
      }
    },
    created() {
      this.doSearchDynamicformItems();
    },
    methods: {
      handleAvatarSuccess(res) { //图片上传成功的回调
        for(var index in this.dynamicform.items) {
          var item = this.dynamicform.items[index];
          if(item.dfkey == this.selectedDfkey) {
            item[item.dfkey] = res.absolute;
            break;
          }
        }
      },
      isInteger(rule, value, callback) { //数字验证规则
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(value)) {
          if(rule.min) {
            if(value < rule.min) {
              callback("请输入大于"+rule.min+"的数字");
            }
          }
          if(rule.max) {
            if(value > rule.max) {
              callback("请输入小于"+rule.max+"的数字");
            }
          }
          callback();
        }
        callback('请输入'+rule.min+'到'+rule.max+'的数字');
      },
      async doSearchDynamicformItems(){
        var self = this;
        this.dynamicform.items = await DynamicFormService.doSearchDynamicformItems(this.moduleId, this.modelId, true);
        this.dynamicform.items.forEach(function (item) {
          if(item.isMust != 1) {
            return;
          }
          self.rules[item.dfkey] = [{required: true, message: item.tips, trigger: 'blur,change'}];
          switch(item.itemType) {
            case 14:
              self.rules[item.dfkey].push({validator:self.isInteger, message: '请输入数字', trigger: 'blur'});
              break;
            case 16:
              self.rules[item.dfkey].push({validator:self.isInteger, min:1, max:100, trigger: 'blur'});
              break;
          }
        });
      },
      async checkForm(callback) {
        this.$refs["dynamicform"].validate((valid) => {
          callback(valid);
        });
      },
      async doAUDynamicFormItemValueRelations(marketingSceneId){
        this.$refs["dynamicform"].validate((valid) => {
          if(!this.dynamicform.items || !this.dynamicform.items.length){
            return true;
          }
          if(!valid) {
            return false;
          }
          console.log('动态表单验证成功！！！！！！！！');
          console.log(this.dynamicform)
          var self = this;
          var submitForm = {dynamicFormItemValueRelations:[]};
          this.dynamicform.items.forEach(function (item) {
            if(item[item.dfkey] && item[item.dfkey]!='undefined' && item[item.dfkey]!='') {
              switch(item.itemType) {
                case 13:
                  for(var i=0; i<item.valueList.length; i++){
                    if(item.valueList[i].checked){
                      var valueRelation = null;
                      item.valueRelations = item.valueRelations?item.valueRelations:[];
                      for(var j=0; j<item.valueRelations.length; j++) {
                        if(item.valueList[i].id == item.valueRelations[j].valueId) {
                          item.valueRelations[j].newValueId = item.valueList[i].id;
                          valueRelation = item.valueRelations[j];
                          break;
                        }
                      }
                      if(!valueRelation) {
                        valueRelation = {formItemId:item.id, newValueId:item.valueList[i].id, dfkey:item.dfkey, moduleId:self.moduleId, modelId:marketingSceneId};
                        item.valueRelations.push(valueRelation);
                      }
                    }
                  }
                  form.dynamicFormItemValueRelations = form.dynamicFormItemValueRelations.concat(item.valueRelations);
                  break;
                default:
                  if(item.valueRelation) {
                    item.valueRelation.dfkey = item.dfkey;
                    item.valueRelation.value = item[item.dfkey];
                    item.valueRelation.newValueId = item.valueId;
                    submitForm.dynamicFormItemValueRelations.push(item.valueRelation);
                  }else{
                    var itemValueRelation = {modelId:marketingSceneId, formItemId:item.id, dfkey:item.dfkey,value:item[item.dfkey], newValueId:item.valueId, moduleId:self.moduleId};
                    submitForm.dynamicFormItemValueRelations.push(itemValueRelation);
                  }
              }
            }
          });
          //提交表单获得结果
          DynamicFormService.doAUDynamicFormItemValueRelations(submitForm);
        });
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
