// pages/search/search.js
const app = getApp();
let keyword;
let currentPage=1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
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
  navBack(){
    wx.navigateBack({
      data:1
    })
  },
  //搜索
  value(e){
    keyword = e.detail.value
    if (keyword == ''){

    }else{
      this.getdetail()
      this.getStore();
    }
    
  },
  //搜索店铺
  getStore() {
    let that = this;
    let data = { 
      currentPage: currentPage,
      keyword: keyword,
    }

    app.res.req("app-web/store/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store: res.data
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
  //商品详情
  good(e){
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.id,
    })
  },
  //店铺详情
  store(e) {
    wx.navigateTo({
      url: '../store_detail/store_detail?id=' + e.currentTarget.id,
    })
  },
  //搜索商品
  getdetail() {
    let that = this;
    let data = {
      currentPage: currentPage,
      keyword: keyword,
      provinceId:'',
        cityId:'',
      areaId:'',
        townId:'',
      classifyId:'',
        typeId:'',
      sortType:0
    }

    app.res.req("app-web/product/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          detail: res.data
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