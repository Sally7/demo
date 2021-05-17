import {getLodop} from '@/utils/LodopFuncs';

const PrintService = {
  LODOP: null,
  printStatus: 0,//打印状态
  shadowShow: false,//遮罩显示与否
  count: 1,//打印份数
  loading: null,

  JOB_ID: '', //当前打印任务的任务代码
  Timer: null,//轮询定时器
  time: 0,//打印时间
  /**
   * 打印设置
   * @param {
   * 配置项}} options
   */
  setOptions(options) {
    this.options = options || {};
  },
  /**
   *  打印初始化设置
   * @param {打印份数} count
   * @param {打印内容} htmlStr
   */
  createPrintCode(count, htmlStr) {
    var This = this;
    This.LODOP = getLodop();
    return new Promise(function(resolve, reject) {
      if (This.LODOP.CVERSION) {//是否能检测到c-lodop的版本号
        if (!This.LODOP) {//c-lodop如果没启动，则不能打印
          alert('请启动c-lodop服务');
          return;
        }
        // 打印初始化
        This.LODOP.PRINT_INIT('');
        if (count) {//设置重复打印要放在初始化后面
          This.LODOP.SET_PRINT_COPIES(count);
        }
//        LODOP.SET_PRINT_STYLEA(0,"TableRowThickNess",25);
        //水印
        This.setWaterMark(This.options.waterMark);
        This.LODOP.SET_PRINT_STYLE('FontSize', 12);
        This.LODOP.SET_PRINT_STYLE('Bold', 1);
        This.LODOP.ADD_PRINT_HTM(
            '1.5cm',
            '2cm',
            'RightMargin:1.4cm',
            'BottomMargin:1cm',
            htmlStr,
        );
        //条码
        if (This.options.barcode) {
          This.setLineBarCode(This.options.barcode);
        }
        resolve();
      } else {
        alert('请下载c-lodop');
      }
    });
  },

  /**
   *  打印句柄
   * @param {打印份数} count
   * @param {打印内容} htmlStr
   */
  print(count, htmlStr) {
    var This = this;
    if (!htmlStr) {
      alert('没有要打印的内容');
      return;
    }
    This.shadowShow = true;
    This.createPrintCode(count, htmlStr).then(function() {
      This.carryPrint();
    });
  },

  /**
   * 执行打印命令
   */
  carryPrint() {
    var This = this;
    This.LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
    This.LODOP.On_Return_Remain = true;
    This.LODOP.On_Return = function(TaskID, Value) {//TaskID:任务id，Value：job代码
      timer = setInterval(function() {
        if (This.printStatus != 0 || This.printStatus != false) {
          This.printStatus = 0;
          This.shadowShow = false;

          This.options.loading.close();

          if (This.options.loading) This.options.loading.close();
          clearInterval(timer);
          console.log('可以关闭提示了。。。', This.printStatus, 'loading:',
              This.options.loading);
          return;
        }

        // PRINT_STATUS_BUSY
        This.getStatusValue('PRINT_STATUS_OK', Value);//查询打印任务完成状态
        console.log('监视状态：', This.printStatus);
      }, 500);
    };
    This.LODOP.PRINT();
    this.closeShadow();
//    This.LODOP.PREVIEW();
  },

  /**
   * 根据job代码，获取是否打印成功
   * @param {*} valueName
   * @param {*} job
   */
  getStatusValue(valueName, job) {
    console.log('打印valueName：', valueName);
    console.log('打印job：', job);
    var This = this;
    This.LODOP.On_Return = function(TaskID, Value) {//TaskID:任务id，Value：打印成功状态
      //弹出层弹出时，而打印机没正常打印，此时为了能关闭弹窗，需要强行把打印状态改成1（完成状态）
      This.printStatus = This.shadowShow ? Value : 1;
      console.log('新打印-成功状态:' + This.printStatus);
    };
    This.LODOP.GET_VALUE(valueName, job);
  },

  /**
   * 预览
   */
  preview() {
    let This = this;
    this.createPrintCode().then(function() {
      This.LODOP.PREVIEW();
    });
  },

  /**
   * 强制关闭遮罩层
   */
  closeShadow() {
    this.printStatus = 1;//强制打印状态变为1
    this.shadowShow = false;//强制遮罩成关闭
  },
  /**
   * 设置水印
   * @param {水印文本} text
   */
  setWaterMark(text) {
    let This = this;
    This.LODOP.ADD_PRINT_TEXT(13, 22, 180, 60, text || '秘密文件');
    This.LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20);
    This.LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#F2F2F2');
    This.LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1);
    This.LODOP.SET_PRINT_STYLEA(0, 'Angle', 50);
    This.LODOP.SET_PRINT_STYLEA(0, 'Repeat', true);
  },

  setLineBarCode(text) {
    let This = this;
//    This.LODOP.ADD_PRINT_BARCODE(68, 584, 148, 20, 'code93', text);
    This.LODOP.ADD_PRINT_BARCODE(48, 484, 248, 35, 'code93', text);
    This.LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
  },


