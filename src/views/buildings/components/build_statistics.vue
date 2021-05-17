<template>
  <div class="search-box">
    <el-row
      type="flex"
      class="row-bg"
      justify="space-around"
      style="padding: 20px 20px 0"
    >
      <el-col :span="3">
        <p class="text-font2">
          管理面积<i class="el-tooltip el-icon-question"></i>
        </p>
        <p class="text-font1">{{ quadrature }}㎡</p>
        <el-divider></el-divider>
        <p class="text-font2">总房源数量：{{allCount }}间</p>
      </el-col>
      <el-col :span="5">
        <p class="text-font2">
          出租率<i class="el-tooltip el-icon-question"></i>
        </p>
        <p class="text-font1">
          {{ hireRate }}
          <!-- <span class="text-font2">环比上月底：</span><i class="text-font2">15.55%</i> -->
        </p>
        <el-divider></el-divider>
        <p class="text-font2">本月签约面积：{{signQuadratureOnThisMoth}}㎡</p>
      </el-col>
      <el-col :span="6">
        <p class="text-font2">
          在租实时均价<i class="el-tooltip el-icon-question"></i>
        </p>
        <p class="text-font1">
          {{hireAvePrice}}元/㎡.天
          <!-- <span class="text-font2">环比上月底：</span><i class="text-color-green">0.19%</i><i class="text-color-green el-icon-caret-bottom"></i> -->
        </p>
        <el-divider></el-divider>
        <!-- <p class="text-font2">本月签约均价：0元/㎡.天</p> -->
      </el-col>
      <el-col :span="5">
        <p class="text-font2">
          可招商面积<i class="el-tooltip el-icon-question"></i>
        </p>
        <p class="text-font1">
          {{QQuadrature}}㎡
          <!-- <span class="text-font2">可招商占比：</span><i class="text-color-red">56%</i><i class="text-color-red el-icon-caret-top"></i> -->
        </p>
        <el-divider></el-divider>
        <p class="text-font2">可招商房源数量：{{qqCount}}间</p>
      </el-col>
      <!-- <el-col :span="3">
        <p class="text-font2">
          预计完成率<i class="el-tooltip el-icon-question"></i>
        </p>
        <p class="text-font1">119%</p>
        <el-divider></el-divider>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import cacheCookies from "@/utils/auth";
import TimeUtils from "@/utils/TimeUtil";
import BuildingsService from "@/api/BuildingsService";

export default {
  name: "build_statistics",
  props: {
    townId: {
      type: String,
    },
    info:{
      type:Object
    }
  },
  data() {
    return {
      quadrature: 0, //管理面积
      QQuadrature: 0, //可招商面积
      hireAvePrice: 0.0, //在租实时均价
    };
  },
  computed: {
    // 出租率
    hireRate() {
      let num = this.quadrature
        ? ((this.quadrature - this.QQuadrature) / this.quadrature) * 100
        : 0;
      console.log("hireRate", num);
      return num + "%";
    },
    // 总房源数量
    allCount() {
      return this.info.allCount || 0;
    },
    // 可招商房源数量
    qqCount() {
      return this.info.quantityCount;
    },
    // 本月签约面积
    signQuadratureOnThisMoth() {
      return this.info.quadratureOnMonth;
    },

    // 本月签约价格
    signPriceOnThisMoth() {
      return 2000.0;
    },
    // 预计完成率
    willRate() {
      return "10%";
    },
    // 当前计租率
    hireNowRate() {
      return "20%";
    },
    // 预计全年计租率
    hireWillYearRate() {
      return "10%";
    },
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getYuanQuQuadrature();
    },
    /**
     * 获取园区管理面积
     */
    async getYuanQuQuadrature() {
      let params = {
        search: {
          sellStatus: 1,
          deleteStatus: 0,
          townId: this.townId,
          categoryId: "211005000000000000",
          quantity: 0,
        },
      };
      let res = await BuildingsService.getQuadrature(params);
      if ((res.status = 1)) {
        this.quadrature = res.data || 0;
      }
    },

    /**
     * 获取园区可招商面积
     */
    async getYuanQuQQuadrature() {
      let params = {
        search: {
          sellStatus: 1,
          deleteStatus: 0,
          townId: this.townId,
          categoryId: "211005000000000000",
          quantity: 1,
        },
      };
      let res = await BuildingsService.getQuadrature(params);
      if ((res.status = 1)) {
        this.QQuadrature = res.data || 0;
      }
    },

    /**
     * 获取园区实时均价
     */
    async getAvgPresentPrice() {
      let params = {
        search: {
          sellStatus: 1,
          deleteStatus: 0,
          townId: this.townId,
          categoryId: "211005000000000000",
          quantity: 0,
        },
      };
      let res = await BuildingsService.getAvgPresentPrice(params);
      if ((res.status = 1)) {
        this.hireAvePrice = res.data || 0;
      }
    },
  },
};
</script>

<style scoped>
.search-box {
  margin-top: 10px;
  padding: 20px;
}

.el-divider--horizontal {
  margin: 5px 0;
}

.el-divider--horizontal1 {
  margin: 20px 0;
  height: 2px;
}

.text-color-green {
  color: #67c23a;
  font-size: 12px;
}

.text-color-red {
  color: #f56c6c;
  font-size: 12px;
}

.text-font2 {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.text-font1 {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
}

.grid-content {
  padding: 6px;
  height: 100px;
  /* color: #fff; */
  font-size: 12px;
  border: 1px solid #e4e7ed;
}
.marb10 {
  margin-bottom: 10px;
}
</style>