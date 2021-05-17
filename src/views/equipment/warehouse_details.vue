<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">库存明细
    </div>
    <div class="app__content">
      <el-row>
        <el-col :span="24">
          <el-form-item label="装备筛选" prop="outerSystemUserId" >
            <el-input v-model="model.outerSystemUserId" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="制单时间内" prop="outerSystemUserId" >
            <el-input v-model="model.outerSystemUserId" placeholder="档案编号" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号" prop="outerSystemUserId" >
            <el-input v-model="model.outerSystemUserId" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据类型" prop="outerSystemUserId" >
            <el-input v-model="model.outerSystemUserId"  size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单人" prop="outerSystemUserId" >
            <el-input v-model="model.outerSystemUserId"  size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :span="24" class="text-left">
          <el-button type="primary" @click="currentPage=1;doPage()">筛选</el-button>
          <el-button type="success" @click="currentPage=1;doExport()">导出</el-button>
          <el-button type="text">查看已导出的列表</el-button>
          <el-button type="text">重置筛选条件</el-button>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="users"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          label="单据编号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="制单时间"
          prop="outerSystemUserId">
        </el-table-column>
        <el-table-column
          align="center"
          label="单据类型"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          label="装备名称"
          prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          label="出入库"
          prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          label="剩余量"
          prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          label="库存单价"
          prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          label="制单人"
          prop="sex">
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
  import Achive from '@/mixins/Achive'
  export default{
    mixins: [Achive],
    data() {
      return {
      achiveType:1,
      }
    }
  }
</script>
