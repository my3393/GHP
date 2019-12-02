let avater = '';
let iv='';
let encryptedData = '';
const app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        saiid:''
    },
    onLoad(options) {
      console.log(options)
      let that = this;
       if(options.saiid){
          that.setData({
            saiid:options.saiid
          })
       }
      // 查看是否授权
      wx.getSetting({
        success(res) {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称

            wx.login({
              success: function (res) {
                wx.getUserInfo({
                  success: function (res) {
                    console.log(res)
                    iv = res.iv
                    encryptedData = res.encryptedData
                    avater = JSON.parse(res.rawData)
                    wx.setStorage({
                      key: 'avater',
                      data: avater,
                    })

                  }
                })
                wx.setStorage({
                  key: 'code',
                  data: res.code,
                })
                if (res.code) {
                  console.log(1)
                  console.log(res.code)
                  setTimeout(function () {
                    wx.request({
                      url: "https://yisai.xcx.1v.0.xingtu-group.cn/yisai-api-service/appcomeptition/xcx/login.do",
                      data: {
                        code: res.code,
                        nickName: avater.nickName,
                        avatarUrl: avater.avatarUrl,
                        encryptedData: encryptedData,
                        iv: iv
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      dataType: 'json',
                      success: function (res) {
                        console.log(res.data.data);
                        wx.setStorage({
                          key: 'etoken',
                          data: res.data.data.token,
                        })
                        wx.setStorage({
                          key: 'userinfo',
                          data: res.data.data.user,
                        })
                        if (res.data.data.user.phone == null ||                                                                            res.data.data.user.phone == '') {
                            wx.redirectTo({
                                url: '../bindphone/bindphone',
                            })
                        } else {
                          
                        }
                        
                      }
                    })
                  }, 500)


                }
              }
            });
          }
        }
      })
    },
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo)
        var that = this;
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 800) {
        console.log('阻断')
        return;
      }
      wx.showLoading({
        title: '登录中',
      })
        wx.getSetting({
            success(res) {
                console.log(res)
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称

                    wx.login({
                        success: function(res) {
                            wx.getUserInfo({
                                success: function(res) {
                                    console.log(res)
                                    iv = res.iv
                                    encryptedData = res.encryptedData
                                    avater = JSON.parse(res.rawData)
                                    wx.setStorage({
                                        key: 'avater',
                                        data: avater,
                                    })
                                   
                                }
                            })
                            wx.setStorage({
                                key: 'code',
                                data: res.code,
                            })
                      if (res.code) {
                        console.log(res.iv)
                        console.log(res.code)
                        setTimeout(function () {
                          wx.request({
                            url: "https://yisai.xcx.1v.0.xingtu-group.cn/yisai-api-service/appcomeptition/xcx/login.do",
                            data: {
                              code: res.code,
                              nickName: avater.nickName,
                              headimgurl: avater.avatarUrl,
                              encryptedData: encryptedData,
                              iv: iv
                            },
                            method: 'POST',
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            dataType: 'json',
                            success: function (res) {
                              console.log(res.data.data);

                              if (res.data.status == 100) {
                                wx.hideLoading()
                                wx.setStorage({
                                  key: 'etoken',
                                  data: res.data.data.token,
                                })

                                wx.setStorage({
                                  key: 'userinfo',
                                  data: res.data.data.user,
                                })
                                if (res.data.data.user.phone == null || res.data.data.user.phone == '') {
                                  wx.redirectTo({
                                    url: '../bindphone/bindphone',
                                  })
                                } else {
                                  console.log(11)
                                  if(that.data.saiid != ''){
                                    wx.redirectTo({
                                      url: '../e_detail/e_detail?id=' + that.data.saiid
                                    })
                                  }else{
                                    wx.redirectTo({
                                      url: '../e_home/e_home'
                                    })
                                  }
                                  
                                }

                              } else {
                                wx.showToast({
                                  title: res.data.msg,

                                })
                                console.log(11)
                              }
                            }
                          })
                        }, 500)
                      }
                    }
                  });
                } else {
                  that.gettoken();

                }
            }
        })
      this.setData({ tapTime: nowTime });
    },
  gettoken: function (e) {
    var that = this;

    wx.request({
      url: app.data.urlmall + "appcomeptition/default/token.do",
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          wx.setStorage({
            key: 'etoken',
            data: res.data.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data.data.user,
          })
          wx.redirectTo({
            url: '../e_home/e_home'
          })
          console.log(111)
        } else if (res.data.status === 103) {
          wx.redirectTo({
            url: '/pages/login/login',
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

  },

})