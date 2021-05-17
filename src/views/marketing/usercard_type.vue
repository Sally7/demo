<template>
  <div class="app-container app__content" id="wrapper">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="权益卡管理" name="first">
        <div>
          <el-row class="mb15">
            <el-col :span="20">
              <el-button type="primary" size="default" v-if="false">
                +添加权益卡
              </el-button>
            </el-col>
            <el-col :span="4" class="text-right">
              <el-input v-if="false"
                        size="mini"
                        placeholder="请输入搜索内容"
                        clearable>
              </el-input>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="userCardTypeList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              prop="name"
              label="权益卡名称	"
              width="100">
              <template slot-scope="scope">
                <el-image :src="scope.row.imgUrl"></el-image>
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="领取方式	"
              prop="grantType"
            >
              <template slot-scope="scope">
                {{scope.row.grantType | grantTypeFilter}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="validDate"
              label="有效期">
            </el-table-column>
            <el-table-column
              align="center"
              label="权益	"
              prop="name">
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toMakeCard(scope.row)">制卡</el-button>
                <el-popover
                  ref="popover"
                  placement="top"
                  width="200"
                  v-model="scope.row.visible">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="doDelete(scope.row.id),scope.row.visible = false">确定</el-button>
                  </div>
                </el-popover>
                <el-button v-if="false"  class="ml10" type="text" size="small" v-popover:popover>删除</el-button>
                <el-button type="text" size="small" @click="toExportQrcode(scope.row.id)">导出二维码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="userCardTypeList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="userCardTypeList.length>0">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="领卡记录" name="second">
        <div>
          <el-row :gutter="10">
            <el-col :span="3" class="text-left">
              <el-select v-model="sm.userCardTypeId" filterable placeholder="所有权益卡">
                <el-option
                  v-for="item in userCardTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="text-left">
              <el-select v-model="sm.activationStatus" filterable placeholder="全部状态">
                <el-option
                  v-for="item in activationStatuss"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" class="text-left">
              <el-input v-model="sm.cardNum" placeholder="卡号" clearable></el-input>
            </el-col>
            <el-col :span="4" class="text-left">
              <el-input v-model="sm.phone" placeholder="手机号" clearable></el-input>
            </el-col>
            <el-col :span="10" class="text-left">
              <el-date-picker
                v-model="sm.dateRange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="激活开始日期"
                end-placeholder="激活结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-col>

          </el-row>
          <el-row :gutter="10" style="margin-top: 10px;">
            <el-col :span="6" class="text-left">
              <el-input v-model="sm.toGroupId" placeholder="制卡批号" clearable></el-input>
            </el-col>
            <el-col :span="18" class="text-left">
              <el-button type="primary" @click="currentPage=1;doPageUserCard()">搜索</el-button>
              <el-button type="success" @click="currentPage=1;doResetUserCard()">重置</el-button>
              <el-button type="default" v-if="false" @click="doResetUserCard()">导出</el-button>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="userCardList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%;margin-top: 20px;">
            <el-table-column
              label="领取|激活时间	"
              width="200">
              <template slot-scope="scope">
                创建：{{scope.row.createDate | parseTime}}<br/>
                领取：{{scope.row.getDate | parseTime}}<br/>
                激活：{{scope.row.activationDate | parseTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="有效期至	"
              width="100">
              <template slot-scope="scope">
                {{scope.row.endDate | parseTime}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="卡号	"
              prop="cardNum"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="权益卡 | 类型	">
              <template slot-scope="scope">
                {{scope.row.userCardTypeName}}<br/>
                {{scope.row.grantType | grantTypeFilter}}<br/>
                批号:{{scope.row.toGroupId}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="领卡人">
              <template slot-scope="scope">
                <el-link type="primary">{{scope.row.userName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="状态"
              prop="status">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status==0?'success':'warning'">
                  {{ scope.row.status | statussFilter }}
                </el-tag>
                <br/>
                <el-tag :type="scope.row.activationStatus==1?'success':'warning'"  style="margin-top: 10px;">
                  {{scope.row.activationStatus | activationStatusFilter}}
                </el-tag>

              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-popover
                  ref="popover"
                  placement="top"
                  width="200"
                  v-model="scope.row.visible">
                  <p>确定禁用吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="doStop(scope.row.id),scope.row.visible = false">确定</el-button>
                  </div>
                </el-popover>
                <el-button class="ml10" type="text" size="small" v-popover:popover>禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="userCardTypeList.length>0">共{{totalCount}}条数据，激活xx条，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="userCardTypeList.length>0">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="makeCardForm.title" :visible.sync="makeCardDialogVisible">
      <el-form :model="makeCardForm" :rules="rules" label-width="80px" ref="user">
        <el-form-item label="制卡批号" prop="toGroupId" >
          <el-input v-model="makeCardForm.toGroupId" autocomplete="off" placeholder="请输入制卡批号"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count" >
          <el-input v-model="makeCardForm.count" type="number" min="1" max="5000" autocomplete="off" placeholder="请输入制卡数量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="makeCardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="makeCardDialogVisible = false;doMakeCard()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import QRCodeService from '@/api/QRCodeService'
  import UserCardTypeService from '@/api/UserCardTypeService'

  export default {
    data() {
      return {
        sm:{activationStatus:"-1",userCardTypeId:"",dateRange:[],groupId: cacheCookies.getGroupId()},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        activeName: 'first',
        addCount: 1,
        userCardTypeList: [],
        userCardList: [],
        groupId: cacheCookies.getGroupId(),
        loadingText:'正在加载,请稍后...',
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'},
        activationStatuss:[{id:"-1",name:"全部激活状态"},{id:"1",name:"已激活"},{id:"0",name:"待激活"}],
        statuss:[{id:"",name:"全部状态"},{id:"0",name:"正常"},{id:"3",name:"已禁用"},{id:"5",name:"已过期"},{id:"6",name:"赠送中"}],
        makeCardDialogVisible:false,
        makeCardForm:{},
        rules:{
          toGroupId: [
            { required: true, message: '请输入制卡批号', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          count: [
            { required: true, message: '请输入制卡数量', trigger: 'blur' },
            { min: 1, max: 5000, message: '单次制卡数量不超过5000', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.activeName = 'first';
      this.doPage();

    },
    filters: {
      grantTypeFilter(value){
       var grantTypes = [
          {value:1, label: "付费购买"},
          {value:2, label: "无门槛领卡"},
          {value:3, label: "按规则发放"}
        ]
       return grantTypes[value-1].label;
      },
      activationStatusFilter(value) {
        var statusLabel = "";
        var activationStatuss = [{id:"",name:"全部激活状态"},{id:"1",name:"已激活"},{id:"0",name:"待激活"}];
        activationStatuss.forEach(function (status) {
          if(+status.id == value) {
            statusLabel =  status.name;
          }
        });
        return statusLabel;
      },
      statussFilter(value) {
        var statuss = [{id:"",name:"全部状态"},{id:"0",name:"正常"},{id:"3",name:"已禁用"},{id:"5",name:"已过期"},{id:"6",name:"赠送中"}];
        var statusLabel = "";
        statuss.forEach(function (status) {
          if(+status.id == value) {
            statusLabel =  status.name;
          }
        });
        return statusLabel;
      }
    },
    methods: {
      async doPage(){
        this.userCardTypeList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var that = this;
        var response = await UserCardTypeService.doPage({
          groupId: cacheCookies.getGroupId()
        },
        this.currentPage,
        this.pageSize);

        this.totalCount = response.total;
        if(response.status === 1 && response.data.length > 0){
          response.data.forEach(function(item,index){
            if(item.dateType == 1) { //如果是指定日期，需要转换为日期格式(年.月.日)
              item.validDate = TimeUtils.formatTime(item.pairStartDate, 'Y-M-D') +"至" + TimeUtils.formatTime(item.pairEndDate, 'Y-M-D');
            } else if(item.dateType == 3) {
              item.validDate = "永久有效";
            } else {
              item.validDate = "领取后"+item.pairStartDate+"天生效，"+item.pairEndDate+"天有效";
            }
          });
          this.userCardTypeList = this.userCardTypeList.concat(response.data);
        }else{
          this.loadingText ="暂无数据";
        }
      },
      async doPageUserCard(){
        this.userCardList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }

        if(this.sm.dateRange.length>0) {
          if(this.sm.dateRange[0]) {
            this.sm.startActivationDate = this.sm.dateRange[0].getTime();
          }
          if(this.sm.dateRange[1]) {
            this.sm.endActivationDate = this.sm.dateRange[1].getTime();
          }
        }

        var that = this;
        var response = await UserCardTypeService.doPageUserCard(this.sm,
          this.currentPage,
          this.pageSize);

        this.totalCount = response.total;
        if(response.status === 1 && response.data.length > 0){
          response.data.forEach(function(item,index){

          });
          this.userCardList = this.userCardList.concat(response.data);
        }else{
          this.loadingText ="暂无数据";
        }
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        if(this.activeName == 'first') {
          this.doPage();
        } else if(this.activeName == 'second'){
          this.doPageUserCard();
        }

      },
      async doDelete(couponId) { //删除优惠券
        var response = await CouponService.doDeleteCoupon(couponId);
        if(response.status === 1){
          this.doPageAdmin();
        }
      },
      /**
       * 跳转到新增或修改券
       * 新增需要传券类型，修改则传券id
       */
      toUserCardTypeAU(param) {
        var url = "/marketing/usercard_type_au";
        if(typeof param === "string") {
          url = url + "id=" + param;
        }
        this.$router.push(url);
      },
      toDrawDetail(couponId) {
        this.$router.push("/marketing/coupon/coupon_draw_detail?couponId="+couponId);
      },
      toCancelStatic(couponId) {
        this.$router.push("/marketing/coupon/coupon_cancel_statistics?couponId="+couponId);
      },
      async handleClick(tab, event) {
        this.currentPage=1; //当前选中的页数
        this.pageSize=10;//每页放多少条数据
        this.queryString = "";
        console.log(tab, event);
        switch(tab.index) {
          case "0":
            this.doPage();
            break;
          case "1":
            var userCardTypeRes = await UserCardTypeService.doPage({groupId: cacheCookies.getGroupId()}, 1, 30);
            this.userCardTypeList = userCardTypeRes.data;
            this.userCardTypeList.unshift({id:"",name:"全部权益卡", grantType:1})
            this.doPageUserCard();
            break;
          case "2":
              break;
        }
      },
      toMakeCard(userCard){
        this.makeCardDialogVisible = true;
        this.makeCardForm.title = "制作"+userCard.name;
        this.makeCardForm.id = userCard.id;
      },
      doMakeCard() {
        window.location.href = process.env.BASE_API + "/userCard_doExportUserCard.do?userCardTypeId="+this.makeCardForm.id+"&count="+this.makeCardForm.count+"&toGroupId="+this.makeCardForm.toGroupId;
      },
      async toExportQrcode(id) {
        var qrcodeRes = await QRCodeService.doCreateQRCode(27, id, cacheCookies.getGroupId());
        if(qrcodeRes.status == 1) {
          window.location.href = process.env.BASE_API + "/qrcode_doDownLoadQRCode.do?id="+qrcodeRes.data.id;
        }

      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .operation{
    margin-left: 10px;
  }
  .operation .el-icon-edit{
    cursor: pointer;
    color: #999;
    font-size: 14px;
  }
  .operation .el-icon-edit:hover{
    color: #333;
  }
</style>
