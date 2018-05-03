// pages/histroy/index.js
const utils = require("../../utils/util.js");
const dateUtils = require("../../utils/date-util.js");
const app = getApp();


const PAGE_LIMIT = 10;
const getByPage = function (that, page) {
  let q_page = page || 1;
  if (that.data.onAjax) {
    return false;
  }
  if (that.data.pageCount && that.data.pageCount < q_page) {
    that.setData({ nomoreDisplay: 'block' });
    return false;
  }
  var params = {
    start: (q_page - 1) * PAGE_LIMIT,
    limit: PAGE_LIMIT
  }
  
  params["customerId"] = app.globalData.USER_ID;
  wx.showLoading({
    mask: true
  });
  that.setData({ onAjax: true, loadmoreDisplay: 'block' })
  utils.requestGet("coupon/wechat/accesslog", params, function (resp) {
    that.setData({ loading: false });
    that.setData({ onAjax: false, loadmoreDisplay: 'none' })
    wx.hideLoading();
    if (resp.state != 'success') {
      return false;
    }
    var accessLogs = resp.data.dataList;
    if (page > 1) {
      accessLogs = that.data.accessLogs.concat(accessLogs);
    }
    for (let i = 0; i < accessLogs.length; i++) {
      accessLogs[i].timer = dateUtils.getChsDate(accessLogs[i].operTime);
      if (i > 0) {
        accessLogs[i].preTimer = dateUtils.getChsDate(accessLogs[i - 1].operTime);
      }
    }
    // var coupons = that.data.coupons.concat(resp.data.dataList);
    that.setData({
      accessLogs: accessLogs,
      currentPage: resp.data.currentPage,
      pageCount: resp.data.pageCount
    });
    that.setData({ loading: false })
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accessLogs:[],
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    getByPage(self,1)
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
    const self = this;
    var queryPage = this.data.currentPage + 1;
    if (queryPage > this.data.pageCount) {
      //已经是最后一页了
      return false;
    }
    self.setData({ loading: true })
    getByPage(this, queryPage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  couponTap: function (e) {
    const navigateUrl = e.currentTarget.dataset.url;
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
      // url: '/pages/web-view/index?url=' + escape('http://item.jd.com/25738127117.html'),
    })
  },
})