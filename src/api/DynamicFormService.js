/**
 * Created by mac on 18/1/9.
 */
import http from '@/utils/Request'
import TimeUtil from "../utils/TimeUtil";
import ConfigUtil from "../utils/ConfigUtil";

const DynamicFormService = {
  async doSearch(pformId){
    var res = await http({
      url: 'dyform_doSearchDynamicForms.do',
      data: {pformId:pformId}
    });
    return res;
  },
  async doSearchByModuleId(moduleId){
    var res = await http({
      url: 'dyform_doSearchDynamicForms.do',
      data: {moduleId:moduleId}
    });
    return res;
  },
  // 查询营销场景列表
  async doSearchDynamicformItems(moduleId, modelId, andGroupType, dyformId) {
    var formRes = await http({
      url: 'dyform_doSearchDynamicFormItems.do',
      data: {moduleId: moduleId, modelId: modelId, andGroupType: andGroupType, dyformId:dyformId, groupId:ConfigUtil.getPlatformId()}
    });

    if (formRes.status != 1 || !formRes.data || formRes.data.length == 0) {
      return [];
    }

    //新增表单时，根据计算属性设置默认值
    formRes.data.forEach(function (item) {
      if(item.compute) {
        item.compute = JSON.parse(item.compute);
        if(item.compute.isDefault) {
          item[item.dfkey] = item.compute.isDefault;
        } else {
          item[item.dfkey] = null;
        }
      } else {
        item[item.dfkey] = null;
      }
    });

    return formRes.data;
  },
  async doSearchDynamicFormItemValueRelations(moduleId, modelId, keyId, items) {
    var relationRes = await http({
      url: 'dyform_doSearchDynamicFormItemValueRelations.do',
      data: {moduleId: moduleId, modelId: modelId, keyId: keyId}
    });

    if (relationRes.status != 1 || !relationRes.data || relationRes.data.length == 0) {
      return [];
    }

    var isValueItemTypes = [1,2,3,6,8,11,14,15,16,18,20,21,38];

    //进行字段赋值
    items.forEach(function (formItem) { //补充relation属性
      var isValueItem = false;
      for(var i=0;i<isValueItemTypes.length; i++) {
        if(formItem.itemType == isValueItemTypes[i]) {
          isValueItem = true;
          break;
        }
      }
      relationRes.data.forEach(function (relation) {
          if (formItem.id == relation.formItemId) {
            if (!isValueItem) {
              formItem.valueRelations = formItem.valueRelations ? formItem.valueRelations : [];
              formItem.valueRelations.push(relation);
              if(formItem.itemType==13) {
                //当表单值数量大于1时为多选，按照多选规则，设置model属性为vuleId数组
                formItem[formItem.dfkey] = [];
                formItem.valueRelations.forEach(function (vr) {
                  formItem[formItem.dfkey].push(vr.valueId);
                })
              } else {
                //单选直接赋值
                formItem[formItem.dfkey] = relation.valueId;
              }
            } else {
              //文本域或者其他组件
              formItem.value = relation.value;
              formItem.valueId = relation.valueId;
              formItem.valueRelation = relation;
              formItem[formItem.dfkey] = relation.value;
            }
          }
        }
      )
    });

    //对无值字段进行计算属性默认值赋值
    items.forEach(function (item) {
      if(!item[item.dfkey] && item.compute) {
        item.compute = JSON.parse(item.compute);
        if(item.compute.isDefault) {
          item[item.dfkey] = item.compute.isDefault;
        }
      }
    });
  },
  async doAUDynamicFormItemValueRelations(form) {
    var res = await http({
      url: 'dyform_doAUDynamicFormItemValueRelations.do',
      data: form
    });
    return res;
  },
  async doPageDynamicFormItemValueRelations(moduleId, modelId, page, count) {
    var res = await http({
      url: 'dyform_doPageDynamicFormItemValueRelations.do',
      data: {moduleId: moduleId, modelId: modelId, page: page, count: count}
    });
    return res;
  },
  async doPageDynamicFormItemValueRelationsByModelId(moduleId, modelId, page, count) {
    var res = await http({
      url: 'dyform_doPageDynamicFormItemValueRelations.do',
      data: {moduleId: moduleId, modelId: modelId, page: page, count: count}
    });
    return res;
  },
  async doSearchValueRelationsForTable(moduleId, modelId, items) {
    var relationRes = await http({
      url: 'dyform_doSearchDynamicFormItemValueRelations.do',
      data: {moduleId: moduleId, modelId: modelId}
    });

    if (relationRes.status != 1 || !relationRes.data || relationRes.data.length == 0) {
      return [];
    }
    //[{keyId:xxxx, itemkey1:111, itemkey2:222}]
    var isValueItemTypes = [1,2,3,6,8,11,14,15,16,18,20,21,38];
    //设置字段类型
    for(var item of items) {
      item.isValueItem = false;
      for (var i = 0; i < isValueItemTypes.length; i++) {
        if (item.itemType == isValueItemTypes[i]) {
          item.isValueItem = true;
          break;
        }
      }
    }

    var rowDataList = [];
    for(var vr of relationRes.data) {
      var isHas = false;

      var currRowData = null;

      for(var rowData of rowDataList) {
        if(rowData.keyId == vr.keyId) {
          isHas = true;
          currRowData = rowData;
          break;
        }
      }

      if(!isHas) {
        currRowData = {keyId:vr.keyId};
        rowDataList.push(currRowData);
      }

      for(var item of items) {
        currRowData.label = item.label;
        if(vr.formItemId == item.id) {

          if(!currRowData[item.dfkey]) {
            currRowData[item.dfkey] = "";
          }
          //如果是多选，则可能已存在选项
          if(!item.isValueItem) {
            //拼接数据展示
            for(var v of item.valueList) {
              if(v.id == vr.valueId) {
                if(currRowData[item.dfkey]) {
                  currRowData[item.dfkey]+=(","+v.label);
                } else {
                  currRowData[item.dfkey]+=v.label;
                }
              }
            }
          } else if(item.itemType == 8) {
            currRowData[item.dfkey] = TimeUtil.formatTime(+vr.value,'Y-M-D')
          } else if(item.itemType == 38) {
            currRowData[item.dfkey] = TimeUtil.formatTime(+vr.value,'Y')
          } else {
            if(item.itemType == 2) {
              console.log(item.dfkey+",",vr);
            }

            currRowData[item.dfkey] = vr.value;
          }
        }
      }
    }
    console.log("rowDataList:",rowDataList);
    return rowDataList;
  },
  async specialtyStatistics(formItemId,type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {formItemId:'4028475a5c9df54b015c9df96aa00428',type:'specialty',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:1
        }}
    });
    return res;
  },
  async ageStatistics(type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'age',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:1
        }}
    });
    return res;
  },
  async politicalIdentityStatistics(type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'politicalIdentity',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:1
        }}
    });
    return res;
  },
  async armyYearStatistics(type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'armyYear',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:1
        }}
    });
    return res;
  },
  async allStatistics(archivesAreaId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserCountDynamicForm.do',
      data: {userSearch:{
          archivesAreaId:archivesAreaId,villageId:villageId,archiveType:1
        }}
    });
    return res;
  },
  async threeGeneraStatistics(formItemId,type,valueIds,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserCountDynamicForm.do',
      data: {formItemId:'4028475a5c9df54b015c9df96aa00399',type:'threeGenera',valueIds:valueIds,userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:1
        }}
    });
    return res;
  },
  async baoLianStatistics(formItemId,type){
    var res = await http({
      url: 'user_doStatisticsUserCountDynamicForm.do',
      data: {formItemId:'4028475a5c9df54b015c9df96aa00399',type:'baoLian'}
    });
    return res;
  },
  async abnormalStatistics(formItemId,type){
    var res = await http({
      url: 'user_doStatisticsUserCountDynamicForm.do',
      data: {formItemId:'4028475a5c9df54b015c9df96aa00399',type:'abnormal'}
    });
    return res;
  },

  async arrangeStatistics(townId,villageId,archivesAreaId,formItemId,type){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {userSearch:{townId:townId,archivesAreaId:archivesAreaId,villageId:villageId,archiveType:1},formItemId:'4028475a5c9df54b015c9df96aa00437',type:'arrange'}
    });
    return res;
  },
  async allAreaStatistics(townId,villageId,archivesAreaId){
    var res = await http({
      url: 'user_doStatisticsAreaUserDynamicForm.do',
      data: {userSearch:{townId:townId,archivesAreaId:archivesAreaId,villageId:villageId,archiveType:1}}
    });
    return res;
  },
  async threeGeneraAreaStatistics(townId,villageId,archivesAreaId,formItemId,type,valueIds){
    var res = await http({
      url: 'user_doStatisticsAreaUserDynamicForm.do',
      data: {userSearch:{townId:townId,archivesAreaId:archivesAreaId,villageId:villageId,archiveType:1},formItemId:'4028475a5c9df54b015c9df96aa00399',type:'areaThreeGenera',valueIds:'2c9326de7039823c0170398f70ed0118,2c9326de7039823c0170398f70ed0119,2c9326de7039823c0170398f70ed0120'}
    });
    return res;
  },
  async baoLianAreaStatistics(townId,villageId,archivesAreaId){
    var res = await http({
      url: 'user_doStatisticsAreaUserDynamicForm.do',
      data: {userSearch:{townId:townId,archivesAreaId:archivesAreaId,villageId:villageId,archiveType:1},formItemId:'4028475a5c9df54b015c9df96aa00427',type:'areaBaoLian'}
    });
    return res;
  },
  async abnormalAreaStatistics(townId, villageId, archivesAreaId, formItemId, type, valueIds){
    var res = await http({
      url: 'user_doStatisticsAreaUserDynamicForm.do',
      data: {userSearch:{townId:townId,archivesAreaId:archivesAreaId,villageId:villageId,archiveType:1},
        formItemId:'4028475a5c9df54b015c9df96aa00433',type:'areaAbnormal',valueIds:'2c9326de73c2acda0173c38347f4000e'}
    });
    return res;
  },
  async doSearchSearchFormItems(pformId) {
    var res = await http({
      url: 'dyform_doSearchSearchFormItems.do',
      data: {pformId:pformId}
    });
    return res.data;
  },
  async doSearchSearchFormItemsWithSM(sm) {
    var res = await http({
      url: 'dyform_doSearchSearchFormItems.do',
      data: sm
    });
    return res.data;
  },
  async doSearchSearchFormItemsByIds(itemIds) {
    var res = await http({
      url: 'dyform_doSearchSearchFormItemsByIds.do',
      data: {itemIds:itemIds}
    });
    return res.data;
  },
  async doStatisticsUserDynamicForm(sm) {
    var res = await http({
      url: 'user_doStatisticsUserCountDynamicForm.do',
      data: sm
    });
    return res.data;
  },
  async doGroupByDynamicFormItemValueCount(sm) {
    var res = await http({
      url: 'dyform_doGroupByDynamicFormItemValueCount.do',
      data: sm
    });
    return res.data;
  },
  async doGroupByDynamicFormValueCount(sm) {
    var res = await http({
      url: 'dyform_doGroupByDynamicFormValueCount.do',
      data: sm
    });
    return res.data;
  },
  async doSumDynamicFormItemValue(sm) {
    var res = await http({
      url: 'dyform_doSumDynamicFormItemValue.do',
      data: sm
    });
    return res.data;
  },
  async doStatistics(api, param) {
    var res = await http({
      url: api,
      data: param
    });
//    console.log('请求：',api,'参数：',param,'结果：',res.data);
    return res.data;
  },
  async doAddDynamicFormByFormsJson(param) {
    var res = await http({
      url: 'dyformexcel_doAddDynamicFormByFormsJson.do',
      data: param
    });
    return res.data;
  },
  /**
   * 获取修改历史日志
   * @param params
   * @return {Promise<void>}
   */
  async doGetDyformPageDynamicformLogs(params){
    var res = await http({
      url: 'dyform_doPageDynamicformLogs.do',
      data: params,
    });
    return res;
  },
  async doDeleteDynamicFormItemValueRelations(modelId, keyId){
    var res = await http({
      url: 'dyform_doDeleteDynamicFormItemValueRelations.do',
      data: {modelId:modelId, keyId:keyId},
    });
    return res;
  }
}
export default DynamicFormService
