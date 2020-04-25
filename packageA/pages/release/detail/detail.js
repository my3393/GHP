// packageA/pages/post/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getdetail();
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
  //拨打电话
  phone(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定拨打该用户电话吗？',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.detail.companyPhone //仅为示例，并非真实的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //查看图片
  Preview: function (e) {
    var that = this;

    console.log(e)
   
      wx.previewImage({
        current: e.currentTarget.id,
        urls: that.data.detail.contentImgsOss
      })
  
  },
  get() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        wx.chooseLocation({
          latitude: 22.55329,
          longitude: 113.88308,
          success: (location) => {
            console.log(location);
            this.setData({
              location: `lat：${location.latitude}；long：${location.longitude}`,
              address: location.address + location.name
            })
          }
        })
      },
      fail: (err) => {
        wx.showModal({
          title: '温馨提示',
          content: '重新获取权限？',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  this.chooseLocation();
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }

          }
        })

      }
    })
  },
  getdetail() {
    let that = this
    let data = {
      id: that.data.id
    }
    app.res.req('/sqdynamic/dynamicdetail', data, (res) => {
      console.log(res.data)


      if (res.status == 1000) {
        that.setData({
          detail: res.data,
        
        })
        console.log(that.data.longitude)

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})