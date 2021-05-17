<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">提现记录</div>
    <div class="app__content">
      <el-row type="flex" justify="end">
        <el-date-picker type="datetime" placeholder="请选择开始日期"></el-date-picker>
        <el-button type="text" disabled style="margin: 0 5px 0 5px">至</el-button>
        <el-date-picker type="datetime" placeholder="请选择结束日期"></el-date-picker>
      </el-row>
      <el-table :empty-text="loadingText"
                :data="withdrawalRecordList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          label="微信昵称"
          prop="nickName">
        </el-table-column>
        <el-table-column
          label="提现金额"
          prop="price">
        </el-table-column>
        <el-table-column
          label="支付宝账号"
          prop="account">
        </el-table-column>
        <el-table-column
          label="支付宝姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          prop="statusText"
          :filters="[{ text: '待提现', value: 1 }, {  text: '提现成功', value: 2 }]"
          :filter-multiple="false"
          filter-placement="bottom-end"
          :filter-method="statusFilter">
          >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="withdrawalRecordList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="withdrawalRecordList.length>0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    data(){
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//共有多少条数据
        status:[
          {text:"待提现", value:1},
          {text:"提现成功", value:2}
        ],
        withdrawalRecordList:[]
      }
    },
    created(){
      console.log('这里是提现记录');
      this.doGetWithdrawalRecordList();
    },
    methods: {
      //筛选提现状态
      statusFilter(value, row) {
        console.log('value='+value);
        return row.status == value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doGetWithdrawalRecordList();
      },
      async doGetWithdrawalRecordList(){
        this.withdrawalRecordList = [{nickName:'Eleven Boy1',price:10,account:'13390939021',name:'姚小兵1',status:1},
          {nickName:'Eleven Boy2',price:100,account:'13390939021',name:'姚小兵2',status:1},
          {nickName:'Eleven Boy3',price:1000,account:'13390939021',name:'姚小兵3',status:2}];
        this.withdrawalRecordList.forEach(function (record) {
          switch(record.status){
            case 1:
              record.statusText = '待提现';
              break;
            case 2:
              record.statusText = '提现成功';
              break;
            default:
          }
        });
      }


    }
  }
</script>
