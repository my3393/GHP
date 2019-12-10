// pages/apply_fund/apply_fund.js
var url;
const app = getApp();
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let zhao1 = '';
let images = [];
let simages = [];
let num = '';
let nums = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
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
    zhao1:true,
    img_num:0,
    img_show:false,
    num:0,
    nums:0,
    type:[
      {name:'个人'},
      {name:'学校'},
      {name:'企业'},
      {name:'政府'},
    ],
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
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  //项目标题
  title(e){
    this.setData({
      title:e.detail.value
    })
 },
  //目标金额
  menoy(e){
     this.setData({
       menoy:e.detail.value
     })
  },
  //申请人
  name(e){
    this.setData({
      name:e.detail.value
    })
 },
 //手机号码
 phone(e){
  this.setData({
    phone:e.detail.value
  })
},
  //困难
  difficult(e){
    this.setData({
      xuan:e.detail.value
    })
  },
  //主体
  type(e){
     console.log(e)
     this.setData({
       typ: this.data.type[e.detail.value].name,

     })
  },
  //困难描述
  valueChange(e) {
    console.log(e.detail.value.length)
    this.setData({
      num: e.detail.value.length
    })
    num =  e.detail.value
  },
  valueChanges(e) {
    console.log(e.detail.value.length)
    this.setData({
      nums: e.detail.value.length
    })
    nums =  e.detail.value
  },
  //提交
  submit() {
    let that = this;
    let data = {
      projectTitle:that.data.title,
      targetAmount: that.data.menoy,
      applyName: that.data.name,
      applyUserPhone: that.data.phone,
      applyBody: that.data.typ,
      provinceId: province_id,
      cityId: city_id,
      areaId: area_id,
      townId: town_id,
      qualificationImg: zhao1,
      infoImgs: simages,
      projectExplain: num,
      introduce: nums,
    }

    app.res.req('app-web/project/subapply', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '提交成功，请等待审核',
          icon:'none',
          duration:2000
        })
        setTimeout(function(){
          wx.navigateBack({
            data: 1
          })
        },2000)
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
   getType(){
     let that = this;
     let data = {
     }

     app.res.req('app-web/home/classify', data, (res) => {
       console.log(res.data)
       if (res.status == 1000) {
         that.setData({
           type:res.data
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
        wx.showLoading();
        const uploadTask = wx.uploadFile({
          url: app.data.urlmall + 'app-web/oss/xcxupload', // 仅为示例，非真实的接口地址
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
              that.setData({
                images:images,
                img_num:images.length
              })
              if (simages.length == 9) {
                that.setData({
                  img_show: !that.data.img_show
                })
              }
            }
            wx.hideLoading();
            // do something
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          }
        })
        uploadTask.onProgressUpdate((res) => {
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
  //省
  getprov: function () {


    let that = this;
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('app-web/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          province:res.data
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
      url: app.data.urlmall + "app-web/region/list",
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

          that.setData({
            citys: res.data.data,
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
      url: app.data.urlmall + "app-web/region/list",
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
          that.setData({
            areas: res.data.data,
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
      url: app.data.urlmall + "app-web/region/list",
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
      town: e.currentTarget.dataset.name
    })
  },
})