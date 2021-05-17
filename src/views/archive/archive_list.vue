<style>

</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">{{title}}
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建档案</el-button>
        <el-button type="primary" size="small" plain @click="toImport">导入档案</el-button>
      </el-row>
      <div class="search-box">
        <div v-if="!searhBoxDetail">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form label-width="70px">
                  <el-form-item label="搜索区域">
                    <area-select type="address" ref="archiveArea" :areaId="area.areaId" :townId="area.townId" :villageId="area.villageId" :areaLevel="+area.areaLevel"></area-select>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-form :inline="true" label-width="70px">
              <el-form-item label="身份证号">
                <el-input v-model="sm.idNo" size="small" clearable maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="档案编号">
                <el-input v-model="sm.outerSystemUserId" size="small" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-form :inline="true" label-width="70px">
              <el-form-item label="姓名">
                <el-input v-model="sm.name" size="small" clearable></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="sm.phone" size="small" clearable maxlength="11"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
        </div>
        <div v-if="searhBoxDetail">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form label-width="70px">
                  <el-form-item label="搜索区域">
                    <area-select type="address" ref="archiveArea" :areaId="area.areaId" :townId="area.townId" :villageId="area.villageId" :areaLevel="+area.areaLevel"></area-select>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="4" class="text-left">
              <el-input v-model="sm.idNo" size="small" placeholder="身份证" clearable maxlength="18"></el-input>
            </el-col>
            <el-col :span="4" class="text-left">
              <el-input v-model="sm.phone" size="small" placeholder="手机号" clearable maxlength="11"></el-input>
            </el-col>
            <el-col :span="4" class="text-left">
              <el-select style="width: 100%" size="small" v-model="sm.sex" placeholder="性别" clearable>
                <el-option label="男" value="1"/>
                <el-option label="女" value="2"/>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px" :gutter="10">
            <el-col :span="4" class="text-left">
              <el-input v-model="sm.outerSystemUserId" size="small" placeholder="档案编号" clearable></el-input>
            </el-col>
            <el-col :span="4" class="text-left">
              <el-input v-model="sm.name" size="small" placeholder="姓名" clearable></el-input>
            </el-col>
            <el-col :span="4" class="text-left">
              <el-select style="width: 100%" size="small" v-model="sm.maritalStatus" placeholder="婚否" clearable>
                <el-option label="已婚" value="1"/>
                <el-option label="未婚" value="0"/>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select style="width: 100%" size="small" v-model="sm.nation" filterable clearable placeholder="民族">
                <el-option
                    v-for="item in nations"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select style="width: 100%" size="small" v-model="sm.education" filterable clearable placeholder="学历">
                <el-option
                    v-for="item in educations"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select style="width: 100%" size="small" v-model="sm.politicalIdentity" clearable filterable placeholder="政治面貌">
                <el-option
                    v-for="item in politicalIdentitys"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <dynamic-search-model :pformId="pformId" ref="archiveSearchModel"></dynamic-search-model>
        </div>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button plain size="small" @click="doExport" :loading="exporting">导出</el-button>
            <el-button type="text" v-if="false">查看已导出的列表</el-button>
            <el-button type="text" @click="currentPage=1;doReset()">重置筛选条件</el-button>
            <el-button type="text" @click="searhBoxDetail=!searhBoxDetail">{{searhBoxDetail?'收起':'更多搜索'}}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i></el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px; ">
        <el-col :span="8" class="text-left" style="padding-left: 10px">
          <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
          <el-button plain size="small" style="margin-left: 10px">删除</el-button>
          <el-button plain size="small" @click="toBatch()">批量设置</el-button>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="users.length>0">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="users"
                ref="table"
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            align="center"
            label="姓名"
            prop="name">
          <template slot-scope="scope">
            <el-link type="primary" @click="toAU(scope.row.id,'detail')">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="性别"
            :formatter="sexFormatter"
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
            min-width="125"
            align="right"
            label="操作">
          <template slot-scope="scope">
            <el-popover
                ref="popover"
                placement="top"
                width="290"
                v-model="scope.row.visible">
              <p>确定删除{{users[scope.$index].name}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doDelete(users[scope.$index].id),scope.row.visible = false">确定</el-button>
              </div>
            </el-popover>
            <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
            <el-button class="ml10" type="text" size="small" slot="reference" @click="toAU(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="scope.row.visible = false;toAU(scope.row.id,'detail')">档案详情</el-button>
            <el-button size="mini" type="text" @click="scope.row.visible = false;toLog(scope.row.id)">历史日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="8" class="text-left">
          <div class="mb15 text-left" v-if="users.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="users.length>0">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="batchDialogTitle" :visible.sync="batchDialogVisible">
      <el-tabs tab-position="left" style="height: 200px;">
        <el-tab-pane label="批量转移">
          <el-form :inline="true" v-model="batchModel">
            <el-form-item label="转移到" v>
              <el-select size="small" placeholder="请选择" v-model="batchModel.archiveTo">
                <el-option label="服现役" value="5"></el-option>
                <el-option label="预征兵役" value="3"></el-option>
                <el-option label="地专对口" value="4"></el-option>
                <el-option label="民兵" value="2"></el-option>
                <el-option label="退伍军人" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="doBatch">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import cacheCookies from '@/utils/auth';
  import Breadcrumb from '@/components/Breadcrumb';
  import ConfigUtil from '@/utils/ConfigUtil';
  import DynamicSearchModel from '@/components/DynamicSearchModel';
  import GroupService from '@/api/GroupService';
  import UserService from '@/api/UserService';
  import AreaSelect from '@/components/AreaSelect/index';
  import {mapGetters} from 'vuex';
  import multiselect from '@/mixins/multiselect';
  import RecordSelected from '@/components/RecordSelected/index.vue';

  export default {
    components: {
      Breadcrumb,
      DynamicSearchModel,
      AreaSelect,
      RecordSelected,
    },
    mixins: [multiselect],
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        title: '档案',
        archiveType: 1,
        totalCount: 0,
        sm: {groupBatchNumber: ConfigUtil.getTradingAreaId(), areaId: '', gradeNum: '', dateRange: [], sortExp: '1'},
        resetSM: null,
        groupcategoryId: '',
        currentPage: 1,
        pickerOptions: {
          shortcuts: [
            {
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
        pageSize: 20,
        users: [],
        roles: [],
        userAUDialogVisible: false,
        groupId: cacheCookies.getGroupId(),
        group: {},
        pformId: '',
        nations: [
          {name: '汉族', value: '汉族'},
          {name: '蒙古族', value: '蒙古族'},
          {name: '回族', value: '回族'},
          {name: '藏族', value: '藏族'},
          {name: '维吾尔族', value: '维吾尔族'},
          {name: '苗族', value: '苗族'},
          {name: '彝族', value: '彝族'},
          {name: '壮族', value: '壮族'},
          {name: '布依族', value: '布依族'},
          {name: '朝鲜族', value: '朝鲜族'},
          {name: '满族', value: '满族'},
          {name: '侗族', value: '侗族'},
          {name: '瑶族', value: '瑶族'},
          {name: '白族', value: '白族'},
          {name: '土家族', value: '土家族'},
          {name: '哈尼族', value: '哈尼族'},
          {name: '哈萨克族', value: '哈萨克族'},
          {name: '傣族', value: '傣族'},
          {name: '黎族', value: '黎族'},
          {name: '傈僳族', value: '傈僳族'},
          {name: '佤族', value: '佤族'},
          {name: '畲族', value: '畲族'},
          {name: '拉祜族', value: '拉祜族'},
          {name: '水族', value: '水族'},
          {name: '东乡族', value: '东乡族'},
          {name: '纳西族', value: '纳西族'},
          {name: '景颇族', value: '景颇族'},
          {name: '柯尔克孜族', value: '柯尔克孜族'},
          {name: '土族', value: '土族'},
          {name: '达斡尔族', value: '达斡尔族'},
          {name: '仫佬族', value: '仫佬族'},
          {name: '羌族', value: '羌族'},
          {name: '布朗族', value: '布朗族'},
          {name: '撒拉族', value: '撒拉族'},
          {name: '毛南族', value: '毛南族'},
          {name: '仡佬族', value: '仡佬族'},
          {name: '锡伯族', value: '锡伯族'},
          {name: '阿昌族', value: '阿昌族'},
          {name: '普米族', value: '普米族'},
          {name: '塔吉克族', value: '塔吉克族'},
          {name: '怒族', value: '怒族'},
          {name: '乌兹别克族', value: '乌兹别克族'},
          {name: '俄罗斯族', value: '俄罗斯族'},
          {name: '鄂温克族', value: '鄂温克族'},
          {name: '德昂族', value: '德昂族'},
          {name: '保安族', value: '保安族'},
          {name: '裕固族', value: '裕固族'},
          {name: '京族', value: '京族'},
          {name: '塔塔尔族', value: '塔塔尔族'},
          {name: '独龙族', value: '独龙族'},
          {name: '鄂伦春族', value: '鄂伦春族'},
          {name: '赫哲族', value: '赫哲族'},
          {name: '门巴族', value: '门巴族'},
          {name: '珞巴族', value: '珞巴族'},
          {name: '基诺族', value: '基诺族'},
          {name: '高山族', value: '高山族'}],
        educations: [{name: '小学', value: '小学'}, {name: '初中', value: '初中'}, {name: '高中', value: '高中'}, {name: '专科', value: '专科'}, {name: '本科', value: '本科'}, {name: '研究生', value: '研究生'}, {name: '博士', value: '博士'}, {name: '博士后', value: '博士后'}],
        politicalIdentitys: [{name: '中共党员', value: '中共党员'}, {name: '中共预备党员', value: '中共预备党员'}, {name: '共青团员', value: '共青团员'}, {name: '群众', value: '群众'}, {name: '民盟盟员', value: '民盟盟员'}, {name: '民建会员', value: '民建会员'}],
        searhBoxDetail: false,
        exporting: false,
        selectedIds: [],
        batchDialogVisible: false,
        batchDialogTitle: '批量设置',
        batchModel: {archiveTo: null},
        tranmap:{key:'id',label:'name',desc:'desc'}
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    watch: {
      // 如果路由发生变化，再次执行该方法
      '$route': 'init',
    },
    async created() {
      var groupRes = await GroupService.doGetOneGroupById(this.groupId);
      groupRes.data.areaId = groupRes.data.areaId + '';
      this.group = groupRes.data;

      this.init();
    },
    methods: {
      init() {
        var that = this;

        var pathArr = this.$route.name.split('_');
        this.archiveType = pathArr[pathArr.length - 1];
        switch (+this.archiveType) {
          case 1:
            this.title = '退伍军人档案';
            this.groupcategoryId = 2002001001000000;
            that.pformId = '1180808151591427015159272c210011';
            break;
          case 2:
            this.title = '民兵档案';
            this.groupcategoryId = 2002002001001000;
            that.pformId = 'ff80808151591427015159272c210023';
            break;
          case 3:
            this.title = '预征兵役档案';
            this.groupcategoryId = 2002001003000000;
            that.pformId = 'ff80808151591427015159272c210024';
            break;
          case 4:
            this.title = '地专对口档案';
            this.groupcategoryId = 2002001002000000;
            that.pformId = 'ff80808151591427015159272c210025';
            break;
          case 5:
            that.title = '现役档案';
            this.groupcategoryId = 2004000000000000;
            that.pformId = 'ff80808151591427015159272c210037';
            break;
        }
        this.resetSM = JSON.parse(JSON.stringify(this.sm));
        this.doPage();
      },
      async doPage() {
        var that = this;
        this.users = [];
        this.loadingText = '正在加载,请稍后...';
        this.sm.archiveType = this.archiveType;
        console.log('this.archiveType', this.archiveType);

        if (this.$refs.archiveArea) {
          ConfigUtil.getAreaSM(this.sm, this.$refs.archiveArea.getArea(), this.groupId);
        }

        if (this.$refs.archiveSearchModel) {
          this.sm.valueList = this.$refs.archiveSearchModel.getItems();
        }

        var res = await UserService.doPage(this.sm, this.currentPage, this.pageSize);
        this.loadingText = '暂无档案信息';
        if (res.status != 1) {
          return;
        }
        this.totalCount = res.total;

        if (this.sm.dateRange.length > 0) {
          if (this.sm.dateRange[0]) {
            this.sm.startCompleteDate = this.sm.dateRange[0].getTime();
          }
          if (this.sm.dateRange[1]) {
            this.sm.endCompleteDate = this.sm.dateRange[1].getTime();
          }
        }

        this.tableData = this.users = res.data;
        this.$nextTick(() => {
          this.mixinSetSelectRow();
        });

      },
      handleCurrentChange(page) { //点击分页的组件
        this.mixinCurrentChange();
        this.currentPage = page;
        this.doPage();
        this.mixinSetSelectRow();
      },
      cleanForm() {
        this.form = {};
        this.roles.forEach(function(role) {
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
        this.sm = JSON.parse(JSON.stringify(this.resetSM));
        this.doPage();
      },
      async doExport() {
        this.exporting = true;
        var exportModel = {};
        exportModel.groupcategoryId = this.groupcategoryId;
        exportModel.userSearch = this.sm;
        let ids = [], sels = [];
        sels = this.mixinGetAllSelectionData();
        for (let i = 0; i < sels.length; i++) {
          ids.push(sels[i].id);
        }
        exportModel.userSearch.userId = ids.join(',');
        var exportRes = await UserService.doExport(exportModel);

        this.exporting = false;
        this.sm.groupcategoryId = null;
        this.sm.userId = null;
        window.location.href = exportRes;
      },
      handleSelectionChange(rows) {
        console.log('111111')
        var that = this;
        that.selectedIds = [];
        rows.forEach(function(item) {
          that.selectedIds.push(item.id);
        });
        this.mixinHandleSelectionChange(rows);
      },
      toAU(id, detail) {
        var url = '/archive/archive_list_' + this.archiveType + '/archive_au';
        url += '?archiveType=' + this.archiveType;
        if (id) {
          url += '&id=' + id;
        }
        if (detail) {
          url += '&detail=' + detail;
        }
        this.$router.push(url);
      },
      toImport() {
        var url = '/archive/archive_list_' + this.archiveType + '/archive_import?archiveType=' + this.archiveType;
        this.$router.push(url);
      },
      toBatch() {
        this.batchDialogTitle = '批量设置 已选' + this.selectedIds.length + '条';
        this.batchDialogVisible = true;
      },
      async doBatch() {
        if (this.selectedIds.length == 0) {
          this.$message({
            message: '请先选择批量操作的数据',
            type: 'warning',
          });
          return;
        }
        if (this.batchModel.archiveTo > -1) {
          var result = await UserService.doBatch('archiveTo', this.batchModel.archiveTo, this.selectedIds.join(','));
          if (result) {
            this.$message({
              message: '批量操作成功',
              type: 'success',
            });
            this.doPage();
          }
        }

        if (this.batchModel.batchGroup == 1) {
          this.$refs.batchGroup.getItems();
        }

        this.batchDialogVisible = false;
      },
      async doAllPage() {
        var res = await UserService.doPage(this.sm, 1, 1000);
        if (res.status != 1) {
          return;
        }
        console.log('花名册1000条：', res.data);
        return res.data;
      },
      sexFormatter(row) {
        return row.sex == 1 ? '男' : '女';
      },
      toLog(userId) {
        var url = '/archive/archive_list_' + this.archiveType + '/archive_log?modelId=' + userId;
        this.$router.push(url);
      },
      async doDelete(id) {
        let res = await UserService.doDeleteUser({id: id});
        if (res.status == 1) {
          this.doPage();
        }
      },

    },
  };

</script>
