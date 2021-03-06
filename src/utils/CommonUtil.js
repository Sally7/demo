
export function toParam (obj) {
  /*if(typeof obj != 'object') {
    return;
  }*/
  //console.log(obj);
  var query = '';
  var name, value, fullSubName, subName, subValue, innerObj, i;
  for (name in obj) {
    value = obj[name];
    if (value instanceof Array) {
      for (i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {}
        innerObj[fullSubName] = subValue;
        query += toParam(innerObj) + '&';
      }
    } else if (value instanceof Object) {
      for (subName in value) {
        subValue = value[subName];
        if(subValue==null||subValue===""){
          continue;
        }
        fullSubName = name + '.' + subName + '';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += toParam(innerObj) + '&';
      }
    } else if (value !== undefined && value !== null) {
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
}
