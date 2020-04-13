// pages/members/members.js
const app = getApp();
let userid;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrls: [
      'https://www.xingtu-group.cn/xcx_img/member1.png',
      

    ],
    modal4:false,
    current: 0,
    animationData: {},
    animationData2: {},
    Img:'../../images/member_b.png',
    ismask:true,
    isdelete:true,
    load:true,
    modal:false,
    modal2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',

    })
    this.Detail();
    
    this.stretch(330)
    this.setData({
      navH: app.globalData.navHeight
    })
    if(options.userid){
      userid = options.id
      wx.setStorageSync('bangId', userid)
    }
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
    this.getnum();
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
        if (res.data.bindProvinceId == null || res.data.bindProvinceId == '' || res.data.homeProvinceId == null || res.data.homeProvinceId == ''){
               that.setData({
                 modal4:true,
               })
        }
        if (wx.getStorageSync('bangId')) {

          that.Bang();
        }
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
    var that = this;
    return {
      title: '你的好友' + user.userName + '向您推荐了一个非常棒小程序，点击立即进入',
      imageUrl: 'https://www.xingtu-group.cn/xcx_img/tu.png',
      path: '/pages/member/member?userid=' + that.data.user.id,

    }
  },
  jihuo(){
    this.setData({
      modal:true,
    })
  },
  //资产
  zic(){
     wx.navigateTo({
       url: '../mine_assets/mine_assets',
     })
  },
  //转赠
  zhuanz(){
    wx.navigateTo({
      url: '../assets_expel/assets_expel',
    })
  },
  //明细
  minx(){
   wx.navigateTo({
     url: '../assets_mx/assets_mx',
   })
  },
  hide4() {
    this.setData({
      modal4: false
    })

  },
  hide() {
    this.setData({
      modal: false
    })

  },
  handclick(){
    if (this.data.num == 0) {
      this.setData({
        modal2: true
      })
    } else {
      this.active()
    }
    this.hide()
  },
  hide2() {
    this.setData({
      modal2: false
    })

  },
  handclick2(e) {
    this.setData({
      memberType: 1
    })
    this.pay()
    
    this.hide2()
  },
  handleClick4(e) {
    let index = e.detail.index;
    if (index == 1) {
      wx.navigateTo({
        url: '../person/person',
      })
    } else {
      wx.navigateBack({
        delat: 1
      })
    }
    this.hide4()
  },
  //思维
  member_sw(e){
    var a = []
    console.log(e.currentTarget)
    a.push(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id,
      urls: a
    })
  },
  web(){
     wx.navigateTo({
       url: '../agreement_store/agreement_store?src=' + 'https://www.xingtu-group.cn/sjg_xieyi/6_VIP.html',
     })
  },
  navBack(){
    if(userid){
      wx.switchTab({
        url: '../e_home/home',
      })
    }else{
      wx.navigateBack({
        data: 1
      })
    }
  },
  //立即分销
  confirm_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask:!this.data.ismask
    })
    wx.switchTab({
      url: '../e_home/home',
    })
  },
  cancel_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask
    })
    wx.switchTab({
      url: '../e_home/home',
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
     let that = this
     if(e){
       this.setData({
         memberType: e.currentTarget.id
       })
     }
     
    
     let data = {
       memberType: that.data.memberType
     }
     if(that.data.user.memberType == 0){
       app.res.req('/order/membersubmit', data, (res) => {
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
   //张数
   getnum() {
    let that = this;
    let data = {
      memberType:1
    }

      app.res.req('/membercard/findcardnum', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         that.setData({
           num:res.data
         })
         
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //激活会员卡
  active() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/activatecard', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       
         that.getuser();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //会员详情
  Detail(){
    let that = this;
    let data = {

    }

    app.res.req('/member/info', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.hideLoading()
        that.setData({
          detail: res.data,
          load:false
        })

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '../login/login?userid=' + userid,
        })
        wx.setStorageSync('url', '../members/members')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //绑定
  Bang() {
    let that = this;
    let data = {
      id: wx.getStorageSync('bangId')
    }

    app.res.req("/user/sharebinduser", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })
        console.log('----绑定成功---')
        wx.removeStorageSync('bandId')
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '../login/login?userid=' + that.data.user.id,
        })
        wx.setStorageSync('url', '../member/member')
      } else if (res.status == 1028) {

      } else if (res.status == 1030) {
        wx.removeStorageSync('bandId')
        console.log('----已经绑定----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bandId')
        console.log('----已经绑定----')
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
  //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('/user/info', data, (res) => {
      console.log(res.data)
      wx.hideLoading()
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })
        that.setData({
          user: res.data,

        })

      }
    })
  },
})