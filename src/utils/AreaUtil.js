/* eslint-disable eol-last */
import AreaList from '@/utils/AreaList'

const AreaUtil = {
  getRegisterLabel (areaId) {
    var provinceList = AreaList.getAreaJson();
    for(var i=0; i< provinceList.length; i++) {
      for(var j=0; j<provinceList[i].nodes.length; j++) {
        for(var k=0; k<provinceList[i].nodes[j].nodes.length; k++) {
          if(+areaId == provinceList[i].nodes[j].nodes[k].id) {
            var provinceName = provinceList[i].name;
            var cityName = provinceList[i].nodes[j].name;
            var areaName = provinceList[i].nodes[j].nodes[k].name;
            return provinceName + " " + cityName + " " + areaName;
          }
        }
      }
    }
  }
}
export default AreaUtil
