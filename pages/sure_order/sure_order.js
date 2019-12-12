// pages/sure_order/sure_order.js
const app = getApp();
let id;
let user;
let setTime = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: false,
    defalutaddres: [], //默认地址
    adress: [], //选择的地址
    inpu: '',
    loading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getDefaultaddress();
    id = options.id;
    this.setData({
      buyNum: options.num,
      goodId: options.goodId
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
    wx.getStorage({
      key: 'address',
      success: function (res) {
        console.log(res.data)
        that.setData({
          adress: res.data
        })
      },
    })
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        user = res.data

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
  //选择地址
  choose() {
    var that = this;
    wx.navigateTo({
      url: '../address/address?sex=' + 1,
    })
  },
  //规格
  getSku() {
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("app-web/product/sku", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          console.log(that.data.goodId)
          if (that.data.goodId == res.data[i].id) {
            that.setData({
              sku: res.data[i],
              prices: res.data[i].price * that.data.buyNum,
            })
            console.log(that.data.sku)
          }

        }

        that.checked();

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
  getDetail() {
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("app-web/product/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getSku();

        that.setData({
          detail: res.data,
          spec: res.data.specificationItems,
          price: res.data.lowestPrice,
          title_img: res.data.productDefaultImgOss
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
  },
  //获取默认地址
  getDefaultaddress() {
    let that = this;
    let data = {

    }
    app.res.req('app-web/useraddress/defaultaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
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
  //留言
  inpu(e) {
    this.setData({
      inpu: e.detail.value
    })
  },
  //会员折扣
  checked(e) {
    let that = this;
    let data = {

    }
    app.res.req('app-web/member/discount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (user.memberType == 1) {
          that.setData({
            member_p: (that.data.prices - res.data.member1Discount * that.data.prices).toFixed(2)
          })
        } else if (user.memberType == 2) {
          that.setData({
            member_p: (that.data.prices - res.data.member2Discount * that.data.prices).toFixed(2)
          })
        } else if (user.memberType == 3) {
          that.setData({
            member_p: (that.data.prices - res.data.member3Discount * that.data.prices).toFixed(2)
          })
        } else {
          that.setData({
            member_p: '0'
          })
        }
        that.setData({
          z_price: (that.data.prices - that.data.member_p).toFixed(2)
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
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })


  },
  pay() {
    let that = this;
    if (that.data.defalutaddres != null && that.data.adress.length == 0) {
      that.setData({
        addressId: that.data.defalutaddres.id,
      })
      console.log(111)

    } else if (that.data.defalutaddres != null && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(222)

    } else if (that.data.defalutaddres == null && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(333)


    } else if (that.data.defalutaddres == null && that.data.adress.length == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    }
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      return;
    }
    that.setData({
      loading:!that.data.loading
    })
    let data = {
      productId: id,
      skuId: that.data.goodId,
      buyCount: that.data.buyNum,
      addressId: that.data.addressId,
      leaveMessage: that.data.inpu,
      terminal: '小程序'

    }
    app.res.req('app-web/order/productsubmit', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        setTime = setInterval(function () {
          that.pays();
        }, 1000)
        setTimeout(function(){
          clearInterval(setTime)
        },8000)
      } else {

        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    this.setData({ tapTime: nowTime });
  },
  //调取支付
  pays(){
    let that = this;
    let data = {

    }
    app.res.req("app-web/pay/xcxpay", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        clearInterval(setTime)
        wx.requestPayment({
          timeStamp: res.data.sign.timeStamp,
          nonceStr: res.data.sign.nonceStr,
          package: res.data.sign.package,
          signType: 'MD5',
          paySign: res.data.sign.paySign,
          success(res) {
            
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 1000
            })
            wx.redirectTo({
              url: '../pay_success/pay_success?id=' + that.data.z_price ,
            })
          },
          fail(res) {
             wx.redirectTo({
               url: '../order_all/order_all?id=' + 0,
             })

          }
        })

      //   interval = null;

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
  },
  por(){
    this.setData({
      loading: !this.data.loading
    })
  }

})