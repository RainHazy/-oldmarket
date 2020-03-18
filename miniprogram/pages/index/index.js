// pages/classtype/class/type.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类的变量
    num:0,
    classType: [
      {
        "id": 0,
        "name": "全部"
      },
      {
        "id": 1,
        "name": "书籍"
      },
      {
        "id": 2,
        "name": "电子"
      },
      {
        "id": 3,
        "name": "家具"
      },
      {
        "id": 4,
        "name": "其它"
      }
    ],
    // 分类后的产品列表
    productList: [],
    // 初始数据
    productAll: []
  },
  searchTab(e) {
    var p = this.data.productAll
    var id = e.currentTarget.id
    console.log(id)
    var list = []
    for (var i = 0; i < p.length; i++) {
      if (p[i].category == id) {
        list.push(p[i])
      }
    }
    this.setData({
      productList: list,
      num: id
    })
    console.log(this.data.productList)
  },

  productDetails: function(event) {
    var index = event.currentTarget.dataset.index
    console.log(index)
    if (this.data.productList=="")
    {
      var model = JSON.stringify(this.data.productAll[index]);
      wx.navigateTo({
        url: '../product/product?details=' + model
      })
    }
    else{
      var model = JSON.stringify(this.data.productList[index]);
      wx.navigateTo({
        url: '../product/product?details=' + model
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const db = wx.cloud.database()
    db.collection('product').where({
      status:0
      }).get({
      success: function (res) {
          that.setData({
            productAll: res.data
          })
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
    //从详情页面返回时刷新当前页面
    this.onLoad()
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