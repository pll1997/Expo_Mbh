/*-------获取d当前时间多少天后的日期和对应星期---------*/
//得到时间格式2018-10-02
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')

}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05
function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '年' + month + '月' + dayFormate + '日';
  dateObj.week = show_day[day];
  return dateObj;
}
//所有的函数都需要exports才生效，这点很重要！
module.exports = {
  formatDate: formatDate,
  getDates: getDates
}



/*----------获取日期与时间--------*/
//不能与上面一个方法同时放出来  不然会冲突 报错
function getTodaytime(){
  var getToday;
  function getToday() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = 0 + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    // 如果需要时分秒 
    // var h = now.getHours(); 
    // var m = now.getMinutes(); 
    // var s = now.getSeconds(); 
    var formatDate = year + '年' + month + '月' + day + '号';
    return formatDate;
  }
  //把函数添加到对象属性里 
  module.exports = {
    getToday: getToday
  }
  return getToday();
}


