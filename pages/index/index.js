// pages/index2/index.js
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

const types=[
  {
    id:1,
    type:'优质新品',
    imageUrl:'/images/types/01-new.png',
  }, {
    id: 2,
    type: '潮流女装',
    imageUrl: '/images/types/02-women.png',
  }, {
    id: 3,
    type: '男装',
    imageUrl: '/images/types/03-man.png',
  }, {
    id: 4,
    type: '品牌精选',
    imageUrl: '/images/types/04-brand.png',
  }, {
    id: 5,
    type: '人气美鞋',
    imageUrl: '/images/types/05-shoes.png',
  }, {
    id: 6,
    type: '箱包',
    imageUrl: '/images/types/06-bag.png',
  }, {
    id: 7,
    type: '护肤美妆',
    imageUrl: '/images/types/07-beauty.png',
  }, {
    id: 8,
    type: '家用电器',
    imageUrl: '/images/types/08-appliance.png',
  }, {
    id: 9,
    type: '手机数码',
    imageUrl: '/images/types/09-phone.png',
  }, {
    id: 10,
    type: '全部',
    imageUrl: '/images/types/10-all.png',
  },
]

const goods = [
  {
    numIid:1,
    title:'iphone新款防爆钢化膜',
    smallImages:'/images/goods.jpeg',
    volume: 200,//30天销量
    platform:'天猫',//所属平台
    couponInfo:'100',//优惠券面额
    zkFinalPrice:'199.00'//折扣价
  }, {
    numIid: 2,
    title: 'iphone新款防爆钢化膜',
    smallImages: '/images/goods.jpeg',
    volume: 200,//30天销量
    platform: '天猫',//所属平台
    couponInfo: '100',//优惠券面额
    zkFinalPrice: '199.00'//折扣价
  }, {
    numIid: 3,
    title: 'iphone新款防爆钢化膜',
    smallImages: '/images/goods.jpeg',
    volume: 200,//30天销量
    platform: '天猫',//所属平台
    couponInfo: '100',//优惠券面额
    zkFinalPrice: '199.00'//折扣价
  }, {
    numIid: 4,
    title: 'iphone新款防爆钢化膜',
    smallImages: '/images/goods.jpeg',
    volume: 200,//30天销量
    platform: '天猫',//所属平台
    couponInfo: '100',//优惠券面额
    zkFinalPrice: '199.00'//折扣价
  }, {
    numIid: 5,
    title: 'iphone新款防爆钢化膜',
    smallImages: '/images/goods.jpeg',
    volume: 200,//30天销量
    platform: '天猫',//所属平台
    couponInfo: '100',//优惠券面额
    zkFinalPrice: '199.00'//折扣价
  }, {
    numIid: 6,
    title: 'iphone新款防爆钢化膜',
    smallImages: '/images/goods.jpeg',
    volume: 200,//30天销量
    platform: '天猫',//所属平台
    couponInfo: '100',//优惠券面额
    zkFinalPrice: '199.00'//折扣价
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent:0,
    banners:banners,
    types:types,
    goods: goods
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
  swiperchange:function(e){
    this.setData({
      swiperCurrent: e.detail.current
    }) 
  }
})