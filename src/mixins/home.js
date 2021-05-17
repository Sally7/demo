import RoleService from '@/api/RoleService'
import DynamicFormService from "../api/DynamicFormService";
import MilitiaService from "../api/MilitiaService";
import { mapGetters,mapState } from 'vuex'
export default{
  data() {
    return {
      areaId:'16000900040000',
      profileStatistics: [
        {
          img:require('@/assets/icons/minbingdangan.png'),
          title1:'普通民兵数量',
          count1:null,
          title2:'基干民兵数量',
          count2:null
        },
        {
          img:require('@/assets/icons/tuiwujunrenzongshu.png'),
          title1:'退伍军人总数',
          count1:'.',
          title2:'包联人员总数',
          count2:'.'
        },

        {
          img:require('@/assets/icons/bingyizongshu.png'),
          title1:'兵役总数',
          count1:'.',
          title2:'预征总数',
          count2:'.'
        },
        {
          img:require('@/assets/icons/dfdk-zhuanyerencaishu.png'),
          title1:'地方对口专业人才数',
          count1:'.'
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'area'
    ])
  },
  async created(){
    console.log("currentUser------", this.$store.state.user);

    var countSM = {userSearch:{townId:this.area.townId, villageId:this.area.villageId, archivesAreaId:this.area.areaId, archiveType:1}};
    var veteransTotalCount = await DynamicFormService.doStatisticsUserDynamicForm(countSM);
    this.profileStatistics[1].count1 = veteransTotalCount;

    //兵役
    countSM.userSearch.archiveType=5;
    this.profileStatistics[2].count1 = await DynamicFormService.doStatisticsUserDynamicForm(countSM);

    //地专对口
    countSM.userSearch.archiveType=4;
    this.profileStatistics[3].count1 = await DynamicFormService.doStatisticsUserDynamicForm(countSM);

    //预征兵役
    countSM.userSearch.archiveType=3;
    this.profileStatistics[2].count2 = await DynamicFormService.doStatisticsUserDynamicForm(countSM);

    countSM.userSearch.archiveType=1;
    countSM.formItemId = "4028475a5c9df54b015c9df96aa00427";
    countSM.type = "baoLian";
    var baolianCount = await DynamicFormService.doStatisticsUserDynamicForm(countSM);
    this.profileStatistics[1].count2 = baolianCount;

    countSM.formItemId = '4028475a5c9df54b015c9df96aa00447';
    countSM.type = 'militiaType';
    countSM.userSearch.archiveType = 2;
    countSM.valueIds = "2c9326de73c2acda0173c38e970a0016";
    var normalMilitiaCount = await DynamicFormService.doStatisticsUserDynamicForm(countSM);
    this.profileStatistics[0].count2 = normalMilitiaCount;

    countSM.valueIds = "2c9326de73c2acda0173c301bf510006";
    var jiGanMilitiaCount = await DynamicFormService.doStatisticsUserDynamicForm(countSM);
    this.profileStatistics[0].count1 = jiGanMilitiaCount;


  },
  methods:{

  }
}
