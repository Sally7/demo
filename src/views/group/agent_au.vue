<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <el-form :model="shop" :rules="rules" ref="shop" label-position="left" class="form-content zj-trisect">
        <p class="form-title">基本信息</p>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item class="item-vertical" prop="name" label="企业名称/个人姓名">
              <el-input size="small" placeholder="请输入企业名称或个人姓名" v-model="shop.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="主营业务">
              <el-input size="small" placeholder="请输入主营业务" v-model="shop.mainBusiness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="企业简介">
              <el-input size="small" placeholder="请输入企业简介" v-model="shop.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="item-vertical" label="介绍标签">
              <el-input size="small" placeholder="请输入介绍标签" v-model="shop.descTags"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        <div prop="address">
          <bmap :addressModel="addressModel" :address="shop.address" @addressInfo="getAddress"></bmap>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button size="small">取消</el-button>
      <el-button size="small" type="primary" @click="doAU('shop')" :loading="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import ConfigUtil from '@/utils/ConfigUtil'
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import Bmap from '@/components/Bmap'
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'
  import RoleService from '@/api/RoleService'

  export default {
    data() {
      return {
        //groupId: cacheCookies.getGroupId(),
        addressModel: {},
        id: "", //修改代理商信息时代理商id
        //店铺
        shop: {
          agentId: cacheCookies.getGroupId(), //代理商id
          auditingStatus: 0, //代理状态
          name:'',
          managerName:'',
          description:'',
          mainBusiness:'',
          phone:'',
          contact:'',
          status:1,
          groupType:8, //企业类型
          groupTypeId:'2c933e6762f244400162f258a6570010', //企业类型id
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
          areaId:'',
          address:'',
          longitude:'',
          latitude:'',
          roleIds:'', //店铺角色id拼接字符串
          isTemplate:0, //是否样板店铺
          tradingAreaId:"",
          templateGroupId:"",
          busRoute:"",
          brandLogos:"",
          descTags:"",
          groupRationList: [], //所属商圈
        },
        rules: {
          name: [
            { required: true, message: '请输入企业名称/个人姓名', trigger: 'blur' }
          ],
          managerName: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
        },
        disabled: false, //提交按钮禁用状态
        pageSize:10,//每页放多少条数据
        currentPage:1, //当前选中的页数
        totalCount:0,//总的数据页数
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    components: {
      Breadcrumb,
      Bmap
    },
    created() {
      if(this.$route.query.id){
        this.id = this.$route.query.id;
      }
      this.init();
    },
    methods: {
      async init() {
        var that = this;
        if(this.id){ //修改
          //todo查询选中企业
          var response = await GroupService.doGetOneGroupById(this.id);
          //response.data.roleIds = "ff8080815eba3061015ec830372c050e"; //添加店铺角色字段
          this.shop = response.data;
          //地理位置处理
          AreaService.doGetArea({id: this.shop.areaId}).then(res => {
            if(res.status) {
              that.addressModel = res.data;
            }
          });
        }
        var resData = await RoleService.doSearchTheGroupRoles(this.shop.agentId);
        resData.data.forEach(function(item){
          that.shop.roleIds += item.id + ","; //当前选中店铺角色id拼接字符串
        });
      },
      getAddress(e) {
        //console.log(e);
        this.shop.latitude = e[0].lat;
        this.shop.longitude = e[0].lng;
        this.shop.address = e[1];
        this.shop.areaId = e[2];
      },
      doAU(formName){
        //console.log(this.shop);
        var that = this;
        if(this.shop.address == ""){
            this.$message.error('请填写地址信息');
            return;
        }
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
        this.disabled = true;
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
      },
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
