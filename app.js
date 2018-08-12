//app.js
const utils = require("utils/util.js");
let loadOptions = {}

const saveUserInfo = function (userInfo, userCode, that) {
  var requestData = {
    nickName: userInfo.nickName,
    weixinHeadImage: userInfo.avatarUrl,
    gender: userInfo.gender,
    country: userInfo.country,
    province: userInfo.province,
    city: userInfo.city,
    code: userCode
  }
  wx.showLoading({
    title: '加载中..',
  })
  utils.request('coupon/wechat/customer', requestData, function (resp) {
    wx.hideLoading()
    if (resp.state == "success") {
      //设置openId,用户id
      that.globalData.USER_ID = resp.data.userId;
      that.globalData.session_key = resp.data.session_key;
      that.globalData.openid = resp.data.openid;
      wx.setStorageSync(utils.userStoragekey, resp.data);

    }
  })
}

const setUserInfo = function (userCode, that) {
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      that.globalData.userInfo = res.userInfo;
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (that.userInfoReadyCallback) {
        that.userInfoReadyCallback(res)
      }
      //保存用户信息
      saveUserInfo(res.userInfo, userCode, that);
    }
  })
}



App({
  onLaunch: function (options) {
    wx.showLoading();
    //删除缓存用户信息
    wx.removeStorageSync(utils.userStoragekey);
    this.globalData.baseUrl = utils.baseUrl;
    this.globalData.timestamp = Date.parse(new Date());
    let self = this;
    loadOptions = options;
    console.log("app launch ");
    console.log(loadOptions)
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var sessionKey = '';
    //初始化shareUserId为空
    // wx.setStorageSync('shareUserId', null);
    var login = function () {
      wx.login({
        success: res1 => {
          wx.showNavigationBarLoading();
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 获取用户信息
          wx.getSetting({
            success: res => {
              console.log("获取用户信息")
              wx.hideNavigationBarLoading();
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                setUserInfo(res1.code, self);
              } else {
                wx.hideLoading();
                wx.navigateTo({
                  url: '/pages/auth/index?from=index&code=' + res1.code
                })
                return false
                wx.authorize({
                  scope: 'scope.userInfo',
                  success(res) {
                    console.log("同意授权");
                    console.log(res)
                    setUserInfo(res1.code, self);
                  },
                  fail: function (res) {
                    // wx.showModal({
                    //   title: '用户未授权',
                    //   content: '如需正常使用测试功能，请按确定并在授权管理中选中“用户信息”，然后点确定。最后再重新进入小程序即可正常使用',
                    //   confirmText: '确定',
                    //   showCancel:false,
                    //   success: function (res) {
                    //     console.log(res)
                    //     if (res.confirm) {
                    //       console.log('用户点击确定')
                    //       userAuthSetting(self);
                    //     }
                    //   }
                    // })
                  }
                })
              }
            }
          })
        }
      })
    }
    // 登录
    var checkResult = utils.checkClientToken();
    if (typeof (checkResult) == "object") {
      checkResult.then(function () {
        login()
      })
    } else {
      login();
    }
  },
  globalData: {
    userInfo: null,
    sceneId: "",
    testUserId: "",
    shareUserId: "",
    partnerUnionId: "",
  }
});
