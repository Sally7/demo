<template>
  <div>
    <div id="wrapper" class="app-container">
      <div
          class="module-title"
          style="display: flex; justify-content: space-between"
      >
        楼宇列表
      </div>
      <div class="app__content">
        <div class="search-box">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form>
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
          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="24" class="text-left">
              <el-button type="primary" size="small" @click="addBuild()">新增楼栋</el-button>
              <el-button
                  type="primary"
                  size="small"
                  @click="
                  sm.page = 1;
                  doPage();
                "
              >搜索
              </el-button
              >
              <el-button plain size="small" v-if="false">导出</el-button>
              <el-button type="text" v-if="false">查看已导出的列表</el-button>
              <el-button
                  type="text"
                  @click="
                  sm.page = 1;
                  doReset();
                "
              >重置筛选条件
              </el-button
              >
              <el-button type="text" @click="searhBoxDetail = !searhBoxDetail"
              >{{
                  searhBoxDetail ? "收起" : "更多搜索"
                }}<i v-if="!searhBoxDetail" class="el-icon-arrow-down"></i
                ><i v-if="searhBoxDetail" class="el-icon-arrow-up"></i></el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 统计组件 -->
        <build-statistics
            :townId="area.townId"
            :info="{ allCount, quantityCount, quadratureOnMonth }"
        ></build-statistics>
        <div
            class="el-table mb15 el-table--fit el-table--enable-row-hover el-table--enable-row-transition"
            style="width: 100%; margin-top: 20px"
        >
          <div class="el-table__header-wrapper">
            <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 1010px"
            >
              <colgroup>
                <col width="180"/>
                <col width="90"/>
                <col width="100"/>
                <col width="150"/>
                <col width="140"/>
                <col width="90"/>
                <col width="100"/>
                <col width="80"/>
                <col width="100"/>
              </colgroup>
              <thead class="">
              <tr class="" style="background: rgb(240, 240, 240)">
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">名称</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">管理面积</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">可招商面积</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">在租均价</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">出租率</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">总房源数量</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">可招商房源数量</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">楼宇标签</div>
                </th>
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">操作</div>
                </th>
              </tr>
              </thead>
            </table>
          </div>
          <div class="el-table__body-wrapper is-scrolling-none">
            <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__body"
                style="width: 1010px"
                v-for="build in buildList"
                :key="build.id"
            >
              <colgroup>
                <col width="180"/>
                <col width="90"/>
                <col width="100"/>
                <col width="150"/>
                <col width="140"/>
                <col width="90"/>
                <col width="100"/>
                <col width="80"/>
                <col width="100"/>
              </colgroup>
              <tbody>
              <tr class="el-table__row">
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_7 is-center"
                >
                  <div class="cell"><p>{{ area.curAreaName }}{{build.name}}</p>
                    <div class="img-wrap">
                      <div class="img-box" v-if="false">
                        <img
                            data-v-a9ef90e8=""
                            src="https://splatformnew.oss-cn-shanghai.aliyuncs.com/file/8958d50e24b611eba9d563911337656e.jpg@!1xx_l"
                            width="100%"
                            height="100%"
                          />
                        </div>
                        <div class="img-content">
                          <p v-if="false">泊寓</p>

                          <!-- <p style="min-width:120px;"></p> -->
                        </div>

                      </div>
                    </div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_8 is-center"
                >
                  <div class="cell">{{ build.buildQuadrature }}</div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_9 is-center"
                >
                  <div class="cell">
                    {{ build.buildQQuadrature }}㎡<span v-if="false">6%</span>
                  </div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell">
                    <p>{{ build.AvgPresentPrice }}元/㎡.天</p>
                    <!-- <span class="text-font2">环比上月底：</span
                    ><i class="text-color-green">0.19%</i
                    ><i class="text-color-green el-icon-caret-bottom"></i> -->
                  </div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell">{{ hireRate(build) }}</div>
                  <!-- <div class="cell">
                    <span class="text-font2">环比上月底：</span
                    ><i class="text-color-red">0.19%</i
                    ><i class="text-color-red el-icon-caret-top"></i>
                  </div> -->
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell"><span>{{ build.allCount }}</span></div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell"><span>{{ build.quantityCount }}</span></div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                  >
                    <div class="cell">
                      <el-tag>园区</el-tag>
                    </div>
                  </td>
                  <td rowspan="1"
                      colspan="1"
                      class="el-table_2_column_10 is-center">
                    <el-button style="color: #2b85ff;border:none" size="mini" @click="showEdit(build)">编辑</el-button>
                    <el-dialog
                            :visible.sync="editVisible"
                            width="40%"
                            title="编辑楼栋"
                            center="center"
                            :append-to-body="true"
                            style="margin-top: 10%"
                            @close="addDialogClosedEdit"
                    >
                      <el-form ref="editFormRef" :model="form" label-width="90px" style="width: 95%;margin: 0 auto" :rules="rules">
                        <el-form-item label="楼栋名称" prop="name">
                          <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="办公室图片">
                          <el-upload
                                  :action="uploadUrl"
                                  list-type="picture-card"
                                  :file-list="fileList"
                                  :on-remove="handleRemove"
                                  :on-success="handlePictureSuccess"
                                  :on-preview="handlePictureCardPreview">
                            <i class="el-icon-plus "></i>
                          </el-upload>
                          <el-dialog :visible.sync="dialogVisible" append-to-body>
                            <img width="100%" :src="dialogImageUrl" alt="">
                          </el-dialog>
                        </el-form-item>

                        <div style="display:flex;justify-content: flex-end">
                          <el-button type="primary" @click="doEdit()" size="small">修 改</el-button>
                          <el-button @click="editVisible = false" size="small">取 消</el-button>
                        </div>
                      </el-form>
                    </el-dialog>
                    <el-button style="color: red;border:none" size="mini" @click="doDelete(build)">删除楼宇</el-button>
                    <div class="cell">
                      <el-button style="color: #2b85ff;border:none" size="mini" @click="toBuildingAu(build)">楼层管理</el-button>
                    </div>
                    </td>
                </tr>
                <!---->
              </tbody>
            </table>
            <!----><!---->
          </div>
          <!----><!----><!----><!---->
          <div
              class="el-table__column-resize-proxy"
              style="display: none"
          ></div>
        </div>
        <div class="el-row" v-if="false">
          <div class="text-left el-col el-col-8">
            <div class="mb15 text-left">共1277条数据，每页显示20条</div>
          </div>
          <div class="text-right el-col el-col-16">
            <div class="text-right el-pagination is-background">
              <button type="button" disabled="disabled" class="btn-prev">
                <i class="el-icon el-icon-arrow-left"></i>
              </button>
              <ul class="el-pager">
                <li class="number active">1</li>
                <!---->
                <li class="number">2</li>
                <li class="number">3</li>
                <li class="number">4</li>
                <li class="number">5</li>
                <li class="number">6</li>
                <li class="el-icon more btn-quicknext el-icon-more"></li>
                <li class="number">64</li>
              </ul>
              <button type="button" class="btn-next">
                <i class="el-icon el-icon-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
            :visible.sync="newBuildingVisible"
            width="40%"
            title="新增楼栋"
            center="center"
            :append-to-body="true"
            style="margin-top: 10%"
            @close="addDialogClosed"
    >
      <el-form ref="formRef" :model="form" label-width="90px" style="width: 95%;margin: 0 auto" :rules="rules">
        <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="办公室图片">
          <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-success="handlePictureSuccess"
              :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus "></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <div style="display:flex;justify-content: flex-end">
          <el-button type="primary" @click="doBigFloor()" size="small">新 增</el-button>
          <el-button @click="newBuildingVisible = false" size="small">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import AreaSelect from "@/components/AreaSelect/index";
