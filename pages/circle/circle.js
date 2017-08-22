// pages/circle/circle.js
var appInstance = getApp();
var common = require('../../common.js');
//console.log(appInstance.data);
Page({
  data: {
    sign: "",
    userInfo: "",
    nickName: "",
    writeContent: "",
    showWrite: false,
    writeIndex: null,
    zanStatus: false,
    spaceDyn: "",
    writeComment: "",
    empty: "1",
    plid:"",
    mid:"",
    page:2
  },


  prewImg: function(ev) {
    // 图片预览
    console.log(ev);
    var url = ev.target.dataset.src;
    var img = ev.target.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
  },
  dissWrite: function(res) {
    // 书写评论
    console.log(res);
    var that = this;
    var writeIndex = res.currentTarget.dataset.idwrite;
    // console.log(writeIndex);
    that.setData({
      showWrite: true,
      writeIndex: writeIndex
    })
  },

  bindTextAreaBlur: function(e) {
    var that = this;
    var comment = e.detail.value;
    that.setData({
      writeComment: comment
    })
  },

  writeSure: function(res) {
  //  console.log(res);
    var that = this;
    var _writeText = that.data.writeComment;
    var _writeIndex = that.data.writeIndex;
    var pid = that.data.spaceDyn[_writeIndex].pid;
    var len = that.data.spaceDyn;
    var kun = [];
    wx.getUserInfo({
      success: function(res) {
        kun.push(res);
        wx.request({
          url: 'https://hepulan-skin-care-center.omnistatic.com/site/save-plaza-post-comment?sign=' + that.data.sign,
          header: {
            'content-type': 'application/json'
          },
          method: "POST",
          data: {
            pid: pid,
            comment: _writeText
          },
          success: function(res) {
            var nickNamee = kun[0].userInfo.nickName;
            var personData = [];
            personData.push({
              username: nickNamee,
              comment: _writeText
            });
            len[_writeIndex].persionDiss = len[_writeIndex].persionDiss.concat(personData);
            //console.log(personData);
            that.setData({
              showWrite: false,
              spaceDyn: len
            })
          }
        });
      }
    });
  },

  writeCencel: function() {
    var that = this;
    that.setData({
      showWrite: false
    })
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var mid = appInstance.data.mid;
    var sign = appInstance.data.sign;
    var app = appInstance.data.username
    this.data.nickName = appInstance.data.username
    this.setData({
      nickName: app,
      mid:mid,
      sign:sign
    });
    console.log(this.data.nickName);
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // 点赞
  dianZan: function(res) {
    console.log(res);
    var that = this;
    var zanStatus = that.data.zanStatus;
    var zan = that.data.spaceDyn;
    var writeIndex = res.currentTarget.dataset.zan;
    var pid = zan[writeIndex].pid;
    var nick_name = that.data.nickName;
    var likeList = zan[writeIndex].likePersion;
    var has_like = zan[writeIndex].hasLiked;
    var Mid = that.data.mid;
    if (has_like > 0) {
      zanStatus = true
    }
    var nickName = that.data.nickName;
    if (!zanStatus) {
      wx.request({
        url: 'https://hepulan-skin-care-center.omnistatic.com/site/save-plaza-post-like?sign=' + that.data.sign,
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        data: {
          pid: pid
        },
        success: function(res) {
          console.log(res);
          var plid = res.data.data;
          zan[writeIndex].likePersion.unshift({
            username: nickName,
            mid:Mid,
            plid: plid
          });
          zan[writeIndex].likeBtnSelect = "like_btn_selsct";
          zan[writeIndex].hasLiked = 1;
          that.data.spaceDyn = zan;
          that.setData({
            spaceDyn: zan,
            zanStatus: true,
            // plid:plid
          })
        }
      });
    } else {
     var plid = that.data.plid;
     console.log(Mid);
     console.log(zan[writeIndex].likePersion);
      likeList = zan[writeIndex].likePersion;
     var zanList = [];
     console.log(likeList);
         for (var i = 0; i < likeList.length; i++) {
            if (Mid == likeList[i].mid) {
              console.log(likeList[i].plid);
              var Pld = likeList[i].plid;
               continue;
            }else {
               zanList.push(likeList[i]);
            }
         }
      wx.request({
        url: 'https://hepulan-skin-care-center.omnistatic.com/site/remove-plaza-post-like?sign=' + that.data.sign,
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        data: {
          plid: Pld
        },
        success: function(res) {
          console.log(zan);
          console.log(res);
          console.log(zan[writeIndex].likePersion);
          var likeList = zan[writeIndex].likePersion;
          var zanList = [];
          console.log(likeList);
          for (var i = 0; i < likeList.length; i++) {
             if (Mid == likeList[i].mid) {
                console.log("匹配成功");
                console.log(plid);
                console.log(likeList[i]);
                continue;
             }else {
                zanList.push(likeList[i]);
                console.log(zanList);
             }
          }
          zan[writeIndex].likePersion = zanList;
          zan[writeIndex].likeBtnSelect = "";
          zan[writeIndex].hasLiked = 0;
          that.setData({
            spaceDyn: zan,
            zanStatus: false
          })
        }
      });
    }
  },
  // 判断用户是否授权否则不能写动态
  writeCircle: function() {
    var that = this;
    var sign = that.data.sign;
    //console.log(sign);
    if (sign == "") {
      wx.showToast({
        title: '未授权用户禁止发言',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../writeDyn/writeDyn'
      });
      //console.log(_writeText);
    }
  },

  onReady: function() {
    // 页面渲染完成
  },

  pageBottom: function(ev) {
    console.log(ev)
    var that = this;
    var page = that.data.page;
    var oldspaceDyn = that.data.spaceDyn;
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-plaza-posts?sign=' + that.data.sign + "&v=1.1",
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: page
      },
      success: function(spacedyn) {
        setTimeout(function(){
          wx.hideLoading()
        },300);
        var spacedyn = spacedyn.data.data;
        if (spacedyn.length==0) {
          wx.showLoading({
            title: '没有更多数据',
          });
          setTimeout(function(){
            wx.hideLoading()
          },1000);
          return;
        }
        page++;
      console.log(page)
        var NewspaceDyn = [];
        for (var i = 0; i < spacedyn.length; i++) {
          NewspaceDyn[i] = {
            userName: spacedyn[i].username
          };
          NewspaceDyn[i].contentView = spacedyn[i].title;
          NewspaceDyn[i].userImg = spacedyn[i].avatar;
          NewspaceDyn[i].dynTime = spacedyn[i].post_time;
          NewspaceDyn[i].pid = spacedyn[i].pid;
          NewspaceDyn[i].likePersion = spacedyn[i].likes;
          NewspaceDyn[i].persionDiss = spacedyn[i].comments;
          NewspaceDyn[i].hasLiked = spacedyn[i].hasLiked;
          NewspaceDyn[i].likeBtnSelect = spacedyn[i].likeBtnSelect;
          var imgurl = spacedyn[i].imgs.split(",");
          NewspaceDyn[i].imgs = imgurl;
          NewspaceDyn[i].showDiss = true;
          if (NewspaceDyn[i].hasLiked == 1) {
            NewspaceDyn[i].likeBtnSelect = "like_btn_selsct";

          }
          if (NewspaceDyn[i].persionDiss.length == 0) {
            NewspaceDyn[i].showDiss = false;
          }
        }
        var NewspaceDyn = oldspaceDyn.concat(NewspaceDyn);
        that.setData({
          page:page,
          spaceDyn:NewspaceDyn
        })
      }
    })
  },

  onShow: function() {
    // 页面显示
    var that = this;
    // 获取缓存中的sign
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/get-plaza-posts?sign=' + that.data.sign,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
       console.log(res.data);
        var spacedyn = res.data.data;
        var spaceDyn = [];
        for (var i = 0; i < spacedyn.length; i++) {
          spaceDyn[i] = {
            userName: spacedyn[i].username
          };
          spaceDyn[i].contentView = spacedyn[i].title;
          spaceDyn[i].userImg = spacedyn[i].avatar;
          spaceDyn[i].dynTime = spacedyn[i].post_time;
          spaceDyn[i].pid = spacedyn[i].pid;
          spaceDyn[i].likePersion = spacedyn[i].likes;
          spaceDyn[i].persionDiss = spacedyn[i].comments;
          spaceDyn[i].hasLiked = spacedyn[i].hasLiked;
          spaceDyn[i].likeBtnSelect = spacedyn[i].likeBtnSelect;
          var imgurl = spacedyn[i].imgs.split(",");
          spaceDyn[i].imgs = imgurl;
          spaceDyn[i].showDiss = true;
          if (spaceDyn[i].hasLiked == 1) {
            spaceDyn[i].likeBtnSelect = "like_btn_selsct";
          }
          if (spaceDyn[i].persionDiss.length == 0) {
            spaceDyn[i].showDiss = false;
          }
         //console.log(spaceDyn);
        }
        that.setData({
          spaceDyn: spaceDyn
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
