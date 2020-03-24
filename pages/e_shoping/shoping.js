const app = getApp();
let cartsdata = [];
let ids = [];
let isRefresh = 0; //精选特产刷新
Page({

  /**

  * 页面的初始数据

  */

  data: {
    detel: true,
    isdetel:true,
    allselected: false,

    allnum: 0,

    allprices: 0.00,



  },

  /**

  * 生命周期函数--监听页面加载

  */

  onLoad: function (options) {
    // wx.showToast({
    //   title: '价值',
    //   icon:'warn',
    //   //image:'../../images/head.png',

    //   duration:3000
    // })
    //获取购物车信息

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
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })
        that.getDateil();
      }
    })
  },

  /**

  * 生命周期函数--监听页面隐藏

  */

  onHide: function () {
     ids = [],
     this.setData({
       allselected: false,
       allnum: 0,
       allprices: 0.00,
       isdetel:true,
     })
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
    let that = this;
     cartsdata = []
    wx.showLoading({
      title: '刷新中',
    })

    setTimeout(function () {
      // wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.getDateil();
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

    return {
      title: '我是' + that.data.user.bindCityName + that.data.user.bindAreaName + '买卖' + that.data.user.bindAreaName + '特产，助力家乡发展，家乡特供平台。',
      path: '/pages/e_specialty/e_specialty?userid=' + that.data.user.id,

    }
  },
  //选购特产
  non(){
    wx.switchTab({
      url: '../e_home/home',
    })
  },
  //商品详情
  good_detail(e){
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.id,
    })
  },
  //进入店铺
  store(e){

    wx.navigateTo({
      url: '../store_detail/store_detail?id=' + e.currentTarget.id,
    })
  },

  //计算总价格  所有选中商品的 （价格*数量）相加

  getallprices: function () {
    var cartsdata = this.data.cartsdata //购物车数据

    var allprices = 0

    let allnum = 0

    for (var i = 0; i < cartsdata.length; i++) {
      // console.log()
      var products = cartsdata[i].products
      for (var a = 0; a < products.length; a++) {
        if (products[a].selected) {
          //当前商品价格*数量 +
          let price = Number(products[a].salePrice)

          let num = parseInt(products[a].buyCount) //防止num为字符 *1或parseInt Number

          allprices += price * num

          allnum += num

        }

      }

    }

    //跟新已选数量

    this.setData({

      allnum: allnum,

      allprices: allprices.toFixed(2)

    })

  },

  //全选条件 条件->商铺全选择全选 反之

  allallprices: function () {
    let cartsdata = this.data.cartsdata
    let storenum = cartsdata.length;
    let allselected = this.data.allselected
    let allselectednum = 0;
    for (var i = 0; i < cartsdata.length; i++) {
      if (cartsdata[i].selected == true) {
        allselectednum++
      }
    }
    if (storenum == allselectednum) {
      allselected = true

    } else {
      allselected = false

    }
    this.setData({
      allselected: allselected
    })
    this.getallprices();
  },

  //全选按钮点击

  tapallallprices: function () {
    let allselected = this.data.allselected
    var cartsdata = this.data.cartsdata //购物车数据
    if (allselected) {
      allselected = false
      this.setData({
        isdetel: true
      })
      ids = [];
    } else {
      allselected = true
      this.setData({
        isdetel: false
      })
      for (var i = 0; i < cartsdata.length; i++) {

        var products = cartsdata[i].products
        for (var a = 0; a < products.length; a++) {
          ids.push(products[a].id)
        }
      }

    }
    //选择
    for (var i = 0; i < cartsdata.length; i++) {
      cartsdata[i].selected = allselected
      var products = cartsdata[i].products
      for (var a = 0; a < products.length; a++) {
        products[a].selected = allselected

      }
    }
    this.setData({
      cartsdata: cartsdata, //店铺下商品的数量
      allselected: allselected
    })
    this.getallprices();
    console.log(ids)
  },

  // 店铺的选中

  storeselected: function (e) {
    var cartsdata = this.data.cartsdata //购物车数据
    let index = e.currentTarget.dataset.index //当前店铺下标
    var thisstoredata = cartsdata[index].products //当前店铺商品数据
    //改变当前店铺状态
    if (cartsdata[index].selected) {
      cartsdata[index].selected = false

      //改变当前店铺所有商品状态
      for (var i in thisstoredata) {
        let dete = this.contains(ids,thisstoredata[i].id)
        ids.splice(dete,1)
        cartsdata[index].products[i].selected = false
      }
    } else {
      cartsdata[index].selected = true

      //改变当前店铺所有商品状态
      for (var i in thisstoredata) {
        cartsdata[index].products[i].selected = true
        let de = this.contains(ids, thisstoredata[i].id)
        console.log(de)
        console.log(de == false)
        if ( de === false){
          ids.push(thisstoredata[i].id)
        }

      }
    }
    //选择删除的商品是否为空
    if (ids.length == 0) {
      this.setData({
        isdetel: true
      })
    } else {
      this.setData({
        isdetel: false
      })
    }
    console.log(ids)
    this.setData({
      cartsdata: cartsdata //店铺下商品的数量
    })
    this.getallprices();
    this.allallprices();
  },
  contains(a, obj) {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        return i;
      }
     }
     return false;
  },
  editor(){
    this.setData({
      detel:!this.data.detel
    })
  },
  // 商品的选中

  goodsselected: function (e) {
    var cartsdata = this.data.cartsdata //购物车数据
    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标
    let idx = e.currentTarget.dataset.selectIndex //当前店铺下标
    let cai = cartsdata[idx].products; //当前商品的店铺data.goodsinfo
    let curt = cai[index]; //当前商品数组
    if (curt.selected) {
      cartsdata[idx].products[index].selected = false //点击后当前店铺下当前商品的状态
      cartsdata[idx].selected = false
      let dete = this.contains(ids, cartsdata[idx].products[index].id)
      ids.splice(dete, 1)
    } else {
      cartsdata[idx].products[index].selected = true //点击后当前店铺下当前商品的状态
      ids.push(cartsdata[idx].products[index].id)
      //当店铺选中商品数量与店铺总数量相等时 改变店铺状态
      var storegoodsleg = cartsdata[idx].products.length
      var products = cartsdata[idx].products
      var selectedleg = 0
      for (var i in products) {
        if (products[i].selected == true) {
          selectedleg++
        }
      }
      if (storegoodsleg == selectedleg) {
        cartsdata[idx].selected = true
      }
    }
     if(ids.length == 0){
       this.setData({
         isdetel:true
       })
     }else{
       this.setData({
         isdetel: false
       })
     }

    console.log(ids)
    // 更新

    this.setData({
      cartsdata: cartsdata //店铺下商品的数量
    })
    this.getallprices();
    this.allallprices();
  },

  // 点击+号，num加1，点击-号，如果num > 1，则减1

  addCount: function (e) {
    let that = this;
    console.log(e)
    var cartsdata = this.data.cartsdata //购物车数据

    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标

    let idx = e.currentTarget.dataset.selectIndex //当前店铺下标

    let cai = cartsdata[idx].products; //当前商品的店铺data.goodsinfo

    let curt = cai[index]; //当前商品数组

    var num = curt.buyCount; //当前商品的数量

    num++;
    console.log(num)
      cartsdata[idx].products[index].buyCount = num //点击后当前店铺下当前商品的数量

    this.setData({

      cartsdata: cartsdata //店铺下商品的数量

    })
    let data = {
      shopProductId: cartsdata[idx].products[index].id,
      buyCount: num
    }
    app.res.req('/shopcart/editbuycount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       // that.getDateil();
        //console.log(that.data.cartsdata)
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
    //计算总价格

    this.getallprices();

  },

  minusCount: function (e) {
    let that = this;
    var cartsdata = this.data.cartsdata //购物车数据

    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标

    let idx = e.currentTarget.dataset.selectIndex //当前店铺下标

    let cai = cartsdata[idx].products; //当前商品的店铺data.goodsinfo

    let curt = cai[index]; //当前商品数组

    var num = curt.buyCount; //当前商品的数量

    if (num <= 1) {

      return false;

    }

    num--;

    cartsdata[idx].products[index].buyCount = num //点击后当前店铺下当前商品的数量

    this.setData({

      cartsdata: cartsdata //店铺下商品的数量

    })
    let data = {
      shopProductId: cartsdata[idx].products[index].id,
      buyCount: num
    }
    app.res.req('/shopcart/editbuycount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
      //   that.getDateil();
        //console.log(that.data.cartsdata)
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
    this.getallprices();

  },
  pay(){
    let that = this;
    if(ids.length == 0){

    } else if (that.data.user.homeProvinceId == null || that.data.user.homeProvinceId == '') {
      wx.showModal({
        title: '提示',
        content: '下单需要绑定你的所在地',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../person/person',
            })
          } else if (res.cancel) {
            wx.navigateTo({
              url: '../person/person',
            })
          }
        }
      })
    } else{
      wx.navigateTo({
        url: '../sure_orders/sure_orders?ids=' + ids,
      })

      let data = {
        shopProductIds: ids
      }


    }

  },
  //删除商品
  delete(){
    let that = this;
    var Str = JSON.stringify(ids);
    if(ids == ''){

    }else{
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        success(res) {
          if (res.confirm) {
            let data = {
              shopProductIdJson: Str
            }
            app.res.req('/shopcart/delete', data, (res) => {
              console.log(res.data)
              if (res.status == 1000) {
                ids = [],
                  cartsdata = []
                that.setData({
                  allnum: 0,
                  allprices: 0.00,
                })
                wx.showToast({
                  title: '已删除',
                  icon: 'none'
                })
                that.getDateil();
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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  getDateil() {
    let that = this;
    let data = {

    }
    app.res.req('/shopcart/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          res.data[i].selected = false
          for (var j in res.data[i].products[i]) {
            res.data[i].products[i].selected = false
          }
        }
        cartsdata.push(...res.data)
        that.setData({
          cartsdata: res.data,

        })
        wx.hideLoading()
        that.getRecommend();
        console.log(that.data.cartsdata)
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
  //绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "/login/xcxbindphone",
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
        console.log(res.data.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data.data.user,
          })
          setTimeout(function () {
            that.pay();
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
  getRecommend() {
    let that = this;
    let data = {
      isRefresh: isRefresh
    }
    app.res.req("/home/recommend", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          recommend: res.data,

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
  //查看商品详情
  detail(e) {
    console.log(e)
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.dataset.id,
    })
  },
})

