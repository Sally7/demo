<template>
  <div class="chart-box" style="border-top: 10px solid #f0f0f0">
    <div class="chart-box-item" v-for="(chart, index) in charts" :key="index" :class="(index+1)/2==0?'border':''" v-if="chart.type==1">
      <pie-chart :config="chart" :index="index" v-if="chart.type==1"></pie-chart>
    </div>
  </div>
</template>

<script>
  import pieChart from '@/components/DYCharts/pieChart';
  import barChart from '@/components/DYCharts/barChart';
  import barLineChart from '@/components/DYCharts/barLineChart';
  import roseChart from '@/components/DYCharts/roseChart';
  import pictorialBarChart from '@/components/DYCharts/pictorialBarChart';

  import DynamicFormService from '@/api/DynamicFormService';

  export default {
    name: 'dy-charts',
    components: {
      pieChart, barChart, barLineChart, roseChart, pictorialBarChart,
    },
    props: {
      charts: Array
    },
    data() {
      return {};
    },
    mounted() {
    },
    methods: {},
  };

</script>

<style scoped lang="less">
  .border {
    border-right: 10px solid #f0f0f0;
  }
</style>

