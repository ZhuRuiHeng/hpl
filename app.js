//app.js
App({
  data: {
    loginData: null,
    sign: "",
    mobile:"",
    username:"",
    mid:"",
    sharecode:"",
    authStatic:false,
    loginStatic:false,
    authSuccess:false
  },
  onLaunch: function() {
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    var value = wx.getStorageSync('mobile');
    console.log(value);
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: function(res) {
        //  console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `https://hepulan-skin-care-center.omnistatic.com/site/auth?code=${res.code}`,
            data: {
              code: res.code
            },
            success: function(res) {
              //console.log(res);
              that.data.sign = res.data.data.sign;
              that.data.mobile = res.data.data.mobile;
              that.data.loginData = res.data.data.sign;
              that.data.sharecode = res.data.data.sharecode;
              try {
                wx.setStorageSync('mobile', res.data.data.mobile);
                wx.setStorageSync('loginData', res.data.data.sign);
                wx.setStorageSync('loginData', res.data.data.mid);
                that.data.mobile = res.data.data.mobile;
                that.data.mid = res.data.data.mid;
                wx.getUserInfo({
                  success: function(res) {
                    // console.log(res);
                    var userData = {};
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.setStorageSync('nickName', nickName);
                    that.data.username = nickName;
                    that.data.avatarUrl = avatarUrl;
                    userData = {
                      nickName: nickName,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.request({
                      url:'https://hepulan-skin-care-center.omnistatic.com/site/save-user-info?sign='+that.data.sign,
                      method: 'POST',
                      data: {
                        info: userData
                      },
                      success: function(res) {
                        //console.log(res);
                           that.data.authSuccess = true
                          setTimeout(function(){
                           wx.hideLoading()
                         },500)
                      }
                    })
                  },
                  fail:function(){
                    console.log("用户拒绝授权");
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      }
                    })
                  },
                })
              } catch (e) {
                console.log("回话异常："+e);

              }

            },
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    sign: ""
  }
})
