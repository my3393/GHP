// pages/yb_zeng/yb_zeng.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   phone:'',
   valu:'',
    modal:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       phone:options.phone
     })
     this.getphone();
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
          integral: res.data.integral
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
  input(e){
    console.log(e.detail.value)
     this.setData({
       valu:e.detail.value
     })
  },
  all(){
     this.setData({
       valu: this.data.integral
     })
  },
  getphone(){
    let that = this
    let data = {
      phone: that.data.phone
    }
    app.res.req('/integral/searchphone', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         that.setData({
            detail:res.data
         })
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '../login/login',
        })
      }  else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  hide(){
      wx.redirectTo({
        url: '../mine_yb/mine_yb',
      })
  },
  sub() {
    let that = this
   
    if(that.data.valu == '' || that.data.valu == 0){
      wx.showToast({
        title: '输入艺呗值不能为空',
        icon:'none'
      })
    } else if (that.data.valu > that.data.integral) {
      wx.showToast({
        title: '输入艺呗大于当前可转赠艺呗',
        icon: 'none'
      })
    }else{
      let data = {
        receiveUserPhone: that.data.phone,
        integral: that.data.valu
      }
      app.res.req('/integral/sendintegral', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          that.setData({
            modal: true
          })
          that.getuser();
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
    }
    
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