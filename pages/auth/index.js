// pages/auth/index.js
const app = getApp();

const utils = require("../../utils/util.js");
const setUserInfo = function (userCode, that, authSuccess) {
  console.log(that)
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      app.globalData.userInfo = res.userInfo;
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(res)
      }
      //保存用户信息
      saveUserInfo(res.userInfo, userCode, that, authSuccess);

    }
  })
}


const saveUserInfo = function (userInfo, userCode, that, authSuccess) {
  var requestData = {
    nickName: userInfo.nickName,
    weixinHeadImage: userInfo.avatarUrl,
    gender: userInfo.gender,
    country: userInfo.country,
    province: userInfo.province,
    city: userInfo.city,
    code: userCode
  }
  debugger
  utils.request('coupon/wechat/customer', requestData, function (resp) {
    console.log('coupon/wechat/customer ajax')
    console.log(resp)
    debugger
    if (resp.state == "success") {
      //设置openId,用户id
      app.globalData.USER_ID = resp.data.userId;
      authSuccess()
    }
  })
}

const authSuccess = function (that) {
  //授权成功
  // if (that.data.from == "index") {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  // }
  //  else if (that.data.from == "my") {
  //   wx.navigateTo({
  //     url: '/pages/my/index',
  //   })
  // } else {
  //   wx.navigateBack({
  //     url: '/pages/index2/index',
  //   })
  // }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options")
    const self = this;
    if (options.from){
      this.setData({ "form": options.from})
    }
    if (options.code) {
      this.setData({ "usercode": options.code })
    }
    if(!options.code){
      wx.login({
        success: res1 => {
          wx.showNavigationBarLoading();
          self.setData({ "usercode": res1.code })

          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 获取用户信息
          wx.getSetting({
            success: res => {
              console.log("获取用户信息")
              wx.hideNavigationBarLoading();
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                setUserInfo(res1.code, self, authSuccess);
              }
            }
          })
        }
      })
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
  goAuthSetting:function(){
    var that = this;
    const authSuccess = function(){
      //授权成功
      if (that.data.from=="index"){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
      //  else if (that.data.from == "my"){
      //   wx.navigateTo({
      //     url: '/pages/my/index',
      //   })
      // }else {
      //   wx.navigateBack({
      //     url: '/pages/index2/index',
      //   })
      // }
    }

    wx.login({
      success: res1 => {
        console.log("codeL:"+res1.code);
        wx.showNavigationBarLoading();
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取用户信息
        wx.openSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              setUserInfo(res1.code, that, authSuccess);
            } else {
              wx.authorize({
                scope: 'scope.userInfo',
                success(res) {
                  console.log("同意授权");
                  setUserInfo(res1.code, that, authSuccess);
                },
                fail: function () {
                  
                }
              })
            }
          }
        })
      }
    })
  },
  getUserInfo: function (res) {
    console.log(this)
    const that = this;
    console.log(1111)
    console.log(res.detail)
    app.globalData.userInfo = res.detail.userInfo;
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (app.userInfoReadyCallback) {
      app.userInfoReadyCallback(res.detail)
    }
    //保存用户信息
    saveUserInfo(res.detail.userInfo, this.data.usercode, that, function () {
      authSuccess(that);
    });
  }
})