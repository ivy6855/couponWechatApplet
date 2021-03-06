// pages/index2/index.js
const utils = require("../../utils/util.js");
const app = getApp();
const couponHelp = require("../../utils/coupon-help.js");


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
    imageUrl: '/images/types/其他.png',
  },{
    cid: 1,
    imageUrl: '/images/types/02-women.png',
  }, {
    cid: 2,
    imageUrl: '/images/types/03-man.png',
  }, {
    cid: 3,
    imageUrl: '/images/types/内衣配饰.png',
  },  {
    cid: 4,
    imageUrl: '/images/types/母婴玩具.png',
  }, {
    cid: 5,
    imageUrl: '/images/types/07-beauty.png',
  }, {
    cid: 6,
    imageUrl: '/images/types/居家生活.png',
  }, {
    cid: 7,
    imageUrl: '/images/types/06-bag.png',
  }, {
    cid: 8,
    imageUrl: '/images/types/食品保健.png',
  }, {
    cid: 9,
    imageUrl: '/images/types/文体车品.png',
  }, {
    cid: 10,
    imageUrl: '/images/types/08-appliance.png',
  }, {
    cid: 11,
    imageUrl: '/images/types/户外运动.png',
  }, {
    cid: 12,
    imageUrl: '/images/types/其他.png',
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
    that.setData({ onAjax: false, loadmoreDisplay: 'none',loading:false })
    wx.hideLoading();
    if (resp.state != 'success') {
      return false;
    }
    var coupons = resp.data.dataList;
    couponHelp.deal(coupons);
    if (page>1){
      coupons = that.data.coupons.concat(coupons);
    }
    // var coupons = that.data.coupons.concat(resp.data.dataList);
    that.setData({ coupons: coupons, currentPage: resp.data.currentPage,
     pageCount: resp.data.pageCount });
    that.setData({ loading: false })
     
  });
}

//执行查询
const doQuery = function(self,value){
  let hisArr = self.data.histroy;
  wx.navigateTo({
    url: '/pages/query/index?title=' + value,
    success: function () {
      self.setData({ onQuery: false })
      for (let i = 0; i < hisArr.length;i++){
        if(hisArr[i].value==value){
          return false;
        }
      }
      if (hisArr.length>9){
        hisArr.splice(-1)
      }
      hisArr.unshift({ key: hisArr.length, value: value });
      wx.setStorage({
        key: "query-histroy",
        data: hisArr
      })
    },
    complete: function () {
      self.setData({ onQuery: false, queryValue: null, histroy: hisArr });
    }
  })
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
    coupons: [],
    scrollTop:0,
    showTop:false,
    histroy:[]
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
      console.log("菜单")
      console.log(res)
      let menus = res.data||[];
      for(let i=0;i<menus.length;i++){
        menus[i]["imageUrl"] = types[menus[i].cid]["imageUrl"];
      }
      menus.push({ cid: null, name: '全部', imageUrl:'/images/types/10-all.png'})
      self.setData({ types: menus})
    });

    wx.getStorage({
      key: 'query-histroy',
      success: function (res) {
        console.log(res.data)
        self.setData({histroy:res.data||[]});
      }
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
    // const self = this;
    // var queryPage = this.data.currentPage + 1;
    // if (queryPage > this.data.pageCount) {
    //   //已经是最后一页了
    //   return false;
    // }
    // console.log("加载分页")
    // self.setData({ loading:true})
    // getCouponsByPage(this, queryPage, self.data.catalog)
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
    doQuery(self,value);
    
  },
  cancelQueryHandle:function(e){
    this.setData({onQuery:false})
  },
  handleScroll:function(event){
    const scrollTop = event.detail.scrollTop;
    this.setData({ showTop: (scrollTop > 300) ? true : false })
  },
  scrolltolower:function(){
    const self = this;
    var queryPage = this.data.currentPage + 1;
    if (queryPage > this.data.pageCount) {
      //已经是最后一页了
      return false;
    }
    if(this.data.loading){
      return false;
    }
    self.setData({ loading: true })
    getCouponsByPage(this, queryPage, self.data.catalog)
  },
  handleToTop:function(){
    this.setData({ scrollTop: 0, showTop:false})
  },
  histroyTapHandle:function(e){
    const self = this;
    const value = e.currentTarget.dataset.value;
    doQuery(self,value);
  }
})