// pages/histroy/index.js
const utils = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accessLogs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    utils.requestGet("coupon/wechat/accesslog", {}, function (resp) {
      console.log(resp);
      self.setData({ accessLogs:resp.data.dataList});
      const accessLogs = resp.data.dataList;
      for (let i = 0; i < accessLogs.length;i++){
        utils.requestGet("coupon/wechat/itemcoupon/" + accessLogs[i].numIid,{},function(resp2){
          if (resp.state != 'success') {
            return false;
          }
          accessLogs[i].coupon = resp2.data;
        })
      }
    });

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