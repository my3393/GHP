//app.js
var http = require('utils/http.js') ;
let livePlayer = requirePlugin('live-player-plugin')

App({
  data: {
    urlmall: "https://sjg.xcx.api.xingtu-group.cn/api-sjgxcxweb"
  },
  onLaunch: function () {
    // 展示本地存储能力
  
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
    // 获取用户信息
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
      //  console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '更新失败~',
              content: '请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  
  globalData: {
    navHeight: 0
  },
  //封装请求
   res: {
    req: http.req  //这里配置我们需要的方法
  },
  onShow(options) {
    // 分享卡片入口场景才调用getShareParams接口获取以下参数
    if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
      livePlayer.getShareParams()
        .then(res => {
          console.log('get room id', res.room_id) // 房间号
          console.log('get openid', res.openid) // 用户openid
          console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
          console.log('get custom params', res.custom_params) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
          console.log('绑定',res.custom_params.pid)
          wx.setStorageSync('bangId', res.custom_params.pid)
          wx.setStorageSync('shareUserId',res.custom_params.pid)
          console.log(wx.getStorageSync('bangId'),'绑定的')
        }).catch(err => {
          console.log('get share params', err)
        })
    }
  }

})