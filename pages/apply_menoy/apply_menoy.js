// pages/apply_menoy/apply_menoy.js
let id;
const app = getApp();
let status;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'0.00',
    isshow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       id = options.id
       status = options.status
       this.setData({
         num:options.money
       })
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
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })

      }
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
      path: '/pages/e_home/e_home?userid=' + that.data.user.id,

    }
  },
  tix(){
    if(status == 3){
      wx.navigateTo({
        url: '../apply_withdrawal/apply_withdrawal?id=' + id + '&money=' + this.data.num ,
      })
    }else{
      wx.navigateTo({
        url: '../apply_with_one/apply_with_one?id=' + id,
      })
    }
  },

  

})