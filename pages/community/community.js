// pages/community/community.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
let currentPage = 1
let detail = [];
var qqmapsdk = new QQMapWX({
  key: 'PVXBZ-SXVC3-BSV3N-YN6BC-3IV45-DGF2L' // 必填
});
let keyword = '';
let type = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tar:[
       { name: '善家联盟' },
       { name: '善家服务' },
       { name:'善家驿站'},
     ],
     tas:0,
     type:[
       { typeName: '果蔬' },
       { typeName: '生鲜' },
       { typeName: '商超' },
       { typeName:'鲜花'},
     ],
    address: '定位中...',
    tars:0,
    type:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.postion()
    this.getbanner();
   
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
  tag(e) {
    var index = e.currentTarget.dataset.num
    detail = []
    currentPage = 1
    this.setData({
      typeId: e.currentTarget.id,
      tar: index
    })
    this.getDetail()

  },
  //banner
  getbanner() {
    let that = this;
    let data = {
      type:1
    }
    app.res.req('/sqhome/banner', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.index == 1007) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }

        that.setData({
          banner: res.data,

        })
       
      } else if (res.status == 1004 || res.status == 1005) {
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
  //秒杀特价
  gethomepromotion() {
    let that = this;
    let data = {
      promotionType:1,
      seckillStartTime:'',
      longitude:that.data.longitude,
      latitude:that.data.latitude
    }
    app.res.req('/sqproduct/homepromotion', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          kill: res.data,

        })

      } else if (res.status == 1004 || res.status == 1005) {
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
  gethomepromotions() {
    let that = this;
    let data = {
      promotionType: 2,
      seckillStartTime: '',
      longitude: that.data.longitude,
      latitude: that.data.latitude
    }
    app.res.req('/sqproduct/homepromotion', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          special: res.data,

        })

      } else if (res.status == 1004 || res.status == 1005) {
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
  getDetail() {
    let that = this;
    let data = {
     
      classifyId: that.data.typeId,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      currentPage: currentPage,
      keyword: keyword,
    }

    app.res.req('/sqproduct/storelist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.data == '' && currentPage != 1) {
          wx.showToast({
            title: '已经加载完了',
            icon: 'none'
          })
        } else {
          for (var i in res.data.data) {
            if (res.data.data[i].distance < 1000)
              res.data.data[i].distance = res.data.data[i].distance + "m"
            else if (res.data.data[i].distance > 1000)
              res.data.data[i].distance = (Math.round(res.data.data[i].distance / 100) / 10).toFixed(1) + "km"

          }
          detail.push(...res.data.data)
          that.setData({
            detail: detail,

          })
        }
        wx.hideLoading()
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
  gettype() {
    let that = this;
    let data = {

    }

    app.res.req('/sqstore/storeclassify', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        let type = [
          { classifyName: '全部', id: '0' }
        ]
        type.push(...res.data)
        that.setData({
          type: type,
          typeId: type[0].id
        })
        console.log(that.data.type)
        that.getDetail()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  openSetting(e) {
    this.hide()
    var _this = this
    if (e.detail.authSetting['scope.userLocation']) { //此处同上同理
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          detail = []
          currentPage = 1
          _this.postion()
        }
      })
    }



  },
  xuan() {
    let _this = this
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        wx.chooseLocation({
          latitude: 22.55329,
          longitude: 113.88308,
          success: (location) => {
            console.log(location);
            _this.setData({
              location: `lat：${location.latitude}；long：${location.longitude}`,
              address: location.name,
              latitude: location.latitude,
              longitude: location.longitude
            })
            detail = []
            currentPage = 1
            _this.getDetail()
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
  //获取当前位置
  postion() {
    let _this = this
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
       //Object格式
       
      */
      /**
       *
       //String格式
        location: '39.984060,116.307520',
      */
      // location: {
      //   latitude: res.latitude,
      //   longitude: res.longitude
      // },
      //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var mks = [];
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: './resources/placeholder.png',//图标路径
          width: 20,
          height: 20,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: res.address,
            color: '#000',
            display: 'ALWAYS'
          }
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          address: res.address_component.street,
          latitude: res.location.lat,
          longitude: res.location.lng
        });
        _this.gettype()
        _this.gethomepromotion()
        _this.gethomepromotions()
      },
      fail: function (error) {
        console.error(error);
        _this.setData({
          modal: true
        })
        _this.gettype()
      },
      complete: function (res) {
        console.log(res);


      }
    })
  },
})