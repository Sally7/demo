<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <el-form :model="shop" :rules="rules" ref="shop" label-position="left" class="form-content zj-trisect">
        <p class="form-title">基本信息</p>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item class="item-vertical" prop="name" label="店铺名称">
              <el-input size="small" v-model="shop.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="主营业务">
              <el-input size="small" v-model="shop.mainBusiness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="店铺简介">
              <el-input size="small" v-model="shop.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item class="item-vertical" label="营业时间">
              <el-time-select
                :picker-options="timeOptions"
                v-model="shop.openTime"
                placeholder="开始时间">
              </el-time-select> 至
              <el-time-select
                :picker-options="timeOptions"
                v-model="shop.closedTime"
                placeholder="结束时间">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="item-vertical" label="分店图片" prop="logoUrl">
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
        <el-form-item class="item-vertical" label="是否样板店铺" prop="isTemplate">
          <el-switch v-model="shop.isTemplate"></el-switch>
        </el-form-item>
        <el-form-item class="item-vertical" label="企业类型" prop="groupTypeId">
          <el-radio-group v-model="shop.groupTypeId">
            <el-radio v-for="item in groupTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="name">
          <label class="label">选择产品</label>
          <el-radio-group>
            <el-radio label="超级顾问"></el-radio>
            <el-radio label="超级排号"></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item class="item-vertical" label="所属商圈" prop="groupRationList">
          <el-checkbox-group v-model="RationList">
            <el-checkbox v-for="ration in groupRations" :key="ration.id" :label="ration.id">{{ration.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="form-title">联系方式</p>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item class="item-vertical" label="联系人" prop="managerName">
              <el-input size="small" v-model="shop.managerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="手机号码" prop="phone">
              <el-input size="small" v-model="shop.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="固定电话">
              <el-input size="small" v-model="shop.contact"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="form-title">地址信息</p>
        <div class="form-content">
          <bmap :addressModel="addressModel" :address="address" @addressInfo="getAddress"></bmap>
        </div>

        <p class="form-title">设置</p>
        <el-form-item class="item-vertical" label="分类设置" v-if="false">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-tree
                :data="shopGoodsCategories"
                default-expand-all
                :expand-on-click-node="false"
                node-key="id"
                :props="defaultShopGoodsCategory"
                 @node-click="handleNodeClick">
              </el-tree>
            </el-col>
            <el-col :span="16">
              <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="goods"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
                <el-table-column
                  prop="title"
                  label="商品">
                </el-table-column>
                <el-table-column
                  prop="shopPrice"
                  label="门店价">
                </el-table-column>
                <el-table-column
                  label="操作"
                  type="selection"
                  width="55">
                </el-table-column>
              </el-table>
              <el-pagination class="text-right"
                             background
                             layout="prev, pager, next"
                             :page-size="pageSize"
                             :total="totalCount"
                             :current-page="currentPage"
                             @current-change="handleCurrentChange"
                             v-if="goods.length>0">
              </el-pagination>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item class="item-vertical" label="品牌设置">
              <el-col :span="16" class="labels-wrap">
                <el-input size="small"></el-input>
                <div class="tags">
                  <el-tag size="small"
                    closable>
                    标签
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="8">
                <el-button size="small" type="primary" @click="dialogBrandsVisible = true">设置品牌</el-button>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="item-vertical" label="分类列表">
              <el-col :span="16" class="labels-wrap">
                <el-input size="small"></el-input>
                <div class="tags">
                  <el-tag size="small"
                    closable>
                    标签
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="8">
                <el-button size="small" type="primary">选择分类</el-button>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="form-title">详细描述</p>
        <div class="form-content" style="width: 500px;">
          <tinymce :height="300"></tinymce>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button size="small">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('shop')" :loading="disabled">保存</el-button>
    </div>

    <el-dialog title="选择品牌" :visible.sync="dialogBrandsVisible">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-tree
            :data="goodsCategories"
            default-expand-all
            :expand-on-click-node="false"
            node-key="id"
            :props="defaultGoodsCategory"
             @node-click="handleCategoryNodeClick">
          </el-tree>
        </el-col>
        <el-col :span="16">
          <!-- <div class="retrieval-wrap">
              <ul class="ui-retrieval" >
                  <li ng-show="false">
                      <div class="retrieval-item">
                          <span class="hot-icon"></span>
                      </div>
                  </li>
                  <li v-for="brandLetter in brandFirstLetters"  ng-click="doSelectBrandLetter(brandLetter)">
                      <div class="retrieval-item" ng-class="{'selected':brandLetter.key == currentBrandLetterKey}">{{brandLetter.key}}</div>
                  </li>
              </ul>
          </div> -->
          <div class="brand-list">
              <ul>
                  <li class="brand-box" v-for="brand in brandList">
                      <div class="brand-item">
                          <div class="brand-icon"></div>
                          <div class="brand-info">
                              <h4 class="ui-nowrap">{{brand.name}}</h4>
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import cacheCookies from '@/utils/auth'
  import ConfigUtil from '@/utils/ConfigUtil'
  import Bmap from '@/components/Bmap'
  import Tinymce from '@/components/Tinymce'
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'
  import GoodsService from '@/api/GoodsService'

  export default {
    data() {
      return {
        dialogBrandsVisible: false,
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        dialogImageUrl: '',
        dialogVisible: false,
        typeView: "",
        areaId: "16000100100000",
        addressModel: {},
        address: "南京南站",
        shop: {
          generalId: cacheCookies.getGroupId(),
          name: "",
          status: 1,
          isTemplate: false, //是否样板店铺
          groupTypeId: 1, //企业类型
          groupRationList: [], //所属商圈
          logoUrl: ""
        },
        rules: {
          name: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' }
          ],
          logoUrl: [
            { required: true, message: '请上传分店图片', trigger: 'blur' }
          ],
          /*groupRationList: [
            { required: true, message: '请选择所属商圈', trigger: 'blur' }
          ],*/
          managerName: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ],
        },
        RationList: [],
        fileList: [],
        groupTypes: [ //所有企业类型
          {id: 1, name: "餐饮"},
          {id: 2, name: "普通企业"},
          {id: 3, name: "电商企业"},
          {id: 4, name: "汽配企业"}
        ],
        groupRations: [ //所有商圈
          {id: "402881ae4cd4a25a014cd4f8bbf3000f", name: "报贝"}
        ],
        disabled: false,
        timeOptions: {
          start: '00:00',
          step: '01:00',
          end: '23:00'
        },
        shopGoodsCategories: [], //餐饮商品分类
        defaultShopGoodsCategory: { //默认餐饮商品分类
          children: 'children',
          label: 'label'
        },
        goodsCategories: [], //所有商品分类
        defaultGoodsCategory: { //所有餐饮商品分类
          children: 'children',
          label: 'label'
        },
        goods: [],
        brandList: [], //品牌
        pageSize:10,//每页放多少条数据
        currentPage:1, //当前选中的页数
        totalCount:0,//总的数据页数
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    components: {
      Breadcrumb,
      Bmap,
      Tinymce
    },
    created() {
      if(this.$route.query.id){//处理修改逻辑

      }
      this.typeView = "update";
      this.doSearchShopCategories();
      this.doSearchTree();
      //this.init();
    },
    methods: {
      init() {
        var that = this;
        if(this.typeView === "update") {
          AreaService.doGetArea({id: this.areaId}).then(res => {
            if(res.status) {

              that.addressModel = res.data;
              console.log(that.addressModel);
            }
          })
        }
      },
      //获取所有餐饮商品分类
      async doSearchShopCategories(){
        var that = this;
        var response = await GoodsService.doSearchTreeJson();
        //console.log(response);
        if(response.status == 1){
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
            that.shopGoodsCategories.push(parent);
          })
        }
      },
      //根据商品分类查询商品
      async doSearchGoodsPage(node){
        this.categoryNode = node;
        var response = await GoodsService.doSearchGoodsPage({
          page: this.currentPage,
          count: this.pageSize,
          search: {
            shopId: node.shopId,
            shopCategoryId: node.id,
            status: 1,
            sortExp: "createTime desc"
          }
        });
        if(response.status == 1){
          this.totalCount = response.total;
          this.goods = response.data;
        }
      },
      //获取所有行业商品分类
      async doSearchTree(){
        var that = this;
        var response = await GoodsService.doSearchTree();
        //console.log(response);
        if(response.status == 1){
          response.data.forEach(function(item, index){
            var parent = { children: [] };
            parent.id = item.id;
            parent.label = item.name;
            if(item.nodes && item.nodes.length>0){
              item.nodes.forEach(function(node, index){
                var child = {};
                child.id = node.id;
                child.label = node.name;
                child.pid = node.pid;
                parent.children.push(child);
              })
            }
            that.goodsCategories.push(parent);
          })
        }
      },
      // 根据分类id查询品牌
      async doSearchByCategory(id){
        var response = await GoodsService.doSearchByCategory(id);
        if(response.status == 1){
          this.brandList = response.data;
          //console.log(this.brandList);
        }
      },
      handleNodeClick(data){
        //console.log(data);
        this.doSearchGoodsPage(data);
      },
      handleCategoryNodeClick(data){
        //console.log(data);
        this.doSearchByCategory(data.id);
      },
      handlePictureSuccess(res, file){
        //console.log(res);
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.name = res.relative;
        this.fileList.push(fileParam);

        this.shop.logoUrl = "";
        this.fileList.forEach(function(item, index){
          if(that.shop.logoUrl){
            that.shop.logoUrl += (","+item.name);
          }else{
            that.shop.logoUrl = item.name;
          }
        });
        console.log(that.shop.logoUrl);
      },
      /*handleChange(file, fileList){
        //console.log(fileList);
        this.fileList = fileList.slice(-3);
        console.log(this.fileList);
      },
      handleRemove(file, fileList) {
        console.log(fileList);
      },*/
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getAddress(e) {
        console.log(e);
        this.shop.latitude = e[0].lat;
        this.shop.longitude = e[0].lng;
        this.shop.address = e[1];
      },
      handleCurrentChange(page) { //点击分页的组件
        console.log(page);
        this.currentPage = page;
        this.doSearchGoodsPage();
      },
      doAU(formName){
        var that = this;
        console.log(typeof that.shop.openTime);
        //this.disabled = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //console.log(that.shop);
            that.doShopAU();
          } else {
            console.log('error submit!!');
            that.disabled = false;
            return false;
          }
        });
      },
      async doShopAU(){
        var that = this;
        this.RationList.forEach(function(ration, index){
          var tempObj = {};
          tempObj.tradingAreaId = ration;
          tempObj.tradingAreaType = "1";
          that.shop.groupRationList.push(tempObj);
        })
        console.log(that.shop);
        var response, auType;
        if(this.shop.id){ //修改
          response = await GroupService.doUpdateGroup(this.shop);
          auType = "修改";
        } else{ //添加
          response = await GroupService.doAddCompany(this.shop);
          auType = "添加";
        }
        if (response.status === 1){
          this.$message({
            message: auType+'成功!',
            type: 'success'
          });
          this.$router.back();
          this.disabled = false;
        }else {
          this.$message.error(auType+'失败!');
          this.disabled = false;
        }
      }
    }
  }
