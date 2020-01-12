let avater = '';
let iv='';
let encryptedData = '';
const app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        detail_id:'',
        userid:'',
        mine:'',
      store_refund:'',
      storeId:'',
      det:'',
    },
    onLoad(options) {
      console.log(options)
      let that = this;
      if (options.id && options.userid) {
        that.setData({
          detail_id: options.id,
          userid: options.userid
        })
      }else if(options.id){
          that.setData({
            detail_id:options.id
          })
       }else if(options.userid && options.mine){
        that.setData({
          mine: options.mine,
          userid: options.userid
        })
      } else if (options.userid && options.store_refund) {
        that.setData({
          store_refund: options.store_refund,
          userid: options.userid
        })
      } else if (options.userid && options.storeid) {
        console.log('店铺id' + options.storeid)
        that.setData({
          storeId: options.storeid,
          userid: options.userid
        })
      } else if (options.det) {
        that.setData({
          det: options.det,
          userid: options.userid
        })
      } else if (options.mine) {
        that.setData({
          mine: options.mine,
         
        })
      }else if(options.userid){
        that.setData({
         
          userid: options.userid
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
                        
                        setTimeout(function () {
                          wx.request({
                            url: "https://sjg.xcx.api.xingtu-group.cn/api-sjgxcxweb/login/xcxlogin",
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
                                wx.setStorage({
                                  key: 'bangId',
                                  data: that.data.userid,
                                })
                                
                                if (res.data.data.phone == null || res.data.data.phone == '') {
                                  console.log('未绑定手机号')
                                  wx.redirectTo({
                                    url: '../bindphone/login',
                                  })
                                 
                                    // wx.redirectTo({
                                    //   url: '../good_detail/good_detail?id=' + that.data.detail_id
                                    // })
                                  
                                }else if(wx.getStorageSync('url')){
                                  console.log('-----url-----')
                                  wx.redirectTo({
                                    url: wx.getStorageSync('url'),
                                  })
                                  wx.removeStorageSync('url')
                                } else if (that.data.detail_id != '' && that.data.userid != ''){
                                  console.log(11)
                                   wx.redirectTo({
                                     url: '../good_detail/good_detail?id=' + that.data.detail_id + '&userid=' + that.data.userid,
                                   })
                                  
                                } else if (that.data.detail_id != '') {
                                  wx.redirectTo({
                                    url: '../good_detail/good_detail?id=' + that.data.detail_id
                                  })
                                } else if (that.data.userid != '' && that.data.store_refund != '') {
                                  wx.redirectTo({
                                    url: '../store_refund/store_refund?userid=' + that.data.userid
                                  })
                                } else if (that.data.userid != '' && that.data.storeId != '') {
                                  console.log('店铺')
                                  console.log(that.data.storeId)
                                  wx.redirectTo({
                                    url: '../store_detail/store_detail?id=' + that.data.storeId
                                  })
                                } else if (that.data.userid != '' && that.data.det != '') {
                                 
                                  wx.redirectTo({
                                    url: '../welfare_det/welfare_det?id=' + that.data.det +  '&userid=' + that.data.userid,
                                  })
                                } else if (that.data.mine == 11) {
                                  wx.redirectTo({
                                    url: '../order_all/order_all?id=' + 0
                                  })
                                } else if (that.data.mine == 12) {
                                  wx.redirectTo({
                                    url: '../mine_wallet/mine_wallet'
                                  })
                                } else if (that.data.mine == 13) {
                                  wx.redirectTo({
                                    url: '../members/members'
                                  })
                                } else if (that.data.mine == 14) {
                                  wx.redirectTo({
                                    url: '../mine_fund/mine_fund' 
                                  })
                                } else if (that.data.mine == 15) {
                                  wx.redirectTo({
                                    url: '../mine_collection/mine_collection'
                                  })
                                } else if (that.data.mine == 16) {
                                  wx.redirectTo({
                                    url: '../college/college'
                                  })
                                } else if (that.data.mine == 17) {
                                  wx.redirectTo({
                                    url: '../address/address'
                                  })
                                } else if (that.data.mine == 19) {
                                  wx.redirectTo({
                                    url: '../store_refund/store_refund'
                                  })
                                } else if (that.data.mine == 18) {
                                  wx.redirectTo({
                                    url: '../certification/certification'
                                  })
                                }else if (that.data.mine != ''){
                                  wx.redirectTo({
                                    url: '../e_mine/mine'
                                  })
                                } else {
                                  console.log(2)
                                  console.log(that.data.storeId)
                                  console.log(that.data.userid)
                                  wx.switchTab({
                                    url: '../e_home/home'
                                  })
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
      url: "https://sjg.api.xingtu-group.cn/app-web/login/defaultlogin",
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
  //绑定
  Bang() {
    let that = this;
    let data = {
      id: wx.getStorageSync('bangId')
    }

    app.res.req("app-web/user/sharebinduser", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })
        console.log('----绑定成功---')
        wx.removeStorageSync('bandId')
      }else if (res.status == 1028) {

      } else if (res.status == 1030) {
        wx.removeStorageSync('bandId')
        console.log('----已经绑定----')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
})