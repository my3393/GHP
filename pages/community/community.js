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
      //  { name:'善家驿站'},
     ],
     tas:0,
   
    address: '定位中...',
    tars:0,
    type:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    if (options.shareUserId){
       this.setData({
         shareUserId: options.shareUserId
       })
    }
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
    currentPage = 1
    detail = [];
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
       var aa = this.data.pages
       aa++
       this.setData({
         pages:aa
       })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 
  kill(e){
    wx.navigateTo({
      url: '/packageA/pages/today/seckill/seckill?id=' + e.currentTarget.id,
    })
  },
  tars(w){
    var num = w.currentTarget.dataset.index
    if(num == 1){
      wx.switchTab({
        url: '/pages/post_home/post_home',
      })
    }else if(num == 2){
      wx.showToast({
        title: '暂未开放',
        icon:'none'
      })
    }
  },
  tag(e) {
    var index = e.currentTarget.dataset.num
    detail = []
    currentPage = 1
    this.setData({
      typeId: e.currentTarget.id,
      tars: index
    })
    this.getDetail()

  },
  //店铺详情
  detail(e){
    wx.navigateTo({
      url: '/packageA/pages/store_home/store_home?id=' + e.currentTarget.id,
    })
  },
  //banner跳转
  banner(e) {
    console.log(e)
    if (e.currentTarget.dataset.xcxurl == '') {

    } else if (e.currentTarget.dataset.xcx.id == '') {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page + e.currentTarget.dataset.xcx.id,
      })
    }
  },
  //轮播
  getbanners() {
    let that = this;
    let data = {

    }
    app.res.req('/home/personalcenteradvertise', data, (res) => {

      if (res.status == 1000) {
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }

        that.setData({
          banners: res.data,

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
        that.getbanners()
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
            if (res.data.data[i].distance < 1000){
              res.data.data[i].distance = res.data.data[i].distance + "m"
            }else if (res.data.data[i].distance > 1000){
              res.data.data[i].distance = (Math.round(res.data.data[i].distance / 100) / 10).toFixed(1) + "km"
            }
            if (res.data.data[i].storeLabel){
              res.data.data[i].labels = res.data.data[i].storeLabel.split(',')
            }
           
          }
          detail.push(...res.data.data)
          that.setData({
            detail: detail,

          },res=>{
            wx.hideLoading()
           
          })
          this.getdetail()
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
  //绑定的商户
  getdetail() {
    let that = this;
    let data = {
        
    }

    app.res.req('/sqstore/bindstoreinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.data == '' && currentPage != 1) {
          wx.showToast({
            title: '已经加载完了',
            icon: 'none'
          })
        } else {
       
           
            if (res.data.storeLabel) {
              res.data.labels = res.data.storeLabel.split(',')
            }

          
         
          that.setData({
            store: res.data,

          }, res => {
            wx.hideLoading()
            that.formSubmit()
          })

        }

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
          latitude: '',
          longitude: '',
          success: (location) => {
            console.log(location);
            _this.setData({
              location: `lat：${location.latitude}；long：${location.longitude}`,
              address: location.name,
              latitude: location.latitude,
              longitude: location.longitude
            },res=>{
              detail = []
              currentPage = 1
              _this.getDetail()
            })
          
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
        },res=>{
          _this.gettype()
          _this.gethomepromotion()
          _this.gethomepromotions()
        });
       
      },
      fail: function (error) {
        console.error(error);
        _this.setData({
          modal: true
        })
        _this.gettype()
      },
      complete: function (res) {
        //console.log(res);


      }
    })
  },
  //计算绑定商户的距离
  formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      // to: e.detail.value.dest, //终点坐标

      to: [{
        latitude: _this.data.store.latitude,
        longitude: _this.data.store.longitude
      }],
      success: function (res) {//成功后的回调
        // console.log(res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        if (dis < 1000) {
          dis = dis + "m"
        } else if (dis > 1000) {
          dis = (Math.round(dis / 100) / 10).toFixed(1) + "km"

        }
        _this.setData({ //设置并更新distance数据
          distance: dis
        });

      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
})