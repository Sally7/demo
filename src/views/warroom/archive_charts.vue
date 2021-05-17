<template>
  <div>
    <div style="background-color: #FFFFFF">
      <el-form ref="modelForm" class="form-content" style="padding: 20px">
        <el-row>
          <el-col>
            <el-form-item label="搜索区域">
              <area-select type="address" ref="archChartArea" :areaId="area.areaId+''" :areaLevel="+area.areaLevel"></area-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="doSearchAll">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  <div class="app-container" id="wrapper" >
      <div style="margin-top: 10px;">
        <div class="chart-box" style="margin-top: 10px;">
      <div class="chart-box-item" style="border-right: 10px solid #f0f0f0">
        <pie-chart v-if="ageList.length" :chartList="ageList" title="age" chartName="年龄分布"></pie-chart>
      </div>
      <div class="chart-box-item">
        <bar-line-chart v-if="armyYear.armyYearList.length && armyYear.dataList.length" :chartList="armyYear.armyYearList" :dataList="armyYear.dataList" title="time" chartName="服役时间统计"></bar-line-chart>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-box-item" style="border-right: 10px solid #f0f0f0">
        <bar-line-chart v-if="politicalIdentity.politicalIdentityList.length>0" :chartList="politicalIdentity.politicalIdentityList" :dataList="politicalIdentity.dataList" title="politicalIdentity" chartName="退役军人政治面貌"></bar-line-chart>
      </div>
      <div class="chart-box-item">
        <rose-chart v-if="arrangeList.length" :chartList="arrangeList" title="arrange" chartName="退役军人安置情况分析"></rose-chart>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-box-line-item">
        <bar-chart v-if="contrast.town.length>0" :chartList="contrast"  title="contras" chartName="退役军人与包联人员数对比"></bar-chart>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-box-line-item">
        <pictorial-bar-chart v-if="specialityList.data.length" :chartList="specialityList"  title="speciality" chartName="退役军人专业统计"></pictorial-bar-chart>
      </div>
    </div>
    <div class="app__content" v-if="distributeList.length>0">
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="distributeList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
          align="center"
          label="#"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="区域"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          label="退役军人总数"
          prop="allAreaCount">
        </el-table-column>
        <el-table-column
          align="center"
          label="稳控人员"
          prop="normalCount">
        </el-table-column>
        <el-table-column
          align="center"
          label="包联人员"
          prop="baoLianCount">
        </el-table-column>
        <el-table-column
          align="center"
          label="三属人员"
          prop="threeGeneraCount">
        </el-table-column>
      </el-table>
    </div>
  </div>
    </div>
  </div>

</template>

