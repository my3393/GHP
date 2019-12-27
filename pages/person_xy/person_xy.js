// pages/person_name/person_name.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isact: false,
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
  name(e) {
    if (e.detail.value == '') {
      this.setData({
        isact: false
      })
    } else {
      this.setData({
        isact: true
      })
    }
    this.setData({
      name: e.detail.value
    })
  },
  submit() {
    let that = this;
    if (that.data.name == '') {
      wx.showToast({
        title: '请输入你的宣言',
        icon: 'none'
      })
    } else if (that.data.name.length < 4) {
      wx.showToast({
        title: '请输入4位以上中文的文字',
        icon: 'none'
      })
    } else {
      let data = {
        publicSlogan: that.data.name
      }

      app.res.req('app-web/user/editpublicslogan', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {

          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          this.getuser();
          setTimeout(function () {
            var pages = getCurrentPages();//当前页面栈
            if (pages.length > 1) {
              var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
              var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
              // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
              //   id: res.data.data
              // })
              beforePage.changeData();//触发父页面中的方法
            }
            wx.navigateBack({
              delta: 1
            })
          },1000)
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
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('app-web/user/info', data, (res) => {
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