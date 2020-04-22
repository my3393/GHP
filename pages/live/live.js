// pages/live/live.js
const time = require("../../utils/util.js");
const app = getApp();
var currentPage = 1;
let detail = []
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
   detail = [],
   currentPage = 1
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
  detail(e){
    console.log(e)
    var that = this;
    let roomId = e.currentTarget.id // 房间号
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/live/live', pid: that.data.user.id })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })
  },
  getdetail(){
    let that = this;
    let data = {
      liveStatus:0,
      currentPage: currentPage,
      provinceId:''
    }
    app.res.req('/live/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         for(var i =0; i<res.data.data.length; i++){
           var s_da = time.formatTimeTwo(res.data.data[i].startTime, 'M/D')
           var s_time = time.formatTimeTwo(res.data.data[i].startTime,'h:m')
           var e_time = time.formatTimeTwo(res.data.data[i].endTime,'h:m')
           console.log(e_time)
           console.log(res.data.data[i].endTime)
           res.data.data[i].s_date = s_da.replace('/','.')
           res.data.data[i].s_time = s_time
           res.data.data[i].e_time = e_time
         }
         detail.push(...res.data.data)
        var a = detail.reverse()
        console.log(detail)
         console.log(a)
         that.setData({
           detail:detail
         })
      } else if (res.status == 1004 || res.status == 1005) {
        wx.redirectTo({
          url: '../login/login',
        })
        wx.setStorageSync('url', '../live/live')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
})