</script>

<style scoped>
  .form-title {
    margin-left: -20px;
  }
  .zj-trisect {

  }
  .zj-trisect .label {
    display: block;
    line-height: 1.5;
    color: #5a5e66;
  }
  .zj-trisect .el-input {
    max-width: 260px;
  }
  .labels-wrap {
    display: inline-block;
    position: relative;
  }
  .labels-wrap .el-input {
    max-width: 100%;
  }
  .labels-wrap .tags {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 12px;
  }


/* dialog */
.ui-retrieval{
    padding: 10px 0;
    overflow: hidden;
}
.ui-retrieval>li{
    float: left;
    padding-left: 7px;
    padding-right: 6px;
    padding-bottom: 10px;
    -webkit-box-sizing: border-box;
}
.retrieval-item{
    width:24px;
    height:24px;
    color: #666;
    font-size:14px;
    border: 1px solid #cccccc;
    border-radius: 50%;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    cursor: pointer;
}
.retrieval-item.selected{
    color: #fff;
    background-color:#CD2B3A;
}
.hot-icon{
    display: block;
    width:12px;
    height: 12px;
    /* background-image: url("../img/hot_1.png"); */
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
}
.retrieval-item.selected .hot-icon{
    /* background-image: url("../img/hot_2.png"); */
}
.brand-list{
    margin: 0 -10px 0 2px;

}
.brand-list ul{
    overflow: hidden;
}
.brand-box{
    width: 25%;
    height: 65px;
    float: left;
    padding-right: 15px;
    padding-bottom:10px;
    box-sizing: border-box;
    background-color: #fff;
}
.brand-item{
    width:100%;
    height:100%;
    padding: 0 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    cursor: pointer;
}
.brand-item.selected{
    border-color:#CD2B3A;
}
.brand-icon{
    width: 40px;
    height: 40px;
    float: left;
    margin: 6px 15px 7px 0;
    background-size: cover;
}
.brand-info{
    padding-top: 20px;
    padding-bottom: 20px;
}
.brand-info h4{
    font-size: 14px;
}
.brand-info p{
    font-size: 12px;
    color: #777;
}
</style>
