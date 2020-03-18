const app = getApp()
var util = require('../utils/util.js');  
Page({
  data: {
    time:'',
    product: [],
    car: '加入购物车',
    isLike: true,
    // banner
    imgUrls: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    // 商品详情介绍
    detailImg: [],
  },

  onLoad: function(options) {
    var that = this
    this.setData({
      product: JSON.parse(options.details),
      imgUrls: JSON.parse(options.details)["imgFileID"]
    })
    //status属性0表示未加入购物车和出售，1表示加入了购物车，2表示已出售
    if(this.data.product.status=="1")
    {
      this.setData({
        car:'移出购物车'
      })
    }
    console.log(this.data.product.status)
  },

  //预览图片
  previewImage: function(e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls[0] // 需要预览的图片http链接列表  
    })
  },
  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  // 跳到购物车
  addCar() {
    const db = wx.cloud.database()
    if (this.data.car == "加入购物车") {
      this.getTime()
      db.collection('product').doc(this.data.product._id).update({
          data: {
            buyerID: app.globalData.openid,
            buyer: app.globalData.user["name"],
            buyTime:this.data.time,
            status: 1
          },
        success: res => {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
          console.log(this.data.product._id)
        }
      })
      this.setData({
        car: '移出购物车'
      })
    } else {
      db.collection('product').doc(this.data.product._id).update({
          data: {
            buyerID: "",
            buyer: "",
            buyTime:"",
            status: 0
          },
        success: res => {
          wx.showToast({
            title: '移出购物车成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        }
      })
      this.setData({
        car: '加入购物车'
      })
    }
  },

  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },

  getTime() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var times = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: times
    })
  },
})