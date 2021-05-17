<template>
    
  <div>
    <div id="wrapper" class="app-container">
      <div class="module-title" style="display: flex; justify-content: space-between">
        办公室管理
      </div>
      <div class="app__content">
        <div class="search-box">
          <el-row>
            <el-col :span="18" class="text-left">
              <el-row>
                <el-form>
                  <el-form-item label="搜索区域">
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="24" class="text-left">
              <el-button type="primary" size="small" @click="doAddOffice()">新增办公室</el-button>
              <el-button type="primary" size="small">搜索</el-button>
              <el-button type="text">重置筛选条件</el-button>

            </el-col>
          </el-row>
        </div>
        <div class="el-table mb15 el-table--fit el-table--enable-row-hover el-table--enable-row-transition"
             style="width: 100%; margin-top: 20px">
          <div class="el-table__header-wrapper">
            <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 1010px"
            >
              <colgroup>
                <col width="150"/>
                <!--                <col width="90"/>-->
                <col width="100"/>
                <col width="150"/>
                <col width="140"/>
                <col width="90"/>
                <col width="120"/>
                <col width="80"/>
                <col width="200"/>
              </colgroup>
              <thead class="">
              <tr class="" style="background: rgb(240, 240, 240)">
                <th colspan="1" rowspan="1" class="is-center is-leaf">
                  <div class="cell">办公室名称</div>
                </th>
                <!--                <th colspan="1" rowspan="1" class="is-center is-leaf">-->
                <!--                  <div class="cell">图片</div>-->
                <!--                </th>-->
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
                  <div class="cell">楼层标签</div>
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
                v-for="floor in officeList"
                :key="floor.id"
            >
              <colgroup>
                <col width="150"/>
                <!--                <col width="90"/>-->
                <col width="100"/>
                <col width="150"/>
                <col width="140"/>
                <col width="90"/>
                <col width="120"/>
                <col width="80"/>
                <col width="200"/>
              </colgroup>
              <tbody>
              <tr class="el-table__row">
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_7 is-center"
                >
                  <div class="cell"><p>{{ floor.title }}</p>
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

                      </div>
                    </div>
                  </div>
                </td>
                <!--                <td-->
                <!--                    rowspan="1"-->
                <!--                    colspan="1"-->
                <!--                    class="el-table_2_column_8 is-center"-->
                <!--                >-->
                <!--                  <div class="cell">-->
                <!--                    <img :src="floor.imageUrl" alt="loading" style="width: 20px;height: 20px;">-->
                <!--                  </div>-->
                <!--                </td>-->
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_9 is-center"
                >
                  <div class="cell">
                    50 ㎡<span v-if="false">6%</span>
                  </div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell">
                    <p> 200 元/㎡.天</p>

                  </div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell">20%</div>

                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell"><span>20</span></div>
                </td>
                <td
                    rowspan="1"
                    colspan="1"
                    class="el-table_2_column_10 is-center"
                >
                  <div class="cell"><span>10</span></div>
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
                  <el-button style="color: #2b85ff;border:none;background-color: transparent" size="mini" @click="showEdit(floor)">编辑
                  </el-button>
                  <el-dialog
                      :visible.sync="editOfficeVisible"
                      width="39%"
                      title="编辑办公室"
                      center="center"
                      :append-to-body="true"
                      @close="addDialogClosedOffice"
                  >
                    <el-form ref="formOffice" :model="formOffice" :rules="rules" label-width="120px"
                             style="width: 90%;margin: 0 auto">
                      <el-form-item label="办公室名称">
                        <el-input v-model="formOffice.title"></el-input>
                      </el-form-item>
                      <el-form-item label="办公室面积" prop="quadrature">
                        <el-input v-model.number="formOffice.quadrature"></el-input>
                      </el-form-item>
                      <el-form-item label="单位">
                        <el-input v-model="formOffice.unitName" placeholder="例如：平方米/天"></el-input>
                      </el-form-item>
                      <el-form-item label="单位价格">
                        <el-input v-model.number="formOffice.originalPrice"></el-input>
                      </el-form-item>

                      <el-form-item label="办公室图片">
                        <el-upload
                            :action="imageUrl"
                            list-type="picture-card"
                            :file-list="fileList"
                            :on-remove="handleRemove"
                            :on-success="handlePictureSuccess"
                            :on-preview="handlePictureCardPreview">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                          <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                      </el-form-item>
                      <div style="display:flex;justify-content: flex-end">
                        <el-button type="primary" @click="doEdit()" size="small">新 增</el-button>
                        <el-button @click="officeVisible = false" size="small">取 消</el-button>
                      </div>
                    </el-form>
                  </el-dialog>

                  <el-button style="color: red;border:none;background-color: transparent" size="mini" @click="doDelete(floor)">删除
                  </el-button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
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
    <!--    新增楼层-->
    <el-dialog
        :visible.sync="floorVisible"
        width="600px"
        title="新增楼层"
        center="center"
        :append-to-body="true"
        style="margin-top: 10%"
        @close="addDialogClosedFloor"
    >
      <el-form ref="floorRef" :model="formFloor" label-width="90px" style="width: 95%;margin: 0 auto">
        <el-form-item label="楼层">
          <el-input-number v-model="num1" @change="handleChange" controls-position="right" :min="0"
                           label="描述文字"></el-input-number>
          —
          <el-input-number v-model="num2" controls-position="right" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
              :action="imageUrl"
              list-type="picture-card"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-success="handlePictureSuccess"
              :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <div style="display:flex;justify-content: flex-end">
          <el-button type="primary" @click="doFloor()" size="small">新 增</el-button>
          <el-button @click="floorVisible = false" size="small">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--    新增办公室-->
    <el-dialog
        :visible.sync="officeVisible"
        width="39%"
        title="新增办公室"
        center="center"
        :append-to-body="true"
        @close="addDialogClosedOffice"
    >
      <el-form ref="formOffice" :model="formOffice" :rules="rules" label-width="120px"
               style="width: 90%;margin: 0 auto">
        <el-form-item label="办公室名称">
          <el-input v-model="formOffice.title"></el-input>
        </el-form-item>
        <el-form-item label="办公室面积" prop="quadrature">
          <el-input v-model.number="formOffice.quadrature"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formOffice.unitName" placeholder="例如：平方米/天"></el-input>
        </el-form-item>
        <el-form-item label="单位价格">
          <el-input v-model.number="formOffice.originalPrice"></el-input>
        </el-form-item>

        <el-form-item label="办公室图片">
          <el-upload
              :action="imageUrl"
              list-type="picture-card"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-success="handlePictureSuccess"
              :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <div style="display:flex;justify-content: flex-end">
          <el-button type="primary" @click="submit()" size="small">新 增</el-button>
          <el-button @click="officeVisible = false" size="small">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import GoodsService from "../../api/GoodsService";

