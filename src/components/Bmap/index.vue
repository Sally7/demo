<template>
  <div>
    <area-select ref="mapAddress" :type="type" :areaId="areaId+''" :townId="townId" :villageId="villageId" :address="address" @doSearchAddress="doSearchAddress"></area-select>
    <div id="BDMAP" class="bmap" style="width:100%;height:500px;"></div>
  </div>
</template>

<script>
  // import AreaService from '@/api/AreaService'
  import AreaSelect from "@/components/AreaSelect"
  export default {
    //name: 'Bmap',
    components:{AreaSelect},
    props: {
      addressModel: {
        type: Object,
        default:function(){
          return {};
        }
      },
      areaId:String,
      villageId:String,
      townId:String,
      address: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "address" //area village
      },
      areaDisabled:{
        type: Boolean,
        default: false //area village
      },
    },
    data() {
      return {
        markers: [],
        point: {},
        confirmAddress: "",
        local:null
      }
    },
    watch: {

    },
    created(){
      this.init();
    },
    mounted() {
      if(!this.address){
        this.defaultCity = "南京";
      }
      this.init();
    },
    methods: {
      async init() {
        var that = this;
        var map = new BMap.Map("BDMAP", { minZoom: 1, maxZoom: 19 });     // 创建Map实例
        map.centerAndZoom(new BMap.Point(119.827399,33.996015), 17);  // 初始化地图,设置中心点坐标和地图级别
        //添加缩放按钮
        map.addControl(new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,  //显示左边还是右边
          type: BMAP_NAVIGATION_CONTROL_LARGE //展示的风格
        }));
        //添加比例尺
        map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        this.local = new BMap.LocalSearch(map, {
          renderOptions:{map: map}
        });
      },
      doSearchAddress() {
        var area = this.$refs.mapAddress.getArea();
        console.log("area:",area);
        if(area.areaId == ""){
          this.$message.error('请选择完整省市区');
          return;
        }
        var areaStr = area.provinceName + area.cityName +
                        area.areaName + area.address;
        console.log(areaStr)
        this.local.search(areaStr);
      },
      confirm() {

      },
      getArea() {
        var area = this.$refs.mapAddress.getArea();
        return area;
      }
    }
  }
</script>

<style scoped>
  #BDMAP img{
    max-width: none;
  }
  .bmap {
    border: 1px solid #e0e0e0;
  }
  .bmap img{
    max-width: none;
  }
  .zj-trisect .label {
    display: block;
    line-height: 1.5;
    color: #5a5e66;
  }
  .fix-width{
    max-width: 120px;
  }
</style>
