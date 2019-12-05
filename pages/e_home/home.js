// pages/home/home.js
const app = getApp();
let isRefresh = 0; //精选特产刷新
let detail = [];
let classifyId ='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lazy:true,
    showSkeleton: true,
    idx: '',
    tar: '',
    detail:[],
    istop:true,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getStorageSync('token')) {
      that.getbanner();
      console.log('token存在')
    } else {
      that.gettoken();
      console.log('token不存在')
    }
    setTimeout(() => {
      that.setData({
        showSkeleton: false
      })
    }, 1000)
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
  //搜索
  search(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  //查看商品详情
  detail(e){
    console.log(e)
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.dataset.id,
    })
  },
  //商品列表
  getDetail(){
    let that =this;
    let data = {
      classifyId:classifyId
    }

    app.res.req("app-web/product/list", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){

          detail.push(...res.data)
           that.setData({
             detail:detail,

           })
          that.getClass();
          that.getAdvert();
      }else if(res.status == 1004 || res.status == 1005){
          wx.redirectTo({
            url: '../login/login',
          })
      }else{
         wx.showToast({
           title: res.msg,
           icon:'none'
         })
      }
   })
  },
  //广告
  getAdvert(){
    let that =this;
    let data = {

    }
    app.res.req("app-web/home/advertise", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){
           that.setData({
            advert:res.data,

           })


      }else if(res.status == 1004 || res.status == 1005){
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
  //类型
  getClass(){
    let that =this;
    let data = {

    }
    app.res.req("app-web/home/classify", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){
           that.setData({
            className:res.data,

           })

      }else if(res.status == 1004 || res.status == 1005){
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
  //推荐
  huan(){
    isRefresh = 1;
    console.log(11)
    this.getRecommend();

  },
  getRecommend(){
    let that =this;
    let data = {
      isRefresh:isRefresh
    }
    app.res.req("app-web/home/recommend", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){
           that.setData({
            recommend:res.data,

           })

      }else if(res.status == 1004 || res.status == 1005){
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
  //热门
  getType(){
    let that = this;
    let data = {
      grade:1
    }
    let type = [
      {
        typeName:'全部',
        id:'',
      }
    ]
    app.res.req('app-web/home/grade/type', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){

           type.push(...res.data)
            that.setData({
              type,

            })

       }else if(res.status == 1004 || res.status == 1005){
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

    }
    app.res.req('app-web/home/banner', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
          if(res.data.index == 1007){
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
            that.setData({
              banner:res.data,

            })
           that.getDetail();
           that.getType();
           that.getRecommend();
       }else if(res.status == 1004 || res.status == 1005){
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

  gettoken() {
    let that =this;
    let data = {}
    app.res.req("app-web/login/defaultlogin", data, (res) => {
      wx.setStorage({
        key: 'token',
        data: res.data.token,
      })
      wx.setStorage({
        key: 'userinfo',
        data: res.data,
      })
      setTimeout(function () {
        that.getbanner();

      }, 100)
    })

  },
  //商品切换
  tag: function (e) {
    var that = this;
    let conut = '';
    classifyId = e.currentTarget.dataset.id;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    console.log(e.currentTarget);


    this.setData({
      tapTime: nowTime
    });

    that.setData({
      isSearch: false,
      index: e.currentTarget.dataset.num,
      tar: e.currentTarget.dataset.num,

      // player:[],
      // ranklist:[],
      // dynamic:[],
    })
     detail = [];
    that.getDetail();

  },
  //置顶
  top(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })

  },
  onPageScroll: function (e) {

    let that = this
    if (e.scrollTop > 300) {

      that.setData({
        istop: false,
      })
    } else {

      that.setData({
        istop: true
      })
    }
  }
})