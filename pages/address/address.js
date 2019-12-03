// pages/address/address.js
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
     this.getDateil();
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
  add() {
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  wx_add() {
    wx.chooseAddress({
      success(res) {
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  //删除地址
  detel(e){
    let that = this;
    let data = {

    }
    app.res.req('app-web/useraddress/delete', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getDateil();
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  //设置默认
  checked(e) {
    let that = this;
    let data = {
      id:e.curr
    }
    app.res.req('app-web/useraddress/addressdetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getDateil();
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })


  },
  getDateil() {
    let that = this;
    let data = {

    }
    app.res.req('app-web/useraddress/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          if (res.data[i].isDefault == 1) {
            res.data[i].checked = true
          } else {
            res.data[i].checked = false
          }
        }
        that.setData({
          detail: res.data,

        })

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {

        wx.redirectTo({
          url: '../login/login',
        })
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
})