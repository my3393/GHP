// pages/union/union.js
const app = getApp();

let currentPage = 1;
let detail = [];

let user = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: true,
    detail: [],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
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
     
        that.getdetail()
    
    }, 200)
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
      title: '你的好友' + user.userName + '向您推荐了一个非常棒小程序，点击立即进入',
      imageUrl: 'https://www.xingtu-group.cn/xcx_img/tu.png',
      path: '/pages/e_home/home?userid=' + user.id,

    }
  },
  
  detail(e) {
    let that = this;
    let data = {
      currentPage: currentPage,
      id: e.currentTarget.id
    }

    app.res.req('/user/bindusernextlist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data == '') {
          wx.showToast({
            title: '该用户下没有绑定用户',
            icon: 'none'
          })
        } else {

        }
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
  getdetail() {
    let that = this;
    let data = {
      currentPage: currentPage,
      id:that.data.id
    }

    app.res.req('/user/bindusernextlist', data, (res) => {
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