<template>
  <div>
    <div style="background-color: #FFFFFF;margin-bottom: 10px;">
      <el-form ref="modelForm" class="form-content" style="padding: 20px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="搜索区域">
              <area-select type="address" ref="militiaChartArea" :areaId="area.areaId+''" :areaLevel="+area.areaLevel"></area-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" size="small" @click="sm.page=1;doFilter()">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
  <div class="app-container" id="wrapper" >

    <div class="chart-box">
      <div class="chart-box-item" style="border-right: 10px solid #f0f0f0">
        <pie-chart v-if="ageList.length" :chartList="ageList" title="age" chartName="年龄分布"></pie-chart>
      </div>
      <div class="chart-box-item">
        <rose-chart v-if="educationList.length" :chartList="educationList" title="education" chartName="学历统计"></rose-chart>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-box-item" style="border-right: 10px solid #f0f0f0">
        <bar-line-chart v-if="politicalIdentity.politicalIdentityList.length>0" :chartList="politicalIdentity.politicalIdentityList" :dataList="politicalIdentity.dataList" title="politicalIdentity" chartName="民兵政治面貌"></bar-line-chart>
      </div>
      <div class="chart-box-item">
        <pictorial-bar-chart v-if="specialityList.data.length" :chartList="specialityList"  title="speciality" chartName="民兵军事专业统计"></pictorial-bar-chart>
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
          label="总人数"
          prop="allAreaCount">
        </el-table-column>
        <el-table-column
          align="center"
          label="基干民兵"
          prop="backboneCount">
        </el-table-column>
        <el-table-column
          align="center"
          label="普通民兵"
          prop="commonCount">
        </el-table-column>

      </el-table>
    </div>
  </div>
  </div>
</template>

