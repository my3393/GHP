// pages/order_detail/order_detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     cancel:[
       { name: '不想买了' },
       { name: '地址信息填写有误，重新购买' },
       { name: '商家缺货' },
       {name:'其他原因'},
     ],
     isdelete:true,//删除订单
     ismask:true,
    isqianshou:true,//确认签收

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
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
  //取消原因
  bindcancel(e){
    console.log(e)
    this.setData({
      cance:this.data.cancel[e.detail.value].name
    })
    
  },
  //删除订单
  delete(){
    this.setData({
      isdelete:!this.data.isdelete,
      ismask:!this.data.ismask,
    })
  },
  cancel_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask,
    })
  },
  confirm_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask,
    })
  },
  //退款
  refund(){
    wx.navigateTo({
      url: '../order_refund/order_refund',
    })
  }
})