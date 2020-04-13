// pages/wallet_detail/wallet_detail.js
const app = getApp();
let detail = [];
let currentPage = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    tar: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.getHas();

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
    detail = [];
    currentPage = 1;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    detail = [];
    currentPage = 1;
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
     currentPage = currentPage + 1;
     this.getHas();
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '我是' + that.data.user.bindCityName + that.data.user.bindAreaName + '买卖' + that.data.user.bindAreaName + '特产，助力家乡发展，家乡特供平台。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  getHas() {
    let that = this;
    let data = {
      currentPage: currentPage,
      memberType:1
    }

    app.res.req("/membercard/cardrecord", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if(res.data == ''){
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }else{
          detail.push(...res.data)
          that.setData({
            detail: detail
          })
        }
       


      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        wx.navigateTo({
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