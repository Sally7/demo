<template>
  <div class="app-container" id="wrapper">
    <el-menu default-active="2" class="breadcrumb-container" mode="horizontal" active-text-color="#4494E7" @select="handleMenuSelect">
      <el-menu-item index="1">编辑内容</el-menu-item>
      <el-menu-item index="2">发送记录</el-menu-item>
    </el-menu>
    <div class="app__content">
      <el-table :empty-text="loadingText"
                :data="messageRecordList"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
          align="center"
          prop="content"
          label="信息详情">
        </el-table-column>
        <el-table-column
          align="center"
          prop="template"
          label="主题模板">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sendTime"
          label="群发时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="发送">
        </el-table-column>
        <el-table-column
          align="center"
          prop="successCount"
          label="送达">
        </el-table-column>
        <el-table-column
          align="center"
          prop="statusLabel"
          label="状态"
          :filters="status"
          :filter-multiple="false"
          filter-placement="bottom-end"
          :filter-method="statusFilter">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope" v-if="messageRecordList[scope.$index].sendingMode<3">
            <el-button type="text" size="small" @click="toMessageVisitDetail(messageRecordList[scope.$index].id)">访问详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="messageRecordList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="messageRecordList.length>0">
      </el-pagination>
    </div>
    </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import GroupMessageService from '@/api/GroupMessageService'
  import TimeUtil from '@/utils/TimeUtil'
  export default {
    data() {
      return {
        messageRecordList:[],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        status:[
          {text:"未发送", value:0},
          {text:"已加入发送", value:1},
          {text:"取消发送", value:2},
          {text:"发送完成", value:3}
        ],
      }
    },
    created() {
      this.doPageGroupMessages();
    },
    methods: {
      statusFilter(value, row) {
        return row.status === value;
      },
      toMessageVisitDetail(messagesId){
        this.$router.push('/marketing/message_group/message_visit_detail?messagesId='+messagesId);
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageGroupMessages();
      },
      handleMenuSelect(key, keyPath){
        if(key ==1){
          this.$router.back();
        }
      },
      async doPageGroupMessages() {// 查询营销场景列表
        var response = await GroupMessageService.doPageGroupMessages(cacheCookies.getGroupId(),this.currentPage,this.pageSize);
        this.messageRecordList = response.status==1 ? response.data : [];
        this.loadingText = '暂无数据';
        this.totalCount = response.total;
        this.messageRecordList.forEach(function (record) {
          switch(record.templateType){
            case 27:
              record.template = '活动通知';
              break;
            default:
          }
          record.sendTime = TimeUtil.formatTime(record.sendDate,'Y/M/D H:m')
          switch(record.status){
            case 0:
              record.statusLabel = '未发送';
              break;
            case 1:
              record.statusLabel = '已加入发送';
              break;
            case 2:
              record.statusLabel = '取消发送';
              break;
            case 3:
              record.statusLabel = '发送完成';
              break
            default:
          }
        });
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .breadcrumb-container{
    padding-left:8px;
  }
</style>
