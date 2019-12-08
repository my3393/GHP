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
  //拨打电话
  phone(){
    let that = this;
     wx.makePhoneCall({
       phoneNumber: that.detail.servicePhone,
     })
  },
  //取消原因
  bindcancel(e){
    console.log(e)
    this.setData({
      cance:this.data.cancel[e.detail.value].name
    })

  },
  //删除订单
  delete(){
    this.setData({
      isdelete:!this.data.isdelete,
      ismask:!this.data.ismask,
    })
  },
  cancel_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask,
    })
  },
  confirm_delete(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: !this.data.ismask,
    })
  },
  //退款
  refund(){
    wx.navigateTo({
      url: '../order_refund/order_refund',
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
    var date1 = new Date(that.detail.createTime);
    //发货时间

    var sm1 = date1.getFullYear() + "/" + (date1.getMonth() + 1) + "/" + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes()
    console.log(sm1)
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 7);
    var sm2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate() + "-" + date2.getHours() + "-" + date2.getMinutes();
    console.log(sm2);
  },
  getDetail() {
    let that = this;
    let data = {
     id:id
    }

    app.res.req('app-web/userorder/detail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          detail: res.data
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