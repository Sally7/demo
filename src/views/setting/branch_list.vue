<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">门店列表</div>
    <div class="app__content">
      <el-row class="mb15" :gutter="5">
        <el-col :span="12"><el-button type="primary" @click="toShopAU">+添加门店</el-button></el-col>
        <el-col :span="4" class="text-right">
          <el-input v-model="name" placeholder="请输入门店名称" clearable></el-input>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-select v-model="areaId" filterable placeholder="所有地区">
            <el-option
              v-for="item in areaSelectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-button type="primary" @click="currentPage=1;doPage();">搜索</el-button>
          <el-button type="success" @click="currentPage=1;doReset();">重置</el-button>
        </el-col>
      </el-row>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="groups"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          align="center"
          label="门店编号"
          prop="groupNo">
        </el-table-column>
        <el-table-column
          align="center"
          label="门店名称"
          prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          label="地址"
          width="150"
          prop="address">
        </el-table-column>
        <el-table-column
          align="center"
          label="联系电话"
          prop="contact">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createDateLabel"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="storeStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toShopAU(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="toUserList(scope.row.id)">查看用户</el-button>
            <el-button type="text" size="small" @click="toExportQrcode(scope.row.id)">导出二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="counts-wrap mb15" v-if="groups.length>0">共{{totalCount}}条数据，每页显示{{pageSize}}条</div>
      <el-pagination class="text-right"
                     background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :total="totalCount"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange"
                     v-if="groups.length>0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import GroupService from '@/api/GroupService'
  import AreaService from '@/api/AreaService'
  import QRCodeService from '@/api/QRCodeService'

  export default {
    data() {
      return {
        //groupId: cacheCookies.getGroupId(),
        groups: [],
        areaSelectOptions:[],
        currentPage:1, //当前选中的页数
        pageSize:8,//每页放多少条数据
        totalCount:0,//总的数据页数
        loadingText:'正在加载,请稍后...',
        queryString:'',
        tableHeaderClass: {background: '#f0f0f0'},
        group:{},
        name:"",
        areaId:null
      }
    },
    async created(){
      var groupAreasRes = await AreaService.doSearchCitysByGroupId(cacheCookies.getGroupId());
      groupAreasRes.data.unshift({name:"全部地区",id:null});
      this.areaSelectOptions = groupAreasRes.data;

      var groupRes = await GroupService.doGetOneGroup(cacheCookies.getGroupId());
      this.group = groupRes.data;

      this.doPage();
    },
    methods: {
      async doPage(){
        this.loadingText = '正在加载,请稍后...';

        var groups = [];

        if(!this.group.generalId) {
          var groupsRes = await GroupService.doPage({
            generalId: cacheCookies.getGroupId(),
            page:this.currentPage,
            count:this.pageSize,
            name:this.name,
            areaId:this.areaId
          });

          groups = groupsRes.data;
          this.totalCount = groupsRes.total;
        } else {
          groups.push(this.group);
          this.totalCount = 1;
        }

        groups.forEach(async function(group){
          //创建时间
          group.createDateLabel = TimeUtils.formatTime(group.createDate*1000, 'Y-M-D');

          //省市区
          /*
          var areaRes = await AreaService.doGetArea(group.areaId);
          if(areaRes.data) {
            group.province = areaRes.data.name;
            group.city = areaRes.data.nodes[0].name;
            group.district = areaRes.data.nodes[0].nodes[0].name;
          }*/

          //营业状态
          if(group.storeStatus==0) {
            group.storeStatus = '即将开业';
          } else {
            group.storeStatus = '营业中';
          }
        })

        this.groups = groups;
        this.loadingText = '暂无数据';
      },
      doReset() {
        this.currentPage = 1;
        this.name = null;
        this.areaId = null;
        this.doPage();
      },
      handleCurrentChange(page) { //点击分页的组件
        this.currentPage = page;
        this.doPage();
      },
      toShopAU(id) {
        var url = "/setting/branch_list/branch_au";
        if(typeof id != "object") {
          url = "/setting/branch_list/branch_au?id=" + id;
        }
        this.$router.push(url);
      },
      toUserList(id) {
        var url = "/setting/branch_list/user_list?groupId=" + id;
        this.$router.push(url);
      },
      async toExportQrcode(id) {
        var qrcodeRes = await QRCodeService.doCreateQRCode(10, id, cacheCookies.getGroupId());
        if(qrcodeRes.status == 1) {
          window.location.href = "https://jh.njdapaidang.com/qrcode_doDownLoadQRCode.do?id="+qrcodeRes.data.id;
        }

      }
    }
  }
</script>

<style scoped>

</style>
