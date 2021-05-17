<template>
  <div class="app-container" id="wrapper">
      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="app__content">
        <div class="zj-list zj-border-b">
          <div class="zj-li">
            <div class="zj-avatar" :style="{backgroundImage: 'url('+shop.showUrl+')'}"></div>
            <div class="zj-list-info">
              <h4>店铺名称：<span>{{shop.name}}</span></h4>
              <p class="mt10">账户：<span class="mr20">admin@101</span> 联系人：<span>{{shop.managerName}}</span><span class="ml10">{{shop.phone}}</span></p>
            </div>
          </div>
        </div>

        <el-form label-width="100px" label-position="left" class="pt20">
          <el-form-item label="公众号">
            <el-button type="text" size="medium" @click="toBind" v-if="gzhAccounts.length==0">绑定公众号</el-button>
            <div class="form-item-info" v-else>
              <span class="mr20" v-for="gzhAccount in gzhAccounts">
                <span class="wx-icon" :style="{backgroundImage: 'url('+gzhAccount.logoUrl+')'}"></span>
                <span>{{gzhAccount.name}}</span>
                <span class="unbind ml10" @click="unbind">解绑</span>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="小程序">
            <el-button type="text" size="medium" @click="toBind" v-if="xcxAccounts.length==0">绑定小程序</el-button>
            <div class="form-item-info" v-else>
              <span class="mr20" v-for="xcxAccount in xcxAccounts">
                <span class="wx-icon" :style="{backgroundImage: 'url('+xcxAccount.logoUrl+')'}"></span>
                <span>{{xcxAccount.name}}</span>
                <span class="unbind ml10" @click="unbind">解绑</span>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="账号数">
            <div class="form-item-info" v-if="!isAccountsEdit" @click="accountsEdit">
              <span>{{accounts}}</span>
              <span class="operation ml10">编辑</span>
            </div>
            <el-row v-else>
              <el-col :span="6">
                <el-input v-model="accounts" placeholder="请输入账号数"></el-input>
              </el-col>
              <el-col :span="10">
                <span class="operation ml10" @click="doConfirmAccounts">确定</span>
                <span class="operation ml10" @click="doCancelAccounts">取消</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="ERP配置">
            <el-form-item label="URL:">
              <el-row>
                <el-col :span="8">
                  <span v-if="!isErpEdit">{{erpUrl}}</span>
                  <el-input v-else placeholder="请输入url"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="数据库:" class="mt10">
              <el-row>
                <el-col :span="8">
                  <span v-if="!isErpEdit">{{erpDatabase}}</span>
                  <el-input v-else placeholder="https://"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="form-item-info" v-if="!isErpEdit">
              <span class="operation" @click="erpEdit">编辑</span>
            </div>
            <div class="form-item-info" v-else>
              <span class="operation" @click="doConfirmErp">确定</span>
              <span class="operation ml10" @click="doCancelErp">取消</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import GroupService from '@/api/GroupService'
  import ShopWeixinService from '@/api/ShopWeixinService'

  export default {
    data() {
      return {
        id: "",
        shop: {},
        gzhAccounts: [], //公众号
        xcxAccounts: [], //小程序可以绑定多个
        isBind: false,
        accounts: 0,
        lastAccounts: 0,
        isAccountsEdit: false,
        erpUrl: "未编辑",
        lastErpUrl: "",
        erpDatabase: "未编辑",
        isErpEdit: false,
      }
    },
    components: {
      Breadcrumb
    },
    created(){
      this.id = this.$route.query.id;
      this.init();
    },
    methods: {
      async init(){
        var response = await GroupService.doGetOneGroupById(this.id);
        this.shop = response.data;
        this.doSearchIMAccount(1);
        this.doSearchIMAccount(3);
      },
      /**
      * 查询绑定的公众号/小程序
      * 公众号 platformType:1
      * 小程序 platformType:3
      **/
      async doSearchIMAccount(type){
        var searchParam = {
          groupId: this.id,
          businessType: 1, //超级顾问
          platformType: type
        };
        var response = await ShopWeixinService.doSearchIMAccount(searchParam);
        if(response.status == 1 && response.data && response.data.length>0){
          if(type === 1){
            this.gzhAccounts = response.data;
          }else if(type === 3){
            this.xcxAccounts = response.data;
          }
        }
      },
      toBind(){

      },
      unbind(){

      },
      accountsEdit() {
        this.isAccountsEdit = true;
        this.lastAccounts = this.accounts;
      },
      doConfirmAccounts() {
        this.isAccountsEdit = false;
      },
      doCancelAccounts() {
        this.isAccountsEdit = false;
        this.accounts = this.lastAccounts;
      },
      erpEdit() {
        this.isErpEdit = true;
        this.lastErpUrl = this.erpUrl;
      },
      doConfirmErp() {
        this.isErpEdit = false;
      },
      doCancelErp() {
        this.isErpEdit = false;
        this.erpUrl = this.lastErpUrl;
      }
    }
  }
</script>

<style scoped>
  .mr20{
    margin-right: 20px;
  }
  .zj-list {
    width: 100%;
    line-height: 1.5;
  }
  .zj-list>.zj-li {
    padding: 10px 0;
    display: flex;
    flex-direction: row;
  }
  .zj-avatar {
    width: 60px;
    height: 60px;
    margin: 0 10px 0 0;
    background-size: cover;
  }
  .zj-list-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .zj-list-info h4, .zj-list-info p {
    color: #666;
    font-size: 14px;
    font-weight: normal;
  }
  .zj-list-info span {
    display: inline-block;
    color: #000;
    font-weight: bold;
  }
  .zj-border-b {
    border-bottom: 1px solid #e0e0e0;
  }
  .mr20 {
    margin-right: 20px;
  }

  .link {
    color: #409EFF;
  }
  .form-item-info span {
    display: inline-block;
    vertical-align: middle;
  }
  .wx-icon {
    width: 30px;
    height: 30px;
    background-size: cover;
    background-color: #409EFF;
  }
  .unbind {
    color: #F56C6C;
    cursor: pointer;
  }
  .operation {
    cursor: pointer;
    color: #409EFF;
  }
</style>
