// pages/login/login.js
var common = require('../../common.js');
var app = getApp();
Page({
  data: {
    swiperTab: [{
      content: "1111",
      imgs:["https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png",
      "https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png",
      "https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png"],
      shop_price: "28",
      shop_gold: "2800"
    }, {
      content: "222222",
      imgs:["https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png",
      "https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png",
      "https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png"],
      shop_price: "28",
      shop_gold: "2700"
    }, {
      content: "222222",
      imgs:["https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png",
      "https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png",
      "https://hepulan-skin-care-center.omnistatic.com/static/goldstore_img3.png"],
      shop_price: "28",
      shop_gold: "2600"
    }],
    autoplay: false,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
  },
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  imgPre:function(e){
     var that = this;
     var tab = that.data.swiperTab;
     var current_tab = that.data.swiperCurrent;
     if (current_tab>0) {
       current_tab = that.data.swiperCurrent-1;
     }else {
       current_tab = tab.length-1;
     }
     that.setData({
       swiperCurrent:current_tab
     })
     console.log(current_tab);
  },
  imgNext:function(){
    var that = this;
    var tab = that.data.swiperTab;
    var current_tab = that.data.swiperCurrent+1;
    if (current_tab<tab.length) {
       current_tab = that.data.swiperCurrent+1;
    }else {
       current_tab = 0;
    }
    that.setData({
      swiperCurrent:current_tab
    })
    console.log(current_tab);
  },

  check: function(ev) {
    var that = this;
    var priceCoins = ev.target.dataset.price;
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-coins?sign=' + app.data.sign,
      method: "GET",
      success: function(res) {
        console.log(res);
        var coins = res.data.data.coins;
        var prePrice = res.data.data.price;
        that.setData({
           coins:coins
        })
        if (coins < priceCoins) {
          wx.showModal({
            title: '温馨提示',
            content: '金币数量不够，无法兑换!',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '本次100份礼品已兑换完，请期待下一个惊喜!',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
    })

  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var pageData = JSON.parse(options.pageData);
    wx.request({
      url:'https://hepulan-skin-care-center.omnistatic.com/site/get-cat-products?sign='+app.data.sign,
      data:{
        page:1
      },
      header: {
         'content-type': 'application/json'
       },
      success:function(res){
        console.log(res);
        that.setData({
           navData:res.data.data
        });
         console.log(that.data.navData);
      }
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var that = this;
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-coins?sign=' + app.data.sign,
      method: "GET",
      success:function(res){
          var coins = res.data.data.coins;
          that.setData({
            coins:coins
          })
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
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭

  }
})
