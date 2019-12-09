// pages/refund_detail/refund_detail.js
const app = getApp();
let id;
let storeId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:3,
    ischexiao:true,//撤销申请
    ismask:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     id = options.id,
     storeId = options.storeId 
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
  //订单投诉
  complain(){
     wx.navigateTo({
       url: '../order_complaints/order_complaints?id=' + id ,
     })
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

        that.setData({
          detail: res.data,
          status: res.data.orderStatus
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
  //撤销次数
  chexiao_num() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('app-web/userorder/revocationcount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         if(res.data == 0){
          wx.showToast({
            title: '当前撤销机会已用完，不能撤销',
            icon:'none',
            duration:2000
          })
         }else{
           that.setData({
             chexiao_num: res.data
           })
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
  //确定撤销
  cx_confirm(){
      this.chexiaos();
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
          status: res.data.orderStatus
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