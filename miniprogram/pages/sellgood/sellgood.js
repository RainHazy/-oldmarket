// miniprogram/pages/sellGood/sellGood.js
var app = getApp();
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    product: "",
    name: "",
    info: "",
    price: 0,
    type: [{
      name: "书籍",
      id: 1
    }, {
      name: "电子",
      id: 2
    }, {
      name: "家具",
      id: 3
    }, {
      name: "其它",
      id: 4
    }],
    typeID: 0, //类型
    degree: [{
      name: "全新",
      id: 1
    }, {
      name: "九成",
      id: 2
    }, {
      name: "七成",
      id: 3
    }, {
      name: "五成",
      id: 4
    }],
    degreeID: 0, //新旧程度
    detail: [], //详情图片
    detailID: 0,
    chooseViewShowDetail: true,
    underText: "确认发布"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.details != "" && options.details != undefined) {
      that.setData({
        product: JSON.parse(options.details)
      })
      var degree = 0
      if (that.data.product["degree"] == "九成") {
        degree = 1
      } else if (that.data.product["degree"] == "七成") {
        degree = 2
      } else if (that.data.product["degree"] == "五成") {
        degree = 3
      }
      that.setData({
        name: that.data.product["name"],
        price: that.data.product["price"],
        info: that.data.product["detail"],
        typeID: that.data.product["category"] - 1,
        degreeID: degree,
        detail: that.data.product["imgFileID"],
        underText: "确认修改"
      })
    }
  },
  /**
   * 获取商品名称
   */
  nameBlur(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 获取商品价格
   */
  priceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 获取商品信息
   */
  infoBlur(e) {
    this.setData({
      info: e.detail.value
    })
  },

  /** 
   * 获取商品价格
   */
  priceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 获取商品类型
   */
  typeBlur(e) {
    this.setData({
      typeID: e.detail.value
    })
  },
  /**
   * 获取商品新旧程度
   */
  degreeBlur(e) {
    this.setData({
      degreeID: e.detail.value
    })
  },

  /**发布提交 */
  formSubmit(e) {
    let that = this
    var priceTF = /^\d+(\.\d{1,2})?$/
    if (e.detail.value.name === "") {
      wx.showToast({
        title: '请输入商品名称',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.name.length > 60) {
      wx.showToast({
        title: '商品名称不得大于60字',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.price.length === "") {
      wx.showToast({
        title: '请输入商品价格',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (!priceTF.test(e.detail.value.price)) {
      wx.showToast({
        title: '商品价格精确到两位',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.info === "") {
      wx.showToast({
        title: '请输入商品信息',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.detail.length === 0) {
      wx.showToast({
        title: '请选择详情图片',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      this.getTime()
      if (that.data.product != "" && that.data.product != undefined) {
        wx.showModal({
          title: '提示',
          content: '确定修改商品',
          success(res) {
            if (res.confirm) {
              that.sureEdit(); //编辑
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '确定发布商品',
          success(res) {
            if (res.confirm) {
              that.sureRelease(); //发布
            }
          }
        })
      }
    }
  },

  /**确认编辑 */
  sureEdit(params) {
    var that = this
    var degree = "全新"
    if (that.data.degreeID == 1) {
      degree = "九成"
    } else if (that.data.degreeID == 2) {
      degree = "七成"
    } else if (that.data.degreeID == 3) {
      degree = "五成"
    }
    const db = wx.cloud.database()
    db.collection('product').doc(that.data.product["_id"]).update({
      data: {
        name: that.data.name,
        price: parseInt(that.data.price),
        detail: that.data.pinfo,
        category: ++that.data.typeID,
        degree: degree,
        imgFileID: that.data.detail
      },
    })
    wx.showToast({
      title: '修改成功',
      icon: "success",
      duration: 1000
    })
    setTimeout(function() {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)
  },

  /**确认发布 */
  sureRelease() {
    var that = this
    const db = wx.cloud.database()
    db.collection('product').add({
      data: {
        buyTime: "",
        buyer: "",
        buyerID: "",
        category: parseInt(that.data.type[that.data.typeID].id),
        degree: that.data.degree[that.data.degreeID].name,
        detail: that.data.info,
        imgFileID: that.data.detail,
        name: that.data.name,
        owner: app.globalData.user["name"],
        price: parseInt(that.data.price),
        receiveAddress: "",
        school: app.globalData.user["school"],
        sellTime: that.data.time,
        shipAddress: app.globalData.user["address"],
        shipTime: "",
        status: 0
      },
    })
    wx.showToast({
      title: '发布成功',
      icon: "success",
      duration: 1000
    })
    setTimeout(function() {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)

  },

  /** 选择图片detail */
  chooseDetail: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(photo) {
        //detail中包含的可能还有编辑页面下回显的图片
        let detail = that.data.detail;
        detail = detail.concat(photo.tempFilePaths);
        that.setData({
          detail: detail,
          detailID: that.data.detailID + 1
        })
        that.chooseViewShowDetail();
      }
    })
  },

  /** 删除图片detail */
  deleteImvDetail: function(e) {
    var that = this;
    var deleteID = e.currentTarget.dataset.id;
    var deleteAgo = that.data.detail;
    var deleteLater = [];
    var j = 0;
    for (var i = 0; i < deleteAgo.length; i++) {
      if (i != deleteID) {
        deleteLater[j] = deleteAgo[i];
        j++;
      }
    }
    that.setData({
      detail: deleteLater,
      detailID: that.data.detailID - 1
    })
    console.log(this.data.detail)
  },


  /** 是否隐藏图片选择detail */
  chooseViewShowDetail: function() {
    if (this.data.detail.length >= 5) {
      this.setData({
        chooseViewShowDetail: false
      })
    } else {
      this.setData({
        chooseViewShowDetail: true
      })
    }
  },

  /** 查看大图Detail */
  showImageDetail: function(e) {
    var detail = this.data.detail;
    var itemIndex = e.currentTarget.dataset.id;
    wx.previewImage({
      current: detail[itemIndex], // 当前显示图片的http链接
      urls: detail // 需要预览的图片http链接列表
    })
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

})