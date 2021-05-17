<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">退役士兵档案
      <el-button type="text" @click="toAU()" style="margin-right: 20px">+新建档案</el-button>
    </div>
    <div class="app__content">
      <el-form>
      <el-row :gutter="10">
        <el-col :span="4" class="text-left">
            <el-form-item>
              <el-input v-model="sm.name" size="small" placeholder="姓名" clearable></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="4" class="text-left">
            <el-form-item>
            <el-input size="small" v-model="sm.phone" placeholder="手机号" clearable></el-input>
            </el-form-item>
        </el-col>
          <el-col :span="15">
            <el-form-item label="搜索区域">
              <area-select type="address" ref="strengChartArea" :areaId="area.areaId+''" :areaLevel="+area.areaLevel"></area-select>
            </el-form-item>
          </el-col>

      </el-row>
      <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :span="24" class="text-left">
          <el-form-item>
            <el-button size="small" type="primary" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button size="small" type="success" @click="currentPage=1;doReset()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
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
          label="档案编号"
          prop="outerSystemUserId">
        </el-table-column>
        <el-table-column
          align="center"
          label="姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          label="性别"
          prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          label="民族"
          prop="nation">
        </el-table-column>
        <el-table-column
          align="center"
          label="学历"
          prop="education">
        </el-table-column>
        <el-table-column
          align="center"
          label="政治面貌"
          prop="politicalIdentity">
        </el-table-column>
        <el-table-column
          align="right"
          label="操作">
          <template slot-scope="scope">
            <el-button class="ml10" type="text" size="small"  slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="scope.row.visible = false">档案详情</el-button>
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
  import cacheCookies from '@/utils/auth';
  import Breadcrumb from '@/components/Breadcrumb';
  import ConfigUtil from '@/utils/ConfigUtil';
  import UserAdminService from '@/api/NadminuserService';
  import OrderService from '@/api/OrderService';
  import UserService from '@/api/UserService';
  import AreaService from '@/api/AreaService';
  import RoleService from '@/api/RoleService';
  import AreaSelect from '@/components/AreaSelect/index';
  import {mapGetters} from 'vuex';

  export default{
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount:0,
        sm: {groupBatchNumber: ConfigUtil.getTradingAreaId(), areaId: '', gradeNum: '', dateRange: []},
        currentPage:1,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
              },
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
              },
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
              },
            }],
        },
        pageSize:10,
        users:[],
        roles:[],
        userAUDialogVisible:false,
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    components: {
      Breadcrumb, AreaSelect,
    },
    async created() {

      this.doPage();
    },
    methods:{
      async doPage() {
        var that = this;
        this.users = [];
        this.loadingText = '正在加载,请稍后...';
        if (this.$refs.strengChartArea) {
          ConfigUtil.getAreaSM(this.sm, this.$refs.strengChartArea.getArea(), this.groupId);
        }
        var res = await UserService.doPage(this.sm, this.currentPage, this.pageSize);
        this.loadingText = '暂无用户信息';
        if(res.status != 1) {
          return;
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
      doConfirm() {
        var that = this;
        this.$refs['user'].validate((valid) => {
          if (valid) {
            that.doAU();
          } else {
            that.$message.warning('输入项未按规则输入！');
            return false;
          }
        });
      },
      doReset() {
        console.log('doReset');
        this.sm = {imAccountGroupId: cacheCookies.getGroupId(), gradeNum: '', dateRange: []};
        this.doPage();
      },
      toAU(id) {
        var url = '/archive_au';
        if(id) {
          url += '?id=' + id;
        }
        this.$router.push(url);
      },
    },
  };
</script>
