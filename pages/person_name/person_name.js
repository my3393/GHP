// pages/person_name/person_name.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isact:false,
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
  name(e){
    if(e.detail.value == ''){
      this.setData({
         isact:false
      })
    }else{
      this.setData({
        isact: true
      })
    }
    this.setData({
      name:e.detail.value
    })
  },
  submit(){
    let that =this;
    if(that.data.name == ''){
      wx.showToast({
        title: '请输入名字',
        icon:'none'
      })
    } else if (that.data.name.length > 8 || that.data.name.length < 2){
      wx.showToast({
        title: '请输入2~8位中文或英文的昵称',
        icon: 'none'
      })
    }else{
      let data = {
        userName: that.data.name
      }

      app.res.req('app-web/user/editusername', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {

          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            delat: 2
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
    }
  }
})