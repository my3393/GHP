// pages/pay_success/pay_success.js
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
     console.log(options)
     this.setData({
       menoy:options.id
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
  chak(){
    wx.navigateTo({
      url: '../order_all/order_all?id=' + 0,
    })
  },
  home(){
    wx.switchTab({
      url: '../e_home/home',
    })
  }
  
  
})