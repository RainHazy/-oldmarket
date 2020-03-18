// pages/cart/cart.js
const app = getApp()
var util = require('../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'',
    product:[],
    productList: [],
    priceSum:0,
    selectID:[]
  },
   //获取产品对象
   getPorduct(){
     var that = this
     const db = wx.cloud.database()
     db.collection('product').where({
       buyerID: app.globalData.openid,
       status:1
       }).get({
       success: function (res) {
         for (var i = 0; i < res.data.length; i++) {
           res.data[i].ids = i;
           res.data[i].onoff=0
         }
         that.setData({
           productList: res.data,
         })
         console.log(that.data.productList);
       }
     })
     
   },
   //选择商品事件
  checkboxChange(e){
    var products=this.data.productList
    var price=0;
    var p = e.currentTarget.id;
    if (products[p].onoff==0)
    {
      price = this.data.priceSum + products[p].price
      products[p].onoff = 1
      this.setData({
        priceSum: price,
        productList: products
      })
    }
    else{
      price = this.data.priceSum - products[p].price
      products[p].onoff = 0
      this.setData({
        priceSum: price,
        productList: products
      })
    }
  },

//付款事件
buy(e){
  this.getTime()
  const db=wx.cloud.database()
  var p = this.data.productList
  for(var i=0;i<p.length;i++){
    if (p[i].onoff == 1) {
      db.collection('product').doc(p[i]._id).update({
        data: {
          status: 2,
          buyTime: this.data.time,
          receiveAddress: app.globalData.user["address"]
        },
      })
    }
  }
  wx.reLaunch({
    url: '../cart/cart',
  })
},

//删除指定商品事件
  del(e) {
    const db = wx.cloud.database()
      var p = this.data.productList
      for (var i = 0; i < p.length; i++) {
        if (p[i].onoff == 1) {
          db.collection('product').doc(p[i]._id).update({
            data: {
              status: 0,
              buyerID: "",
              buyer: "",
              buyTime:''
            },
          })
        }
      }
    wx.reLaunch({
      url: '../cart/cart',
    })
      console.log(p)
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
    this.getPorduct();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onLoad()
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