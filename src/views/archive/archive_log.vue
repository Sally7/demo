<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">{{title}}</div>
    <el-row style="margin-top: 20px; ">
      <el-col :span="24" class="text-right">
        <el-pagination class="text-right"
                       background
                       layout="prev, pager, next"
                       :page-size="model.count"
                       :total="totalCount"
                       :current-page="model.page"
                       @current-change="handleCurrentChange"
                       v-if="users.length>0">
        </el-pagination>
      </el-col>
    </el-row>
    <el-table class="mb15"
              :empty-text="loadingText"
              :data="users"
              :header-row-style="tableHeaderClass"
              style="width: 100%;margin-top: 20px;">
      <el-table-column
          align="left"
          label="操作时间"
          width="150"
          :formatter="timeFormatter"
          prop="logDate">
      </el-table-column>
      <el-table-column
          align="center"
          width="200"
          label="操作人"
          prop="createUserName">
      </el-table-column>
      <el-table-column
          align="left"
          label="操作内容"
          :formatter="contentFormatter"
          prop="updateJsonObject">
      </el-table-column>
      <el-table-column
          align="left"
          width="80"
          style="padding-right: 20px;"
          label="操作">
        <template slot-scope="scope">
          <el-button class="ml10" type="text" size="small" v-popover:popover>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="8" class="text-left">
        <div class="mb15 text-left" v-if="users.length>0">共{{totalCount}}条数据，每页显示{{model.count}}条</div>
      </el-col>
      <el-col :span="16" class="text-right">
        <el-pagination class="text-right"
                       background
                       layout="prev, pager, next"
                       :page-size="model.count"
                       :total="totalCount"
                       :current-page="model.page"
                       @current-change="handleCurrentChange"
                       v-if="users.length>0">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Breadcrumb from '@/components/Breadcrumb';
  import DynamicFormService from '@/api/DynamicFormService';
  import TimeUtils from '@/utils/TimeUtil';

  export default {
    components: {
      Breadcrumb,
    },
    data() {
      return {
        title: '历史日志',
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        archiveType: 1,
        model: {
          modelId: this.$route.query.modelId,
          page: 1,
          count: 20,
        },
        totalCount: 1,
        users: [],
      };
    },
    async created() {
      this.init();
    },
    methods: {
      init() {
        this.doPage();
      },
      async doPage() {
        this.loadingText = '正在加载,请稍后...';
        let res = await DynamicFormService.doGetDyformPageDynamicformLogs(this.model);
        if (res.status == 1) {
          this.totalCount = res.total;
          this.users = res.data;
        }
        if (this.users.length == 0) {
          this.loadingText = '暂无资讯信息';
        }

      },
      handleCurrentChange(page) { //点击分页的组件
        this.model.page = page;
        this.doPage();
      },
      timeFormatter(row) {
        return row.logDate ? TimeUtils.formatTime(row.logDate, 'Y年M月D日') : '';
      },
      contentFormatter(row) {
        let str = row.updateJsonObject ? row.updateJsonObject : '{}';
        let json = JSON.parse(str);
        console.log('JSON',json)
        Object.keys(json).forEach((key) => {
            if (key=='birthDay' || key=='logDate'){
                json[key].newValue=TimeUtils.formatTime(json[key].newValue, 'Y年M月D日')
                json[key].oldValue=TimeUtils.formatTime(json[key].oldValue, 'Y年M月D日')
            }else if(key=='sex'){
              json[key].newValue=json[key].newValue==1?'男':'女'
              json[key].oldValue=json[key].oldValue==1?'男':'女'
            }
        })
        let array = Object.values(json);
        let result = this.utilOldToNew(array);
        return result;
//        return row.updateJsonObject ? TimeUtils.formatTime(row.logDate, 'Y年M月D日') : '';
      },
      utilOldToNew(array) {
        let res = '';
        for (let i = 0; i < array.length; i++) {
          if (array[i].newValue && array[i].oldValue) {
            res += '【'+array[i].oldValue + '=>' + array[i].newValue + '】';
          }
        }
        return res;
      },
    },
  };

</script>
