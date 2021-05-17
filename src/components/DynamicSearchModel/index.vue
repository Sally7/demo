<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="(item.itemType==8||item.itemType==11)?8:4" v-for="(item,index) in items" :key="item.id+index"  style="margin-top: 10px;">
            <el-input clearable :size="size" type="input" v-model="item.value"  :placeholder="item.label" v-if="item.itemType==1" />
            <el-input clearable :size="size" type="number" v-model="item.value"  :placeholder="item.label" v-if="item.itemType==6 || item.itemType==14" />
            <el-select  style="width: 100%" :size="size" v-model="item.valueId" v-if="item.itemType==7" :placeholder="item.label" clearable>
              <el-option v-for="option in item.valueList" :key="option.id+index" :label="option.label" :value="option.id" />
            </el-select>

            <el-row v-if="item.itemType==8">
              <el-col :span="12">
                <el-date-picker
                  :size="size"
                  v-if="item.itemType==8"
                  style="width: 100%;padding: 0 5px"
                  size="small"
                  v-model="item.startDate"
                  type="date"
                  :editable=true
                  clearable
                  format="yyyy年MM月dd日"
                  :placeholder="item.label+'开始'"
                  value-format="timestamp">
                </el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-date-picker
                  :size="size"
                  v-if="item.itemType==8"
                  style="width: 100%;padding: 0 5px"
                  size="small"
                  v-model="item.endDate"
                  type="date"
                  :editable=true
                  clearable
                  format="yyyy年MM月dd日"
                  :placeholder="item.label+'结束'"
                  value-format="timestamp">
                </el-date-picker>
              </el-col>
            </el-row>

            <area-select v-if="item.itemType==11" type="area" :ref="item.dfkey"></area-select>

            <el-select style="width: 100%" :size="size" v-model="item.valueId" v-if="item.itemType==13" :placeholder="item.label" clearable multiple filterable>
              <el-option v-for="option in item.valueList" :key="option.id+index" :label="option.label" :value="option.id" />
            </el-select>

            <el-radio-group v-model="item.valueId" v-if="item.itemType==25" size="small" clearable>
              <el-radio-button v-for="option in item.valueList" :key="option.value+index" :label="option.label" :value="option.id"></el-radio-button>
            </el-radio-group>

            <el-select
              :size="size"
              style="width: 100%"
              v-if="item.itemType==34"
              v-model="item.valueId"
              filterable
              clearable
              @change="$forceUpdate()"
              default-first-option
              :placeholder="item.label">
              <el-option
                v-for="option in item.valueList"
                :key="option.id+index"
                :label="option.label"
                :value="option.id">
              </el-option>
            </el-select>

            <el-select
              :size="size"
              style="width: 100%"
              v-if="item.itemType==35"
              v-model="item.valueId"
              filterable
              multiple
              clearable
              default-first-option
              @change="$forceUpdate()"
              :placeholder="item.label">
              <el-option
                v-for="option in item.valueList"
                :key="option.id+index"
                :label="option.label"
                :value="option.id">
              </el-option>
            </el-select>
        </el-col>
    </el-row>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import DynamicFormService from '@/api/DynamicFormService'
  import AreaSelect from '@/components/AreaSelect/index'
  import ConfigUtil from '@/utils/ConfigUtil'
  export default {
    name:"DynamicForm",
    components:{AreaSelect},
    props: {
      pformId: {
        type: String
      },
      moduleId: {
        type: String
      },
      col:{
        type: Number,
        default:2
      },
      itemIds:String,
      itemsReady:Number
    },
    data() {
      return {
        items:[],
        size:'small'
      }
    },
    watch:{
      itemsReady:function(newValue){
        console.log("moduleId itemsReady......"+newValue);
        this.doSearchDynamicformItems();
      }
    },
    created() {
      this.doSearchDynamicformItems();
    },
    methods: {
      async doSearchDynamicformItems(){
        if(this.pformId) {
          this.items = await DynamicFormService.doSearchSearchFormItems(this.pformId);
        } else if(this.moduleId) {
          this.items = await DynamicFormService.doSearchSearchFormItemsWithSM({moduleId:this.moduleId});
        } else if(this.itemIds){
          this.items = await DynamicFormService.doSearchSearchFormItemsByIds(this.itemIds);
        }

      },
      getItems(){
        console.log("getItems...");
        var valueList = [];
        this.items.forEach(function (item,index) {
              switch (item.itemType) {
                case 1:
                  case 6:
                    case 14:
                       case 25:
                         case 34:
                         if((item.valueId && item.valueId != 0) || (item.value)) {
                           valueList.push(item);
                         }
                         break;
                case 8:
                  var dateArr = [];
                  if(item.startDate>0) {
                    dateArr.push(item.startDate);
                  } else {
                    dateArr.push("-");
                  }
                  if(item.endDate>0) {
                    dateArr.push(item.endDate);
                  } else {
                    dateArr.push("-");
                  }
                  item.value = dateArr.join(",");
                  if(item.value.length>6) {
                    valueList.push(item);
                  }
                  break;
                case 13:
                case 35:
                  if(item.valueId && item.valueId.length>0) {
                    var ids = [];
                    item.valueId.forEach(function (value) {
                      ids.push("'"+value+"'");
                    })
                    item.value = ids.join(",");
                    valueList.push(item);
                  }
                  console.log("case 35:", item);
                  break;
              }
        })

        return valueList;
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .el-form-item {
    margin-bottom: 14px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
