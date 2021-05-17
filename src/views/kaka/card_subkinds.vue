<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">套餐管理</div>
    <div class="app__content">
        <div>
          <el-row class="mb15">
            <el-col :span="20"><el-button type="primary" size="mini" @click="toCardSubkindAU('')">+添加套餐</el-button></el-col>
            <el-col :span="4" class="text-right" style="display: flex" v-if="false">
              <el-input size="mini" placeholder="请输入套餐名称" clearable>
              </el-input>
              <el-button size="mini" type="primary" style="margin-left: 20px">搜索</el-button>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="subkindsList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              align="center"
              label="卡券名称"
              prop="couponName">
            </el-table-column>
            <el-table-column
              align="center"
              label="套餐名称"
              prop="label">
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="toCardSubkindAU(scope.row.id)">修改</el-button>
                  <el-popover
                    ref="popover"
                    placement="top"
                    width="200"
                    v-model="scope.row.visible">
                    <p style="color:#999;margin-bottom: 10px;">{{'确定删除'+scope.row.label+'吗？'}}</p>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="scope.row.visible=false">取消</el-button>
                      <el-button type="primary" size="mini" @click="doDelete(scope.row.id);scope.row.visible=false">确定</el-button>
                    </div>
                    <el-button class="ml10" type="text" slot="reference">删除</el-button>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="subkindsList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="subkindsList.length>0">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from '@/api/GroupService'
  import CouponService from '@/api/CouponService'
  import KakaService from '@/api/KakaService'

  export default {
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        couponId: this.$route.query.couponId,
        goodsId: this.$route.query.goodsId,
        couponName: this.$route.query.name,
        subkindsList: [],
        loadingText:'正在加载,请稍后...',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      this.searchKSku();
    },
    methods: {
      async searchKSku(){
        this.subkindsList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var res = await KakaService.searchKSku({
           couponId: this.couponId
        });

        if(res.status === 1 && res.data.length > 0){
          var that = this;
          res.data.forEach(function(item, index){
            item.couponName = that.couponName;
          });
          this.subkindsList = res.data;
        }else{
          this.loadingText ="暂无数据";
        }
      },
      async doDelete(id){
        var res = await KakaService.deleltKSkuById({
          skuId: id
        });
        if(res.status === 1){
          if(res.data === 1){
            this.$message({
              message: '删除套餐成功!',
              type: 'success'
            });
          }else{
            this.$message.error('删除套餐失败!');
          }
        }else{
          this.$message({
            message: res.data,
            type: 'error'
          });
        }
      },
      toCardSubkindAU(id){
        this.$router.push("card_subkind_au?couponId="+this.couponId+"&goodsId="+this.goodsId+(id?"&id="+id:""));
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageAdmin();
      },
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .operation{
    margin-left: 10px;
  }
  .operation .el-icon-edit{
    cursor: pointer;
    color: #999;
    font-size: 14px;
  }
  .operation .el-icon-edit:hover{
    color: #333;
  }
</style>
