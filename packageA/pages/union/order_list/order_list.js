// packageA/pages/union/order_list/order_list.js
const app = getApp();
var currentPage =1;
let list =[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancel: [
      { name: '不想买了' },
      { name: '地址填错了' },
      { name: '选错配送方式' },
      { name: '商品缺货' },
      { name: '其他原因' },
    ],
    modal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getlist()
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
   list =[]
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
  detail(e){
    wx.navigateTo({
      url: '../order_detail/order_detail?id=' + e.currentTarget.id,
    })
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
  //订单列表
  getlist() {
    let that = this;

    let data = {
      currentPage,
    }

    app.res.req('/squserorder/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        list.push(...res.data.data)
        that.setData({
          list: list
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
      id: e.currentTarget.id
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