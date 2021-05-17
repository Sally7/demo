<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">评价管理</div>
    <div class="app__content">
      <el-row :gutter="20">
        <el-col :span="20" class="text-right">
          <el-date-picker type="datetime" v-model="startTime" placeholder="开始日期" /> 至
          <el-date-picker type="datetime" v-model="endTime" placeholder="结束日期" />
        </el-col>
        <el-col :span="4" class="text-right">
          <el-input prefix-icon="el-icon-search" placeholder="店铺名称" v-model="keyShopName"  clearable />
        </el-col>
      </el-row>
      <el-table :empty-text="loadingText"
                :data="evaluateList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          label="评分"
          prop="avgScoreText"
          :filters="avgScore"
          :filter-multiple="false"
          filter-placement="bottom-end"
          :filter-method="avgScoreFilter">
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          label="评价标签"
          align="center"
          prop="nickName">
          <template slot-scope="scope">
            <el-tag
              v-for="tag in evaluateList[scope.$index].tagList"
              :key="tag">
              {{tag}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="评价内容"
          align="center"
          prop="content">
        </el-table-column>
        <el-table-column
          label="服务商户"
          align="center"
          prop="shopName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="evaluateList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="evaluateList.length>0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import TimeUtils from '@/utils/TimeUtil'
  import cacheCookies from '@/utils/auth'
  import EvaluateService from '@/api/EvaluateService'
  export default {
    data(){
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        startTime:null,
        startDate:null,
        endTime:null,
        endDate:null,
        keyShopName:null, //查询店铺的关键字
        avgScore:[
          {text:"1星", value:1},
          {text:"2星", value:2},
          {text:"3星", value:3},
          {text:"4星", value:4},
          {text:"5星", value:5},
        ],
        evaluateList:[]
      }
    },
    created(){
      console.log('这里是评价管理');
      this.doPageEvaluate();
    },
    watch: {
      startTime(value){
        this.startDate = value?new Date(value).getTime():null; //中国标准时间转时间戳
        this.doPageEvaluate();
      },
      endTime(value){
        console.log(value)
        this.endDate = value?new Date(value).getTime():null; //中国标准时间转时间戳
        this.doPageEvaluate();
      },
      keyShopName(value){
        console.log(value)
        this.doPageEvaluate();
      }
    },
    methods: {
      //筛选提现状态
      avgScoreFilter(value, row) {
        return row.avgScore == value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageEvaluate();
      },
      async doPageEvaluate(){
        var res = await EvaluateService.doPage(cacheCookies.getGroupId(),2,'all',this.currentPage,this.pageSize,this.startDate,this.endDate,this.keyShopName);
        this.evaluateList = res.status==1 ? res.data : [];
        this.evaluateList.forEach(function (evaluate) {
          evaluate.avgScoreText = evaluate.avgScore + '星';
          evaluate.createDate = TimeUtils.formatTime(evaluate.evaluationTime, 'Y-M-D H:m:s');
          var tagList = [];
          evaluate.evaluateTagList.forEach(function (tag) {
            tagList.push(tag.tagName);
          });
          evaluate.tagList = tagList.length > 1?tagList:null;
        });
        this.totalCount = res.total;
        this.loadingText = '暂无数据';
      }
    }
  }
</script>
