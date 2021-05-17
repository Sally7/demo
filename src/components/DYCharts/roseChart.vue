<template>
  <div class="pieCharts">
    <div class="prompt_p">
      <h2 >{{chartName}}</h2>
    </div>
    <div v-if="chartList.length>>0" class="echarts"  :id="title"></div>
    <div v-else class="no-digital">暂无数据</div>

  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: "roseChart",
    props:{
      chartList:{type: Array, required: true},
      title:{type:String,required: true},
      chartName:{type:String,required: true}
    },
    data () {
      return {
      }
    },
    mounted () {
      if(this.chartList.length>>0){
        this.ringDrag(this.title);
      }

    },
    methods:{
      ringDrag(chart){
        chart= echarts.init(document.getElementById(chart),'light');
        const _dataList=this.chartList;
        const option = {

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            feature: {

              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: [0, 110],
              center: ['50%', '50%'],
              roseType: 'radius',
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: this.chartList
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

  .pieCharts{
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
    font-size: 20px;
    color: #666666;
  }
  .echarts{
    height: 381px;
    width: 100%;
  }
  .no-digital{
    width: 100%;
    height: 381px;
    background-size: 100% 381px;
    font-size: 18px;
    font-weight:400;
    line-height:380px;
    color:#333333;
    text-align: center;
  }
</style>

