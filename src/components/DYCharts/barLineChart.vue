<template>
  <div class="bar-charts">
    <div class="prompt_p">
      <h2>{{chartName}}</h2>
    </div>
    <div v-if="chartList.length>>0" class="echarts"  :id="title"></div>
    <div v-else class="no-digital">暂无数据</div>

  </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
      name: "bar-chart",
      props:{
        dataList:{type: Array, required: true},
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
          const option = {
            title: {

            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              // data: ['2012年']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: this.chartList
            },
            series: [
              {
                type: 'bar',
                data: this.dataList,
                itemStyle: {
                  //通常情况下：
                  normal:{
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params){
                      var colorList = ['#c03736', '#304554', '#64a0a7', '#d38268',
                      '#93c7af','#759f84','#c9862f','#bda29b','#6e7074',
                      '#556570','#c4ccd3'];
                      return colorList[params.dataIndex%colorList.length];
                    }
                  },
                  //鼠标悬停时：
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
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
    width: 96%;
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

