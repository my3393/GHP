// pages/sure_order/sure_order.js
const app = getApp();
let ids = [];
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
    inpu: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getDefaultaddress();

    let idn = options.ids

    ids = idn.split(',')
    console.log(ids)
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
        user : res.data
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
  member() {
    wx.navigateTo({
      url: '../members/members',
    })
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

    app.res.req("/product/sku", data, (res) => {
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
    console.log(ids)
    let that = this;

    var Str = JSON.stringify(ids);
    let data ={
      shopProductIdJson: Str,
    }
    // wx.request({
    //   url: "http://192.168.123.171:8080/app-web/shopcart/placeorder",
    //   data: {

    //     shopProductIdJson : Str,
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'token': wx.getStorageSync('token'),
    //   },
    //   dataType: 'json',
    //   success: function (res) {
    //     console.log(res.data.data)
    //     if (res.data.status === 100) {
    //       narea.push(...res.data.data)


    //       that.setData({
    //         narea: narea
    //       })
    //     } else if (res.data.status === 103) {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none'
    //       })
    //       wx.redirectTo({
    //         url: '/pages/login/login',
    //       })

    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // })
    app.res.req("/shopcart/placeorder", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          detail: res.data.carts,
          Price:res.data,
          member_p: (res.data.payPrice - res.data.memberPayPrice).toFixed(2)
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
  //留言
  inpu(e) {
    this.setData({
      // inpu: e.detail.value
    })
  },
  //会员折扣
  checked(e) {
    let that = this;
    let data = {

    }
    app.res.req('/member/discount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (user.memberType == 1) {
          that.setData({
            member_p:( res.data.member1Discount * that.data.prices).toFixed(2)
          })
        } else if (user.memberType == 2) {
          that.setData({
            member_p: (res.data.member2Discount * that.data.prices).toFixed(2)
          })
        } else if (user.memberType == 3) {
          that.setData({
            member_p: (res.data.member3Discount * that.data.prices).toFixed(2)
          })
        } else {
          that.setData({
            member_p: '0'
          })
        }
        that.setData({
          z_price: that.data.prices - that.data.member_p
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
    if (that.data.defalutaddres != '' && that.data.adress.length == 0) {
      that.setData({
        addressId: that.data.defalutaddres.id,
      })
      console.log(111)

    } else if (that.data.defalutaddres != '' && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(222)

    } else if (that.data.defalutaddres == '' && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(333)


    } else if (that.data.defalutaddres == '' && that.data.adress.length == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    }
    var Str = JSON.stringify(ids);
    var input = JSON.stringify(that.data.inpu)

    let data = {
      shopProductIdJson : Str,


       leaveMessageJson:input,

       terminal: 'xx',
       addressIdStr: that.data.addressId,
    }
    // wx.request({
    //   url: "http://192.168.123.171:8080/app-web/order/shopcartsubmit",
    //   data: {
    //     shopProductIdJson: Str,


    //     leaveMessageJson: that.data.inpu,

    //     terminal: 'xx',
    //     addressId: that.data.addressId,
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'json',
    //     'token':wx.getStorageSync('token')
    //   },
    //   dataType: 'json',
    //   success: function (res) {
    //     console.log(res.data.data)
    //     if (res.data.status === 100) {

    //     } else if (res.data.status === 103) {
    //       wx.redirectTo({
    //         url: '/pages/login/login',
    //       })

    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // })

    app.res.req('/order/shopcartsubmit', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if(res.data.index == 1007){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          wx.showLoading({
            mask: true
          })

          setTimeout(function () {
            wx.hideLoading()
            that.pays();
          }, 2000)
        }

      } else {

        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  //调取支付
  pays() {
    let that = this;
    let data = {

    }
    app.res.req("/pay/xcxpay", data, (res) => {
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
            if (that.data.user.memberType == 0){
              wx.redirectTo({
                url: '../pay_success/pay_success?id=' + that.data.Price.payPrice + '&isDeduction=' + res.data.isDeduction + '&deductionIntegral=' + res.data.deductionIntegral,
              })
            }else{
              wx.redirectTo({
                url: '../pay_success/pay_success?id=' + that.data.Price.memberPayPrice,
              })
            }

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
  // 上个页面返回刷新
  changeData: function () {

    this.getDetail();
    //var options = { 'id': this.data.id }


  },

})