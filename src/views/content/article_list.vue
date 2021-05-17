<style>
td.article-title{
  cursor: pointer;
}
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
        <el-row>
          <el-col :span="18" class="text-left">
            <el-row>
              <el-form label-width="70px">
                <el-form-item label="搜索区域">
                  <area-select type="address" ref="smArea" :areaId="area.areaId" :townId="area.townId" :villageId="area.villageId" :areaLevel="+area.areaLevel"></area-select>
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
        <el-form :inline="true" label-width="70px">
          <el-form-item label="资讯标题">
            <el-input v-model="sm.title" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="资讯作者">
            <el-input v-model="sm.author" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-width="70px">
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
            <el-button type="primary" size="small" @click="sm.page=1;doPage()">搜索</el-button>
            <el-button plain size="small" v-if="false">导出</el-button>
            <el-button type="text" v-if="false">查看已导出的列表</el-button>
            <el-button type="text" @click="sm.page=1;doReset()">重置筛选条件</el-button>
            <el-button type="text" @click="searhBoxDetail=!searhBoxDetail">{{searhBoxDetail?'收起':'更多搜索'}}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i></el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px; ">
        <el-col :span="8" class="text-left" style="padding-left: 10px">
          <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
          <el-button plain size="small"  style="margin-left: 10px">删除</el-button>
          <el-button plain size="small" @click="toBatch()">批量设置</el-button>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="sm.count"
                         :total="totalCount"
                         :current-page="sm.page"
                         @current-change="handleCurrentChange"
                         v-if="pageList.length>0">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table class="mb15"
                ref="table"
                :empty-text="loadingText"
                :data="pageList"
                @cell-click="toDetail"
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
          <el-table-column
              class-name="article-title"
              align="center"
              label="资讯标题"
              prop="title"
              width="300"
          >
          </el-table-column>
        <el-table-column
            align="center"
            label="资讯作者"
            prop="author">
        </el-table-column>
        <el-table-column
            align="center"
            label="发布时间"
            prop="creatTimeLabel">
        </el-table-column>
        <el-table-column
            align="right"
            label="操作">
          <template slot-scope="scope">
            <el-popover
                ref="popover"
                placement="top"
                width="200"
                v-model="scope.row.visible">
              <p>确定删除{{pageList[scope.$index].title}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(pageList[scope.$index].id),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
            <el-button class="ml10" type="text" size="small" slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="scope.row.visible = false"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="8" class="text-left">
          <div class="mb15 text-left" v-if="pageList.length>0">共{{totalCount}}条数据，每页显示{{sm.count}}条</div>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="sm.count"
                         :total="totalCount"
                         :current-page="sm.page"
                         @current-change="handleCurrentChange"
                         v-if="pageList.length>0">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import TimeUtils from '@/utils/TimeUtil';
  import cacheCookies from '@/utils/auth';
  import ArticleService from '@/api/ArticleService';
  import AreaSelect from '@/components/AreaSelect/index'
  import ConfigUtil from '@/utils/ConfigUtil';
  import {mapGetters, mapState} from 'vuex';
  import multiselect from '@/mixins/multiselect';
  import RecordSelected from '@/components/RecordSelected/index.vue';

  export default {
    components: {
      AreaSelect,
      RecordSelected
    },
    mixins: [multiselect],
    data() {
      return {
        tranmap:{key:'id',label:'title',desc:'desc'},
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {page: 1, count: 20, status: 1, sortExp: 'createTime desc'},
        resetSM:null,
        totalCount: 0,
        pageList: [],
        group: null,
        groupId: cacheCookies.getGroupId(),
        categorys: [],
        useTypes: [{id: 1, name: '抗洪抢险'}, {id: 2, name: '维稳'}],
        searhBoxDetail: false,
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

      if (this.sm.categoryId && this.sm.categoryId.length > 0) {
        this.sm.categoryId = this.sm.categoryId[0];
      }

      this.resetSM = JSON.parse(JSON.stringify(this.sm));

      this.doPage();
      //初始化分类
      this.categorys = await ArticleService.doSearchTreeJson();
    },
    methods: {
      init() {
      },
      toDetail(row, column){
        if (column.property=='title') {
          this.$router.push("/open/article_detail?id="+row.id);
        }
      },
      handleCurrentChange(page) { //点击分页的组件
        this.mixinCurrentChange();
        this.sm.page = page;
        this.doPage();
        this.mixinSetSelectRow()
      },
      async doDelete(id){
        var res = await ArticleService.doDelete(id);
        if(res.status === 1){
          this.doPage();
        }
      },
      doReset() {
        this.sm = JSON.parse(JSON.stringify(this.resetSM));
        this.doPage();
      },
      async doPage() {
        if(this.$refs.smArea) {
          ConfigUtil.getAreaSM(this.sm, this.$refs.smArea.getArea(), this.groupId);
        }

        var res = await ArticleService.doPage(this.sm);

        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;

        this.tableData=this.pageList = res.data;
        this.pageList.forEach(function(item) {
          item.creatTimeLabel = TimeUtils.formatTime(item.creatTime, 'Y-M-D H:m:s');
        });
        this.$nextTick(() => { //获取列表数据后
          this.mixinSetSelectRow();
        });
        if (this.pageList.length == 0) {
          this.loadingText = '暂无资讯信息';
        }
      },
      doExport() {
        let sels=[],ids=[];
        sels=this.mixinGetAllSelectionData();
        for(let i=0;i<sels.length;i++){
          ids.push(sels[i].id);
        }
//        exportModel.userSearch.userId = ids.join(",");
      },
      toAU(id) {
        var url = 'article_list/article_au';
        console.log('资讯路由问题，合并yuanqu')
        if (id) {
          url += '?id=' + id;
        }
        this.$router.push(url);
      },

      handleSelectionChange(rows) {
        this.mixinHandleSelectionChange(rows);
      },
      categorySelect() {

      },
    },
  };
</script>
