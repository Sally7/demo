import axios from 'axios'
//import { Message } from 'element-ui'
import configUtil from '@/utils/ConfigUtil'
import cacheCookies from '@/utils/auth'

export default async function request (options) {
  if (options.headers) {
    if(options.headers["Content-Type"]) {

    } else {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
  } else {
    options.headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }

  if(!options.method) {
    options.method = 'POST';
  }
  //options.url = configUtil.getServerDomain() +"/" + options.url;
  if(options.url.indexOf("http")==-1) {
    options.url = process.env.BASE_API +"/" + options.url;
  }
  if(!options.data) {
    options.data = {};
  }
  if(options.data instanceof Object) {
    options.type = 'json';
    options.data.token = options.data.token?options.data.token:cacheCookies.getToken();
    options.data = configUtil.toTransformRequestBodyParameters(options.data);
  }
  try{
    const response = await axios(options);
    return response.data
  }catch(err){
    return {
      status: -1,
      data: err.message
    };
  }
}



