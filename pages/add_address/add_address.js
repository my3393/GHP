// pages/add_address/add_address.js
const app = getApp();
let province = [];
let city = [];
let area = [];
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let sum = 1;
let id = '';
let address;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      ismask:true,
      show:false,
      address:true,
      prov: '',
      city: '',
      area: '',
      town: '',
      isprov: true,
      iscity: false,
      isqu: false,
      isjie: false,
      names:'',
      phone:'',
      minute:'',
      town:'',
     
      checked:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
      if(options.id){
        id = options.id
         this.bian();
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
  // onShareAppMessage: function () {

  // },
  //编辑地址
  bian(){
    let that = this;
    let data = {
      id
    }
    app.res.req('app-web/useraddress/addressdetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        address = res.data
        that.bianji()
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  bianji(){
     this.setData({
       names: address.consigneeName,
       phone: address.consigneePhone,
       prov: address.provinceName,
       city: address.cityName,
       area: address.areaName,
       town: address.townName,
       minute: address.detailAddress,
       name: address.provinceName + '-' + address.cityName + '-' + address.areaName + '-' + address.townName
     })
    province_id = address.provinceId
    city_id = address.cityId
    area_id = address.areaId
    town_id = address.townId
    if (address.isDefault == 0){
         sum = 0
      this.setData({
        checked: false,
      })
    }
  },
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  check(){
    this.setData({
        checked:!this.data.checked
    })
    if(this.data.checked == true){
     
       sum=1
     
    }else{
      
        sum= 0
      
    }
  },
  names(e){
    this.setData({
      names:e.detail.value
    })
  },
  //s手机号
  phone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //详细地址
  minute(e){
    this.setData({
      minute: e.detail.value
    })
  },
  diz() {
    this.getprov();
    this.setData({
      address: false,
      ismask: false,
    })
  },
  sub(){
    var that = this;
   
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.names == '') {
      wx.showToast({
        title: '请输入收件人姓名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.town == '') {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.minute == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.phone.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }else  if (!phonetel.test(that.data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }else{
      if(id){
        let data = {
          id:id,
          consigneeName: that.data.names,
          consigneePhone: that.data.phone,
          provinceId: province_id,
          cityId: city_id,
          areaId: area_id,
          townId: town_id,
          detailAddress: that.data.minute,
          isDefault: sum
        }
        app.res.req('app-web/useraddress/edit', data, (res) => {
          console.log(res.data)
          if (res.status == 1000) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              var pages = getCurrentPages();//当前页面栈
              if (pages.length > 1) {
                var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
                var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
                // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
                //   id: res.data.data
                // })
                beforePage.changeData();//触发父页面中的方法
              }
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            console.log(111)
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }else{
        let data = {
          
          consigneeName: that.data.names,
          consigneePhone: that.data.phone,
          provinceId: province_id,
          cityId: city_id,
          areaId: area_id,
          townId: town_id,
          detailAddress: that.data.minute,
          isDefault: sum
        }
        app.res.req('app-web/useraddress/add', data, (res) => {
          console.log(res.data)
          if (res.status == 1000) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              var pages = getCurrentPages();//当前页面栈
              if (pages.length > 1) {
                var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
                var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
                // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
                //   id: res.data.data
                // })
                beforePage.changeData();//触发父页面中的方法
              }
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            console.log(111)
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }
      
     
    }
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
  adres_all(){
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
    app.res.req('app-web/region/list', data, (res) => {
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
      name: that.data.prov + '-' + that.data.city + '-' + that.data.area + '-' + e.currentTarget.dataset.name,
      address: true,
      town: e.currentTarget.dataset.name
    })
  },
})