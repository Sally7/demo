import http from '@/utils/Request'
import Cookies from "js-cookie";
const GatherService = {
  sendCmd(cmd){
    console.log(webSocket.readyState==webSocket.CLOSED);
    if(webSocket.readyState==webSocket.CLOSED) {
      return 0;
    } else {
      webSocket.send(cmd);
      return 1;
    }
  },
  startMain(){
    var result = this.sendCmd('bStartPlay');
    if(result) {
      this.sendCmd('bSetMode(3)');
      this.sendCmd('vSetSkewFlag(1)');
      this.sendCmd('vSetDelHBFlag(1)');
      this.sendCmd('vSetRotate(0)');
    }
  },
  stopMain() {
    this.sendCmd( "bStopPlay");
  },
  async doScanIdCard(params) {
    var res = await http({
      url: 'http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1',
      method:"GET"
    });
    res = res.replace(/\\/g,"\\\\");
    return JSON.parse(res);
  },
  async doGetFinger() {
    var res = await http({
      headers:{'Content-Type':'text/plain;charset=UTF-8'},
      url: 'http://127.0.0.1:8867/',
      data: "send{getimgae,0,60,1}"
    });
    if(res && !(Object.prototype.toString.call(res) === '[object Object]')) {
      console.log("result:", res);
      var result = res.split("|");
      console.log("result:", result);
      if(result.length == 0) {
        return ;
      }
      var resObj = {};
      resObj.status = result[0];
      resObj.data = result[2];
      resObj.fingerCode = result[3];
      eventBus.$emit('onGatherFinger', resObj);
      return resObj;
    }
    return res;
  },
  async doMatchFinter(finger1, finger2) {
    var res = await http({
      headers:{'Content-Type':'text/plain;charset=UTF-8'},
      url: 'http://127.0.0.1:8867/',
      data:"send{matchfp,"+ finger1 +","+  finger2+",0}"
    });

    if(res) {
      console.log("result:", res);

      var result = res.split("|");
      if(result.length == 0) {
        return ;
      }
      var resObj = {};
      resObj.status = result[0];
      resObj.data = result[result.length-1];
      return resObj;
    }
    return res;
  },
  doGetFingerInterval() {
    var that = this;
    var interval = setInterval(async function(){
      var res = await that.doGetFinger();
      console.log("doGetFinger.....",res);
      if(res.status == "1"){
        clearInterval(interval);
      } else {
        //
      }
    }, 1000);
  }
}
export default GatherService
