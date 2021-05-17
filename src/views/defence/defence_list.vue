<template>
  <div class="container">
    <aside class="new-aside" v-if="false">
      <div class="shop_logo" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 0px; border-bottom: 1px solid rgb(238, 238, 238);">
        <span class="el-avatar el-avatar--medium el-avatar--circle" slot="reference"><img src="~@/assets/img/qiye.png" style="object-fit: cover;"/></span>
        <div class="class_name">
          企业
        </div>
      </div>
      <ul role="menubar" class="el-menu">
        <div class="menu-wrapper">
          <el-input
              placeholder="输入关键字进行过滤"
              size="small"
              style="padding: 10px"
              v-model="filterText"
              clearable>
          </el-input>
          <el-tree :data="groupCategorys" :props="defaultProps" ref="tree" :filter-node-method="filterNode" @node-click="groupCategorySelect"></el-tree>
        </div>
      </ul>
    </aside>
    <div class="news_right">
      <div class="module-title" style="display: flex; justify-content: space-between;">
        {{currentGroupCategory.name}}
      </div>
      <div class="news_box">
        <el-row :gutter="10">
          <el-button type="primary" size="small" @click="toAU()">新建企业</el-button>
          <el-button type="primary" size="small" plain @click="toImport">导入企业</el-button>
        </el-row>
        <div class="search-box">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form style="margin-top: 20px">
                  <el-form-item label="搜索区域">
                    <area-select type="address" ref="archiveArea" :areaId="area.areaId" :townId="area.townId" :villageId="area.villageId" :areaLevel="+area.areaLevel"></area-select>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-form v-if="!searhBoxDetail" :inline="true">
            <el-form-item label="企业名称">
              <el-input v-model="sm.name" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="信用代码">
              <el-input v-model="sm.groupNo" size="small" clearable></el-input>
            </el-form-item>
          </el-form>
          <div v-if="searhBoxDetail">
            <el-form :inline="true">
              <el-form-item label="企业名称">
                <el-input v-model="sm.name" size="small" clearable></el-input>
              </el-form-item>
              <el-form-item label="信用代码">
                <el-input v-model="sm.groupNo" size="small" clearable></el-input>
              </el-form-item>
            </el-form>
            <dynamic-search-model pformId="2c92ebd175fa23190175ff5b12ff0006" ref="archiveSearchModel"></dynamic-search-model>
          </div>
          <el-row :gutter="10" style="margin-top: 10px;">
            <el-col :span="24" class="text-left">
              <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
              <el-button @click="doExport" plain size="small">导出</el-button>
              <el-button type="text" v-if="false">查看已导出的列表</el-button>
              <el-button type="text" @click="currentPage=1;doReset()">重置筛选条件</el-button>
              <el-button type="text" @click="searhBoxDetail=!searhBoxDetail">{{searhBoxDetail?'收起':'更多搜索'}}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i></el-button>
            </el-col>
          </el-row>
        </div>

        <el-tabs v-model="tabName" @tab-click="handleClick">
          <el-tab-pane label="表格模式" name="table">
            <el-row v-if="pageList.length>0" style="margin-top: 20px; ">
              <el-col :span="8" class="text-left" style="padding-left: 10px;">
                <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
                <el-button plain size="small" style="margin-left: 10px">删除</el-button>
                <el-button plain size="small">批量设置</el-button>
              </el-col>
              <el-col :span="16" class="text-right">
                <el-pagination class="text-right"
                               background
                               layout="total, sizes, prev, pager, next"
                               @size-change="handleSizeChange"
                               :page-sizes="[10, 20, 30, 40, 50]"
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
                      :header-row-style="tableHeaderClass"
                      @selection-change="handleSelectionChange"
                      style="width: 100%;margin-top: 20px;"
                      :row-class-name="tableRowClassName"
            >
<!--              选框-->
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
<!--              信用代码-->
              <el-table-column
                  align="center"
                  label="信用代码"
                  prop="groupNo">
              </el-table-column>
<!--              企业名称-->
              <el-table-column align="center" label="企业名称" prop="name">
                <template slot-scope="scope">
                  <el-button type="text" @click="toDialog(scope.row)">{{
                      scope.row.name
                    }}</el-button>
                </template>
              </el-table-column>
