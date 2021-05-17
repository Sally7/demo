<template>
  <div class="app-container">
    <div class="app-inner">
      <el-menu default-active="1" class="breadcrumb-container" mode="horizontal" active-text-color="#4494E7" @select="handleMenuSelect">
        <el-menu-item index="1">编辑内容</el-menu-item>
        <el-menu-item index="2">发送记录</el-menu-item>
      </el-menu>
      <div class="app__content">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="发送范围" labelWidth="80px" required>
            <el-radio label='0' v-model="sendRangRadio">全部粉丝</el-radio>
          </el-form-item>
          <el-form-item labelWidth="80px">
            <el-radio label='1' v-model="sendRangRadio">按条件筛选</el-radio>
          </el-form-item>
          <div v-if="sendRangRadio=='1'">
            <el-form-item class="noLabel-form-item">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="请选择性别">
                      <el-option
                        v-for="item in [{value:0,label:'全部'},{value:1,label:'男'},{value:2,label:'女'}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="客户阶段">
                    <el-select v-model="form.customerStage" placeholder="请选择客户类型">
                      <el-option
                        v-for="item in [{value:0,label:'潜在客户'},{value:1,label:'意向客户'},{value:2,label:'正式客户'},{value:3,label:'其他'}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="区域">
                    <el-cascader
                      expand-trigger="hover"
                      :options="form.areaOptions"
                      v-model="form.areaSelectedOptions"
                      @change="handleAreaCascaderChange">
                    </el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="noLabel-form-item">
              <el-row :gutter="20">
                <el-col :span="8"  v-if="false">
                  <el-form-item label="车等级">
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="车品牌">
                    <el-select
                      v-model="form.carBrandIds"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入车品牌的首字母"
                      :remote-method="remoteMethod">
                      <el-option
                        v-for="item in carOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="标签">
                    <el-select v-model="form.tag" multiple  placeholder="请选择标签">
                      <el-option
                        v-for="item in tagList"
                        :key="item.tagName"
                        :label="item.tagName"
                        :value="item.tagName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <el-form-item class="noLabel-form-item" style="width: 30%" prop="phone">
            <el-radio label="2" v-model="sendRangRadio">指定手机号</el-radio>
            <el-form-item><el-input
              placeholder="请输入手机号"
              type="textarea"
              v-model="form.phone"
              clearable
              v-if="sendRangRadio=='2'">
            </el-input></el-form-item>
          </el-form-item>
          <el-form-item class="noLabel-form-item" style="width: 30%" prop="userId">
            <el-radio label="3" v-model="sendRangRadio">指定用户ID</el-radio>
            <el-input
              placeholder="请输入用户ID"
              type="textarea"
              v-model="form.userId"
              clearable
              v-if="sendRangRadio=='3'">
            </el-input>
          </el-form-item>
          <el-form-item label="主题模板" labelWidth="80px" required>
            <el-radio label="27" v-model="form.templateType">活动通知</el-radio>
          </el-form-item>
          <el-form-item label="发送方式" labelWidth="80px" prop="sendingMode">
            <el-row :gutter="20">
              <el-col :span="4">
                <el-checkbox v-model="form.sendingMode[0].value">微信模板消息</el-checkbox>
                <p class="template_tip">仅支持认证服务号，不受48小时互动的限制。发送成功后，客户在公众号中收到下图所示的卡片消息</p>
                <div class="navbar">
                  <img class="navbar-img" src="~@/assets/backend/navbar.png"></img>
                </div>
                <div class="message-bg">
                  <div class="message-detail-bg">
                    <p class="message_title">
                      <span style="font-size: 110%;font-weight: bold;">活动通知</span><br />
                      <span style="color: #8d8d8d;">{{currentTime}}</span>
                    </p>
                    <p class="message-content">信息详情：报多多邀您一起参与"你养车我报销"活动</p>
                    <div class="line"></div>
                    <p>详情</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="4" :offset="5">
                <el-checkbox v-model="form.sendingMode[1].value">小程序模板消息</el-checkbox>
                <p class="template_tip">需要客户在小程序内完成过支付或有过点击行为。发送成功后，客户可在微信的服务通知中收到下图所示的卡片消息</p>
                <div class="navbar">
                  <img class="navbar-img" src="~@/assets/backend/navbar.png"></img>
                </div>
                <div class="message-bg">
                  <div class="message-detail-bg">
                    <div class="server-template">
                      <img :src="group.showUrl"  />
                      <span>{{group.name}}</span>
                    </div>
                    <div class="line"></div>
                    <p class="message_title">
                      <span style="font-size: 110%;font-weight: bold;">活动通知</span><br />
                      <span style="color: #8d8d8d;">{{currentTime}}</span>
                    </p>
                    <p class="message-content" style="padding-bottom: 50px;">信息详情：报多多邀您一起参与"你养车我报销"活动</p>
                    <div class="line"></div>
                    <p>进入小程序查看<span style="float: right">></span></p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="4" style="padding-top: 50px">
                <el-checkbox v-model="form.sendingMode[2].value">微信粉丝消息</el-checkbox>
                <p class="template_tip">仅支持认证订阅号和认证服务号，并且需要客户与公众号在48小时内有过互动(关注公众号;发送信息;点击自定义菜单等)。发送成功后，客户可在公众号中收到下图所示的文本消息</p>
                <img class="signalImg-template" src="~@/assets/backend/wechat_fans.png" />
              </el-col>
              <el-col :span="4" :offset="5" style="padding-top: 50px">
                <el-checkbox v-model="form.sendingMode[3].value">短信模板</el-checkbox>
                <img style="margin-top: 65px" class="signalImg-template" src="~@/assets/backend/message_ template.png" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="详情跳转" labelWidth="80px" style="width: 50%">
            <el-input
              placeholder="请输入详情跳转链接"
              v-model="form.linkUrl"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="信息详情" labelWidth="80px" style="width: 50%" prop="content">
            <el-input
              type="textarea"
              :rows="4"
              max="50"
              placeholder="请输入内容"
              v-model="form.content">
            </el-input>
          </el-form-item>
          <el-form-item label="发送时间" labelWidth="80px" prop="sendTime">
            <el-radio label="1" v-model="form.dateType">立即发送</el-radio>
            <el-row>
              <el-col :span="2"><el-radio label="2" v-model="form.dateType">定时发送</el-radio></el-col>
              <el-col :span="8">
                <el-date-picker type="datetime" :picker-options="pickerOptions" placeholder="选择日期" v-model="form.sendTime" @focus="tapDatePicker"></el-date-picker>
              </el-col>
            </el-row>
            <span class="send-tip">送达数以发送时刻可接收到消息的人数为准</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="doCancel('form')">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('form')">发送</el-button>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import CarService from '@/api/CarService'
  import GroupMessageService from '@/api/GroupMessageService'
  import GroupService from '@/api/GroupService'
  import TimeUtil from '@/utils/TimeUtil'
  import AreaList from '@/utils/AreaList'

  export default {
    data() {
      var phoneValidation = (rule, value, callback) => { //自定义有效时间的验证
        if(this.sendRangRadio =='2'){
          var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
          if (!myreg.test(value)) {
            callback('请输入正确的11位手机号');
          }else{
            callback();
          }
        }else{
          callback();
        }
      };
      var userIdValidation = (rule, value, callback) => { //
        if(this.sendRangRadio =='3'){
          if(value==''){
            callback('请输入userId');
          }else {
            callback();
          }
        }else{
          callback();
        }
      };
      var sendTimeValidation = (rule, value, callback) => {
        if(this.form.dateType==2 && (!this.form.sendTime || this.form.sendTime=='')){
          callback('请选择定时发送的时间');
        }else{
          callback();
        }
      };
      var sendingModeValidation = (rule, value, callback) => { //自定义有效时间的验证
        var isTrue = false;
        for(var i=0;i<value.length;i++){
          if(value[i].value == true){
            isTrue = true;
            break;
          }
        }
        if(isTrue){
          callback()
        }else{
          callback('请至少选择一个发送方式');
        }
      };
      return {
        form:{
          sex:'全部',
          customerStage:'正式客户',
          tag:[],
          phone:'',
          userId:'',
          templateType:'27',
          sendingMode:[{index:1,value:false},{index:2,value:false},{index:3,value:false},{index:4,value:false}],
          content:'',
          dateType:'1',
          sendTime:'',
          areaOptions:AreaList.getAreaJson(),
          areaSelectedOptions:['320000', '320100', '320115'],
          linkUrl:'',
          carBrandIds:[]//车品牌id
        },
        sendRangRadio:'1',
        carOptions:[],//用于筛选的options
        carList:[],//所有车信息的集合
        carProps: {
          value: 'id',
          children: 'children'
        },
        tagList:[],
        rules: {
          phone:[{ required: true,validator: phoneValidation, trigger: 'blur' }],
          userId:[{ required:true,validator: userIdValidation, trigger: 'blur' }],
          sendingMode:[{type: 'array', required: true,validator: sendingModeValidation, trigger: 'change'}],
          content:[{required: true, message: '请填写信息详情', trigger: 'blur'}],
          sendTime: [{ type: 'date', required: true, validator: sendTimeValidation, trigger: 'change' }],
        },
        group:{},
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }]
        },
        currentTime:TimeUtil.formatTime((new Date()).valueOf(),'M月D号'),
      }
    },
    created(){
      this.doGetOneGroup();
      this.doGetCarbrands();
      this.doSearchAllUserTags();
    },
    methods:{
      handleMenuSelect(key, keyPath){
        if(key ==2){
          this.$router.push('/marketing/message_group/message_record');
        }
      },
      handleAreaCascaderChange(value){
        console.log(value);
        this.form.areaSelectedOptions = value;
      },
      tapDatePicker(){
        this.form.dateType = '2';
      },
      remoteMethod(query) {
        this.carOptions = [];
        var that = this;
        if (query !== '') {
          this.carOptions = this.carList.filter(item => {
            return item.standingInitial.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        } else {
          this.carOptions = this.carList;
        }
      },
      doAU(formName){
        var that = this;
        console.log(this.form)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('表单验证通过...')
            var userSearchModel = {};
            var groupMessages = {};
            userSearchModel.sex = that.sendRangRadio=='1'?that.form.sex:null;
            userSearchModel.carBrandIds = that.sendRangRadio=='1'?that.form.carBrandIds:null;
            userSearchModel.customerStage = that.sendRangRadio=='1'?that.form.customerStage:null;
            userSearchModel.areaId = that.sendRangRadio=='1'?this.form.areaSelectedOptions.join(','):null;
            userSearchModel.tag = that.sendRangRadio=='1'?that.form.tag:null;
            userSearchModel.phone = that.sendRangRadio=='2'?that.form.phone:null;
            userSearchModel.userId = that.sendRangRadio=='3'?that.form.userId:null;
            groupMessages.templateType = that.form.templateType;
            groupMessages.linkUrl = that.form.linkUrl;
            groupMessages.content = that.form.content;
            groupMessages.dateType = that.form.dateType;
            groupMessages.sendDate = that.form.dateType==2?new Date(that.form.sendTime).getTime():null;
            groupMessages.groupId = cacheCookies.getGroupId();
            groupMessages.userSearchModel = userSearchModel;
            var modeArr=[];
            this.form.sendingMode.forEach(function (mode) {
              if(mode.value==true){
                modeArr.push(mode.index);
              }
            });
            groupMessages.sendingMode = modeArr.join(',');
            console.log(groupMessages)
            that.doAddGroupMessage(groupMessages);
          }else {
            this.$message.error('发送出错，请重新发送');
          }
        });
      },
      doCancel(formName){
        this.$refs[formName].resetFields();
        this.$router.back();
      },
      async doAddGroupMessage(groupMessages){
        var result = await GroupMessageService.doAddGroupMessage(groupMessages);
        if(result.status == 1){
          this.$router.push('/marketing/message_group/message_record');
        }
        console.log(result)
      },
      //查询店铺信息
      async doGetOneGroup(){
        var response = await GroupService.doGetOneGroup(cacheCookies.getGroupId());
        if(response.status == 1){
          this.group = response.data;
        }
      },
      async doSearchAllUserTags(){ //获取所有的标签
        var result = await GroupMessageService.doSearchAllUserTags();
        if(result.status ==1){
          this.tagList = result.data;
        }
      },
      //获取所有的品牌
      async doGetCarbrands() {
        var res = await CarService.doSearchAllCarBrand();
        if(res.status ==1){
          this.carList = res.data;
          this.carOptions = this.carList;
        }
      }

    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .signalImg-template{
    height: 450px;
    width: 100%;
  }
  .server-template{
    text-align: left;
    height:48px;
    line-height:48px;
  }
  .server-template img{
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px
  }
  .navbar{
    width: 100%;
    height: 50px;
  }
  .navbar-img{
    width: 100%;
    height: 100%;
  }
  .line{
    height:1px;
    background-color:#D5D5D5;
    overflow:hidden;
    margin-left: -10px
  }
  .message-bg{
    background-color: #ebebeb;
    padding: 10px;
    /*padding-bottom: 120px;*/
    margin-top: 0;
    height: 400px;
  }
  .message-detail-bg{
    background-color: white;
    padding-left: 10px;
  }
  .message_title{
    line-height: 1.3;
    padding-top: 10px;
  }
  .message-content{
    line-height:1.5;
    width: auto;
    margin-top: 20px;
    padding-bottom: 100px;
  }
  .template_tip{
    line-height:1.5;
    width: 200%;
    color: #8d8d8d;
    padding-bottom: 10px;
  }
  .grid-content{
    border: 1px solid red;
    height: 50px;
  }
  .breadcrumb-container{
    padding-left:8px;
  }
  .send-tip{
    color: #8d8d8d;
    padding-left: 15px;
  }
  .noLabel-form-item{
    padding-left: 80px;
  }
  .required {
    color: red;
    font-size: 130%;
    float: left;
  }
  .form-title {
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
    padding-left: 20px;
    padding-right: 10px;
    white-space: nowrap;
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
</style>










