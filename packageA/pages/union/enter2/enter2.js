// pages/store_refund/store_refund.js
const app = getApp();
let province = [];
let city = [];
let area = [];
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let latitude;
let longitude;
let userid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: false, //
    num: 0,
    isshow: true,
    isg: true,
    audit: 3,
    post1: '/images/store_logo.png',
    name: '',
    ismask: true,
    address: true,
    prov: '',
    city: '',
    area: '',
    town: '',
    isprov: true,
    iscity: false,
    isqu: false,
    isjie: false,
    value: '',
    addres: '',
    typ: '',
    xuan: '',
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getAudit();
    // this.getType()
    if (options.userid) {
      userid = options.userid
      wx.setStorageSync('bangId', userid)
      this.Bang();
    }

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
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        latitude = res.latitude
        longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
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
      title: '我是' + that.data.user.userName + +that.data.user.bindCityName + that.data.user.bindAreaName + '人平台海量老乡，欢迎特产入驻。',
      path: '/pages/store_refund/store_refund?userid=' + that.data.user.id,

    }
  },
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  //名称
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //姓名
  names(e) {
    this.setData({
      names: e.detail.value
    })
  },
  //手机号
  number(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //宣言
  xuan(e) {
    this.setData({
      xuan: e.detail.value
    })
  },
  //类型
  type(e) {
    console.log(e)
    this.setData({
      typ: this.data.type[e.detail.value].typeName,
      typeId: this.data.type[e.detail.value].id,
    })
  },

  //查看协议
  web() {
    wx.navigateTo({
      url: '../../web/web/index?src=' + 'https://www.xingtu-group.cn/sjg_xieyi/collect_yourself.html',
    })
  },
  //入驻提交
  sub() {
    let that = this;
    if (that.data.name == '') {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none'
      })
    } else if (that.data.typ == '') {
      wx.showToast({
        title: '请选择主营类型',
        icon: 'none'
      })
    } else if (that.data.addres == '') {
      wx.showToast({
        title: '请选择所在地址',
        icon: 'none'
      })
    } else if (that.data.xuan == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
    }else {
      that.submit();
    }
  },
  submit() {
    let that = this;
    let data = {
      enterpriseType: '1',
      
      companyName: that.data.name,
      legalPersonName: that.data.names,
      typeId: that.data.typeId,
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
      detailAddress: that.data.xuan,
      longitude: longitude,
      latitude: latitude,
      contactPhone: that.data.phone
    }

    app.res.req('/sqapply/subenterprise', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // that.setData({
        //   audits: res.data,
        //   audit: 2
        // })
        that.getAudit();

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
  //重新提交
  again() {
    province_id = this.data.audits.provinceId;
    city_id = this.data.audits.cityId;
    area_id = this.data.audits.areaId;
    town_id = this.data.audits.townId;
  
    this.setData({
      name: this.data.audits.companyName,
      names: this.data.audits.legalPersonName,
      typ: this.data.audits.typeName,
      typeId: this.data.audits.typeId,
      prov: this.data.audits.provinceName,
      city: this.data.audits.cityName,
      area: this.data.audits.areaName,
      town: this.data.audits.townName,
      phone: this.data.audits.contactPhone,
      
      xuan: this.data.audits.detailAddress,

      addres: this.data.audits.provinceName + '-' + this.data.audits.cityName + '-' + this.data.audits.areaName + '-' + this.data.audits.townName,
    
      isprov: true,
      audit: 3,
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "/login/xcxbindphone",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wx.getStorageSync('sessionkey')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data,
          })
          setTimeout(function () {
            that.sub();
          }, 1000)

        } else if (res.data.status === 103) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })

        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
        }
      }
    })
  },
  getType() {
    let that = this;

    let data = {

    }

    app.res.req('/sqenterprise/enterprisetype', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          type: res.data
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
  getAudit() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      enterpriseType: 1
    }

    app.res.req('/sqapply/enterpriseinfo', data, (res) => {
      console.log(res.data)
      that.getType();
      wx.hideLoading()
      if (res.status == 1000) {
        if (res.data == null) {
          that.setData({

            audit: 3
          })
        } else {
          that.setData({
            audits: res.data,
            audit: res.data.auditStatus
          })
        }
        that.setData({
          load: false
        })


      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        if (userid) {
          wx.redirectTo({
            url: '../login/login?store_refund=' + 1 + '&userid=' + userid
          })
        } else {
          wx.redirectTo({
            url: '../login/login?mine=' + 1
          })
        }
      } else if (res.status == 1035) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //去支付
  pay() {
    let that = this;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      return;
    }
    let data = {
      applyType: 2
    }
    app.res.req('/sqorder/applysubmit', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        wx.showLoading({
          mask: true
        })
        setTimeout(() => {
          wx.hideLoading()
          app.res.req("/sqpay/xcxpay", data, (res) => {
            console.log(res.data)
            if (res.status == 1000) {


              wx.requestPayment({
                timeStamp: res.data.sign.timeStamp,
                nonceStr: res.data.sign.nonceStr,
                package: res.data.sign.package,
                signType: 'MD5',
                paySign: res.data.sign.paySign,
                success(res) {

                  wx.showToast({
                    title: '支付成功',
                    icon: 'none',
                    duration: 1000
                  })
                  that.getAudit()

                },
                fail(res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none'
                  })

                }
              })

              //   interval = null;

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
        }, 2000)

      } else {

        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    this.setData({ tapTime: nowTime });
  },
  //去完善
  go() {
    wx.navigateTo({
      url: '../prefect_commpany/prefect_commpany',
    })
  },
  //绑定
  Bang() {
    let that = this;
    let data = {
      id: userid
    }

    app.res.req("/user/sharebinduser", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })


      }
      // else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {

      //   wx.showToast({
      //     title: '请先登录',
      //     icon: 'none'
      //   })
      //   if (userid) {
      //     wx.navigateTo({
      //       url: '../login/login?id=' + id + '&userid=' + userid
      //     })
      //   } else {
      //     wx.navigateTo({
      //       url: '../login/login?id=' + id
      //     })
      //   }
      // }
      else if (res.status == 1028) {

      } else if (res.status == 1030) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //特产上传
  getprogress() {
    let that = this;
    let data = {}

    app.res.req('/oss/progress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          progress: res.data
        })

        if (res.data == 100) {
          wx.hideLoading();
        } else {
          wx.showLoading({
            title: res.data + '%',
            mask: true,
          });
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
  //LOGO
  chooseImage(e) {
    var that = this;
    // id = e.currentTarget.id,
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          src: res.tempFilePaths[0],
          isshow: !that.data.isshow,
        })
      },
    })

  },
  //裁剪
  chooseimg() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          src: res.tempFilePaths[0]
        })
      },
    })
  },
  cut() {
    var that = this;
    this.selectComponent('#imgcut').cut().then(r => {
      // wx.previewImage({
      //   urls: [r],
      // })
      var test1 = setInterval(function () {
        that.getprogress();
      }, 1000)
      url = r
      that.setData({
        isshow: !that.data.isshow,
        ishidden: !that.data.ishidden
      })
      wx.uploadFile({
        url: app.data.urlmall + '/oss/xcxupload', // 仅为示例，非真实的接口地址
        filePath: url,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
          'token': wx.getStorageSync('token')
        },
        formData: {
          'token': wx.getStorageSync('token')
        },
        dataType: 'json',
        success(res) {
          let datas = JSON.parse(res.data)
          console.log(datas)
          if (datas.status == 1000) {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })

            clearTimeout(test1);
            that.setData({
              post1: datas.data.url,
              post1_name: datas.data.fileName,

            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }

        }

      })

    }).catch(e => {
      wx.showModal({
        title: '',
        content: e.errMsg,
        showCancel: false
      })
    })
  },
  //图片上传
  chooseImages(e) {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // console.log(res.tempFilePaths[0]);
        var tempFilePaths = res.tempFilePaths;
        var test1 = setInterval(function () {
          that.getprogress();
        }, 1000)
        const uploadTask = wx.uploadFile({
          url: app.data.urlmall + '/oss/xcxupload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'token': wx.getStorageSync("token")
          },
          formData: {
            // 'token': wx.getStorageSync("etoken")
          },
          // UploadTask.onProgressUpdate(function callback)
          dataType: 'json',
          success(res) {

            let datas = JSON.parse(res.data)
            console.log(datas)
            if (e.currentTarget.id == 0) {
              that.setData({
                zhaos1: datas.data.url,
                zhao1: false
              })
              zhao1 = datas.data.fileName
            } else if (e.currentTarget.id == 1) {
              that.setData({
                zhaos2: datas.data.url,
                zhao2: false
              })
              zhao2 = datas.data.fileName
            } else if (e.currentTarget.id == 2) {
              that.setData({
                zhaos3: datas.data.url,
                zhao3: false
              })
              zhao3 = datas.data.fileName
            } else if (e.currentTarget.id == 3) {
              that.setData({
                zhaos4: datas.data.url,
                zhao4: false
              })
              zhao4 = datas.data.fileName
            } else if (e.currentTarget.id == 4) {
              that.setData({
                zhaos5: datas.data.url,
                zhao5: false
              })
              zhao5 = datas.data.fileName
            }
            clearTimeout(test1);
            wx.hideLoading();
            // do something
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          },
          fail(res) {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败,请检查网络',
              icon: 'none'
            })
            clearTimeout(test1);
          }
        })

        that.setData({
          postersies: res.tempFilePaths[0]
        })
      }
    })


  },
  //勾选
  gx() {
    let that = this;
    that.setData({
      isg: !that.data.isg
    })
  },
  valueChange(e) {
    console.log(e.detail.value.length)
    this.setData({
      num: e.detail.value.length
    })
  },
  diz() {
    this.getprov();
    this.setData({
      address: false,
      ismask: false,
    })
  },
  x_prov() {
    let that = this;
    that.setData({
      isprov: true,
      iscity: false,
      isqu: false,
      isjie: false,
      tar: 1
    })
  },
  x_city() {
    let that = this;
    that.setData({
      isprov: false,
      iscity: true,
      isqu: false,
      isjie: false,
      tar: 2
    })
  },
  x_qu() {
    let that = this;
    that.setData({
      isprov: false,
      iscity: false,
      isqu: true,
      isjie: false,
      tar: 3
    })
  },
  x_jie() {
    let that = this;
    that.setData({
      isprov: false,
      iscity: false,
      isqu: false,
      isjie: true,
      tar: 4
    })
  },
  //取消弹出层
  adres_all() {
    this.setData({

      address: true,
      ismask: true,

    })
  },
  //省
  getprov: function () {

    province = []
    let that = this;
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        province.push(...res.data)

        that.setData({
          province: province
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
  // 省跳市
  getprovs: function (e) {
    var that = this;
    console.log(e)
    city = [];
    province_id = e.currentTarget.id;
    that.setData({
      prov: e.currentTarget.dataset.name,
      tas1: e.currentTarget.dataset.index,
      tas2: 999,
      tas3: 999,
      tas4: 999,
      tar: 9,

    })

    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    // 获取所有市
    wx.request({
      url: app.data.urlmall + "/region/list",
      data: {
        grade: '2',
        id: province_id,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token'),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1000) {

          city.push(...res.data.data)

          that.setData({
            citys: city,
            city: '',
            isprov: false,
            iscity: true,
            iscitys: true,
            isqu: false,
            isqus: false,
            isjie: false,
            isjies: false,

          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  // 市跳区
  getcity: function (e) {
    var that = this;
    area = []
    city_id = e.currentTarget.id;;
    that.setData({
      city: e.currentTarget.dataset.name,
      tas2: e.currentTarget.dataset.index,
      tas3: 999,
      tas4: 999,
      tar: 9
    })
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    // 获取所有区
    wx.request({
      url: app.data.urlmall + "/region/list",
      data: {
        grade: '3',
        id: city_id,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token'),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1000) {

          area.push(...res.data.data)

          that.setData({
            areas: area,
            area: '',
            iscity: false,
            isqu: true,
            isqus: true,
            isjie: false,
            isjies: false,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  // 区跳街道
  getarea: function (e) {
    var that = this;
    town = []

    area_id = e.currentTarget.id;
    that.setData({
      area: e.currentTarget.dataset.name,
      tas3: e.currentTarget.dataset.index,
      tar: 9,
      tas4: 999,
    })
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    // 获取所有区
    wx.request({
      url: app.data.urlmall + "/region/list",
      data: {
        grade: '4',
        id: area_id,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token'),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1000) {

          town.push(...res.data.data)

          let a = {
            name: '-'
          }
          town.push(a)
          that.setData({
            towns: town,
            town: '',
            isjie: true,
            isjies: true,
            isqu: false,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  //街道
  gettown: function (e) {
    var that = this;
    town = []
    console.log(e)
    town_id = e.currentTarget.id;

    that.setData({ //给变量赋值
      ismask: true,
      tas4: e.currentTarget.dataset.index,
      addres: that.data.prov + '-' + that.data.city + '-' + that.data.area + '-' + e.currentTarget.dataset.name,
      address: true,
      town: e.currentTarget.dataset.name
    })
  },
})