// pages/home/home.js
const app = getApp();
let isRefresh = 0; //精选特产刷新
let detail = [];
let classifyId =1;
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
     res:'nide'

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
    if(options.bangId){
      wx.setStorageSync('bandId', options.bangId)
    }
      
   
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

    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        console.log(res.data.bindProvinceId)
        if (res.data.bindProvinceId == '' || res.data.bindProvinceId == null) {
          
        }else{
          wx.setTabBarItem({
            index: 1,
            text: res.data.bindAreaName,
          })
        }

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
    let that = this
   
     isRefresh = 0; //精选特产刷新
     detail = [];
     
    wx.showLoading({
      title: '刷新中',
    })
   
    setTimeout(function () {
      // wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.getbanner();
    }, 200)
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
  search_product(e){
    console.log(e)
    wx.navigateTo({
      url: '../productList/producList?searchKey=' + e.currentTarget.dataset.name + '&id=' + e.currentTarget.id,
    })
  },
  search_all(){
    wx.navigateTo({
      url: '../productList/producList' ,
    })
  },
  search_name(e){
     wx.navigateTo({
       url: '../search_name/search_name?id=' + e.currentTarget.id + '&name=' + e.currentTarget.dataset.name,
     })
  },
  //banner跳转
  banner(e){
     console.log(e)
     if(e.currentTarget.dataset.xcxurl == ''){

     } else if (e.currentTarget.dataset.xcx.id == ''){
       wx.navigateTo({
         url: e.currentTarget.dataset.xcx.page,
       })
     }else{
       wx.navigateTo({
         url: e.currentTarget.dataset.xcx.page + e.currentTarget.dataset.xcx.id,
       })
     }
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
      classifyId:'',
      currentPage:1,
        provinceId:'',
      cityId:'',
        areaId:'',
      townId:'',
      typeId:classifyId,
        sortType:0,
      keyword:''
    }

    app.res.req("app-web/product/list", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){

          // detail.push(...res.data)
           that.setData({
             detail:res.data,

           })
         
         
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
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }
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
        that.getDetail();
        that.getType();
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
  //热门特产
  getType(){
    let that = this;
    let data = {
      grade:1
    }
    
    app.res.req('app-web/home/grade/type', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){

          
            that.setData({
              type:res.data

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
            for(var i in res.data){
              if(res.data[i].xcxUrl != ''){
                res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
              }
             
            }
           
            that.setData({
              banner:res.data,

            })
            wx.hideLoading()
           that.getAdvert();
           
           that.getRecommend();
           that.getClass();
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