// pages/order_refund/order_refund.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      refunds:['我要退款'],
      refund:'我要退款',
    cancels: [
      { name: '不想买了' },
      { name: '地址信息填写有误，重新购买' },
      { name: '商家缺货' },
      { name: '其他原因' },
    ],
    cancel:'',
    sum:0,
    num:0,
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

 
  //申请原因
  bindcancel(e) {
    console.log(e)
    this.setData({
      cancel: this.data.cancels[e.detail.value].name
    })

  },
  bindrefund(){
    this.setData({
      refund: this.data.refunds[e.detail.value]
    })
  },
  valueChange(e){
    console.log(e.detail.value.length)
    this.setData({
      sum : e.detail.value.length
    })
  }
})