<template>
  <div>
    <div id="wrapper" class="app-container">
      <div
        class="module-title"
        style="display: flex; justify-content: space-between"
      >
        剖面图
      </div>
      <div class="app__content">
        <div class="search-box">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form label-width="120px;" label-position="right">
                  <el-form-item label="搜索区域">
                    <area-select
                      type="address"
                      ref="smArea"
                      :areaId="area.areaId"
                      :townId="area.townId"
                      :villageId="area.villageId"
                      :areaLevel="+area.areaLevel"
                    ></area-select>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-form label-width="120px;" label-position="right" :inline="true">
            <el-form-item label="楼栋" v-if="area.townId">
              <el-select
                @change="$eventBuildingSelectChange"
                v-model="val"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in buildList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="面积筛选" v-if="false">
              <el-select v-model="val" size="small" placeholder="请选择">
                <el-option
                  v-for="item in [{ value: '100', label: '假数据1' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态" v-if="false">
              <el-select v-model="val" size="small" placeholder="请选择">
                <el-option
                  v-for="item in [{ value: '100', label: '假数据1' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form
            label-width="120px;"
            label-position="right"
            :inline="true"
            v-if="false"
          >
            <el-form-item label="合同期限">
              <el-select v-model="val" size="small" placeholder="请选择">
                <el-option
                  v-for="item in [{ value: '100', label: '假数据1' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行业筛选" v-if="false">
              <el-select v-model="val" size="small" placeholder="请选择">
                <el-option
                  v-for="item in [{ value: '100', label: '假数据1' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="招商选项" v-if="false">
              <el-select v-model="val" size="small" placeholder="请选择">
                <el-option
                  v-for="item in [{ value: '100', label: '假数据1' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="控制选项" v-if="false">
              <el-select v-model="val" size="small" placeholder="请选择">
                <el-option
                  v-for="item in [{ value: '100', label: '假数据1' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="24" class="text-left">
              <el-button
                type="primary"
                size="small"
                @click="
                  sm.page = 1;
                  searchBuilding();
                "
                >搜索</el-button
              >
              <el-button plain size="small" v-if="false">导出</el-button>
              <el-button type="text" v-if="false">查看已导出的列表</el-button>
              <el-button
                type="text"
                @click="
                  sm.page = 1;
                  doReset();
                "
                >重置筛选条件</el-button
              >
              <el-button type="text"
                >{{ searhBoxDetail ? "收起" : "更多搜索"
                }}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i
                ><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i
              ></el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 统计组件 -->
        <build-statistics
          :townId="area.townId"
          :info="{ allCount, quantityCount, quadratureOnMonth }"
        ></build-statistics>
        <el-row>
          <el-col>
            <el-divider class="el-divider--horizontal1"></el-divider>
          </el-col>
        </el-row>

        <div
          class="el-table mb15 el-table--fit el-table--enable-row-hover el-table--enable-row-transition"
          style="width: 100%; margin-top: 20px"
        >
          <div class="el-table__body-wrapper is-scrolling-none">
            <table
              cellspacing="0"
              cellpadding="0"
              border="0"
              class="el-table__body"
              style="width: 100%"
            >
              <colgroup>
                <col width="100" />
                <col width="700" />
              </colgroup>
              <tbody>
                <tr
                  class="el-table__row"
                  v-for="layer in tableList"
                  :key="layer.id"
                >
                  <td rowspan="1" colspan="1" class="is-center">
                    <p>{{ layer.name }}</p>
                    <span>{{ layer.totalQuadrature }}㎡</span>
                  </td>
                  <td rowspan="1" colspan="1">
                    <div v-for="office in layer.officeList" :key="office.id">
                      <el-col :span="calcspan(layer, office)">
                        <div
                          class="grid-content"
                          :class="getOfficeColor(office)"
                        >
                          <p>{{ office.orderInfo.buyerName || "" }}</p>
                          <p>
                            <span>{{ office.quadrature }}</span
                            >㎡ <span>{{ office.title }}</span>
                          </p>
                          <p>
                            {{
                              office.orderInfo.serviceEndDate
                                ? office.orderInfo.serviceEndDate + "到期"
                                : ""
                            }}
                          </p>
                          <p v-if="false">1合同</p>
                        </div>
                      </el-col>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AreaSelect from "@/components/AreaSelect/index";
import { mapGetters } from "vuex";
import cacheCookies from "@/utils/auth";
import TimeUtils from "@/utils/TimeUtil";
import BuildingsService from "@/api/BuildingsService";
import BuildStatistics from "./components/build_statistics";

