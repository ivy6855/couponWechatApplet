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
      // accessLogs[i].left=0;
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
    loading:false,
    onDelFlag:false,
    delBtnWidth: 120,    //删除按钮宽度单位（rpx）
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
    console.log("onPullDownRefresh")
    const self = this;
    getByPage(self, 1);
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
    // console.log(e)
    // debugger
    const list = this.data.accessLogs
    for (let i = 0; i < list.length; i++) {
      if(list[i].onDel==true){
        return false;
      }
    }
    if (this.data.onDelFlag){
      this.setData({ onDelFlag:false})
      return false;
    }
    const navigateUrl = e.currentTarget.dataset.url;
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
      // url: '/pages/web-view/index?url=' + escape('http://item.jd.com/25738127117.html'),
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "rpx";
        }
      }
      var list = this.data.accessLogs;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setData({ accessLogs:list});
      }
    }
    this.setData({ onDelFlag:true});
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0px";
      var list = this.data.accessLogs;
      // if (index !== "" && index != null) {
      //   list[parseInt(index)].left = left;
      //   // this.setData({ accessLogs: list });
      // }

      for (let i = 0; i < list.length; i++) {
        list[i].left = "margin-left:0px";
        list[i].onDel = false;
      }
      if (disX > delBtnWidth / 2 ){
        list[parseInt(index)].left = left;
        list[parseInt(index)].onDel = true;
      }
      this.setData({ accessLogs: list });
    }
  },
  delItem:function(event){
    const self = this;
    const index = event.currentTarget.dataset.index;
    const id = event.currentTarget.dataset.id;
    let list = this.data.accessLogs;
    wx.showLoading({
      title: '删除中...',
    })
    utils.requestGet("coupon/wechat/accesslog/del/"+id, {}, function (resp) {
      wx.hideLoading();
      if(resp.state=="success"){
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        // self.setData({ onDelFlag: false })
        list.splice(index, 1);
        self.setData({ accessLogs: list });
      }
    });
  }
})