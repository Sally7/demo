<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb
          class="breadcrumb-container"
          :showPrint="!!model.id"
          @handleClick="toPrint"
      ></Breadcrumb>
      <div class="app__content">
        <el-row>
          <!--左侧栏开始-->
          <el-col :span="20">
            <!--基本信息开始-->
            <el-row
                :class="currentEditIndex == -1 ? 'base-info-mousein' : ''"
                @mouseenter="enter(-1)"
                @mouseleave="leave()"
                id="base"
            >
              <el-col :span="4" style="padding-left: 20px;text-align: center">
                <img
                    class="logo"
                    style="width: 122px; height: 150px;"
                    :src="model.showIconUrl"
                />
                <el-row>
                  <el-col :span="8">
                    <el-upload
                        :action="uploadServiceUrl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                    >
                      <el-button type="text">上传</el-button>
                    </el-upload>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="text" @click="toGather">拍照</el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button
                        type="text"
                        @click="delIconUrl"
                        :disabled="model.showIconUrl == defaultIconUrl"
                    >删除
                    </el-button
                    >
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="20">
                <el-form
                    :model="model"
                    :rules="rules"
                    ref="modelForm"
                    label-width="80px"
                    class="form-content"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="身份证号" prop="idNo">
                        <el-input
                            v-model="model.idNo"
                            placeholder=""
                            size="small"
                            maxlength="18"
                            show-word-limit
                            @input="idNoSearch"
                            @focus="idNoFocus"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="档案编号" prop="outerSystemUserId">
                        <el-input
                            v-model="model.outerSystemUserId"
                            placeholder="档案编号"
                            size="small"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col
                        :span="2"
                        style="text-align: right"
                        v-if="currentEditIndex == 0"
                    >
                      <el-button type="text" @click="currentEditIndex = -1"
                      >编辑
                      </el-button
                      >
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="姓名" prop="name">
                        <el-input
                            v-model="model.name"
                            placeholder="姓名"
                            size="small"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="model.sex" size="small">
                          <el-radio-button label="1" value="1"
                          >男
                          </el-radio-button
                          >
                          <el-radio-button label="2" value="2"
                          >女
                          </el-radio-button
                          >
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="出生日期" prop="birthDay">
                        <el-date-picker
                            style="width: 100%"
                            size="small"
                            v-model="model.birthDay"
                            type="date"
                            :editable="true"
                            :picker-options="pickerOptions"
                            format="yyyy年MM月dd日"
                            value-format="timestamp"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">-->
                      <!--<el-form-item label="婚否" prop="validateArea">-->
                        <!--<el-radio-group-->
                            <!--v-model="model.maritalStatus"-->
                            <!--size="small"-->
                        <!--&gt;-->
                          <!--<el-radio-button label="1">已婚</el-radio-button>-->
                          <!--<el-radio-button label="0">未婚</el-radio-button>-->
                        <!--</el-radio-group>-->
                      <!--</el-form-item>-->
                    <!--</el-col>-->
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="民族" prop="nation">
                        <el-select
                            style="width: 100%"
                            size="small"
                            v-model="model.nation"
                            filterable
                            placeholder="请选择"
                        >
                          <el-option
                              v-for="item in nations"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="学历" prop="education">
                        <el-select
                            style="width: 100%"
                            size="small"
                            v-model="model.education"
                            filterable
                            placeholder="请选择"
                        >
                          <el-option
                              v-for="item in educations"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="政治面貌" prop="politicalIdentity">
                        <el-select
                            style="width: 100%"
                            size="small"
                            v-model="model.politicalIdentity"
                            filterable
                            placeholder="请选择"
                        >
                          <el-option
                              v-for="item in politicalIdentitys"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="本人电话" prop="phone">
                        <el-input
                            v-model="model.phone"
                            placeholder=""
                            size="small"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="家庭地址" prop="address">
                      <area-select
                          ref="address"
                          type="saddress"
                          :areaId="model.areaId + ''"
                          :townId="model.townId"
                          :villageId="model.villageId"
                          :address="model.address"
                      ></area-select>
                    </el-form-item>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>
            <el-row :class="currentEditIndex == -1 ? 'detail-info-mousein' : ''" style="border-bottom: none;">
              <p class="form-title">
                档案附件
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
            <el-row
                :class="currentEditIndex == -1 ? 'detail-info-mousein' : ''"
                id="archive"
            >
              <p class="form-title">
                详细信息
                <el-button
                    type="text"
                    style="position: absolute;right: 10px;"
                ></el-button>
              </p>
              <dynamic-form-for-archive
                  :moduleId="pmoduleId"
                  :modelId="model.id"
                  ref="detailForm"
                  @auCallback="auCallback"
              ></dynamic-form-for-archive>
              <div
                  style="margin-top: 20px;text-align: center;"
                  v-if="currentEditIndex == -1"
              >
                <el-button v-if="!isDetail"
                           type="primary"
                           @click="doAU()"
                           :loading="doAUing"
                           :disabled="doAUing"
                >保存
                </el-button
                >
                <el-button v-if="!isDetail" @click="currentEditIndex = 0">取消</el-button>
              </div>
            </el-row>

            <!--基本信息结束-->

            <!--家庭成员信息开始-->
            <el-row
                v-for="(dyform, index) in dyforms"
                :key="'dyform_' + index"
                :id="dyform.moduleId"
            >
              <dynamic-form-table
                  :isDetail="!isDetail"
                  :dyform="dyform"
                  :modelId="model.id"
                  :ref="dyform.id"
              ></dynamic-form-table>
            </el-row>
            <!--家庭成员信息结束-->
          </el-col>

          <!--右侧栏开始-->
          <el-col :span="4">
            <el-tabs
                :tab-position="'right'"
                style="position: fixed;height: 70%"
                @tab-click="handleClick"
            >
              <el-tab-pane label="基本信息"></el-tab-pane>
              <el-tab-pane label="详细信息"></el-tab-pane>
              <el-tab-pane
                  v-for="(dyform, index) in dyforms"
                  :key="index"
                  :label="dyform.title"
              ></el-tab-pane>
            </el-tabs>
          </el-col>
          <!--右侧栏结束-->
        </el-row>
        <!--右侧栏结束-->
      </div>

      <gather-image
          ref="gatherImage"
          type="vice"
          @success="gatherUserIconSuccess"
      ></gather-image>

      <gather-scan-image
          ref="gatherScanImage"
          type="main"
          @success="gatherScanImageSuccess"
      ></gather-scan-image>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb';
  import MarketingSceneService from '@/api/MarketingSceneService';
  import AreaService from '@/api/AreaService';
  import ConditionGifts from '@/components/ConditionGifts/index';
  import DynamicForm from '@/components/DynamicForm/index';
  import GatherImage from '@/components/GatherImage/index';
  import GatherScanImage from '@/components/GatherScanImage/index';
  import DynamicFormForArchive from '@/components/DynamicFormForArchive/index';
  import AreaSelect from '@/components/AreaSelect/index';
  import TimeUtils from '@/utils/TimeUtil';
  import ConfigUtil from '@/utils/ConfigUtil';
  import CouponSimpleSelect from '@/components/CouponSelect/simpleSelect';
  import DynamicFormTable from '@/components/DynamicFormTable/index';
  import DynamicFormService from '../../api/DynamicFormService';
  import UserService from '../../api/UserService';
  import GatherService from '@/api/GatherService';
  import UploadService from '@/api/UploadService';
  import PrintService from '../../api/PrintService';
  import LodopPrinterService from '../../api/LodopPrinterService';
  import GroupService from '@/api/GroupService';
  import render from '@/printer_t/print_1.art';
  import render2 from '@/printer_t/print_2.art';
  import cacheCookies from '@/utils/auth';
  import AreaUtil from '../../utils/AreaUtil';

  export default {
    data() {
      var validateIdNo = (rule, value, callback) => {
        //自定义有效时间的验证
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

      var validateArea = (rule, value, callback) => {
        //自定义有效时间的验证
        var area = this.$refs.address.getArea();
        this.model.address = area.address;
        this.model.areaId = area.areaId;
        this.model.townId = area.townId;
        this.model.villageId = area.villageId;

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

      var validateDate = (rule, value, callback) => {
        //自定义有效时间的验证
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
        defaultIconUrl:
            'https://splatformnew.oss-cn-shanghai.aliyuncs.com/junren/archive-default-icon.png',
        model: {
          id: this.$route.query.id,
          archiveType: this.$route.query.archiveType,
          attachmentUrl: '',
        },
        attachments: [],
        previewDialogShow: false,
        dialogImageUrl: '',
        currentEditIndex: -1,
        nations: [
          {name: '汉族', value: '汉族'},
          {name: '蒙古族', value: '蒙古族'},
          {name: '回族', value: '回族'},
          {name: '藏族', value: '藏族'},
          {name: '维吾尔族', value: '维吾尔族'},
          {name: '苗族', value: '苗族'},
          {name: '彝族', value: '彝族'},
          {name: '壮族', value: '壮族'},
          {name: '布依族', value: '布依族'},
          {name: '朝鲜族', value: '朝鲜族'},
          {name: '满族', value: '满族'},
          {name: '侗族', value: '侗族'},
          {name: '瑶族', value: '瑶族'},
          {name: '白族', value: '白族'},
          {name: '土家族', value: '土家族'},
          {name: '哈尼族', value: '哈尼族'},
          {name: '哈萨克族', value: '哈萨克族'},
          {name: '傣族', value: '傣族'},
          {name: '黎族', value: '黎族'},
          {name: '傈僳族', value: '傈僳族'},
          {name: '佤族', value: '佤族'},
          {name: '畲族', value: '畲族'},
          {name: '拉祜族', value: '拉祜族'},
          {name: '水族', value: '水族'},
          {name: '东乡族', value: '东乡族'},
          {name: '纳西族', value: '纳西族'},
          {name: '景颇族', value: '景颇族'},
          {name: '柯尔克孜族', value: '柯尔克孜族'},
          {name: '土族', value: '土族'},
          {name: '达斡尔族', value: '达斡尔族'},
          {name: '仫佬族', value: '仫佬族'},
          {name: '羌族', value: '羌族'},
          {name: '布朗族', value: '布朗族'},
          {name: '撒拉族', value: '撒拉族'},
          {name: '毛南族', value: '毛南族'},
          {name: '仡佬族', value: '仡佬族'},
          {name: '锡伯族', value: '锡伯族'},
          {name: '阿昌族', value: '阿昌族'},
          {name: '普米族', value: '普米族'},
          {name: '塔吉克族', value: '塔吉克族'},
          {name: '怒族', value: '怒族'},
          {name: '乌兹别克族', value: '乌兹别克族'},
          {name: '俄罗斯族', value: '俄罗斯族'},
          {name: '鄂温克族', value: '鄂温克族'},
          {name: '德昂族', value: '德昂族'},
          {name: '保安族', value: '保安族'},
          {name: '裕固族', value: '裕固族'},
          {name: '京族', value: '京族'},
          {name: '塔塔尔族', value: '塔塔尔族'},
          {name: '独龙族', value: '独龙族'},
          {name: '鄂伦春族', value: '鄂伦春族'},
          {name: '赫哲族', value: '赫哲族'},
          {name: '门巴族', value: '门巴族'},
          {name: '珞巴族', value: '珞巴族'},
          {name: '基诺族', value: '基诺族'},
          {name: '高山族', value: '高山族'},
        ],
        educations: [
          {name: '小学', value: '小学'},
          {name: '初中', value: '初中'},
          {name: '高中', value: '高中'},
          {name: '专科', value: '专科'},
          {name: '本科', value: '本科'},
          {name: '研究生', value: '研究生'},
          {name: '博士', value: '博士'},
          {name: '博士后', value: '博士后'},
        ],
        politicalIdentitys: [
          {name: '中共党员', value: '中共党员'},
          {name: '中共预备党员', value: '中共预备党员'},
          {name: '共青团员', value: '共青团员'},
          {name: '群众', value: '群众'},
          {name: '民盟盟员', value: '民盟盟员'},
          {name: '民建会员', value: '民建会员'},
        ],
        dyforms: [],
        uploadServiceUrl:
            process.env.BASE_API +
            '/file_uploadImg.do?key=system.image.processor.1xxl',
        uploadUrl:
            process.env.BASE_API +
            '/file_uploadImg.do?key=system.image.processor.1xxl',
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'change'},
            {
              min: 1,
              max: 100,
              message: '长度在 1 到 100 个字',
              trigger: 'change',
            },
          ],
          sex: [{required: true, message: '请选择性别', trigger: 'change'}],
          maritalStatus: [
            {required: true, message: '请选择婚姻状态', trigger: 'change'},
          ],
          birthDay: [
//            {required: true, message: '请选择出生日期', trigger: 'change'},
          ],
          nation: [{required: true, message: '请选择民族', trigger: 'change'}],
          education: [
            {required: true, message: '请选择学历', trigger: 'change'},
          ],
          politicalIdentity: [
            {required: true, message: '请选择政治面貌', trigger: 'change'},
          ],
          address: [
//              {required: true, validator: validateArea, trigger: 'blur'}
              ],
          idNo: [
            {required: true, message: '请填写身份证号码', trigger: 'change'},
            {pattern: '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)', message: '请填写正确格式的身份证号码', trigger: 'change'},
          ],
//          phone: [{pattern: '^((13[0-9])|(17[0-1,6-8])|(15[^4,\\\\D])|(18[0-9]))\\d{8}$', message: '请填写正确格式的电话号码', trigger: 'change'}],
          phone: [{pattern: '(^([0-9]{3,4}-)?[0-9]{7,8}$)|(^((\\(\\d{3}\\))|(\\d{3}\\-))?(1[3456789]\\d{9})$)', message: '请填写正确格式的电话号码', trigger: 'change'}],

        },
        doAUing: false,
        pformId: '',
        pmoduleId: '',
        isDetail: this.$route.query.detail == 'detail',
        marketingScene: {},
        pickerOptions: {
          disabledDate: function(time) {
            return (time.getTime() + 24 * 3600 * 1000) > Date.now();
          },
        },
        title: '档案',
      };
    },
    components: {
      DynamicFormTable,
      Breadcrumb,
      ConditionGifts,
      DynamicForm,
      CouponSimpleSelect,
      AreaSelect,
      DynamicFormForArchive,
      GatherImage,
      GatherScanImage,
    },
    async created() {
      var that = this;

      var archiveType = +this.$route.query.archiveType;

      switch (archiveType) {
        case 1:
          that.pformId = '1180808151591427015159272c210011';
          that.pmoduleId = 'archive';
          this.title = '退伍军人档案';
          break;
        case 2:
          that.pformId = 'ff80808151591427015159272c210023';
          that.pmoduleId = 'militia-achive';
          this.title = '民兵档案';
          break;
        case 3:
          that.pformId = 'ff80808151591427015159272c210024';
          that.pmoduleId = 'precollect-achive';
          this.title = '预征兵役档案';
          break;
        case 4:
          that.pformId = 'ff80808151591427015159272c210025';
          that.pmoduleId = 'pecializedfield-achive';
          this.title = '地专对口档案';
          break;
        case 5:
          that.pformId = 'ff80808151591427015159272c210037';
          that.pmoduleId = 'conscription-achive';
          that.title = '现役档案';
          break;
      }

      var id = this.$route.query.id;
      if (id) {
        this.model = await UserService.doGetUserById(id);
        if (this.model.imageUrl) {
//          this.model.showIconUrl ='https://splatformnew.oss-cn-shanghai.aliyuncs.com/file/c5e9c05f17a711eb9f488995efc0d6e9.jpg@!1xx_l';
          this.model.showIconUrl = this.model.imageUrl.middleImg;
        }
        if (!this.model.showIconUrl) {
          this.model.showIconUrl = this.defaultIconUrl;
        }
        this.attachments = [];
        if (this.model.attachmentShowUrl) {
          this.model.attachmentShowUrl.split(',').forEach(function(item, index) {
            var attachment = {};
            attachment.url = item;
            attachment.relativeUrl = that.model.attachmentUrl.split(',')[index];
            that.attachments.push(attachment);
          });
        }
      } else {
        this.model.showIconUrl = this.defaultIconUrl;
      }
      console.log('archiveType-------:', that.pformId);

      this.doSearch();
      GatherService.startMain();
    },
    beforeDestroy() {
      console.log("beforeDestroy.....");
      GatherService.stopMain();
    },
    methods: {
      async doSearch() {
        var dyformsRes = await DynamicFormService.doSearch(this.pformId);
        if (dyformsRes.status) {
          this.dyforms = dyformsRes.data;
        }
      },
      handleClick() {
      },
      handleAvatarSuccess(res, file) {
        //图片上传成功的回调
        //        this.marketingScene.headRelURL = res.absolute;
        this.marketingScene.imageUrl = res.absolute;
        this.defaultIconUrl = res.absolute;
        this.model.showIconUrl = this.defaultIconUrl;
        this.model.iconUrl = res.relative;
        this.$forceUpdate();
      },
      handlePrizeImgSuccess(res, file) {
        for (var index in this.marketingScene.conditions) {
          if (index == this.prizeIndex) {
            this.marketingScene.conditions[index].imageUrl = res.absolute;
            break;
          }
        }
      },
      beforeAvatarUpload(file) {
        //上传图片之前的限制
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
      async doAU() {
        this.doAUing = true;
        var that = this;
        var user = null;
        var area = this.$refs.address.getArea();
        this.model.address = area.address;
        this.model.areaId = area.areaId;
        this.model.townId = area.townId;
        this.model.villageId = area.villageId;

        this.$refs.modelForm.validate(valid => {
          if (!valid) {
            that.$message({
              showClose: true,
              message: '请检查基本信息表单',
              type: 'warning',
            });
            that.doAUing = false;
            return;
          }
          this.$refs.detailForm.checkForm(async function(detailValid) {
            if (!detailValid) {
              that.$message({
                showClose: true,
                message: '请检查详细信息表单',
                type: 'warning',
              });
              that.doAUing = false;
              return;
            }
            if (that.model.id) {
              that.model.archiveType = ConfigUtil.getAppendArchiveType(that.model.archiveType, that.$route.query.archiveType);
              user = await UserService.doUpdateContactsInfo(that.model);
            } else {
              user = await UserService.doAddOutUser(that.model);
            }
            that.model.id = user.id;
            that.$refs.detailForm.doAUDynamicFormItemValueRelations(
                that.model.id,
            );
          });
        });
      },
      resetForm(formName) {
        //重置验证
        this.$refs[formName].resetFields();
      },
      goAnchor(selector) {
        console.log(selector);
        var anchor = this.$el.querySelector(selector);
        console.log(anchor);
        document.body.scrollTop = anchor.offsetTop; // chrome
        document.documentElement.scrollTop = anchor.offsetTop; // firefox
      },
      handleClick(tab, event) {
        var that = this;
        switch (tab.index) {
          case '0':
            that.goAnchor('#base');
            break;
          case '1':
            that.goAnchor('#archive');
            break;
          default:
            that.goAnchor('#' + that.dyforms[+tab.index - 2].moduleId);
            break;
        }
      },
      async idNoSearch(idNo) {
        if (idNo && idNo.length == 18) {

          //分析性别

          var searchRes = await UserService.doPage(
              {idNo: idNo, groupBatchNumber: ConfigUtil.getTradingAreaId()},
              1,
              1,
          );
          if (searchRes.data.length > 0) {
            this.model = searchRes.data[0];
            if (this.model.imageUrl) {
              this.model.showIconUrl = this.model.imageUrl.middleImg;
            }
            if (!this.model.showIconUrl) {
              this.model.showIconUrl = this.defaultIconUrl;
            }
            this.doSearch();
          }
        }
      },
      toGather() {
        this.$refs.gatherImage.doOpen();
      },
      toScanGather() {
        this.$refs.gatherScanImage.doShow();
      },
      async idNoFocus() {
        if (this.model.idNo) {
          return;
        }
        var res = await GatherService.doScanIdCard();
        console.log('idNoFocus', res);
        if (res.Certificate) {
          this.model.idNo = res.Certificate.IDNumber;

          if (this.model.idNo) {
            await this.idNoSearch(this.model.idNo);

            if (!this.model.id) {
              var model = {};
              model.idNo = this.model.idNo;
              model.achiveType = this.model.archiveType;
              model.name = res.Certificate.Name;
              model.nation = res.Certificate.Nation + '族';

              if (res.Certificate.Sex == '男') {
                model.sex = 1;
              } else {
                model.sex = 2;
              }

              var birthdayStr = res.Certificate.Birthday + '';
              birthdayStr =
                  birthdayStr.substr(0, 4) +
                  '-' +
                  birthdayStr.substr(4, 2) +
                  '-' +
                  birthdayStr.substr(6);

              console.log("birthdayStr:"+birthdayStr);
              model.birthDay = new Date(birthdayStr).getTime();
              console.log('this.model', model);

              var uploadRes = await UploadService.doUploadBase64Img(
                  'data:image/jpeg;base64,' + res.Certificate.Base64Photo,
              );
              model.iconUrl = uploadRes.relative;
              model.showIconUrl = uploadRes.absolute;

              var reg = /.+?(省|市|自治区|自治州|县|区)/g;
              var area = res.Certificate.Address.match(reg);
              if (area[1]) {
                var areaRes = await AreaService.doSearchAreaIdByName(area[1]);
                model.areaId = areaRes.id;
              }
              console.log('area', area);

              this.model = model;
            } else {
              if (!this.model.iconUrl) {
                var res = await UploadService.doUploadBase64Img(
                    'data:image/jpeg;base64,' + res.Certificate.Base64Photo,
                );
                this.model.iconUrl = res.relative;
                this.model.showIconUrl = res.absolute;
              }
            }

            //this.$forceUpdate();
          }
          console.log(this.model);
        }
      },
      gatherUserIconSuccess(res) {
        this.model.iconUrl = res.relative;
        this.model.showIconUrl = res.absolute;
        this.$forceUpdate();
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
      delIconUrl() {
        this.model.showIconUrl = this.defaultIconUrl;
        this.$forceUpdate();
      },

      /**
       * 进入打印
       * @param command
       * @return {Promise<void>}
       */
      async toPrint(command) {
        var that = this;

//        基本信息
        var printData = JSON.parse(JSON.stringify(this.model));
        var printData2 = JSON.parse(JSON.stringify(this.model));
//          详细信息
        var detailPrintData = await that.$refs.detailForm.genPrintData();
        if (detailPrintData) detailPrintData.nowPoliceStation = detailPrintData.nowPoliceStation || '';
        printData.detail = detailPrintData || {};
        printData2.detail = detailPrintData || {};

        printData2.dynInfos = [];
        printData2.printTitle = this.$store.state.tagId;

//        动态表单信息
        this.dyforms.forEach(function(dyform, index) {
          var coms = that.$refs[dyform.id];
          var com = null;
          if (Array.isArray(coms)) {
            com = coms[0];
          } else {
            com = coms;
          }
          var key = dyform.moduleId.replace(/-/g, '_');
          var lstype = 'table';

          if (key == 'archive_politics_careful_opinion') {
            lstype = 'input';
          }
          let gendata = com.genPrintData();

          printData2['dynInfos'].push({label: com.dyform.title, lstype: lstype, ...gendata});
          printData[key] = gendata;
          //单位和职务获取主要经历的最后一条数据
          if (key == 'archive_main_experience' && gendata.data.length > 0) {
            let arr = gendata.data || [];
            printData.unitjob = printData2.unitjob = arr[arr.length - 1].schoolInstitution || '' + ' ' + arr[arr.length - 1].professionOccupation || '';
          }
        });
//        console.log('detailPrintData:', printData);
//        console.log('新printData:', JSON.stringify(printData2));

        that.formatDYInfo(printData2);
        // 即时组装数据
        printData.sealList = [
          '',
          '',
          'http://www.lodop.net/demolist/PrintSample37.png',
        ];

        printData2.sealList = [
          '',
          '',
          'http://www.lodop.net/demolist/PrintSample37.png',
        ];
        printData.birthDay =printData.birthDay? TimeUtils.formatTime(printData.birthDay, 'Y年M月D日'):'';
        printData.printDate = TimeUtils.formatTime(Date.now(), 'Y年M月D日');
        printData2.birthDay = printData2.birthDay?TimeUtils.formatTime(printData2.birthDay, 'Y年M月D日'):'';
        printData2.printDate = TimeUtils.formatTime(Date.now(), 'Y年M月D日');
        printData2.title = that.title;
        printData2.address = AreaUtil.getRegisterLabel(this.model.areaId) + ' ' + printData2.address;
        printData.address = AreaUtil.getRegisterLabel(this.model.areaId) + ' ' + printData.address;
        const groupId = cacheCookies.getGroupId();
        var groupRes = await GroupService.doGetOneGroupById(groupId);
        console.log('企业名称：', groupRes);

        if (command == 'archive') { //档案打印
          let loading = null;
//          console.log(render2(printData2));
//          loading.close();
          //调用打印Service
          LodopPrinterService.setOptions({
            title: '档案打印',
            html: render2(printData2),
            watermark: (groupRes && groupRes.data) ? groupRes.data.name : '',
            barcode: printData2.idNo || '',
            popleyer: () => {
              loading = that.$loading({
                lock: false,
                text: '正在打印......',
                customClass: 'printer-loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
              });
            },
            callback: (type, msg) => {
              loading.close();
              this.$message({
                message: msg || '暂无消息',
                type: type || 'success',
              });
            },
          });
          LodopPrinterService.print();

//          PrintService.setOptions({
//            waterMark: (groupRes && groupRes.data) ? groupRes.data.name : '',
//            callback: (type, msg) => {
//              loading.close();
//              this.$message({
//                message: msg,
//                type: type,
//              });
//            },
//            barcode: printData2.idNo || '',
//          });
          //console.log('档案打印模板：', render2(printData2));
//          PrintService.printwait(render2(printData2));

        } else if (command == 'archive_review') {//政审打印
          let loading = null;
          //调用打印Service
          LodopPrinterService.setOptions({
            title: '政审打印',
            html: render(printData),
            watermark: (groupRes && groupRes.data) ? groupRes.data.name : '',
            barcode: printData.idNo || '',
            popleyer: () => {
              loading = that.$loading({
                lock: false,
                text: '正在打印......',
                customClass: 'printer-loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
              });
            },
            callback: (type, msg) => {
              loading.close();
              this.$message({
                message: msg || '暂无消息',
                type: type || 'success',
              });
            },
          });
          LodopPrinterService.print();

//          PrintService.setOptions({
//            waterMark: (groupRes && groupRes.data) ? groupRes.data.name : '',
//            callback: (type, msg) => {
//              loading.close();
//              this.$message({
//                message: msg,
//                type: type,
//              });
//            },
//            barcode: printData.idNo || '',
//          });
//          PrintService.printwait(render(printData));
        }
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

      /**
       * 打印时，需要把动态表单数据 格式化成需要的数据格式
       * @param printData
       */
      formatDYInfo(printData) {
        if (!printData) return;
        let dyinfos = printData.dynInfos || [];
        for (let index = 0; index < dyinfos.length; index++) {
          let item = dyinfos[index];
          if (item.label == '政审意见') {
            item['options'] = this.formatOption(item);
          }
        }
      },

       formatOption(option) {
        let result = null, data = option.data[0]||{}, rows = option.rows;
        result = [];
        for (let index = 0; index < rows.length; index++) {
          let row = rows[index];
          if (index % 2 == 0) {
            result.push({key: row.dfkey, label: row.label, value: data[row.dfkey]||''});
          } else {
            result[result.length - 1]['date'] = data[row.dfkey]?TimeUtils.formatTime(new Date(data[row.dfkey]), 'Y年M月D日'):'__年__月__日';
          }
        }
        return result;
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
    background-color: #f8f8f8;
    border: 1px solid #d7d7d7;
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

  .coupon > span,
  .coupon > .spec,
  .coupon > .name {
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
    border: 1px solid #409eff;
    border-bottom: none;
    padding: 10px 5px;
  }

  .detail-info-mousein {
    border: 1px solid #409eff;
    border-top: none;
    padding: 10px 5px;
  }
</style>
<style>
  .printer-loading .el-loading-spinner {
    /*这个是自己想设置的 gif 加载动图*/
    background-image: url('../../assets/img/print-loading.gif');
    background-color: #b3e2f6;
    background-repeat: no-repeat;
    background-size: 300px 180px;
    height: 350px;
    padding: 25px;
    width: 560px;
    left: 50%;
    margin-left: -280px;
    background-position: center;
    /*覆盖 element-ui  默认的 50%    因为此处设置了height:100%,所以不设置的话，会只显示一半，因为被top顶下去了*/
    top: 30%;
  }

  .printer-loading .el-loading-spinner .el-icon-loading {
    /*隐藏 之前  element-ui  默认的 loading 动画*/
    display: none;
  }

  .printer-loading .el-loading-spinner .el-loading-text {
    /*为了使得文字在loading图下面*/
    /*margin:-100px 0px;*/
    color: #FFFFFF;
    font-size: 32px;
    font-weight: bold;
  }
</style>
