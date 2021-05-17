import {getLodop} from '../utils/LodopFuncs';

let LODOP,
    P_ID = '',
    TaskID1,
    TaskID2,
    t,//轮询计时器
    waiting = false,
    c = 0,//时间
    loop = 0,
    options = {};

/**
 * 核心打印：逐个打印
 * @constructor
 */
function PrintWaitLoop() {
  let This = this;
  if (!waiting) {
    LODOP = getLodop();
    this.init();
    LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
    if (LODOP.CVERSION) {
      LODOP.On_Return_Remain = true;
      LODOP.On_Return = function(TaskID, Value) {
        if (TaskID == TaskID1) {
          P_ID = Value;
          if ((P_ID != '')) {
            waiting = true;
            c = 0;
            loop = loop + 1;
            setTimeout('PrintWaitLoop()', 200);
          } else {
            document.getElementById('T14').value = '已停止循环！';
          }
        } else if (TaskID == TaskID2) {
          if (Value == 0) waiting = false;
          setTimeout('PrintWaitLoop()', 200);
        }
      };
      TaskID1 = LODOP.PRINTA();
    } else {
      P_ID = LODOP.PRINTA();
      if ((P_ID != '')) {
        waiting = true;
        c = 0;
        loop = loop + 1;
        setTimeout('PrintWaitLoop()', 200);
      } else {document.getElementById('T14').value = '已停止循环！';}
    }
    ;
  } else {
    c = c + 1;
//      document.getElementById('T14').value = '正打印第' + loop + '个任务(JOB代码' +
//          P_ID +
//          ')等待：' + c / 5 + '秒';
    if (LODOP.CVERSION) {
      TaskID2 = LODOP.GET_VALUE('PRINT_STATUS_EXIST', P_ID);
    } else {
      if (!LODOP.GET_VALUE('PRINT_STATUS_EXIST', P_ID)) waiting = false;//以是否还在队列为准
      setTimeout('PrintWaitLoop()', 200);
    }
    ;
  }
};

/**
 * 核心打印：单个打印
 * @constructor
 */
function PrintWait(service) {
  if (c > 0) {
    console.log('正打印中...');
    return;
  }
  LODOP = getLodop();
  service.init();
  LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
  if (LODOP.CVERSION) {
    LODOP.On_Return = function(TaskID, Value) {
      P_ID = Value;
      if (P_ID != '') {
        c = 0;
        C_WaitFor();
      }
    };
    LODOP.PRINTA();
//    LODOP.PREVIEW();
  } else {
    P_ID = LODOP.PRINTA();
    if (P_ID != '') {alert('本系统只支持C-LODOP打印');}
  }
}

function C_WaitFor() {
  if (options.popleyer) options.popleyer();
  let already = false, //打印完成的标志
      c = c + 1;
  console.log('正等待(JOB代码是' + P_ID + ')打印结果：' + c + '秒');

  t = setTimeout(C_WaitFor, 1000);
  LODOP.On_Return_Remain = true;
  LODOP.On_Return = function(TaskID, Value) {
    if (TaskID == TaskID1) {
      if (Value == 1) {
        clearTimeout(t);
        console.log('打印成功');
        c = 0;
        already=true;
        options.callback('success', '打印成功');
      }
      ;
    } else if (TaskID == TaskID2) {
      if (Value == 0 && !already) {
        clearTimeout(t);
        console.log('打印任务被删除！');
        c = 0;
        options.callback('success', '打印任务被删除');
      }
    }
  };
  TaskID1 = LODOP.GET_VALUE('PRINT_STATUS_OK', P_ID);
  TaskID2 = LODOP.GET_VALUE('PRINT_STATUS_EXIST', P_ID);
  if (c > 50) {
    clearTimeout(t);
    console.log('打印超时(50秒)！');
    c = 0;
    options.callback('error', '打印超时(50秒)，请检查打印机是否连通');
  }
};

