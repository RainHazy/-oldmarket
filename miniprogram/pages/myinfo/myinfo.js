// miniprogram/pages/myinfo/myinfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school: "",
    name: "",
    studentID: "",
    phone: "",
    address: "",
    mode: true,
    undertext: "修改信息",
    id: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      _openid: app.globalData.openid
    }).get({
      success: function(res) {
        that.setData({
          school: res.data[0].school,
          name: res.data[0].name,
          studentID: res.data[0].studentID,
          phone: res.data[0].phone,
          address: res.data[0].address,
          id: res.data[0]._id
        })
      }
    })
  },
  /**
   * 获取学校
   */
  schoolText(e) {
    this.setData({
      school: e.detail.value
    })
  },
  /**
   * 获取姓名
   */
  nameText(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 获取学号
   */
  studentIDText(e) {
    this.setData({
      studentID: e.detail.value
    })
  },
  /**
   * 获取电话
   */
  phoneText(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取地址
   */
  addressText(e) {
    this.setData({
      address: e.detail.value
    })
  },

  /**修改信息 */
  modify() {
    if (this.data.mode == true) {
      this.setData({
        mode: false,
        undertext: "确认修改"
      })
    } else {
      this.formSubmit()
    }
  },
  /**修改提交 */
  formSubmit() {
    let that = this
    if (that.data.school === "") {
      wx.showToast({
        title: '请输入学校',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.name === "") {
      wx.showToast({
        title: '请输入姓名',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.studentID === "") {
      wx.showToast({
        title: '请输入学号',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.phone === "") {
      wx.showToast({
        title: '请输入电话号码',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.address === "") {
      wx.showToast({
        title: '请输入地址',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      const db = wx.cloud.database()
      db.collection('userinfo').doc(that.data.id).update({
        data: {
          school: that.data.school,
          name: that.data.name,
          studentID: that.data.studentID,
          phone: that.data.phone,
          address: that.data.address,
        }
      })
      app.globalData.user["school"] = that.data.school,
      app.globalData.user["name"] = that.data.name,
      app.globalData.user["studentID"] = that.data.studentID,
      app.globalData.user["phone"] = that.data.phone,
      app.globalData.user["address"] = that.data.address,
      that.setData({
          mode: true,
          undertext: "修改信息"
        })
    }
  },

})