<template>
  <div>
      <el-dialog title="选择参与人员"  width="660px" :visible="show"  :before-close="handleClose">
        <el-transfer
            :titles="['待选', '已选']"
            filterable
            v-model="value"
            @change="handleChange"
            :data="generateData">

        </el-transfer>
        <el-row style="margin-top:20px">
          <el-col :span="24" align="right">
            <el-button size="small" type="primary" @click="doSelect" :loading="doing">确定报名</el-button>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth';
  import { mapGetters } from 'vuex'
  import ConfigUtil from '@/utils/ConfigUtil'
  import UserService from '@/api/UserService'
  import MarketingSceneService from '@/api/MarketingSceneService'

  export default {
    name:"UserSelect",
    props: {
      archiveType:String,
      marketingSceneId:String
    },
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        show:false,
        tableHeaderClass: {background: '#f0f0f0'},
        sm:{groupBatchNumber:ConfigUtil.getTradingAreaId(), areaId:""},
        pageList:[],
        value:[],
        totalCount:0,
        pageSize:10,
        selectedRows:[],
        doing:false,
      }
    },
    computed: {
      ...mapGetters([
        'area'
      ]),
      generateData(){
        let data=[];
        let that=this;
        if(this.pageList.length==0)return;
        this.pageList.forEach(item=>{
          data.push({
            key: item.id,
            label: item.name
          });
        })
        return data;
      },
    },
    mounted() {

      this.doPage();
    },
    watch: {
    },
    methods: {
      open() {
        this.show = true;
      },
      close() {
        this.show = false;
      },
      handleSelectionChange(rows) {
        var that = this;
        rows.forEach(function (item) {
          that.selectedRows(item);
        });
      },
      async doPage() {
        var that = this;
        this.loadingText = '正在加载,请稍后...';
        this.sm.archiveType = this.archiveType;
        var res = await UserService.doPage(this.sm, this.currentPage, this.pageSize);
        this.loadingText = '暂无信息';
        if(res.status != 1) {
          return
        }
        this.totalCount = res.total;
        this.pageList = res.data;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPage();
      },
      async doSelect() {
        var res=await MarketingSceneService.doJionMarketingScene({
          marketingSceneId:this.marketingSceneId,
          jionUserId:this.value.join(',')
        })
        if(res.status==1){
          this.$message({
            showClose: true,
            message: '报名成功',
            type: 'success',
          });
          this.show=false;
          this.$emit('jioned')
//          this.$router.back();
        }
      },
      handleClose(){
        this.close();
      },
      handleChange(value, direction, movedKeys){

      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
