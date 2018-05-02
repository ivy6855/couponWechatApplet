// pages/index2/index.js
const utils = require("../../utils/util.js");
const app = getApp();
// {
//   "pagePath": "pages/histroy/index",
//     "iconPath": "images/nav/histroy-off.png",
//       "selectedIconPath": "images/nav/histroy-on.png",
//         "text": "最近浏览"
// },

const banners = [{
  id: 1,
  imageUrl: "/images/banner01.jpg"
}, {
  id: 2,
  imageUrl: "/images/banner02.jpg"
}, {
  id: 3,
  imageUrl: "/images/banner03.jpg"
}];

const types = [
  {
    cid: 0,
    imageUrl: '/images/types/10-all.png',
  },{
    cid: 1,
    imageUrl: '/images/types/02-women.png',
  }, {
    cid: 2,
    imageUrl: '/images/types/03-man.png',
  }, {
    cid: 3,
    imageUrl: '/images/types/02-women.png',
  },  {
    cid: 4,
    imageUrl: '/images/types/07-beauty.png',
  }, {
    cid: 5,
    imageUrl: '/images/types/07-beauty.png',
  }, {
    cid: 6,
    imageUrl: '/images/types/05-shoes.png',
  }, {
    cid: 7,
    imageUrl: '/images/types/06-bag.png',
  }, {
    cid: 8,
    imageUrl: '/images/types/06-bag.png',
  }, {
    cid: 9,
    imageUrl: '/images/types/08-appliance.png',
  }, {
    cid: 10,
    imageUrl: '/images/types/09-phone.png',
  }, {
    cid: 11,
    imageUrl: '/images/types/10-all.png',
  }, {
    cid: 12,
    imageUrl: '/images/types/10-all.png',
  }, {
    cid: 13,
    imageUrl: '/images/types/10-all.png',
  }, {
    cid: null,
    imageUrl: '/images/types/10-all.png',
  }
]

// const coupons = [
//   {
//     numIid:1,
//     title:'iphone新款防爆钢化膜',
//     smallImages:'/images/goods.jpeg',
//     volume: 200,//30天销量
//     platform:'天猫',//所属平台
//     couponInfo:'100',//优惠券面额
//     zkFinalPrice:'199.00'//折扣价
//   }, {
//     numIid: 2,
//     title: 'iphone新款防爆钢化膜',
//     smallImages: '/images/goods.jpeg',
//     volume: 200,//30天销量
//     platform: '天猫',//所属平台
//     couponInfo: '100',//优惠券面额
//     zkFinalPrice: '199.00'//折扣价
//   }, {
//     numIid: 3,
//     title: 'iphone新款防爆钢化膜',
//     smallImages: '/images/goods.jpeg',
//     volume: 200,//30天销量
//     platform: '天猫',//所属平台
//     couponInfo: '100',//优惠券面额
//     zkFinalPrice: '199.00'//折扣价
//   }, {
//     numIid: 4,
//     title: 'iphone新款防爆钢化膜',
//     smallImages: '/images/goods.jpeg',
//     volume: 200,//30天销量
//     platform: '天猫',//所属平台
//     couponInfo: '100',//优惠券面额
//     zkFinalPrice: '199.00'//折扣价
//   }, {
//     numIid: 5,
//     title: 'iphone新款防爆钢化膜',
//     smallImages: '/images/goods.jpeg',
//     volume: 200,//30天销量
//     platform: '天猫',//所属平台
//     couponInfo: '100',//优惠券面额
//     zkFinalPrice: '199.00'//折扣价
//   }, {
//     numIid: 6,
//     title: 'iphone新款防爆钢化膜',
//     smallImages: '/images/goods.jpeg',
//     volume: 200,//30天销量
//     platform: '天猫',//所属平台
//     couponInfo: '100',//优惠券面额
//     zkFinalPrice: '199.00'//折扣价
//   }
// ]

const PAGE_LIMIT = 20;
const getCouponsByPage = function (that, page,cType) {
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
  if (cType){
    params["category"] = cType;
  }

  wx.showLoading({
    mask: true
  });
  that.setData({ onAjax: true, loadmoreDisplay: 'block' })
  utils.requestGet("coupon/wechat/main/coupons", params, function (resp) {
    that.setData({ onAjax: false, loadmoreDisplay: 'none' })
    wx.hideLoading();
    if (resp.state != 'success') {
      return false;
    }
    var coupons = resp.data.dataList;
    if (page>1){
      coupons = that.data.coupons.concat(coupons);
    }
    // var coupons = that.data.coupons.concat(resp.data.dataList);
    that.setData({ coupons: coupons, currentPage: resp.data.currentPage,
     pageCount: resp.data.pageCount });
    that.setData({ loading: false })
     
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onAjax:false,
    loading:false,
    onQuery:false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent:0,
    banners:banners,
    types:types,
    coupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    //banners
    utils.requestGet("coupon/wechat/main/banner",{},function(res){
      console.log(res)
    })
    //优惠券
    getCouponsByPage(self,1);

    //菜单
    utils.requestGet("coupon/wechat/main/menu", {}, function (res) {
      let menus = res.data||[];
      for(let i=0;i<menus.length;i++){
        menus[i]["imageUrl"] = types[menus[i].cid]["imageUrl"];
      }
      menus.push({ cid: null, name: '全部', imageUrl:'/images/types/10-all.png'})
      self.setData({ types: menus})
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
    const self = this;
    var queryPage = this.data.currentPage + 1;
    if (queryPage > this.data.totalPage) {
      //已经是最后一页了
      return false;
    }
    console.log("加载分页")
    self.setData({ loading:true})
    getCouponsByPage(this, queryPage, self.data.catalog)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  swiperchange:function(e){
    this.setData({
      swiperCurrent: e.detail.current
    }) 
  },
  couponTap:function(e){
    const navigateUrl = e.currentTarget.dataset.url;
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
      // url: '/pages/web-view/index?url=' + escape('http://item.jd.com/25738127117.html'),
    })
  },
  menuTabHandle:function(e){
    console.log(e);
    const self = this;
    const cid = e.currentTarget.dataset.id;
    self.setData({catalog:cid});
    getCouponsByPage(self,1,cid);
  },
  queryFocusHandle:function(e){
    this.setData({onQuery:true});
  },
  queryHandle:function(e){
    const self = this;
    const value = e.detail.value;
    wx.navigateTo({
      url: '/pages/query/index?title='+value,
      success:function(){

      },
      complete:function(){
        self.setData({ onQuery: false,queryValue:null });
      }
    })
    // utils.requestGet("coupon/wechat/main/coupons", { title:value}, function (resp) {
    //   that.setData({ onAjax: false, loadmoreDisplay: 'none' })
    //   wx.hideLoading();
      
    // });
  },
  cancelQueryHandle:function(e){
    this.setData({onQuery:false})
  }
})