/**
 * Created by mac on 18/1/9.
 */
import http from '@/utils/Request'

const MilitiaService = {
  async doSearch(pformId){
    var res = await http({
      url: 'dyform_doSearchDynamicForms.do',
      data: {pformId:pformId}
    });
    return res;
  },
  async ageStatistics(type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'age',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:2
        }}
    });
    return res;
  },
  async politicalIdentityStatistics(type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'politicalIdentity',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:2
        }}
    });
    return res;
  },

  async specialtyStatistics(formItemId,type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {formItemId:'4028475a5c9df54b015c9df96aa00477',type:'militaryProfessional',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:2
        }}
    });
    return res;
  },
  async educationStatistics(formItemId,type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'education',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:2
        }}
    });
    return res;
  },


  async armyYearStatistics(type,archivesAreaId,townId,villageId){
    var res = await http({
      url: 'user_doStatisticsUserDynamicForm.do',
      data: {type:'armyYear',userSearch:{
          archivesAreaId:archivesAreaId,townId:townId,villageId:villageId,archiveType:2
        }}
    });
    return res;
  },
  async allAreaStatistics(townId,villageId,archivesAreaId){
    var res = await http({
      url: 'user_doStatisticsAreaUserDynamicForm.do',
      data: {userSearch:{townId:townId,archivesAreaId:archivesAreaId,villageId:villageId,archiveType:2}}
    });
    return res;
  },
  async militiaTypeStatistics(townId,villageId,archivesAreaId,valueIds,formItemId,type){
    var res = await http({
      url: 'user_doStatisticsAreaUserDynamicForm.do',
      data: {userSearch:{townId:townId,villageId:villageId,archivesAreaId:archivesAreaId,archiveType:2},valueIds:valueIds,formItemId:'4028475a5c9df54b015c9df96aa00447',type:'areaMilitiaType'}
    });
    return res;
  },


}
export default MilitiaService
