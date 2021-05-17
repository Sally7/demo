<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <el-form :model="model" :rules="rules" ref="modelForm" label-width="80px" class="form-content">
          <el-row>
            <el-col :span="10">
              <el-form-item label="资产分类" prop="categoryId" >
                <el-cascader
                        :size="size"
                        style="width: 100%"
                        v-model="model.categoryId"
                        :props="{ value: 'id',label:'name',children:'nodes' }"
                        :options="goodsCategorys"
                        filterable
                        @change="goodsCategorySelect"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="资产名称" prop="title" >
                <el-input v-model="model.title" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="资产型号" prop="artNo" >
                <el-input v-model="model.artNo" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="单价" prop="price" >
                <el-input v-model="model.price" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="资产图片" prop="imageUrl">
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
            <el-col :span="6">
              <el-form-item label="库存单位" prop="unitName" >
                <el-select
                  :size="size"
                  style="width: 100%"
                  v-model="model.unitName"
                  filterable
                  allow-create
                  default-first-option
                  >
                  <el-option
                    v-for="option in units"
                    :key="option.id"
                    :label="option.name"
                    :value="option.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!--<el-row>-->
            <!--<el-col :span="10">-->
              <!--<el-form-item label="装备库存" prop="quantity" >-->
                <!--<el-input v-model="model.quantity" size="small"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
        </el-form>

        <div class="footer">
            <el-button size="small" type="primary" @click="doAU()" :loading="doAUing">保存</el-button>
        </div>
        <!--右侧栏结束-->
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import ConfigUtil from '@/utils/ConfigUtil'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import GoodsService from "../../api/GoodsService";
  export default {
    data() {
      return {
        model:{id:this.$route.query.id,quantity:0,categoryId:0},
        fileList: [],
        goodsCategorys:[{id:"",nodes:[],name:""}],
        units:[{"name":"件","id":1},{"name":"瓶","id":2},{"name":"只","id":3},{"name":"袋","id":4},{"name":"包","id":5},{"name":"箱","id":6},{"name":"盒","id":7},{"name":"条","id":8},{"name":"听","id":9},{"name":"杯","id":10},{"name":"提","id":11},{"name":"捆","id":12},{"name":"码","id":13},{"name":"把","id":14},{"name":"本","id":15},{"name":"台","id":16},{"name":"块","id":17},{"name":"对","id":18},{"name":"套","id":19},{"name":"双","id":20},{"name":"钱","id":21},{"name":"克","id":22},{"name":"两","id":23},{"name":"斤","id":24},{"name":"公斤","id":25},{"name":"吨","id":26},{"name":"担","id":27}],
        size:'small',
        dialogVisible: false,
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        dialogImageUrl: '',
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          title: [
            {required: true, message: '请输入装备名称', trigger: 'change' },
            {min: 1, max: 100, message: '长度在 1 到 100 个字', trigger: 'change' }
          ],
          artNo:[{required: true, message: '请输入装备型号', trigger: 'change' }],
          categoryId:[{required: true, message: '请选择装备分类', trigger: 'change' }],
          unitName:[{required: true, message: '请选择单位', trigger: 'change' }]
        },
        doAUing:false,
      }
    },
    components: {
      ElFormItem,
      Breadcrumb
    },
    async created(){
      var that = this;

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

        this.model.imageUrl = "";
        this.fileList.forEach(function(item, index){
          if(that.model.imageUrl){
            that.model.imageUrl += (","+item.name);
          }else{
            that.model.imageUrl = item.name;
          }
        });
        console.log(that.model.imageUrl);
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

          that.model.sellStatus = 1;

          if(that.model.id) {
            that.model = await GoodsService.doUpdate(that.model);
            this.$router.back();
          } else {
            that.model = await GoodsService.doAdd(that.model);
            this.$confirm('添加成功，是否继续新建?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              that.doAUing = false;
              that.model = {};
            }).catch(() => {
              this.$router.back();
            });
          }
        })
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
