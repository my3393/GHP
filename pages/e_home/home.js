// pages/home/home.js
const app = getApp();
let isRefresh = 0; //精选特产刷新
let detail = [];
let typeId = '';
let user;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lazy:true,
    showSkeleton: true,
    modal:false,
    idx: '',
    tar: '',
    detail:[],
    istop:true,
     isofficial: false,
    //深色
    bottomColor: '#ff6600',
    //浅色
    gradientColor: '#ffcc99',
    scrollH: 0, //滚动总高度
    opcity: 0,
    iconOpcity: 0.5,
    currentPage:1,
    store_recommended:[]
  },
  tass(e){
    console.log(e)
    let roomId = 7;
    let customParams = { path: 'pages/index/index', pid: 1 } // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节
   
    this.setData({
      roomId,
      customParams: encodeURIComponent(JSON.stringify(customParams))
    })
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
    if(options.userid){
      console.log(options.userid)
      wx.setStorageSync('bangId', options.userid)
      that.Bang();
      
    }
    //绑定
    if (wx.getStorageSync('bangId')) {
      that.Bang();
    }
    if (decodeURIComponent(options.q).split('/')[4]){
      
      wx.setStorageSync('bangId', decodeURIComponent(options.q).split('/')[4])
      that.Bang();
    }
    //绑定店铺

    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      top: obj.top + (obj.height - 32) / 2
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            scrollH: res.windowWidth
          })
        }
      })
    });

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
    let that = this
    this.setData({
      navH: app.globalData.navHeight
    })
    if (wx.getStorageSync('bangId')) {
      that.Bang();
      
    }
    //3秒后隐藏关注组件
    that.setData({
      isofficial: false,
    })
    setTimeout(function () {

      that.setData({
        isofficial: true,
      })
    }, 5000)
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        user = res.data
       // console.log(res.data.bindProvinceId)
      
       if(res.data.id){
         if (res.data.bindProvinceId == '' || res.data.bindProvinceId == null) {
          //  wx.showModal({
          //    cancelText: '先逛逛',
          //    confirmText: '去绑定',
          //    confirmColor: '#f12200',
          //    cancelColor: '#cccccc',
          //    title: '你还未绑定家乡',
          //    content: '绑定自己家乡，帮助家乡宣传。',
          //    success(res) {
          //      if (res.confirm) {
          //        wx.navigateTo({
          //          url: '../person/person',
          //        })
          //      } else if (res.cancel) {

          //      }
          //    }
          //  })
         } else {
           wx.setTabBarItem({
             index: 1,
             text: res.data.bindAreaName,
           })

           if (res.data.memberType == 0 && res.data.bindUserNum != 0) {
             wx.showModal({
               cancelText: '先逛逛',
               confirmText: '去开通',
               confirmColor: '#f12200',
               cancelColor: '#cccccc',
               title: '会员',
               content: '您当前已锁定' + res.data.bindUserNum + '名用户，开通会员即可获得锁定用户订单交易金额的10%分红收益',
               success(res) {
                 if (res.confirm) {
                   wx.navigateTo({
                     url: '../members/members',
                   })
                 } else if (res.cancel) {

                 }
               }
             })
           }
         }
         if (res.data.phone == '' || res.data.phone == null) {
           wx.showModal({
             cancelText: '先逛逛',
             confirmText: '去绑定',
             confirmColor: '#f12200',
             cancelColor: '#cccccc',
             //  title: '你还未绑定家乡',
             content: '你还没绑定手机号。',
             success(res) {
               if (res.confirm) {
                 wx.navigateTo({
                   url: '../login/login',
                 })
               } else if (res.cancel) {

               }
             }
           })
         }
       }
        if (res.data.bindStoreId){
          that.setData({
            storeId: res.data.bindStoreId
          })
            that.getCommed()
            that.getstore_name()
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
     that.setData({
       tar:0
     })
    wx.showLoading({
      title: '刷新中',
    })
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉刷新
      this.getbanner();
    },1500)
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      currentPage:this.data.currentPage + 1

    })
    this.getDetails();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    console.log(that.data.detail.name)
    return {
      title: '我是' + user.bindCityName + user.bindAreaName + '人，买卖家乡特产，复苏家乡经济，您的家乡需要您...',
      path: '/pages/e_home/home?userid=' + user.id,

    }
  },
  testSwiper: function (e) {
    var that = this;
    var index = e.detail.current;
    var currentbottomColor =
      that.data.banner[index].colorNo;
    var currentgradientColor =
      that.data.banner[index].colorNo;
    that.setData({
      bottomColor:
      '#' +  currentbottomColor,
      gradientColor:
        '#' +   currentgradientColor
    })

  },
  binderror(e) {
    console.log(e.detail)
  },
  bindload(e) {
    console.log(e.detail)
  },
  official_det() {
    this.setData({
      isofficial: true,
    })
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
      url: '../productList/producList?searchKey=' + e.currentTarget.dataset.name + '&homeId=' + 1 ,
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


       typeId: typeId,

    }

    app.res.req("/home/choiceness/product", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){
           if(res.data == ''){
             wx.showToast({
               title: '已经没有了哦',
               icon:'none'
             })
           }else{
             detail.push(...res.data)
             that.setData({
               detail: detail,

             })
           }
          


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
  //全部商品列表
  getDetails() {
    let that = this;
    let data = {
      currentPage:that.data.currentPage,
        storeId:'',
      provinceId:'',
        cityId:'',
      areaId:'',
        townId:'',
      typeId:typeId,
        sortType:0,
      keyword:'',

    }

    app.res.req("/product/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data == '') {
          wx.showToast({
            title: '已经没有了哦',
            icon: 'none'
          })
        } else {
          detail.push(...res.data)
          that.setData({
            detail: detail,

          })
        }



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
  //广告
  getAdvert(){
    let that =this;
    let data = {

    }
    app.res.req("/home/advertise", data, (res) => {
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
    app.res.req("/home/classify", data, (res) => {
      console.log(res.data)
      if(res.status == 1000){
           that.setData({
            className:res.data,

           })

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
    app.res.req("/home/recommend", data, (res) => {
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
  show3() {
    this.setData({
      modal: !this.data.modal
    })
  },
  //会员商品
  getmemberproduct() {
    let that = this;
    let data = {
      isRefresh: isRefresh
    }
    app.res.req("/home/memberproduct", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          memberproduct: res.data,

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
  //热门特产
  getType(){
    let that = this;
    let data = {
      grade:1
    }

    app.res.req('/home/grade/type', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
         let typ = [
           {id:'',typeName:'全部'}
         ]
          typ.push(...res.data)
            that.setData({
              type:typ

            })
         that.getDetails();
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
    app.res.req('/home/banner', data, (res) => {
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
         that.getmemberproduct();
           that.getClass();
           that.gongz();
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
    app.res.req("/login/defaultlogin", data, (res) => {
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

      }, 500)
    })

  },
  //商品切换
  tag: function (e) {
    var that = this;
    let conut = '';
    typeId = e.currentTarget.dataset.id;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }

    this.setData({
      tapTime: nowTime
    });

    that.setData({
      isSearch: false,
      index: e.currentTarget.dataset.num,
      tar: e.currentTarget.dataset.num,
      currentPage:1
      // player:[],
      // ranklist:[],
      // dynamic:[],
    })
     detail = [];
    that.getDetails();

  },
  //是否关注公众号
  gongz(){
    let that = this;
    let data = {}
    app.res.req("/follow/wx", data, (res) => {
     console.log(res.data)
     if(res.data == 1){
       that.setData({
         isofficial: true,
       })
     } 
    })
  },
  //店铺推荐
  getCommed() {
    let that = this;
    let data = {
      storeId: that.data.storeId
    }

    app.res.req("/store/recommendproduct", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store_recommended: res.data
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
  //店铺名称
  getstore_name() {
    let that = this;
    let data = {
      storeId: that.data.storeId
    }

    app.res.req("/store/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store_name: res.data
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
  //置顶
  top(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })

  },
  onPageScroll: function (e) {
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    let opcity = scroll / this.data.scrollH;
    if (this.data.opcity >= 1 && opcity >= 1) {
      return;
    }
    this.setData({
      opcity: opcity,
      iconOpcity: 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
    })
    //console.log(this.data.opcity)
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
  },
  //绑定
  Bang() {
    let that = this;
    
    let data = {
      id: wx.getStorageSync('bangId')
    }

    app.res.req("/user/sharebinduser", data, (res) => {
      console.log(res)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })
      
        wx.removeStorageSync('bangId')
      } else if (res.status == 1028) {
        console.log('----1028----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('bangId')
        console.log('----1030----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bangId')
        console.log('----1031----')
      }
    })
  },
})