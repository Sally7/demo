<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <el-form :model="model" :rules="rules" ref="modelForm" label-width="80px" class="form-content">
          <el-row>
            <el-col :span="24">
              <el-form-item label="租赁企业" prop="groupIndex">
                <el-select
                    v-model="model.groupIndex"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder="请输入企业名称关键词"
                    :remote-method="pageGroups"
                    @change="groupSelected"
                    :loading="loading">
                  <el-option
                      v-for="(group,index) in groups"
                      :key="group.id"
                      :label="group.name"
                      :value="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="租赁房源" prop="title" >
                <el-tag
                    :key="goods.id"
                    v-for="goods in goodss"
                    closable
                    :disable-transitions="false"
                    @close="handleTagClose(goods)"
                   >
                  {{goods.title}}
                </el-tag>
                <el-button type="primary" size="mini" @click="open">选择房源</el-button>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="租赁单价" >
                </el-input><label v-if="goodss.length>0">{{goodss[0].presentPrice}}</label>元/㎡·天
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="租赁面积" >
                </el-input><label v-if="goodss.length>0">{{goodss[0].quadrature}}</label>㎡
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="开始日" prop="serviceStartDate" >
                <el-date-picker
                    v-model="model.serviceStartDate"
                    type="date"
                    @change="dateChange"
                    placeholder="选择日期"
                    value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="退租日" prop="serviceEndDate" >
                <el-date-picker
                    v-model="model.serviceEndDate"
                    align="right"
                    type="date"
                    @change="dateChange"
                    placeholder="选择日期"
                    value-format="timestamp"
                    :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="总计租金" prop="title" >
                <el-input v-model="model.realPrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="合同附件" prop="imageUrl">
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="合同备注" prop="title" >
                <el-input type="textarea" v-model="model.notes"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="footer">
            <el-button size="small" type="primary" @click="doAU()" :loading="doAUing">保存</el-button>
        </div>
        <!--右侧栏结束-->
      </div>
    </div>

    <el-dialog title="请选择房源" width="760px" height="80%" :visible="goodsSelectShow" :before-close="handleClose">
      <el-row>
        <el-col>
          <goods-select-by-shop-category @selected="goodsSelected"></goods-select-by-shop-category>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import ConfigUtil from '@/utils/ConfigUtil'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import GoodsSelectByShopCategory from '@/components/GoodsSelectByShopCategory';

  import GoodsService from "../../api/GoodsService";
  import GroupService from "../../api/GroupService";
  import OrderService from "../../api/OrderService";
  import BuildingsService from "../../api/BuildingsService";
  import {mapGetters, mapState} from 'vuex';
  import cacheCookies from "../../utils/auth";

  export default {
    data() {
      return {
        model:{id:this.$route.query.id, orderType:2, businessType:211000000000000000, goodsId:"", count:1, notes:"", serviceStartDate:"", serviceEndDate:"", realPrice:0},
        goodsSelectShow:false,
        fileList: [],
        goodsCategorys:[{id:"",nodes:[],name:""}],
        units:[{"name":"件","id":1},{"name":"瓶","id":2},{"name":"只","id":3},{"name":"袋","id":4},{"name":"包","id":5},{"name":"箱","id":6},{"name":"盒","id":7},{"name":"条","id":8},{"name":"听","id":9},{"name":"杯","id":10},{"name":"提","id":11},{"name":"捆","id":12},{"name":"码","id":13},{"name":"把","id":14},{"name":"本","id":15},{"name":"台","id":16},{"name":"块","id":17},{"name":"对","id":18},{"name":"套","id":19},{"name":"双","id":20},{"name":"钱","id":21},{"name":"克","id":22},{"name":"两","id":23},{"name":"斤","id":24},{"name":"公斤","id":25},{"name":"吨","id":26},{"name":"担","id":27}],
        size:'small',
        dialogVisible: false,
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        dialogImageUrl: '',
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          groupIndex:[{required: true, message: '请选择租赁企业', trigger: 'change' }],
          serviceStartDate:[{required: true, message: '请选择开始日', trigger: 'change' }],
          serviceEndDate:[{required: true, message: '请选择退租日', trigger: 'change' }]
        },
        doAUing:false,
        loading:false,

        group:{},
        groups:[],
        groupSM:{page: 1, count: 20},

        goods:{},
        goodss:[],
        goodsSM:{page: 1, count: 20},


        goodsSelect: {
          lazy: true,
          async lazyLoad (node, resolve) {
            const { level } = node;
            console.log("goodsSelect...");

            let res = await BuildingsService.searchBuilding({shopId: this.area.townId});

            setTimeout(() => {
              var id = 1;
              const nodes = Array.from({ length: level + 1 })
                  .map(item => ({
                    value: ++id,
                    label: `选项${id}`,
                    leaf: level >= 2
                  }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }, 1000);
          }
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '1年',
            onClick(picker) {
              const date = new Date();
              date.setFullYear(date.getFullYear()+1);
              date.setDate(date.getDate());
              picker.$emit('pick', date);
            }
          }, {
            text: '2年',
            onClick(picker) {
              const date = new Date();
              date.setFullYear(date.getFullYear()+2);
              date.setDate(date.getDate());
              picker.$emit('pick', date);
            }
          }, {
            text: '3年',
            onClick(picker) {
              const date = new Date();
              date.setFullYear(date.getFullYear()+3);
              date.setDate(date.getDate());
              picker.$emit('pick', date);
            }
          }, {
            text: '4年',
            onClick(picker) {
              const date = new Date();
              date.setFullYear(date.getFullYear()+4);
              date.setDate(date.getDate());
              picker.$emit('pick', date);
            }
          }, {
            text: '5年',
            onClick(picker) {
              const date = new Date();
              date.setFullYear(date.getFullYear()+5);
              date.setDate(date.getDate());
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    watch:{

    },
    components: {
      ElFormItem,
      Breadcrumb,
      GoodsSelectByShopCategory
    },
    async created(){
      var that = this;
      ConfigUtil.getAreaSM(this.groupSM, this.area, this.groupId);


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

      var id = this.$route.query.id;
      if(id) {
        var res = await GoodsService.doGet(id);
        this.model = res;
      }

    },
    methods: {
      handlePictureSuccess(res, file){
        //console.log(res);
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.name = res.relative;
        this.fileList.push(fileParam);

        this.model.attachmentUrl = "";
        this.fileList.forEach(function(item, index){
          if(that.model.attachmentUrl){
            that.model.attachmentUrl += (","+item.name);
          }else{
            that.model.attachmentUrl = item.name;
          }
        });
        console.log(that.model.attachmentUrl);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      doCancel() {
        this.$router.back();
      },
      goodsCategorySelect(categorys) {
        this.model.categoryId = categorys[categorys.length - 1];
        console.log("goodsCategorySelect....",this.model,categorys);
      },
      async doAU() {
        this.doAUing = true;
        var that = this;

        console.log("doAU...", this.model);

        this.$refs.modelForm.validate(async (valid) => {
          if(!valid) {
            that.$message({
              showClose: true,
              message: "请检查必填项",
              type: 'warning'
            });
            that.doAUing = false;
            return;
          }

          if(that.goodss.length==0) {
            that.$message({
              showClose: true,
              message: "请选择房源",
              type: 'warning'
            });
            that.doAUing = false;
            return;
          }

          this.model.groupId = cacheCookies.getGroupId();
          this.model.goodsId = that.goodss[0].id;

          if(that.model.id) {
            that.model = await GoodsService.doUpdate(that.model);
            this.$router.back();
          } else {
            var realPrice = that.model.realPrice;
            that.model = await OrderService.doAdd(that.model);
            await OrderService.doUpdateRealPrice({id:that.model.id, startRealPrice:realPrice})

            this.$confirm('添加成功，是否继续新建?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              that.doAUing = false;
              that.model = {id:that.$route.query.id, orderType:2, businessType:211000000000000000, goodsId:"", count:1, notes:"", serviceStartDate:"", serviceEndDate:""};
              that.goodss = [];
              that.groups = [];
              that.group = {};
              that.fileList = [];
            }).catch(() => {
              this.$router.back();
            });
          }
        })
      },
      async pageGroups(query) {
        if (query !== '') {
          this.loading = true;
          this.groupSM.name = query;
          var res = await GroupService.doPage(this.groupSM);
          this.groups = res.data;
          this.loading = false;
        } else {
          this.groups = [];
        }
      },
      groupSelected(index) {
        console.log("groupSelected...",this.groups[index]);
        this.model.buyerId = this.groups[index].adminId;
        this.model.buyerName = this.groups[index].name;
        console.log(this.model);
      },
      handleClose() {
        this.goodsSelectShow = false;
      },
      open() {
        this.goodsSelectShow = true;
      },
      goodsSelected(goodss) {
        console.log("goodsSelected。。。",goodss);
        this.goodss = goodss;
        this.handleClose();
      },
      handleTagClose(tag) {
        this.goodss.splice(this.goodss.indexOf(tag), 1);
      },
      dateChange(){
        console.log("dateChange....");
        if(this.model.serviceStartDate && this.model.serviceEndDate && this.goodss.length>0) {
          console.log("dateChanged....");
          var day = Math.floor((this.model.serviceEndDate - this.model.serviceStartDate) / (1000 * 60 * 60 * 24));
          this.model.realPrice = (this.goodss[0].presentPrice*this.goodss[0].quadrature*day).toFixed(2);
          console.log( day,this.model);
        }
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .form-title {
    padding: 15px 0;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
  }
  .counts-wrap {
    padding: 0 10px;
    text-align: right;
    color: #333;
    font-size: 14px;
  }
  .pagination {
    text-align: right;
  }
  .avatar-uploader {
    line-height: 14px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 48px;
    display: block;
  }
  .el-upload__tip {
    line-height: 13px;
  }
  .footer {
    width: 1040px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -435px;
    padding: 10px 0;
    text-align: center;
    z-index: 99;
    background-color: #ffffcc;
  }

  .coupon-box {
    margin-left: 35px;
    max-width: 320px;
    background-color: #F8F8F8;
    border: 1px solid #D7D7D7;
  }
  .coupon-box + .coupon-box {
    margin-top: 10px;
  }
  .coupon-box .coupon {
    padding: 8px 0;
    margin: 0 20px 0 5px;
    vertical-align: middle;
  }
  .coupon-box .coupon + .coupon {
    border-top: 1px dashed #ccc;
  }
  .coupon>span, .coupon>.spec, .coupon>.name {
    vertical-align: middle;
  }
  .coupon>span {
    display: inline-block;
  }
  .spec {
    display: inline-block;
    padding: 2px 11px;
    font-size: 12px;
    color: #fff;
    background-color: #008000;
  }
  .name {
    display: inline-block;
    max-width: 80px;
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333;
  }
  .limit {
    color: #999;
  }
  .amount {
    margin-left: 10px;
    color: #333;
  }
  .del {
    margin-left: 10px;
    color: #aaa;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 14px;
  }

  .base-info-mousein {
    border:1px solid #409EFF;
    border-bottom: none;
    padding: 10px 5px;
  }

  .detail-info-mousein {
    border:1px solid #409EFF;
    border-top: none;
    padding: 10px 5px;
  }
</style>
