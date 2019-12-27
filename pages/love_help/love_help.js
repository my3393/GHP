// pages/love_help/love_help.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     ismask:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Detail();
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
  love_detail(){
    wx.navigateTo({
      url: '../love_detail/love_detail',
    })
  },
  home(){
    wx.switchTab({
      url: '../e_home/home',
    })
  },
  Detail() {
    let that = this;
    let data = {

    }

    app.res.req('app-web/user/donationinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          detail: res.data
        })

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
  },
})