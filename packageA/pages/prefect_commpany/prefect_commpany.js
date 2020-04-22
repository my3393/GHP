// packageA/pages/prefect_commpany/prefect_commpany.js
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
    load: false, //
    num: 0,
    isshow: true,
    isg: true,
    audit: 3,
    post1: '../../../images/store_logo.png',
    name: '',
    ismask: true,
    ispdf: true,
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
  onLoad: function (options) {
     this.getAudit();
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
  check(e){
    let that = this;
    if (that.data.isHide){
       that.setData({
         isHide:0
       })
     }else{
      that.setData({
        isHide: 1
      })
     }
    console.log(that.data.isHide)
    let data = {
      isHide: that.data.isHide,
      id: that.data.audits.id
    }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {
      
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //手机号
  number(e) {
    let that = this;
    let data = {
      companyPhone: e.detail.value,
      id:that.data.audits.id,
      isHide: that.data.isHide,
    }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {
        that.setData({
          companyPhone: e.detail.value
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    
  },
  //业务
  yw(e){
     let that = this;
     let data ={
       companyBusiness:e.detail.value,
       id: that.data.audits.id,
       isHide: that.data.isHide,
     }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {
        that.setData({
          yw:e.detail.value
        })

      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //简介
   intor(e) {
    let that = this;
    let data = {
      companyDescribe: e.detail.value,
      id: that.data.audits.id,
      isHide: that.data.isHide,
    }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {
        that.setData({
          intor: e.detail.value
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //宣言
  xuan(e) {
    let that = this;
    let data = {
      detailAddress: e.detail.value,
      id: that.data.audits.id,
      isHide: that.data.isHide,
    }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {
        that.setData({
          detailAddress: e.detail.value
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    
  },
  home(){
    wx.navigateTo({
      url: '../receive_home/receive_home?id=' + this.data.audits.id,
    })
  },
  //删除个人照照片
  detels(e) {
    var that = this;
    console.log(e)
    console.log(that.data.imgs)

    simages.splice(e.currentTarget.dataset.index, 1)
    images.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      images: images,
      img_num: that.data.img_num - 1
    })
    console.log(simages.length)
    if (simages.length < 3) {
      that.setData({
        img_show: false
      })
    }
    that.modif_img();
    
  },
  getAudit() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      enterpriseType: 1
    }

    app.res.req('/squserenterprise/detail', data, (res) => {
      console.log(res.data)
      
      wx.hideLoading()
      if (res.status == 1000) {
        if (res.data == null) {

        } else {
          that.setData({
            audits: res.data,
            audit: res.data.auditStatus
          })
        }
        that.setData({
          load: false
        })

       that.again();
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
        that.setData({

          audit: 3
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
    simages = this.data.audits.companyImgList
    images = this.data.audits.companyImgsOss
  
    this.setData({
      name: this.data.audits.companyName,
      post1: this.data.audits.companyLogoOss,
      yw: this.data.audits.companyBusiness,
      intor: this.data.audits.companyDescribe,
      images: this.data.audits.companyImgsOss,
      isHide: this.data.audits.isHide,
      typ: this.data.audits.typeName,
      typeId: this.data.audits.typeId,
      prov: this.data.audits.provinceName,
      city: this.data.audits.cityName,
      area: this.data.audits.areaName,
      town: this.data.audits.townName,
      companyPhone: this.data.audits.companyPhone,
     
      xuan: this.data.audits.detailAddress,

      addres: this.data.audits.provinceName + '-' + this.data.audits.cityName + '-' + this.data.audits.areaName + '-' + this.data.audits.townName,
      zhao1: false,
     
     
      isprov: true,
      audit: 3,
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
  
  //图片上传
  chooseImages(e) {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // console.log(res.tempFilePaths[0]);
        var tempFilePaths = res.tempFilePaths;
        console.log(that.data.progre)
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
              images.push(datas.data.url)
              simages.push(datas.data.fileName)
              console.log(simages)
              that.setData({
                images: images,

              })
              if (simages.length == 3) {
                that.setData({
                  img_show: !that.data.img_show
                })
              }
              that.modif_img();
            }

            clearTimeout(test1);

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
        
      }
    })


  },
  //修改图片
  modif_img(){
    
    let data = {
      companyImgs: simages,
      id: this.data.audits.id,
      isHide: that.data.isHide,
    }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
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
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        wx.chooseLocation({
          latitude: 22.55329,
          longitude: 113.88308,
          success: (location) => {
            console.log(location);
            this.setData({
              location: `lat：${location.latitude}；long：${location.longitude}`,
              address: location.address + location.name,
              latitude: location.latitude,
              longitude: location.longitude
            })
            that.xuandiz();
          }

        })

        
      },
      fail: (err) => {
        wx.showModal({
          title: '温馨提示',
          content: '重新获取权限？',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  this.chooseLocation();
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }

          }
        })

      }
    })
    
  },
  xuandiz(e){
    let that = this;
    let data = {
      provinceId: province_id,
      cityId: city_id,
      areaId:area_id ,
      townId: town_id ,
      isHide: that.data.isHide,
      id: that.data.audits.id,
      longitude: that.data.longitude,
      latitude: that.data.latitude
    }
    app.res.req('/squserenterprise/updateinfo', data, (res) => {
      console.log(res.data)

      wx.hideLoading()
      if (res.status == 1000) {
       

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})