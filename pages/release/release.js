// pages/realease/release.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

var qqmapsdk = new QQMapWX({
  key: 'PVXBZ-SXVC3-BSV3N-YN6BC-3IV45-DGF2L' // 必填
});
var qqmapsdk;
const app = getApp();
let province = [];
let city = [];
let area = [];
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let images = [];
let simages = [];
let zhao1 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    ismask: true,
    simage:[],
    address: true,
    prov: '',
    city: '',
    area: '',
    town: '',
    phone: '',
    intor:'',
    typeId: '',
    isprov: true,
    iscity: false,
    isqu: false,
    isjie: false,
    zhao1: true,
    addres:'',
    titer:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   this.getType();
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
      success: function (res) {
        that.setData({
          user: res.data,
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
     images = [];
     simages = [];
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
  mine(){
    wx.navigateTo({
      url: '/packageA/pages/release/mine/mine' ,
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
  //简介
  intor(e) {
    let that = this;
    this.setData({
      intor: e.detail.value
    })
  },
  //简介
  titer(e) {
    let that = this;
    this.setData({
      titer: e.detail.value
    })
  },
  //手机号
  number(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //详细
  xuan(e){
    let that = this
    this.setData({
      xuan: e.detail.value
    })
    if (that.data.town) {
      that.setData({
        result: that.data.prov + that.data.city + that.data.area + that.data.town + that.data.xuan,
      })
      that.postion();
    }
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
    }else{
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
    }


   

  },
  //入驻提交
  sub() {
    let that = this;
    if (that.data.titer == '') {
      wx.showToast({
        title: '请描述下你的技能',
        icon: 'none'
      })
    }else if (that.data.intor == '') {
      wx.showToast({
        title: '请描述下你的技能',
        icon: 'none'
      })
    } else if (zhao1 == '') {
      wx.showToast({
        title: '请上传封面',
        icon: 'none'
      })
    } else if (simages == '') {
      wx.showToast({
        title: '请上传图片',
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
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none'
      })
    } else if (that.data.typeId == '') {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
    }   else {
      if (that.data.user.memberType == 0){
        that.submit();
      }else{
        that.submits();
      }
      
    }
  },
  submit() {
    let that = this;
    let data = {
      phone: that.data.phone,
      typeId: that.data.typeId,
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
      detailAddress: that.data.xuan,
      contentImgs: simages,
      content: that.data.intor,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      
    }

    app.res.req('/sqorder/submitdynamic', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         wx.showLoading({
           title: '',
           icon:'none'
         })
         that.pay();

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
  submits() {
    let that = this;
    let data = {
      phone: that.data.phone,
      typeId: that.data.typeId,
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
      detailAddress: that.data.xuan,
      contentImgs: simages,
      content: that.data.intor,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      cover:zhao1,
      title:that.data.titer
    }

    app.res.req('/sqdynamic/submitdynamic', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

         wx.showToast({
           title: '提交成功请等待审核',
           icon:'none'
         })
         setTimeout(()=>{
             wx.switchTab({
               url: '../post_home/post_home',
             })
         },1500)

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

    }

    app.res.req('/sqdynamic/dynacmictype', data, (res) => {
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
  //去支付
  pay() {
    let that = this;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      return;
    }
    let data ={

    }
    app.res.req("/sqpay/xcxpay", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        wx.hideLoading()
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

            setTimeout(() => {
              wx.switchTab({
                url: '../post_home/post_home',
              })
            }, 1500)

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
    this.setData({
      tapTime: nowTime
    });
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
        uploadTask.onProgressUpdate((res) => {
          that.setData({
            progre: res.progress
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
  diz() {
    this.getprov();
    this.setData({
      address: false,
      ismask: false,
    })
  },
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
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
    if(that.data.xuan){
      that.setData({
        result: that.data.prov + that.data.city + that.data.area + that.data.town + that.data.xuan ,
      })
      that.postion();
    }
   
  },
  postion(){
    var _this = this
    qqmapsdk.geocoder({
      //获取表单传入地址
      address:_this.data.result , //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          markers: [{
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: './resources/placeholder.png',//图标路径
            width: 20,
            height: 20,
            callout: { //可根据需求是否展示经纬度
              content: latitude + ',' + longitude,
              color: '#000',
              display: 'ALWAYS'
            }
          }],
       
            latitude: latitude,
            longitude: longitude
          
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  }
})