// pages/order_detail/order_detail.js
var util = require('../../utils/util.js');
const app = getApp();
let id;
let detail = [];
let time;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     cancel:[
       { name: '不想买了' },
       { name: '地址信息填写有误，重新购买' },
       { name: '商家缺货' },
       {name:'其他原因'},
     ],
     isdelete:true,//删除订单
     ismask:true,
    isqianshou:true,//确认签收
    member_p:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
     id = options.id;
     time = util.formatTime(new Date());
     console.log(time)
     this.getDetail();
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
  //商品详情
  good_detail(e) {
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.id,
    })
  },
  //进入店铺
  store(e) {

    wx.navigateTo({
      url: '../store_detail/store_detail?id=' + e.currentTarget.id,
    })
  },
  //确认签收
  quer(){

    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要签收吗？',
      success(res) {
        if (res.confirm) {
          let data = {
            id: that.data.detail.id,
          }

          app.res.req('/userorder/confirmreceipt', data, (res) => {
            console.log(res.data)
            if (res.status == 1000) {
              that.getDetail()
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //提醒发货
  remind(){

    var timestamp1 = Date.parse(new Date());//拿到现在时间

    if (wx.getStorageSync('data_expiration') > timestamp1 && wx.getStorageSync('data_expiration') ){
        wx.showToast({
          title: '24小时之内只能提醒一次哦',
          icon:'none'
        })
    }else{
      var timestamp = Date.parse(new Date());
      var expiration = timestamp + 1 * 24 * 3600 *1000; //缓存一天
      wx.setStorageSync("data_expiration", expiration);
      wx.showToast({
        title: '提醒卖家发货成功',
        icon: 'none'
      })
    }

  },
  //查看物流
  wul(e) {
    wx.navigateTo({
      url: '../logistics_detail/logistics_detail?id=' + id,
    })
  },
  //拨打电话
  phone(){
    let that = this;

     wx.makePhoneCall({
       phoneNumber: that.data.detail.servicePhone,
     })
  },
  //取消原因
  bindcancel(e){
    let that = this;
    console.log(e)
    this.setData({
      cance:this.data.cancel[e.detail.value].name
    })
    let data = {
      id: that.data.detail.id,
      cancelReason: this.data.cancel[e.detail.value].name
    }
    app.res.req('/userorder/cancel', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

         that.getDetail();


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  //删除订单
  delete(){
    this.setData({
      isdelete:!this.data.isdelete,
      ismask:!this.data.ismask,
    })
  },
  //退款中
  zhong(e){
     wx.navigateTo({
       url: '../refund_detail/refund_detail?id=' + e.currentTarget.id + '&storeId=' + this.data.detail.storeId + '&status=' + this.data.detail.orderStatus,
     })
  },
  cancel_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask,
    })
  },
  confirm_delete(){
    let that = this;
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask,
    })
    let data = {
      id: that.data.detail.id,

    }
    app.res.req('/userorder/delete', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        wx.navigateBack({
          data:1
        })


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //退款
  refund(e){
    wx.navigateTo({
      url: '../order_refund/order_refund?id=' + e.currentTarget.id + '&status=' + this.data.detail.orderStatus + '&z_status=' + e.currentTarget.dataset.status,
    })
  },
  //付款
  pay(e) {
    let that = this;
    let data = {
      id: that.data.detail.id
    }

    app.res.req('/pay/gopay', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        app.res.req("/pay/xcxpay", data, (res) => {
          console.log(res.data)
          if (res.status == 1000) {
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
                that.setData({
                  isdelete: !that.data.isdelete,
                  ismask: !that.data.ismask
                })
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })

              }
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
  //付款时间
  PaymentTime(){
     let that = this;
    var aaa = time.replace(/-/g, '/');

    var nspt = aaa.split(' ')
    var timer3 = nspt[0].split('/');
    var timer4 = nspt[1].split('/');
    var start = new Date(timer3[0], timer3[1], timer3[2], timer4[0], timer4[1], timer4[2])
    var bbb = that.data.detail.createTime.replace(/-/g, '/');
    var spt = bbb.split(' ');
    var timer1 = spt[0].split('/');
    var timer2 = spt[1].split(':');
    var end = new Date(timer1[0], timer1[1], timer1[2], timer2[0], timer2[1], timer2[2])
    var oft = Math.round((start - end) / 1000);
    var ofd = parseInt(oft / 3600 / 24);
    var ofh = parseInt((oft % (3600 * 24)) / 3600);
    var ofm = parseInt((oft % 3600) / 60);
    var ofs = oft % 60;
    if (ofd < 10) {
      ofd = '0' + ofd
    }
    if (ofh < 10) {
      ofh = '0' + ofh
    }
    if (ofm < 10) {
      ofm = '0' + ofm
    }
    if (ofs < 10) {
      ofs = '0' + ofs

    }
    this.setData({

      hours: ofh,
      min: ofm,

    })
    console.log(ofd)
    console.log(ofh)
    console.log(ofm)
    console.log(ofm)
  },
  //发货时间
  PaymentTimes() {
    let that = this;
    var date1 = new Date(that.data.detail.createTime);
    //发货时间

    var sm1 = date1.getFullYear() + "/" + (date1.getMonth() + 1) + "/" + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds()
    console.log(sm1)
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 7);
    var sm2 = date2.getFullYear() + "/" + (date2.getMonth() + 1) + "/" + date2.getDate() + " " + date2.getHours() + ":" + date2.getMinutes() + ":" + date2.getSeconds();
    console.log(sm2);

    var nspt = time.split(' ')
    var timer3 = nspt[0].split('/');
    var timer4 = nspt[1].split('/');
    var start = new Date(timer3[0], timer3[1], timer3[2], timer4[0], timer4[1], timer4[2])
    var bbb = sm2.replace(/-/g, '/');
    var spt = bbb.split(' ');
    var timer1 = spt[0].split('/');
    var timer2 = spt[1].split(':');
    var end = new Date(timer1[0], timer1[1], timer1[2], timer2[0], timer2[1], timer2[2])
    var oft = Math.round((end - start) / 1000);
    var ofd = parseInt(oft / 3600 / 24);
    var ofh = parseInt((oft % (3600 * 24)) / 3600);
    var ofm = parseInt((oft % 3600) / 60);
    var ofs = oft % 60;
    if (ofh < 10) {
      ofh = '0' + ofh
    }
    if (ofm < 10) {
      ofm = '0' + ofm
    }

    this.setData({

      f_hour: ofh,
      f_min: ofm,

    })
    console.log(ofd)
    console.log(ofh)
    console.log(ofm)
  },
  getDetail() {
    let that = this;
    let data = {
     id:id
    }

    app.res.req('/userorder/detail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.logisticsInfo){
          let logistics = JSON.parse(res.data.logisticsInfo)
           console.log(that.data.logistics)
          that.setData({

            logistics: logistics.result.list[0]
          })
          console.log(that.data.logistics)
        }


        that.setData({
          detail: res.data,
          member_p: (res.data.productTotalFee + res.data.freight - res.data.payMoney).toFixed(2)
        })


        that.PaymentTime();
        that.PaymentTimes();

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
})