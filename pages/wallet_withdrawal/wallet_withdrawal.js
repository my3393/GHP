// pages/wallet_withdrawal/wallet_withdrawal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'0',
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      num:options.num
    })
    if(options.id){
      this.setData({
        id: options.id
      })
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
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '我是' + that.data.user.userName + that.data.user.bindCityName + that.data.user.bindAreaName + '人，推广家乡特产，我为家乡代言，诚邀你的评鉴。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  val(e){
    this.setData({
      value:e.detail.value
    })
  },
  sub(){
    console.log(this.data.value)
    let that = this;
    if (that.data.value == '' || that.data.value == 0) {
      wx.showToast({
        title: '提现金额不能为0',
        icon: 'none'
      })
      return false
    }
    if(that.data.value > that.data.num){
      wx.showToast({
        title:'当前输入金额大于可提现金额',
        icon: 'none'
      })
      return false
    }

    if (that.data.value <1) {
      wx.showToast({
        title: '提现金额需大于等于1元',
        icon: 'none'
      })
      return false
    }
    if(that.data.id){
      let data = {
        amount: that.data.value,
        storeId: that.data.id
      }


      app.res.req("/user/bindstorewithdrawal", data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '提现成功',
            duration: 3000
          })
          that.getuser();
          setTimeout(function () {
            wx.navigateBack({
              delta: 2,
            })
          }, 3000)

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
    }else{
     
      let data = {
        amount: that.data.value
      }

      app.res.req("/user/withdrawal", data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '提现成功',
            duration: 3000
          })
          that.getuser();
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 3000)

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
    }
  },
  
  all(e){
    this.setData({
      value:this.data.num
    })
  },
  //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('/user/info', data, (res) => {
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
    
})