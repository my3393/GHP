// pages/person/person .js
const app = getApp();
let province = [];
let city = [];
let area = [];
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
     sex:[
       {id:'1',name:'男'},
       {id:'2',name:'女'}
     ],
     post1:'../../images/tx.png',
    isshow: true,
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
    college:1,
    bang_diz:'已绑定',
    publicSlogan:'请填写你的公益宣言'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
        if (res.data.userName != null) {
          that.setData({
            name: res.data.userName
          })
        }
        if (res.data.headImgUrl != null) {
          that.setData({
            post1: res.data.headImgUrl
          })
        }
        if (res.data.sex != null) {
          if(res.data.sex == 1){
            that.setData({
              sexs:'男'
            })
          }else{
            that.setData({
              sexs: '女'
            })
          }

        }
        if (res.data.birthday != null) {
          that.setData({
            day: res.data.birthday
          })
        }
        if (res.data.isCollegeStudent == 1) {
          that.setData({
            college: 0
          })
        }
        if (res.data.homeProvinceId == '' || res.data.homeProvinceId == null){

        }else{
          that.setData({
            home: res.data.homeProvinceName + '-' + res.data.homeCityName + '-' + res.data.homeAreaName + '-' + res.data.homeTownName,
          })
        }
        if (res.data.bindProvinceId == '' || res.data.bindProvinceId == null) {
          that.setData({
            bang_diz: '未绑定'
          })
        }
        if (res.data.phone == '' || res.data.phone == null) {
          that.setData({
            phone: '未绑定'
          })
        }else{
          that.setData({
            phone: res.data.phone
          })
        }
        if (res.data.publicSlogan) {
          that.setData({
            publicSlogan: res.data.publicSlogan
          })
        }
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
  //
  college(){
     if(this.data.college == 1){
       wx.navigateTo({
         url: '../college/college',
       })
     }
  },
  publicSlogan(){
    wx.navigateTo({
      url: '../person_xy/person_xy',
    })
  },
   //性别选择
   sexChange(e){

    let that = this;
    that.setData({
      sexs: that.data.sex[e.detail.value].name,
      sexid: that.data.sex[e.detail.value].id,
    })
     let data = {
       sex: that.data.sex[e.detail.value].id
     }
     console.log(this.data.day)
     app.res.req('/user/editsex', data, (res) => {
       console.log(res.data)
       if (res.status == 1000) {

         wx.showToast({
           title: '修改成功',
           icon: 'none'
         })

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
    //出生日期选择
  dayChange(e){
    console.log(e)
    this.setData({
      day:e.detail.value
    })
    let data = {
      birthday:e.detail.value
    }
    console.log(this.data.day)
    app.res.req('/user/editbirthday', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

         wx.showToast({
           title: '修改成功',
           icon:'none'
         })

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
  tx(){
    let that = this;
    let data = {
      fileName: that.data.post1_name
    }

    app.res.req('/user/editheadimgurl', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        that.getuser();
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
  //用户昵称
  name(){
    wx.navigateTo({
      url: '../person_name/person_name',
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
  getprogress() {
    let that = this;
    let data = {
    }

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
  //裁剪
  chooseimg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
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

      that.setData({
        isshow: !that.data.isshow,
        ishidden: !that.data.ishidden
      })
      wx.uploadFile({
        url: app.data.urlmall + '/oss/xcxupload', // 仅为示例，非真实的接口地址
        filePath: r,
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
            // wx.showToast({
            //   title: '上传成功',
            //   icon: 'none'
            // })
            clearTimeout(test1);

            that.setData({
              post1: datas.data.url,
              post1_name: datas.data.fileName,

            })
            that.tx();
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }

        }, fail(res) {
          wx.hideLoading();
          wx.showToast({
            title: '上传失败,请检查网络',
            icon: 'none'
          })
          clearTimeout(test1);
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
  // //刷新报名
  changeData: function () {

    //var options = { 'id': this.data.id }
    //this.onLoad(options);//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
    //this.getuser();
  },
  //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('/user/info', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })

      }
    })
  },
  diz(e) {

    this.getprov();
    this.setData({
      address: false,
      ismask: false,
      type:e.currentTarget.id
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
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  //取消弹出层
  adres_all() {
    console.log('科技破诶看见我')
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
    this.setData({ tapTime: nowTime });
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
    this.setData({ tapTime: nowTime });
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

          let a = { name: '-' }
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
    this.setData({ tapTime: nowTime });
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
      town: e.currentTarget.dataset.name,

    })
    if(that.data.type == 0){
      that.bangs();
      that.setData({
        home: that.data.prov + '-' + that.data.city + '-' + that.data.area + '-' + e.currentTarget.dataset.name,
      })
    }else{
      that.bang()
    }

  },
  bang(){
    let that = this;
    let data = {
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
    }
    app.res.req('/user/bindregion', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '绑定成功',
        })
        that.setData({
          bang_diz: '已绑定',
        })
        that.getuser();
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        console.log(1)
        wx.redirectTo({
          url: '../login/login',
        })
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //所在地
  bangs() {
    let that = this
    let data = {
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
    }
    app.res.req('/useraddress/updatehomeregion', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '绑定成功',
        })
        that.getuser();
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        console.log(1)
        wx.redirectTo({
          url: '../login/login',
        })
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})