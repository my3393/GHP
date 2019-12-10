// pages/mine_collection/mine_collection.js
const app = getApp();
let detail=[];
let store = [];
let currentPage = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: [
      { name: '商品收藏', id: '1' },
      { name: '店铺收藏', id: '2' },
    

    ],
    tar: 0,
    detail:[],
    store:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getdetail();
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
  getdetail() {
    let that = this;
    let data = {
      currentPage: currentPage
    }

    app.res.req('app-web/product/collectionlist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        detail.push(...res.data)
        that.setData({
          detail: detail
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
  getstore() {
    let that = this;
    let data = {
      currentPage: currentPage
    }

    app.res.req('app-web/store/collectionlist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        store.push(...res.data)
        that.setData({
          store: store
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
  tag(e){
    console.log(e)
    let that = this;
    
    store = [];
    currentPage = 1
    that.setData({
      tar: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 0){
      detail = [];
      that.getdetail();
    }else{
      store = [];
      that.getstore();
    }
  },
})