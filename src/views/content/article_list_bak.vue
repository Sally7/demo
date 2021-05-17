<style>

</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">资讯
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建资讯</el-button>
      </el-row>
      <div class="search-box">
        <el-form :inline="true">
          <el-form-item label="资讯标题">
            <el-input v-model="sm.title" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="资讯作者">
            <el-input v-model="sm.author" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="资讯分类">
            <el-cascader
                size="small"
                style="width: 100%"
                v-model="sm.categoryId"
                :props="{ value: 'id',label:'name',children:'nodes' }"
                :options="categorys"
                filterable
                clearable
                @change="categorySelect"></el-cascader>
          </el-form-item>
          <el-form-item label="资讯详情">
            <el-input v-model="sm.content" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="sm.page=1;doPage(sm)">搜索</el-button>
            <el-button plain size="small" v-if="false">导出</el-button>
            <el-button type="text" v-if="false">查看已导出的列表</el-button>
            <el-button type="text" @click="sm.page=1;doReset()">重置筛选条件</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="pageList.length>0">
        <el-col :span="24" class="text-left" style="padding-left: 10px;margin-top: 30px">
          <el-checkbox>当页全选</el-checkbox>
          <el-button plain size="small" style="margin-left: 10px">删除</el-button>
          <el-button plain size="small">批量设置</el-button>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="pageList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            align="center"
            label="资讯标题"
            prop="title"
            width="300">
        </el-table-column>
        <el-table-column
            align="center"
            label="资讯作者"
            prop="hasCover">
        </el-table-column>
        <el-table-column
            align="center"
            label="发布时间"
            prop="creatTime">
        </el-table-column>
        <el-table-column
            align="right"
            label="操作">
          <template slot-scope="scope">
            <el-button class="ml10" type="text" size="small" slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="scope.row.visible = false"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="pageList.length>0">共{{totalCount}}条数据，每页显示{{sm.count}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="sm.count"
                     :total="totalCount"
                     :current-page="sm.page"
                     @current-change="handleCurrentChange"
                     v-if="pageList.length>0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import TimeUtils from '@/utils/TimeUtil';
  import cacheCookies from '@/utils/auth';
  import GroupService from '@/api/GroupService';
  import ArticleService from '@/api/ArticleService';

  import ConfigUtil from '@/utils/ConfigUtil';
  import {mapGetters, mapState} from 'vuex';

  export default {
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {page: 1, count: 20, status: 1, sortExp: 'createTime desc'},
        totalCount: 0,
        pageList: [],
        group: null,
        groupId: cacheCookies.getGroupId(),
        categorys: [],
        useTypes: [{id: 1, name: '抗洪抢险'}, {id: 2, name: '维稳'}],
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    async created() {
      console.log('这个是：', localStorage.getItem('path'), localStorage.getItem('index'));
      this.sm.belong = this.groupId;
      this.doPage();
      //初始化分类
      this.categorys = await ArticleService.doSearchTreeJson();
    },
    methods: {
      init() {

      },
      handleCurrentChange(page) { //点击分页的组件
        this.sm.page = page;
        this.doPage();
      },
      doReset() {
        console.log('doReset');
        this.sm = {page: 1, count: 20, status: 1, belong: this.groupId, sortExp: 'createTime desc'};
        this.doPage();
      },
      async doPage(params) {
        var res = await ArticleService.doSerch(params|| '');
        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;

        this.pageList = res.data;
        this.pageList.forEach(function(item) {
          item.creatTimeLabel = TimeUtils.formatTime(item.creatTime, 'Y-M-D H:m:s');
        });

        if (this.pageList.length == 0) {
          this.loadingText = '暂无资讯信息';
        }
      },
      doExport() {

      },
      toAU(id) {
        var url = '/content/article_list/article_au';
        if (id) {
          url += '?id=' + id;
        }
        this.$router.push(url);
      },
      handleSelectionChange() {

      },
      categorySelect() {

      },
    },
  };
</script>
