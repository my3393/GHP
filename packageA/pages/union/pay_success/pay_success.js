// pages/pay_success/pay_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deductionIntegral: 0,
    isDeduction: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.isDeduction == 1) {
      this.setData({
        deductionIntegral: options.deductionIntegral,
        isDeduction: options.isDeduction
      })
    }
    this.setData({
      menoy: options.id
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
  chak() {
    wx.navigateTo({
      url: '../order_list/order_list',
    })
  },
  home() {
    wx.switchTab({
      url: 'pages/community/community',
    })
  }


})