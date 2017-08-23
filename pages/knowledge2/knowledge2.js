var common = require('../../common.js');
var main_content = [];
var app = getApp();
Page({
  data: {
    searchWord: "",
    page: 1,
    checkBottom: true,
  },
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    // 获取搜索关键词
    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/get-tags?sign=" + app.data.sign,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        var search_word = [];
        for (var i = 0; i < res.data.data.length; i++) {
          search_word.push(res.data.data[i]);
        }
        var width = 130 * res.data.data.length;
        that.setData({
          search_word: search_word,
          w_width: width
        })
      }
    });
    // 获取整个知识列表
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-knowledge-list?sign=' + app.data.sign,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        console.log("知识列表",res)
        // 获取用户名称及发表时间
        var contentTip = res.data.data;
        var avatar = "https://hepulan-skin-care-center.omnistatic.com/static/home/knowledge_icon_persion.png";
        for (var i = 0; i < res.data.data.length; i++) {
          if (contentTip[i].belong == "1") {
            contentTip[i].avatar = contentTip[i].publisher_head;
          } else {
            contentTip[i].avatar = avatar;
          }
        }
        that.setData({
          "main_content": contentTip
        })
      }
    });
  },
  // 点赞文章
  likeBtn: function (ev) {
    var that = this;
    //alert(ev);
    var idx = ev.currentTarget.dataset.inx;
    // app.getUserInfo(function () {
      wx.request({
        url: "https://hepulan-skin-care-center.omnistatic.com/site/knowledge-thumb?sign=" + app.data.sign,
        data: {
          id: idx
        },
        success: function (res) {
          var main_content = that.data.main_content;
          for (var i = 0; i < main_content.length; i++) {
            if (main_content[i].id == idx) {
              main_content[i].is_thumb = 1;
              main_content[i].thumb_num = parseInt(main_content[i].thumb_num) + 1;
            }
          }
          that.setData({
            main_content: main_content
          })
        }
      })
    // })
  },
  hasLike: function () {
    wx.showToast({
      title: '你已经点过赞了',
      icon: 'success',
      duration: 1000
    })
  },
  video_control: function(e) {
    var index = e.currentTarget.dataset.ontap;
    var info = this.data.main_content;
    for (var i = 0; i < info.length; i++) {
      info[i].noplay = "false";
      if (info[i].id == index && info[i].noplay == "false") {
        info[i].noplay = "true";
        info[i].visit_num = parseInt(info[i].visit_num) + 1;
      }
    };
    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/add-knowledge-visit?sign=" + app.data.sign,
      data: {
        id: index
      },
      success: function (res) {
        // 保存浏览量
        console.log("浏览量", res);
      }
    })
    this.setData({
      "main_content": info
    })
  },
  inputValue: function(e) {
    var that = this;
    var inputValue = e.detail.value;
    this.setData({
      "searchWord": inputValue
    });
    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/get-knowledge-list?sign=" + app.data.sign,
      data: {
        keyword: that.data.searchWord
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        // 此处清空全局的数据
        var main_content = [];
        // 获取用户名称及发表时间
        var contentTip = res.data.data;
        var avatar = "https://hepulan-skin-care-center.omnistatic.com/static/home/knowledge_icon_persion.png";
        for (var i = 0; i < res.data.data.length; i++) {
          if (contentTip[i].belong == "1") {
            contentTip[i].avatar = contentTip[i].publisher_head;
          } else {
            contentTip[i].avatar = avatar;
          }
        }
        that.setData({
          "main_content": contentTip
        })
      }
    })
  },

  tapKeyWorld: function(e) {
    var that = this;
    var tapKeyWorld = e.target.dataset.ontap;
    var inx =e.target.dataset.inx;
    this.setData({
      "searchWord": tapKeyWorld
    })
    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/get-knowledge-list?sign=" + app.data.sign,
      data: {
        keyword: that.data.searchWord
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        // 此处清空全局的数据
        var main_content = [];
        // 获取用户名称及发表时间
        var contentTip = res.data.data;
        var avatar = "https://hepulan-skin-care-center.omnistatic.com/static/home/knowledge_icon_persion.png";
        for (var i = 0; i < res.data.data.length; i++) {
          if (contentTip[i].belong == "1") {
            contentTip[i].avatar = contentTip[i].publisher_head;
          } else {
            contentTip[i].avatar = avatar;
          }
        }

        that.setData({
          "main_content": contentTip
        })
      }
    })
  },
  onReachBottom: function() {
    var that = this;
    var oldCentent = that.data.main_content;
    var contentTip = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/get-knowledge-list?sign=" + app.data.sign,
      data: {
        page: reqPage
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        if (res.data.data.length == 0) return;
        var page = oldPage + 1;
        // 获取用户名称及发表时间
        that.setData({
          page: page
        });
        var contentTip = res.data.data;
        var avatar = "https://hepulan-skin-care-center.omnistatic.com/static/home/knowledge_icon_persion.png";
        for (var i = 0; i < res.data.data.length; i++) {
          if (contentTip[i].belong == "1") {
            contentTip[i].avatar = contentTip[i].publisher_head;
          } else {
            contentTip[i].avatar = avatar;
          }
        };
        var newContent = oldCentent.concat(contentTip);
        that.setData({
          "main_content": newContent
        })
      },
    });
  },
  toArticle: function(e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var singleTitle = ""
    for (var i = 0; i < that.data.main_content.length; i++) {
      if (that.data.main_content[i].id == idx) {
        singleTitle = that.data.main_content[i].title
      }
    }
    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/get-knowledge-detail?sign=" + app.data.sign,
      data: {
        id: idx
      },
      success: function(res) {
        //console.log(idx)跳转页面
        wx.navigateTo({
           url: "../single/single?id=" + idx,
        })
      }
    })

    wx.request({
      url: "https://hepulan-skin-care-center.omnistatic.com/site/add-knowledge-visit?sign=" + app.data.sign,
      data: {
        id: idx
      },
      success: function (res) {
        // 保存浏览量
        console.log("浏览量", res);
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
});
