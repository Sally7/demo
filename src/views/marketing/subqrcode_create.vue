<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <p class="form-title">场景名称：扫码领券</p>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="marketingSceneList"
                :header-row-style="tableHeaderClass"
                :cell-class-name="cellClassName"
                style="width: 100%">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          align="center"
          prop="statusLabel"
          label="边长"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          prop="validDate"
          label="生成时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="marketingSceneLabel"
          label="使用状态"
          :filters="[{ text: '未使用', value: '未使用' }, { text: '已使用', value: '已使用' }]"
          :filter-multiple="false"
          filter-placement="bottom"
          :filter-method="handleFilterTag">
        </el-table-column>
        <el-table-column
          align="center"
          label="下载链接">
          <template slot-scope="scope">
            <div class="download-icon" v-if="scope.row.undownload" @click="download(scope.$index)"></div>
            <div class="redownload" v-else>重新下载</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="marketingSceneList.length>0">共{{totalCount}}条数据，每页显示{{averageCount}}条</div>
      <el-row>
        <el-col :span="4">
          <el-button type="small">批量下载</el-button>
        </el-col>
        <el-col :span="20">  
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="averageCount"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="marketingSceneList.length>0">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    data() {
      return {
        marketingSceneList: [],
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    components: {
      Breadcrumb
    },
    created() {
        this.marketingSceneList=[{
        validDate: '2016-05-02',
        marketingSceneLabel:'未使用',
        status: 0,
        statusLabel:'2cm',
        undownload: true
      }, {
        validDate: '2016-05-04',
        marketingSceneLabel:'已使用',
        status: 1,
        statusLabel:'2cm',
        undownload: true
      }, {
        validDate: '2016-05-01',
        marketingSceneLabel:'未使用',
        status: 0,
        statusLabel:'2cm',
        undownload: true
      }, {
        validDate: '2016-05-03',
        marketingSceneLabel:'未使用',
        status: 0,
        statusLabel:'2cm',
        undownload: true
      }]
    },
    methods: {
      cellClassName({row, column, rowIndex, columnIndex}) {
        if(columnIndex === 3) {
          var cellClass = row.status? 'danger' : 'success';
          return cellClass;
        }
        return '';
      },
      download(index) {
        this.marketingSceneList[index].undownload = false;
      },
      handleFilterTag(value, row) { //点击filter的方法
        return row.marketingSceneLabel === value;
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .download-icon {
    width: 20px;
    height: 20px;
    margin: 0 auto;
    cursor: pointer;
    background-color: red;
  }
  .redownload {
    color: #409EFF;
    cursor: pointer;
  }
</style>
