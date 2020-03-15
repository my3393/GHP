// pages/apply_bind/apply_bind.js
const app = getApp();
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:[
      { name: '中国银行' },
      { name: '中国建设银行' },
      { name: '中国农业银行' },
      { name: '中国工商银行' },
      { name: '招商银行' },
      { name: '光大银行' },
      { name: '民生银行' },
      { name: '浦发银行' },
      { name: '交通银行' },
      { name: '平安银行' },
    ],
    isdelete: false,
    ismask:false,
    address: true,
    prov: '',
    city: '',
    area: '',
    town: '',
    typ:'',
    addres:'',
    minute:'',
    phone:'',
    name:'',
    card:'',
    isprov: true,
    iscity: false,
    isqu: false,
    isjie: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
      id = options.id
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
  name(e){
    this.setData({
      name: e.detail.value
    })
  },
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  card(e) {
    this.setData({
      card: e.detail.value
    })
  },
  //详细地址
  minute(e) {
    this.setData({
      minute: e.detail.value
    })
  },
  //类型
  type(e) {
    console.log(e)
    this.setData({
      typ: this.data.type[e.detail.value].name,

    })
  },
  //提现提交
  sub(){
    let that = this;
    if (that.data.typ == '') {
      wx.showToast({
        title: '请选择所属银行',
        icon: 'none'
      })
    } else if (that.data.addres == '') {
      wx.showToast({
        title: '请选择开户所在地',
        icon: 'none'
      })
    } else if (that.data.minute == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请输入卡号',
        icon: 'none'
      })
    } else if (that.data.name == '') {
      wx.showToast({
        title: '请输入持卡人姓名',
        icon: 'none'
      })
    } else if (that.data.card == '') {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none'
      })
    }else{
      that.submit();
    }
  },
  submit(){
    let that =this;
    let data = {
      projectId:id,
      bankCard: that.data.typ,
      openBank: that.data.addres,
      bankDetailAddress: that.data.minute,
      bankCardNo:that.data.phone,
      cardholder:that.data.name,
      identityNo:that.data.card,
    }
    app.res.req('/userproject/submitbankinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '提交成功',
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
  },
  cancel() {
    wx.navigateBack({
      data: 1
    })
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask
    })
  },
  confirm() {
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask
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
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  //省
  getprov: function () {


    let that = this;
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          province: res.data
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
      town: e.currentTarget.dataset.name
    })
  },

})