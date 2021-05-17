<template>
  <div class="map-list">
    <div class="pagination">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :currrent-page="pageIndex" :page-size="pageSize" :total="listTotal" v-if="mapList.length > 0"></el-pagination>
    </div>
    <div class="maps">
      <ul>
        <li v-for="item in mapList" :key="item.id" @click="handleOpenPoint(item)">
          <div class="identifying-img">
            <img src="" alt="">
          </div>
          <div class="identifying-msg">
            <h2>{{item.name}}</h2>
            <div class="address">
              <label>地址：</label>
              <span>{{item.address}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mapList: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageChange: {
      type: Function,
      default: () => {}
    },
    listTotal: {
      type: Number,
      default: 0
    },
    openPoint: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 20,
      mapTotal: 0
    }
  },
  methods: {
    handleCurrentChange(index) {
      console.log(index)
      this.pageChange(index)
    },
    handleOpenPoint(item) {
      this.openPoint(item);
    }
  }
}
</script>
<style lang="scss">
  .map-list{
    width: 100%;
    .pagination{
      padding: 5px 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .maps{
      height: 100%;
      ul{
        max-height: 460px;
        overflow-y: auto;
        height: 100%;
        li{
          padding: 5px 15px;
          display: flex;
          .identifying-img{
            width: 20px;
          }
        }
        li:hover{
          background: #d4cfcf;
        }
       .identifying-msg{
         flex: 1;
         h2{
           font-size: 16px;
           font-weight: bold;
           color: blue;
         }
         .address{
           font-size: 14px;
           label{
             font-weight: bold;
           }
         }
       }
      }
    }
  }
</style>
