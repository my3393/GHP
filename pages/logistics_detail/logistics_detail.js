// pages/logistics_detail/logistics_detail.js
const app = getApp();
let id

Page({

  /**
   * 页面的初始数据
   */
  data: {
     tag:[
       { name: '包裹1' },
       {name:'包裹2'}
     ],
     tar:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id
   this.getDetail();
   this.getdiz();

   // const base64 = new Base64();
   //console.log(data)
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
          user: res.data
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
      title: '我是' + that.data.user.bindCityName + that.data.user.bindAreaName + '买卖' + that.data.user.bindAreaName + '特产，助力家乡发展，家乡特供平台。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  getDetail() {
    let that = this;
    let data = {
      id
    }


    app.res.req('/userorder/logisticsinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.hideLoading()

        that.setData({

          isshow: false,
          detail:res.data[0],
          details:res.data[0].details[0],
          logistics: JSON.parse(res.data[0].logisticsDetail),
          title: JSON.parse(res.data[0].logisticsDetail).result.list[0].status
        })
        console.log(that.data.logistics)
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
  getdiz() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('/userorder/detail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          diz: res.data,
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
})