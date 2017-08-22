//index.js
//获取应用实例
var common = require('../../common.js');
var app = getApp();
var calendarSignData;
var date;
var calendarSignDay;
Page({
  data: {
    sign: "",
    helpWin: false,
    goldWin: true,
    goldImg:[{
      id:10,
      static:"none",
      imgsrc:'../img/gold10.gif',
    },{
      id:15,
      static:"none",
      imgsrc:'https://hepulan-skin-care-center.omnistatic.com//static/gold15.gif',
    },{
      id:20,
      static:"none",
      imgsrc:'https://hepulan-skin-care-center.omnistatic.com//static/gold20.gif',
    },{
      id:25,
      static:"none",
      imgsrc:'https://hepulan-skin-care-center.omnistatic.com//static/gold25.gif',
    },{
      id:30,
      static:"none",
      imgsrc:'https://hepulan-skin-care-center.omnistatic.com//static/gold30.gif',
    },{
      id:35,
      static:"none",
      imgsrc:'https://hepulan-skin-care-center.omnistatic.com//static/gold35.gif',
    },{
      id:40,
      static:"none",
      imgsrc:'https://hepulan-skin-care-center.omnistatic.com//static/gold40.gif',
    }]
  },
  //签到
  formSubmit: function(e) {
    var that = this;
    var _formId = e.detail.formId;
    console.log("formSubmit formId",_formId);
    var sign = app.data.sign;
    console.log("formId", _formId);
    console.log(calendarSignData);
    var calendarSignData = that.data.calendarSignData;
    calendarSignData[date] = date;
    var calendarSignDay = that.data.calendarSignDay;
    console.log(calendarSignData);
    calendarSignDay = calendarSignDay + 1;
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/save-punch?sign=' + sign + '&v=1.1',
      method: "GET",
      data: {
        formId: _formId
      },
      success: function(res) {
        console.log(res);
        wx.setStorageSync("calendarSignData", calendarSignData);
        wx.setStorageSync("calendarSignDay", calendarSignDay);

        var dayCoins = that.data.coins; //截止到签到签的所有金币
        var checkCoins = res.data.data; //签到获取金币数量
        var dayPunch = that.data.punch; //截止当天签到前连续签到总天数
        var adyAllday = that.data.allday;
        var coins = dayCoins + checkCoins;
        var goldImg = that.data.goldImg;
        for (var i = 0; i < goldImg.length; i++) {
          if (checkCoins==goldImg[i].id) {
            goldImg[i].static = "block";
            that.setData({
               goldImg:goldImg
            })
            console.log(goldImg[i].static)
            var ind = i;
            console.log(goldImg);
            setTimeout( function(){ 
              var goldImg = that.data.goldImg;
              goldImg[ind].static = "none";
              that.setData({
                 goldImg:goldImg
              })
              console.log(goldImg);
            },1700);
          }
        }
        dayPunch = dayPunch + 1;
        console.log("dayCoins", dayCoins);
        console.log("checkCoins", checkCoins);
        console.log("coins", coins);
        adyAllday = adyAllday + 1;
        that.setData({
          calendarSignData: calendarSignData,
          calendarSignDay: calendarSignDay,
          checkCoins: checkCoins,
          goldWin: false,
          coins: coins,
          punch: dayPunch,
          adyAllday: adyAllday
        })
        setTimeout(function() {
          that.setData({
            goldWin: true
          })
        }, 1500)
      }
    });
  },

  onLoad: function() {
    //wx.clearStorage();
    var that = this;
    var sign = app.data.sign;
    //console.log('sign:'+sign);
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    date = mydate.getDate();
    //console.log("date" + date)
    var day = mydate.getDay();
  //  console.log(day)
    var nbsp;
    if ((date - day) <= 0) {
      nbsp = day - date + 1;
    } else {
      nbsp = 7 - ((date - day) % 7) + 1;
    }
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    // 判断是否签到过
    if (wx.getStorageSync("calendarSignData") == null || wx.getStorageSync("calendarSignData") == '') {
      wx.setStorageSync("calendarSignData", new Array(monthDaySize));
    };
    if (wx.getStorageSync("calendarSignDay") == null || wx.getStorageSync("calendarSignDay") == '') {
      wx.setStorageSync("calendarSignDay", 0);
    }

    var calendarSignData = wx.getStorageSync("calendarSignData");
    console.log(calendarSignData);

    // 获取签到列表
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-punchs?sign=' + sign + '&v=1.1',
      method: "GET",
      success: function(res) {
      //  console.log(res);
        //calendarSignData = wx.getStorageSync("calendarSignData"); //签到日期列表
      //  console.log(calendarSignData);
      //  calendarSignDay = wx.getStorageSync("calendarSignDay"); //签到总天数
        // calendarSignData = that.data.punch;
        // calendarSignDay = that.data.allday+1;
        console.log(calendarSignData);
        console.log(calendarSignDay);
        var dayindex = [];
        var hasDaty = res.data.data;
        console.log(hasDaty);
        for (var i = 0; i < hasDaty.length; i++) {
          dayindex[i] = hasDaty[i].act_date.split("-");
          dayindex[i] = dayindex[i][2];
          var idx = parseInt(dayindex[i]);
          calendarSignData[idx] = idx;
        }
        // wx.setStorageSync("calendarSignData", calendarSignData);
        // wx.setStorageSync("calendarSignDay", calendarSignDay);
        console.log(calendarSignData);
        console.log(calendarSignDay);
        that.setData({
          sign: sign,
          year: year,
          month: month,
          nbsp: nbsp,
          monthDaySize: monthDaySize,
          date: date,
          calendarSignData: calendarSignData,
          calendarSignDay: calendarSignDay
        })
      }
    })
  },

  onShow: function() {
    var that = this;
    var sign = app.data.sign;
    var avatarUrl = wx.getStorageSync("avatarUrl") || [];
    var nickName = wx.getStorageSync("nickName") || [];
    // 获取金币
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-coins?sign=' + sign + '&v=1.1',
      method: "GET",
      success: function(res) {
        console.log(res);
        var top = res.data.data.topIndex;
        var punch = res.data.data.continuePunch; //连续签到天数
        var coins = res.data.data.coins;
        var allday = res.data.data.totalPunch; //总签到天数
        console.log("连续签到天数",punch);
        console.log("总签到天数",allday);
        that.setData({
          "top": top,
          "punch": punch,
          "coins": coins,
          "avatar": avatarUrl,
          "nickname": nickName,
          "allday": allday
        })
        //console.log(that.data);
      }
    })
  },

  // 返回首页
    backHome:function(){
       common.backHome();
    },

  // 分享海报
    toShare:function(){
      common.toShare();
    },

  // 弹窗金币数说明
  helpCoins: function() {
    var that = this;
    that.setData({
      helpWin: true
    })
  },

  close_help: function() {
    var that = this;
    that.setData({
      helpWin: false
    })
  }

})
