<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">商户列表</div>
    <div class="app__content">
      <el-row class="mb15">
        <el-col :span="20"><el-button type="primary" size="mini" @click="toGroupAU">+添加商户</el-button></el-col>
        <el-col :span="4" class="text-right" style="display: flex">
          <el-input size="mini" placeholder="请输入商户名称" v-model="searchName" clearable>
          </el-input>
          <el-button size="mini" type="primary" style="margin-left: 20px" @click="doSearching">搜索</el-button>
        </el-col>
      </el-row>
      <el-table class="mb15"
              :empty-text="loadingText"
              :data="groupList"
              :header-row-style="tableHeaderClass"
              style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="商户名称"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="adminUser.account"
          label="账户">
        </el-table-column>
        <el-table-column
          align="center"
          prop="managerName"
          label="联系人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="auditingStatus"
          label="审核状态">
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          label="服务费比例"
          prop="chargeRate">
          <template slot-scope="scope">
            <span>{{scope.row.chargeRate}}%</span>
            <el-popover
                    ref="chargeRatePopover"
                    placement="right"
                    width="200"
                    v-model="scope.row.chargeRateShow">
              <p style="color:#999;margin-bottom: 10px;">请输入要修改的服务费比例：</p>
              <el-input size="mini" type="number" min="0" v-model="scope.row.chargeRate"></el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="string" @click="scope.row.chargeRateShow=false">取消</el-button>
                <el-button type="primary" size="mini" @click="doUpdateGroupChargeRate(scope.row),scope.row.chargeRateShow=false">确定</el-button>
              </div>
            </el-popover>
            <span class="operation" v-popover:chargeRatePopover @click="scope.row.chargeRateShow=true"><i class="el-icon-edit"></i></span>
          </template>
        </el-table-column>
        <el-table-column
                width="150"
                align="center"
                label="提现手续费率"
                prop="withdrawCashRate">
          <template slot-scope="scope">
            <span>{{scope.row.withdrawCashRate}}%</span>
            <el-popover
                    ref="withdrawRatePopover"
                    placement="right"
                    width="200"
                    v-model="scope.row.withdrawRateShow">
              <p style="color:#999;margin-bottom: 10px;">请输入要修改的提现手续费比例：</p>
              <el-input size="mini" type="number" min="0" v-model="scope.row.withdrawCashRate"></el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="string" @click="scope.row.withdrawRateShow=false">取消</el-button>
                <el-button type="primary" size="mini" @click="doUpdateGroupWithdrawCashRate(scope.row),scope.row.withdrawRateShow=false">确定</el-button>
              </div>
            </el-popover>
            <span class="operation" v-popover:withdrawRatePopover @click="scope.row.withdrawRateShow=true"><i class="el-icon-edit"></i></span>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="600">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="200" trigger="click"
              v-model="scope.row.visible2"
              v-if="groupList[scope.$index].auditingStatus!=1">
              <p>确定通过"{{groupList[scope.$index].name}}"审核吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doAuditing(groupList[scope.$index], 1),scope.row.visible2 = false">确定</el-button>
              </div>
              <el-button class="ml10" type="text" size="small" slot="reference">上架</el-button>
            </el-popover>
            <el-popover
              placement="top"
              width="200" trigger="click"
              v-model="scope.row.visible1"
              v-if="scope.row.auditingStatus==1">
              <p>确定下架"{{groupList[scope.$index].name}}"吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible1 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doAuditing(groupList[scope.$index], 0),scope.row.visible1 = false">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">下架</el-button>
            </el-popover>
            <el-button class="ml10" type="text" size="small" @click="toGroupAU(scope.row.id)">修改</el-button>
            <el-button class="ml10" type="text" size="small" v-for="qrCode in qrCodeList" :key="qrCode.index" @click="doGetGroup(groupList[scope.$index]),dialogVisible = true,selectedIndex=qrCode.index">{{qrCode.label}}</el-button>
            <el-popover
              placement="top"
              width="200" trigger="click"
              v-model="scope.row.visible">
              <p>确定删除"{{groupList[scope.$index].name}}"吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="doChangeStatus(0,groupList[scope.$index].id,groupList[scope.$index].adminUser.id),scope.row.visible = false">确定</el-button>
              </div>
              <el-button class="ml10" type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
            <el-button class="ml10" type="text" size="small" @click="toGroupConfigure(scope.row.id)">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="groupList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="groupList.length>0">
      </el-pagination>
    </div>
    <el-dialog
      :title="qrCodeList[selectedIndex].label"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="需要绑定的用户id" prop="userId">
          <el-input placeholder="请输入32位userId" v-model="ruleForm.userId" clearable></el-input>
        </el-form-item>
        <el-form-item label="商圈类型">
          <el-radio-group v-model="ruleForm.dialogGroupId">
            <el-radio v-for="item in dialogGroup" :key="item.id" :label="item.id" :disabled="item.name=='报多多总平台'">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="downloadQrCode('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  //import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'
  import QRCodeService from '@/api/QRCodeService'

  export default {
    data() {
      return {
        //groupId: cacheCookies.getGroupId(),
        areaId : 16000000000000, //江苏省
        cities: [], //所有城市
        cityId: "",
        cityMap: {},
        cityModel: {},
        groupList: [],
        currentPage:1, //当前选中的页数groupList
        pageSize:20,//每页放多少条数据
        totalCount:0,//总的数据页数
        searchName: "", //查询店铺名称
        loadingText:'正在加载,请稍后...',
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'},
        dialogVisible:false,
        selectedIndex:0, //选中门店抵用二维码下载按钮还是门店海报二维码下载按钮的index
        qrCodeList:[{
          index:0,label:'抵用码下载',type:22,path:'pages/discovery/discovery_deduction',outerOpen:'true'},{
          index:1,label:'海报码下载',type:21,path:'pages/reimburse/reimburse_activity',outerOpen:'true'},{
          index:2,label:'首页码下载',type:21,path:'pages/reimburse/reimburse_index',outerOpen:'false'}],
        ruleForm:{userId:'',dialogGroupId:'',shopId:''},//下载弹出框的选择ruleForm
        rules: {
          userId: [
            { required: true, message: '请输入正确的userId', trigger: 'blur' }
          ],
        }, //下载弹出框的选择rules
        dialogGroup:[] //弹框中的店铺数组
      }
    },
    created(){
      this.doPageGroup();
    },
    watch: {
      searchName(e){
        if(!e || e==''){
          this.doPageGroup();
        }
      }
    },
    methods: {
      async doPageGroup(){
        this.groupList=[];
        if(this.queryString.length > 0) {
          this.loadingText ="正在搜索,请稍后...";
        }else{
          this.loadingText ="正在加载,请稍后...";
        }
        var that = this;
        //查询江苏城市
        var res = await AreaService.doSearchCity(this.areaId);
        if(res.status == 1){
          this.cities = res.data;
          this.cities.forEach(function(city, index){
            if (city.id == that.cityId) {
              that.cityModel = city;
            }
            that.cityMap[city.id]=city.name;
          });
          //初始化店铺数据
          var response = await GroupService.doPageGroup({
            page:this.currentPage,
            count:this.pageSize,
            name:this.searchName
          });

          if(response.status && response.data && response.data.length > 0){
            this.totalCount = response.total;
            this.groupList = response.data;
            //显示城市名称
            this.groupList.forEach(function(group, index){
              that.$set(group,'visible',false);
              that.$set(group,'visible1',false);
              that.$set(group,'visible2',false);
              group.cityName = that.cityMap[group.city];
              group.createDate = TimeUtils.formatTime(group.createDate*1000, 'Y-M-D');
            });
          }else{
            this.loadingText ="暂无数据";
          }
        }
      },
      handleCurrentChange(page) { //点击分页的组件
        console.log(1);
        this.currentPage = page;
        this.doPageGroup();
      },
      //删除店铺
      doChangeStatus(status,id,userId){
        var response = GroupService.doChangeStatus({
          status: status,
          id: id,
          userId: userId
        });
        if(response.status == 1){
          this.$message({
            message: '删除成功!',
            type: 'success'
          });
          this.doPageGroup();
        }
      },
      toGroupAU(id) {
        var url = "/group/group_manage/group_au";
        if(typeof id != "object") {
          url = "/group/group_manage/group_au?id=" + id;
        }
        this.$router.push(url);
      },
      toGroupConfigure(id){
        this.$router.push("/group/group_manage/group_configure?id=" + id);
      },
      async doAuditing(group, auditingStatus) {
        var res = await GroupService.doAuditing(group.id, auditingStatus);
        if(res.status == 1) {
          group.auditingStatus = auditingStatus;
        }
      },
      async doGetGroup(group) {
        this.ruleForm ={userId:'',dialogGroupId:'',shopId:''};
        this.dialogGroup = [];
        for(var index in group.groupRationList) {
          var res = await GroupService.doGetOneGroupById(group.groupRationList[index].tradingAreaId);
          this.dialogGroup.push(res.data);
        }
        this.ruleForm.dialogGroupId = this.dialogGroup[1].id;
        this.ruleForm.shopId = group.id;
      },
      downloadQrCode(formName) {
        var that = this;
        this.$refs[formName].validate((valid) => {
          if(valid) {
            that.dialogVisible = false;
            that.doCreateWXAQRCode();
          }
        })
      },
      async doCreateWXAQRCode() {
        var qrCode = this.qrCodeList[this.selectedIndex];
        var extrParameter = qrCode.index==2?null:{"groupId":this.ruleForm.shopId,"outerOpen":qrCode.outerOpen};
        var res = await QRCodeService.doCreateWXAQRCode(this.ruleForm.dialogGroupId,this.ruleForm.userId,qrCode.type,qrCode.path,(extrParameter?JSON.stringify(extrParameter):null));
        window.location.href = process.env.BASE_API + "/qrcode_doDownLoadQRCode.do?id=" + res.data.id;
      },
      async doUpdateGroupChargeRate(group){
        await GroupService.doUpdateGroupChargeRate(group.id,group.chargeRate);
      },
      async doUpdateGroupWithdrawCashRate(group){
        await GroupService.doUpdateGroupWithdrawCashRate(group.id,group.withdrawCashRate);
      },
      doSearching(){
        console.log(this.searchName)
        this.doPageGroup();
      }
    }
  }
</script>

<style scoped>
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
