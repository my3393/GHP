// packageA/pages/union/order_detail/order_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: false,
    defalutaddres: [], //默认地址
    adress: [], //选择的地址
    inpu: '',
    loading: true,
    cancel:[
      {name:'不想买了'},
      {name:'地址填错了'},
      { name: '选错配送方式' },
      { name: '商品缺货' },
      {name:'其他原因'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getdetail()
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
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
    let that = this;
   
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
  //去店里
  go() {
 
    wx.openLocation({
      name: this.data.detail.storeAddress,

      latitude: this.data.detail.latitude,
      longitude: this.data.detail.longitude,
      scale: 18
    })
  },
  //取消订单
  bindcancel(e){
    let that = this;
    console.log(e)
    let data = {
     
    }

    app.res.req('', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          detail: res.data,
          z_price: (res.data.productMoney - res.data.deductionMoney + res.data.postageFee).toFixed(2)
        })


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //拨打电话
  phone(w){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.storePhone,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 上个页面返回刷新
  changeData: function () {

   // this.getDetail();
    //var options = { 'id': this.data.id }


  },
  //订单列表
  getdetail() {
    let that = this;

    let data = {
      id:that.data.id
    }

    app.res.req('/squserorder/detail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       
        that.setData({
          detail:res.data,
          z_price: (res.data.productMoney - res.data.deductionMoney + res.data.postageFee).toFixed(2)
        })


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  pay(e) {
    let that = this;
    let data = {
      id: that.data.id
    }

    app.res.req('/sqpay/gopay', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        app.res.req("/sqpay/xcxpay", data, (res) => {
          console.log(res.data)
          if (res.status == 1000) {
            wx.requestPayment({
              timeStamp: res.data.sign.timeStamp,
              nonceStr: res.data.sign.nonceStr,
              package: res.data.sign.package,
              signType: 'MD5',
              paySign: res.data.sign.paySign,
              success(res) {
                list = []
                that.getlist();
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 1000
                })
                // that.setData({
                //   isdelete: !that.data.isdelete,
                //   ismask: !that.data.ismask
                // })
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })

              }
            })

          } else if (res.status == 1004 || res.status == 1005) {
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