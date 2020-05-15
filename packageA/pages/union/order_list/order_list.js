// packageA/pages/union/order_list/order_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancel: [
      { name: '不想买了' },
      { name: '地址信息填写有误' },
      { name: '商家缺货' },
      { name: '其他原因' },
     
    ],
    modal:true
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
  hide() {
    this.setData({
      modal: false
    })

  },
  handclick() {
    this.hide()
    if (this.data.num == 0) {
      this.setData({
        modal2: true
      })
    } else {
      this.active()
    }

  },
  //取消
  acncel(e) {
    let that = this;
    let data = {
      id: that.data.order_id,
      cancelExplain: this.data.cancels
    }

    app.res.req('/sqstoreorder/cancel.do', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '已取消该订单',
          icon: 'none'
        })
        detail = []
        currentPage = 1
        that.getDetail()
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  bindcancel(e) {
    bubbles: true
    console.log(e)

    this.setData({
      cancels: this.data.cancel[e.detail.value].name,
      order_id: e.currentTarget.id
    })
    this.acncel()

  },
})