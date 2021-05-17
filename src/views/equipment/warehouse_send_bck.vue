<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">新建出库
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建出库</el-button>
      </el-row>
      <div class="search-box">
        <el-form>
          <el-form-item label="制单时间">
            <el-date-picker
              v-model="sm.dateRange"
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
            <el-input v-model="sm.search.titleKeyword" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="装备型号">
            <el-input v-model="sm.search.artNo" size="small" clearable></el-input>
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
      <el-row v-if="pageList.length>0">
        <el-col :span="24" class="text-left" style="padding-left: 10px;margin-top: 30px">
          <el-checkbox>当页全选</el-checkbox>
          <el-button plain size="small">批量打印</el-button>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="pageList"
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          label="出库单号"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          label="出库装备"
          prop="goodsName">
        </el-table-column>
        <el-table-column
          align="center"
          label="出库类型"
          prop="buisnessType">
        </el-table-column>
        <el-table-column
          align="center"
          label="出库量"
          prop="count">
        </el-table-column>
        <el-table-column
          v-if="false"
          align="center"
          label="剩余量"
          prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          label="制单人"
          prop="buyerName">
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
    <div class="footer">
      <el-button size="small" type="primary" @click="toAU()" :loading="doAUing">保存</el-button>
    </div>

  </div>
</template>
<script>
  import GoodsService from '@/api/GoodsService'
  import cacheCookies from '@/utils/auth'
  import GroupService from '@/api/GroupService'
  import ConfigUtil from '@/utils/ConfigUtil'

  export default{
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        doAUing:false,
        tableHeaderClass: {background: '#f0f0f0'},
        sm:{page : 1, count : 20, search:{status:1, sortExp:"createTime desc"}},
        totalCount:0,
        pageList:[],
        group:null,
        groupId:cacheCookies.getGroupId(),
        goodsCategorys:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    async created() {
      var groupRes = await GroupService.doGetOneGroupById(this.groupId);
      groupRes.data.areaId = groupRes.data.areaId+"";
      this.group = groupRes.data;
      if(this.group.groupType == 101) {
        //代表人武部
        //根据其areadId的层级确定其是省 市 区
        this.sm.search.tradingAreaId = this.group.id;
      } else {
        //反之代表镇和村
        //如果generalId为null 则代表是镇，反之为村
        if(this.group.generalId) {
          this.sm.search.groupId = this.group.id;
        } else {
          this.sm.search.generalId = this.group.id;
        }
      }
      this.doPage();

      //初始化分类
      this.goodsCategorys = await GoodsService.doSearchTreeByGroup(ConfigUtil.getTradingAreaId());
      this.goodsCategorys.forEach(function (goodsCategory) {
        if(goodsCategory.nodes.length == 0) {
          delete goodsCategory.nodes;
        } else {
          goodsCategory.nodes.forEach(function (scategory) {
            if (scategory.nodes.length == 0) {
              delete scategory.nodes;
            }
          });
        }
      })
    },
    methods: {
      init() {

      },
      handleCurrentChange(page) { //点击分页的组件
        this.sm.page = page;
        this.doPage();
      },
      doReset() {
        console.log("doReset");
        this.sm = {};
        this.doPage();
      },
      async doPage(){
        var res = await GoodsService.doPage(this.sm);
        if(res.status != 1) {
          return
        }
        this.totalCount = res.total;
        res.data.forEach(function (goods) {
          goods.totalQuantity = goods.quantity+goods.occupiedQuantity;
        })
        this.pageList = res.data;

        if(this.pageList.length==0) {
          this.loadingText = '暂无装备信息';
        }
      },
      doExport() {

      },
      toAU(id) {
        var url = "/equipment/equipment_list/equipment_au";
        if(id) {
          url+="?id="+id;
        }
        this.$router.push(url);
      },
      handleSelectionChange() {

      },
      goodsCategorySelect() {

      }
    }
  }
</script>