<!--              地址-->
              <el-table-column
                  align="center"
                  label="地址"
                  prop="address">
              </el-table-column>
<!--              操作-->
              <el-table-column
                  align="right"
                  label="操作">
                <template slot-scope="scope">
                  <el-button class="ml10" type="text" size="small" slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
                  <el-button class="ml10" type="text" size="small" slot="reference" @click="toAU(scope.row.id,'detail')">详情</el-button>
                  <el-button size="mini" type="text" @click="scope.row.visible = false"></el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination class="text-right mt15"
                           background
                           layout="total, sizes, prev, pager, next, jumper"
                           @size-change="handleSizeChange"
                           :page-sizes="[10, 20, 30, 40, 50]"
                           :page-size="sm.count"
                           :total="totalCount"
                           :current-page="sm.page"
                           @current-change="handleCurrentChange"
                           v-if="pageList.length>0">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="地图模式" name="map">
            <el-row>
              <el-col :span="18">
                <offline-map :map-list="pageList" v-if="pageList.length > 0" ref="offlineMap"></offline-map>
              </el-col>
              <el-col :span="6">
                <map-list :map-list="pageList" :list-total="totalCount" :page-change="pageChange" :openPoint="openPoint"></map-list>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <task-dialog  :show.sync="taskVisible" ref="taskDialog" v-bind:titleData="pageListObject"></task-dialog>
      </div>
    </div>
  </div>

</template>

