<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">下级代理</div>
    <div class="app__content">
      <el-row class="mb15">
        <el-col :span="20"><el-button type="primary" size="mini" @click="toAgentAU">+添加下级代理</el-button></el-col>
        <el-col :span="4" class="text-right" v-if="false">
          <el-input
            size="mini"
            placeholder="请输入搜索内容"
            clearable>
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
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="代理名称"
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
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="auditingInfo"
          label="审核状态">
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toAgentAU(scope.row.id)">修改</el-button>
            <el-popover
              ref="popover"
              placement="top"
              width="200"
              v-model="scope.row.visible">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doChangeStatus(0,groupList[scope.$index].id,groupList[scope.$index].adminUser.id),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
          </template>
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
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'

  export default {
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        areaId : 16000000000000, //江苏省
        cities: [], //所有城市
        cityId: "",
        cityMap: {},
        cityModel: {},
        groupList: [],
        currentPage:1, //当前选中的页数
        pageSize:20,//每页放多少条数据
        totalCount:0,//总的数据页数
        searchName: "", //查询代理商名称
        loadingText:'正在加载,请稍后...',
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created(){
      this.doPageAgentGroup();
    },
    methods: {
      //查询所有代理商
      async doPageAgentGroup(){
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
          //初始化代理商数据
          var response = await GroupService.doPageAgentGroup({
            page:this.currentPage,
            count:this.pageSize,
            name:this.searchName,
            agentId:this.groupId
          });

          if(response.status && response.data && response.data.length > 0){
            this.totalCount = response.total;
            response.data.forEach(function(item){
              //审核状态
              switch(item.auditingStatus){
                case 0: //等待
                  item.auditingInfo = "等待";
                  break; //审核通过
                case 1:
                  item.auditingInfo = "审核通过";
                  break;
                default:

              }
            });

            this.groupList = response.data;
            //显示城市名称
            this.groupList.forEach(function(group, index){
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
        this.doPageAgentGroup();
      },
      //删除代理商
      doChangeStatus(status,id,userId){
        var response = GroupService.doChangeStatus({
          status: status,
          id: id,
          userId: userId
        });
        if(response.status == 1){
          this.$message({
            message: '删除成功!',
            type: 'success'
          });
          this.doPageAgentGroup();
        }
      },
      toAgentAU(id) {
        var url = "/group/agent_manage/agent_au";
        if(typeof id != "object") {
          url = "/group/agent_manage/agent_au?id=" + id;
        }
        this.$router.push(url);
      }
    }
  }
</script>

<style scoped>

</style>
