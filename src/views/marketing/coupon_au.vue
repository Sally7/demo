<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <div class="card-edit-box">
        <div class="card_preview_area" :class="{fixed:isFixed}" :style="{backgroundColor: bgColor.label}">
          <div class="card_body">
            <p class="msg_title">优惠券</p>
            <div class="msg_card_section shop disabled">
              <div class="shop_panel">
                <div class="logo_area">
                  <span class="logo">
                    <img :src="groupInfo.showUrl">
                  </span>
                  <p>{{groupInfo.name}}</p>
                </div>
                <div class="msg_area">
                  <div class="tick_msg">
                    <p class="card_name">{{couponParam.name}}</p>
                    <span class="btn btn_use_card" :style="{backgroundColor: bgColor.label}">使用</span>
                  </div>
                </div>
              </div>
              <div class="card_usage">
                <ul>
                  <li>
                    <span class="usage_label">可用时间：</span>
                    <span>永久</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="msg_card_cell msg_img_text" v-if="couponParam.coverSummaryUrl">
              <ul class="list">
                <li class="msg_card_section">
                  <div class="li_panel">
                    <div class="li_content">
                      <div class="section_card_intro">
                        <div class="cover_wrap"><img :src="couponParam.coverSummaryUrl"></div>
                        <div class="cover_summary">
                          <span class="ic ic_go"></span>
                          <span>{{couponParam.coverSummary}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="msg_card_cell shop_detail last_cell">
              <ul class="list">
                <li class="msg_card_section">
                  <div class="li_panel" href="">
                    <div class="li_content">
                      <p>适用门店</p>
                    </div>
                    <span class="ic ic_go"></span>
                  </div>
                </li>
                <li class="msg_card_section last_li">
                  <div class="li_panel" href="">
                    <div class="li_content">
                      <p>公众号</p>
                    </div>
                    <span class="ic ic_go"></span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="msg_card_cell custom_detail">
              <ul class="list">
                <li class="msg_card_section last_li" v-for="entrance in couponParam.customEntryList">
                  <div class="li_panel">
                    <div class="li_content">
                      <p>
                        <span class="supply_area">
                          <span>{{entrance.customUrlSubTitle}}</span>
                          <span class="ic ic_go"></span>
                        </span>
                        <span>{{entrance.customUrlName}}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="media_edit">
          <div class="media_edit_area">
            <div class="portable_editor to_left appmsg_editor">
              <div class="inner">
                <el-form label-position="left" :model="couponParam" :rules="rules" ref="couponParam" label-width="110px">
                  <div class="editor_section">
                    <h3 class="title">基本信息</h3>
                    <!-- 商户只有在报销券时显示 -->
                    <el-form-item label="商户">
                      <div class="user-info">
                        <div class="brand_item">
                          <div class="brand_img">
                            <img :src="groupInfo.showUrl">
                          </div>
                          <span class="brand_name">{{groupInfo.name}}</span>
                        </div>
                        <p class="frm_tips">如商户信息有变更，请在<a href="">卡券商户资料</a>更新。</p>
                      </div>
                    </el-form-item>
                    <el-form-item label="卡券颜色" prop="color">
                      <el-select @change="getCouponColor(bgColor)" v-model="bgColor" placeholder="请选择">
                        <el-option
                          v-for="item in colorList"
                          :key="item.value"
                          :label="item.label"
                          :value="item">
                          <div class="color-box" :style="{backgroundColor: item.label}"></div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="优惠券标题" prop="name">
                      <el-input v-model="couponParam.name"></el-input>
                    </el-form-item>
                    <!-- 代金券时显示 -->
                    <el-form-item label="面额" v-if="couponParam.couponType==1 || couponParam.couponType==8" prop="reducePrice">
                      <el-input type="number" v-model="couponParam.reducePrice"></el-input>
                    </el-form-item>
                    <el-form-item label="满元使用" v-if="couponParam.couponType==1" prop="meetPrice">
                      <el-input type="number" v-model="couponParam.meetPrice"></el-input>
                    </el-form-item>
                    <!-- 计次券时显示 -->
                    <el-form-item label="总次数" v-if="couponParam.couponType==3" prop="useCount">
                      <el-input type="number" v-model="couponParam.useCount"></el-input>
                    </el-form-item>
                    <el-form-item label="周期使用限制" v-if="couponParam.couponType==3">
                      <el-row style="display: flex">
                        <el-form-item>
                          <el-input type="number" class="width-s" v-model="couponParam.cycleCount"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-select v-model="couponParam.cycleType" placeholder="请选择">
                            <el-option
                                    v-for="item in [{value:1,label:'年'},{value:2,label:'月'},{value:3,label:'日'}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <label style="margin-left: 20px;margin-right: 20px;white-space: nowrap">使用</label>
                        <el-form-item prop="cycleTimes">
                          <el-input type="number" class="width-s" v-model="couponParam.cycleTimes"></el-input>
                        </el-form-item>
                        <label>次</label>
                      </el-row>
                    </el-form-item>
                    <!-- 折扣券时显示 -->
                    <el-form-item label="折扣" v-if="couponParam.couponType==5" prop="discount">
                      <el-input type="number" placeholder="请输入折扣数，如5.5" v-model="couponParam.discount"></el-input>
                    </el-form-item>
                    <!-- 分发方式:非报销券时显示 -->
                    <el-form-item label="分发方式" v-if="couponParam.couponType!=8" prop="grantType">
                      <el-select v-model="couponParam.grantType" @change="reset(couponParam.grantType)" placeholder="请选择分发方式">
                        <el-option v-for="gtype in grantTypes" :key="gtype.value" :value="gtype.value" :label="gtype.label"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- 分发方式为用户领取时显示 -->
                    <el-form-item label="开始领取时间" v-if="couponParam.grantType==2" prop="drawStartDate">
                      <el-date-picker
                        v-model="couponParam.drawStartDate"
                        type="date"
                        placeholder="请选择开始领取时间"
                        value-format="timestamp">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否是微信卡券">
                      <el-radio-group v-model="couponParam.isWeChatCoupon">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结束领取时间" v-if="couponParam.grantType==2" prop="drawEndDate">
                      <el-date-picker
                        v-model="couponParam.drawEndDate"
                        type="date"
                        placeholder="请选择结束领取时间"
                        value-format="timestamp">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="限领张数" v-if="couponParam.couponType!=8" prop="drawCount">
                      <el-input type="number" v-model="couponParam.drawCount"></el-input>
                    </el-form-item>
                    <el-form-item label="有效时间" prop="">
                      <el-row v-if="couponParam.couponType==8">
                        <el-col>
                          <el-radio v-model="couponParam.dateType" :label="3">永久</el-radio>
                        </el-col>
                      </el-row>
                      <el-row v-if="couponParam.couponType!=8">
                        <el-col>
                          <el-radio v-model="couponParam.dateType" :label="1" :disabled="dateTypeAble==2">固定日期</el-radio>
                          <el-date-picker
                            v-model="pairStartDate1"
                            placeholder="选择日期"
                            value-format="timestamp">
                          </el-date-picker>至
                          <el-date-picker
                            v-model="pairEndDate1"
                            placeholder="选择日期"
                            value-format="timestamp">
                          </el-date-picker>
                        </el-col>
                      </el-row>
                      <el-row class="mt10" v-if="couponParam.couponType!=8">
                        <el-col>
                          <el-radio v-model="couponParam.dateType" :label="2" :disabled="dateTypeAble==1">
                            领取后，
                            <el-input class="width-s" type="number" v-model="pairStartDate2"></el-input>天生效，有效天数
                            <el-input class="width-s" type="number" v-model="pairEndDate2"></el-input>天
                          </el-radio>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>
                  <div class="editor_section">
                    <h3 class="title">优惠详情</h3>
                    <el-row>
                      <el-col :span="14">
                        <el-form-item label="封面图片" prop="coverSummaryUrl">
                          <p class="upload_tips">只能上传jpg/png文件,且不超过5M,建议尺寸:750*260px</p>
                          <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="couponParam.coverSummaryUrl" :src="couponParam.coverSummaryUrl" class="cover-img">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10" class="pl10">
                        <div class="demo-box">
                          <p>示例<br>建议图片进行适当设计，图上辅之以营销文案，来吸引消费者。</p>
                          <img class="demo-image" title="点击查看大图" src="~@/assets/backend/coupon_cover.jpg" @click="coverImgVisible = true">
                          <p class="case-help">(点击图片可查看大图)</p>
                        </div>
                        <!-- 大图显示 -->
                        <el-dialog :visible.sync="coverImgVisible">
                          <img width="100%" src="~@/assets/backend/coupon_cover.jpg" alt="">
                        </el-dialog>
                      </el-col>
                    </el-row>
                    <el-form-item label="封面简介" prop="coverSummary">
                      <el-input placeholder="请输入封面图片的简介内容" v-model="couponParam.coverSummary"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠说明" prop="couponDesc">
                      <el-input type="textarea" :rows="4" placeholder="请输入自定义优惠说明内容" v-model="couponParam.couponDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="使用须知" prop="useKnow">
                      <el-input type="textarea" :rows="4" placeholder="请填写使用本券的注意事项" v-model="couponParam.useKnow"></el-input>
                    </el-form-item>
                    <el-row>
                      <el-col :span="14" class="pl10">
                        <el-form-item label="图文介绍">
                          <p class="upload_tips">图片建议尺寸：850像素*350像素，大小不超过2M。</p>
                          <div class="card_article_box">
                            <!-- 图文repeat start -->
                            <div class="ca_preview" v-for="(item,index) in couponParam.couponTextImageList">
                              <img :src="item.couponImageUrl">
                              <div class="ca_preview_txt">{{item.couponText}}</div>
                              <div class="card_article_toolbar">
                                <el-col :span="6">
                                  <span @click="doMoveUp(index)"><i class="el-icon-caret-top"></i></span>
                                </el-col>
                                <el-col :span="6">
                                  <span @click="doMoveDown(index)"><i class="el-icon-caret-bottom"></i></span>
                                </el-col>
                                <el-col :span="6">
                                  <span @click="doCopy(index)"><i class="el-icon-edit"></i></span>
                                </el-col>
                                <el-col :span="6">
                                  <span @click="doDelete(index)"><i class="el-icon-delete"></i></span>
                                </el-col>
                              </div>
                            </div>
                            <!-- 图文repeat end -->
                            <div v-if="isAddTextImage">
                              <div>
                                <div class="card_article_img">
                                    <el-upload
                                      class="img-uploader"
                                      :action="uploadUrl"
                                      :show-file-list="false"
                                      :on-success="handleImageSuccess"
                                      :before-upload="beforeAvatarUpload">
                                      <img v-if="textImageItem.couponImageUrl" :src="textImageItem.couponImageUrl" class="text-img">
                                      <i v-else class="el-icon-picture avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                                <div class="card_article_description">
                                    <el-input type="textarea" v-model="textImageItem.couponText"></el-input>
                                </div>
                                <div class="card_article_opr">
                                    <el-button type="primary" size="mini" @click="doAddTextImage">确定</el-button>
                                    <el-button size="mini" @click="textImageBoxHide">取消</el-button>
                                </div>
                              </div>
                            </div>
                            <div class="card_article_add" :class="{editting:isAddTextImage}">
                              <span class="icon_article_add" @click="textImageBoxShow">
                                <a class="icon42_common add_gray">
                                  <i class="el-icon-plus"></i>
                                </a>
                              </span>
                            </div>
                            <div class="el-form-item__error" v-if="isAddTextImage&&isEmpty">图片和描述都不能为空</div>
                          </div>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10" class="pl10">
                        <div class="demo-box">
                          <p>示例<br>建议图片进行适当设计，图上辅之以营销文案，来吸引消费者。</p>
                          <img class="demo-image" title="点击查看大图" src="~@/assets/backend/text_image.jpg" @click="textImageVisible = true">
                          <p class="case-help">(点击图片可查看大图)</p>
                        </div>
                        <!-- 大图显示 -->
                        <el-dialog :visible.sync="textImageVisible" width="25%">
                          <img width="100%" src="~@/assets/backend/text_image.jpg" alt="">
                        </el-dialog>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- 入口 -->
                  <div class="editor_section">
                    <h3 class="title">自定义入口<span class="title-tip"> (最多只能添加两个自定义入口)</span></h3>
                    <!-- 入口repeat开始：最多两个入口 -->
                    <div class="editor_section" v-for="(entrance,index) in couponParam.customEntryList">
                      <h3 class="title">{{"入口"+(index+1)}}<span class="del" @click="doDeleteEntrance(index)">删除</span></h3>
                      <el-form-item label="入口名称">
                        <el-input placeholder="请输入入口名称" v-model="entrance.customUrlName"></el-input>
                      </el-form-item>
                      <el-form-item label="引导语">
                        <el-input placeholder="请输入引导语" v-model="entrance.customUrlSubTitle"></el-input>
                      </el-form-item>
                      <el-form-item label="跳转链接">
                        <el-input placeholder="请输入跳转链接" v-model="entrance.customUrl"></el-input>
                      </el-form-item>
                      <el-form-item label="小程序名称">
                        <el-input placeholder="请输入小程序名称" v-model="entrance.customAppBrandUserName"></el-input>
                      </el-form-item>
                      <el-form-item label="小程序path">
                        <el-input placeholder="请输入小程序path" v-model="entrance.customAppBrandPass"></el-input>
                      </el-form-item>
                    </div>
                    <!-- 入口repeat结束 -->
                    <div class="tool_bar" :class="{border:couponParam.customEntryList.length>0}">
                      <el-button size="mini" type="primary" :disabled="couponParam.customEntryList.length>=2" @click="doAddEntrance">添加自定义入口</el-button>
                    </div>
                  </div>
                  <div class="editor_section">
                    <h3 class="title">设置</h3>
                    <el-form-item label="库存" prop="count">
                      <el-input type="number" v-model="couponParam.count"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <i class="arrow arrow_out"></i>
              <i class="arrow arrow_in"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="doCancel">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('couponParam')" :loading="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
  "use strict";
  import Breadcrumb from '@/components/Breadcrumb'
  import cacheCookies from '@/utils/auth'
  import ConfigUtil from '@/utils/ConfigUtil'
  //import TimeUtils from '@/utils/TimeUtil'
  import GroupService from '@/api/GroupService'
  import CouponService from '@/api/CouponService'
  import ElRow from "element-ui/packages/row/src/row";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    data() {
      return {
        coverImgVisible: false, //是否显示封面图片大图
        textImageVisible: false, //是否显示图文大图
        isFixed: false,
        groupRoleId: "2c933e6b62cd01560162cd2c8f570017", //报销平台店铺角色id（仅用于报销券）
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        couponParam: {
          tradingAreaId: "", //商圈id(只用于报销券)
          groupId: cacheCookies.getGroupId(),
          couponType: this.$route.query.couponType,
          coverSummaryUrl: '', //封面图片地址
          //以下为未在报销券表单中显示的必传字段
          dateType: 1, //日期类型：1 固定指定日期 2 领取后多少天  3 永久
          status: 0, //状态：正常状态0 到期结束-1 领光结束-3 人为终止-4 报销送5
          drawCount: '', //限领张数,报销券限领张数为最大值，即等于库存数
          grantType: 1, //分发方式： 1赠送 2领取 3预生成卡券号 4系统生成
          useCount: 1, //使用次数
          isStackCoupon: 0, //是否叠加
          customEntryList: [], //跳转入口
          couponTextImageList: [], //图文
          cycleCount:1, //周期数
          cycleType:1, //周期类型
          cycleTimes:1, //周期数
          isWeChatCoupon:1,

        },
        groupInfo: {
          showUrl: "",
          name: ""
        },
        grantTypes: [
          {label: '商户赠送', value: 1},
          {label: '用户领取', value: 2}
        ],
        pairStartDateTemp: "", //修改券时用于存放之前的有效时间
        pairEndDateTemp: "",
        pairStartDate1: "", //券开始生效时间
        pairEndDate1: "", //券失效时间
        pairStartDate2: "", //券开始生效时间
        pairEndDate2: "", //券失效时间
        jumpEntrance: {},
        isAddTextImage: false,
        isEmpty: false,
        textImageItem: {couponImageUrl: "", couponText: ""},
        rules: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { max: 18, message: '长度不超过9个汉字或18个英文字母', trigger: 'blur' }
          ],
          color: [
            { required: true, message: '颜色不能为空', trigger: 'blur' },
          ],
          reducePrice: [
            { required: true, message: '面额不能为空', trigger: 'blur' },
          ],
          meetPrice: [
            { required: true, message: '满多少元不能为空', trigger: 'blur' },
          ],
          useCount: [
            { required: true, message: '次数不能为空', trigger: 'blur' },
          ],
          discount: [
            { required: true, message: '折扣不能为空', trigger: 'blur' },
          ],
          drawStartDate: [
            { required: true, message: '开始领取时间不能为空', trigger: 'blur' },
          ],
          drawEndDate: [
            { required: true, message: '结束领取时间不能为空', trigger: 'blur' },
          ],
          drawCount: [
            { required: true, message: '限领张数不能为空', trigger: 'blur' },
          ],
          coverSummaryUrl: [
            { required: true, message: '封面图片不能为空', trigger: 'blur' },
          ],
          coverSummary: [
            { required: true, message: '封面简介不能为空', trigger: 'blur' },
            { max: 24, message: '长度不超过12个汉字或24个英文字母', trigger: 'blur' }
          ],
          couponDesc: [
            { required: true, message: '优惠说明不能为空', trigger: 'blur' },
          ],
          useKnow: [
            { required: true, message: '使用须知不能为空', trigger: 'blur' },
          ],
          count: [
            { required: true, message: '库存不能为空', trigger: 'blur' },
          ],
          cycleCount: [
            { required: true, message: '周期数不能为空', trigger: 'blur' },
          ],
          cycleType: [
            { required: true, message: '请选择周期类型', trigger: 'change' }
          ],
          cycleTimes: [
            { required: true, message: '周期次数不能为空', trigger: 'blur' },
          ],
          /*textImageItem: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ]*/
        },
        colorList: [
          { label: '#63b359', value: 'Color010' },
          { label: '#2c9f67', value: 'Color020' },
          { label: '#509fc9', value: 'Color030' },
          { label: '#5885cf', value: 'Color040' },
          { label: '#9062c0', value: 'Color050' },
          { label: '#d09a45', value: 'Color060' },
          { label: '#e4b138', value: 'Color070' },
          { label: '#ee903c', value: 'Color080' },
          { label: '#f08500', value: 'Color081' },
          { label: '#a9d92d', value: 'Color082' },
          { label: '#dd6549', value: 'Color090' },
          { label: '#cc463d', value: 'Color100' },
          { label: '#cf3e36', value: 'Color101' },
          { label: '#5E6671', value: 'Color102' }
        ],
        bgColor: '',
        dateTypeAble: 0,
        disabled: false
      }
    },
    components: {
      ElFormItem,
      ElRow,
      Breadcrumb
    },
    created(){
      this.init();
    },
    mounted(){
      window.addEventListener('scroll', this.styleChange);
    },
    methods: {
      async init(){
        if(this.$route.query.id) { //处理编辑逻辑
          this.couponParam = await CouponService.doGetCoupon(this.$route.query.id);
          //获取商户头像等信息
          if(this.couponParam.couponType == 8){ //如果是报销券则获取商圈
            this.doGetTradingAreaByGroupId(this.couponParam.groupId, this.groupRoleId);
          }else{ //如果是非报销券则获取店铺信息
            /* 时间处理 */
            if(this.couponParam.dateType == 1){
              this.dateTypeAble = 1;
              this.pairStartDate1 = this.couponParam.pairStartDate;
              this.pairEndDate1 = this.couponParam.pairEndDate;
              this.pairStartDateTemp = this.couponParam.pairStartDate;
              this.pairEndDateTemp = this.couponParam.pairEndDate;
            }else if(this.couponParam.dateType == 2){
              this.dateTypeAble = 2;
              this.pairStartDate2 = this.couponParam.pairStartDate;
              this.pairEndDate2 = this.couponParam.pairEndDate;
            }
            this.doGetOneGroup(this.couponParam.groupId);
          }
          //图文处理
          if(this.couponParam.couponTextImageList == null){
            this.couponParam.couponTextImageList = [];
          }
          //券颜色处理
          for(var i=0; i<this.colorList.length; i++){
            if(this.colorList[i].value === this.couponParam.color){
              this.bgColor = this.colorList[i];
              break;
            }
          }
        } else{ //新增券
          if(this.$route.query.couponType == 8) { //如果是新增报销券
            this.couponParam.dateType = 3; //日期类型设置为永久
            //获取所属商圈（平台）
            this.doGetTradingAreaByGroupId(this.couponParam.groupId, this.groupRoleId);
          }else{ //新增非报销券
            this.doGetOneGroup(this.couponParam.groupId);
          }
        }
      },
      //查询所属商圈(仅报销券时需要)
      async doGetTradingAreaByGroupId(groupId, groupRoleId){
        var response = await GroupService.doGetTradingAreaByGroupId({
          groupId: groupId,
          groupRoleId: groupRoleId
        });
        if(response.status == 1){
          if(this.couponParam.tradingAreaId == ""){
            this.couponParam.tradingAreaId = response.data.id;
          }
          this.groupInfo.showUrl = response.data.showUrl;
          this.groupInfo.name = response.data.name;
        }else{
          this.$message({
            message: '获取商圈信息失败',
            type: 'error'
          });
        }
      },
      //查询店铺信息
      async doGetOneGroup(groupId){
        var response = await GroupService.doGetOneGroup(groupId);
        if(response.status == 1){
          this.groupInfo.showUrl = response.data.showUrl;
          this.groupInfo.name = response.data.name;
        }else{
          this.$message({
            message: '获取店铺信息失败',
            type: 'error'
          });
        }
      },
      //分发方式切换到商户赠送时将领取时间置空
      reset(type){
        if(type === 1){
          this.couponParam.drawStartDate = "";
          this.couponParam.drawEndDate = "";
        }
      },
      styleChange(){ //滚动时左侧手机预览固定在顶部
        var scrollHeight = document.documentElement.scrollTop||document.body.scrollTop;
        //console.log(scrollHeight);
        if(scrollHeight >= 100){
          this.isFixed = true;
        }else{
          this.isFixed = false;
        }
      },
      handleAvatarSuccess(res, file) { //图片上传成功的回调
        //console.log(res);
        this.couponParam.coverSummaryUrl = res.absolute;
        //console.log(this.couponParam.coverSummaryUrl);
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
      handleImageSuccess(res, file) {
        this.textImageItem.couponImageUrl = res.absolute;
      },
      getCouponColor(colorObj){
        this.couponParam.color = colorObj.value;
      },
      //显示图文编辑box
      textImageBoxShow(){
        if(!this.isAddTextImage){
          this.isAddTextImage = true;
        }
      },
      //隐藏图文编辑box
      textImageBoxHide(){
        this.isAddTextImage = false;
        this.textImageItem = {couponImageUrl: "", couponText: ""};
        if(this.isEmpty){
          this.isEmpty = false;
        }
      },
      //上移
      doMoveUp(index){
        if(index == 0){
          return;
        }
        this.swapItems(this.couponParam.couponTextImageList, index, index-1);
      },
      //下移
      doMoveDown(index){
        if(index == this.couponParam.couponTextImageList.length-1){
          return;
        }
        this.swapItems(this.couponParam.couponTextImageList, index, index+1);
      },
      swapItems(arr, index1, index2){ //交换数组元素
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      },
      //复制图文
      doCopy(index){
        if(!this.isAddTextImage){
          this.isAddTextImage = true;
        }
        this.textImageItem.couponImageUrl = this.couponParam.couponTextImageList[index].couponImageUrl;
        this.textImageItem.couponText = this.couponParam.couponTextImageList[index].couponText;
      },
      //删除图文
      doDelete(index){
        this.couponParam.couponTextImageList.splice(index, 1);
      },
      //确定新增图文
      doAddTextImage(){
        this.textImageItem.couponText = this.textImageItem.couponText.replace(/(^\s*)|(\s*$)/g, ""); //去除首尾空格
        if(!this.textImageItem.couponImageUrl || this.textImageItem.couponText == ""){
          this.isEmpty = true;
          return;
        }
        this.couponParam.couponTextImageList.push(this.textImageItem);
        this.textImageItem = {couponImageUrl: "", couponText: ""};
        this.isAddTextImage = false;
        this.isEmpty = false;
      },
      //添加自定义入口
      doAddEntrance(){
        var entrance = {
          customUrlName: "", //入口名称
          customUrlSubTitle: "", //引导语右侧提示
          customUrl: "", //外链
          customAppBrandUserName: "", //公众号绑定的小程序
          customAppBrandPass: "" //小程序的path
        };
        this.couponParam.customEntryList.push(entrance);
      },
      //删除自定义入口
      doDeleteEntrance(index){
        this.couponParam.customEntryList.splice(index, 1);
      },
      //取消提交表单
      doCancel () {
        this.$router.back();
      },
      doAU(formName){
        var that = this;
        this.disabled = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //报销券处理
            if(that.couponParam.couponType == 8) {
              that.couponParam.drawCount = that.couponParam.count; //限领张数最大
              that.couponParam.promotionUrlName = that.couponParam.count;
            }else{//非报销券处理
              //时间处理
              if(that.couponParam.dateType == 1){ //日期类型为固定日期时
                if(that.pairStartDate1 == "" || that.pairEndDate1 == ""){
                  this.$message({
                    message: "有效时间不能为空",
                    type: 'error'
                  });
                  this.disabled = false;
                  return;
                }else if(that.pairStartDate1 > that.pairEndDate1){
                  this.$message({
                    message: "结束时间不能小于开始时间",
                    type: 'error'
                  });
                  this.disabled = false;
                  return;
                }
                if(this.$route.query.id){
                  if(that.pairStartDate1 > that.pairStartDateTemp){
                    this.$message({
                      message: "修改后的开始有效时间不能在原来的开始有效时间之后",
                      type: 'error'
                    });
                    this.disabled = false;
                    return;
                  }else if(that.pairEndDate1 < that.pairEndDateTemp){
                    this.$message({
                      message: "修改后的结束有效时间不能在原来的结束有效时间之前",
                      type: 'error'
                    });
                    this.disabled = false;
                    return;
                  }
                }
                that.couponParam.pairStartDate = that.pairStartDate1;
                that.couponParam.pairEndDate = that.pairEndDate1;
              }else{
                if(that.pairStartDate2.toString() == "" || that.pairEndDate2.toString() == ""){
                  this.$message({
                    message: "有效时间不能为空",
                    type: 'error'
                  });
                  this.disabled = false;
                  return;
                }
                that.couponParam.pairStartDate = that.pairStartDate2;
                that.couponParam.pairEndDate = that.pairEndDate2;
              }
            }
            //console.log(that.couponParam);
            that.doCouponAU();
          } else {
            //console.log('error submit!!');
            that.disabled = false;
            return false;
          }
        });
      },
      async doCouponAU() {
        //console.log(this.couponParam);
        var response, auType;
        if(this.couponParam.id){ //修改
          response = await CouponService.doUpdateCoupon(this.couponParam);
          auType = "修改";
        } else{ //添加
          response = await CouponService.doAddCoupon(this.couponParam);
          auType = "添加";
        }
        if (response.status === 1){
          this.$message({
            message: auType+'成功!',
            type: 'success'
          });
          this.$router.back();
          this.disabled = false;
        }else {
          this.$message.error(auType+'失败!');
          this.disabled = false;
        }
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
.pl10{
  padding-left: 10px;
}
.width-s{
  width: 120px;
}
.demo-image{
  max-width: 180px;
  cursor: zoom-in;
}
.case-help{
  text-align: center;
  color: #333;
}
.card-edit-box {
    padding-left: 328px;
    overflow: hidden;
    line-height: 1.6;
}
.card_preview_area {
    float: left;
    width: 318px;
    margin-right: 16px;
    padding-bottom: 150px;
    overflow: hidden;
    background: #f6f6f8 url(https://res.wx.qq.com/mpres/zh_CN/htmledition/comm_htmledition/images/pic/cardticket/topbar_white3a7b38.png) no-repeat center 5px;
}
.card_preview_area.fixed{
  position: fixed;
  top: 70px;
}
.card-edit-box .card_preview_area {
    margin-left: -328px;
    margin-right: 0;
}
.card_preview_area .card_body {
    margin: 64px 10px 10px;
}
.card_preview_area .msg_title {
    text-align: center;
    height: 62px;
    line-height: 85px;
    font-size: 11px;
    color: #fff;
    display: none;
}
.msg_card_section.shop {
    margin: 0;
    padding: 0;
    border-bottom: 1px dashed #e7e7eb;
    position: relative;
    background-color: #fff;
    border-radius: 5px 5px 0 0;
    -moz-border-radius: 5px 5px 0 0;
    -webkit-border-radius: 5px 5px 0 0;
}
.msg_card_section.shop .shop_panel {
    padding: 21px 12px 12px;
    min-height: 137px;
    height: auto;
    text-align: center;
    box-sizing: content-box;
}
.card_preview_area .logo_area {
    position: relative;
    margin-bottom: 7px;
    line-height: 42px;
    color: #8d8d8d;
    margin-top: -40px;
}
.card_preview_area .logo {
    display: block;
    width: 38px;
    height: 38px;
    padding-top: 0;
    margin: 0 auto;
    border-radius: 22px;
    -moz-border-radius: 22px;
    -webkit-border-radius: 22px;
    float: none;
    border: 1px solid #e7e7eb;
    background-color: #fff;
}
.card_preview_area .logo img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    -moz-border-radius: inherit;
    -webkit-border-radius: inherit;
}
.msg_card_section.shop .tick_msg {
    margin-bottom: 6px;
}
.msg_card_section.shop .tick_msg .card_name {
    font-weight: normal;
    font-size: 28px;
    word-break: break-word;
    word-wrap: break-word;
}
.btn {
    display: inline-block;
    overflow: visible;
    padding: 0 22px;
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    vertical-align: middle;
    text-align: center;
    text-decoration: none;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
}
.btn_use_card {
    border-width: 0;
    background-color: #f4f5f9;
}
.btn_use_card[style^="background"] {
    color: #fff;
}
.card_usage {
    text-align: left;
    padding: 0 10px 1em;
    background-color: #fff;
}
.card_usage li {
    overflow: hidden;
    padding-left: 5em;
    clear: both;
    color: #8d8d8d;
}
.card_usage .usage_label {
    float: left;
    margin-left: -5em;
    color: #222;
}
.card_preview_area .msg_card_cell {
    background-color: #fff;
}
.msg_card_cell.last_cell {
    border-radius: 0 0 5px 5px;
    -moz-border-radius: 0 0 5px 5px;
    -webkit-border-radius: 0 0 5px 5px;
}
.list {
    margin: 0 10px;
    border-bottom: 1px solid #e7e7eb;
}
.msg_card_cell.last_cell .list {
    border-bottom-width: 0;
}
.msg_card_section {
    position: relative;
}
.list li .li_panel {
    display: block;
    padding: 11px 30px 11px 0;
    border-bottom: 1px solid #e7e7eb;
}
.msg_card_cell.shop_detail .list li:last-child .li_panel {
    border-bottom-width: 0;
}
.msg_img_text .list .li_panel {
    padding: 11px 0 0;
}
.list li .li_panel .ic {
    position: absolute;
    top: 36%;
    right: 5px;
    width: 16px;
    height: 15px;
    background: url(https://res.wx.qq.com/mpres/zh_CN/htmledition/comm_htmledition/style/page/cardticket/card_control_z3af000.png) 0 -62px no-repeat;
}
.msg_img_text .list .li_panel .ic {
    top: 5px;
}
.section_card_intro {
    position: relative;
    width: 100%;
    height: auto;
    color: #8d8d8d;
    overflow: hidden;
    padding: 0;
    word-wrap: break-word;
    word-break: break-all;
    min-height: 24px;
}
.section_card_intro .cover_wrap {
    overflow: hidden;
    max-height: 116px;
    height: auto;
    padding-top: 5px;
}
.section_card_intro img {
    width: 100%;
}
.section_card_intro .cover_summary {
    height: 24px;
    background: #000;
    background: rgba(0,0,0,0.7);
    margin-top: 0;
    position: absolute;
    z-index: 9;
    left: 0;
    width: 100%;
    bottom: 0;
    color: #fff;
    text-indent: 1em;
}
.msg_card_cell.custom_detail {
    margin-top: 1em;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
}
.msg_img_text .list {
    overflow: hidden;
    border-bottom: 0;
}
.msg_card_cell.custom_detail .list {
    border-bottom-width: 0;
}
.msg_card_cell.custom_detail .list li:last-child .li_panel {
    border-bottom-width: 0;
}
.list li .supply_area {
    color: #8d8d8d;
    float: right;
}
/* 右侧编辑区域 */
.media_edit {
    float: left;
    overflow: hidden;
    width: 100%;
}
.media_edit .media_edit_area {
    margin-bottom: 2em;
    padding-left: 20px;
}
.portable_editor {
    position: relative;
}
.appmsg_editor .inner {
    padding: 20px;
    border: 1px solid #e7e7eb;
    background-color: #f4f5f9;
    min-height: 311px;
}
.editor_section {
    margin-bottom: 20px;
}
.editor_section h3.title {
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    border-bottom: 1px solid #e6e9eb;
    font-weight: normal;
    margin-bottom: 20px;
    position: relative;
}
.editor_section h3.title .title-tip{
  color: #999;
}
.editor_section h3.title .del{
  position: absolute;
  right: 0;
  color: #576b95;
  cursor: pointer;
}
.tool_bar{
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 20px 0 0;
}
.tool_bar.border{
  border-top: 1px solid #d9dadc;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
.brand_item .brand_img {
    display: inline-block;
    vertical-align: top;
}
.brand_item .brand_img img {
    margin-right: 1em;
    width: 80px;
    height: 80px;
}
.brand_item .brand_name {
    display: inline-block;
    vertical-align: top;
}
.user-info {
  line-height: 1.6;
}
.frm_tips {
    padding-top: 4px;
    width: auto;
    color: #8d8d8d;
}
.upload_tips {
    padding-top: 8px;
    padding-bottom: 6px;
    color: #8d8d8d;
    font-weight: 400;
    font-style: normal;
    line-height: 1.6;
}
.color-box {
  width: 32px;
  height: 32px;
}
.card_article_box {
    padding: 0 0 72px;
    position: relative;
    border: 1px solid #d9dadc;
    background-color: #fff;
}
.card_article_box .card_article_img {
    margin: 10px;
    padding: 0;
    text-align: center;
    position: relative;
    z-index: 0;
    min-height: 60px;
    background-color: #f4f5f9;
}
.card_article_img .avatar-uploader-icon {
    font-size: 38px;
}
.card_article_box .card_article_description {
    margin: 10px;
    position: relative;
}
.card_article_opr {
    text-align: right;
    margin: 10px;
}
.card_article_add {
    position: absolute;
    bottom: 0;
    padding: 10px;
    width: 100%;
    height: 72px;
    line-height: 48px;
    -ms-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    overflow: hidden;
}
.card_article_add.editting {
    background-color: #f3f3f3;
}
.card_article_add .icon_article_add {
    position: absolute;
    text-align: center;
    cursor: pointer;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    -ms-transition: top .5s;
    -webkit-transition: top .5s;
    transition: top .5s;
    border: 1px dashed #d9dadc;
}
.card_article_add.editting .icon_article_add {
    cursor: default;
}
.icon42_common {
    width: 42px;
    height: 42px;
    vertical-align: middle;
    display: inline-block;
    line-height: 42px;
    font-size: 42px;
    color: #8c939d;
    overflow: hidden;
}
.card_article_toolbar {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 32px;
  line-height: 32px;
  margin-left: -80px;
  margin-top: -16px;
  background-color: rgba(0,0,0,0.75);
}
.card_article_toolbar span {
  display: block;
  width: 32px;
  height: 32px;
  margin: 0 auto;
  cursor: pointer;
  color: rgba(255,255,255,.7);
  text-align: center;
  font-size: 16px;
}
.ca_preview {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 10px 0;
    position: relative;
}
.card_article_box .ca_preview {
    width: auto;
    padding: 10px;
}
.ca_preview img {
    width: 100%;
    display: block;
}
.ca_preview .ca_preview_txt {
    background-color: #f6f6f8;
    padding: 10px;
    max-height: 6em;
    height: auto;
    line-height: 1.6;
    overflow-y: auto;
}
.ca_preview:hover .card_article_toolbar {
  display: block;
}
.text-img {
  width: 100%;
}
.card_article_add.editting .icon_article_add, .card_article_add.editting .icon42_common {
    cursor: default;
}
.media_edit .el-input {
  max-width: 400px;
}
/* 左侧箭头 */
.appmsg_editor .arrow {
    position: absolute;
}
.appmsg_editor .arrow_out {
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 12px;
    border-style: dashed;
    border-color: transparent;
    border-left-width: 0;
    border-right-color: #e7e7eb;
    border-right-style: solid;
    top: 120px;
    left: -11px;
}
.appmsg_editor .arrow_in {
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 12px;
    border-style: dashed;
    border-color: transparent;
    border-left-width: 0;
    border-right-color: #f4f5f9;
    border-right-style: solid;
    top: 120px;
    left: -10px;
}
</style>
