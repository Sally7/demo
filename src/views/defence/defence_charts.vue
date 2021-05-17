<template>
  <div class="container" id="wrapper">
    <div>
      <el-form ref="modelForm" label-width="80px" class="form-content" style="padding: 20px 10px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="搜索区域">
              <area-select type="address" ref="defeArea" :areaId="area.areaId+''" :townId="area.townId" :villageId="area.villageId" :areaLevel="+area.areaLevel"></area-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="潜力类型" prop="groupCategoryIds">
              <el-cascader
                  size="small"
                  style="width: 100%"
                  v-model="sm.groupCategoryId"
                  :props="{ value: 'id',label:'name',children:'nodes', emitPath:'false'}"
                  :options="groupCategorys"
                  filterable
                  clearable
                  @change="groupCategorySelect"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" style="margin-left: 10px;" size="small" @click="sm.page=1;doSearch()">搜索</el-button>
            <!--<el-button plain size="small" v-if="false">导出</el-button>-->
            <!--<el-button type="text" v-if="false">查看已导出的列表</el-button>-->
            <!--<el-button type="text" @click="sm.page=1;doReset()">重置筛选条件</el-button>-->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <dy-charts :charts="charts" style="flex-wrap: wrap"></dy-charts>
    </div>
  </div>
</template>

<script>
  import pieChart from '@/components/Charts/pieChart';
  import barChart from '@/components/Charts/barChart';
  import barLineChart from '@/components/Charts/barLineChart';
  import roseChart from '@/components/Charts/roseChart';
  import pictorialBarChart from '@/components/Charts/pictorialBarChart';
  import DYCharts from '@/components/DYCharts/index';

  import AreaService from '@/api/AreaService';
  import MilitiaService from '../../api/MilitiaService';
  import GroupService from '@/api/GroupService';
  import DynamicFormService from '../../api/DynamicFormService';
  import AreaSelect from '@/components/AreaSelect/index';
  import {mapGetters} from 'vuex';
  import ConfigUtil from '@/utils/ConfigUtil';
  import DyCharts from '../../components/DYCharts/index';
  import cacheCookies from '@/utils/auth';

  export default {
    name: 'militia_charts',
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        charts: [],
        sm: {
          groupCategoryId: '',
        },
        groupCategorys: [],
        currentGroupCategory: {},
      };
    },
    computed: {
      ...mapGetters([
        'area',
      ]),
    },
    components: {
      DyCharts,
      pieChart, barChart, barLineChart, roseChart, pictorialBarChart, AreaSelect, DYCharts,
    },
    async created() {
      //设置数据区域
      ConfigUtil.areaToSM(this.sm, this.area);
      this.groupCategorys = await GroupService.doSearchGroupCategoryTree();
    },
    methods: {
      async doSearch(){
        ConfigUtil.areaToSM(this.sm, this.$refs.defeArea.getArea(),this.groupId);
        this.groupCategorys = await GroupService.doSearchGroupCategoryTree();
      },
      groupCategorySelect(categorys) {
        this.findGroupCategory(categorys[categorys.length - 1], this.groupCategorys, this);
        var categoryDispose = this.currentGroupCategory.categoryDispose ? JSON.parse(this.currentGroupCategory.categoryDispose) : null;
        if (categoryDispose && categoryDispose.statistical) {
          this.charts = categoryDispose.statistical;
        } else {
          this.charts = [];
        }
      },
      findGroupCategory(id, groupCategorys, that) {
        groupCategorys.forEach(function(groupCategory) {
          if (groupCategory.id == id) {
            that.currentGroupCategory = groupCategory;
            return;
          } else if (groupCategory.nodes && groupCategory.nodes.length > 0) {
            that.findGroupCategory(id, groupCategory.nodes, that);
          }
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

  .chart-box {
    display: flex;
    justify-content: space-between;

    border-bottom: 10px solid #f0f0f0;
    .chart-box-line-item {
      width: 1030px;
      height: 400px;
      background-color: #ffffff;
    }
    .chart-box-item {
      width: 500px;
      height: 400px;
      background-color: #ffffff;
    }
  }
</style>
