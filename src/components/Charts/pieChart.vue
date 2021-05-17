<template>
  <div class="pieCharts">
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
      name: "pie-chart",
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
                show:true,
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                right: '0',
                bottom: '0',
                itemHeight: 24,
                itemWidth: 24,
                selectedMode:false,
                textStyle:{
                  rich:{
                    a:{
                      align:'left',
                      color:'#77899c',
                    },
                    b:{
                      padding:[0, 5, 0 ,5]
                    },
                    c:{
                      align:'right',

                    },
                  }
                },

                formatter: function (name) {
                  let total = 0;
                  let target;
                  for (let i = 0, l = _dataList.length; i < l; i++) {
                    total =total+ _dataList[i].value;
                    if (_dataList[i].name == name) {
                      target = _dataList[i].value;
                    }
                  }
                  const arr = [
                    '{a|'+name+'}',
                    '{b|'+target+'}',
                    '{c|'+((target/total)*100).toFixed(2)+'%}'
                  ]
                  return arr.join('')


                }
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: ['30%', '60%'],

                  label: {
                    position: 'inner'
                  },
                  labelLine: {
                    show: false
                  },

                },
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: ['30%', '60%'],
                  label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                      a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                      },
                      // abg: {
                      //     backgroundColor: '#333',
                      //     width: '100%',
                      //     align: 'right',
                      //     height: 22,
                      //     borderRadius: [4, 4, 0, 0]
                      // },
                      hr: {
                        borderColor: '#aaa',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      b: {
                        fontSize: 16,
                        lineHeight: 33
                      },
                      per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                      }
                    }
                  },
                  data: this.chartList
                }
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
    width: 440px;
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