<script>
  import pieChart from '@/components/Charts/pieChart'
  import barChart from '@/components/Charts/barChart'
  import barLineChart from '@/components/Charts/barLineChart'
  import roseChart from '@/components/Charts/roseChart'
  import pictorialBarChart from '@/components/Charts/pictorialBarChart'
  import AreaService from  '@/api/AreaService'
  import MilitiaService from "../../api/MilitiaService"
  import RoleService from '@/api/RoleService'
  import DynamicFormService from "../../api/DynamicFormService";
  import AreaSelect from '@/components/AreaSelect/index'
  import {mapGetters} from "vuex";
  import ConfigUtil from '@/utils/ConfigUtil'
  import cacheCookies from '@/utils/auth';
  export default{
    name: "militia_charts",
    data() {
      return {
        groupId: cacheCookies.getGroupId(),
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        areaId:'16000900040000',
        areaList:[],
        distributeList:[],
        allAreaList:[],
        ageList:[],
        politicalIdentity:{
          politicalIdentityList:[],
          dataList:[]
        },
        educationList:[],
        specialityList:{
          name:[],
          data:[]
        },
        sm:{}
      }
    },
    computed: {
      ...mapGetters([
        'area'
      ]),
    },
    components: {
      pieChart,barChart,barLineChart,roseChart,pictorialBarChart,AreaSelect
    },
    async created() {
      // this.doSearchArea()
      this.doSearchAreaInfo()
      this.ageStatistics()
      this.educationStatistics()
      this.politicalIdentityStatistics()
      this.specialtyStatistics()

      },
    methods:{
      async doFilter(){
        if (this.$refs.militiaChartArea) {
          ConfigUtil.getAreaSM(this.sm, this.$refs.militiaChartArea.getArea(), this.groupId);
        }
        this.doSearchAreaInfo()
        this.ageStatistics()
        this.educationStatistics()
        this.politicalIdentityStatistics()
        this.specialtyStatistics()
      },
      async doSearchArea(){
        var res = await AreaService.doSearchArea()
        if(res.status){
          res.data.forEach((item,index) => {
            this.areaList[index] = {
              id:item.id,
              name:item.name
            }
          })
          this.doSearchAreaInfo(this.areaList)
        }
      },


      async specialtyStatistics(){
        var res = await MilitiaService.specialtyStatistics(
            null
            ,'militaryProfessional',
            this.sm.areaId,
            this.sm.townId,
            this.sm.villageId
        )
        if(res.status){
          const list =[]
          res.data.forEach((item,index) => {
            item.value = item.count
            if(item.value>0){
              this.specialityList.name[index] = item.name
              list.push(item)
            }
          })
          this.specialityList.data = list
          this.$forceUpdate()
        }
      },
      async educationStatistics(){
        var res = await MilitiaService.educationStatistics(
            null,
            'education',
            this.sm.areaId,
            this.sm.townId,
            this.sm.villageId
        )
        if(res.status){
          res.data.forEach((item,index) => {
            this.educationList[index]={
              name:item.education,
              value:item.count
            }
          })
        }
      },
      doSearchAreaInfo(){
        this.allAreaStatistics(this.sm.townId,this.sm.villageId,this.areaId)
        setTimeout(() => {


          this.$forceUpdate()
        }, 200)

      },
      async allAreaStatistics(townId,villageId,areaId){
        var res = await MilitiaService.allAreaStatistics(townId,villageId,areaId)
        if(res.status){
          res.data.forEach((item,index) => {
            this.allAreaList[index]={
              name:item.name,
              id : item.id,
              allAreaCount:item.count?item.count:0
            }
          })
          setTimeout(() => {
            this.militiaTypeStatistics(townId,villageId,this.areaId,'2c9326de73c2acda0173c38e970a0016',1)
            this.militiaTypeStatistics(townId,villageId,this.areaId,'2c9326de73c2acda0173c301bf510006',2)
          }, 50)

        }
      },
      async politicalIdentityStatistics(){
        var res = await MilitiaService.politicalIdentityStatistics(
            'politicalIdentity',
            this.sm.areaId,
            this.sm.townId,
            this.sm.villageId
        )
        if(res.status){
          res.data.forEach((item,index) => {
            item.name = item.politicalIdentity +' '+item.count+'人'
            item.value = item.count
          })
          res.data.forEach((item,index) => {
            this.politicalIdentity.politicalIdentityList[index]=item.name
            this.politicalIdentity.dataList[index] = item.value
          })
        }
      },
      async ageStatistics(){
        var res = await MilitiaService.ageStatistics(null,this.sm.areaId,this.sm.townId,this.sm.villageId)
        if(res.status){
          var list = [{ name: "20岁以下", value: 0 },
            { name: "20-29岁", value: 0 },
            { name: "30-39岁", value: 0 },
            { name: "40-49岁", value: 0 },
            { name: "50-59岁", value: 0 },
            { name: "60-69岁", value: 0 },
            { name: "70-79岁", value: 0 },
            { name: "80岁以上", value: 0 }]
          res.data.forEach((item,index) => {
            switch (parseInt(item.commentCount/10)) {
              case 0:
                list[0].value=list[0].value + item.count
                break;
              case 1:
                list[0].value=list[0].value + item.count
                break;
              case 2:
                list[1].value=list[1].value + item.count
                break;
              case 3:
                list[2].value=list[2].value + item.count
                break;
              case 4:
                list[3].value=list[3].value + item.count
                break;
              case 5:
                list[4].value=list[4].value + item.count
                break;
              case 6:
                list[5].value=list[5].value + item.count
                break;
              case 7:
                list[6].value=list[6].value + item.count
                break;
              default:
                list[7].value=list[7].value + item.count
                break;
            }
          })
          list.forEach((item,index) => {
            item.name = item.name +' '  + item.value +'人'
            if(item.value>0){
              this.ageList.push(item)
            }
          })
        }
      },
      async militiaTypeStatistics(townId,villageId,areaId,valueIds,id){
        var res = await MilitiaService.militiaTypeStatistics(townId,villageId,areaId,valueIds)
        if(res.status){
          res.data.forEach((item,index) => {
            for (var i = 0; i < this.allAreaList.length; i++) {
              if (this.allAreaList[i].id == item.id ) {
                if(id==1){
                  this.allAreaList[i].backboneCount=item.count? item.count: 0

                }else{
                  this.allAreaList[i].commonCount = item.count? item.count: 0
                }
                break;
              }
            }
          })
        }
        setTimeout(() => {
          this.distributeList = this.allAreaList
          this.$forceUpdate()
        }, 50)

      },

    }
  }
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
