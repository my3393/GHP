// packageA/pages/union/order_sure/order_sure.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     type:['商家配送','到店自提'],
     tar:0,
    address: false,
    defalutaddres: [], //默认地址
    adress: [], //选择的地址
    inpu: '',
    loading: true,
    phone:'',
    deductionIntegral: '0'
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
    let that = this;
    if (wx.getStorageSync('address')) {
      wx.getStorage({
        key: 'address',
        success: function (res) {
          console.log(res.data)
          that.setData({
            adress: res.data
          })
          that.getDefaultaddress()
        },
      })
    } else {
      that.getDefaultaddress()
      that.setData({
        adress: []
      })
    }
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    })
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
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  tag(e){
    this.setData({
      tar:e.currentTarget.dataset.num
    })
  },
  //选择地址
  choose() {
    var that = this;
    wx.navigateTo({
      url: '/pages/address/address?sex=' + 1,
    })
  },
  //获取默认地址
  getDefaultaddress() {
    let that = this;
    let data = {

    }
    app.res.req('/useraddress/defaultaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          defalutaddres: [],
          defalutaddresId: '',
        })
        if (res.data != null) {
          that.setData({
            defalutaddres: res.data,
            defalutaddresId: res.data.id,
          })
        }
      } else {

        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  // 上个页面返回刷新
  changeData: function () {

    //this.getDetail();
    //var options = { 'id': this.data.id }


  },
})