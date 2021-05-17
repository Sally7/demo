<template>
  <div class="app-container" id="wrapper">
    <Breadcrumb class="breadcrumb-container"></Breadcrumb>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="4" v-if="sendingMode.indexOf(1) != -1">
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
        <el-col :span="4" :offset="(sendingMode.indexOf(1) != -1 && sendingMode.indexOf(2) != -1)?2:0" v-if="sendingMode.indexOf(2) != -1">
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
              <p>进入小程序查看<span style="float: right;">></span></p>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="tableClass">
        <div class="blue-dot"></div>
        <div class="table-title">访问详情</div>
        <el-table :data="detailInfoList" :header-row-style="tableHeaderClass">
          <el-table-column
            prop="userName"
            label="用户昵称">
          </el-table-column>
          <el-table-column
            prop="visitTime"
            label="访问时间">
          </el-table-column>
          <el-table-column
            prop="sexText"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="customerStageText"
            label="客户阶段">
          </el-table-column>
        </el-table>
        <div class="counts-wrap mb15" v-if="detailInfoList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
        <el-pagination class="text-right"
                       background
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="totalCount"
                       :current-page="currentPage"
                       @current-change="handleCurrentChange"
                       v-if="detailInfoList.length>0">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import GroupService from '@/api/GroupService'
  import GroupMessageService from '@/api/GroupMessageService'
  import TimeUtil from '@/utils/TimeUtil'
  import cacheCookies from '@/utils/auth'


  export default {
    data() {
      return {
        messagesId:this.$route.query.messagesId,
        group:{},
        sendingMode:'',
        detailInfoList:[],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        loadingText:'正在加载,请稍后...',
        currentTime:TimeUtil.formatTime((new Date()).valueOf(),'M月D号'),
        tableHeaderClass: {background: '#f0f0f0'},
        offset:0
      }
    },
    components: {
      Breadcrumb,
    },
    async created(){
      this.doGetOneGroup();
      this.doGetGroupMessages();
      this.doPageMessagesVisit();
    },
    methods: {
      //查询店铺信息
      async doGetOneGroup(){
        var response = await GroupService.doGetOneGroup(cacheCookies.getGroupId());
        if(response.status == 1){
          this.group = response.data;
        }
      },
      async doGetGroupMessages(){
        var response = await GroupMessageService.doGetGroupMessages(this.messagesId);
        if(response.status == 1){
          this.sendingMode = response.data.sendingMode;
        }
      },
      async doPageMessagesVisit(){
        var response = await GroupMessageService.doPageMessagesVisit(this.messagesId,this.currentPage);
        if(response.status == 1){
          response.data.forEach(function (message) {
            message.visitTime = TimeUtil.formatTime(message.visitDate,'Y-M-D H:m:s');
            message.sexText = message.sex==1?'男':message.sex==2?'女':'';
            var customerStageText = '';
            switch(message.customerStage){
              case 0:
                customerStageText = '潜在客户'
                break;
              case 1:
                customerStageText = '意向客户'
                break;
              case 2:
                customerStageText = '正式客户'
                break;
              case 3:
                customerStageText = '其他'
                break;
              default:
            }
            message.customerStageText = customerStageText;

          });
          this.detailInfoList = response.data;
          this.totalCount = response.total;
        }
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageMessagesVisit();
      },
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .blue-dot{
    background: #34B0FF;
    width: 5px;
    height: 20px;
    float:left;
  }
  .table-title{
    float:left;
    padding-left: 10px
  }
  .tableClass{
    margin-top: 100px;
    width: 100%;
  }
  .container{
    margin: 30px;
  }
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
    padding-bottom: 10px;
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
    width: 160%;
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
</style>
