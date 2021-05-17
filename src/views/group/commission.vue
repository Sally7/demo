<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">佣金</div>
    <div class="app__content">
      <div class="zj-list zj-list-one zj-border-tb mb15">
        <div class="zj-li">
          <div class="zj-avatar"></div>
          <div class="zj-list-info">
            <h4>手续费：<span>￥1200</span></h4>
          </div>
          <el-button size="mini" type="primary" style="height: 28px">提现</el-button>
        </div>
      </div>
      <el-row class="mb15" :gutter="20">
        <el-col :span="20" class="text-right">
          <el-date-picker
            type="date"
            size="mini"
            placeholder="开始日期">
          </el-date-picker> -
          <el-date-picker
            type="date"
            size="mini"
            placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-input size="mini" placeholder="请输入商户名称" clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-table class="mb15"
              :empty-text="loadingText"
              :data="groupList"
              :header-row-style="tableHeaderClass"
              style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="商户名称"
          prop="managerName">
        </el-table-column>
        <el-table-column
          align="center"
          label="消费者昵称"
          prop="managerName">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="交易时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="managerName"
          label="金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="managerName"
          label="备注">
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="groupList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="groupList.length>0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  //import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'

  export default {
    data() {
      return {
        //groupId: cacheCookies.getGroupId(),
        areaId : 16000000000000, //江苏省
        cities: [], //所有城市
        cityId: "",
        cityMap: {},
        cityModel: {},
        groupList: [],
        currentPage:1, //当前选中的页数
        pageSize:20,//每页放多少条数据
        totalCount:0,//总的数据页数
        searchName: "", //查询店铺名称
        loadingText:'正在加载,请稍后...',
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0!important'}
      }
    },
    created(){
      //console.log(this.groupId);
      this.doPageGroup();
    },
    methods: {
      async doPageGroup(){
        this.groupList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var that = this;
        //查询江苏城市
        var res = await AreaService.doSearchCity(this.areaId);
        if(res.status == 1){
          this.cities = res.data;
          this.cities.forEach(function(city, index){
            if (city.id == that.cityId) {
              that.cityModel = city;
            }
            that.cityMap[city.id]=city.name;
          });
          //初始化店铺数据
          var response = await GroupService.doPageGroup({
            page:this.currentPage,
            count:this.pageSize,
            name:this.searchName
          });

          if(response.status && response.data && response.data.length > 0){
            this.totalCount = response.total;
            this.groupList = response.data;
            //显示城市名称
            this.groupList.forEach(function(group, index){
              that.$set(group,'visible',false);
              that.$set(group,'visible1',false);
              that.$set(group,'visible2',false);
              group.cityName = that.cityMap[group.city];
              group.createDate = TimeUtils.formatTime(group.createDate*1000, 'Y-M-D');
            });
          }else{
            this.loadingText ="暂无数据";
          }
        }
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageGroup();
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
    align-items: center;
  }
  .zj-list-one .zj-li{
    padding: 20px 15px 20px 0;
  }
  .zj-avatar {
    width: 60px;
    height: 60px;
    margin: 0 15px 0 0;
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
    color: red;
  }
  .zj-border-tb {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
  .mr20 {
    margin-right: 20px;
  }
</style>
