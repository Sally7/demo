<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">民兵整组
      <el-dropdown style="float:right;margin-right: 20px" @command="handleClick">
        <el-link icon="el-icon-printer" type="primary">打印<i class="el-icon-arrow-down el-icon--right"></i></el-link>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="archive">所有花名册</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="app__content">
      <div class="search-box">
        <div v-if="!searhBoxDetail">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form style="margin-top: 20px">
                  <el-form-item label="搜索区域">
                    <area-select type="address" ref="archiveArea" :areaId="area.areaId" :areaLevel="+area.areaLevel"></area-select>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-form :inline="true">
              <el-form-item label="身份证号">
                <el-input v-model="sm.idNo" size="small" clearable maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="sm.name" size="small" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-row>
          <dynamic-search-model itemIds="4028475a5c9df54b015c9df96aa10008,4028475a5c9df54b015c9df96aa00445,4028475a5c9df54b015c9df96aa00446" ref="archiveSearchModel"></dynamic-search-model>
        </div>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="currentPage=1;doPage()">搜索</el-button>
            <el-button plain size="small" @click="doExport" :loading="exporting">导出</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px; ">
        <el-col :span="8" class="text-left" style="padding-left: 10px">
          <record-selected :propmap="tranmap" @agign="mixinAgignEvent" :alllist="multipleSelectionAll" :pagelist="multipleSelection" style="display: inline-block"></record-selected>
          <el-button v-if="false" plain size="small" style="margin-left: 10px">删除</el-button>
          <el-button plain size="small" @click="toBatch">批量整组</el-button>
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
                ref="table"
                :empty-text="loadingText"
                :data="users"
                :header-row-style="tableHeaderClass"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
            type="selection"
            width="55">
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
            align="right"
            min-width="150"
            label="操作">
          <template slot-scope="scope">
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

      <el-dialog :title="batchDialogTitle" :visible.sync="batchDialogVisible">
        <el-tabs tab-position="left" style="height: 200px;">
          <el-tab-pane label="批量整组">
            <dynamic-search-model itemIds="4028475a5c9df54b015c9df96aa10008,4028475a5c9df54b015c9df96aa00445,4028475a5c9df54b015c9df96aa00446" ref="batchGroup"></dynamic-search-model>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="batchDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="doBatch">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import Achive from '@/mixins/Achive';
  import AreaSelect from '@/components/AreaSelect/index';
  import ElFormItem from 'element-ui/packages/form/src/form-item';
  import render from '@/printer_t/print_3.art';
  import cacheCookies from '@/utils/auth';
  import TimeUtils from '@/utils/TimeUtil';
  import GroupService from '@/api/GroupService';
  import PrintService from '../../api/PrintService';
  import LodopPrinterService from '../../api/LodopPrinterService';
  import multiselect from '@/mixins/multiselect';
  import RecordSelected from '@/components/RecordSelected/index.vue';

  export default {
    mixins: [Achive, multiselect],
    components: {
      AreaSelect,
      ElFormItem,
      RecordSelected,
    },
    data() {
      return {
        archiveType: 2,
        tranmap:{key:'id',label:'name',desc:'desc'}
      };
    },
    methods: {
      async handleClick() {
        let users = await this.doAllPage();
        for (let i = 0; i < users.length; i++) {
          users[i].birthDay = users[i].birthDay?TimeUtils.formatTime(users[i].birthDay, 'Y-M-D'):'';
          users[i].sex = users[i].sex == 1 ? '男' : '女';
        }
        const groupId = cacheCookies.getGroupId();
        var groupRes = await GroupService.doGetOneGroupById(groupId);
        let loading = null;
        LodopPrinterService.setOptions({
          title: '花名册打印',
          html: render({users: users}),
          watermark: (groupRes && groupRes.data) ? groupRes.data.name : '',
          popleyer: () => {
            loading = this.$loading({
              lock: false,
              text: '正在打印......',
              customClass: 'printer-loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            });
          },
          callback: (type, msg) => {
            loading.close();
            this.$message({
              message: msg || '暂无消息',
              type: type || 'success',
            });
          },
        });
        LodopPrinterService.print();

//        PrintService.setOptions({
//          waterMark: (groupRes && groupRes.data) ? groupRes.data.name : '',
//          loading: loading,
//          barcode: '',
//        });
//        console.log('打印花名册', render({users: users}));
//        PrintService.print(1, render({users: users}));
      },
      toLog(userId) {
        var url = '/archive/archive_list_' + this.archiveType + '/archive_log?modelId=' + userId;
        this.$router.push(url);
      },
    },
  };
</script>
