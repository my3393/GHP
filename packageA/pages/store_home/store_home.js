// packageA/pages/store_home/store_home.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();

var qqmapsdk = new QQMapWX({
  key: 'PVXBZ-SXVC3-BSV3N-YN6BC-3IV45-DGF2L' // 必填
});

let storeid = 2;
let id; //商品id
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectIndexArray = []; //选择属性名字的数组
var selectAttrid = []; //选择的属性id
var a = [];
var ds = false;
let user;
let sex = 0; //判断是不是从立即购买打开的规格
let promotionType =1 //促销商品
let detail = [];
let currentPage =1;
let typeId = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: [],
    menuHeight: "", //菜单高度
    currentTab: 0, //预设当前项的值
    scrollTop: 0, //tab标题的滚动条位置
    allnum:'0',
    show1:false,
    show2:false,
    height:600,
    isgug: true, //规格
    typeName:'秒杀',
    distance:'0',//距离
    cart_num:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    storeid = options.id
    this.getbanner();
    this.getType();
    this.getstore();
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
  //购物车弹窗
  cart(){
    if(this.data.cart_num == 0){
      wx.showToast({
        title: '你还没有添加商品哦',
        icon:'none'
      })
    }else{
      this.setData({
        show2: !this.data.show2,
      })
    }
   
    
  },
  swichNav(e){
    var _this = this
    var index = e.currentTarget.dataset.current
    detail = []
    currentPage = 1
    if (index == 0) {
      promotionType = 1
      _this.getcdetail()
    } else if (index == 1) {
      promotionType = 2
      _this.getcdetail()
    } else if (index > 1) {
      typeId = e.currentTarget.id
      _this.getdetail()
    }
 
    this.setData({
       currentTab:index,
       typeName: this.data.tabbar[index].typeName
       })
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  showPopup2() {
    this.setData({ show2: true });
  },

  onClose2() {
    this.setData({ show2: false });
  },
  //提交订单
  submit(e){
    if(this.data.cart == ''){
      wx.showToast({
        title: '您还没有选择商品哦！',
        icon:'none'
      })
    } else if (this.data.sendFee > 0){
      wx.showToast({
        title: '你还差'+ this.data.sendFee + '元才能配送哦！',
        icon: 'none'
      })

    }else{
      wx.navigateTo({
        url: '../union/order_sure/order_sure?storeid=' + storeid + '&distance=' + this.data.distance,
      })
    }
   
  },
  //购物车加
  addCount_num(e){
    let that = this;

    let data = {
      productId: e.currentTarget.id
    }

    app.res.req('/sqshopcart/addbuycount', data, (res) => {

      if (res.status == 1000) {
        that.getcart()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //购物车减
  minusCount_num(e) {
    let that = this;

    let data = {
      productId: e.currentTarget.id
    }

    app.res.req('/sqshopcart/delbuycount', data, (res) => {

      if (res.status == 1000) {
        that.getcart()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //加入购物车
  addCount(e) {
    let that = this;

    let data = {
      productId:e.currentTarget.id
    }

    app.res.req('/sqshopcart/add', data, (res) => {
    
      if (res.status == 1000) {
        that.getcart()
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //清空购物车
  cleancart(e) {
    let that = this;

    let data = {
      storeId:storeid
    }

    app.res.req('/sqshopcart/cleancart', data, (res) => {

      if (res.status == 1000) {
        
        that.getcart()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //购物车列表
  getcart() {
    let that = this;

    let data = {
      storeId: storeid
    }

    app.res.req('/sqshopcart/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       
        var z_price = 0;
         if(res.data == ''){
           that.setData({
             cart_num: 0,
             show2: false
           })
         }else{
           var cart_num = 0;
           for (var i in res.data) {
             //购物车价格
             if (res.data[i].promotionType == 0) {
               z_price = z_price + res.data[i].salePrice * res.data[i].buyCount
             } else {
               z_price = z_price + res.data[i].activityPrice * res.data[i].buyCount
             }
             //购物车数量

             cart_num = Number(cart_num) + Number(res.data[i].buyCount)
             that.setData({
               cart_num,

             })
         }
         
        }
      
        that.setData({
          cart: res.data,
          z_price: z_price.toFixed(2),
          sendFee: (that.data.store.sendFee - z_price).toFixed(2)
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
    app.res.req('/home/personalcenteradvertise', data, (res) => {

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
  //类型
  getType() {
    let that = this;

    let data = {
      storeId: storeid,

    }

    app.res.req('/sqproduct/producttype', data, (res) => {
      console.log(res.data)

      if (res.status == 1000) {
        if (res.data == '') {

        } else {
          var tabb = [{
            typeName: '秒杀'
          },
          {
            typeName: '特价'
          },
          ]
          tabb.push(...res.data)
          that.setData({
            tabbar: tabb
          })
          that.getcdetail()
        }
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.showToast({
          title: '请重新登录',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //促销商品
  getcdetail() {
    let that = this;

    let data = {
      promotionType: promotionType,    
      storeId:storeid,
    }

    app.res.req('/sqproduct/promotionproduct', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       // detail.push(...res.data)
        that.setData({
          detail: res.data
        })
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //商品
  getdetail() {
    let that = this;

    let data = {
      typeId: typeId,
      storeId: storeid,
      currentPage: currentPage
    }

    app.res.req('/sqproduct/typeproduct', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          res.data[i].checked = false
          detail.push(res.data[i])
        }
        console.log(detail)
        that.setData({
          detail: detail
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //店铺详情
  getstore() {
    let that = this;

    let data = {
     storeId:storeid
    }

    app.res.req('/sqproduct/storedetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store:res.data
        })
        that.formSubmit();
        that.getcart();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //收藏店铺
  collection() {
    let that = this;

    let data = {
      storeId: storeid
    }

    app.res.req('/sqproduct/storedetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       wx.showToast({
         title: '收藏成功',

       })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //计算距离
  formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      // to: e.detail.value.dest, //终点坐标

      to: [{
        latitude: _this.data.store.latitude,
        longitude: _this.data.store.longitude
      }],
      success: function (res) {//成功后的回调
        // console.log(res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        if (dis < 1000) {
          dis = dis + "m"
        } else if (dis > 1000) {
          dis = (Math.round(dis / 100) / 10).toFixed(1) + "km"

        }
        console.log(dis)
        _this.setData({ //设置并更新distance数据
          distance: dis
        });

      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
})
