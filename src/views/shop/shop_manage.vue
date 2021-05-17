<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">优惠券</div>
    <div class="app__content">
      <el-row class="mb15">
        <el-col :span="20"><el-button type="primary" size="mini" @click="toShopAU">+添加店铺</el-button></el-col>
        <el-col :span="4" class="text-right">
          <el-input
            size="mini"
            placeholder="请输入搜索内容"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-table class="mb15"
              :empty-text="loadingText"
              :data="shopList"
              :header-row-style="tableHeaderClass"
              style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="店铺名称"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="adminUser.account"
          label="账户">
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="validDate"
          label="授权有效期">
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="managerName"
          label="联系人">
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="validDate"
          label="门店数-账号数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="validDate"
          label="绑定状态"> -->
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small">修改</el-button>
            <el-popover
              ref="popover"
              placement="top"
              width="200"
              v-model="scope.row.visible">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(couponList[scope.$index].id),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
            <el-button type="text" size="small">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="shopList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="shopList.length>0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from '@/api/GroupService'

  export default {
    data() {
      return {
        //groupId: cacheCookies.getGroupId(),
        shopList: [],
        currentPage:1, //当前选中的页数
        pageSize:20,//每页放多少条数据
        totalCount:0,//总的数据页数
        loadingText:'正在加载,请稍后...',
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created(){
      //console.log(this.groupId);
      this.doPageShop();
    },
    methods: {
      async doPageShop(){
        this.couponList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        //var that = this;
        var response = await GroupService.doPageGroup({
          generalId: cacheCookies.getGroupId(),
          page:this.currentPage,
          count:this.pageSize
        });
        if(response.status === 1 && response.data.length > 0){
          this.totalCount = response.data.length;
          this.shopList = response.data;
          this.shopList.forEach(function(shop, index){
            shop.createDate = TimeUtils.formatTime(shop.createDate*1000, 'Y-M-D');
          })
        }else{
          this.loadingText ="暂无数据";
        }
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageShop();
      },
      toShopAU() {
        this.$router.push("/shop/shop_manage/shop_au");
      }
    }
  }
</script>

<style scoped>

</style>
