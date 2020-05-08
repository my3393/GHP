// pages/live_add/live_add.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
       name:'',
       phone:'',
       wx:'',
       pro:'',
       remark:'',
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
  name(e){
    this.setData({
      name:e.detail.value
    })
  },
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  wx(e) {
    this.setData({
      wx: e.detail.value
    })
  },
  remark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  pro(e) {
    this.setData({
      pro: e.detail.value
    })
  },
  sub(e){
    var that = this
    var tel = /^1[3456789]\d{9}$/;
    if(that.data.name == ''){
      wx.showToast({
        title: '请输入姓名',
        icon:'none'
      })
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (that.data.wx == '') {
      wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
    } else if (!(tel.test(that.data.phone))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none'
      })
    }else{
      let data = {
        name :that.data.name,
        contactPhone : that.data.phone,
        weiXinNo : that.data.wx,
        remark: that.data.remark,
        liveArea:that.data.pro
      }
     app.res.req('/live/submitapply', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '申请成功，请等待审核',
            icon: 'none'
          })
          setTimeout(()=>{
            wx.navigateBack({
              delat:1
            })
          },1500)

        } else if (res.status == 1004 || res.status == 1005) {
          wx.redirectTo({
            url: '../login/login',
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  }
})