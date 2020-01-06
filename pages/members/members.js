// pages/members/members.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrls: [
      'https://www.xingtu-group.cn/xcx_img/member1.png',
      'https://www.xingtu-group.cn/xcx_img/member2.png',
      'https://www.xingtu-group.cn/xcx_img/member3.png'
    ],
    current: 0,
    animationData: {},
    animationData2: {},
    Img:'../../images/member_b.png',
    ismask:true,
    isdelete:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Detail();
    this.stretch(330)
    this.setData({
      navH: app.globalData.navHeight
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
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.data.phone != null) {
          var phone = that.plusXing(res.data.phone, 3, 4)
          that.setData({
            phone: phone
          })
        }
        if (res.data.memberType == 2){
          that.setData({
            current: 1,

          })
        } else if (res.data.memberType == 3) {
          that.setData({
            current: 2,

          })
        }
        that.setData({
          user: res.data,
         
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
  web(){
     wx.navigateTo({
       url: '../agreement_store/agreement_store?src=' + 'https://www.xingtu-group.cn/sjg_xieyi/6_VIP.html',
     })
  },
  navBack(){
     wx.navigateBack({
       data:1
     })
  },
  //绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
  
    wx.request({
      url: app.data.urlmall + "app-web/login/xcxbindphone",
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
            data: res.data,
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
  //购买会员
   pay(e){
     console.log(e.currentTarget.id)
     let that = this;
     let data = {
       memberType: e.currentTarget.id
     }
     if(that.data.user.memberType == 0){
       app.res.req('app-web/order/membersubmit', data, (res) => {
         console.log(res.data)
         if (res.status == 1000) {
           app.res.req("app-web/pay/xcxpay", data, (res) => {
             console.log(res.data)
             if (res.status == 1000) {

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
     }else{
       wx.showToast({
         title: '你已开通会员',
         icon:'none'
       })
     }
    
   },
  //会员详情
  Detail(){
    let that = this;
    let data = {
    
    }

    app.res.req('app-web/member/info', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          detail: res.data
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
  change(e) {
    console.log(e.detail.current)
    this.setData({
      current: e.detail.current
    })
    this.stretch(350)

    this.shrink(300)
  },
  // 收缩
  stretch(h) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(h).step()
    this.setData({
      animationData: animation.export(),
    })
  },
  // 展开
  shrink(h) {
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.height(h).step()
    this.setData({
      animationData2: animation2.export()
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
})