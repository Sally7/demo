import Vue from 'vue'
import Element from 'element-ui'

// import 'element-ui/lib/theme-chalk/index.css'
import '../src/theme/index.css'
import i18n from './lang' // 国际化
import i18n1 from './lang/indexs.js' // 国际化
import App from './App'
import router from './router'
import '../src/styles/variables.scss'
import store from './store'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限

import {
  GenerateForm,
  MakingForm
} from '../lib/form-making-advanced'
import '../lib/form-making-advanced/dist/FormMaking.css'

var LODOP = null;
Vue.use(Element, {
  i18n: (key, value) => i18n1.t(key, value)
})


Vue.use(GenerateForm,{lang: 'zh-CN', i18n}
)
Vue.use(MakingForm,  {lang: 'zh-CN', i18n}
)

// register global utility filters.s
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
window.eventBus = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

window.webSocket = new WebSocket('ws://localhost:1818');

webSocket.onbeforeunload = function () {
  webSocket.send("bStopPlay()");
  webSocket.send("bStopPlay4()");
};
webSocket.onerror = function (event) {
  console.log("onerror:", event);
};

webSocket.onopen = function (event) {
  console.log("onopen:", event);
};

webSocket.onclose = function (event) {
  console.log(event);
  webSocket.send("bStopPlay()");
  webSocket.send("bStopPlay4()");
};


webSocket.onmessage = function (event) {
  if (event.data.indexOf('BarCodeTransferBegin') >= 0) {
    console.log(event.data.replace('BarCodeTransferBegin', '').replace('BarCodeTransferEnd', ''));
  } else if (event.data.indexOf('BeginBase64Encode') >= 0) {
    console.log(event.data.replace('BeginBase64Encode', '').replace('EndBase64Encode', ''));
  } else if (event.data.indexOf('BeginReadCard') >= 0) {
    console.log(event.data.replace('BeginReadCard', '').replace('EndReadCard', ''));
  } else if (event.data.indexOf('BeginBase64') >= 0) {
    console.log(event.data.replace('BeginBase64', '').replace('EndBase64', ''));
  } else if (event.data.indexOf('BeginbStopPlay') >= 0) {
    console.log(event.data.replace('BeginbStopPlay', '').replace('EndbStopPlay', ''));
  } else if (event.data.indexOf('BeginvSetResolution') >= 0) {
    console.log(event.data.replace('BeginvSetResolution', '').replace('EndvSetResolution', ''));
  } else if (event.data.indexOf('BeginbFileExist') >= 0) {
    console.log(event.data.replace('BeginbFileExist', '').replace('EndbFileExist', ''));
  } else if (event.data.indexOf('BeginbStartPlay2') >= 0) {
    console.log(event.data.replace('BeginbStartPlay2', '').replace('EndbStartPlay2', ''));
  } else if (event.data.indexOf('BeginbStartPlay') >= 0) {
    console.log(event.data.replace('BeginbStartPlay', '').replace('EndbStartPlay', ''));
  } else if (event.data.indexOf('BeginbSetMode') >= 0) {
    console.log(event.data.replace('BeginbSetMode', '').replace('EndbSetMode', ''));
  } else if(event.data.indexOf('BeginbSaveJPGEx')>=0) {
    var type = 2;
    var data = event.data.replace('BeginbSaveJPGEx','').replace('EndbSaveJPGEx','');
    eventBus.$emit('onGatherImage', { data: "data:image/jpeg;base64," + data, type: type });
  }else {
    var type = 0;
    var data = '';
    if (event.data.indexOf("BeginsGetBase64") != -1) {
      type = 1;
      data = event.data.replace('BeginsGetBase64', '').replace('EndsGetBase64', '');
    } else {
      data = event.data;
    }
    eventBus.$emit('onGatherImage', { data: "data:image/jpeg;base64," + data, type: type });
  }
}