export default {
  name: "building_profile",
  data() {
    return {
      tabPosition: "left",
      value: "",
      val: "",
      sm: {},
      searhBoxDetail: false,
      // 任务数据
      groupId: cacheCookies.getGroupId(),
      townId: "",
      buildList: [],

      allCount: 0,
      quantityCount: 0,
      quadratureOnMonth: 0, //本月签约面积

      tableList: [],
      baseYear: 2020,
      yearStep: 4,
      spanBg: {},
      nowYM: "",
    };
  },
  computed: {
    ...mapGetters(["area"]),
  },
  components: {
    AreaSelect,
    BuildStatistics,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.nowYM = TimeUtils.formatTime(new Date(), "Y-M");
      this.townId = this.area.townId;
      this.calcyear();
      this.searchBuilding();
    },

    async searchBuilding() {
      let params = { shopId: this.area.townId };
      // let params = { shopId: "" };
      let res = await BuildingsService.searchBuilding(params);
      if (res.status == 1) {
        this.buildList = res.data;
        this.diydataForTableList();
      }
    },

    async $eventBuildingSelectChange(val) {
      let list = await this.buildList.find((item) => {
        return item.id == val;
      });
      this.tableList = list.nodes;
    },

    /**
     * 组装表格数据
     */
    diydataForTableList() {
      let This = this;
      this.allCount = 0;
      this.quantityCount = 0;

      this.buildList.forEach((build) => {
        build.layerList = build.nodes;
        // console.log("某楼栋的楼层列表：", build.layerList);
        build.layerList.forEach(async (layer) => {
          let params = {
            search: {
              status: 1,
              townId: This.area.townId,
              levelId: layer.levelId,
              categoryId: "211005000000000000",
            },
          };
          let res = await BuildingsService.searchAllOfficeForBuilding(params);
          // console.log('查询某个楼层下的办公室列表：',res)
          // console.log('使用参数：',params)
          layer.officeList = res.status ? res.data : [];
          // 该楼层办公室总面积
          let d1 = await BuildingsService.getSumQuadratureForBuilding({
            search: {
              groupId: This.groupId,
              levelId: layer.levelId,
            },
          });
          layer.totalQuadrature = d1.data;

          // 该楼层办公室的可招商面积
          let d2 = await BuildingsService.getSumQuadratureForBuilding({
            search: {
              groupId: This.groupId,
              levelId: layer.levelId,
              quantity: 1,
            },
          });
          layer.canQuadrature = d2.data;

          // 该楼层办公室已租赁面积
          let d3 = await BuildingsService.getSumQuadratureForBuilding({
            search: {
              groupId: This.groupId,
              levelId: layer.levelId,
              quantity: 0,
            },
          });
          layer.alreadyQuadrature = d3.data;

          layer.officeList.forEach(async (office) => {
            // console.log("该办公室是否出租：office.quantity=", office.quantity);
            this.allCount++;
            if (office.quantity == 0) {
              console.log('循环的office.id：',office.id)
              //已出租，存在租赁订单
              let res = await BuildingsService.searchHireInfoForOffice({
                orderSearchModel: {
                  serviceEndDate: "",
                  serviceStartDate: "",
                  ptradingAreaId: "2c9326de73a39f940173a4a17dd80000",
                  businessType: "211000000000000000",
                  goodsId: office.id,
                },
              });
              office.orderInfo = res.status && res.data[0] ? res.data[0] : {};
              if (!office.orderInfo) office.orderInfo = {};
              office.orderInfo.serviceEndDate = office.orderInfo.serviceEndDate
                ? TimeUtils.formatTime(office.orderInfo.serviceEndDate, "Y-M-D")
                : "";
              // console.log("去查询租赁信息：", res.data[0]);
              // 签约面积
              let orderYM = TimeUtils.formatTime(
                office.orderInfo.orderDate,
                "Y-M"
              );
              if (orderYM == this.nowYM) {
                this.quadratureOnMonth += office.quadrature || 0;
              }
            } else {
              //可招商，不存在订单
              this.quantityCount++;
              office.orderInfo = {};
            }

            // layer.totalQuadrature += office.quadrature;
          });
        });
      });
    },

    calcspan(layer, office) {
      console.log("layer:", layer);
      console.log("office:", office);

      let total, sec, span;
      total = layer.totalQuadrature;
      sec = office.quadrature;
      span = Math.floor((sec / total) * 24);
      console.log("计算span", span);
      return span;
    },

    calcyear() {
      let spanBg = { wait: "bg-wait", no: "bg-no" };
      let step = this.yearStep;
      for (let i = 0; i <= step; i++) {
        spanBg[this.baseYear + i] = "bg-" + i;
        if (i == 0) spanBg["left" + this.baseYear] = "bg-left-" + i;
        if (i == step)
          spanBg["right" + (this.baseYear + step)] = "bg-right-" + step;
      }
      this.spanBg = spanBg;
    },

    /**
     * 获取办公室色块类名 quantity
     */
    getOfficeColor(office) {
      let className = "";
      if (office.quantity) {
        //可招商
        className = this.spanBg["wait"];
      } else {
        //已出租
        let year =
          office.orderInfo && office.orderInfo.serviceEndDate
            ? TimeUtils.formatTime(office.orderInfo.serviceEndDate, "Y")
            : 0;
        if (year < this.baseYear) {
          //小于基准年份
          className = this.spanBg["left" + this.baseYear];
        } else if (year > this.baseYear + this.yearStep) {
          //大于基准年份+step(4年)
          className = this.spanBg["right" + (this.baseYear + this.yearStep)];
        } else {
          className = this.spanBg[year];
        }
      }

      return className;
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

/* 可招商 */
.grid-content.bg-wait {
  background-color: #ffffff;
}

/* 无 */
.grid-content.bg-no {
  background-color: #758eb6;
}
/* 小于参考值1 （2020） */
.grid-content.bg-left-0 {
  background-color: #b72432;
  color: #ffffff;
}
/* 等于参考值1 （2020） */
.grid-content.bg-0 {
  background-color: #f07ba7;
}
/* 等于参考值2 （2020） */
.grid-content.bg-1 {
  background-color: #f78e30;
}
/* 等于参考值3 （2020） */
.grid-content.bg-2 {
  background-color: #fae16a;
}

/* 等于参考值4 （2020） */
.grid-content.bg-3 {
  background-color: #faf496;
}
/* 等于参考值5 （2020） */
.grid-content.bg-4 {
  background-color: #bedb81;
}

/* 大于参考值5 （2020） */
.grid-content.bg-right-4 {
  background-color: #bedb81;
}

.marb10 {
  margin-bottom: 10px;
}
</style>