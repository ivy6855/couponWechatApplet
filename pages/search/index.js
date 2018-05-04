// pages/search/index.js
const utils = require("../../utils/util.js");
const app = getApp();
const couponHelp = require("../../utils/coupon-help.js");


const queryPageByPlatform = function(that,page,flatform){
    // http://127.0.0.1:8181/coupon-wechat/coupon/wechat/itemcoupon/listconnect?type=jingtuitui&name=宝宝
  const queryValue = that.data.queryValue;
  if(queryValue==null||queryValue==""||queryValue==undefined){
    return false;
  }
  utils.request("coupon/wechat/itemcoupon/listconnect?type="+flatform+"&name=" + queryValue, {}, function (resp) {
    const coupons = that.data.coupons.concat(resp.data.dataList || []);
    couponHelp.deal(coupons);
    that.setData({ coupons: coupons })
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryValue:"",
    coupons:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  handleInpu:function(e){
    this.setData({queryValue:e.detail.value});
  },
  handleSearch:function(event){
    const self = this;
    queryPageByPlatform(self, 1,"jingtuitui")
    queryPageByPlatform(self, 1,"taoke")
    
  }
})