// pages/address/address.js
const app = getApp();
let sex;
let currentPage = 1;
let detail = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
   detail:[],
    isdelete:true,
    ismask:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sex) {
      sex = options.sex
    }
     this.getDateil();
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
     currentPage = currentPage +1;
     this.getDateil();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  add() {
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  bianji(e){
    wx.navigateTo({
      url: '../add_address/add_address?id=' + e.currentTarget.id,
    })
  },
  wx_add() {
    wx.chooseAddress({
      success(res) {
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  //选择地址
  choose(e){
    let that = this;
    let data = {
      id: e.currentTarget.id
    }
    app.res.req('app-web/useraddress/addressdetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.setStorage({
          key: 'address',
          data: res.data,
        })
        if (sex) {
          wx.navigateBack({
            delta: 1,
          })
        }

      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //删除地址
  detel(e){
    console.log(e)
    this.setData({
      ismask:!this.data.ismask,
      isdelete:!this.data.isdelete,
      id:e.currentTarget.dataset.id
    })

  },
  cancel(e) {
    console.log(e)
    this.setData({
      ismask: !this.data.ismask,
      isdelete: !this.data.isdelete,
      
    })

  },
  confirm(){
    let that = this;
    this.setData({
      ismask: !this.data.ismask,
      isdelete: !this.data.isdelete,
      
    })
    let data = {
      id:that.data.id
    }
    app.res.req('app-web/useraddress/delete', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.showToast({
          title: '已删除',
          icon:'none'
        })
        wx.clearStorage('address')
        that.getDateil();

      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //设置默认
  checked(e) {
    let that = this;
    let data = {
      id:e.currentTarget.dataset.id
    }
    app.res.req('app-web/useraddress/setdefaultaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getDateil();
      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })


  },
  getDateil() {
    let that = this;
    let data = {
      currentPage
    }
    app.res.req('app-web/useraddress/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          if (res.data[i].isDefault == 1) {
            res.data[i].checked = true
          } else {
            res.data[i].checked = false
          }
         
        }
        detail.push(...res.data)
        that.setData({
          detail: detail,

        })

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {

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
  // 上个页面返回刷新
  changeData: function () {
    currentPage = 1;
    detail = [];
    this.setData({
      
    })
    this.getDateil();
    //var options = { 'id': this.data.id }
    //this.onLoad(options);//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  
  },
})