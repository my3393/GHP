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
     isshow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    orderType = options.id,
    wx.showLoading({
      title: '加载中',
    })
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
    let that = this;
    //获取本地用户信息
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
     detail=[];
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     let that = this
   // wx.showNavigationBarLoading() //在标题栏中显示加载
      detail = [];
      wx.showLoading({
        title: '刷新中',
      })
      currentPage = 1;
     setTimeout(function(){
      // wx.hideNavigationBarLoading() //完成停止加载
       wx.stopPullDownRefresh() //停止下拉刷新
       that.getDetail();
     },200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;

        currentPage = currentPage +1
        that.getDetail();

  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '我是' + that.data.user.bindCityName + that.data.user.bindAreaName + '买卖' + that.data.user.bindAreaName + '特产，助力家乡发展，家乡特供平台。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  //删除订单
  cance(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          let data = {
            id: e.currentTarget.id
          }

          app.res.req('/userorder/delete', data, (res) => {
            console.log(res.data)
            if (res.status == 1000) {
              detail = []
              that.getDetail();
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

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //home
  home(){
    wx.switchTab({
      url: '../e_home/home',
    })
  },
  //查看物流
  wul(e){
    wx.navigateTo({
      url: '../logistics_detail/logistics_detail?id=' + e.currentTarget.id,
    })
  },
  //订单详情
  order_detail(e){
     wx.navigateTo({
       url: '../order_detail/order_detail?id=' + e.currentTarget.id,
     })
  },
  //立即评价
  pinj(e){
     wx.navigateTo({
       url: '../order_evaluation/order_evaluation?id=' + e.currentTarget.id,
     })
  },
  //确认签收
  quer(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success(res) {
        if (res.confirm) {
          let data = {
            id: e.currentTarget.id
          }

          app.res.req('/userorder/confirmreceipt', data, (res) => {
            console.log(res.data)
            if (res.status == 1000) {
              detail = []
              that.getDetail();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  getDetail() {
    let that = this;
    let data = {
      orderType:orderType,
      currentPage: currentPage
    }

    app.res.req('/userorder/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.hideLoading()
        detail.push(...res.data)
        that.setData({
          isshow:false,
          detail: detail
        })
        wx.hideLoading()
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
  },
  pay(e) {
    let that = this;
    let data = {
      id: e.currentTarget.id
    }

    app.res.req('/pay/gopay', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        app.res.req("/pay/xcxpay", data, (res) => {
          console.log(res.data)
          if (res.status == 1000) {
            wx.requestPayment({
              timeStamp: res.data.sign.timeStamp,
              nonceStr: res.data.sign.nonceStr,
              package: res.data.sign.package,
              signType: 'MD5',
              paySign: res.data.sign.paySign,
              success(res) {
                detail = []
                that.getDetail();
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 1000
                })
                that.setData({
                  isdelete: !that.data.isdelete,
                  ismask: !that.data.ismask
                })
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