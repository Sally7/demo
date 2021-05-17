import http from '@/utils/Request'
const UploadService = {
  // 查询所有省市区
  async doUploadBase64Img(imgByBase64) {
    var res = await http({
      url: 'file_uploadImgByBase64.do?key=system.image.processor.1xxl',
      data:{imgByBase64:imgByBase64,type:"jpg"},
    });
    return res;
  },
  async doFileEncode(url) {
    var res = await http({
      url: 'file_doFileEncode.do',
      data:{fileUrl:url},
    });
    return res;
  }
}
export default UploadService
