// pages/yb_trun/yb_trun.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal:false,
    phone:'',
    modal2:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
        if(res.data.phone == '' || res.data.phone == null){
           that.setData({
             modal2:true
           })
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

  },
  handleClick5(e) {
    
   wx.redirectTo({
     url: '../bindphone/login',
   })
    
  },
  hide5() {
    wx.navigateBack({
      delat:1
    })

  },
  bindcha(e){
     this.setData({
       phone:e.detail.value
     })
  },
  hide(){
     this.setData({
       modal:!this.data.modal
     })
    console.log(this.data.modal)
  },
  cha(){
    let that = this;
    console.log(that.data.phone)
    if (that.data.phone == ''){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
      return false
    }else if (that.data.phone.length != 11){
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return false
    } else if (that.data.phone == that.data.user.phone) {
      wx.showToast({
        title: '不能转赠给自己',
        icon: 'none'
      })
      return false
    }
    let data ={
      phone:this.data.phone
    }
    app.res.req('/integral/searchphone', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.navigateTo({
          url: '../yb_zeng/yb_zeng?data=' + that.data.phone,
        })
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '../login/login',
        })
      }else if(res.status == 1003){
        that.setData({
          modal:true,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})