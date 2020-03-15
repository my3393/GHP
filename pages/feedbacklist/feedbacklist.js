// pages/feedbacklist/feedbacklist.js
const app = getApp();
let images = [];
let simages = [];
let currentPage = 1;
let detail = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdetail();
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
    let that = this;
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })
      },
    })
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
      detail = [];
      currentPage=1;
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
    currentPage = currentPage + 1
    
      this.getdetail()

    
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '我是' + that.data.user.bindCityName + that.data.user.bindAreaName + '人，买卖' + that.data.user.bindAreaName + '特产，助力家乡发展，家乡特供平台。',
      path: '/pages/e_/home?userid=' + that.data.user.id,

    }
  },
  home() {
    wx.switchTab({
      url: '../e_home/home',
    })
  },
  good_detail(e){
     wx.navigateTo({
       url: '../feedback_detail/feedback_detail?id=' + e.currentTarget.id,
     })
  },
  getdetail() {
    let that = this;
    let data = {
      currentPage: currentPage
    }

    app.res.req('/productfeedback/productfeedbacklist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        detail.push(...res.data)
        that.setData({
          detail: detail,
          load: false,
        })
        wx.hideLoading()
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