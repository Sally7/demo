<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">卡管理</div>
    <div class="app__content">
        <div>
          <el-row class="mb15">
            <el-col :span="8" class="text-right" style="display: flex">
              <el-input size="small" placeholder="请输入卡名称" v-model.trim="queryString" @keyup.enter.native="pageSearchCoupon" clearable>
              </el-input>
              <el-button size="small" type="primary" style="margin-left: 20px" @click="pageSearchCoupon">搜索</el-button>
            </el-col>
          </el-row>
          <el-table class="mb15"
                    :empty-text="loadingText"
                    :data="couponList"
                    :header-row-style="tableHeaderClass"
                    style="width: 100%">
            <el-table-column
              align="center"
              label="卡券名称"
              prop="name">
            </el-table-column>
            <el-table-column
              align="center"
              prop="validDate"
              label="卡券有效期">
            </el-table-column>
            <el-table-column
              align="center"
              prop="status"
              label="全部状态"
              :filters="status"
              :filter-multiple="false"
              filter-placement="bottom-end"
              :filter-method="couponStatusFilter">
              <template slot-scope="scope">

                {{ scope.row.status| getCouponStatusName}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="库存"
              prop="count">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.count}}</span>
                  <el-popover
                    ref="popover"
                    placement="top"
                    width="200"
                    v-model="scope.row.isCountShow">
                    <p style="color:#999;margin-bottom: 10px;">请输入要增加的库存数：</p>
                    <el-input size="mini" type="number" v-model.number="addCount"></el-input>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="scope.row.isCountShow=false">取消</el-button>
                      <el-button type="primary" size="mini" @click="doAddCount(scope.row);scope.row.isCountShow=false">确定</el-button>
                    </div>
                    <span slot="reference" class="operation" ><i class="el-icon-edit"></i></span>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="可发送数量"
              prop="count">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.sendableCount}}</span>
                  <el-popover
                    ref="popover"
                    placement="top"
                    width="200"
                    v-model="scope.row.issendableCountShow">
                    <p style="color:#999;margin-bottom: 10px;">请输入要增加的发送数量：</p>
                    <el-input size="mini" type="number" v-model.number="addSendableCount"></el-input>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="scope.row.issendableCountShow=false">取消</el-button>
                      <el-button type="primary" size="mini" @click="doAddSendableCount(scope.row);scope.row.issendableCountShow=false">确定</el-button>
                    </div>
                    <span slot="reference" class="operation" ><i class="el-icon-edit"></i></span>
                  </el-popover>
                  
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="当前回收基准价">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.standardPrice}}</span>
                  <el-popover
                    ref="popover"
                    placement="top"
                    width="200"
                    v-model="scope.row.isStandardPriceShow">
                    <p style="color:#999;margin-bottom: 10px;">请输入当前的回收基准价：</p>
                    <el-input size="mini" type="text" v-model="currentBasePrice"></el-input>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="scope.row.isStandardPriceShow=false">取消</el-button>
                      <el-button type="primary" size="mini" @click="modifiedBasePrice(scope.row);scope.row.isStandardPriceShow=false">确定</el-button>
                    </div>
                    <span slot="reference" class="operation" ><i class="el-icon-edit"></i></span>
                  </el-popover>
                  
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="价格区域显示内容"
              prop="reducePrice">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.priceText}}</span>
                  <el-popover
                    ref="popover"
                    placement="top"
                    width="200"
                    v-model="scope.row.isPriceShow">
                    <p style="color:#999;margin-bottom: 10px;">请输入要显示的内容：</p>
                    <el-input size="mini" type="text" v-model="coverSummary"></el-input>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="scope.row.isPriceShow=false">取消</el-button>
                      <el-button type="primary" size="mini" @click="updateCoverSummary(scope.row);scope.row.isPriceShow=false">确定</el-button>
                    </div>
                    <span slot="reference" class="operation" ><i class="el-icon-edit"></i></span>
                  </el-popover>
                  
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="套餐">
              <template slot-scope="scope">
                <el-button type="text" @click="toCardSubkinds(scope.row.id, scope.row.goodsId, scope.row.name)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="toSendCardDialog(scope.row.id, scope.row.name)">发卡</el-button>
                <el-button type="text" @click="toCardRecord(scope.row.id)">记录</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="counts-wrap mb15" v-if="couponList.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
          <el-pagination class="text-right"
                         background
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :total="totalCount"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         v-if="couponList.length>0">
          </el-pagination>

          <el-dialog :title="cardName" :visible.sync="SendCardDialogVisible">
            <el-form :model="cardSendForm" :rules="rules" ref="cardSendForm">
              <el-form-item label="用户手机号" prop="phones">
                <el-input v-model.trim="cardSendForm.phones" type="phone"></el-input>
              </el-form-item>
              <el-form-item label="数量" prop="count">
                <el-input v-model.trim="cardSendForm.count" type="number"></el-input>
              </el-form-item>
              <el-form-item label="活动价格" prop="transactionAmount">
                <el-input v-model.trim="cardSendForm.transactionAmount" type="number"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="SendCardDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="doSendCard('cardSendForm')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from '@/api/GroupService'
  import CouponService from '@/api/CouponService'
  import KakaService from '@/api/KakaService'

  export default {
    data() {
      return {
        cardName: "",
        addCount: 1,
        addSendableCount: 1,
        coverSummary: "",
        currentBasePrice: "",
        couponList: [],
        groupId: cacheCookies.getGroupId(),
        groupRoleId: "2c933e6b62cd01560162cd2c8f570017", //报销平台店铺角色id
        loadingText:'正在加载,请稍后...',
        status:[
          {text:"已停止", value:-4},
          {text:"已领完", value:-3},
          {text:"已到期", value:-1},
          {text:"领取中", value:0}
        ],
        currentPage:1, //当前选中的页数
        pageSize:10,//每页放多少条数据
        totalCount:0,//总的数据页数
        cardSendForm: {
          phones: "",
          count: 1,
          transactionAmount: "",
          couponId: "",
          groupId: "",
          checkSend: 0
        },
        rules: {
          phones: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ],
          count :[
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          transactionAmount :[
            { required: true, message: '请输入活动价格', trigger: 'blur' }
          ]
        },
        SendCardDialogVisible: false,
        queryString: "",
        tableHeaderClass: {background: '#f0f0f0'}
      }
    },
    created() {
      this.doPageAdmin();
    },
    filters: {
      getCouponStatusName(value){
        switch(value){
          case -4:
            return "已停止";
          case -3:
            return "已领完";
          case -1:
            return "已到期";
          case 0:
            return "领取中";
        }
      }
    },
    methods: {
      async init(data){
        for(var i=0,len=data.length; i<len; i++){
          var newCoupon = {};
          newCoupon.id = data[i].id;
          newCoupon.goodsId = data[i].goodsId;
          newCoupon.name = data[i].name; //券名
          newCoupon.status = data[i].status;
          newCoupon.dateType = data[i].dateType; //日期类型
          newCoupon.pairStartDate = data[i].pairStartDate;
          newCoupon.pairEndDate = data[i].pairEndDate;
          newCoupon.count = data[i].count; //库存
          newCoupon.standardPrice = data[i].standardPrice || data[i].reducePrice; //当前回收基准价
          newCoupon.priceText = data[i].coverSummary || data[i].reducePrice; //价格区域内容

          if(data[i].dateType == 1) { //如果是指定日期，需要转换为日期格式(年.月.日)
            newCoupon.validDate = TimeUtils.formatTime(data[i].pairStartDate, 'Y-M-D') +"至" + TimeUtils.formatTime(data[i].pairEndDate, 'Y-M-D');
          } else if(data[i].dateType == 3) {
            newCoupon.validDate = "永久";
          } else{
            newCoupon.validDate = "领取后"+data[i].pairStartDate+"天生效"+data[i].pairEndDate+"天有效";
          }

          var res = await KakaService.doGetUsableCouponItemCount(this.groupId, data[i].id);
          if(res.status == 1){
            newCoupon.sendableCount = res.data;
          }

          this.couponList.push(newCoupon);
        }
      },
      async doPageAdmin(){
        this.loadingText ="正在加载,请稍后...";
        this.couponList=[];
        var res = await CouponService.doPageAdmin({
          groupId: cacheCookies.getGroupId(),
          status: 0,
          userType: 'groupUser',
          couponType: '',
          page:this.currentPage,
          count:this.pageSize
        });

        this.totalCount = res.total;
        if(res.status === 1){
          if(res.data && res.data.length > 0){
            this.init(res.data);
          }else{
            this.loadingText ="暂无数据";
          }
        }
      },
      async pageSearchCoupon(){
        if(this.queryString.length > 0){
          this.couponList=[];
          this.loadingText ="正在搜索,请稍后...";
          var res = await KakaService.pageSearchCoupon(this.queryString);
          this.totalCount = res.total;
          if(res.status === 1){
            if(res.data && res.data.length > 0){
              this.init(res.data);
            }else{
              this.loadingText ="暂无数据";
            }
          }
        }
      },
      toSendCardDialog(id, name){
        this.SendCardDialogVisible = true;
        this.cardSendForm.couponId = id;
        this.cardName = name;
      },
      //发卡
      async doSendCard(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid){
            this.cardSendForm.groupId = this.groupId;
            //console.log(this.cardSendForm);
            var res = await KakaService.doBatchIssueCouponItem(this.cardSendForm);
            this.SendCardDialogVisible = false;
            if(res.status == 1 && res.data != -1){
              this.$message({
                message: '发卡成功',
                type: 'success'
              });
              this.doPageAdmin();
            }else{
              this.$message({
                message: '发卡失败',
                type: 'error'
              });
            }
          }
        });
      },
      toCardRecord(id){
        this.$router.push("card/card_record?couponId="+id);
      },
      couponStatusFilter(value, row) {
        return row.status === value;
      },
      async doAddCount(row){
        if(this.addCount<=0){
          this.$message({
            message: '增加库存数不能少于1',
            type: 'error'
          });
          this.addCount = 1;
          return;
        }
        var res = await CouponService.doAddCouponCount({
          couponId: row.id,
          count: this.addCount
        });
        if(res.status == 1 && res.data == 1){
          this.$message({
            message: '增加库存成功',
            type: 'success'
          });
          this.doPageAdmin();
        }else{
          this.$message({
            message: '增加库存失败',
            type: 'error'
          });
        }
        this.addCount = 1;
      },
      async doAddSendableCount(row){
        if(this.addSendableCount<=0){
          this.$message({
            message: '增加可发送卡数量不能少于1',
            type: 'error'
          });
          this.addSendableCount = 1;
          return;
        }
        //console.log(typeof this.addSendableCount,typeof row.sendableCount,typeof row.count);
        if(this.addSendableCount > row.count){
          this.$message({
            message: '库存不足,请增加库存',
            type: 'error'
          });
          this.addSendableCount = 1;
          return;
        }
        var res = await KakaService.doGenerateCouponItem({
          couponId: row.id,
          count: this.addSendableCount
        });
        if(res.status == 1 && res.data == 1){
          this.$message({
            message: '增加可发送卡成功',
            type: 'success'
          });
          this.doPageAdmin();
        }else{
          this.$message({
            message: '增加可发送卡失败',
            type: 'error'
          });
        }
        this.addSendableCount = 1;
      },
      async modifiedBasePrice(row){
        if(this.currentBasePrice === row.standardPrice){
          return;
        }
        var res = await KakaService.modifiedBasePrice({
          couponId: row.id,
          newBasePrice: this.currentBasePrice
        });
        if(res.status == 1 && res.data == 1){
          this.$message({
            message: '当前回收基准价修改成功！',
            type: 'success'
          });
          this.doPageAdmin();
        }else{
          this.$message({
            message: '当前回收基准价修改失败！',
            type: 'error'
          });
        }
        this.currentBasePrice = "";
      },
      async updateCoverSummary(row){
        if(this.coverSummary === row.priceText){
          return;
        }
        var res = await KakaService.updateCoverSummary({
          couponId: row.id,
          coverSummary: this.coverSummary
        });
        if(res.status == 1 && res.data == 1){
          this.$message({
            message: '显示内容修改成功！',
            type: 'success'
          });
          this.doPageAdmin();
        }else{
          this.$message({
            message: '显示内容修改失败！',
            type: 'error'
          });
        }
        this.coverSummary = "";
      },
      toCardSubkinds(id, goodsId, name){
        this.$router.push("card/card_subkinds?couponId="+id+"&goodsId="+goodsId+"&name="+name);
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPageAdmin();
      },
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
