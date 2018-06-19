// pages/search/index.js
const utils = require("../../utils/util.js");
const app = getApp();
const couponHelp = require("../../utils/coupon-help.js");


const queryPageByPlatform = function(that,page,flatform,nextFun){
    // http://127.0.0.1:8181/coupon-wechat/coupon/wechat/itemcoupon/listconnect?type=jingtuitui&name=宝宝
  const queryValue = that.data.queryValue;
  if(queryValue==null||queryValue==""||queryValue==undefined){
    return false;
  }
  wx.showLoading({
    title: '查询中...',
  })
  utils.request("coupon/wechat/itemcoupon/listconnect?type="+flatform+"&name=" + queryValue, {}, function (resp) {
    wx.hideLoading();
    if(resp&&resp.data){
      let coupons = resp.data.dataList || [];
      for(let i=0;i<coupons.length;i++){
        coupons[i].platform = flatform;
      }
      couponHelp.deal(coupons);
      coupons = that.data.coupons.concat(coupons);
      that.setData({ coupons: coupons })
    }
    if(nextFun){
      nextFun();
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryValue:"",
    coupons:[],
    scrollTop: 0,
    showTop: false
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
  handleInput:function(e){
    this.setData({queryValue:e.detail.value});
  },
  handleScroll: function (event) {
    const scrollTop = event.detail.scrollTop;
    this.setData({ showTop: (scrollTop > 300) ? true : false })
  },
  handleSearch:function(event){
    const self = this;
    self.setData({ coupons:[]})
    queryPageByPlatform(self, 1,"jingtuitui",function(){
      queryPageByPlatform(self, 1, "taoke")
    })
    
  },
  handleToTop: function () {
    this.setData({ scrollTop: 0, showTop: false })
  },
  couponTap: function (e) {
    const navigateUrl = e.currentTarget.dataset.url;
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id+"&type=outer",
    })
  },
})