// pages/refund_schedule/refund_schedule.js
const app = getApp();
let id;
let top_1;
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
     id = options.id
     this.setData({
       orderNo: options.orderNo
     })
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
  getDetail() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('/userorder/refundprogress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        top_1 = res.data.splice(0, 1)[0]
        console.log(res.data)
        console.log(top_1)
        that.setData({
          top_1:top_1,
          detail: res.data,
          title: top_1.title
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