var QQMapWX = require('/../../utils/qqmap-wx-jssdk.min.js');

var qqmapsdk = new QQMapWX({
  key: 'PVXBZ-SXVC3-BSV3N-YN6BC-3IV45-DGF2L' // 必填
});

const app = getApp();
let province = [];
let city = [];
let area = [];
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';

Component({
  externalClasses: ['address-class'], //自定义样式
  
  properties: {
    //primary,warning,green,danger,white，black，gray
    type: {
      type: String,
      value: 'primary',
    },
     
  },
  data: {
    ismask: true,
   
    address: true,
    prov: '',
    city: '',
    area: '',
    town: '',
  },
  methods: {
    //取消
    detel() {
      this.setData({
        address: true,
        ismask: true,
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
      if (that.data.xuan) {
        that.setData({
          result: that.data.prov + that.data.city + that.data.area + that.data.town + that.data.xuan,
        })
        that.postion();
      }
    },
    postion() {
      var _this = this
      console.log(_this.data.result)
      qqmapsdk.geocoder({
        //获取表单传入地址

        address: _this.data.result, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
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
          if (res.status == '347') {
            wx.showToast({
              title: '该地址不存在请重新输入',
              icon: 'none'
            })
          }
        }
      })
    }
  }
})