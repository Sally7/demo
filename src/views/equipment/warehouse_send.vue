<style>
  .help-desc {
    padding-left: 70px;
    color: #999;
  }
</style>
<template>
  <div class="app-container" id="wrapper">
    <Breadcrumb class="breadcrumb-container"></Breadcrumb>
    <div class="app__content">
      <div class="search-box">
        <el-form :model="model" :rules="rules" ref="modelForm">
          <p class="form-title">基础信息</p>
          <el-form-item label="出库时间" label-width="80px" prop="equipmentDay">
            <el-date-picker
                style="width: 200px;"
                :picker-options="pickerOptions"
                size="small"
                v-model="model.expectDate"
                type="date"
                :editable=true
                format="yyyy年MM月dd日"
                placeholder="请选择日期"
                value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出库类型" label-width="80px" prop="outInWarehouse">
            <el-select v-model="model.outInWarehouse" size="small" placeholder="请选择">
              <el-option
                  v-for="item in outInWarehouseList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" label-width="80px" prop="remark">
            <el-input
                style="width: 300px;"
                size="small"
                type="textarea"
                placeholder="请输入内容"
                v-model="model.note"
                maxlength="200"
                show-word-limit
            >
            </el-input>
          </el-form-item>
          <p class="form-title">附件</p>
          <el-form-item label="出库凭证">
            <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :file-list="fileList"
                :on-success="handlePictureSuccess"
                :on-preview="handlePictureCardPreview">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
      <!--<el-row v-if="pageList.length>0">-->
      <el-row>
        <el-col :span="24" class="text-left" style="padding-left: 10px;margin-top: 30px">
          <!--<el-checkbox>当页全选</el-checkbox>-->
          <el-button plain size="small" type="primary" @click="show=true">选择出库装备</el-button>
          <el-button v-if="false" plain size="small">批量打印</el-button>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="pageList"
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">

        <el-table-column
            align="right"
            label=""
            v-if="false"
        >
          <template slot-scope="scope">
            <img :src="scope.row.showUrl" style="width: 40px;height:40px;">
          </template>
        </el-table-column>
        <el-table-column
            align="left"
            label="商品名称"
            prop="title"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="单位"
            prop="unitName">
        </el-table-column>
        <el-table-column
            align="center"
            label="出库数量"
            prop="quantity">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.count" :min="0" size="small"
                             @change="(value) => handleChange(value, scope)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="出库量"
            prop="">
        </el-table-column>
        <el-table-column
            v-if="false"
            align="center"
            label="当前成本价（元）	"
            prop="sex">
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
        >
          <template slot-scope="scope">
            <el-popover
                ref="popover"
                placement="top"
                width="200"
                v-model="scope.row.visible">
              <p>确定删除{{pageList[scope.$index].title}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="removeItemFromCart(scope.$index),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>移除</el-button>
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
    <div class="footer">
      <el-button size="small" type="primary" @click="doAU()" :loading="doAUing">保存</el-button>
    </div>
    <el-dialog title="请选择出库装备" width="760px" :visible="show" :before-close="handleClose">
      <el-row>
        <el-col>
          <goods-select @dynamicFormFucn="onDynamicForm"></goods-select>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import GoodsService from '@/api/GoodsService';
  import OrderService from '@/api/OrderService';
  import cacheCookies from '@/utils/auth';
  import GroupService from '@/api/GroupService';
  import ConfigUtil from '@/utils/ConfigUtil';
  import GoodsSelect from '@/components/GoodsSelect';
  import Breadcrumb from '@/components/Breadcrumb'
  export default {
    data() {
      return {
        model: {
          groupId: cacheCookies.getGroupId(),
          businessType: 4024000000000000,
          orderType: 2,
          expectDate: '',
          cartIds: [],
          note: '',
          notes: '',
        },
        reason: '',
        rules: {},
        show: false,
        doAUing: false,
        expectDate: [{required: true, message: '请选择出库时间', trigger: 'change'}],
        outInWarehouseList: [
          {
            value: '1',
            label: '装备征用',
          },
          {
            value: '2',
            label: '装备报废',
          },
          {
            value: '3',
            label: '装备借出',
          },
          ],
        fileList: [],
        uploadUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        loadingText: '',
        tableHeaderClass: {background: '#f0f0f0'},
        sm: {page: 1, count: 20, search: {status: 1, sortExp: 'createTime desc'}},
        totalCount: 0,
        pageList: [],
        group: null,
        groupId: cacheCookies.getGroupId(),
        goodsCategorys: [],
        pickerOptions: {
          disabledDate:function (time) {
            return (time.getTime() + 24 * 3600 * 1000) > Date.now()
          }
//          shortcuts: [
//            {
//              text: '最近一周',
//              onClick(picker) {
//                const end = new Date();
//                const start = new Date();
//                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//                picker.$emit('pick', [start, end]);
//              },
//            }, {
//              text: '最近一个月',
//              onClick(picker) {
//                const end = new Date();
//                const start = new Date();
//                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
//                picker.$emit('pick', [start, end]);
//              },
//            }, {
//              text: '最近三个月',
//              onClick(picker) {
//                const end = new Date();
//                const start = new Date();
//                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
//                picker.$emit('pick', [start, end]);
//              },
//            }],
        },
      };
    },
    components: {
      GoodsSelect,
      Breadcrumb
    },
    async created() {
      var groupRes = await GroupService.doGetOneGroupById(this.groupId);
      groupRes.data.areaId = groupRes.data.areaId + '';
      this.group = groupRes.data;
      if (this.group.groupType == 101) {
        //代表人武部
        //根据其areadId的层级确定其是省 市 区
        this.sm.search.tradingAreaId = this.group.id;
      } else {
        //反之代表镇和村
        //如果generalId为null 则代表是镇，反之为村
        if (this.group.generalId) {
          this.sm.search.groupId = this.group.id;
          this.model.groupId = this.group.id;
        } else {
          this.sm.search.generalId = this.group.id;
        }
      }
//      this.doPage();

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
      handleChange(val) {
        console.log(val);
      },
      onDynamicForm(ev) {
        this.show = false;
        console.log('收获选择商品：', ev);
        this.pageList = ev;

      },
      handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handlePictureSuccess(res, file) {
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.name = res.relative;
        this.fileList.push(fileParam);

        this.model.picurl = '';
        this.fileList.forEach(function(item, index) {
          if (that.model.picurl) {
            that.model.picurl += (',' + item.name);
          } else {
            that.model.picurl = item.name;
          }
        });
        console.log('文件上传成功后', fileParam);
      },
      handleDownload(file) {
        console.log(file);
      },

      init() {

      },
      handleCurrentChange(page) { //点击分页的组件
        this.sm.page = page;
        this.doPage();
      },
      doReset() {
        console.log('doReset');
        this.sm = {};
        this.doPage();
      },
      async doPage() {
        var res = await GoodsService.doPage(this.sm);
        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;
        res.data.forEach(function(goods) {
          goods.totalQuantity = goods.quantity + goods.occupiedQuantity;
        });
        this.pageList = res.data;

        if (this.pageList.length == 0) {
          this.loadingText = '暂无装备信息';
        }
      },
//      出库操作
      async doAU() {

        let cartIds = [];
        let item;
        if (this.pageList.length == 0) {
          this.$message.error('请选择商品');
          return;
        }
        for (let i = 0; i < this.pageList.length; i++) {
          item = this.pageList[i];
          let cart = await OrderService.doCartSetCount({groupId: item.groupId, goodsId: item.id, count: item.count});
          if (!item.count) {
            this.$message.error('请输入商品出库数量');
            return;
          }
          cartIds.push(cart.id);
        }
        this.model.cartIds = cartIds.join(',');
        this.model.notes = (this.model.reason || '') + '||' + (this.model.note || '');
        this.model.picUrl = (this.fileList[0] && this.fileList[0].url) ? this.fileList[0].url : '';
        await OrderService.doOrderAdd(this.model);
        this.resetCart();
        this.$message({
          message: '出库成功',
          type: 'success'
        });
      },

      /**
       * 清空购物车
       */
      resetCart() {
        this.model.note = '';
        this.model.reason = '';
        this.model.expectDate = '';
        this.pageList = [];
        this.fileList = [];
      },

      removeItemFromCart(index) {
        this.pageList.splice(index, 1);
      },
      handleClose() {
        this.show = false;
      },
      doExport() {

      },

      handleSelectionChange() {

      },
      goodsCategorySelect() {

      },
    },
  };
</script>
