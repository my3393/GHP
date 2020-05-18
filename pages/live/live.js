// pages/live/live.js
const time = require("../../utils/util.js");
const app = getApp();
var currentPage = 1;
let detail = [];
let pro_id =''
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    pro:'全国'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    
    if (decodeURIComponent(options.q).split('/')[4]) {

      wx.setStorageSync('bangIds', decodeURIComponent(options.q).split('/')[4])
      wx.setStorageSync('bangId', decodeURIComponent(options.q).split('/')[4])
      wx.setStorageSync('shareUserId', decodeURIComponent(options.q).split('/')[4])
      that.Bangs();
    }
    this.getdetail();
    this.getprov()
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
    if (wx.getStorageSync('bangIds')) {


      that.Bangs();
    }
    if (wx.getStorageSync('bangId')) {


      that.Bang();
    }
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
   currentPage = 1;
    pro_id=''
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    detail = []
    currentPage = 1;
    this.getdetail()
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
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
  shen(){
     wx.navigateTo({
       url: '../live_add/live_add',
     })
  },
  detail(e){
    console.log(e)
    var that = this;
    let roomId = e.currentTarget.id // 房间号
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: that.data.user.id })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })
  },
  fenx(){
    if(this.data.user.id == '' || this.data.user.id == null){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../login/login',
        })
        wx.setStorageSync('url', '../live/live')
      }, 1500)
     
    }else{
      wx.navigateTo({
        url: '../zhin/zhin?code=' + this.data.code,
      })
    }
   
  },
  //二维码
  getcode() {
    let that = this;
    let data = {

    }

    app.res.req('/qrcode/xcxliveqrcode', data, (res) => {

      if (res.status == 1000) {


        var array = wx.base64ToArrayBuffer(res.data)
        const fsm = wx.getFileSystemManager();
        const FILE_BASE_NAME = 'mine';
        const filePath = wx.env.USER_DATA_PATH + '/' + FILE_BASE_NAME + '.png';
        fsm.writeFile({
          filePath,
          data: array,
          encoding: 'binary',
          success() {
            console.log(filePath)
            that.setData({
              errormsg: '',
              code: filePath //结果图片
            })
          },
          fail() {

          },
        });



      } else if (res.status == 1002) {

      } else if (res.status == 1018 || res.status == 1005) {
        wx.showToast({
          title: '请先登录',
          icon:'none'
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: '../login/login',
          })
          wx.setStorageSync('url', '../live/live')
        },1500)
      } else if (res.status == 1024) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  getdetail(){
    let that = this;
    let data = {
      liveStatus:0,
      currentPage: currentPage,
      provinceId:pro_id
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
  type(e){
    console.log(e)
    pro_id = this.data.province[e.detail.value].id
    currentPage =1
    detail = []
    this.setData({
      pro: this.data.province[e.detail.value].name
    })
    this.getdetail();
  },
  //省
  getprov: function () {
    let that = this
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getcode();
       

        that.setData({
          province: res.data
        })

      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  //绑定
  Bang() {
    let that = this;

    let data = {
      id: wx.getStorageSync('bangId')
    }

    app.res.req("/user/sharebinduser", data, (res) => {
      console.log(res)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })

        wx.removeStorageSync('bangId')
      } else if (res.status == 1028) {
        console.log('----1028----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('bangId')
        console.log('----1030----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bangId')
        console.log('----1031----')
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '../login/login',
        })
        wx.setStorageSync('url', '../live/live')
      }
    })
  },
  //绑定
  Bangs() {
    let that = this;

    let data = {
      shareUserId: wx.getStorageSync('bangIds')
    }

    app.res.req("/membercard/scancodereceive", data, (res) => {
      console.log(res)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })

        wx.removeStorageSync('bangIds')
      } else if (res.status == 1028) {
        console.log('----1028s----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('bangIds')
        console.log('----1030s----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bangIds')
        console.log('----1031s----')
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
      wx.hideLoading()
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })
        that.setData({
          user: res.data
        })
      }
    })
  },
})