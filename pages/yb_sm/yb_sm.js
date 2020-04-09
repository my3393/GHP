// pages/yb_sm/yb_sm.js
const app = getApp();
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
          user: res.data,
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

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '我是' + that.data.user.userName + that.data.user.bindCityName + that.data.user.bindAreaName + '推广家乡特产，我为家乡代言，诚邀你的评鉴。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  sjg(){
    wx.switchTab({
      url: '../e_home/home',
    })
  },
  ylsj(){
    //娱乐世界
    wx.navigateToMiniProgram({
      appId: 'wxf556b39ee9c934b4',
      path: 'pages/my_idol/my_idol',
      extraData: {

      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })

  },
  yslm() {
    //艺赛联盟
    wx.navigateToMiniProgram({
      appId: 'wx4cef4fe6585f5bfd',
      path: 'pages/e_home/e_home',
      extraData: {

      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })

  },
  

  
})