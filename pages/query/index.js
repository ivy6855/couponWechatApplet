// pages/query/index.js
const utils = require("../../utils/util.js");
const app = getApp();

const PAGE_LIMIT = 20;
const getCouponsByPage = function (that, page, queryTitle) {
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
    // id: app.globalData.USER_ID
  }
  if (queryTitle) {
    params["title"] = queryTitle;
  }

  wx.showLoading({
    mask: true
  });
  that.setData({ onAjax: true, loadmoreDisplay: 'block' })
  utils.requestGet("coupon/wechat/main/coupons", params, function (resp) {
    that.setData({loading:false});
    that.setData({ onAjax: false, loadmoreDisplay: 'none' })
    wx.hideLoading();
    if (resp.state != 'success') {
      return false;
    }
    var coupons = resp.data.dataList;
    for (let i = 0; i < coupons.length; i++) {
      if (coupons[i].platform == "taoke") {
        coupons[i].platform = "淘宝"
      } else if (coupons[i].platform == "jingtuitui") {
        coupons[i].platform = "京东"
      }
      coupons[i].originalPrice = (parseFloat(coupons[i].couponInfo) + parseFloat(coupons[i].zkFinalPrice)).toFixed(2) ;
    }
    if (page > 1) {
      coupons = that.data.coupons.concat(coupons);
    }
    // var coupons = that.data.coupons.concat(resp.data.dataList);
    that.setData({
      coupons: coupons, currentPage: resp.data.currentPage,
      pageCount: resp.data.pageCount
    });
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onAjax: false,
    onQuery: false,
    loading:false,
    coupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    const queryTitle = options.title;
    self.setData({queryTitle:queryTitle});
    getCouponsByPage(self,1,queryTitle);
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
    self.setData({loading:true});
    getCouponsByPage(this, queryPage, self.data.queryTitle);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  cancelQueryHandle: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  queryHandle: function (e) {
    const self = this;
    const value = e.detail.value;
    self.setData({queryTitle:value});
    getCouponsByPage(this, 1, value);

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