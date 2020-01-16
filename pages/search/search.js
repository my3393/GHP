// pages/search/search.js
const app = getApp();
let keyword;
let currentPage=1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    ishistory:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    this.getlist();
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
      key: 'search',
      success: function (res) {
        that.setData({
          history: res.data
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
  bindconfirm(e){
   console.log(e.detail.value)
   if(e.detail.value != ''){
     wx.navigateTo({
       url: '../productList/producList?searchKey=' + e.detail.value + '&k=' + 1,
     })
     let search = [];
     if (wx.getStorageSync('search')){
        search = wx.getStorageSync('search')
     }
     var index = search.findIndex(item => item === e.detail.value);
     console.log(index)

     if (index > -1) {
       // 存在

     } else {
       // 不存在
       //state.catData.push(Object.assign({}, good, { num: 1 }));
       search.push(e.detail.value)
     }


     wx.setStorage({
       key: 'search',
       data: search,
     })

   }
  },
  //清除历史记录
  clearst(e){
    let that=this;
    wx.removeStorage({
      key: 'search',
      success: function(res) {
         that.setData({
           history:[]
         })
      },
    })
  },
  searchKey(e){
    wx.navigateTo({
      url: '../productList/producList?searchKey=' + e.currentTarget.id + '&k=' + 1,
    })
  },
  navBack(){
    wx.navigateBack({
      data:1
    })
  },
  //搜索
  value(e){
    keyword = e.detail.value
    if (keyword == ''){
       this.setData({
         ishistory:false,
         detail:[],
         store:[]
       })
    }else{
      this.getdetail()
      this.getStore();
      this.setData({
        ishistory: true
      })
    }

  },
  //热门推荐
  getlist() {
    let that = this;
    let data = {

    }

    app.res.req("/home/hotsearch", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          list: res.data
        })


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
  //搜索店铺
  getStore() {
    let that = this;
    let data = {
      currentPage: currentPage,
      keyword: keyword,
    }

    app.res.req("/store/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store: res.data
        })


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
  good(e){
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.id,
    })
  },
  //店铺详情
  store(e) {
    wx.navigateTo({
      url: '../store_detail/store_detail?id=' + e.currentTarget.id,
    })
  },
  //搜索商品
  getdetail() {
    let that = this;
    let data = {
      currentPage: currentPage,
      keyword: keyword,
      provinceId:'',
        cityId:'',
      areaId:'',
        townId:'',
      classifyId:'',
        typeId:'',
      sortType:0
    }

    app.res.req("/product/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          detail: res.data
        })


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
})