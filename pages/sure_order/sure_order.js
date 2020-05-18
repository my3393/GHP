// pages/sure_order/sure_order.js
const app = getApp();
let id;
let user;
let setTime = null;
let shareUserId = '';
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
    member_zk:'',
    deductionIntegral:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    id = options.id;
    this.setData({
      buyNum: options.num,
      goodId: options.goodId
    })
    this.getDetail();
    // wx.requestSubscribeMessage({
    //   tmplIds: ['gwqSviJ4QfPLJhmk5tQflU4-Fy1qH_-qIWzeyGYdhFk'],
    //   success(res) {
    //     console.log(res)
    //    }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('-监听页面初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let that = this;
    if (wx.getStorageSync('address')){
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
    }else{
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
    if (wx.getStorageSync('shareUserId')){
      wx.getStorage({
        key: 'shareUserId',
        success: function (res) {
          shareUserId=res.data
        },
      })
    }
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
    var that = this;

    return {
      title: '我是' + that.data.user.bindCityName + that.data.user.bindAreaName + '买卖' + that.data.user.bindAreaName + '特产，助力家乡发展，家乡特供平台。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  member(){
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
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("/product/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {


        that.setData({
          detail: res.data,
          spec: res.data.specificationItems,
          price: res.data.lowestPrice,
          title_img: res.data.productDefaultImgOss
        })

        if (res.data.isSpecificaton == 1){
          that.getSku();
        }else{
          that.setData({
            prices: res.data.lowestPrice * that.data.buyNum,
          })
          that.checked();
        }

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
          defalutaddresId:'',
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
      inpu: e.detail.value
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
       if (that.data.user.memberType == 0) {
         if (that.data.detail.defaultDeductionRatio == 0){
           that.setData({
             z_price: (that.data.prices + that.data.detail.expressFee).toFixed(2),
             member_p:0,
           })
         }else{
           that.setData({
             z_price: ((that.data.prices * (1 - that.data.detail.defaultDeductionRatio)) + + that.data.detail.expressFee).toFixed(2),
             member_p: (that.data.prices * that.data.detail.defaultDeductionRatio).toFixed(2),
           })
         } 
        
        }else{
         if (that.data.detail.memberDeductionRatio == 0){
           that.setData({
             z_price: that.data.prices + that.data.detail.expressFee.toFixed(2),
             member_p: 0,
           })
         }else{
           that.setData({
             z_price: ((that.data.prices * (1 - that.data.detail.memberDeductionRatio)) + that.data.detail.expressFee).toFixed(2),
             member_p: (that.data.prices  * that.data.detail.memberDeductionRatio).toFixed(2),
           })
         }
         
        
        }
        // that.setData({
        //   z_price: (that.data.prices - that.data.member_p + that.data.detail.expressFee).toFixed(2),
        //   member_zk: (that.data.prices - res.data.member3Discount * that.data.prices).toFixed(2)
        // })
        that.setData({
        
          member_zk: (that.data.prices - res.data.member3Discount * that.data.prices).toFixed(2)
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
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      return;
    }
    // that.setData({
    //   loading:!that.data.loading
    // })
    let data = {
      productId: id,
      skuId: that.data.goodId,
      buyCount: that.data.buyNum,
      addressId: that.data.addressId,
      leaveMessage: that.data.inpu,
      terminal: '小程序',
      shareUserId: shareUserId

    }
    app.res.req('/order/productsubmit', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

         wx.showLoading({
           mask:true
         })

        setTimeout(function(){
          wx.hideLoading()
          that.pays();
        },2000)
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
    app.res.req("/pay/xcxpay", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        clearInterval(setTime)
        let data = res.data
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
              url: '../pay_success/pay_success?id=' + that.data.z_price + '&isDeduction=' + data.isDeduction + '&deductionIntegral=' + data.deductionIntegral,
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
  },
  //绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "/login/xcxbindphone",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wx.getStorageSync('sessionkey')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data.data,
          })
          setTimeout(function () {
            that.pay();
          }, 1000)

        } else if (res.data.status === 103) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })

        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
        }
      }
    })
  },
  // 上个页面返回刷新
  changeData: function () {

    this.getDetail();
    //var options = { 'id': this.data.id }


  },
})