<script>
  import GoodsService from '@/api/GoodsService';
  import cacheCookies from '@/utils/auth';
  import GroupService from '@/api/GroupService';
  import {mapGetters} from 'vuex';
  import ConfigUtil from '@/utils/ConfigUtil';
  import AreaSelect from '@/components/AreaSelect/index';
  import OfflineMap from '@/components/OfflineMap/index.vue';
  import RecordSelected from '@/components/RecordSelected/index.vue';
  import MapList from '@/components/MapList/index.vue';
  import multiselect from '@/mixins/multiselect';
  import DynamicFormService from '../../api/DynamicFormService';
  import DynamicSearchModel from '@/components/DynamicSearchModel';
  import TaskDialog from "../../components/TaskDialog/TaskDialog";

  export default {
    components: {
      AreaSelect,
      OfflineMap,
      MapList,
      RecordSelected,
      DynamicSearchModel,
      TaskDialog
    },
    mixins: [multiselect],
    data() {
      return {
        pageListObject: '',
        taskVisible:false,
        activeNameTwo:'one',
        activeName: 'first',
        loadingText: '正在加载,请稍后...',
        filterText: '',
        moduleId: 'group_9010000000000000',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {page: 1, count: 20, hasGoupCategoryId: 1},
        totalCount: 0,
        pageList: [],
        group: null,
        groupId: cacheCookies.getGroupId(),
        goodsCategorys: [],
        useTypes: [{id: 1, name: '抗洪抢险'}, {id: 2, name: '维稳'}],
        defaultProps: {
          label: 'label',
        },
        groupCategorys: [],
        selectedRows: [],
        currentGroupCategory: {name: '全部企业', id: 9010000000000000},
        tabName: 'table',
        searhBoxDetail: false,
        resetSM: null,
        tranmap: {key: 'id', label: 'name', desc: 'desc'},
        indexNo:''
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    async created() {
      console.log('created', this.area);

      //设置数据区域
      ConfigUtil.areaToSM(this.sm, this.area);
      this.resetSM = JSON.parse(JSON.stringify(this.sm));
      this.doPage();

      const result = await DynamicFormService.doSearchSearchFormItemsByIds('2c92ebd175fa23190175ff6ec39b0013');
      if (result && result[0].valueList) {
        this.groupCategorys = result[0].valueList;
      }

      console.log('this.groupCategorys', this.groupCategorys);
    },
    methods: {
      tableRowClassName({row,rowIndex}) {
        row.index=rowIndex
      },
      doSomeThing() {
        this.pageListObject = this.pageList[this.indexNo];
        console.log("pageList[this.indexNo]=========",this.pageList[this.indexNo]);
      },
      init() {

      },
      // 显示dialog
      toDialog(row) {
        this.indexNo = row.index
        this.doSomeThing()
        this.$refs.taskDialog.isTaskDialog();
      },
      handleClickTab(tab, event) {
        console.log(tab, event);
      },
      handleClick(tab) {
        console.log('handleClick', tab.index);
        if (tab.index == 1) {
          this.$refs.offlineMap.addMarker();
        }
      },
      pageChange(index) {
        this.handleCurrentChange(index);
        console.log(index);
      },
      handleCurrentChange(page) { //点击分页的组件
        this.mixinCurrentChange();
        this.sm.page = page;
        this.doPage();
        this.mixinSetSelectRow();
      },
      doReset() {
        this.sm = JSON.parse(JSON.stringify(this.resetSM));
        this.doPage();
      },
      doRePage() {
        this.sm.page = 1;
        this.doPage();
      },
      async doPage() {

        console.log('doPage....', this.$refs.archiveArea);

        if (this.$refs.archiveArea) {
          console.log('doPage archiveArea....', this.$refs.archiveArea.getArea());
          ConfigUtil.getAreaSM(this.sm, this.$refs.archiveArea.getArea(), this.groupId);
        }

        if (this.$refs.archiveSearchModel) {
          this.sm.valueList = this.$refs.archiveSearchModel.getItems();
        }

        var res = await GroupService.doPage(this.sm);
        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;
        this.tableData = this.pageList = res.data;
        this.$nextTick(() => {
          this.mixinSetSelectRow();
        });
        if (this.pageList.length == 0) {
          this.loadingText = '暂无机构信息';
        }
      },
      doExport() {
        let ids = [], sels = [];
        sels = this.mixinGetAllSelectionData();
        for (let i = 0; i < sels.length; i++) {
          ids.push(sels[i].id);
        }
        console.log('国防潜力选中ID：', ids.join(','));
        //数据准备好，需调用对应的导出接口方可实现
      },
      toAU(id, detail) {
        var url = '/defence/defence_list/defence_au';
        url += '?categoryId=' + this.currentGroupCategory.id;
        if (id) {
          url += '&id=' + id;
        }
        if (detail) {
          url += '&detail=' + true;
        }
        ;
        this.$router.push(url);
      },
      goodsCategorySelect() {

      },
      groupCategorySelect(item) {
        console.log('groupCategorySelect', item);
        this.currentGroupCategory = item;

        this.sm.groupCategoryId = item.id;
        this.doRePage();
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleSelectionChange(rows) {
        this.mixinHandleSelectionChange(rows);
      },
      handleCheckAllChange(value) {
        console.log('handleCheckAllChange:', value);
      },
      handleSizeChange(val) {
        this.sm.page = 1;
        this.sm.count = val;
        this.doPage();
      },
      openPoint(item) {
        this.$refs.offlineMap.openPoint(item);
      },
      toImport() {
//        var url = '/archive/archive_list_' + this.archiveType + '/archive_import?archiveType=' + this.archiveType;
        var url = 'defence_list/defence_import?archiveType=' + 6;
        this.$router.push(url);
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="scss" scoped>
  .container {
    display: flex;
    padding: 0;
    padding-bottom: 32px;
    min-width: 740px;
    min-height: 620px;
    -webkit-box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
    .new-aside {
      width: 200px;
      margin-right: 10px;
      background-color: #fff;
      .class_name {
        margin-top: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      a {
        display: inline-block;
        width: 100%;
        text-align: center;
      }
      .svg-icon {
        margin-right: 5px;
      }
      .el-menu {
        border: none;
        width: 100%;
      }
      .el-menu-item {
        height: 44px;
        border-left: 2px solid #FFFFFF;
        line-height: 44px;
      }
      .el-menu-item.is-active {
        color: #409EFF;
        background-color: #e4edff;
        border-left: 3px solid #409EFF;
      }
      .el-menu-item:hover {
        color: #409EFF;
        background-color: #e4edff;
        border-left: 2px solid #e4edff;
      }
      .submenu .router-link-active .el-menu-item {
        color: #409EFF;
      }
    }
  }

  .news_right {
    width: 100%;
    background-color: #fff;
    .news_box {
      width: 100%;
      padding: 30px;
      .item_box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background-color: #2B61B3;
          margin-right: 15px;
        }

        .title {
          display: flex;
          align-items: center;
        }
        .time {
          font-size: 15px;
        }
        .title_content {
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }
  }
</style>
