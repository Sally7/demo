<template>
  <div id="goods-select">
    <div>
      <div class="preview-wrap-margin ">
        <el-row>
          <el-col :span="18">
            <el-button v-if="false">新增</el-button>
            <el-button v-if="false">草稿管理</el-button>
            <el-button v-if="false" @click="doSearchGoodsPage()">刷新</el-button>
          </el-col>
          <el-col :span="6">
            <el-input  size="mini" placeholder="请输入房源号" suffix-icon="el-icon-search" v-model="goodsSearch" @input="inputHandle"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="preview-wrap-margin">
        <el-row>
          <el-col :span="5">
            <aside class="new-aside">
              <ul role="menubar" class="el-menu">
                <div class="menu-wrapper">
                  <el-tree :data="shopGoodsCategories" :props="defaultProps" ref="tree" @node-click="goodsCategorySelect"></el-tree>
                </div>
              </ul>
            </aside>
          </el-col>
          <el-col :span="19">
            <el-table
                ref="multipleTable"
                :data="goods"
                tooltip-effect="light"
                style="width: 100%;white-space: nowrap"
                :row-key="getRowKeys"
                :header-row-style="{background: '#f0f0f0'}"
                :row-style="{height:'60px'}"
                @selection-change="handleSelectionChange">
              <el-table-column type="selection" :reserve-selection="true"></el-table-column>
              <el-table-column label="" width="60">
                <template slot-scope="scope">
                  <img :src="scope.row.showUrl" style="width: 30px;height:30px;" v-if="false">
                </template>
              </el-table-column>
              <el-table-column prop="title" label="房源名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column align="left" label="房源面积">
                <template slot-scope="scope">
                  {{scope.row.quadrature}}㎡
                </template>
              </el-table-column>
              <el-table-column prop="createDate" label="租赁单价" width="190">
                <template slot-scope="scope">
                  {{scope.row.presentPrice}}元/㎡·天
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="text-right">
        <el-row type="flex" class="text-right">
          <div class="counts-wrap mb15" v-if="true">已选择{{selectionCount}}个<span style="margin: 0px 35px"></span>共{{totalCount}}条数据，每页显示{{sm.count}}条
          </div>
          <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                :page-size="sm.count"
                layout=" prev, pager, next, jumper"
                small
                :total="totalCount">
            </el-pagination>
          </div>
        </el-row>
      </div>
      <div class=" preview-wrap-margin">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button type="primary" size="mini" @click="comitGoods" :disabled="multipleSelection.length==0">{{multipleSelection.length==0?'请选择':'确认'}}</el-button>
        </el-row>
      </div>
    </div>

  </div>

</template>


<script>
import cacheCookies from '@/utils/auth';
import GoodsService from '@/api/GoodsService';
import TimeUtils from '@/utils/TimeUtil';

export default {
  name: 'index',
  directives: {
    color: function(el) {
      el.style.backgroundColor = 'red';
    },
  },
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      totalCount: 0,
      multipleSelection: [],
      selectionCount: 0,
      defaultProps: {
        label: 'label',
      },
      shopGoodsCategories:[],
      sm:{
        page: 1,
        count: 10,
        search: {
          quantity:1,
          status: 1,
          sellStatus:1,
          showType: 10,
          sortExp: 'createTime desc',
          groupId: cacheCookies.getGroupId()
        }
      },
      goods: [],
      goodsSearch: '',
      getRowKeys(row) {
        return row.id;
      },
    };
  },
  props: {
    selectedGoodss: {
      type: Array,
    },
    selectType:{
      type:Number
    }
  },
  created() {
    this.doSearchShopCategories()
    this.doSearchGoodsPage();
  },
  methods: {
    async doSearchShopCategories(){
      var that = this;
      var response = await GoodsService.doSearchTreeJson();
      //console.log(response);
      if(response.status == 1){
        var shopGoodsCategories = [];
        response.data.forEach(function(item, index){
          var parent = { children: [] };
          parent.id = item.id;
          parent.shopId = item.shopId;
          parent.label = item.name;
          if(item.nodes && item.nodes.length>0){
            item.nodes.forEach(function(node, index){
              var child = {};
              child.id = node.id;
              child.label = node.name;
              child.pid = node.pid;
              child.shopId = node.shopId;
              parent.children.push(child);
            })
          }
          shopGoodsCategories.push(parent);
        })
        that.shopGoodsCategories = shopGoodsCategories;
      }
    },
    comitGoods() {
      console.log(this.multipleSelection);
      this.$emit('selected', this.multipleSelection);
    },
    clearMultipleSelection() {
      console.log('+++++++');
      console.log(this.dynamicFormData);
      console.log('--------')
      this.multipleSelection = this.dynamicFormData;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectionCount = this.multipleSelection.length;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.doSearchGoodsPage();
    },
    async doSearchGoodsPage() {
      var res = await GoodsService.doPage(this.sm);
      if (res.status == 1 && res.data.length > 0) {
        this.totalCount = res.total;
        res.data.forEach(function(item, index) {
          item.createDate = TimeUtils.formatTime(item.createDate, 'Y-M-D H:m:s');
        });
        this.goods = res.data;
      } else {
        this.goods = [];
      }
    },
    async inputHandle() {
      this.sm.page = 1;
      this.doSearchGoodsPage();
    },
    goodsCategorySelect(item) {
      console.log('goodsCategorySelect', item);
      this.currentGoodsCategory = item;
      this.sm.search.shopCategoryId = item.id;
      this.sm.page = 1;
      this.doSearchGoodsPage();
    },
  }
};
</script>

<style>
.preview-wrap-margin {
  margin-top: 15px;
  font-size: Small;
}
.counts-wrap {
  padding: 0 10px;
  text-align: left;
  color: #333;
  margin-top: 4px;
  margin-right: 20px;

}

#goods-select {
  background-color: #ffffff;

}
</style>
