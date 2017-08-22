// pages/writeDyn/writeDyn.js
var common = require('../../common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      sign:"",
      upImg:['../img/circle_icon_upfileimg.png'],
      writeContent:"",
      imgres:"",
      Dabled:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
// 获取缓存中的sign
   var app = getApp();

    that.setData({
        sign: app.data.sign
    });
console.log(that.data.sign);
  },
  // 图片上传
  upFile:function(res){
    var that = this;
    console.log("选择图片")
       wx.chooseImage({
         sizeType: [ 'original', 'compressed' ],
          success: function(res) {
            var tempFilePaths = res.tempFilePaths;
            var imgArr = [];
            console.log("图片手机路径"+tempFilePaths);
            console.log(tempFilePaths);
            console.log(tempFilePaths.length);
            var count = tempFilePaths.length
            if (count>0) {
              for (var i = 0; i < tempFilePaths.length; i++) {
                wx.uploadFile({
                  url: 'https://hepulan-skin-care-center.omnistatic.com/site/upload?sign='+that.data.sign,
                  filePath: tempFilePaths[i],
                  name: 'img',
                  success: function(res){
                    var imgres = JSON.parse(res.data);
                    count=count-1;
                   imgArr.push(imgres.data);
                    // var tempFilePaths = res.tempFilePaths;
                    console.log(imgArr);
                    that.setData({
                       imgres:imgArr,
                       upImg:tempFilePaths
                    })
                  }
                })
              }
            }
          }
       })
  },
  bindTextAreaBlur: function(e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      writeContent:e.detail.value
    })
    //console.log(that.data.writeContent);
  },

  sendBtn:function(e){
    var that = this;
    var content = that.data.writeContent;
    var upImg = that.data.upImg;
    var imgres = that.data.imgres;
    console.log(imgres);
    imgres = that.data.imgres
    console.log(imgres);
    console.log(upImg);
    // 禁用提交按钮防止用户重复提交
    if(false){
      wx.showToast({
       title: '请填写动态内容',
       icon: 'success',
       duration: 2000
      })
    }else{
       var keywords=["屏蔽词","违规词","过滤","敏感词"];
       for(var i = 0; i < keywords.length; i++){
         var reg = new RegExp(keywords[i],"g");
         if(content.indexOf(keywords[i])!=-1){
      			var result = content.replace(reg,"**");
      			content = result;
      		}
          //console.log(content);
       }

       wx.request({
           url:'https://hepulan-skin-care-center.omnistatic.com/site/save-plaza-post?sign='+that.data.sign,
           header: {
            'content-type': 'application/json'
          },
          method:'POST',
          data:{
             title:content,
             imgs:typeof(imgres)=='string'?imgres:imgres.join(",")
          },
          success:function(res){
             console.log(res);
             wx.showToast({
              title: '动态发布成功',
              icon: 'success',
              duration: 1000
            });
            // 数据提交成功跳转至动态
            wx.switchTab({
              url: '../circle/circle'
            })
            // 放开提交按钮
            setTimeout(function(){
              that.setData({
                disabled:true
              })
            },1000)
          }
       });
    }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 返回首页
    backHome:function(){
       common.backHome();
    },

  // 分享海报
    toShare:function(){
      common.toShare();
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})
