// miniprogram/pages/mybuy/mybuy.js
var app = getApp();
var util = require('../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,
    swipertab: [{ name: '待付款', index: 0 }, { name: '待确收', index: 1 }, { name: '已完成', index: 2 }],
    waitPrice:[],
    waitProduct:[],
    alreadyProduct:[],
    time:''
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  /**
   * 前往购物车付款
   */
  toPay: function(){
    wx.switchTab({
      url: '../cart/cart'
    })
  },

  /**
  * 确认收货
  */
  toConfirm: function (e) {
    var products = e.currentTarget.dataset.value
    this.getTime()
    const db=wx.cloud.database()
    db.collection('complete').add({
      data: {
        buyTime: products.buyTime,
        buyer: products.buyer,
        sellerID: products._openid,
        category: products.category,
        degree: products.degree,
        detail: products.detail,
        imgFileID: products.imgFileID,
        name: products.name,
        owner: products.owner,
        price: products.price,
        receiveAdderss: products.receiveAdderss,
        school: products.school,
        sellTime: products.sellTime,
        shipAddress: products.shipAddress,
        shipTime: this.data.time
      },
    })
    db.collection('product').doc(products._id).remove({})
    this.onLoad()
  }, 

  /**
    * 获取当前时间
    */
  getTime() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var times = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: times
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const db = wx.cloud.database()
    //获取待付款商品
    db.collection('product').where({
      status: 1,
      buyerID: app.globalData.openid
    }).get({
      success: function (res) {
        that.setData({
          waitPrice: res.data
        })
      }
    })
    ////获取待确认收货商品
    db.collection('product').where({
      status: 2,
      buyerID: app.globalData.openid
    }).get({
      success: function (res) {
        that.setData({
          waitProduct: res.data
        })
      }
    })
    //获取交易完成商品
    db.collection('complete').where({
      _openid: app.globalData.openid
    }).get({
      success: function (res) {
        that.setData({
          alreadyProduct: res.data
        })
      }
    })
    this.getDeviceInfo()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
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