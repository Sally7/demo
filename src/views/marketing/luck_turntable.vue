<template>
    <div class="app-container" id="wrapper">
        <div class="module-title">幸运大转盘</div>
        <div class="app__content">
            <el-row class="mb15">
                <el-col :span="20">
                    <el-button type="primary" size="mini" @click='doAU'>
                        +新建抽奖活动
                    </el-button>
                </el-col>
            </el-row>
            <el-table class="mb15"
                      :empty-text="loadingText"
                      :data="lotteryList"
                      :header-row-style="tableHeaderClass"
                      style="width: 100%">
                <el-table-column
                        align="center"
                        prop="name"
                        label="活动名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="statusLabel"
                        label="状态"
                        :filters="status"
                        :filter-multiple="false"
                        filter-placement="bottom-end"
                        :filter-method="statusFilter">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="activityTime"
                        label="活动时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="limitCount"
                        label="参与次数限制">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="partakeCount"
                        label="参与人数/次数">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="drawCount"
                        label="领到/未领到人数">
                </el-table-column>
                <el-table-column
                        align="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small">链接</el-button>
                        <el-popover ref="popover" placement="top" width="200" v-model="scope.row.visible">
                            <p>确定删除{{lotteryList[scope.$index].name}}吗？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="doDelete(lotteryList[scope.$index].id),scope.row.visible = false">确定</el-button>
                            </div>
                        </el-popover>
                        <el-button class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="counts-wrap mb15" v-if="lotteryList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
            <el-pagination class="text-right"
                           background
                           layout="prev, pager, next"
                           :page-size="pageSize"
                           :total="totalCount"
                           :current-page="currentPage"
                           @current-change="handleCurrentChange"
                           v-if="lotteryList.length>0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        lotteryList:[],
        status:[
          {text:"未开始", value:0},
          {text:"进行中", value:1},
          {text:"已结束", value:2}
        ],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        queryString:'',
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      this.doPageMarketingScene();
    },
    methods: {
      async doPageMarketingScene(){// 查询营销场景列表
        var list = [{
          name:'参与活动赢大奖',
          status:0,
          activityTime:'2018-04-19 00:00:00 至 2018-04-20 00:00:00',
          limitCount:3,
          partakeCount:'10/30',
          drawCount:'2/8',
        },{
          name:'每周大抽奖',
          status:1,
          activityTime:'2018-04-19 00:00:00 至 2018-04-20 00:00:00',
          limitCount:'不限',
          partakeCount:'10/30',
          drawCount:'2/8',
        },{
          name:'参与活动赢大奖',
          status:2,
          activityTime:'2018-04-19 00:00:00 至 2018-04-20 00:00:00',
          limitCount:4,
          partakeCount:'10/30',
          drawCount:'2/8',
        }];
        this.loadingText = '暂无数据';
        this.lotteryList = this.lotteryList.concat(list);
        this.totalCount = this.lotteryList.length;
        this.lotteryList.forEach(function (lottery) {
          switch(lottery.status){
            case 0:
              lottery.statusLabel = '未开始';
              break;
            case 1:
              lottery.statusLabel = '进行中';
              break;
            case 2:
              lottery.statusLabel = '已结束';
              break;
            default:
          }
        });
      },
      statusFilter(value, row) {
        return row.status === value;
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageMarketingScene();
      },
      async doDelete(marketingSceneId) { //删除场景营销
      },
      doAU() {
        console.log('pppppppp');
        this.$router.push('/marketing/luck_turntable/luck_turntable_au');
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
