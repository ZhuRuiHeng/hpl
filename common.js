function backHome() {
  wx.switchTab({
    url: '../index/index'
  })
};

function toShare() {
  wx.navigateTo({
    url: '../sharePoster/sharePoster'
  })
};

function time(unixtime, withTime) {
      if (!unixtime) {
          unixtime = (new Date()).getTime();
      } else {
          unixtime *= 1000;
      }
      var nd = new Date(unixtime), year = nd.getFullYear(), month = nd.getMonth() + 1, day = nd.getDate();
      if (month < 10) {
          month = '0' + month;
      }
      if (day < 10) {
          day = '0' + day;
      }
      if (!withTime) {
          return year + '-' + month + '-' + day;
      }
      var hour = nd.getHours(), minute = nd.getMinutes(),second = nd.getSeconds();
      if (hour < 10) {
          hour = '0' + hour;
      }
      if (minute < 10) {
          minute = '0' + minute;
      }
      if (second < 10) {
         second = '0' + second;
      }

      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute +':'+ second;
      // return month + '/' + day + ' ' + hour + ':' + minute +':'+ second;
  };

module.exports.time = time;
module.exports.backHome = backHome;
module.exports.toShare = toShare;
