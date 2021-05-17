<template>
  <div class="bar-charts">
    <div class="prompt_p">
      <h2>{{chartName}}</h2>
    </div>
    <div v-if="chartList.town.length>>0" class="echarts"  :id="title"></div>
    <div v-else class="no-digital">暂无数据</div>

  </div>
</template>

<script>
  import echarts from 'echarts'
  import DynamicFormService from '@/api/DynamicFormService'

  export default {
      name: "bar-chart",
      props:{
        config:Object
      },
      data () {
        return {
          chartList:{type: Object, required: true},
          title:{type:String, required: true},
          chartName:{type:String, required: true}
        }
      },
      mounted () {
        if(this.chartList.town.length>>0){
          this.ringDrag(this.title);
        }

      },
      methods:{
        ringDrag(chart){
          var max = Math.max.apply(null,this.dataList);
          chart= echarts.init(document.getElementById(chart),'light');
          const option = {
            color: ['#c03736', '#304554', '#64a0a7', '#d38268',
              '#93c7af','#759f84','#c9862f','#bda29b','#6e7074',
              '#556570','#c4ccd3'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:this.chartList.dataList
            },
            toolbox: {
              show: true,

            },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                data: this.chartList.town
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                type: 'bar',
                data: this.chartList.retire,

              },
              {
                type: 'bar',
                data: this.chartList.baolian,
              },

            ]
          };

// 使用刚指定的配置项和数据显示图表。
          chart.setOption(option);
        }
      }
    }

</script>

<style scoped lang="less">
  .bar-charts{
    width: 100%;
    padding: 20px;
  }

  .prompt_p{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .prompt_p p{
    font-weight:400;
    font-size: 16px;
    color: #666666;
  }
  .echarts{
    height: 315px;
    width: 100%;
  }
  .no-digital{
    height: 315px;

    background-size: 100% 315px;
    font-size:18px;
    font-weight:400;
    line-height:315px;
    color:rgba(0,0,0,1);
    opacity:0.7;
    text-align: center;
  }
</style>

