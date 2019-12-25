// pages/refund_detail/refund_detail.js
const app = getApp();
let id;
let storeId
let status
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:true,
    status:3,
    ischexiao:true,//撤销申请
    ismask:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.showLoading({
       title: '加载中',
     })
     id = options.id,
     storeId = options.storeId 
     status = options.status
     this.getDetail();
    this.chexiao_nums()
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
  //查看图片
  Preview: function (e) {
    var that = this;
    var urlsa = [];
    console.log(e)
    urlsa.push(e.currentTarget.id)
    console.log(urlsa)
    wx.previewImage({
      current: e.currentTarget.id,
      urls: that.data.detail.refundImgOss
    })
  },
  //填写快递
  wul_xx(){
    wx.navigateTo({
      url: '../order_refund_s/order_refund_s?id=' + this.data.detail.id ,
    })
  },
  //修改申请
  xiugai(){
    if(this.data.detail.orderStatus == 17){
      wx.navigateTo({
        url: '../order_refund_s/order_refund_s?id=' + this.data.detail.id,
      })
    }else{
      wx.navigateTo({
        url: '../order_refund/order_refund?id=' + this.data.detail.id + '&status=' + status + '&z_status=' + this.data.detail.orderStatus,
      })
    }
    
  },
  //退款进度
  jind(){
    wx.navigateTo({
      url: '../refund_schedule/refund_schedule?id=' + id + '&orderNo=' + this.data.detail.orderNo,
    })
  },
  //订单投诉
  complain(){
    if (this.data.detail.complaintExplain == null || this.data.detail.complaintExplain == ''){
      wx.navigateTo({
        url: '../order_complaints/order_complaints?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '../order_complaints_d/order_complaints_d?id=' + id,
      })
    }
    
  },
  //撤销申请
  chexiao(){
     this.chexiao_num();
     
  },
  chexiaos(){
    let that = this;
    let data = {
      id: id
    }

    app.res.req('app-web/userorder/revocation', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        
        // that.setData({
        //   detail: res.data,
        //   status: res.data.orderStatus
        // })
        wx.showToast({
          title: '撤销成功',
          icon:'none',
          duration:2000,
        })
        that.getDetail();
        that.chexiao_nums()

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
  //撤销次数
  chexiao_num() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('app-web/userorder/revocationcount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
          
         if(res.data == 2){
          wx.showToast({
            title: '当前撤销机会已用完，不能撤销',
            icon:'none',
            duration:2000
          })
         }else{
           if(res.data == 0){
             that.setData({
               chexiao_num: 1
             })
           }else{
             that.setData({
               chexiao_num:0
             })
           }
           that.setData({
             ismask: !that.data.ismask,
             ischexiao: !that.data.ischexiao
           })
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
  chexiao_nums() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('app-web/userorder/revocationcount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          chexiao_nums: res.data
        })
        


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //确定撤销
  cx_confirm(){
    let that = this;
      this.chexiaos();
     this.setData({
      ismask: !that.data.ismask,
      ischexiao: !that.data.ischexiao
    })
  },
  cx_cancel() {
    let that = this;
    
    this.setData({
      ismask: !that.data.ismask,
      ischexiao: !that.data.ischexiao
    })
  },
  getDetail() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('app-web/userorder/suborderdetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getstore();
        that.setData({
          detail: res.data,
          status: res.data.orderStatus,
          load:false,
        })
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
  //店铺地址
  getstore() {
    let that = this;
    let data = {
      storeId
    }

    app.res.req('app-web/store/refundaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          store: res.data,
          
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
})