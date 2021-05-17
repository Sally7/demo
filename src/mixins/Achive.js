import cacheCookies from '@/utils/auth'
import Breadcrumb from '@/components/Breadcrumb'
import ConfigUtil from '@/utils/ConfigUtil'
import DynamicSearchModel from '@/components/DynamicSearchModel'
import GroupService from '@/api/GroupService'
import UserService from '@/api/UserService'
import AreaService from  '@/api/AreaService'
import RoleService from '@/api/RoleService'
import DynamicFormService from "../api/DynamicFormService";
import { mapGetters } from 'vuex'

export default{
  components: {
    Breadcrumb,
    DynamicSearchModel
  },
  data() {
    return {
      loadingText:'正在加载,请稍后...',
      tableHeaderClass: {background: '#f0f0f0'},
      title:"档案",
      totalCount:0,
      sm:{groupBatchNumber:ConfigUtil.getTradingAreaId(), areaId:"", gradeNum:"", dateRange:[],sortExp:'1'},
      resetSM:null,
      groupcategoryId:"",
      currentPage:1,
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
      pageSize:20,
      users:[],
      roles:[],
      userAUDialogVisible:false,
      groupId:cacheCookies.getGroupId(),
      group: {},
      pformId:"",
      nations:[{name:"汉族",value:"汉族"},{name:"蒙古族",value:"蒙古族"},{name:"回族",value:"回族"},{name:"藏族",value:"藏族"},{name:"维吾尔族",value:"维吾尔族"},{name:"苗族",value:"苗族"},{name:"彝族",value:"彝族"},{name:"壮族",value:"壮族"},{name:"布依族",value:"布依族"},{name:"朝鲜族",value:"朝鲜族"},{name:"满族",value:"满族"},{name:"侗族",value:"侗族"},{name:"瑶族",value:"瑶族"},{name:"白族",value:"白族"},{name:"土家族",value:"土家族"},{name:"哈尼族",value:"哈尼族"},{name:"哈萨克族",value:"哈萨克族"},{name:"傣族",value:"傣族"},{name:"黎族",value:"黎族"},{name:"傈僳族",value:"傈僳族"},{name:"佤族",value:"佤族"},{name:"畲族",value:"畲族"},{name:"拉祜族",value:"拉祜族"},{name:"水族",value:"水族"},{name:"东乡族",value:"东乡族"},{name:"纳西族",value:"纳西族"},{name:"景颇族",value:"景颇族"},{name:"柯尔克孜族",value:"柯尔克孜族"},{name:"土族",value:"土族"},{name:"达斡尔族",value:"达斡尔族"},{name:"仫佬族",value:"仫佬族"},{name:"羌族",value:"羌族"},{name:"布朗族",value:"布朗族"},{name:"撒拉族",value:"撒拉族"},{name:"毛南族",value:"毛南族"},{name:"仡佬族",value:"仡佬族"},{name:"锡伯族",value:"锡伯族"},{name:"阿昌族",value:"阿昌族"},{name:"普米族",value:"普米族"},{name:"塔吉克族",value:"塔吉克族"},{name:"怒族",value:"怒族"},{name:"乌兹别克族",value:"乌兹别克族"},{name:"俄罗斯族",value:"俄罗斯族"},{name:"鄂温克族",value:"鄂温克族"},{name:"德昂族",value:"德昂族"},{name:"保安族",value:"保安族"},{name:"裕固族",value:"裕固族"},{name:"京族",value:"京族"},{name:"塔塔尔族",value:"塔塔尔族"},{name:"独龙族",value:"独龙族"},{name:"鄂伦春族",value:"鄂伦春族"},{name:"赫哲族",value:"赫哲族"},{name:"门巴族",value:"门巴族"},{name:"珞巴族",value:"珞巴族"},{name:"基诺族",value:"基诺族"},{name:"高山族",value:"高山族"}],
      educations:[{name:"小学",value:"小学"},{name:"初中",value:"初中"},{name:"高中",value:"高中"},{name:"专科",value:"专科"},{name:"本科",value:"本科"},{name:"研究生",value:"研究生"},{name:"博士",value:"博士"},{name:"博士后",value:"博士后"}],
      politicalIdentitys:[{name:"中共党员",value:"中共党员"},{name:"中共预备党员",value:"中共预备党员"},{name:"共青团员",value:"共青团员"},{name:"群众",value:"群众"},{name:"民盟盟员",value:"民盟盟员"},{name:"民建会员",value:"民建会员"}],
      searhBoxDetail:false,
      exporting:false,
      selectedIds:[],
      batchDialogVisible:false,
      batchDialogTitle:"批量设置",
      batchModel:{archiveTo:"5"}
    }
  },
  computed: {
    ...mapGetters([
      'area'
    ]),
  },
  async created() {
    var that = this;

    switch (this.archiveType) {
      case 1:
        that.pformId = "1180808151591427015159272c210011";
        break;
      case 2:
        that.pformId = "ff80808151591427015159272c210023";
        break;
      case 3:
        that.pformId = "ff80808151591427015159272c210024";
        break;
      case 4:
        that.pformId = "ff80808151591427015159272c210025";
        break;
      case 5:
        that.pformId = "ff80808151591427015159272c210037";
        break;
    }


    switch (this.archiveType) {
      case 1:
        this.title = "退伍军人档案";
        this.groupcategoryId = 2002001001000000;
        break;
      case 2:
        this.title = "民兵档案";
        this.groupcategoryId = 2002002001001000;
        break;
      case 3:
        this.title = "预征兵役档案";
        this.groupcategoryId = 2002001003000000;
        break;
      case 4:
        this.title = "地专对口档案";
        this.groupcategoryId = 2002001002000000;
        break;
      case 5:
        this.title = "兵役档案档案";
        this.groupcategoryId = 2004000000000000;
        break;
    }

    var groupRes = await GroupService.doGetOneGroupById(this.groupId);
    groupRes.data.areaId = groupRes.data.areaId+"";
    this.group = groupRes.data;

    this.resetSM = JSON.parse(JSON.stringify(this.sm));

    this.doPage();
  },
  methods:{
    async doPage() {
      var that = this;
      this.users = [];
      this.loadingText = '正在加载,请稍后...';
      this.sm.archiveType = this.archiveType;
      console.log("this.archiveType", this.archiveType);

      if(this.$refs.archiveArea) {
        ConfigUtil.getAreaSM(this.sm, this.$refs.archiveArea.getArea(), this.groupId);
      }

      if(this.$refs.archiveSearchModel) {
        this.sm.valueList = this.$refs.archiveSearchModel.getItems();
      }

      var res = await UserService.doPage(this.sm, this.currentPage, this.pageSize);
      this.loadingText = '暂无档案信息';
      if(res.status != 1) {
        return
      }
      this.totalCount = res.total;


      if(this.sm.dateRange.length>0) {
        if(this.sm.dateRange[0]) {
          this.sm.startCompleteDate = this.sm.dateRange[0].getTime();
        }
        if(this.sm.dateRange[1]) {
          this.sm.endCompleteDate = this.sm.dateRange[1].getTime();
        }
      }

      this.tableData=this.users = res.data;
      this.$nextTick(() => { //获取列表数据后
        this.mixinSetSelectRow();
      });
    },
    handleCurrentChange(page) { //点击分页的组件
      this.mixinCurrentChange();
      this.currentPage = page;
      this.doPage();
      this.mixinSetSelectRow()
    },
    cleanForm() {
      this.form = {};
      this.roles.forEach(function (role) {
        role.checked = false;
      });
    },
    doConfirm() {
      var that = this;
      this.$refs["user"].validate((valid) => {
        if (valid) {
          that.doAU();
        } else {
          that.$message.warning("输入项未按规则输入！");
          return false;
        }
      });
    },
    doReset() {
      this.sm = JSON.parse(JSON.stringify(this.resetSM));
      this.doPage();
    },
    async doExport() {
      this.exporting = true;
      var exportModel = {};
      exportModel.groupcategoryId = this.groupcategoryId;
      exportModel.userSearch = this.sm;
      let sels=[],ids=[];
      sels=this.mixinGetAllSelectionData();
      for(let i=0;i<sels.length;i++){
        ids.push(sels[i].id);
      }
      exportModel.userSearch.userId = ids.join(",");
      var exportRes = await UserService.doExport(exportModel);
      this.exporting = false;
      this.sm.groupcategoryId = null;
      this.sm.userId = null;
      window.location.href = exportRes;
    },
    handleSelectionChange(rows) {//复选框改变时
      this.mixinHandleSelectionChange(rows);
    },
    toAU(id,detail) {
      var url = '/archive/archive_list_'+this.archiveType+"/archive_au";
      url+="?archiveType="+this.archiveType
      if(id) {
        url += "&id="+id;
      }
      if(detail){
        url += "&detail="+detail;
      }
      this.$router.push(url);
    },
    toImport() {
      var url = '/archive/archive_list/archive_import?archiveType='+this.archiveType;
      this.$router.push(url);
    },
    toBatch() {
      this.batchDialogTitle = "批量设置 已选"+this.selectedIds.length+"条";
      this.batchDialogVisible = true;
    },
    async doBatch(){
      if(this.selectedIds.length==0) {
        this.$message({
          message: '请先选择批量操作的数据',
          type: 'warning'
        });
        return ;
      }
      if(this.batchModel.archiveTo>-1) {
        var result = await UserService.doBatch("archiveTo", this.batchModel.archiveTo, this.selectedIds.join(","));
        if(result) {
          this.$message({
            message: '批量操作成功',
            type: 'success'
          });
          this.doPage();
        }
      }

      if(this.batchModel.batchGroup == 1) {
        this.$refs.batchGroup.getItems();
      }

      this.batchDialogVisible = false;
    },
    async doAllPage(){
      var res = await UserService.doPage(this.sm, 1, 1000)
      if(res.status != 1) {
        return
      }
      console.log('1000条：',res.data)
      return res.data;
    },
    sexFormatter(row){
      return row.sex==1?'男':'女'
    }
  }
}
