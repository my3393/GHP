// pages/solder/solder.js
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
    this.collection();
    this.collection1();
     this.collection2();

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
  detail(e){
    wx.navigateTo({
      url: '../store_detail/store_detail?id=' + e.currentTarget.id,
    })
  },
  go(e) {
    
    const latitude = Number(e.currentTarget.dataset.lat)
    const longitude = Number(e.currentTarget.dataset.lng)
    wx.openLocation({
      name: e.currentTarget.dataset.name,
     
      latitude: latitude,
      longitude: longitude,
      scale: 18
    })
  },
  //收藏店铺
  collection() {
    let that = this;
    let data = {
      storeId: 10
    }
   
      app.res.req("/store/detail", data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
           that.setData({
             store1:res.data
           })


        }  else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
  collection1() {
    let that = this;
    let data = {
      storeId: 111
    }
   
      app.res.req("/store/detail", data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          that.setData({
            store2: res.data
          })


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
  collection2() {
    let that = this;
    let data = {
      storeId: 3
    }
   
      app.res.req("/store/detail", data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          that.setData({
            store3: res.data
          })


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