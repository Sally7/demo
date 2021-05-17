<style>
</style>
<template>
    <div class="app-container" id="wrapper">
        <div class="app__content">
            <el-button type="primary" size="mini" @click="toEditTemplate()" style="margin-bottom: 20px">+新建运费模板</el-button>
            <el-table class="mb15"
                      :empty-text="loadingText"
                      :data="templateList"
                      :header-row-style="tableHeaderClass"
                      style="width: 100%">
                <el-table-column
                        align="center"
                        label="模板名称"
                        prop="name">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="计费方式"
                        prop="chargingTypeText">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="最后编辑时间"
                        prop="templateTime">
                </el-table-column>
                <el-table-column
                        align="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toEditTemplate(scope.row.id)">编辑</el-button>
                        <el-popover
                                ref="popover"
                                placement="top"
                                width="200"
                                v-model="scope.row.visible">
                            <p>确定删除 {{scope.row.name}}吗？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="doDelete(scope.row),scope.row.visible = false">确定</el-button>
                            </div>
                        </el-popover>
                        <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="counts-wrap mb15" v-if="templateList.length">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
            <el-pagination class="text-right"
                           background
                           layout="prev, pager, next"
                           :page-size="pageSize"
                           :total="totalCount"
                           :current-page="currentPage"
                           @current-change="handleCurrentChange"
                           v-if="templateList.length">
            </el-pagination>
        </div>
    </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import ExpressService from '@/api/ExpressService'
  export default{
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount:0,
        currentPage:1,
        pageSize:20,
        templateList:[]

      }
    },
    created() {
      this.doSearchExpressTemplate();
    },
    methods:{
      async doSearchExpressTemplate() {
        var res = await ExpressService.doSearchExpressTemplate(cacheCookies.getGroupId(),this.currentPage,this.pageSize);
        this.loadingText = '暂无物流模板信息';
        if(res.status !=1) {
          return
        }
        this.totalCount = res.total;
        res.data.forEach(function (template) {
          if(template.chargingType==1){
            template.chargingTypeText = '按重量';
          }else if(template.chargingType==2) {
            template.chargingTypeText = '按件';
          }
          template.templateTime = TimeUtils.formatTime(template.templateDate, 'Y-M-D');
        });
        this.templateList = res.data;
      },
      handleCurrentChange(){

      },
      toEditTemplate(templateId){
        this.$router.push("/group/freight_template/freight_template_au?id=" + templateId);
      },
      async doDelete(e){
        var res = await ExpressService.doDeleteExpressTemplateById(e.id);
        if(res.status === 1){
          this.doSearchExpressTemplate();
        }
      }
    }
  }
</script>