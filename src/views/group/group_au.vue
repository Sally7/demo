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
          <el-col :span="8">
            <el-form-item class="item-vertical" label="介绍标签">
              <el-input size="small" v-model="shop.descTags"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="公交线路">
              <el-input size="small" v-model="shop.busRoute"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="所属商圈">
              <el-input size="small" v-model="shop.hotAreaName"></el-input>
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
          <el-col :span="8">
            <el-form-item class="item-vertical" label="报销热度">
              <el-input size="small" v-model="shop.starLevel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="item-vertical" label="店铺logo图片" prop="logoUrl">
          <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :file-list="fileList"
                  :on-success="handlePictureSuccess"
                  :on-remove="handlePictureRemove"
                  :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item class="item-vertical" label="店铺详情图片">
          <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :file-list="exhibitionFileList"
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleAvatarRemove"
                  :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">建议尺寸:750*300px</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item class="item-vertical" label="是否样板店铺" prop="isTemplate">
          <el-switch :active-value="1" :inactive-value="0" v-model="shop.isTemplate"></el-switch>
        </el-form-item>
        <el-form-item class="item-vertical" label="企业类型" v-if="groupTypes.length>0" prop="groupTypeId">
          <el-radio-group v-model="shop.groupTypeId" @change="selectGroupType">
            <el-radio v-for="groupType in groupTypes" :key="groupType.id" :label="groupType.id">{{groupType.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="item-vertical" label="店铺角色" v-if="roleList.length>0" prop="roleIds">
          <el-checkbox-group v-model="checkRoles" @change="selectGroupRole">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="item-vertical" label="所属商圈" v-if="groupRations.length>0" prop="groupRationList">
          <el-checkbox-group v-model="rationIdList">
            <el-checkbox v-for="ration in groupRations" :key="ration.id" :label="ration.id">{{ration.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="item-vertical" label="店铺样板" v-if="templateGroups.length>0" prop="templateGroupId">
          <el-radio-group v-model="shop.templateGroupId">
            <el-radio v-for="template in templateGroups" :key="template.id" :label="template.id">{{template.name}}</el-radio>
          </el-radio-group>
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
        <div>
          <bmap :addressModel="addressModel" :address="shop.address" @addressInfo="getAddress"></bmap>
        </div>

        <p class="form-title">设置</p>
        <!-- <el-form-item class="item-vertical" label="分类设置" v-if="false">
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
        </el-form-item> -->
        <el-form-item class="item-vertical" label="经营品牌">
          <el-col :span="12" class="labels-wrap">
            <el-input size="small"></el-input>
            <div class="tags">
              <el-tag size="small"
                      closable v-for="tag in choosedBrandList" :key="tag.id">
                {{tag.name}}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8" class="ml10">
            <el-button size="small" type="primary" @click="doShowBrandsDialog">设置品牌</el-button>
          </el-col>
        </el-form-item>
        <el-form-item class="item-vertical" label="设置分类">
          <el-tree
                  :data="goodsCategories"
                  show-checkbox
                  default-expand-all
                  :default-checked-keys="categoryIdList"
                  :expand-on-click-node="false"
                  node-key="id"
                  ref="tree"
                  :props="defaultGoodsCategory">
          </el-tree>
        </el-form-item>

        <p class="form-title">详细描述</p>
        <div class="form-content" style="width: 600px;">
          <tinymce id="editor" :height="300" :value="shop.content" @input="getEditorInfo"></tinymce>
        </div>
      </el-form>
      <DynamicForm :moduleId="moduleId" :modelId="modelId" ref="dynamicform" />
    </div>
    <div class="footer">
      <el-button size="small">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('shop')" :loading="disabled">保存</el-button>
    </div>

    <!-- <el-dialog title="选择品牌" :visible.sync="dialogBrandsVisible">
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
          <p class="text-center" v-if="isBrandEmpty">暂无数据</p>
          <div v-else>
            <div class="retrieval-wrap">
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
            </div>
            <div class="brand-list">
                <ul>
                    <li class="brand-box" v-for="brand in brandList">
                        <div class="brand-item" :class="{selected:brand.checked}" @click="brand.checked=!brand.checked;">
                            <div class="brand-icon"></div>
                            <div class="brand-info">
                                <h4 class="ui-nowrap">{{brand.name}}</h4>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBrandsVisible = false">取 消</el-button>
        <el-button type="primary" @click="doConfirm">确 定</el-button>
      </div>
    </el-dialog> -->
    <brands :dialogBrandsVisible="dialogBrandsVisible" :goodsCategories="goodsCategories" :choosedBrandList="choosedBrandList" @onPropsChange="change" @doChooseBrands="doChooseBrands"></brands>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import ConfigUtil from '@/utils/ConfigUtil'
  import TimeUtils from '@/utils/TimeUtil'
  import Bmap from '@/components/Bmap'
  import Brands from '@/components/Brands'
  import Tinymce from '@/components/Tinymce'
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'
  import GoodsService from '@/api/GoodsService'
  import RoleService from '@/api/RoleService'
  import DynamicForm from '@/components/DynamicForm/index'

  export default {
    data() {
      return {
        dialogBrandsVisible: false,
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        dialogImageUrl: '',
        dialogVisible: false,
        addressModel: {},
        id: "",
        //店铺
        shop: {
          name:'',
          managerName:'',
          description:'',
          mainBusiness:'',
          phone:'',
          contact:'',
          status:1,
          groupType:4, //企业类型
          cooperateLgistic:'无',
          transportCostsWay:'',
          openTime:'',
          closedTime:'',
          startDeliverTime:'',
          endDeliverTime:'',
          isOpenSMS:1,
          content:'',
          brandIds:'',
          categoryIds:'',
          logoUrl:'',
          address:'',
          longitude:'',
          latitude:'',
          roleIds:'', //店铺角色id拼接字符串
          isTemplate:0, //是否样板店铺
          groupTypeId:'',
          tradingAreaId:"",
          templateGroupId:"",
          busRoute:"",
          brandLogos:"",
          descTags:"",
          hotAreaName:"",
          starLevel:"",
          groupRationList: [] //所属商圈
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
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
        },
        fileList: [], //logo图片
        exhibitionFileList:[], //门店详情图片
        groupTypes: [], //所有企业类型
        initGroupTypeId: "", //当前店铺的企业类型（修改店铺时）
        roleList: [], //店铺角色
        initRoles: [], //存放当前店铺角色
        //checkRoleIds: "", //选中的店铺角色id拼接字符串
        checkRoles: [], //选中的店铺角色,用于前台展示
        groupRations: [], //所有商圈,用于前端展示,切换企业类型时可能会改变
        initGroupRations: [], //存储所有商圈，不会改变
        rationIdList: [], //绑定的所属商圈字段
        templateGroups: [], //选中的店铺角色下的所有店铺样板,用于前台展示，切换店铺角色时会跟着改变
        initTemplateGroupId: "", //只存放当前店铺所选中的店铺样板id,不会改变
        initTemplateGroups: [], //只存放当前店铺角色下查询到的店铺样板列表，店铺角色切换时不会改变
        disabled: false, //提交按钮禁用状态
        timeOptions: {
          start: '00:00',
          step: '01:00',
          end: '23:00'
        },
        /*shopGoodsCategories: [], //餐饮商品分类
        defaultShopGoodsCategory: { //默认餐饮商品分类
          children: 'children',
          label: 'label'
        },*/
        goodsCategories: [], //所有商品分类
        categoryIdList: [], //当前选中的分类(只存储id),只用于前台展示
        defaultGoodsCategory: { //默认选中商品分类
          children: 'children',
          label: 'label'
        },
        //goods: [],
        //branchGoods: [],
        isBrandEmpty: false, //品牌是否为空
        brandList: [], //所有品牌
        choosedBrandList: [], //选中的品牌,点击确认添加后生效
        //tempChoosedBrandList: [],//临时存放已选中品牌，用于前台展示
        pageSize:10,//每页放多少条数据
        currentPage:1, //当前选中的页数
        totalCount:0,//总的数据页数
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        modelId:this.$route.query.id,
        moduleId:'groups'
      }
    },
    components: {
      Breadcrumb,
      Bmap,
      Brands,
      Tinymce,
      DynamicForm,
    },
    created() {
      if(this.$route.query.id){//处理修改逻辑
        this.id = this.$route.query.id;
      }
      /*this.typeView = "update";*/
      this.init();
    },
    methods: {
      init() {
        //this.initCompany();
        //this.doSearchShopCategories();
        //this.doSearchBranchGoods();
        this.doSearchTree();
        this.doLoadGroupType();
        //var that = this;
      },
      //查询企业类型
      async doLoadGroupType(){
        var response = await GroupService.doSearchGrouptype();
        this.groupTypes = response.data;

        this.initCompany();
      },
      //获取商圈
      async doSearchRations(){
        var that = this;
        var response = await GroupService.doSearchRations(101);
        response.data.forEach(function(item){
          that.groupRations.push(item);
          that.initGroupRations.push(item);
        });
      },
      /**
       * 加载店铺信息
       */
      async initCompany(){
        var that = this;
        if(this.id){ //修改分店
          //todo查询选中企业
          var response = await GroupService.doGetOneGroupById(this.id);
          response.data.roleIds = ""; //添加店铺角色字段
          this.initGroupTypeId = response.data.groupTypeId; //存放当前店铺企业类型id
          this.initTemplateGroupId = response.data.templateGroupId; //存放当前店铺样板id
          this.shop = response.data;

          //处理logo图片
          if (this.shop.showUrl){
            var showArr = this.shop.showUrl.split(','); //绝对地址
            var logoArr = this.shop.logoUrl.split(','); //相对地址
            showArr.forEach(function(arr, index){
              var picFile = {};
              picFile.url = arr;
              picFile.name = logoArr[index];
              that.fileList.push(picFile);
            });
          }
          //处理详情图片
          this.exhibitionFileList = [];
          if(this.shop.exhibitionShowUrl){ //exhibitionFileList
            this.shop.exhibitionShowUrl.split(',').forEach(function(item, index){
              var exhibitionPicFile = {};
              exhibitionPicFile.url = item;
              exhibitionPicFile.relativeUrl = that.shop.exhibitionUrl.split(',')[index];
              that.exhibitionFileList.push(exhibitionPicFile);
            })
          }
          /**
           * 时间格式转换
           */
          //开始营业时间
          if(this.shop.openTime){
            this.shop.openTime = TimeUtils.formatTime(this.shop.openTime*1000, 'H:m');
          }
          //结束营业时间
          if(this.shop.closedTime){
            this.shop.closedTime = TimeUtils.formatTime(this.shop.closedTime*1000, 'H:m');
          }
          //开始送货时间
          if(this.shop.startDeliverTime){
            this.shop.startDeliverTime = TimeUtils.formatTime(this.shop.startDeliverTime*1000, 'H:m');
          }
          //结束送货时间
          if(this.shop.endDeliverTime){
            this.shop.endDeliverTime = TimeUtils.formatTime(this.shop.endDeliverTime*1000, 'H:m');
          }
          //地理位置处理
          AreaService.doGetArea(this.shop.areaId).then(res => {
            if(res.status) {
              that.addressModel = res.data;
            }
          });
          //所属商圈
          if(this.shop.groupRationList.length>0){
            this.shop.groupRationList.forEach(function(ration, index){
              that.rationIdList.push(ration.tradingAreaId);
            })
          }
          //查找所有店铺角色
          var res = await RoleService.doSearchRoleByGroupTypeId(this.shop.groupTypeId);
          this.roleList = res.data;

          //查找当前店铺角色
          var resData = await RoleService.doSearchTheGroupRoles(this.shop.id);
          resData.data.forEach(function(item){
            that.checkRoles.push(item.id); //当前选中的店铺角色，用于前台展示
            that.initRoles.push(item.id); //存放当前店铺角色
            that.shop.roleIds += item.id + ","; //当前选中店铺角色id拼接字符串
          });

          //根据店铺角色查找所有店铺样板
          var responseData = await RoleService.doGetTempleteGroupByRoleIds(this.shop.roleIds);
          this.templateGroups = responseData.data; //当前店铺角色下的店铺样板，用于前台展示
          this.initTemplateGroups = responseData.data; //存放当前店铺角色下的店铺样板

          //查询当前店铺选中的品牌
          GoodsService.doSearchByGroupId(this.id).then(res => {
            if(res.status == 1){
              res.data.forEach(function(brand){
                brand.checked = true;
                that.choosedBrandList.push(brand); //当前店铺选中的品牌，未确认之前都不会改变（删除品牌标签也会改变）
                //that.tempChoosedBrandList.push(brand); //存放当前选中的品牌，只用于前台展示
              });
            }
          });

          //查询当前店铺选中的分类
          GoodsService.doSearchCategoryByGroupId(this.id).then(res => {
            if(res.status == 1) {
              var categorys = res.data;
              categorys.forEach(function(category){
                that.categoryIdList.push(category.id);
              });
              //将当前选中的分类同步到树形控件上
              this.$refs.tree.setCheckedKeys(that.categoryIdList);
            }
          });
        }else { //添加分店
          this.shop.groupTypeId = this.groupTypes[0].id; //默认选择第一个企业类型
        }
        //企业类型选中且不是商圈时查找所属商圈
        //if(this.shop.groupTypeId && this.shop.groupType != 101){
          this.doSearchRations();
        //}
      },
      //选择企业类型改变时触发
      async selectGroupType(groupTypeId){
        //this.shop.roleIds = "";
        this.checkRoles = [];
        this.templateGroups = [];
        this.groupRations = [];
        var that = this;
        //如果企业类型不是商圈时则需要显示所属商圈，否则不显示
        if(groupTypeId == "8aafc0995b202488015b2028c9270004"){
          this.groupRations = [];
          this.rationIdList = []; //选中的所属商圈置空
        }else {
          this.initGroupRations.forEach(function(ration){
            that.groupRations.push(ration);
          });
        }
        //console.log(this.rationIdList)
        //根据groupTypeId查找所有店铺角色
        var res = await RoleService.doSearchRoleByGroupTypeId(groupTypeId);
        this.roleList = res.data;

        /**
         * 判断是否要显示当前店铺角色和店铺样板（只在修改店铺时才会考虑这种情况）：checkbox需要显示选中状态。
         * 只有切换到当前企业类型时才会显示当前店铺角色和店铺样板（相应的checkbox设置选中状态），否则切换到其他企业类型时，
         * 店铺角色和店铺样板均设置为非选中状态
         */
        if(this.initGroupTypeId == groupTypeId){
          this.initRoles.forEach(function(role){
            that.checkRoles.push(role);
          });
          this.initTemplateGroups.forEach(function(template){
            that.templateGroups.push(template);
          });
          this.shop.templateGroupId = this.initTemplateGroupId;
        }
      },
      //选择店铺角色改变时触发
      async selectGroupRole(checkRolesId){
        this.shop.roleIds = "";
        var that = this;
        checkRolesId.forEach(function(checkId){
          that.shop.roleIds += checkId + ",";
        });

        //根据店铺角色id查找所有店铺样板
        var response = await RoleService.doGetTempleteGroupByRoleIds(this.shop.roleIds);
        this.templateGroups = response.data;
      },
      //获取商品分类
      /*async doSearchShopCategories(){
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
      },*/
      //若是修改分店则先查出分店已经同步的商品  reviewStatus: '1',sellStatus:'1',
      /*async doSearchBranchGoods(){
        if(this.id){
          var response = await GoodsService.doSearchGoods({
            page: 1,
            count: this.pageSize,
            search: {
              shopId: this.id,
              status: 1,
              sortExp: "createTime desc"
            }
          });
          if(response.status == 1){
            this.branchGoods = response.data;
            //console.log(this.branchGoods);
            //this.doLoadData(1, 10, null);
          }
        }
      },*/
      //根据商品分类查询商品
      /*async doSearchGoodsPage(node){
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
      },*/
      //获取所有商品分类
      async doSearchTree(){
        var that = this;
        var response = await GoodsService.doSearchTree();
        //console.log(response);
        if(response.status == 1){
          response.data.forEach(function(item, index){//一级
            var parent = { children: [] };
            parent.id = item.id;
            parent.label = item.name;
            if(item.nodes && item.nodes.length>0){
              item.nodes.forEach(function(node, index){//二级
                var child = { children: [] };
                child.id = node.id;
                child.label = node.name;
                child.pid = node.pid;
                if(node.nodes && node.nodes.length>0){
                  node.nodes.forEach(function(subItem, index){//三级
                    var grandChild = {};
                    grandChild.id = subItem.id;
                    grandChild.label = subItem.name;
                    grandChild.pid = subItem.pid;
                    child.children.push(grandChild);
                  });
                }
                parent.children.push(child);
              });
            }
            that.goodsCategories.push(parent);
          });
          //console.log(that.goodsCategories)
        }
      },
      // 根据分类id查询品牌
      async doSearchByCategory(id){
        //this.tempChoosedBrandList = []; //切换分类时选中的品牌置空
        var that = this;
        var response = await GoodsService.doSearchByCategory(id);
        if(response.status == 1 && response.data && response.data.length>0){
          this.isBrandEmpty = false;
          response.data.forEach(function(item, index){
            item.categoryId = id;
            item.checked = false;
            that.choosedBrandList.forEach(function(choosedBrand, index){
              if(choosedBrand.id == item.id){
                item.checked = true;
              }
            });
          })
          this.brandList = response.data;
        }else {
          this.isBrandEmpty = true;
        }
      },
      doShowBrandsDialog(){
        this.dialogBrandsVisible = true;
      },
      //确认品牌选择并赋给品牌标签
      /*doConfirm(){
        var that = this;
        this.choosedBrandList = [];
        this.dialogBrandsVisible = false;
        this.brandList.forEach(function(brand){
          if(brand.checked){
            that.choosedBrandList.push(brand);
          }
        });
      },*/
      change(propName,newVal,oldVal){
        this[propName] = newVal;
      },
      doChooseBrands(e){
        this.choosedBrandList = [];
        if(e && e.length>0){
          var that = this;
          e.forEach(function(item){
            that.choosedBrandList.push(item);
          });
        }
      },
      handleCategoryNodeClick(data){
        this.doSearchByCategory(data.id);
      },
      handlePictureSuccess(res, file, fileList){
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.name = res.relative;
        this.fileList.push(fileParam);

        this.shop.logoUrl = "";
        this.fileList.forEach(function(item){
          if(that.shop.logoUrl){
            that.shop.logoUrl += (","+item.name);
          }else{
            that.shop.logoUrl = item.name;
          }
        });
      },
      handleAvatarSuccess(res,file,fileList) {
        console.log('上传门店详情成功！')
        console.log(this.exhibitionFileList)
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.relativeUrl = res.relative;
        this.exhibitionFileList.push(fileParam);
        this.shop.exhibitionUrl = "";
        this.exhibitionFileList.forEach(function(item){
          if(that.shop.exhibitionUrl){
            that.shop.exhibitionUrl += (","+item.relativeUrl);
          }else{
            that.shop.exhibitionUrl = item.relativeUrl;
          }
        });

      },
      handlePictureRemove(file, fileList){
        var that = this;
        this.shop.logoUrl = "";
        this.fileList = [];
        fileList.forEach(function(item){
          that.fileList.push(item);
          if(that.shop.logoUrl){
            that.shop.logoUrl += (","+item.name);
          }else{
            that.shop.logoUrl = item.name;
          }
        });
      },
      handleAvatarRemove(file, fileList) {
        var that = this;
        this.shop.exhibitionUrl = "";
        this.exhibitionFileList = [];
        fileList.forEach(function(item){
          that.exhibitionFileList.push(item);
          if(that.shop.exhibitionUrl){
            that.shop.exhibitionUrl += (","+item.relativeUrl);
          }else{
            that.shop.exhibitionUrl = item.relativeUrl;
          }
        });
      },
      //图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getAddress(e) {
        this.shop.latitude = e[0].lat?e[0].lat:this.shop.latitude;
        this.shop.longitude = e[0].lng?e[0].lng:this.shop.longitude;
        this.shop.address = e[1];
        this.shop.areaId = e[2];
      },
      getEditorInfo(e){
        //console.log(e)
        this.shop.content = e;
      },
      /*handleNodeClick(data){
        //console.log(data);
        this.doSearchGoodsPage(data);
      },*/
      /*handleCurrentChange(page) { //点击分页的组件
        //console.log(page);
        this.currentPage = page;
        this.doSearchGoodsPage();
      },*/
      doAU(formName){
        //console.log(this.groupTypes);
        if(this.shop.address == ""){
          this.$message.error('请填写地址信息');
          return;
        }
        /**
         *企业类型处理
         *因为企业类型关系到两个字段，而在表单中选择时只关联到一个字段，
         *所以需要在提交时把另一个关联的字段也加进去
         **/
        for(var s=0; s<this.groupTypes.length; s++){
          //因为企业类型是单选，所以只需要找到一个值就跳出循环
          if(this.shop.groupTypeId === this.groupTypes[s].id){
            this.shop.groupType = this.groupTypes[s].type;
            break;
          }
        }
        //console.log(this.shop);
        //时间处理
        this.turnTimestamp();
        var that = this;
        var brandIdsStr="";
        var categoyrIdsStr = "";

        //已选中品牌的id组合
        for(var i=0; i<this.choosedBrandList.length; i++){
          if(i == this.choosedBrandList.length-1){
            brandIdsStr += this.choosedBrandList[i].id;
            break;
          }else {
            brandIdsStr += this.choosedBrandList[i].id;
            brandIdsStr += ',';
          }
        }
        var categoryNodes = this.$refs.tree.getCheckedNodes(); //获取分类列表所有节点
        //删除父节点并获取节点的id
        var selectedIdList = [];
        categoryNodes.forEach(function(node, index){
          if(!node.children || node.children.length == 0){
            selectedIdList.push(node.id);
          }
        });
        //console.log(selectedIdList);
        //已选中分类的id组合
        for(var j=0;j<selectedIdList.length;j++){
          if(j == selectedIdList.length-1){
            categoyrIdsStr += selectedIdList[j];
            break;
          }else {
            categoyrIdsStr += selectedIdList[j];
            categoyrIdsStr += ',';
          }
        }
        this.shop.brandIds = brandIdsStr;
        this.shop.categoryIds = categoyrIdsStr;
        //console.log(this.shop.brandIds);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //验证动态表单
            this.$refs.dynamicform.checkForm(function(valid){
              if(valid){
                that.doShopAU();
              }
            })
            //console.log(that.shop);
          } else {
            console.log('error submit!!');
            that.disabled = false;
            return false;
          }
        });
      },
      async doShopAU(){
        var that = this;
        this.disabled = true;
        that.shop.groupRationList = [];
        if(this.rationIdList.length>0){
          this.rationIdList.forEach(function(ration, index){
            var tempObj = {};
            tempObj.tradingAreaId = ration;
            that.shop.groupRationList.push(tempObj);
          });
        }
        //console.log(that.shop);
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
          this.$refs.dynamicform.doAUDynamicFormItemValueRelations(response.data.id);
          this.$router.back();
          this.disabled = false;
        }else {
          this.$message.error(auType+'失败!');
          this.disabled = false;
        }
      },
      //转换为时间戳
      turnTimestamp(){
        //默认日期
        var defaultDate = '2018/01/01';
        if(this.shop.openTime){
          var openDt = defaultDate + ' ' + this.shop.openTime;
          this.shop.openTime = new Date(openDt).getTime()/1000;
        }
        if(this.shop.closedTime){
          var closeDt = defaultDate + ' ' +  this.shop.closedTime;
          this.shop.closedTime = new Date(closeDt).getTime()/1000;

        }
        if(this.shop.startDeliverTime){
          var startDeliverDT = defaultDate + ' ' +  this.shop.startDeliverTime;
          this.shop.startDeliverTime = new Date(startDeliverDT).getTime()/1000;
        }
        if(this.shop.endDeliverTime){
          var endDeliverDT = defaultDate + ' ' +  this.shop.endDeliverTime;
          this.shop.endDeliverTime = new Date(endDeliverDT).getTime()/1000;
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
    min-width: 110px;
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
    padding: 0 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #ddd;
    box-sizing: border-box;
    cursor: pointer;
  }
  .brand-item.selected{
    border-color:#F56C6C;
  }
  .brand-icon{
    width: 40px;
    height: 40px;
    margin-right: 10px;
    background-size: cover;
  }
  .brand-info{
  }
  .brand-info h4{
    font-size: 14px;
    line-height: 1.5;
  }
  .brand-info p{
    font-size: 12px;
    color: #777;
  }
</style>
