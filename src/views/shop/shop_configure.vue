<template>
  <div class="app-container" id="wrapper">
      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="app__content">
        <div class="zj-list zj-border-b">
          <div class="zj-li">
            <div class="zj-avatar"></div>
            <div class="zj-list-info">
              <h4>店铺名称：<span>博世车联</span></h4>
              <p class="mt10">账户：<span class="mr20">admin@101</span> 联系人：<span>姚小兵</span><span class="ml10">13555555555</span></p>
            </div>
          </div>
        </div>

        <el-form label-width="100px" label-position="left" class="pt20">
          <el-form-item label="小程序">
            <router-link class="link" to="/shop/shop_manage/shop_bind?type=1" v-if="!isBind">
              绑定小程序
            </router-link>
            <div class="form-item-info" v-else>
              <span class="wx-icon"></span>
              <span>服务号</span>
              <span class="unbind ml10">解绑</span>
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

  export default {
    data() {
      return {
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
    methods: {
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
    background-color: red;
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
  .form-item-info>span {
    display: inline-block;
    vertical-align: middle;
  }
  .wx-icon {
    width: 30px;
    height: 30px;
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
