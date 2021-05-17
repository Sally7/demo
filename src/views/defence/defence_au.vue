<template>
  <div class="container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <el-row>
          <!--右侧栏开始-->
          <el-col :span="4">
            <el-tabs :tab-position="'left'" style="height: 100%;position: fixed" @tab-click="handleClick">
              <el-tab-pane label="基本信息"></el-tab-pane>
              <el-tab-pane v-for="(dyform,index) in dyforms" :key="index" v-if="index>0" :label="dyform.title"></el-tab-pane>
            </el-tabs>
          </el-col>

          <!--右侧栏结束-->
          <!--左侧栏开始-->
          <el-col :span="20" style="margin-left:220px;padding-right: 10px">
            <!--基本信息开始-->
            <el-row :class="currentEditIndex==-1?'base-info-mousein':''" @mouseenter="enter(-1)" @mouseleave="leave()" id="base" >
              <el-col :span="24">
                <el-form :model="model" :rules="rules" ref="modelForm" label-width="80px" class="form-content">
                  <el-row v-if="false">
                    <el-col :span="12">
                      <el-form-item label="机构分类" prop="groupCategoryIds">
                        <el-cascader
                            size="small"
                            style="width: 100%"
                            v-model="model.groupCategoryId"
                            :props="{ value: 'id',label:'name',children:'nodes', emitPath:'false'}"
                            :options="groupCategorys"
                            filterable
                            @change="groupCategorySelect"></el-cascader>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="text-align: right" v-if="currentEditIndex==0">
                      <el-button type="text" @click="currentEditIndex=-1">编辑</el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="企业名称" prop="idNo">
                        <el-input v-model="model.name" size="small"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="信用代码" prop="outerSystemUserId">
                        <el-input v-model="model.groupNo" size="small"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="负责人" prop="managerName">
                        <el-input v-model="model.managerName" placeholder="姓名" size="small"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="model.contact" placeholder="" size="small"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row v-if="false">
                    <el-form-item label="机构地址" prop="address">
                      <area-select ref="address" type="paddress" :areaId="model.areaId+''" :townId="model.townId" :villageId="model.villageId" :address="model.address" :point="model.point"></area-select>
                    </el-form-item>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>
            <el-row v-if="dyforms[0]" :class="currentEditIndex==-1?'detail-info-mousein':''":id="dyforms[0].moduleId">
              <dynamic-form-for-archive :dyform="dyforms[0]" :moduleId="dyforms[0].moduleId" :modelId="model.id" :ref="dyforms[0].moduleId" @auCallback="auCallback"></dynamic-form-for-archive>
            </el-row>
            <el-row :class="currentEditIndex==-1?'detail-info-mousein':''" v-for="(dyform,index) in dyforms" :key="'dyform_'+index" v-if="dyform.changeType==2&&index>0" :id="dyform.moduleId">
              <p class="form-title">{{dyform.title}}
                <el-button type="text" style="position: absolute;right: 10px;"></el-button>
              </p>
              <dynamic-form-for-archive :dyform="dyform"  :moduleId="dyform.moduleId" :modelId="model.id" :ref="dyform.moduleId" @auCallback="auCallback"></dynamic-form-for-archive>
            </el-row>
            <el-row style="border:1px solid #409EFF; border-top: none;padding: 10px 5px;">
              <div style="margin-top: 20px;text-align: center;" v-if="currentEditIndex==-1">
                <el-button type="primary" @click="doAU()" v-if="!isDetail" :loading="doAUing" :disabled="doAUing">保存</el-button>
                <el-button @click="currentEditIndex=0" v-if="!isDetail">取消</el-button>
              </div>
            </el-row>

            <!--列表信息开始-->
            <el-row v-for="(dyform,index) in dyforms" :key="'dyform_'+index" :id="dyform.moduleId" v-if="dyform.changeType==1">
              <dynamic-form-table :dyform="dyform" :modelId="model.id" :isDetail="!isDetail"></dynamic-form-table>
            </el-row>
            <!--列表信息结束-->

            <el-row :class="currentEditIndex == -1 ? 'detail-info-mousein' : ''" style="border-bottom: none;"  v-if="false">
              <p class="form-title">
                附件
                <el-button type="text" @click="toScanGather">扫描</el-button>
              </p>
              <el-form
                  :model="model"
                  :rules="rules"
                  ref="attachmentForm"
                  class="form-content"
              >
                <el-form-item class="item-vertical">
                  <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      :file-list="attachments"
                      :on-success="handleAttachmentSuccess"
                      :on-remove="handleAttachmentRemove"
                      :on-preview="handlePreview">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="previewDialogShow">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
              </el-form>
            </el-row>

          </el-col>
        </el-row>
        <gather-scan-image
            ref="gatherScanImage"
            type="main"
            @success="gatherScanImageSuccess"
        ></gather-scan-image>
        <!--右侧栏结束-->
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb';
  import Bmap from '@/components/Bmap';
  import MarketingSceneService from '@/api/MarketingSceneService';
  import GroupService from '@/api/GroupService';
  import ConditionGifts from '@/components/ConditionGifts/index';
  import DynamicForm from '@/components/DynamicForm/index';
  import DynamicFormForArchive from '@/components/DynamicFormForArchive/index';
  import AreaSelect from '@/components/AreaSelect/index';
  import TimeUtils from '@/utils/TimeUtil';
  import ConfigUtil from '@/utils/ConfigUtil';
  import CouponSimpleSelect from '@/components/CouponSelect/simpleSelect';
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue';
  import DynamicFormTable from '@/components/DynamicFormTable/index';
  import DynamicFormService from '../../api/DynamicFormService';
  import UserService from '../../api/UserService';
  import {mapGetters} from 'vuex';
  import GatherScanImage from '@/components/GatherScanImage/index';
  export default {
    data() {
      var validateIdNo = (rule, value, callback) => { //自定义有效时间的验证
        if (!value) {
          callback(new Error('请输入正确的身份证号码'));
          return;
        }
        var result = ConfigUtil.isLegal(value);
        if (!result) {
          callback(new Error('请输入正确的身份证号码'));
        }
        callback();
      };
      var validateArea = (rule, value, callback) => { //自定义有效时间的验证
        var area = this.$refs.address.getArea();
        this.model.address = area.address;
        this.model.areaId = area.areaId;
        this.model.townId = area.townId;
        this.model.villageId = area.villageId;

        if (area.point) {
          var points = area.point.split(',');
          this.model.longitude = points[0];
          this.model.latitude = points[1];
        }

        if (!this.model.areaId) {
          callback(new Error('请选择省市区'));
          return;
        }
        if (!this.model.address) {
          callback(new Error('请输入详细地址'));
          return;
        }
        callback();
      };
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
        isDetail:this.$route.query.detail,
        model: {id: this.$route.query.id, managerName: '', groupCategoryId: parseInt(this.$route.query.categoryId), groupType: 3, areaId: '', groupTypeId: '', groupRationList: [{tradingAreaId: ConfigUtil.getTradingAreaId()}]},
        currentEditIndex: -1,
        dyforms: [],
        groupCategorys: [],
        uploadUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          managerName: [
            {required: true, message: '请输入姓名', trigger: 'change'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字', trigger: 'change'},
          ],
          address: [{required: true, validator: validateArea, trigger: 'blur'}],
        },
        doAUing: false,
        pformId: '',
        pmoduleId: '',
        previewDialogShow:false,
        attachments: [],
        dialogImageUrl:""
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    components: {
      DynamicFormTable,
      ElFormItem,
      Breadcrumb,
      ConditionGifts,
      DynamicForm,
      CouponSimpleSelect,
      AreaSelect,
      DynamicFormForArchive,
      Bmap,
      GatherScanImage,
    },
    async created() {
      var that = this;
      this.model.areaId = this.area.areaId;
      this.groupCategorys = await GroupService.doSearchGroupCategoryTree();

      var id = this.$route.query.id;
      if (id) {
        var groupRes = await GroupService.doGetOneGroup(id);
        if (groupRes.data.longitude) {
          groupRes.data.point = groupRes.data.longitude + ',' + groupRes.data.latitude;
        }

        this.model = groupRes.data;

        this.attachments = [];
        if (this.model.attachmentShowUrl) {
          this.model.attachmentShowUrl.split(',').forEach(function(item, index) {
            var attachment = {};
            attachment.url = item;
            attachment.relativeUrl = that.model.attachmentUrl.split(',')[index];
            that.attachments.push(attachment);
          });
        }


      }

      this.doSearch(this.model.groupCategoryId);
      console.log('archiveType-------:', that.pformId);
    },
    methods: {
      sortChangeType(a,b) {
        return b.changeType-a.changeType;
      },
      async doSearch(categoryId) {
        var dyformsRes = await DynamicFormService.doSearchByModuleId('group_' + categoryId);
        if (dyformsRes.status) {
          dyformsRes.data = dyformsRes.data.sort(this.sortChangeType)
          console.log('dyforms-------:',dyformsRes.data);

          this.dyforms = dyformsRes.data;
        }
      },
      doBatchValide(pformRef, sforms, changeType) {
        //this.$refs.pformRef.validate((valid) => {
      },
      handleAvatarSuccess(res, file) { //图片上传成功的回调
//        this.marketingScene.headRelURL = res.absolute;
        this.marketingScene.imageUrl = res.absolute;
      },
      handlePrizeImgSuccess(res, file) {
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
      auCallback(result) {
        console.log('auCallback result:');
        console.log(result);
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success',
        });
        this.doAUing = false;
        this.currentEditIndex = 0;
      },
      doBatchValidate() {
        var that = this;
        var vaildRes = true;
        this.$refs.modelForm.validate((valid) => {
          if (!valid) {
            vaildRes = false;
          }
          this.dyforms.forEach(function(dyform) {
            if (dyform.changeType == 2) {
              //console.log("doBatchValidate:", dyform.moduleId, that.$refs[dyform.moduleId]);
              var coms = that.$refs[dyform.moduleId];
              var com = null;
              if (Array.isArray(coms)) {
                com = coms[0];
              } else {
                com = coms;
              }
              com.checkForm(function(valid) {
                if (!valid) {
                  vaildRes = false;
                }
              });
            }
          });
        });
        return vaildRes;
      },
      async doAU() {
        this.doAUing = true;
        var that = this;
/*        var area = this.$refs.address.getArea();
        this.model.address = area.address;
        this.model.areaId = area.areaId;
        this.model.townId = this.area.townId;
        this.model.villageId = this.area.villageId;*/

        if (this.doBatchValidate()) {
          var groupRes = null;

          if (that.model.id) {
            groupRes = await GroupService.doUpdateGroup(that.model);
          } else {
            groupRes = await GroupService.doAddCompany(that.model);
          }
          that.model.id = groupRes.data.id;
          if (groupRes.status == 1) {
            that.auCallback(groupRes);
          }
          that.dyforms.forEach(function(dyform) {
            if (dyform.changeType == 2) {

              var coms = that.$refs[dyform.moduleId];
              var com = null;
              if (Array.isArray(coms)) {
                com = coms[0];
              } else {
                com = coms;
              }
              let res = com.doAUDynamicFormItemValueRelations(that.model.id);

            }
          });
        } else {
          that.$message({
            showClose: true,
            message: '请检查信息表单',
            type: 'warning',
          });
          that.doAUing = false;
        }
      },
      resetForm(formName) { //重置验证
        this.$refs[formName].resetFields();
      },
      goAnchor(selector) {
        console.log(selector);
        var anchor = this.$el.querySelector(selector);
        document.body.scrollTop = anchor.offsetTop; // chrome
        document.documentElement.scrollTop = anchor.offsetTop; // firefox
      },
      handleClick(tab, event) {
        var that = this;
        switch (tab.index) {
          case '0':
            that.goAnchor('#base');
            break;
          default:
            that.goAnchor('#' + that.dyforms[+tab.index].moduleId);
            break;
        }
      },
      async idNoSearch(idNo) {
        if (idNo && idNo.length == 18) {
          var searchRes = await UserService.doPage({idNo: idNo}, 1, 1);
          if (searchRes.data.length > 0) {
            this.model = searchRes.data[0];
            this.doSearch();
          }
        }
      },
      groupCategorySelect(categorys) {
        console.log('groupCategorySelect:', categorys);
        this.model.groupCategoryId = categorys[categorys.length - 1];
        this.doSearch(categorys[categorys.length - 1]);
      },
      handleAttachmentSuccess(res, file, fileList) {
        console.log('上传门店详情成功！');
        console.log(this.attachments);
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.relativeUrl = res.relative;
        this.attachments.push(fileParam);
        this.model.attachmentUrl = '';
        this.attachments.forEach(function(item) {
          if (that.model.attachmentUrl) {
            that.model.attachmentUrl += (',' + item.relativeUrl);
          } else {
            that.model.attachmentUrl = item.relativeUrl;
          }
        });

        console.log('handleAttachmentSuccess:' + that.model.attachmentUrl);
      },
      handleAttachmentRemove(file, fileList) {
        var that = this;
        this.model.attachmentUrl = '';
        this.attachments = [];
        fileList.forEach(function(item) {
          that.attachments.push(item);
          if (that.model.attachmentUrl) {
            that.model.attachmentUrl += (',' + item.relativeUrl);
          } else {
            that.model.attachmentUrl = item.relativeUrl;
          }
        });
      },
      //图片预览
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.previewDialogShow = true;
      },
      toScanGather() {
        this.$refs.gatherScanImage.doShow();
      },
      gatherScanImageSuccess(res) {
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.relativeUrl = res.relative;
        this.attachments.unshift(fileParam);

        this.model.attachmentUrl = '';
        this.attachments.forEach(function(item) {
          if (that.model.attachmentUrl) {
            that.model.attachmentUrl += (',' + item.relativeUrl);
          } else {
            that.model.attachmentUrl = item.relativeUrl;
          }
        });
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .container {
    background-color: #fff;
  }

  .form-title {
    padding: 15px 0;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
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

  .el-form-item {
    margin-bottom: 14px;
  }

  .base-info-mousein {
    border: 1px solid #409EFF;
    border-bottom: none;
    padding: 10px 5px;
  }

  .detail-info-mousein {
    border: 1px solid #409EFF;
    border-top: none;
    border-bottom: none;
    padding: 10px 5px;
  }
</style>
