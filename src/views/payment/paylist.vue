<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">收付款
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">导入账单</el-button>
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
          <el-form-item label="租客">
            <el-input size="small" v-model="sm.orderSearchModel.groupName" placeholder="租客"></el-input>
          </el-form-item>
          <el-form-item label="账单类型">
            <el-select v-model="sm.orderSearchModel.buinessType"  size="small" placeholder="请选择">
              <el-option
                  v-for="item in [{value:1,label:'公共能耗费'},{value:3,label:'电费'},{value:6,label:'租金'},{value:12,label:'物业费'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-width="70px">
          <el-form-item label="逾期状态">
            <el-select v-model="sm.orderSearchModel.overStatus"  size="small" placeholder="请选择">
              <el-option
                  v-for="item in [{value:1,label:'已逾期'},{value:3,label:'未逾期'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-width="70px" v-if="false">
          <el-form-item label="楼层">
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
          <el-form-item label="房号">
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
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="sm.page=1;doPage()">搜索</el-button>
            <el-button plain size="small" v-if="false">导出</el-button>
            <el-button type="text" v-if="false">查看已导出的列表</el-button>
            <el-button type="text" @click="sm.page=1;doReset()">重置筛选条件</el-button>
            <el-button type="text" v-if="false" @click="searhBoxDetail=!searhBoxDetail">{{searhBoxDetail?'收起':'更多搜索'}}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i></el-button>
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
            label="楼宇名称"
            prop="groupName"
        >
        </el-table-column>
        <el-table-column
            v-if="false"
            align="center"
            label="楼层-房号"
            prop="goodsName">
        </el-table-column>
        <el-table-column
            align="center"
            label="租客"
            prop="buyerName">
        </el-table-column>
        <el-table-column
            align="center"
            label="费用类型">
          <template slot-scope="scope">
            {{scope.row.businessType | businessTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="账单金额">
          <template slot-scope="scope">
            {{scope.row.totalPrice}} 元
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="实收/付金额"
          >
          <template slot-scope="scope">
            {{scope.row.payStatus==1?scope.row.realPrice:0}} 元
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="需收/退金额"
        >
          <template slot-scope="scope">
            {scope.row.realPrice}} 元
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="应收付时间"
        >
          <template slot-scope="scope">
            {{scope.row.orderDate | formatDate('Y-M-D')}}
          </template>
        </el-table-column>

        <el-table-column
            align="center"
            label="开始时间"
            v-if="false"
        >
          <template slot-scope="scope">
            {{scope.row.serviceStartDate | formatDate('Y-M-D')}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="结束时间"
            v-if="false"
        >
          <template slot-scope="scope">
            {{scope.row.serviceEndDate | formatDate('Y-M-D')}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="逾期状态"

        >
          <template slot-scope="scope">
            未逾期
          </template>
        </el-table-column>

        <el-table-column
            align="right"
            label="操作">
          <template slot-scope="scope">
            <el-popover
                ref="popover"
                placement="top"
                width="200"
                trigger="click"
                v-model="scope.row.visible">
              <p>确定作废<<{{scope.row.buyerName}}>>的租赁合同吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(scope.row),scope.row.visible = false">确定</el-button>
              </div>
              <el-button class="ml10" type="text" size="small"  slot="reference">作废</el-button>
            </el-popover>
            <el-button v-if="false" class="ml10" type="text" size="small" slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
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
import OrderService from '@/api/OrderService';

import AreaSelect from '@/components/AreaSelect/index'
import ConfigUtil from '@/utils/ConfigUtil';
import {mapGetters, mapState} from 'vuex';
import multiselect from '@/mixins/multiselect';
import RecordSelected from '@/components/RecordSelected/index.vue';
import GoodsService from "../../api/GoodsService";

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
      sm: {page: 1, count: 20, orderSearchModel:{businessTypes: "211004000000000000,211001000000000000,211002000000000000", ptradingAreaId:ConfigUtil.getTradingAreaId(), needItems:1, deleteStatus:0}},
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
  filters:{
    businessTypeFilter(value) {
      switch (value) {
        case 211004000000000000:
          return "电费";
          break;
        case 211001000000000000:
          return "租金";
          break;
        case 211002000000000000:
          return "物业费"
          break;
      }
    }
  },
  async created() {
    ConfigUtil.getAreaSM(this.sm.orderSearchModel, this.area, this.groupId);

    this.resetSM = JSON.parse(JSON.stringify(this.sm));
    this.doPage();

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
    async doDelete(order){
      var res = await OrderService.doDelete(order.id);
      await GoodsService.doUpdateQuantity(order.items[0].goodsId, 1);
      this.doPage();
    },
    doReset() {
      this.sm = JSON.parse(JSON.stringify(this.resetSM));
      this.doPage();
    },
    async doPage() {
      if(this.$refs.smArea) {
        ConfigUtil.getAreaSM(this.sm.orderSearchModel, this.$refs.smArea.getArea(), this.groupId);
      }

      var res = await OrderService.doPageOrder(this.sm);

      if (res.status != 1) {
        return;
      }
      this.totalCount = res.total;

      this.tableData = this.pageList = res.data;

      this.$nextTick(() => { //获取列表数据后
        this.mixinSetSelectRow();
      });
      if (this.pageList.length == 0) {
        this.loadingText = '暂无账单信息';
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
      var url = 'payment/paylist_import';
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

<style scoped>
..el-tag--small{
  height:6px;
  line-height:1;
}
.text-font-small{
  font-size:12px;
}
</style>