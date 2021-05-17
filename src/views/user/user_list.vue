<style>
</style>
<template>
    <div class="app-container" id="wrapper">
      <div class="module-title">客户列表</div>
      <div class="app__content">
        <el-row :gutter="10">
          <el-col :span="3" class="text-left">
            <el-select v-model="sm.gradeNum" filterable placeholder="所有级别">
              <el-option
                v-for="item in gradeNums"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="text-left">
            <el-input v-model="sm.name" placeholder="姓名" clearable></el-input>
          </el-col>
          <el-col :span="4" class="text-left">
            <el-input v-model="sm.phone" placeholder="手机号" clearable></el-input>
          </el-col>
          <el-col :span="10" class="text-left">
            <el-date-picker
              v-model="sm.dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button type="success" @click="currentPage=1;doReset()">重置</el-button>
            <el-button type="default" @click="doResetUserCard()" v-if="false">导出</el-button>
          </el-col>
        </el-row>
        <el-table class="mb15"
                  :empty-text="loadingText"
                  :data="users"
                  :header-row-style="tableHeaderClass"
                  style="width: 100%;margin-top: 20px;">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              align="center"
              label="用户名"
              prop="name">
            </el-table-column>
            <el-table-column
              align="center"
              label="级别"
              prop="gradeNumLabel"
            >
            </el-table-column>
            <el-table-column
              align="right"
              label="销售额"
              prop="totalAmount"
            >
            </el-table-column>
            <el-table-column
                    align="right"
                    label="操作">
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.gradeNum!=3"
                          ref="popover"
                          placement="top"
                          width="200"
                          trigger="click"
                          v-model="scope.row.visible">
                    <p>确定设置 {{scope.row.name}}为顶级销售员吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="doSetGradeNum(scope.row.id, 3),scope.row.visible = false">确定</el-button>
                    </div>
                    <el-button class="ml10" type="text" size="small"  slot="reference">设为顶级销售员</el-button>
                  </el-popover>
                  <el-popover v-if="scope.row.gradeNum==3"
                    ref="popover"
                    placement="top"
                    width="200"
                    trigger="click"
                    v-model="scope.row.visible">
                    <p>确定取消{{scope.row.name}}为顶级销售员吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="doSetGradeNum(scope.row.id, 1),scope.row.visible = false">确定</el-button>
                    </div>
                    <el-button class="ml10" type="text" size="small"  slot="reference">取消顶级销售员</el-button>
                  </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div class="counts-wrap mb15" v-if="users.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
        <el-pagination class="text-right"
                       background
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="totalCount"
                       :current-page="currentPage"
                       @current-change="handleCurrentChange"
                       v-if="users.length>0">
        </el-pagination>
        </div>
    </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import Breadcrumb from '@/components/Breadcrumb'
  import TimeUtils from '@/utils/TimeUtil'
  import UserAdminService from '@/api/NadminuserService'
  import OrderService from '@/api/OrderService'
  import UserService from '@/api/UserService'
  import AreaService from  '@/api/AreaService'
  import RoleService from '@/api/RoleService'
  export default{
    data() {
      return {
        gradeNums:[{id:"",name:"所有级别"},{id:"3",name:"高级销售员"}],
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount:0,
        sm:{imAccountGroupId:cacheCookies.getGroupId(),gradeNum:"",dateRange:[]},
        currentPage:1,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pageSize:10,
        users:[],
        roles:[],
        userAUDialogVisible:false,
      }
    },
    components: {
      Breadcrumb
    },
    async created() {

      this.doPage();
    },
    methods:{
      async doPage() {
        var that = this;
        this.users = [];
        this.loadingText = '正在加载,请稍后...';
        var res = await UserService.doPage(this.sm, this.currentPage, this.pageSize);
        this.loadingText = '暂无用户信息';
        if(res.status != 1) {
          return
        }
        this.totalCount = res.total;


        if(this.sm.dateRange.length>0) {
          if(this.sm.dateRange[0]) {
            this.sm.startCompleteDate = this.sm.dateRange[0].getTime();
          }
          if(this.sm.dateRange[1]) {
            this.sm.endCompleteDate = this.sm.dateRange[1].getTime();
          }
        }

        res.data.forEach(async function (user) {
          user.totalAmount = 0;
          if(!user.name) {
            user.name = "暂未登录";
          }
          if(user.gradeNum == 3) {
            user.gradeNumLabel = "顶部销售员";
          } else if(user.gradeNum == 2){
            user.gradeNumLabel = "销售员";
          } else {
            user.gradeNumLabel = "普通级别";
          }

          that.doStatisticalAmount(user);
        });

        this.users = res.data;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPage();
      },
      cleanForm() {
        this.form = {};
        this.roles.forEach(function (role) {
          role.checked = false;
        });
      },
      async doStatisticalAmount(user){
        var res = await OrderService.doStatisticalAmount({rootUserId:user.id, orderStatus:4, startCompleteDate:this.sm.startCompleteDate,endCompleteDate:this.sm.endCompleteDate});
       console.log(res);
        user.totalAmount = res;
      },
      doConfirm() {
        var that = this;
        this.$refs["user"].validate((valid) => {
          if (valid) {
            that.doAU();
          } else {
            that.$message.warning("输入项未按规则输入！");
            return false;
          }
        });
      },
      doReset() {
        console.log("doReset");
        this.sm = {imAccountGroupId:cacheCookies.getGroupId(),gradeNum:"",dateRange:[]};
        this.doPage();
      },
      async doSetGradeNum(userId, gradeNum) {
        var res = await UserService.doSetGradeNum(userId, gradeNum);
        if(res.status == 1) {
          this.users.forEach(function(user) {
            if(user.id == userId) {
              user.gradeNum = gradeNum;
              if(user.gradeNum == 3) {
                user.gradeNumLabel = "顶部销售员";
              } else if(user.gradeNum == 2){
                user.gradeNumLabel = "销售员";
              } else {
                user.gradeNumLabel = "普通级别";
              }
            }
          });
        }

      }
    }
  }
</script>
