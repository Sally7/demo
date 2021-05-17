<template>
  <div class="dynamicformStatistics">
    <div class="chart-box">

    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import DynamicFormService from '@/api/DynamicFormService'
  export default {
    name:"DynaformStatistics",
    props: {
    },
    data() {
      return {

      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
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
