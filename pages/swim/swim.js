// pages/swim/swim.js
const app = getApp();
let detail = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[]
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
     detail = []
     currentPage = 1;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currentPage = currentPage + 1
    this.getdetail();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getdetail() {
    let that = this;
    let data = {

      currentPage: 1,
      provinceId: '',
      cityId: '',
      areaId: '',
      townId: '',
      typeId: 14,
      sortType: 0,
      keyword: ''
    }

    app.res.req("app-web/product/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

         detail.push(...res.data)
        that.setData({
          detail: detail,

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