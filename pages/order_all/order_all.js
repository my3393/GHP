// pages/order_all/order_all.js
const app = getApp();
let currentPage = 1;
let orderType = 0;
let detail = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tag:[
       {name:'全部',id:'0'},
       {name:'待付款',id:'1'},
       {name:'待发货',id:'2'},
       {name:'待收货',id:'3'},
       {name:'已完成',id:'4'},
     ],
     tar:0,
     detail:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderType = options.id,
    this.setData({
      tar: options.id
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //订单详情
  order_detail(e){
     wx.navigateTo({
       url: '../order_detail/order_detail?id=' + e.currentTarget.id,
     })
  },
  getDetail() {
    let that = this;
    let data = {
      orderType:orderType,
      currentPage: currentPage
    }

    app.res.req('app-web/userorder/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        detail.push(...res.data)
        that.setData({
          detail: detail
        })
       console.log(detail)
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
  //切换
  tag(e){
    let that = this;
    orderType = e.currentTarget.dataset.index,
    currentPage = 1,
    detail = [];
    that.setData({
      tar:e.currentTarget.dataset.index,
      
    })
    this.getDetail()
  }
})