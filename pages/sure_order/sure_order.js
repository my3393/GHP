// pages/sure_order/sure_order.js
const app = getApp();
let id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:false,
    defalutaddres: [],//默认地址
    adress: [],//选择的地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getDefaultaddress();
   id = options.id;
   this.setData({
     buyNum:num
   })
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
    wx.getStorage({
      key: 'address',
      success: function (res) {
        console.log(res.data)
        that.setData({
          adress: res.data
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
  //规格
  getSku() {
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("app-web/product/sku", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data.data) {
          console.log(that.data.goodId)
          if (that.data.goodId == res.data.data[i].id) {
            that.setData({
              sku: res.data.data[i],
              prices: res.data.data[i].price * that.data.num,
            })
            console.log(that.data.skus)
          }

        }
        


      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        wx.navigateTo({
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
  //商品详情
  getDetail() {
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("app-web/product/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {


        that.setData({
          detail: res.data,
          spec: res.data.specificationItems,
          price: res.data.lowestPrice,
          title_img: res.data.productDefaultImgOss
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
  //获取默认地址
  getDefaultaddress(){
    let that = this;
    let data = {
       
    }
    app.res.req('app-web/useraddress/defaultaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.data != null) {
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

  }
})