// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: true,
    statusBarHeight: 0,
    titleBarHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getuser();
    this.setData({
      navH: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     let that =this;
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if(res.data.phone != null){
          var phone = that.plusXing(res.data.phone, 3, 4)
          that.setData({
            phone: phone
          })
        }
       that.setData({
         user:res.data
       })
      },
    })
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
  //会员
  member(){
    wx.navigateTo({
      url: '../members/members',
    })
  },
  //查看订单
  all(e){
    wx.navigateTo({
      url: '../order_all/order_all?id=' + e.currentTarget.id,
    })
  },
  //资助申请
  mine_fund(){
    wx.navigateTo({
      url: '../mine_fund/mine_fund',
    })
  },
  //联系客服
  phone(){
    wx.makePhoneCall({
      phoneNumber: '18818553353',
    })
  },
  //我的钱包
  wallet(){
     wx.navigateTo({
       url: '../mine_wallet/mine_wallet',
     })
  },
  //商家入驻
  store_refund(){
     wx.navigateTo({
       url: '../store_refund/store_refund',
     })
  },
  //收货地址
   address(){
     wx.navigateTo({
       url: '../address/address',
     })
   },
   //信息大码
  plusXing(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },
   //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('app-web/user/info', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })

      }
    })
  },
  onPageScroll: function (e) {
    console.log(e.scrollTop)
    let that = this
    if (e.scrollTop > 40) {
      that.setData({
        isshow: false,
      })
    } else {
      that.setData({
        isshow: true
      })
    }
  },
})