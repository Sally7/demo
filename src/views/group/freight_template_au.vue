<style>
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
    .area-name {
        white-space: nowrap;
        background-color: #eaf5ff;
        max-width: 150px;
        padding: 20px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 30px;

    }
</style>
<template>
    <div class="app-container" id="wrapper">
        <div class="app-inner">
            <Breadcrumb class="breadcrumb-container"></Breadcrumb>
            <div class="app__content">
                <p class="form-title">模板基础信息</p>
                <el-form :model="template" ref="template" label-width="100px" class="form-content">
                    <el-form-item label="模板名称" prop = "title">
                        <el-input v-model="template.name" placeholder="请填写模板名称"></el-input>
                    </el-form-item>
                    <el-form-item label="发货地">
                        <el-cascader
                                placeholder="请选择区域"
                                clearable
                                change-on-select
                                :options="areaOptions"
                                v-model="areaSelectedOptions">
                        </el-cascader>
                        <p style="display: inline;margin-left: 20px;color: #5C6167">注：发货地与您的实际发货地不符，可能会导致物流投诉</p>
                    </el-form-item>
                    <el-form-item label="模板类型">
                        <label>{{templateType==2?'全国包邮':'自定义模板'}}</label>
                    </el-form-item>
                </el-form>
                <p class="form-title">包邮配送区域</p>
                <el-button type="text" @click="doAllChecked">全选</el-button>
                <div v-for="(classify,index) in ['ABCFG','HJ','LNQS','TXYZ']" :key="index" style="display: flex;align-items: center">
                    <div style="width: 50px;margin-right: 30px">{{classify}}</div>
                    <el-checkbox-group v-model="mailList">
                        <el-checkbox v-for="city in mailOptions" :key="city.id" :label="city" v-if="city.character==classify" style="margin: 10px" @change="doUpdateMailList(city)">{{city.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-if="noMailList.length">
                    <p class="form-title">买家付邮费区域</p>
                    <div style="display: flex;align-items: center;margin-bottom: 20px;" v-if="noMailList.length">
                        <label style="margin-right: 50px">计费方式</label>
                        <el-radio-group v-model="template.chargingType">
                            <el-radio :label=1>按件数计费</el-radio>
                            <el-radio :label=2>按重量计费</el-radio>
                        </el-radio-group>
                    </div>
                    <div v-for="(area,index) in noMailList" :key="index" style="display: flex;align-items: center;padding: 20px 0;margin-bottom: 20px;border: solid 1px darkgray">
                        <div class="area-name">{{area.areaName}}</div>
                        <div class="area-center">
                            <div style="display: flex;align-items: center;margin-bottom: 30px">
                                <el-input-number v-model="area.base" controls-position="right" :min="0.01" style="width: 100px"></el-input-number>
                                <label style="margin-left: 10px;margin-right: 10px">{{area.chargingType==1?'件内':'千克内'}}</label>
                                <el-input-number v-model="area.basePrice" controls-position="right" :min="0.01" style="width: 100px"></el-input-number>
                                <label style="margin-left: 10px;">元</label>
                                <label style="margin-left: 50px;margin-right: 10px">每增加</label>
                                <el-input-number v-model="area.continued" controls-position="right" :min="0.01" style="width: 100px"></el-input-number>
                                <label style="margin-left: 10px;margin-right: 10px">{{area.chargingType==1?'件':'kg'}},增加运费</label>
                                <el-input-number v-model="area.continuedPrice" controls-position="right" ::min="0.01" style="width: 100px"></el-input-number>
                                <label style="margin-left: 10px;">元</label>
                            </div>
                            <div style="display: flex;align-items: center">
                                <el-checkbox v-model="area.isFreeShippingType">指定条件包邮</el-checkbox>
                                <label style="margin-left: 10px;margin-right: 10px" v-if="area.isFreeShippingType">满</label>
                                <el-input-number v-model="area.freeShippingFigure" controls-position="right" :min="0.01" style="width: 100px;margin-right: 10px" v-if="area.isFreeShippingType"></el-input-number>
                                <el-select v-model="area.freeShippingType" placeholder="请选择" v-if="area.isFreeShippingType" style="width: 100px">
                                    <el-option
                                            v-for="item in [{label:'件',value:1},{label:'元',value:2}]"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <label style="margin-left: 10px;" v-if="area.isFreeShippingType">包邮</label>
                            </div>
                        </div>
                        <el-button type="text" style="margin-left: 100px" @click="doDeleteNoMail(area)">删除</el-button>
                    </div>
                </div>
                <el-select value="+ 设定指定区域运费" @change="doUpdateNoMailList">
                    <el-option
                            v-for="item in areaList"
                            :key="item.id"
                            :label="item.name"
                            :value="item"
                            :disabled="item.disabled">
                    </el-option>
                </el-select>
                <div v-if="noDeliveryList.length">
                    <p class="form-title">不配送区域</p>
                    <div v-for="(area,index) in noDeliveryList" :key="index" style="display: flex;align-items: center;padding: 20px 0;margin-bottom: 20px;border: solid 1px darkgray">
                        <div class="area-name">{{area.areaName}}</div>
                        <el-radio-group v-model="area.expressTagId" style="display: flex;flex-wrap: wrap;justify-content: space-between;">
                            <el-radio v-for="tag in expressTagList" :key="index" :label='tag.id' style="margin: 10px">{{tag.tagName}}</el-radio>
                        </el-radio-group>
                        <el-button type="text" style="margin-left: 100px" @click="doDeleteNoDelivery(area)">删除</el-button>
                    </div>
                </div>

            </div>
        </div>
        <div class="footer">
            <el-button size="small" type="primary" :loading="loading" @click="doAU">保存</el-button>
        </div>
    </div>
</template>
<script>
    import ExpressService from '@/api/ExpressService'
    import AreaService from '@/api/AreaService'
    import Breadcrumb from '@/components/Breadcrumb'
    import cacheCookies from '@/utils/auth'
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio.vue";
    export default {
      components:{
        ElRadio,
        ElForm,
        ElFormItem,
        Breadcrumb},
      data(){
        return{
          areaList:[],
          areaOptions:[],
          areaSelectedOptions:[],
          mailList:[], //包邮区域
          mailOptions:[], //包邮区域的选项
          noMailList:[],//不包邮区域
          noDeliveryList:[],//不配送区域
          expressTagList:[], //标签数组
          template:{id:'',name:'',areaId:'',chargingType:1,belong:cacheCookies.getGroupId(),expressTemplateConfigList:[]},
          loading:false
        }
      },
      created(){
        if(this.$route.query.id != 'undefined') { //编辑
          this.template.id = this.$route.query.id;
          this.doGetExpressTemplateById();
        }
        this.doSearchAllTreeJson();
        this.doSearchExpressTag();
      },
      computed: {
        selectedMailList(){ //选中的包邮区域
          var noMailAreaIdList = [];
          var noDeliveryAreaIdList = [];
          var mailList = [];
          this.noMailList.forEach(function (noMailArea) {
            noMailAreaIdList.push(noMailArea.areaId);
          });
          this.noDeliveryList.forEach(function (noDeliveryArea) {
            noDeliveryAreaIdList.push(noDeliveryArea.areaId);
          });
          this.mailOptions.forEach(function (area) {
            if(noMailAreaIdList.indexOf(area.id) ==-1 && noDeliveryAreaIdList.indexOf(area.id) ==-1) {
              mailList.push(area);
            }
          });
          this.areaList.forEach(function (area) {
            area.disabled = noMailAreaIdList.indexOf(area.id)!=-1
          });

          return mailList;
        },
        templateType(){
          if(this.areaList.length==this.mailList.length){
            return 2
          }else{
            return 1
          }
        }
      },
      watch: {
        selectedMailList(value){ //将选中的包邮区域复制给mailList
          if(!value || !value.length){
            return;
          }
          this.mailList = value;
        }
      },
      methods:{
        async doGetArea() {
          var cityRes = await AreaService.doGet(this.template.areaId);
          if(cityRes.status!=1){
            return;
          }
          var that = this;
          this.areaSelectedOptions.push(cityRes.data.id);
          cityRes.data.nodes.forEach(function (city) {
            that.areaSelectedOptions.push(city.id);
            city.nodes.forEach(function (area) {
              that.areaSelectedOptions.push(area.id);
            })
          });
        },
        async doGetExpressTemplateById(){
          var res = await ExpressService.doGetExpressTemplateById(this.template.id);
          if(res.status !=1){
            return;
          }
          this.template = res.data;
          this.doGetArea();
          if(res.data.expressTemplateConfigList.length){
            var that = this;
            res.data.expressTemplateConfigList.forEach(function (template) {
              if(template.areaType==2){ //不配送
                that.noDeliveryList.push(template)
              }else if(template.areaType==3){ //不包邮区域
                that.noMailList.push(template)
              }
            });
          }
        },
        async doSearchExpressTag(){
          var res = await ExpressService.doSearchExpressTag(cacheCookies.getGroupId());
          if(res.status==1){
            this.expressTagList = res.data;
          }
          var that = this;
        },
        doAllChecked() {
          this.noMailList = [];
          this.noDeliveryList = [];
          this.mailList = this.mailOptions;
        },
        doUpdateMailList(e){ //编辑包邮区域
          console.log(e);
          var that = this;
          var Ids = [];
          for(var index in this.mailList){
            Ids.push(this.mailList[index].id);
          }
          if(Ids.indexOf(e.id)==-1) { //从选中状态变成非选中状态
            var area = {
              areaId:e.id,
              areaName:e.name,
              areaType:3,
              base:0.01,
              basePrice:0.01,
              continued:0.01,
              continuedPrice:0.01,
              templateType:1
            };
            this.noMailList.push(area);
          }else { //从非选中状态变成选中状态
            this.noMailList.forEach(function (noMail) {
              if(noMail.areaId == e.id){
                that.doRemove(that.noMailList,noMail)
              }
            });
            this.noDeliveryList.forEach(function (noDelivery) {
              if(noDelivery.areaId == e.id){
                that.doRemove(that.noDeliveryList,noDelivery)
              }
            });

          }
        },
        doUpdateNoMailList(e){ //编辑不包邮区域
          console.log(e);
          var area = {
            areaId:e.id,
            areaName:e.name,
            areaType:3,
            base:0.01,
            basePrice:0.01,
            continued:0.01,
            continuedPrice:0.01,
            templateType:1
          };
          this.noMailList.push(area);
          var that = this;
          this.noDeliveryList.forEach(function (noDelivery) {
            if(noDelivery.areaId == area.areaId){
              that.doRemove(that.noDeliveryList,noDelivery);
            }
          });
        },
        doDeleteNoMail(e){ //删除不包邮区域
          var that = this;
          this.noMailList.forEach(function (noMail) {
            if(noMail.areaId == e.areaId){
              that.doRemove(that.noMailList,noMail);
              e.expressTagId = that.expressTagList[0].id;
              e.areaType = 2;
              console.log(that.expressTagList[0].id)
              console.log(e);
              that.noDeliveryList.push(e);
            }
          });
        },
        doDeleteNoDelivery(e) { //删除不配送区域
          var that = this;
          this.noDeliveryList.forEach(function (noDelivery) {
            if(noDelivery.id == e.id){
              that.doRemove(that.noDeliveryList,noDelivery);
            }
          });
        },
        async doAU(){
          this.loading = true;
          this.template.templateType = this.templateType;
          this.template.areaId = this.areaSelectedOptions[2];
          this.template.expressTemplateConfigList = this.noDeliveryList.concat(this.noMailList);
          var res = await ExpressService.doAddOrUpdateExpressTemplate(this.template);
          this.loading = false;
          if(res.status==1){
            this.$router.back();
          }
        },
        async doSearchAllTreeJson(){ //获取所有城市列表
          var cityRes = await AreaService.doSearchAllTreeJson();
          if(cityRes.status !=1){
            return;
          }
          this.areaList = cityRes.data;
          this.mailOptions = cityRes.data;
          this.mapMailOptions();
          var that = this;
          cityRes.data=this.mapAllTreeJson(cityRes.data);
          cityRes.data.forEach(function (province) {
            province.children = that.mapAllTreeJson(province.children);
            province.children.forEach(function (city) {
              city.children = that.mapAllTreeJson(city.children);
              city.children.forEach(function (area) {
                area.children = null;
              })
            });
          });
          this.areaOptions = cityRes.data;
        },
        mapAllTreeJson(cityList) {
          var that = this;
          cityList = cityList.map(function (item) {
            return {
              value: item.id,
              label: item.name,
              children: item.nodes
            }
          })
          return cityList;
        },
        mapMailOptions() {
          this.mailOptions.forEach(function (area) {
            var spell = area.spell.split('')[0].toUpperCase();
            if('ABCFG'.indexOf(spell)!=-1){
              area.character = 'ABCFG';
            }else if('HJ'.indexOf(spell)!=-1){
              area.character = 'HJ';
            }else if('LNQS'.indexOf(spell)!=-1){
              area.character = 'LNQS';
            }else if('TXYZ'.indexOf(spell)!=-1){
              area.character = 'TXYZ';
            }
          });
        },
        doRemove(arr, val){
          for(var i = 0; i < arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i,1)
              break
            }
          }
        },
      }
    }
</script>