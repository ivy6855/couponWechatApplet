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


const dealDetail = function(self,data){
  const itemcoupon = data || {};
  if (itemcoupon.platform == "taoke") {
    itemcoupon.platformText = "淘宝"
  } else if (itemcoupon.platform == "jingtuitui") {
    itemcoupon.platformText = "京东"
  }
  itemcoupon.originalPrice = (parseFloat(itemcoupon.couponInfo) + parseFloat(itemcoupon.zkFinalPrice)).toFixed(2);

  self.setData({ itemcoupon: itemcoupon });
  let pics = [];
  pics.push({ pictUrl: itemcoupon.pictUrl, id: itemcoupon.numIid });
  self.setData({ banners: pics });
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    showToastFlg:false,
    taokl:'复制框内整段文字，{model}，打开「手淘」即可「领取优惠券」并购买',
    interval: 3000,
    banners:[],
    itemcoupon:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    const numIid = options.id;
    const type = options.type;
    wx.showLoading({
      title: '加载中...',
    });
    if(type=="outer"){
      //访问外部详情，numIid为outterid
      utils.requestGet("coupon/wechat/itemcoupon/connect/" + numIid + "/" + app.globalData.USER_ID, {}, function (res) {
        wx.hideLoading()
        if (res.state != "success") {
          wx.showToast({
            title: '加载失败',
            icon: 'fail',
            duration: 2000
          })
        }
        dealDetail(self, res.data || [])
      })
      

    }else{
      utils.requestGet("coupon/wechat/itemcoupon/" + numIid + "/" + app.globalData.USER_ID, {}, function (res) {
        wx.hideLoading()
        if (res.state != "success") {
          wx.showToast({
            title: '加载失败',
            icon: 'fail',
            duration: 2000
          })
        }
        dealDetail(self,res.data||[])
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
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  handleGetCoupon:function(e){
    const self = this;
    const platform = e.currentTarget.dataset.platform;
    //领券
    //淘宝
    wx.showToast({
      title: '加载中...'
    })
    const numIid = e.currentTarget.dataset.id;
    const outid = e.currentTarget.dataset.outid;
    let url = "";
    if(numIid){
      url = "coupon/wechat/itemcoupon/" + numIid + "/taobao";
    }else if(outid){
      url = "coupon/wechat/itemcoupon/connect/" + outid + "/taobao";
    }
    utils.requestGet(url, {}, function (res) {
      if (res.state != "success") {
        wx.showToast({
          title: '领取失败',
          icon: 'fail',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 1000
        })
        self.setData({
          taokl: res.data,
          showToastFlg: true
        })
      }
    })
  },
  handleClose:function(e){
    this.setData({
      taokl: '',
      showToastFlg: false
    })
  },
  customServiceHandle: function (e) {
    const coupon = this.data.itemcoupon;
    const sendMsg = {
      "touser": app.globalData.openid,
      "description": coupon.itemDescription,
      "title": coupon.title,
      'url': coupon.couponClickUrl,
      "thumb_url":coupon.pictUrl
    }
    utils.requestGet("customer/service/send/linkmessage", sendMsg,function(resp){
      if(resp.state!="success"){
        wx.showToast({
          title: '领取失败',
        })
      }
    })

   
  },
  handelBeforeService: function (e) {
    // wx.setClipboardData({
    //   data: 'jd:' + this.data.itemcoupon.outerId,
    //   success: function (res) {
    //     console.log(res);
    //   }
    // });
  }
});