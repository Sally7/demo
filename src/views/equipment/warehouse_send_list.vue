<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">出库管理
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建出库</el-button>
      </el-row>
      <div class="search-box">
        <el-form>
          <el-form-item label="制单时间">
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="装备名称">
            <el-input v-model="sm.orderSearchModel.orderItem.goodsTitle" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="装备型号">
            <el-input v-model="sm.orderSearchModel.orderItem.artNo" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button plain size="small">导出</el-button>
            <el-button type="text">查看已导出的列表</el-button>
            <el-button type="text" @click="currentPage=1;doReset()">重置筛选条件</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px; ">
        <el-col :span="8" class="text-left" style="padding-left: 10px">
          <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
          <el-button plain size="small"  style="margin-left: 10px">删除</el-button>
          <el-button plain size="small">批量设置</el-button>
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
                :empty-text="loadingText"
                :data="pageList"
                ref="table"
                border
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            align="center"
            label="出库装备"
            width="360"
            prop="goodsName">
          <template slot-scope="scope">
            <div class="goods-item-body">
              <div style="color: #909399">出库单号:{{scope.row.id}}</div>
              <div class="goods-item-cell" v-for="item in scope.row.items">
                <div class="goods-info__info">
                  <div class="goods-title">
                    <a href="" rel="noopener noreferrer" target="_blank">{{item.goodsTitle}}</a>
                  </div>
                  <div class="goods-skus">
                    <span class="goods-sku">{{item.skuLabel}}</span>
                  </div>
                  <div class="goods-tags">
                  </div>
                </div>
                <div class="goods-info__price">
                  <div v-if="false">￥{{item.realPrice}}</div>
                  <div>{{item.count}}{{item.unitName}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="出库仓库"
            prop="groupName">
        </el-table-column>
        <el-table-column
            align="center"
            label="出库总量"
            prop="count">
        </el-table-column>
        <el-table-column
            align="center"
            label="出库类型"
            :formatter="(row,column)=>{
                let json={'1':'装备征用','2':'装备报废','3':'装备借出','4':'装备归还','5':'装备补充'}
                let res = row[column.property]?json[row[column.property]]:'';
                return res;
            }"
            prop="outInWarehouse">
        </el-table-column>
        <el-table-column
            align="center"
            label="制单人"
            prop="replaceUserName">
        </el-table-column>
        <el-table-column
            align="center"
            label="制单时间"
            prop="orderDate">
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
  import GoodsService from '@/api/GoodsService';
  import OrderService from '@/api/OrderService';
  import cacheCookies from '@/utils/auth';
  import GroupService from '@/api/GroupService';
  import ConfigUtil from '@/utils/ConfigUtil';
  import TimeUtils from '@/utils/TimeUtil';
  import multiselect from '@/mixins/multiselect';
  import RecordSelected from '@/components/RecordSelected/index.vue';

  export default {
    data() {
      return {
        tranmap:{key:'id',label:'goodsName',desc:'desc'},
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {
          page: 1, count: 20, orderSearchModel: {
            orderItem: {},
            groupId: cacheCookies.getGroupId(),
            needItems: 1,
            orderType: 2,
            businessType: 4024000000000000,
          },
        },
        totalCount: 0,
        pageList: [],
        group: null,
        groupId: cacheCookies.getGroupId(),
        goodsCategorys: [],
        dateRange: [],
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            }],
        },
      };
    },
    components: {
      RecordSelected
    },
    mixins: [multiselect],
    async created() {
      var groupRes = await GroupService.doGetOneGroupById(this.groupId);
      groupRes.data.areaId = groupRes.data.areaId + '';
      this.group = groupRes.data;
      if (this.group.groupType == 101) {
        //代表人武部
        //根据其areadId的层级确定其是省 市 区
//        this.sm.orderSearchModel.tradingAreaId = this.group.id;
      } else {
        //反之代表镇和村
        //如果generalId为null 则代表是镇，反之为村
        if (this.group.generalId) {
          this.sm.orderSearchModel.groupId = this.group.id;
        } else {
          this.sm.orderSearchModel.generalId = this.group.id;
        }
      }
      this.doPage();

      //初始化分类
      this.goodsCategorys = await GoodsService.doSearchTreeByGroup(ConfigUtil.getTradingAreaId());
      this.goodsCategorys.forEach(function(goodsCategory) {
        if (goodsCategory.nodes.length == 0) {
          delete goodsCategory.nodes;
        } else {
          goodsCategory.nodes.forEach(function(scategory) {
            if (scategory.nodes.length == 0) {
              delete scategory.nodes;
            }
          });
        }
      });
    },
    methods: {
      init() {

      },
      handleCurrentChange(page) { //点击分页的组件
        this.mixinCurrentChange();
        this.sm.page = page;
        this.doPage();
        this.mixinSetSelectRow();
      },
      doReset() {
        console.log('doReset');
        this.sm = {};
        this.doPage();
      },
      async doPage() {
        this.pageList = [];
        if (this.dateRange && this.dateRange.length >= 2) {
          this.sm.orderSearchModel.startExpectDate = this.dateRange[0].getTime();
          this.sm.orderSearchModel.endExpectDate = this.dateRange[1].getTime();
        }

        var res = await OrderService.doPageOrder(this.sm);
        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;
        res.data.forEach(function(goods) {
          goods.orderDate = TimeUtils.formatTime(goods.orderDate, 'Y-M-D H:m:s');
          goods.totalQuantity = goods.quantity + goods.occupiedQuantity;
        });
        this.tableData=this.pageList = res.data;
        this.$nextTick(() => {
          this.mixinSetSelectRow();
        });
        this.pageList.forEach(obj => {
          let count = 0;
          if (!obj.items) obj.items = [];
          for (let i = 0; i < obj.items.length; i++) {
            count += obj.items[i].count;
          }
          obj.count = count;
        });
        if (this.pageList.length == 0) {
          this.loadingText = '暂无装备信息';
        }
      },
      doExport() {

      },
      toAU(id) {
        var url = '/equipment/equipment_list/warehouse_send';
        if (id) {
          url += '?id=' + id;
        }
        this.$router.push(url);
      },
      handleSelectionChange(rows) {
        this.mixinHandleSelectionChange(rows);
      },
      goodsCategorySelect() {

      },
    },
  };
</script>
