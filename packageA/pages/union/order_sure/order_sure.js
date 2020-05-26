// packageA/pages/union/order_sure/order_sure.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();

var qqmapsdk = new QQMapWX({
  key: 'PVXBZ-SXVC3-BSV3N-YN6BC-3IV45-DGF2L' // 必填
});
let storeid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     type:['商家配送','到店自提'],
     tar:0,
    address: false,
    defalutaddres: [], //默认地址
    adress: [], //选择的地址
    inpu: '',
    loading: true,
    phone:'',
    deductionIntegral: '0',
    sendType:1,
    multiArray:[],
    time:'',
    phone:'',
    remark:'',
    checked:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    storeid = options.storeid
    this.setData({
      distance:options.distance
    })
    this.getstore()
   
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
    if (wx.getStorageSync('address')) {
      wx.getStorage({
        key: 'address',
        success: function (res) {
          console.log(res.data)
          that.setData({
            adress: res.data
          })
          that.getDefaultaddress()
        },
      })
    } else {
      that.getDefaultaddress()
      that.setData({
        adress: []
      })
    }
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
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  //去店里
  go(){
    var name = this.data.store.provinceName + this.data.store.cityName + this.data.store.areaName + this.data.store.townName + this.data.store.detailAddress
    wx.openLocation({
      name:name,

      latitude: this.data.store.latitude,
      longitude: this.data.store.longitude,
      scale: 18
    })
  },
  tag(e){
    this.setData({
      tar:e.currentTarget.dataset.num,
      sendType: Number(e.currentTarget.dataset.num) + 1
    })
  },
  remark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  //计算送达时间
  calculate_time(){
    var that = this;
     var date = new Date();
     var currentHours = date.getHours(); //获取当前时间 时
    var currentMinute = date.getMinutes();//获取当前时间 秒
    var temp = [];
    var start = that.data.store.startTime.substring(0, 2)
    var end = that.data.store.endTime.substring(0,2)//截取店铺结束时间前两位
    var j = 0
    //判断当前时间是否在30分钟内
    if ( 30>currentMinute >0){
      j++
    }
    if(currentMinute >30){
      currentHours++
    }
   
      temp[0] = ["今天"];
  
    
  
    
     temp[1] = [];
    
     //每半小时累加
    for (let i = currentHours; i < end; i++) {
      var i1 = Number(i)+ 1;
      if (j % 2 == 0){
        temp[1].push(i + ':00' + '-' + i + ':30')
        j++
      }
      
      if(j % 2 != 0){
        temp[1].push(i + ':30' + '-' + i1 + ':00')
        j++
      }
     
      // i += 1;
    }
    this.setData({
      multiArray: temp,
    })
  },
  xuan_time(e){
    console.log(e)
    let temp = this.data.multiArray;
      this.setData({
        time: temp[0][e.detail.value[0]]  + temp[1][e.detail.value[1]]
      })
   
    
    
  },
  //选择地址
  choose() {
    var that = this;
    wx.navigateTo({
      url: '/pages/address/address?sex=' + 1,
    })
  },
  checked(e){
    this.setData({
      checked: !this.data.checked
    })
  },
  //店铺详情
  getstore() {
    let that = this;

    let data = {
      storeId: storeid
    }

    app.res.req('/sqproduct/storedetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store: res.data
        })
       
        that.getcart();
        that.calculate_time()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //购物车列表
  getcart() {
    let that = this;

    let data = {
      storeId: storeid
    }

    app.res.req('/sqshopcart/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        var z_price = 0;
        if (res.data == '') {
          that.setData({
            cart_num: 0,
            show2: false
          })
        } else {
          var cart_num = 0;
          for (var i in res.data) {
            //购物车价格sendFee
            if (res.data[i].promotionType == 0) {
              z_price = z_price + res.data[i].salePrice * res.data[i].buyCount
            } else {
              z_price = z_price + res.data[i].activityPrice * res.data[i].buyCount
            }
            //购物车数量

            cart_num = Number(cart_num) + Number(res.data[i].buyCount)
            that.setData({
              cart_num,
            })
          }

        }

        that.setData({
          cart: res.data,
          z_price: z_price.toFixed(2),
         
        })
        that.price()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //获取默认地址
  getDefaultaddress() {
    let that = this;
    let data = {

    }
    app.res.req('/useraddress/defaultaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          defalutaddres: [],
          defalutaddresId: '',
        })
        if (res.data != null) {
          that.setData({
            defalutaddres: res.data,
            defalutaddresId: res.data.id,
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
  // 上个页面返回刷新
  changeData: function () {

    //this.getDetail();
    //var options = { 'id': this.data.id }


  },
  //计算距离
  formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: [{
        latitude: _this.data.address.latitude,
        longitude: _this.data.address.longitude
      }], //若起点有数据则采用起点坐标，若为空默认当前地址
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
       
        console.log(dis)
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
  },
  //计算价格
  price(){
    let that = this
    if (that.data.user.memberType == 0) {
      if (that.data.store.defaultDeductionRatio == 0) {
        that.setData({
          price: (that.data.z_price + that.data.store.postageFee).toFixed(2),
          member_p: 0,
        })
      } else {
        that.setData({
          price: ((that.data.z_price * (1 - that.data.store.defaultDeductionRatio)) + +that.data.store.postageFee).toFixed(2),
          member_p: (that.data.z_price * that.data.store.defaultDeductionRatio).toFixed(2),
        })
      }

    } else {
      if (that.data.store.memberDeductionRatio == 0) {
        that.setData({
          price: that.data.z_price + that.data.store.postageFee.toFixed(2),
          member_p: 0,
        })
      } else {
        that.setData({
          price: ((that.data.z_price * (1 - that.data.store.memberDeductionRatio)) + that.data.store.postageFee).toFixed(2),
          member_p: (that.data.z_price * that.data.store.memberDeductionRatio).toFixed(2),
        })
      }


    }
  },
  pay(){
    let that = this;
    if (that.data.defalutaddres != '' && that.data.adress.length == 0) {
      that.setData({
        addressId: that.data.defalutaddres.id,
      })
      console.log(111)
      
    } else if (that.data.defalutaddres != '' && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(222)
     
    } else if (that.data.defalutaddres == '' && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(333)
     

    } else if (that.data.defalutaddres == '' && that.data.adress.length == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    }
      that.payes()
    
  },
  payes(){
    var nowTime = new Date();
    var that = this;
    if (that.data.time === '') {
      wx.showToast({
        title: '请选择送达时间',
        icon: 'none'
      })
      console.log(555)
      return
    } else if (that.data.sendType == 2 && that.data.phone == '') {
      wx.showToast({
        title: '请填写你的手机号',
        icon: 'none'
      })
      return
    } else if (that.data.sendType == 2 && that.data.checked == false) {
      wx.showToast({
        title: '请同意到店自提用户协议',
        icon: 'none'
      })
      return
    }else{
      let data = {

        storeId: storeid,
        addressId: that.data.addressId,
        remark: that.data.remark,
        sendType: that.data.sendType,
        presetTime: that.data.time,
        presetPhone: that.data.phone


      }
      app.res.req('/sqorder/submitproduct', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {

          wx.showLoading({
            mask: true
          })

          setTimeout(function () {
            wx.hideLoading()
            that.pays();
          }, 2000)
        }else if(res.status == 1002){
          wx.showToast({
            title: '超出2公里不能配送哦！可选择到店自取',
            icon:'none',
            duration:2000
          })
        } else {

          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
   
    if (nowTime - this.data.tapTime < 2000) {
      console.log('阻断')
      return;
    }
    console.log(that.data.time)
    // that.setData({
    //   loading:!that.data.loading
    // })
   
    this.setData({ tapTime: nowTime });
  },
  //调取支付
  pays() {
    let that = this;
    let data = {

    }
    app.res.req("/sqpay/xcxpay", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       // clearInterval(setTime)
        let data = res.data
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

            wx.redirectTo({
              url: '../pay_success/pay_success?id=' + that.data.price,
            })
          },
          fail(res) {
          
            wx.redirectTo({
              url: '../order_list/order_list',
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
  },
  
})