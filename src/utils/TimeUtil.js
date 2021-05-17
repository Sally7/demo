/* eslint-disable eol-last */
const TimeUtil = {
  toLocaleString (timestamp) {
    var newDate = new Date()
    newDate.setTime(timestamp)
    return newDate.toLocaleString()
  },
  formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  formatTime (number, format) {
    var formateArr = ['Y', 'M', 'D', 'H', 'm', 's']
    var returnArr = []

    var date = new Date(number)
    returnArr.push(date.getFullYear())
    returnArr.push(TimeUtil.formatNumber(date.getMonth() + 1))
    returnArr.push(TimeUtil.formatNumber(date.getDate()))

    returnArr.push(TimeUtil.formatNumber(date.getHours()))
    returnArr.push(TimeUtil.formatNumber(date.getMinutes()))
    returnArr.push(TimeUtil.formatNumber(date.getSeconds()))
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i])
    }
    return format
  },
  formatSpecificTime (number, format) { //显示带有今日明日昨天的到时分秒
    var date = new Date(number);
    var yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1));
    var tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));

    var day = date.getFullYear() +TimeUtil.formatNumber(date.getMonth()) +TimeUtil.formatNumber(date.getDate());
    var today = new Date().getFullYear()+TimeUtil.formatNumber(new Date().getMonth())+TimeUtil.formatNumber(new Date().getDate());
    var yesterday = yesterdayDate.getFullYear() +TimeUtil.formatNumber(yesterdayDate.getMonth()) +TimeUtil.formatNumber(yesterdayDate.getDate());
    var tomorrow = tomorrowDate.getFullYear() +TimeUtil.formatNumber(tomorrowDate.getMonth()) +TimeUtil.formatNumber(tomorrowDate.getDate());
    // console.log('day='+day+',,,today='+today+',,,yesterday='+yesterday+',,,tomorrow='+tomorrow);
    //定义小时分钟秒的字符串
    var extraDate = TimeUtil.formatNumber(date.getHours()) +':'+ TimeUtil.formatNumber(date.getMinutes()) + (format.indexOf('s') > 0?':'+TimeUtil.formatNumber(date.getMinutes()):'');
    if (day == today){
      format = '今天 ' + (format.indexOf("H") != -1?extraDate:'')
    }else if(day == yesterday){
      format = '昨天 ' + (format.indexOf("H") != -1?extraDate:'')
    }else if(day == tomorrow) {
      format = '明天 ' + (format.indexOf("H") != -1?extraDate:'')
    }else{ //常规显示年月日

    }
    return format
  },
  /**
   * 获取时间
   * @returns {string}
   */
  toGetSimpleDate () {
    var newDate = new Date()
    var year = newDate.getFullYear()
    var month = newDate.getMonth()
    var day = newDate.getDay()
    if (month <= 9) month = '0' + month
    if (day <= 9) day = '0' + day
    return year + '-' + month + '-' + day
  },
  /**
   * 获取分钟
   * @returns {string}
   */
  toGetSimpleTime () {
    var newDate = new Date()
    var hours = newDate.getHours()
    var minutes = newDate.getMinutes()
    console.log({changdu: hours})
    if (hours <= 9) hours = '0' + hours
    if (minutes <= 9) minutes = '0' + minutes
    return hours + ':' + minutes
  },
  getDayRange(date) {
    var startDate = new Date(date);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setMilliseconds(0);

    var endDate = new Date(date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setMilliseconds(59);

    console.log(date+","+startDate.getTime()+","+ endDate.getTime());

    return [startDate.getTime(), endDate.getTime()];
  }
  // var sjc = 1488481383 console.log(time.formatTime(sjc,'Y/M/D h:m:s')); 使用示例
}
export default TimeUtil
