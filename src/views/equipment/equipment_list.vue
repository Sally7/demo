<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">固定资产库</div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建资产</el-button>
        <el-button type="primary" size="small" plain v-if="false">导入资产</el-button>
        <el-button type="primary"  size="small" plain @click="toReceive">新建入库</el-button>
        <el-button type="primary"  size="small" plain @click="toSend">新建出库</el-button>
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
          <el-form-item label="资产名称">
            <el-input v-model="sm.search.titleKeyword" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="资产型号">
            <el-input v-model="sm.search.artNo" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-width="70px">
          <el-form-item label="资产分类">
            <el-cascader
                size="small"
                style="width: 100%"
                v-model="sm.search.categoryId"
                :props="{ value: 'id',label:'name',children:'nodes' }"
                :options="goodsCategorys"
                filterable
                clearable
                @change="goodsCategorySelect"></el-cascader>
          </el-form-item>
          <el-form-item label="资产用途">
            <el-select  style="width: 100%" size="small" v-model="sm.search.userType" clearable>
              <el-option v-for="option in useTypes" :key="option.id" :label="option.name" :value="option.name" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button plain size="small" v-if="false">导出</el-button>
            <el-button type="text" v-if="false">查看已导出的列表</el-button>
            <el-button type="text" @click="currentPage=1;doReset()">重置筛选条件</el-button>
            <el-button type="text" @click="searhBoxDetail=!searhBoxDetail">{{searhBoxDetail?'收起':'更多搜索'}}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i></el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px; ">
        <el-col :span="8" class="text-left" style="padding-left: 10px">
          <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
          <el-button plain size="small" style="margin-left: 10px">删除</el-button><el-button plain size="small">批量设置</el-button>
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
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            align="center"
            label="资产名称"
            prop="title">
        </el-table-column>
        <el-table-column
            align="center"
            label="资产型号"
            prop="artNo">
        </el-table-column>
        <el-table-column
            align="center"
            label="单位"
            prop="unitName">
        </el-table-column>
        <el-table-column
            align="center"
            label="占用库存"
            prop="occupiedQuantity"
            >
        </el-table-column>
        <el-table-column
            align="center"
            label="实时库存"
            prop="quantity">
        </el-table-column>
        <el-table-column
            align="center"
            label="总库存"
            prop="totalQuantity">
        </el-table-column>
        <el-table-column
            align="right"
            label="操作">
          <template slot-scope="scope">
            <el-button class="ml10" type="text" size="small"  slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
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
import GoodsService from '@/api/GoodsService'
import cacheCookies from '@/utils/auth'
import GroupService from '@/api/GroupService'
import ConfigUtil from '@/utils/ConfigUtil'
import AreaSelect from '@/components/AreaSelect/index'
import {mapGetters, mapState} from 'vuex';
import multiselect from '@/mixins/multiselect';
import RecordSelected from '@/components/RecordSelected/index.vue';

export default{
  components: {
    AreaSelect,
    RecordSelected
  },
  computed: {
    ...mapGetters([
      'area'
    ]),
  },
  mixins: [multiselect],
  data() {
    return {
      loadingText:'正在加载,请稍后...',
      tableHeaderClass: {background: '#f0f0f0'},
      sm:{page:1, count:20, search:{status:1, titleKeyword:""}},
      resetSM:null,
      totalCount:0,
      pageList:[],
      group:null,
      groupId:cacheCookies.getGroupId(),
      goodsCategorys:[],
      useTypes:[{id:1,name:"抗洪抢险"},{id:2,name:"维稳"}],
      tranmap:{key:'id',label:'title',desc:'desc'},
      searhBoxDetail: false,
    }
  },
  async created() {
    var groupRes = await GroupService.doGetOneGroupById(this.groupId);
    groupRes.data.areaId = groupRes.data.areaId+"";
    this.group = groupRes.data;

    this.sm.search.groupId = this.group.id;
    this.resetSM = JSON.parse(JSON.stringify(this.sm));

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
        this.mixinCurrentChange();
        this.sm.page = page;
        this.doPage();
        this.mixinSetSelectRow()
    },
    doReset() {
      console.log("doReset");
      this.sm = JSON.parse(JSON.stringify(this.resetSM));
      this.doPage();
    },
    async doPage(){
      if(this.$refs.smArea) {
        ConfigUtil.getAreaSM(this.sm.search, this.$refs.smArea.getArea(), this.group.id);
      }
      var res = await GoodsService.doPage(this.sm);
      if(res.status != 1) {
        return
      }
      this.totalCount = res.total;
      res.data.forEach(function (goods) {
        goods.totalQuantity = goods.quantity+goods.occupiedQuantity;
      })
      this.tableData=this.pageList = res.data;
      this.$nextTick(() => { //获取列表数据后
        this.mixinSetSelectRow();
      });

      if(this.pageList.length==0) {
        this.loadingText = '暂无装备信息';
      }
    },
    doExport() {
      let sels=[],ids=[];
      sels=this.mixinGetAllSelectionData();
      for(let i=0;i<sels.length;i++){
        ids.push(sels[i].id);
      }
      console.log(ids.join(','));
    },
    toAU(id) {
      var url = "/equipment/equipment_list/equipment_au";
      if(id) {
        url+="?id="+id;
      }
      this.$router.push(url);
    },
    toReceive() {
      var url = "/equipment/equipment_list/warehouse_receive";
      this.$router.push(url);
    },
    toSend() {
      var url = "/equipment/equipment_list/warehouse_send";
      this.$router.push(url);
    },
    handleSelectionChange(rows) {
      this.mixinHandleSelectionChange(rows);
    },
    goodsCategorySelect(categorys) {
      this.sm.search.categoryId = categorys[categorys.length-1];
      console.log(this.sm);
    }
  }
}
</script>

