// pages/order_complaints_d/order_complaints_d.js
const app = getApp();
let id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischexiao:true,
    ismask:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     id = options.id
     this.getDetail();
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
  jind(){
    wx.navigateTo({
      url: '../order_complaints_s/order_complaints_s?id=' + id + '&orderNo=' + this.data.detail.orderNo,
    })
  },
  //
  submit(){
    var schoolStr = JSON.stringify(simages);
    let data = {
      id: id,
      complaintReason: '撤销投诉',
      complaintExplain: '撤销投诉',
      complaintImgJson: '',
      complaintType:1
    }

    app.res.req('/userorder/complaint', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '投诉成功',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 2000)

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  getDetail() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('/userorder/suborderdetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          detail: res.data,

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
})