<script>
  import cacheCookies from '@/utils/auth';
  import ConfigUtil from '@/utils/ConfigUtil';
  import pieChart from '@/components/Charts/pieChart';
  import barChart from '@/components/Charts/barChart';
  import barLineChart from '@/components/Charts/barLineChart';
  import roseChart from '@/components/Charts/roseChart';
  import pictorialBarChart from '@/components/Charts/pictorialBarChart';
  import AreaService from '@/api/AreaService';
  import DynamicFormService from '../../api/DynamicFormService';
  import RoleService from '@/api/RoleService';
  import AreaSelect from '@/components/AreaSelect/index';
  import {mapGetters} from 'vuex';

  export default{
    name: 'archive_charts',
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        areaId:'16000900040000',
        areaList:[],
        distributeList:[],
        ageList:[],
        armyYear:{
          armyYearList:[],
          dataList: [],
        },
        politicalIdentity:{
          politicalIdentityList:[],
          dataList: [],
        },
        arrangeList:[],
        contrast:{
          town:[],
          baolian:[],
          retire: [],
        },
        specialityList:{
          name:[],
          data: [],
        },
        sm: {},
        groupId: cacheCookies.getGroupId(),
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
      this.armyYearStatistics();
      this.doSearchArea();
      this.ageStatistics();
      this.politicalIdentityStatistics();
      this.arrangeStatistics();
      this.specialtyStatistics();
    },
    methods:{
      async doSearchAll() {
        if (this.$refs.archChartArea) {
          ConfigUtil.getAreaSM(this.sm, this.$refs.archChartArea.getArea(), this.groupId);
        }
        this.armyYearStatistics();
        this.doSearchArea();
        this.ageStatistics();
        this.politicalIdentityStatistics();
        this.arrangeStatistics();
        this.specialtyStatistics();
      },

      async doSearchArea(){
        var res = await AreaService.doSearchArea();
        if(res.status){
          res.data.forEach((item,index) => {
            this.areaList[index] = {
              id:item.id,
              name: item.name,
            };
          });
          this.doSearchAreaInfo(this.areaList);
        }
      },
      async arrangeStatistics(){
        var res = await DynamicFormService.arrangeStatistics(
            this.sm.townId,this.sm.villageId,this.sm.archivesAreaId
        );
        if(res.status){
          const list = [
            {name: '在岗', value: 0},
            {name: '已退休', value: 0},
            {name: '未安置', value: 0},
            {name: '安置未上岗', value: 0},
            {name: '安置后下岗', value: 0},
            {name: '回乡务农', value: 0},
            {name: '自由职业', value: 0}];
          res.data.forEach((item,index) => {
            item.companyName=='在岗'?list[0].value = list[0].value + item.count
            :item.companyName=='已退休'?list[1].value = list[1].value +item.count
              :item.companyName=='未安置'?list[2].value = list[2].value + item.count
                :item.companyName=='安置未上岗'?list[3].value = list[3].value +item.count
                  :item.companyName=='安置后下岗'?list[4].value = list[4].value + item.count
                            : item.companyName == '回乡务农' ? list[5].value = list[5].value + item.count : list[6].value = list[6].value + item.count;
          });
          list.forEach((item,index) => {
            item.name = item.name + ' ' + item.value + '人';
            if(item.value>0){
              this.arrangeList.push(item);
            }
          });
        }
      },
      async specialtyStatistics(){
        var res = await DynamicFormService.specialtyStatistics(
            null,
            null,
            this.sm.archivesAreaId,
            this.sm.townId,
            this.sm.villageId
        );
        if(res.status){
          const list = [];
          res.data.forEach((item,index) => {
            item.name = item.specialty;
            item.value = item.count;
            if(item.value>0){
              this.specialityList.name[index] = item.specialty;
              list.push(item);
            }
          });
          this.specialityList.data = list;
          this.$forceUpdate();
        }
      },
      async armyYearStatistics(){
        var res = await DynamicFormService.armyYearStatistics(
            'armyYear',
            this.sm.areaId,
            this.sm.townId,
            this.sm.villageId,
        );
        if(res.status){
          var list =[
            {name: '1-2年', value: 0},
            {name: '3-5年', value: 0},
            {name: '6-8年', value: 0},
            {name: '9-12年', value: 0},
            {name: '13-16年', value: 0},
            {name: '17-20年', value: 0},
            {name: '21-24年', value: 0},
            {name: '25-30年', value: 0},
            {name: '31年以上', value: 0},
          ];
          res.data.forEach((item,index) => {
            item.currentnum<3?list[0].value = list[0].value + item.count
            :item.currentnum<6?list[1].value = list[1].value +item.count
              :item.currentnum<9?list[2].value= list[2].value +item.count
                :item.currentnum<13?list[3].value= list[3].value +item.count
                  :item.currentnum<17?list[4].value= list[4].value+item.count
                    :item.currentnum<21?list[5].value= list[5].value+item.count
                      :item.currentnum<25?list[6].value= list[6].value+item.count
                                    : item.currentnum < 31 ? list[7].value = list[7].value + item.count : list[8].value = list[8].value + item.count;
          });
          list.forEach((item,index) => {
            item.name = item.name + ' ' + item.value + '人';
            this.armyYear.armyYearList[index] = item.name;
            this.armyYear.dataList[index] = item.value;

          });
          this.$forceUpdate();
        }
      },
      async doSearchAreaInfo(){
        await this.allAreaStatistics(this.sm.townId, this.sm.villageId, this.areaId);
        await this.threeGeneraAreaStatistics(this.sm.townId, this.sm.villageId, this.areaId);
        await this.baoLianAreaStatistics(this.sm.townId, this.sm.villageId, this.areaId);
        await this.abnormalAreaStatistics(this.sm.townId, this.sm.villageId, this.areaId);
        setTimeout(() => {
          this.handleStatistics();
        }, 200);
      },
      handleStatistics(){
        this.areaList.forEach((item,index) => {
          this.distributeList[index]={
            name:item.name,
            allAreaCount: item.allAreaCount?item.allAreaCount:0,
            normalCount:item.allAreaCount-item.abnormalCount?item.allAreaCount-item.abnormalCount:0,
            baoLianCount:item.baoLianCount?item.baoLianCount:0,
            threeGeneraCount: item.threeGeneraCount ? item.threeGeneraCount : 0,
          };
          this.contrast.baolian[index] = item.baoLianCount ? item.baoLianCount : 0;
          this.contrast.retire[index] = item.allAreaCount ? item.allAreaCount : 0;
          this.contrast.town[index] = item.name;
        });
        this.contrast.dataList = ['退役军人', '包联人员'];
        this.$forceUpdate();
      },
      async politicalIdentityStatistics(){
        var res = await DynamicFormService.politicalIdentityStatistics(
            'politicalIdentity',
            this.sm.areaId,
            this.sm.townId,
            this.sm.villageId,
        );
        if(res.status){
          res.data.forEach((item,index) => {
            item.name = item.politicalIdentity;
            item.value = item.count;
          });
          res.data.forEach((item,index) => {
            this.politicalIdentity.politicalIdentityList[index] = item.name;
            this.politicalIdentity.dataList[index] = item.value;

          });
        }
      },
      async ageStatistics(){
        var res = await DynamicFormService.ageStatistics(
            'age',
            this.sm.areaId,
            this.sm.townId,
            this.sm.villageId,
        );
        if(res.status){
          var list = [
            {name: '20岁以下', value: 0},
            {name: '20-29岁', value: 0},
            {name: '30-39岁', value: 0},
            {name: '40-49岁', value: 0},
            {name: '50-59岁', value: 0},
            {name: '60-69岁', value: 0},
            {name: '70-79岁', value: 0},
            {name: '80岁以上', value: 0}];
          res.data.forEach((item,index) => {
            switch (parseInt(item.commentCount/10)) {
              case 0:
                list[0].value = list[0].value + item.count;
                break;
              case 1:
                list[0].value = list[0].value + item.count;
                break;
              case 2:
                list[1].value = list[1].value + item.count;
                break;
              case 3:
                list[2].value = list[2].value + item.count;
                break;
              case 4:
                list[3].value = list[3].value + item.count;
                break;
              case 5:
                list[4].value = list[4].value + item.count;
                break;
              case 6:
                list[5].value = list[5].value + item.count;
                break;
              case 7:
                list[6].value = list[6].value + item.count;
                break;
              default:
                list[7].value = list[7].value + item.count;
                break;
            }
          });
          list.forEach((item,index) => {
            item.name = item.name + ' ' + item.value + '人';
            if(item.value>0){
              this.ageList.push(item);
            }
          });
        }
      },
      async allAreaStatistics(townId,villageId,areaId){
        var res = await DynamicFormService.allAreaStatistics(townId, villageId, areaId);
        if(res.status){
          res.data.forEach((item,index) => {
            for (var i = 0; i < this.areaList.length; i++) {
              if (this.areaList[i].id == item.id) {
                this.areaList[i].allAreaCount = item.count ? item.count : 0;
                break;
              }
            }
          });
        }
      },
      async threeGeneraAreaStatistics(townId,villageId,areaId){
        var res = await DynamicFormService.threeGeneraAreaStatistics(townId, villageId, areaId);
        if(res.status){
          res.data.forEach((item,index) => {
            for (var i = 0; i < this.areaList.length; i++) {
              if (this.areaList[i].id == item.id) {
                this.areaList[i].threeGeneraCount = item.count ? item.count : 0;
                break;
              }
            }
          });
        }
      },
      async baoLianAreaStatistics(townId,villageId,areaId){
        var res = await DynamicFormService.baoLianAreaStatistics(townId, villageId, areaId);
        if(res.status){
          res.data.forEach((item,index) => {
            for (var i = 0; i < this.areaList.length; i++) {
              if (this.areaList[i].id == item.id) {
                this.areaList[i].baoLianCount = item.count ? item.count : 0;
                break;
              }
            }
          });
        }
      },
      async abnormalAreaStatistics(townId,villageId,areaId){
        var res = await DynamicFormService.abnormalAreaStatistics(townId, villageId, areaId);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach((item,index) => {
              for (var i = 0; i < this.areaList.length; i++) {
                if (this.areaList[i].id == item.id) {
                  this.areaList[i].abnormalCount = item.count ? item.count : 0;
                  console.log(item.count);
                  break;
                }
              }
            });
          }else {
            for (var i = 0; i < this.areaList.length; i++) {
              this.areaList[i].abnormalCount = 0;
            }
          }

        }
      },
    },
  };
</script>

<style scoped lang="less">
  .container::-webkit-scrollbar {
    width: 0px;
  }
  .chart-box{
    display: flex;
    justify-content: space-between;

    border-bottom: 10px solid #f0f0f0;
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
