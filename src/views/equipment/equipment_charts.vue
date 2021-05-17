<template>
  <div class="container" id="wrapper" >
    <div>
      <el-form ref="modelForm" class="form-content" style="padding: 20px">
        <el-row>
          <el-col>
              <el-form-item label="搜索区域">
              <area-select type="address" @changesm=handlerChangesm ref="equiChartArea" :areaId="area.areaId" :areaLevel="+area.areaLevel"></area-select>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="sm.page=1;doSearch()">搜索</el-button>
            <!--<el-button plain size="small" v-if="false">导出</el-button>-->
            <!--<el-button type="text" v-if="false">查看已导出的列表</el-button>-->
            <!--<el-button type="text" @click="sm.page=1;doReset()">重置筛选条件</el-button>-->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="chart-box" style="border-top: 10px solid #f0f0f0">
      <div class="chart-box-item" style="border-right: 10px solid #f0f0f0">
        <pie-chart v-if="goodsCategoryCountList.length>0" :chartList="goodsCategoryCountList" title="name" chartName="装备分类统计"></pie-chart>
      </div>
      <div class="chart-box-item" v-if="false">
        <rose-chart v-if="jobList.length" :chartList="jobList" title="name1" chartName="医院科室人数分布"></rose-chart>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-box-item" style="border-right: 10px solid #f0f0f0" v-if="false">
        <rose-chart  v-if="xueXingList.length>0" :chartList="xueXingList" title="nam2" chartName="血型库存统计"></rose-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import pieChart from '@/components/Charts/pieChart';
  import barChart from '@/components/Charts/barChart';
  import barLineChart from '@/components/Charts/barLineChart';
  import roseChart from '@/components/Charts/roseChart';
  import pictorialBarChart from '@/components/Charts/pictorialBarChart';
  import AreaService from '@/api/AreaService';
  import MilitiaService from '../../api/MilitiaService';
  import GoodsServic from '@/api/GoodsService';
  import DynamicFormService from '../../api/DynamicFormService';
  import AreaSelect from '@/components/AreaSelect/index';
  import {mapGetters} from 'vuex';
  import ConfigUtil from '@/utils/ConfigUtil';
  import cacheCookies from '@/utils/auth';

  export default{
    name: 'equipment_charts',
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm:{
          goodsCategoryId: 210000000000000000,
        },
        goodsCategoryCountList: [],
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    components: {
      pieChart, barChart, barLineChart, roseChart, pictorialBarChart, AreaSelect,
    },
    async created() {
      //设置数据区域
      ConfigUtil.areaToSM(this.sm, this.area);
      this.goodsCategoryCountList  = await GoodsServic.doGroupByThreeLevelsGoodsCount({goodsCategoryId:210000000000000000});
      this.goodsCategoryCountList.forEach(function (goodsCategory) {
        goodsCategory.value = goodsCategory.count;
      });
      console.log( this.goodsCategoryCountList);
    },
    methods:{
      handlerChangesm(prm) {
        console.log('handlerChangesm:', prm);
      },

      async doSearch() {
        //设置数据区域
        if (this.$refs.equiChartArea) {
          ConfigUtil.getAreaSM(this.sm, this.$refs.equiChartArea.getArea(), this.groupId);
    }
        this.goodsCategoryCountList = await GoodsServic.doGroupByThreeLevelsGoodsCount(this.sm);
        this.goodsCategoryCountList.forEach(function(goodsCategory) {
          goodsCategory.value = goodsCategory.count;
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .container {
    background-color: #fff;
  }

  .container::-webkit-scrollbar {
    width: 0px;
  }
  .chart-box{
    display: flex;
    justify-content: space-between;

    border-bottom: 10px solid #f0f0f0;
    lex-wrap: wrap;
    .chart-box-line-item{
      width: 1030px;
      height: 400px;
      background-color: #ffffff;
    }
    .chart-box-item{
      width: 500px;
      height: 400px;
      background-color: #ffffff;
    }
  }
</style>
