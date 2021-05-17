/**
 * Created by mac on 18/1/9.
 */
import http from '@/utils/Request'
const QRCodeService = {
  // 增加或者修改场景营销
  async doCreateQRCode(type, typeid, groupId) {
    var res = await http({
      url: 'qrcode_doCreateQRCode.do',
      data:{
        type:type,
        typeid:typeid,
        belong:groupId,
      }
    });
    return res;
  },
  async doCreateWXAQRCode(belong, typeId, type, path, extrParameter) {
    var res = await http({
      url: 'qrcodeOpen_doCreateWXAQRCode.do',
      data:{
        belong:belong,
        typeId:typeId,
        extrParameter:extrParameter,
        path:path,
        isHyaline:true,
        businessType:2,
        type:type
      }
    });
    return res;
  }
}
export default QRCodeService
