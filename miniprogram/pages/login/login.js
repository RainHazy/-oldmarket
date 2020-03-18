var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    str: '',
    formid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  //获取formid,推送消息用
  getFormId(event) {
    this.setData({
      formid: event.detail.formId
    })
    app.globalData.formid = this.data.formid;
  },
  getUserInfo: function(e) {
    wx.setStorageSync('userinfo', e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(this.data.userInfo)
    app.globalData.openid = e.detail.openid;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        //保存用户信息
        const db = wx.cloud.database();
        var info = this.data.userInfo;
        db.collection('userinfo').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            if (res.data.length == 0) {
              db.collection('userinfo').add({
                data: {
                  username: info.nickName,
                  img: info.avatarUrl,
                  formid: this.data.formid,
                  phone: '',
                  address: '',
                  school: '',
                  studentID: '',
                  name: ''
                }
              })
            } else {
              db.collection('userinfo').doc(res.data[0]._id).update({
                data: {
                  username: info.nickName,
                  img: info.avatarUrl,
                  formid: this.data.formid
                }
              })
            }
          },
        });
        db.collection('userinfo').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            app.globalData.user = res.data[0]
            console.log(app.globalData.user)
          }
        })
        setTimeout(function() {
          wx.switchTab({
            url: '../index/index',
          })
        }, 3000)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../login/login',
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})