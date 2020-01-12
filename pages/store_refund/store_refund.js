// pages/store_refund/store_refund.js
var url;
const app = getApp();
let province = [];
let city = [];
let area = [];
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let zhao1 = '';
let zhao2 = '';
let zhao3 = '';
let images = [];
let simages = [];
let userid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: true, //
    num: 0,
    isshow: true,
    isg: true,
    audit: 3,
    post1: '../../images/store_logo.png',
    name: '',
    ismask: true,
    ispdf:true,
    address: true,
    prov: '',
    city: '',
    area: '',
    town: '',
    zhaos1: '',
    zhaos2: '',
    zhaos3: '',
    isprov: true,
    iscity: false,
    isqu: false,
    isjie: false,
    zhao1: true,
    zhao2: true,
    zhao3: true,
    value: '',
    addres: '',
    typ: '',
    xuan: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.getAudit();

    if (options.userid) {
      userid = options.userid
      this.Bang();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        that.setData({
          user: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //复制文本
  copy(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  downloadFile: function (e) {
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.platform == "ios") {
          _this.setData({
            ismask: !_this.data.ismask,
            ispdf: !_this.data.ispdf
          })
        } else {
          let type = e.currentTarget.dataset.type;
          let url = e.currentTarget.dataset.url;
          wx.downloadFile({
            url: url,
            success: function (res) {
              console.log(res)
              var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
              wx.openDocument({
                filePath: Path,
                success: function (res) {
                  console.log('打开文档成功')
                }
              })
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      },
    })
    console.log(e);
  },
  //取消
  cancel() {
    this.setData({
      ismask: !this.data.ismask,
      ispdf: !this.data.ispdf
    })
  },
  confirm() {
    this.setData({
      ismask: !this.data.ismask,
      ispdf: !this.data.ispdf
    })
    wx.setClipboardData({
      data: 'https://sjg.xcx.api.xingtu-group.cn/api-sjgxcxweb/file/download7',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2500,
        });
      }
    })
  },
  //删除个人照照片
  detels(e) {
    var that = this;
    console.log(e)
    console.log(that.data.imgs)


    if (e.currentTarget.dataset.num == 0) {
      that.setData({
        zhao1: true,
        zhaos1: '',
      })
      zhao1 = ''
    } else if (e.currentTarget.dataset.num == 1) {
      that.setData({
        zhao2: true,
        zhaos2: '',
      })
      zhao2 = ''
    } else if (e.currentTarget.dataset.num == 2) {
      that.setData({
        zhao3: true,
        zhaos3: '',
      })
      zhao3 = ''
    }

  },
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  //店铺名称
  names(e) {
    this.setData({
      name: e.detail.value
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
      url: '../agreement_store/agreement_store?src=' + 'https://www.xingtu-group.cn/sjg_xieyi/3_Settled_in.html',
    })
  },
  //入驻提交
  sub() {
    let that = this;
    if (that.data.post1 == '../../images/store_logo.png') {
      wx.showToast({
        title: '请上传店铺logo',
        icon: 'none'
      })
    } else if (that.data.name == '') {
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
        title: '请选择特产地址',
        icon: 'none'
      })
    } else if (that.data.xuan == '') {
      wx.showToast({
        title: '请设置你店铺的公益宣言',
        icon: 'none'
      })
    } else if (that.data.zhaos1 == '') {
      wx.showToast({
        title: '请上传特产溯源证明',
        icon: 'none'
      })
    } else if (that.data.zhaos2 == '' && that.data.typeId != 14) {
      wx.showToast({
        title: '请上传食品经营许可证',
        icon: 'none'
      })
    } else if (that.data.zhaos3 == '') {
      wx.showToast({
        title: '请上传店铺营业执照',
        icon: 'none'
      })
    } else {
      that.submit();
    }
  },
  submit() {
    let that = this;
    let data = {
      storeLogo: that.data.post1_name,
      storeName: that.data.name,
      typeId: that.data.typeId,
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
      publicSlogan: that.data.xuan,
      saleImg: zhao1,
      foodImg: zhao2,
      businessImg: zhao3,
      introduce: that.data.value,
    }

    app.res.req('/store/submitapply', data, (res) => {
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
    zhao1 = this.data.audits.saleImg;
    zhao2 = this.data.audits.foodImg;
    zhao3 = this.data.audits.storeLogo;
    this.setData({
      name: this.data.audits.storeName,
      post1_name: this.data.audits.businessImg,
      post1: this.data.audits.storeLogoOss,
      typ: this.data.audits.typeName,
      typeId: this.data.audits.typeId,
      prov: this.data.audits.provinceName,
      city: this.data.audits.cityName,
      area: this.data.audits.areaName,
      town: this.data.audits.townName,
      zhaos1: this.data.audits.saleImgOss,
      zhaos2: this.data.audits.foodImgOss,
      zhaos3: this.data.audits.businessImgOss,
      xuan: this.data.audits.publicSlogan,
      value: this.data.audits.introduce,
      addres: this.data.audits.provinceName + '-' + this.data.audits.cityName + '-' + this.data.audits.areaName + '-' + this.data.audits.townName,
      zhao1: false,
      zhao2: false,
      zhao3: false,
      isprov: true,
      audit: 3,
    })
  },
  getPhoneNumber: function(e) {
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
      success: function(res) {
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
          setTimeout(function() {
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
      grade: 1
    }

    app.res.req('/home/grade/type', data, (res) => {
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
    let data = {}

    app.res.req('/store/applyinfo', data, (res) => {
      console.log(res.data)
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
        that.getType();
        wx.hideLoading()

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        if (userid) {
          wx.navigateTo({
            url: '../login/login?store_refund=' + 1 + '&userid=' + userid
          })
        } else {
          wx.navigateTo({
            url: '../login/login?mine=' + 1
          })
        }
      } else {
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
      var test1 = setInterval(function() {
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
        var test1 = setInterval(function() {
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
            } else {
              that.setData({
                zhaos3: datas.data.url,
                zhao3: false
              })
              zhao3 = datas.data.fileName
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
        uploadTask.onProgressUpdate((res) => {

          that.setData({
            chang: res.progress
          })
          wx.showToast({
            title: that.data.chang,
            icon: 'none',
            duration: 3000,
          })
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
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
  getprov: function() {

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
  getprovs: function(e) {
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
      success: function(res) {
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
  getcity: function(e) {
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
      success: function(res) {
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
  getarea: function(e) {
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
      success: function(res) {
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
  gettown: function(e) {
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