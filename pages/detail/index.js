// pages/detail/index.js
const utils = require("../../utils/util.js");
const app = getApp();

const banners = [{
  id: 1,
  pictUrl: "/images/banner01.jpg"
}, {
  id: 2,
  pictUrl: "/images/banner02.jpg"
}, {
  id: 3,
  pictUrl: "/images/banner03.jpg"
}];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    banners:banners,
    itemcoupon:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    const numIid = options.id;
    utils.requestGet("coupon/wechat/itemcoupon/" + numIid, {}, function (res) {
      console.log(res)
      if(res.state !="success"){
        wx.showToast({
          title: '加载失败',
          icon: 'fail',
          duration: 2000
        })
      }
      const itemcoupon = res.data;
      self.setData({ itemcoupon: itemcoupon});
      let pics = [];
      pics.push({ pictUrl: itemcoupon.pictUrl, id: itemcoupon.numIid});
      self.setData({ banners: pics});
    })
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
  
  }
})