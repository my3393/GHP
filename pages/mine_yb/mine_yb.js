// pages/mine_yb/mine_yb.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     sjg:{
       sj:'你的'
     },
    modal5:false,
    button5: [{
      text: "晚点再去",
      type: 'gray'
    }, {
      text: "前往查看",
      type:'red'
    }],
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },
  receive(){
    wx.navigateTo({
      url: '../yb_receive/yb_receive',
    })
  },
  trun(){
     wx.navigateTo({
       url: '../yb_trun/yb_trun',
     })
  },
  sm(){
     wx.navigateTo({
       url: '../yb_sm/yb_sm',
     })
  },
  vote(){
     wx.switchTab({
       url: '../e_ welfare/e_ welfare',
     })
  },
  detail(){
     wx.navigateTo({
       url: '../yb_detail/yb_detail',
     })
  },
  hide5(){
     this.setData({
       modal5:false
     })
  },
  handleClick5(e) {
    let index = e.detail.index;
    if(index == 1){
      wx.navigateTo({
        url: '../yb_receive/yb_receive',
      })
    }
    this.hide5()
  },
  getdetail() {
    let that = this
    let data = {

    }
    app.res.req('/integral/receiverecord', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data[0].type == 0 && res.data[0].userId != res.data[0].sendUserId){
                that.setData({
                  modal5:true,
                })
         }
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