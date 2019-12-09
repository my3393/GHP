// pages/members/members.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrls: [
      '../../images/member1.png',
      '../../images/member2.png',
      '../../images/member3.png'
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
  //购买会员
   pay(e){
     console.log(e.currentTarget.id)
     let that = this;
     let data = {
       memberType: e.currentTarget.id
     }

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
                   isdelete:!that.data.isdelete,
                   ismask:!that.data.ismask
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
})