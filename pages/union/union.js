// pages/union/union.js
const app = getApp();

let currentPage = 1;
let detail = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: [
      { name: '共享成员' },
      { name: '共享商家' }
    ],
    tar: 0,
    ismask:true
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
  //切换
  tag(e) {
    let that = this;
    currentPage = 1,
      detail = [];
    that.setData({
      tar: e.currentTarget.dataset.index,

    })
   
  },
})