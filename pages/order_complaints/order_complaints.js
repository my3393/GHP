// pages/order_complaints/order_complaints.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancels: [
      { name: '商家未按约定时间发货' },
      { name: '商家长时间不响应/拒绝退款' },
      { name: '商品存在质量问题' },
      { name: '快递物记录' },
      { name: '其他原因' },
    ],
    cancel: '',
    sum: 0,
    num: 0,
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
  //申请原因
  bindcancel(e) {
    console.log(e)
    this.setData({
      cancel: this.data.cancels[e.detail.value].name
    })

  },

  valueChange(e) {
    console.log(e.detail.value.length)
    this.setData({
      sum: e.detail.value.length
    })
  }
})