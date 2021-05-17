<template>
  <div id="goods-select">
    <div style="width: 720px">
      <div style="margin-left:-20px;margin-top: -39px">
        <hr style='background-color:#C0C4CC; height:1px; border:none;width:101.4%;'>
      </div>
      <div class="preview-wrap-margin ">
        <el-row>
          <el-col :span="18">
            <el-button v-if="false">新增</el-button>
            <el-button v-if="false">草稿管理</el-button>
            <el-button v-if="false" @click="doSearchGoodsPage()">刷新</el-button>
          </el-col>
          <el-col :span="6">
            <el-input  size="mini" placeholder="请输入装备名" suffix-icon="el-icon-search" v-model="goodsSearch" @input="inputHandle"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="preview-wrap-margin">
        <el-row>
          <el-table
              ref="multipleTable"
              :data="goods"
              tooltip-effect="light"
              style="width: 100%;font-size: 12px;white-space: nowrap"
              :row-key="getRowKeys"
              :header-row-style="{background: '#f0f0f0',height:'60px'}"
              :row-style="{height:'60px'}"
              :cell-style="{padding:'0px'}"
              @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column label="" width="60">
              <template slot-scope="scope">
                <img :src="scope.row.showUrl" style="width: 30px;height:30px;" v-if="false">
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="left" label="装备型号" prop="artNo">
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" width="190"></el-table-column>
          </el-table>
        </el-row>
      </div>
      <div class=" preview-wrap-margin">
        <el-row type="flex" class="row-bg" justify="start">
          <div class="counts-wrap mb15" v-if="true">已选择{{selectionCount}}个商品<span style="margin: 0px 35px"></span>共{{totalCount}}条数据，每页显示{{pageSize}}条
          </div>
          <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                layout=" prev, pager, next, jumper"
                small
                :total="totalCount">
            </el-pagination>
          </div>
        </el-row>
      </div>
      <div class=" preview-wrap-margin">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button type="primary" size="mini" @click="comitGoods">确认</el-button>
          <el-button v-if="false" @click="clearMultipleSelection">获取父组件data</el-button>
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
        pageSize: 8,
        page: 1,
        multipleSelection: [],
        selectionCount: 0,
        goods: [],
        goodsSearch: '',
        getRowKeys(row) {
          return row.id;
        },
      };
    },
    props: {
      dynamicFormData: {
        type: Array,
      },
    },
    created() {
      this.doSearchGoodsPage();
      this.multipleSelection = this.dynamicFormData;
    },
    methods: {
      comitGoods() {
        console.log(this.multipleSelection);
        this.$emit('dynamicFormFucn', this.multipleSelection);
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
      async doSearchGoodsPage(params) {
        params = params || {
          page: this.page,
          count: this.pageSize,
          search: {
            status: 1,
            sellStatus:1,
            showType: 10,
            sortExp: 'createTime desc',
            groupId: cacheCookies.getGroupId()
          },
        };
        var res = await GoodsService.doPage(params);
        if (res.status == 1 && res.data.length > 0) {
          this.totalCount = res.total;
          res.data.forEach(function(item, index) {
            item.createDate = TimeUtils.formatTime(item.createDate, 'Y-M-D H:m:s');
          });
          this.goods = res.data;
        }
      },
      async inputHandle() {
        let prm = {
          page: this.page,
          count: this.pageSize,
          search: {
            status: 1,
            sellStatus:1,
            sortExp: 'createTime desc',
            groupId: cacheCookies.getGroupId(),
            titleKeyword:this.goodsSearch
          },
        };
        this.doSearchGoodsPage(prm);
      },
    },
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
    font-size: 12px;
    margin-top: 4px;
    margin-right: 20px;

  }

  #goods-select {
    background-color: #ffffff;

  }
</style>
