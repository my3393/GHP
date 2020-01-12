// pages/e_specialty/e_specialty.js
const app = getApp();
let grade = 1;
let id = '';
let currentPage = 1;
let list = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {

    tar:'',
    isBang:true,

    currentTab: 0,  //对应样式变化
    scrollTop: 0,  //用作跳转后右侧视图回到顶部
    screenArray: [], //左侧导航栏内容
    screenId: "",  //后台查询需要的字段
    childrenArray: [], //右侧内容
    typeId:'',
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      navH: app.globalData.navHeight
    })
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })
        that.getType();

      },
    })


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
     let that =this;
     that.setData({
       isBang:true
     })
    that.getbanner()
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        console.log(res.data)
        that.setData({
          user: res.data
        })

        if (res.data.bindProvinceId == null || res.data.bindProvinceId == ''){
          that.setData({
            isBang:false
          })
        }

        if (res.data.loginId == null) {
            wx.navigateTo({
              url: '../login/login',
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
    wx.showLoading({
      title: '刷新中',
    })
    currentPage = 1;
    setTimeout(function () {
      // wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.banner();
      that.getType();
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
    var that = this;
    //console.log(that.data.detail.name)
    return {
      title:'您的好友给您发送了一张商家入驻邀请函，点击【立即查看】' ,
      imageUrl: 'https://www.xingtu-group.cn/xcx_img/store_refund.png',
      path: '/pages/store_refund/store_refund?userid=' + that.data.user.id,

    }
  },
  //banner跳转
  banner(e) {
    console.log(e)
    if (e.currentTarget.dataset.xcxurl == '') {

    } else if (e.currentTarget.dataset.xcx.id == '') {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page + e.currentTarget.dataset.xcx.id,
      })
    }
  },
  //商品详情
  detail(e){
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.id,
    })
  },
  getType(){
    let that = this;
    console.log(that.data.user)
    let data = {
      provinceId: that.data.user.bindProvinceId
    }
    app.res.req('/home/classifyprovince', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
          if(res.data == ''){
             that.setData({
               Nostore:true,
             })
          }else{

            that.setData({
              type: res.data,
              typeId : res.data[0].id
            })
            that.getlist();

          }
          that.getdymic();
          wx.hideLoading()
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
  //商品列表
  getlist(){
    let that = this;
    let data = {
      currentPage: currentPage,
        provinceId: that.data.user.bindProvinceId,
        cityId: that.data.user.bindCityId,
        areaId:'',
        townId:'',

        typeId:that.data.typeId,
        sortType:0,
        keyword:''
    }
    app.res.req('/product/list', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
         list.push(...res.data)
            that.setData({
              list:list,

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
  //轮播
  getbanner() {
    let that = this;
    let data = {

    }
    app.res.req('/home/hometownadvertise', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }
        that.setData({
          banner: res.data,

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
 //文字轮播
  getdymic() {
    let that = this;
    let data = {

    }
    app.res.req('/donation/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          dymic: res.data,

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
   //商品切换
   tag: function (e) {
    var that = this;
    id =  e.currentTarget.id;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    console.log(e.currentTarget);
    list = [];

    this.setData({
      tapTime: nowTime,
      typeId:e.currentTarget.id
    });

    that.setData({
      tar: e.currentTarget.dataset.num,
    })
     that.getlist();

  },
  //绑定家乡
  bang(){
    wx.navigateTo({
      url: '../binding_hometown/binding_hometown',
    })
  },
  //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('/user/info', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })

      }
    })
  },
})