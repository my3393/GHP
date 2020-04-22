// packageA/pages/receive_home/receive_home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    latitude: 22.607178,
    longitude: 113.866415,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id:options.id
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
    this.person()
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
    if (e.currentTarget.dataset.num == 0) {
      var a = []
      a.push(e.currentTarget.id)
      wx.previewImage({
        current: e.currentTarget.id,
        urls: a
      })
    } if (e.currentTarget.dataset.num == 2) {
      wx.previewImage({
        current: e.currentTarget.id,
        urls: that.data.detail.licenseImgsOSS
      })
    } else {
      wx.previewImage({
        current: e.currentTarget.id,
        urls: that.data.detail.companyImgsOss
      })
    }
  },
  get(){
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
  person(){
    let that = this
    let data = {    
      id: that.data.id
    }
    app.res.req('/sqenterprise/detail', data, (res) => {
      console.log(res.data)

   
      if (res.status == 1000) {
        that.setData({
          detail:res.data,
          longitude: Number(res.data.longitude),
          latitude: Number(res.data.latitude)
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