import {mapGetters} from "vuex";
import cacheCookies from "@/utils/auth";
import TimeUtils from "@/utils/TimeUtil";
import BuildingsService from "@/api/BuildingsService";
import BuildStatistics from "./components/build_statistics";
import NewBuilding from "../../components/NewBuilding/NewBuilding";
import GoodsService from '@/api/GoodsService'
import ConfigUtil from '@/utils/ConfigUtil'

export default {
  name: "building_list",
  data() {
    return {
      newBuildingVisible: false,
      form: {
        name: '',
        imageUrl: ''
      },
      sm: {},
      searhBoxDetail: false,
      // 任务数据
      townId: "",
      buildList: [],
      uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
      allCount: 0,
      quantityCount: 0,
      quadratureOnMonth: 0, //本月签约面积
      tableList: [],
      baseYear: 2020,
      yearStep: 4,
      spanBg: {},
      nowYM: "",
      fileList:[],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      rules: {
        name: [
          { required: true, message: '请输入楼栋名称', trigger: 'change' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
      },
      editVisible:false
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["area"]),
  },
  components: {
    AreaSelect,
    BuildStatistics,
    NewBuilding
  },

  methods: {
    showEdit(build){
      this.form = build
      if(build.showUrl){
        let arr1 = build.showUrl.split(',');
        let arr2 = build.imageUrl.split(',');
        console.log(this.fileList)
        this.fileList= arr1.map((showUrl,index) => {
          return {url: showUrl, name: arr2[index]}
        });
      }
      this.editVisible = true;
    },
    addBuild(){
      this.newBuildingVisible=true
      this.form ={
        name: '',
        imageUrl: ''
      }
    },
    doEdit() {
      this.editVisible = false;
      this.doUpdate()
    },
    async doUpdate(){
      let res = await GoodsService.doUpdateFloor(this.form)

    },
    async doDelete(build){
      let res = await GoodsService.deleteFloor(build.id)
      if(res.status==1){
        this.searchBuilding();
      }
    },
    handleRemove(file, fileList) {
      var that = this;
      this.form.imageUrl = '';
      fileList.forEach(function(item) {
        if (that.form.imageUrl) {
          that.form.imageUrl += (',' + item.name);
        } else {
          that.form.imageUrl = item.name;
        }
      });
      this.fileList = fileList
    },
    handlePictureSuccess(res, file){
      var that = this;
      var fileParam = {};
      fileParam.url = res.absolute;
      console.log(res.absolute)
      fileParam.name = res.relative;
      this.form.imageUrl = '';
      this.fileList.push(fileParam);
      this.fileList.forEach(function(item, index){
        if(that.form.imageUrl){
          that.form.imageUrl += (","+item.name);
        }else{
          that.form.imageUrl = item.name;
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    toBuildingAu(info) {
      localStorage.setItem('path', '/buildings/building_managing');
      localStorage.setItem('buildInfo', JSON.stringify(info));
      this.$router.push({
        name: 'building_managing',
      });
    },
    isNewBuilding() {
      this.newBuildingVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      // this.$refs.formRef.resetFields()
    },
    addDialogClosedEdit () {
      this.fileList =[]
      // this.$refs.editFormRef.resetFields()
    },
    async init() {
      this.nowYM = TimeUtils.formatTime(new Date(), "Y-M");
      this.townId = this.area.townId;
      this.searchBuilding();
    },
    //添加楼栋
    async doBigFloor() {
      this.$refs.formRef.validate(async (valid) => {
        if(!valid) {
          that.$message({
            showClose:true,
            message: "请检查必填项",
            type: 'warning'
          });
          return;
        }
      });
      let res = await GoodsService.doBigFloor(this.form.name,this.form.imageUrl,ConfigUtil.getTradingAreaId(),null,null,0,1,1);
      console.log("image111111",this.form.imageUrl);
      console.log("name",this.form.name);
      if (res.status == 1) {
        this.buildList.push(res);
        this.newBuildingVisible = false;
        this.searchBuilding();
      }
    },
    async searchBuilding() {
      let params = { visible:'all',shopId: ConfigUtil.getTradingAreaId() };
      // let params = { shopId: "" };
      let res = await BuildingsService.searchBuilding(params);
      if (res.status == 1) {
        this.buildList = res.data;
        console.log("buildListu",this.buildList)
        this.diydataForTableList();
      }
    },
    /**
     * 组装表格数据
     */
    diydataForTableList() {
      let This = this;
      this.allCount = 0;
      this.quantityCount = 0;
      this.buildList.forEach(async (build) => {
        build.layerList = build.nodes;
        build.allCount = 0;//房源总数
        build.quantityCount = 0; //房源可招商总数
        build.AvgPresentPrice = await this.getAvgPresentPrice(build) || 0; //在租均价
        build.buildQuadrature = await this.getBiuldQuadrature(build) || 0; //管理面积
        build.buildQQuadrature = await this.getQQuadrature(build) || 0; //可招商面积
        // console.log("某楼栋的楼层列表：", build.layerList);
        build.layerList.forEach(async (layer) => {
          let params = {
            search: {
              status: 1,
              townId: This.area.townId,
              levelId: layer.id,
            },
          };
          let res = await BuildingsService.searchAllOfficeForBuilding(params);
          layer.officeList = res.status ? res.data : [];
          // console.log("某层的的办公室列表：", layer.officeList);
          layer.totalQuadrature = 0;
          layer.officeList.forEach(async (office) => {
            // console.log("该办公室是否出租：office.quantity=", office.quantity);
            this.allCount++;
            build.allCount++;
            if (office.quantity == 0) {
              //已出租，存在租赁订单
              let params = {
                orderSearchModel: {
                  serviceEndDate: "",
                  serviceStartDate: "",
                  ptradingAreaId: "2c9326de73a39f940173a4a17dd80000",
                  businessType: "211000000000000000",
                  goodsId: office.id,
                },
              };
              let res = await BuildingsService.searchHireInfoForOffice(params);
              office.orderInfo = res.status ? res.data[0] : {};
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
              build.quantityCount++;
              office.orderInfo = {};
            }

            layer.totalQuadrature += office.quadrature;
          });
        });
      });
    },

    /**
     * 获取楼栋均价
     */
    async getAvgPresentPrice(build) {
      let params = {
        search: {
          sellStatus: 1,
          deleteStatus: 0,
          townId: this.townId,
          categoryId: "211005000000000000",
          levelId: build.levelId,
        },
      };
      let res = await BuildingsService.getAvgPresentPrice(params);
      if ((res.status = 1)) {
        return res.data || 0;
      } else {
        return 0;
      }
    },

    /**
     * 获取管理面积
     */
    async getBiuldQuadrature(build) {
      let params = {
        search: {
          sellStatus: 1,
          deleteStatus: 0,
          townId: this.townId,
          categoryId: "211005000000000000",
          levelId: build.levelId,
        },
      };
      let res = await BuildingsService.getQuadrature(params);
      if ((res.status = 1)) {
        return res.data || 0;
      } else {
        return 0;
      }
    },

    /**
     * 获取可招商面积
     */
    async getQQuadrature(build) {
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
        return res.data || 0;
      } else {
        return 0;
      }
    },

    /**
     * 获取实时均价
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

    /**
     * 出租率
     */
    hireRate(build) {
      let num = build.quadrature
          ? ((build.buildQuadrature - build.buildQQuadrature) /
          this.buildQuadrature) *
          100
          : 0;
      return num + "%";
    },

    /**
     * 获取楼栋的房源数量
     */
    getBuildAllCount(build) {
      let count = 0;
      return count;
    },

    /**
     * 获取楼栋可招商数量
     */
    getBuildQCount(build) {
      let count = 0;
      return count;
    },
  },
};
</script>

<style scoped>
/deep/ .el-upload--picture-card{
  width: 100px;
  height: 100px;
}
/deep/ .el-upload{
  width: 100px;
  height: 100px;
  line-height: 100px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px;
  line-height: 100px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
  width: 100px;
  height: 100px;
  line-height: 100px;
}
/deep/ .avatar{
  width: 100px;
  height: 100px;
}
/deep/ .el-upload-list__item-status-label{
  display: none !important;
}
/deep/.el-upload-list__item.is-ready {
  display: none;
}
.search-box {
  margin-top: 10px;
}

.search-box.pad {
  padding: 10px;
}

.el-divider--horizontal {
  margin: 5px 0;
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

.img-wrap {
  display: flex;
  justify-content: space-between;
}

.img-box {
  width: 80px;
  height: 50px;
}

.img-content {
  text-align: left;
  font-size: 12px;
}
.avatar-uploader{
  width: 60px;
  height: 60px;
}
</style>