export default {
  name: 'office_managing',
  data() {
    return {
      floorVisible: false,
      officeVisible: false,
      floorInfo: {},
      intOffice:{
        sellStatus: 1,
        discountStatus: 1,
        isWeight: 0,
        isUnited: 0,
        bookingStatus: 0,
        sellToWeixin: 1,
        sellToRepresentatives: 1,
        sellToWeb: 1,
        sellToAPP: 1,
        sellToTakeout: 1,
        distributionAwardRatio: 0,
        sendType: 3,
        quantity: 1,
        categoryId: 211005000000000000,
        unitName: '平方米/天',
        title: '',
        originalPrice: '',
        presentPrice: '',
        imageUrl: '',
        quadrature: null,
        shopCategoryList: []
      },
      formOffice: {
        sellStatus: 1,
        discountStatus: 1,
        isWeight: 0,
        isUnited: 0,
        bookingStatus: 0,
        sellToWeixin: 1,
        sellToRepresentatives: 1,
        sellToWeb: 1,
        sellToAPP: 1,
        sellToTakeout: 1,
        distributionAwardRatio: 0,
        sendType: 3,
        quantity: 1,
        categoryId: 211005000000000000,
        unitName: '平方米/天',
        title: '',
        originalPrice: '',
        presentPrice: '',
        imageUrl: '',
        quadrature: null,
        shopCategoryList: []
      },
      editOfficeVisible:false,
      rules: {

        quadrature: [{required: true, message: '办公室面积', trigger: 'change'}, {type: "number", message: '必须为数字值'}]
      },
      num1: 0,
      num2: 0,
      imageUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      formFloor: {
        floorName: '',
        imageUrl: ''
      },
      officeList: [],
      bigFloorName: this.$route.params.name,
      fileList: [],
    };
  },
  created() {
    let info = localStorage.getItem('floorInfo')
    this.floorInfo = JSON.parse(info)
    this.getOffice();
  },
  computed: {},
  components: {},
  methods: {
    addDialogClosedEdit(){

    },
    doEdit() {
      this.editOfficeVisible = false;
      this.doUpdate()
    },
    showEdit(office){
      this.editOfficeVisible=true
      this.dogetOfficeInfo(office.id)

    },
    async dogetOfficeInfo(id){
      let res = await GoodsService.doGetgoods(id)
      if(res.status){
        this.formOffice = res.data
        this.formOffice.shopCategoryList = [{
          shopCategoryId: this.floorInfo.id,
          shopId: this.floorInfo.shopId,
          levelId: this.floorInfo.levelId
        }]
        if( this.formOffice.showUrl){
          let arr1 =  this.formOffice.showUrl.split(',');
          let arr2 =  this.formOffice.imageUrl.split(',');
          this.fileList= arr1.map((showUrl,index) => {
            return {url: showUrl, name: arr2[index]}
          });
        }

      }
    },
    async doFloor() {
      for (var i = this.num1; i <= this.num2; i++) {
        console.log(i)
        let res = await GoodsService.doFloor(i + '楼', this.formFloor.imageUrl, this.buildInfo.id, this.buildInfo.name, 1, 0);
      }
      this.floorVisible = false;
      this.getFloor();
    },
    async getOffice() {
      var search = {
        shopCategoryId: this.floorInfo.id,
        status: this.floorInfo.status,
        levelId: this.floorInfo.levelId
      }
      let res = await GoodsService.getOffice({search:search});
      if (res.status == 1) {
        this.officeList = res.data;
        this.officeList.forEach((item, index) => {

        })
      } else {
        console.log("null")
      }
    },
    async doUpdate(){
      console.log(this.formOffice)
      let res = await GoodsService.doUpdateOffice(this.formOffice)
      this.getOffice();
    },
    async doDelete(office){
      let res = await GoodsService.deleteOffice(office.id)
      if(res.status==1){
        this.getOffice();
      }
    },
    handleChange(value) {
      console.log(this.num1)
      if (this.num2 < this.num1) {
        this.num2 = value
      }
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
    addDialogClosedOffice() {
      // this.$refs.officeRef.resetFields()
    },
    addDialogClosedFloor() {
      // this.$refs.floorRef.resetFields()
    },

    doAddOffice() {
      this.formOffice = this.intOffice
      this.officeVisible = true,
      this.fileList = []
      this.formOffice.shopCategoryList[0] = {
        shopCategoryId: this.floorInfo.id,
        shopId: this.floorInfo.shopId,
        levelId: this.floorInfo.levelId
      }
    },
    submit(formName) {
      console.log(this.formOffice)
      // this.officeVisible = false
      this.$refs.formOffice.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.formOffice.presentPrice = this.formOffice.originalPrice
          this.addFormOffice(this.formOffice)
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    async addFormOffice(info) {
      let res = await GoodsService.doAdd(info);
      console.log(res)
      if (res.status == 1) {
        this.officeVisible = false;
        this.getOffice();
      }
    },
    addFormFloor() {
      this.floorVisible = false
    },
    handlePictureSuccess(res, file) {
      var that = this;
      var fileParam = {};
      fileParam.url = res.absolute;
      fileParam.name = res.relative;
      this.fileList.push(fileParam);
      this.formFloor.imageUrl = '';
      this.fileList.forEach(function (item, index) {
        if (that.formFloor.imageUrl) {
          that.formFloor.imageUrl += (',' + item.name);
        } else {
          that.formFloor.imageUrl = item.name;
        }
      });
    },
    handleRemove(file) {
      console.log(this.fileList.indexOf(file));
      this.fileList.splice(this.fileList.indexOf(file), 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    }
  },
};
</script>

<style scoped>
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
  text-align: center;
  font-size: 12px;
}
</style>