const LodopPrinterService = {
  /**
   * 打印名称:目前有：政审打印、档案打印、花名册打印
   */
  title: '',
  /**
   * 打印内容
   */
  html: '',
  /**
   * 水印
   */
  watermark: '',
  /**
   * 附带条码
   */
  barcode: '',
  /**
   * 回调，用来关闭弹出层
   */
  callback: Function,

  //设置打印配置项
  setOptions: (global) => {
    options = global;
    this.title = options.title || '私密文件';
    this.html = options.html || '';
    this.watermark = options.watermark || '';
    this.barcode = options.barcode || '';
    if (global.callback) this.callback = options.callback;
  },

  //初始化LODOP
  init() {
    LODOP.PRINT_INIT(options.title);
    LODOP.SET_PRINT_STYLE('FontSize', 12);
    LODOP.SET_PRINT_STYLE('Bold', 1);
    if (options.watermark) this.setwatermark();
    LODOP.ADD_PRINT_HTM(
        '1.5cm',
        '2cm',
        'RightMargin:1.4cm',
        'BottomMargin:1cm',
        options.html);
    if (options.barcode) this.setlinebarcode(options.barcode);
  },

  /**
   * 打印入口
   */
  print() {
    PrintWait(this);
  },

  /**
   * 水印设置
   * @param text
   */
  setwatermark() {
    LODOP.ADD_PRINT_TEXT(13, 22, 180, 60, options.watermark);
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20);
    LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#F2F2F2');
    LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1);
    LODOP.SET_PRINT_STYLEA(0, 'Angle', 50);
    LODOP.SET_PRINT_STYLEA(0, 'Repeat', true);
  },

  /**
   * 条形码
   * @param text
   */
  setlinebarcode() {
    LODOP.ADD_PRINT_BARCODE(48, 484, 248, 35, 'code93', options.barcode);
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
  },

  /**
   * 回调，用来处理关闭弹出层
   * @param type
   * @param msg
   */
  closelayer(type, msg) {
    this.callback(type, msg);
  },

  /**
   * 获取某个类型的状态码
   * @param type
   * @param jobid
   * @param oResultOB
   * @return {*}
   */
  getStatusValue(type, jobid, callback) {
    LODOP = getLodop();
    if (LODOP.CVERSION) LODOP.On_Return = function(TaskID, Value) {
      if(callback)callback(Value);
    };
    var strResult = LODOP.GET_VALUE(type, jobid);
    if (!LODOP.CVERSION) return strResult; else return '';
  },

  /**
   * 从JOB代码找出打印机序号
   * @param strJOBID
   * @return {*}
   * @constructor
   */
  GetPrinterIDfromJOBID(strJOBID) {
    var intPos = strJOBID.indexOf('_');
    if (intPos < 0) {return strJOBID;} else {return strJOBID.substr(0, intPos);}
  },

  /**
   * 暂停打印
   * @param strJOBID
   * @constructor
   */
  ControlPrinterPAUSE(strJOBID) {
    strPrinterID = GetPrinterIDfromJOBID(strJOBID);
    LODOP = getLodop();
    if (LODOP.CVERSION) {
      LODOP.On_Return = function(TaskID, Value) {
        alert('暂停结果:' + Value);
      };
      LODOP.SET_PRINT_MODE('CONTROL_PRINTER:' + strPrinterID, 'PAUSE');
      return;
    } else {
      var strResult = LODOP.SET_PRINT_MODE(
          'CONTROL_PRINTER:' + strPrinterID,
          'PAUSE',
      );
      alert('暂停结果:' + strResult);
    }
  },

  /**
   * 恢复打印
   * @param strJOBID
   * @constructor
   */
  ControlPrinterRESUME(strJOBID) {
    let strPrinterID = GetPrinterIDfromJOBID(strJOBID);
    LODOP = getLodop();
    if (LODOP.CVERSION) {
      LODOP.On_Return = function(TaskID, Value) {
        alert('恢复结果:' + Value);
      };
      LODOP.SET_PRINT_MODE('CONTROL_PRINTER:' + strPrinterID, 'RESUME');
      return;
    } else {
      var strResult = LODOP.SET_PRINT_MODE(
          'CONTROL_PRINTER:' + strPrinterID,
          'RESUME',
      );
      alert('恢复结果:' + strResult);
    }
  },

  /**
   * 清理打印任务
   * @param strJOBID
   * @constructor
   */
  ControlPrinterPURGE(strJOBID) {
    let strPrinterID = GetPrinterIDfromJOBID(strJOBID);
    LODOP = getLodop();
    if (LODOP.CVERSION) {
      LODOP.On_Return = function(TaskID, Value) {
        alert('清理结果:' + Value);
      };
      LODOP.SET_PRINT_MODE('CONTROL_PRINTER:' + strPrinterID, 'PURGE');
      return;
    } else {
      var strResult = LODOP.SET_PRINT_MODE('CONTROL_PRINTER:' + strPrinterID,
          'PURGE');
      alert('清理结果:' + strResult);
    }
  },

  /**
   * 如下过程本例没用到，但或许对您有用：
   * @param statusID
   * @return {string}
   */
  getStatuMessage(statusID) {
    var messages = '';
    if (statusID & 1) messages += '已暂停 -';
    if (statusID & 2) messages += '错误 -';
    if (statusID & 4) messages += '正删除 -';
    if (statusID & 8) messages += '进入队列 -';
    if (statusID & 16) messages += '正在打印 -';
    if (statusID & 32) messages += '脱机 -';
    if (statusID & 64) messages += '缺纸 -';
    if (statusID & 128) messages += '打印结束 -';
    if (statusID & 256) messages += '已删除 -';
    if (statusID & 512) messages += '堵了 -';
    if (statusID & 1024) messages += '用户介入 -';
    if (statusID & 2048) messages += '正在重新启动 -';
    return messages;
  },

  /**
   * 简单打印
   * @constructor
   */
  MyPrint() {
    LODOP = getLodop();
    this.init();
    LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
    if (LODOP.CVERSION) {
      LODOP.On_Return = function(TaskID, Value) {
//      document.getElementById('T1').value = Value;
      };
      LODOP.PRINTA();
      return;
    }
    else alert('本系统只支持C-LODOP打印');
  },

  /**
   * 官方示例中的LODOP方式，暂时不用
   */
  waitfor() {
    c = c + 1;
    document.getElementById('T12B').value = '正等待(JOB代码是' + P_ID + ')打印结果：' + c +
        '秒';
    t = setTimeout('WaitFor()', 1000);
    if (LODOP.GET_VALUE('PRINT_STATUS_OK', P_ID)) {
      clearTimeout(t);
      document.getElementById('T12B').value = '打印成功！';
      c = 0;
      alert('打印成功！');
    }
    if ((!LODOP.GET_VALUE('PRINT_STATUS_EXIST', P_ID)) && (c > 0)) {
      clearTimeout(t);
      document.getElementById('T12B').value = '打印任务被删除！';
      c = 0;
      alert('打印任务被删除！');
    } else if (c > 30) {
      clearTimeout(t);
      document.getElementById('T12B').value = '打印超时(30秒)！';
      c = 0;
      alert('打印超过30秒没捕获到成功状态！');
    }
    ;
  },
};

export default LodopPrinterService;