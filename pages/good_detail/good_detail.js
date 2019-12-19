const app = getApp();
let top1 = '';
let top2 = '';
let id; //商品id
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectIndexArray = []; //选择属性名字的数组
var selectAttrid = []; //选择的属性id
var a = [];
var ds = false;
let user;
let sex = 0;//判断是不是从立即购买打开的规格
let userid;
Page({
  data: {
    isvideo:true,
    isplay:false,
    istop: true,
    isSecurity:true,//保障
    ismask: true,
    isgug: true,//规格
    naviga: true,//顶部导航栏
    istag: true,
    is_top: true,
    issrcoll: '1',
    loading: false,
    num: 1,
    current: 0,
    goodId:0,
    is_num:false,//购物车数量显示
  },

  onLoad: function (options) {
    console.log(options)
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {


        user = res.data

        //  /  console.log(bcode)
      },
    })
    this.setData({
      navH: app.globalData.navHeight
    })
    id = options.id
    this.getDetail();
    
    if (options.userid) {
      userid = options.userid
      this.Bang();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取id距离窗口高度
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    // query.select('.top1').boundingClientRect(function (rect) {


    //   top1 = rect.top

    // }).exec();
    query.select('.top2').boundingClientRect(function (rect) {


      top2 = rect.top

    }).exec();
    //获取本地用户信息
   
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })
      },
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;
    console.log(that.data.detail.name)
    return {
      title: that.data.detail.productName ,
      path: '/pages/good_detail/good_detail?id=' + id + '&userid=' + user.id , 

    }
  },
  //播放视频
  play(){
     this.setData({
       isvideo:!this.data.isvideo,
       isplay: !this.data.isplay
     })
  },
  //另一个商品
  good_detail(e){
     wx.redirectTo({
       url: '../good_details/good_details?id=' + e.currentTarget.id,
     })
  },
  //去开通会员
  member(){
     wx.navigateTo({
       url: '../members/members',
     })
  },
  gug_all(){
    console.log(111)
    if (this.data.isgug == false){
      this.setData({
        isgug: !this.data.isgug,
        ismask: !this.data.ismask
      })
    }
   
  },
  //分享
  fenx(){
    let that = this
    that.onShareAppMessage();
  },
  //加入购物车
  cart() {

    let that = this;
    let data = {

      skuId:that.data.goodId,
      buyCount:that.data.num,
      productId:id
    }

    app.res.req('app-web/shopcart/addproduct', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
        wx.showToast({
          title: '成功加入购物车',
          duration:3000
        })
        that.cart_num();
       }else if(res.status == 1004 || res.status == 1005 || res.status == 1018){
         console.log('未登录')
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
  //显示隐藏购物车
  showgg() {
    let that =this;
    
    sex = 0;
     if(this.data.detail.isSpecificaton == 1){
      this.setData({
        ismask: !this.data.ismask,
        isgug: !this.data.isgug
      })
     }else{
        that.cart();
     }

  },
  swiperChange: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current
      })
    }
  },
  //购物车
  shop(){
    wx.switchTab({
      url: '../e_shoping/shoping',
    })
  },
  //加
  add: function (e) {
    var that = this;
    
      that.setData({
        num: ++that.data.num,
      })
    
    

  },
  //减
  reduction: function (e) {
    var that = this;
    if (that.data.num == 1) {
      wx.showToast({
        title: '最少选择一件',
        icon: 'none'
      })
    } else {
      that.setData({
        num: that.data.num - 1,
      })

    }
  },
  //规格选择
  pack: function (e) {
    var that = this;
    ds = false;
    console.log(e);
    var selectIndex = e.currentTarget.dataset.selectIndex; //当前点击下标
    var attrIndex = e.currentTarget.dataset.attrIndex; //当前点击对象下标
    var spec = this.data.spec;
    var count = spec[selectIndex].entries.length;
    for (var i = 0; i < count; i++) {
      spec[selectIndex].entries[i].isSelect = false;
    }
    spec[selectIndex].entries[attrIndex].isSelect = true;
    selectIndexArray[selectIndex] = spec[selectIndex].entries[attrIndex].value;
    if (selectAttrid.length == 0) {
      selectAttrid.push(spec[selectIndex].entries[attrIndex].id)
    } else {
      selectAttrid[selectIndex] = spec[selectIndex].entries[attrIndex].id;

    }


    this.setData({
      spec: spec, //变换选择框
      selected: selectIndexArray.join("-"),
      selectAttrid: selectAttrid.join(','),
    });
    console.log(selectIndexArray.join(","))
    console.log(that.data.selectAttrid)
    if (selectAttrid.length == that.data.detail.specificationItems.length) {
      console.log(selectAttrid);

      for (let i in that.data.sku) {
        if (JSON.stringify(that.data.selectAttrid) === JSON.stringify(that.data.sku[i].ids)) {
          console.log(that.data.sku[i])
          if(that.data.sku[i].productImgOss){
            that.setData({
              title_img: that.data.sku[i].productImgOss,
            })
          }
          that.setData({
            price: that.data.sku[i].price,
            goodId: that.data.sku[i].id,

          })
          return ds = true;
        }
      }
      if (ds == false) {
        wx.showToast({
          title: '该商品没有库存',
          icon: 'none'
        })
      }
    }
  },
  //购物车数量
  cart_num(){
    let that = this;
    let data = {
     
    }

    app.res.req("app-web/shopcart/shopcartnumber", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if(res.data == 0){
          that.setData({
            is_num:true,
          })
        }else if(res.data > 9){
          that.setData({
            cart_num: 9,
           
          })

        }else{
          that.setData({
            cart_num: res.data,
            is_num: false,
          })
        }
       


      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {

        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        if (userid) {
          wx.navigateTo({
            url: '../login/login?id=' + id + '&userid=' + userid
          })
        } else {
          wx.navigateTo({
            url: '../login/login?id=' + id
          })
        }
      } else if (res.status == 1028) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  recom() {
    let that = this;
    let data = {
      currentPage:1,
        provinceId:'',
      cityId:'',
        areaId:'',
      townId:'',
      classifyId: that.data.detail.classifyId,
      typeId:'',
        sortType:0,
      keyword:'',
      
    }

    app.res.req("app-web/product/list", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         that.setData({
           list:res.data
         })

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {

        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
       
      } else if (res.status == 1028) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //绑定
  Bang() {
    let that = this;
    let data = {
      id: userid
    }

    app.res.req("app-web/user/sharebinduser", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
          wx.showToast({
            title: '绑定成功',
          })


      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        if(userid){
          wx.navigateTo({
            url: '../login/login?id=' + id + '&userid=' + userid
          })
        }else{
          wx.navigateTo({
            url: '../login/login?id=' + id 
          })
        }       
      } else if (res.status == 1028) {
        
      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
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
        for (var i in res.data) {
          a = [];
          for (var j in res.data[i].skus) {
            a.push(res.data[i].skus[j].id)
            res.data[i].ids = a.join(",")
          }
        }
        that.setData({
          sku: res.data
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
  // 购买
  buy() {
    let that = this;

    console.log(user.id)
    if(user.id == null){
      
      console.log(selectIndexArray.length)
      wx.navigateTo({
        url: '../login/login?id=' + id,
      })
    } else if (that.data.detail.isSpecificaton == 0){
      wx.navigateTo({
        url: '../sure_order/sure_order?id=' + id + '&num=' + that.data.num
          + '&selectIndexArray=' + selectIndexArray
          + '&goodId=' + that.data.goodId + '&storeid=' + that.data.detail.storeId,
      })

    }else{
      if (selectIndexArray.length === that.data.spec.length) {
        if (ds == true) {
          wx.navigateTo({
            url: '../sure_order/sure_order?id=' + id + '&num=' + that.data.num
              + '&selectIndexArray=' + selectIndexArray
              + '&goodId=' + that.data.goodId + '&storeid=' + that.data.detail.storeId,
          })
        } else {
          wx.showToast({
            title: '该商品没有库存',
            icon: 'none'
          })
          return false;
        }
      } else {
        wx.showToast({
          title: '请选择商品规格',
          icon: 'none'
        })
        sex = 1
        that.setData({
          isgug: !that.data.isgug,
          ismask: !that.data.ismask
        })
        return false;
      }
      that.setData({
        loading: !that.data.loading
      })
    }
    
  },
 
  //确定
  confirm() {
    let that =this
    if (selectIndexArray.length === that.data.spec.length) {
      if (ds == true) {

        that.setData({
          ismask: !this.data.ismask,
          isgug: !this.data.isgug
        })
        if(sex == 1){
          wx.navigateTo({
            url: '../sure_order/sure_order?id=' + id + '&num=' + that.data.num
              + '&selectIndexArray=' + selectIndexArray
              + '&goodId=' + that.data.goodId + '&storeid=' + that.data.detail.storeId,
          })
        }else{
          that.cart();
        }
       

      } else {
        wx.showToast({
          title: '该商品没有库存',
          icon: 'none'
        })
        return false;
      }
    } else {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none'
      })


      return false;
    }
  },
  //保障弹窗
  security(){
    this.setData({
      ismask: !this.data.ismask,
      isSecurity: !this.data.isSecurity,

    })
  },
 
  //收藏
  Collection() {
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("app-web/product/collection", data, (res) => {
      console.log(res.data)
      if (res.status == 1016 || res.status == 1017) {
        that.getDetail();



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
  //绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "app-web/login/xcxbindphone",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wx.getStorageSync('sessionkey')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data,
          })
          setTimeout(function () {
            that.showgg();
          }, 1000)

        } else if (res.data.status === 103) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })

        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
        }
      }
    })
  },
  //进店
  store(e){
     wx.navigateTo({
       url: '../store_detail/store_detail?id=' + e.currentTarget.id,
     })
  },
  //店铺详情
  getStore(){
    let that = this;
    let data = {
      storeId: that.data.detail.storeId
    }

    app.res.req("app-web/store/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         that.setData({
           store:res.data
         })
        that.getCommed();
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        if (userid) {
          wx.navigateTo({
            url: '../login/login?id=' + id + '&userid=' + userid
          })
        } else {
          wx.navigateTo({
            url: '../login/login?id=' + id
          })
        }       
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //店铺推荐
  getCommed() {
    let that = this;
    let data = {
      storeId: that.data.detail.storeId
    }

    app.res.req("app-web/store/recommendproduct", data, (res) => {
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
        that.getStore();
        that.cart_num();
        this.getSku();
        setTimeout(function(){
          that.recom();
        },1000)
      } else if (res.status == 1004 || res.status == 1005) {
        if (userid) {
          wx.navigateTo({
            url: '../login/login?id=' + id + '&userid=' + userid
          })
        } else {
          wx.navigateTo({
            url: '../login/login?id=' + id
          })
        }       
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //返回上一页
  navBack() {
   if(userid){
     wx.switchTab({
       url: '../e_home/home',
     })
   }else{
     wx.navigateBack({
       data: 1
     })
   }
  },
  //顶部导航栏
  nav() {
    this.setData({
      naviga: !this.data.naviga
    })
  },
  // 查看评价
  evaluation() {
    wx.navigateTo({
      url: '../goods_evaluation/goods_evaluation',
    })
  },
  //分享弹窗
  off_order() {
    console.log(111)
    let that = this;
    this.setData({
      istag: !that.data.istag
    });
    console.log(that.data.istag)
  },

  // 滚轮显示
  scrollto() {
    wx.pageScrollTo({
      scrollTop: 201,
      duration: 300
    })
  },
  scrollto1() {
    wx.pageScrollTo({
      scrollTop: top1 - 60,
      duration: 300
    })
  },
  scrollto2() {
    wx.pageScrollTo({
      selector: '.top2',
      duration: 300
    })
  },
  onPageScroll: function (e) {

    let that = this
    if (e.scrollTop > 200) {

      that.setData({
        is_top: false,
      })
    } else {

      that.setData({
        is_top: true
      })
    }
    if (e.scrollTop < 400) {

      that.setData({
        issrcoll: 1
      })
    } else if (400 < e.scrollTop && e.scrollTop < 700) {

      that.setData({
        issrcoll: 2
      })

    } else if (700 < e.scrollTop) {

      that.setData({
        issrcoll: 3
      })
    }
  },
  //置顶
  top() {
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
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      selectName: "", //已选的属性名字
      selectAttrid: [], //选择的属性id
      selected: "",
      price: '', //价格
      goodId: '',
    })
    selectIndex; //选择的大规格key
    attrIndex; //选择的小规格的key
    selectIndexArray = []; //选择属性名字的数组
    selectAttrid = [];
     a = [];
    // detail_id;
    ds = false;
  },

})