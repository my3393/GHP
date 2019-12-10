let avater = '';
let iv='';
let encryptedData = '';
const app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        detail_id:''
    },
    onLoad(options) {
      console.log(options)
      let that = this;
       if(options.id){
          that.setData({
            detail_id:options.id
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
                // if (res.code) {
                //   console.log(1)
                //   console.log(res.code)
                //   setTimeout(function () {
                //     wx.request({
                //       url: "http://sjg.api.xingtu-group.cn/app-web/login/xcxlogin",
                //       data: {
                //         code: res.code,
                //         encryptedData: encryptedData,
                //         iv: iv
                //       },
                //       method: 'POST',
                //       header: {
                //         'content-type': 'application/x-www-form-urlencoded'
                //       },
                //       dataType: 'json',
                //       success: function (res) {
                //         console.log(res.data.data);
                //         wx.setStorage({
                //           key: 'token',
                //           data: res.data.token,
                //         })
                //         wx.setStorage({
                //           key: 'userinfo',
                //           data: res.data.data,
                //         })
                //         if (res.data.data.phone == null ||                                                                            res.data.data.phone == '') {
                //             wx.redirectTo({
                //                 url: '../bindphone/bindphone',
                //             })
                //         } else {
                          
                //         }
                        
                //       }
                //     })
                //   }, 500)


                // }
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
                            url: "https://sjg.api.xingtu-group.cn/app-web/login/xcxlogin",
                            data: {
                              code: res.code,                          
                              encryptedData: encryptedData,
                              iv: iv
                            },
                            method: 'POST',
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            dataType: 'json',
                            success: function (res) {
                              console.log(res.data);

                              if (res.data.status == 1000) {
                                wx.hideLoading()
                                wx.setStorage({
                                  key: 'token',
                                  data: res.data.data.token,
                                })
                                wx.setStorage({
                                  key: 'sessionkey',
                                  data: res.data.data.sessionkey,
                                })
                                wx.setStorage({
                                  key: 'userinfo',
                                  data: res.data.data,
                                })
                                if (res.data.data.phone == null || res.data.data.phone == '') {
                                  console.log('未绑定手机号')
                                  wx.redirectTo({
                                    url: '../bindphone/login',
                                  })
                                 
                                    // wx.redirectTo({
                                    //   url: '../good_detail/good_detail?id=' + that.data.detail_id
                                    // })
                                  
                                } else {
                                  console.log(11)
                                  if (that.data.detail_id != ''){
                                    wx.redirectTo({
                                      url: '../good_detail/good_detail?id=' + that.data.detail_id
                                    })
                                  }else{
                                    console.log(2)
                                    wx.switchTab({
                                      url: '../e_home/home'
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
      url: "http://sjg.api.xingtu-group.cn/app-web/login/xcxlogin",
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data.data.user,
          })
          wx.switchTab({
            url: '../e_home/home'
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