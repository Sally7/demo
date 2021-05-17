<template>
  <div class="offline-map">
    <div id="offineMap"></div>
  </div>
</template>

<script>
  export default {
    props: {
      mapList: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    data() {
      return {
        map: null,
      };
    },
    methods: {
      initMap() {
        console.log('initMap', this.mapList);

        this.map = this.map || new BMap.Map('offineMap', {minZoom: 1, maxZoom: 19}); // 创建Map实例
        //document.getElementById("div_gis").style.backgroundColor="#000";//改变地图背景颜色
        //this.map.centerAndZoom(new BMap.Point(119.827399,33.996015), 17);  // 初始化地图,设置中心点坐标和地图级别
        //添加缩放按钮
        this.map.addControl(new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,  //显示左边还是右边
          type: BMAP_NAVIGATION_CONTROL_LARGE, //展示的风格
        }));
        //添加比例尺
        this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
        this.map.enableScrollWheelZoom(true);
      },
      addMarker() {
        this.initMap();
        var that = this;
        console.log('addMarker', this.mapList);
        var opts = {
          width: 360,     // 信息窗口宽度
          height: 200,     // 信息窗口高度
          title: '', // 信息窗口标题
          enableMessage: true, //设置允许信息窗发送短息
          offset: new BMap.Size(10, -15),  //设置偏移
        };
        this.mapList.forEach(function(item, index) {
          //console.log(item);
          var point = new BMap.Point(item.longitude, item.latitude);
          opts.title = item.name;
          var str = '';
          str += `</br>百度：(${item.longitude}, ${item.latitude})`;
          str += `</br>大地2000：(${item.cgsc2000Longitude},${item.cgsc2000Latitude})`;
          str += `</br>军事平面：(${item.gkX},${item.gkY})`;
          var infoWindow = new BMap.InfoWindow(item.address +str, opts);
          var marker = new BMap.Marker(point);  // 创建标注
          marker.addEventListener('click', function() {
            that.map.openInfoWindow(infoWindow, point); //开启信息窗口
          });
          that.map.addOverlay(marker);              // 将标注添加到地图中
        });

        setTimeout(() => {
          this.openPoint(this.mapList[0]);
        });
      },
      openPoint(item) {
        var point = new BMap.Point(item.longitude, item.latitude);
        this.map.centerAndZoom(point, 14);

        var opts = {
          width: 360,     // 信息窗口宽度
          height: 200,     // 信息窗口高度
          title: item.name, // 信息窗口标题
          enableMessage: true, //设置允许信息窗发送短息
          offset: new BMap.Size(10, -15),  //设置偏移
        };

        var str = '';
        str += `</br>百度：(${item.longitude}, ${item.latitude})`;
        str += `</br>大地2000：(${item.cgsc2000Longitude},${item.cgsc2000Latitude})`;
        str += `</br>军事平面：(${item.gkX},${item.gkY})`;
        str += `</br>(东经:119°49'45.2839",北纬:34°0'4.0247")`;
        this.infoWindow = new BMap.InfoWindow(item.address + str, opts);
        this.map.openInfoWindow(this.infoWindow, point);
      },
    },
    mounted() {
      //this.initMap()
    },
    watch: {
      mapList: {
        handler(newValue, oldValue) {
          this.addMarker();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss">

  #offineMap {
    width: 100%;
    height: 500px;
  }

</style>
