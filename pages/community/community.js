// pages/community/community.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tar:[
       { name: '善家联盟' },
       { name: '善家服务' },
       { name:'善家驿站'},
     ],
     tas:0,
     type:[
       { typeName: '果蔬' },
       { typeName: '生鲜' },
       { typeName: '商超' },
       { typeName:'鲜花'},
     ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanner();
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
  //banner
  getbanner() {
    let that = this;
    let data = {

    }
    app.res.req('/home/banner', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.index == 1007) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }

        that.setData({
          banner: res.data,

        })
       
      } else if (res.status == 1004 || res.status == 1005) {
        console.log(1)
        wx.redirectTo({
          url: '../login/login',
        })
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  //店铺
  getdetail() {
    let that = this;
    let data = {
      isRefresh: 0
    }
    app.res.req("/home/recommend", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          recommend: res.data,

        })

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


  },
})