//  ----------------新版--------------------------------

  /**
   * 初始化打印需求
   * @param content
   */
  init(content) {
    this.LODOP = getLodop();
    this.LODOP.PRINT_INIT('');
    this.LODOP.SET_PRINT_STYLE('FontSize', 12);
    this.LODOP.SET_PRINT_STYLE('Bold', 1);
    this.setwatermark(this.options.waterMark);
    this.LODOP.ADD_PRINT_HTM('1.5cm', '2cm', 'RightMargin:1.4cm',
        'BottomMargin:1cm', content);
    if (this.options.barcode) this.setlinebarcode(this.options.barcode);
  },

  /**
   *
   * @param content 打印内容
   */
  printwait(content) {
    let This = this;
    if (This.time > 0) {
      This.closelayer('warning', '正在打印...');
      return;
    }
    //初始化打印需求
    This.init(content);
    This.LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
    //进入打印逻辑
    if (This.LODOP.CVERSION) {
      This.LODOP.On_Return = function(TaskID, Value) {
        This.JOB_ID = Value;
        if (This.JOB_ID != '') {
          This.time = 0;
          This.waitfor();
        }
      };
      This.LODOP.PRINTA();
    } else {
      This.closelayer('warning', '本系统仅支持C_LODOP打印');
    }
  },

  waitfor() {
    let This = this;
    This.Timer = setInterval(() => {
      let TaskID1,TaskID2;
      This.time = This.time + 1;
      console.log('正等待(JOB代码:' + This.JOB_ID + '),打印结果：' + This.time + '秒');

      This.LODOP.On_Return_Remain = true;
      This.LODOP.On_Return = function(TaskID, Value) {

        console.log(`----------------${TaskID}: => ${Value}-------------------`);
        console.log('判断条件TaskID1==TaskID:', TaskID1==TaskID,'值：',TaskID1);
        console.log('判断条件TaskID2==TaskID:', TaskID2==TaskID,'值：',TaskID2);
        console.log('-------------------------------------------------------');

        if (TaskID == TaskID1) {
          if (Value + '' === '1') {
            console.log('点1');
            clearInterval(This.Timer);
//          打印成功，做点啥
            This.time = 0;
            This.closelayer('success', '打印完成');
          }
        } else if (TaskID == TaskID2) {
          if (Value + '' === '0') {
            console.log('点2');
            clearInterval(This.Timer);
//         打印任务被删除,做点啥
            This.time = 0;
            This.closelayer('warning', '打印任务被删除');
          }
        }
      };

      TaskID1 = LODOP.GET_VALUE('PRINT_STATUS_OK', This.JOB_ID);
      TaskID2 = LODOP.GET_VALUE('PRINT_STATUS_EXIST', This.JOB_ID);

      if (!This.LODOP.GET_VALUE("PRINT_STATUS_ID", This.JOB_ID) && This.time > 50) {
        console.log('点3')
//        打印超时(50秒)，做点啥
        This.time = 0;
        console.log('打印超过50秒没捕获到成功状态！');
        //  关闭遮罩层
        This.closelayer('error', '打印超时(50秒)，请检查打印机是否连通');
        clearInterval(This.Timer);
      }
    }, 1000);
  },
  /**
   * 水印设置
   * @param text
   */
  setwatermark(text) {
    let This = this;
    This.LODOP.ADD_PRINT_TEXT(13, 22, 180, 60, text || '秘密文件');
    This.LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20);
    This.LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#F2F2F2');
    This.LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1);
    This.LODOP.SET_PRINT_STYLEA(0, 'Angle', 50);
    This.LODOP.SET_PRINT_STYLEA(0, 'Repeat', true);
  },

  /**
   * 条形码
   * @param text
   */
  setlinebarcode(text) {
    let This = this;
    This.LODOP.ADD_PRINT_BARCODE(48, 484, 248, 35, 'code93', text);
    This.LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
  },

  /**
   * 回调，用来处理关闭弹出层
   * @param type
   * @param msg
   */
  closelayer(type, msg) {
    console.log('点4')
    if (this.options.callback) {
      console.log('点5')
      this.options.callback(type, msg);
    }
  },
};

export default PrintService;