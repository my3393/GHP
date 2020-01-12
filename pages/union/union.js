// pages/union/union.js
const app = getApp();

let currentPage = 1;
let detail = [];
let store =[];
let user = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: true,
    tag: [
      { name: '共享成员' },
      { name: '共享商家' }
    ],
    tar: 0,
    ismask:false,
    about:false,
    detail : [],
    store:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
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
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {


          user = res.data

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
     currentPage = 1;
     detail = [];
     store = [];
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this

    detail = [];
    wx.showLoading({
      title: '刷新中',
    })
    currentPage = 1;
    setTimeout(function () {

      wx.stopPullDownRefresh() //停止下拉刷新
      if (that.data.tar == 0) {
        that.getdetail()
      } else {
        store = [];
        that.getstore();
      }
    }, 200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    currentPage = currentPage + 1
    if (this.data.tar == 0) {
      this.getdetail()
    } else {
      this.getstore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '你的好友' + user.userName + '向您推荐了一个非常棒小程序，点击立即进入',
      imageUrl:'https://www.xingtu-group.cn/xcx_img/tu.png',
      path: '/pages/e_home/home?userid=' + user.id,

    }
  },
  getdetail() {
    let that = this;
    let data = {
      currentPage: currentPage
    }

    app.res.req('/user/binduserlist', data, (res) => {
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
  getstore() {
    let that = this;
    let data = {
      currentPage: currentPage
    }

    app.res.req('/user/bindstorelist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.hideLoading()
        store.push(...res.data)
        that.setData({
          store: store
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
  tag(e) {
    console.log(e)
    let that = this;

    store = [];
    currentPage = 1
    that.setData({
      tar: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 0) {
      detail = [];
      that.getdetail();
    } else {
      store = [];
      that.getstore();
    }
  },
  about(){
    this.setData({
      ismask:!this.data.ismask,
      about:!this.data.about
    })
  }
})