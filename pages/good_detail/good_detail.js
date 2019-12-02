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
Page({
  data: {
    naviga: true,
    istag: true,
    is_top: true,
    issrcoll: '1',
    loading: false,
    photos: [
      "https://graph.baidu.com/resource/11629b5b21495fc38faf001572947644.jpg",
      "https://graph.baidu.com/resource/116e3b442899944bd09e901572947676.jpg",
      "https://graph.baidu.com/resource/116b9dee63af0f77fcb8f01572947716.jpg",
      "https://graph.baidu.com/resource/1168b577d0799dcb13b6901572947760.jpg",
    ],

    //微信小程序动画
    animationData: {},
    animationisno: false,
    guilist: {},
    arrId: [],
    arrName: [],
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    num: 1,
    current: 0
  },

  onLoad: function(options) {
    console.log(options)
    this.setData({
      navH: app.globalData.navHeight
    })
    id = options.id
    this.getDetail();
    this.getSku()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.top1').boundingClientRect(function(rect) {


      top1 = rect.top

    }).exec();
    query.select('.top2').boundingClientRect(function(rect) {


      top2 = rect.top

    }).exec();
  },
  selectGuige(e) {
    let that = this,
      // 获取第一个循环的index
      fuindex = e.currentTarget.dataset.fuindex,
      // 获取第二个循环的index
      chindex = e.currentTarget.dataset.chindex,
      // 获取当前点击的id
      selectId = e.currentTarget.dataset.id,
      // 获取当前点击的规格名称
      selectName = e.currentTarget.dataset.item,
      //  初始化arrId
      arrId = that.data.arrId,
      //  初始化arrName
      arrName = that.data.arrName,
      guilists = {},
      goods_spec = that.data.goods_spec;
    // 通过循环来判断点击了哪一个规格，根据数据结构来；
    // goods_spec[fuindex]根据fuindex来判断点击了哪一种类型的规格
    for (let i = 0; i < goods_spec[fuindex].length; i++) {
      // 当i等于当前点击的规格时，设置isClick=1
      if (i == chindex) {
        goods_spec[fuindex][i].isClick = 1;
      }
      // 否则设置其他的isClick=0
      else {
        goods_spec[fuindex][i].isClick = 0;
      }
    };
    // 把点击的规格名称和规格id存起来
    arrId[fuindex] = selectId;
    arrName[fuindex] = selectName;
    // 拼接规格id，（后台返回的数据是这个）
    let selectGuigeId = arrId.join('_');
    for (let i = 0; i < that.data.spec_goods_price.length; i++) {
      // 找对应的规格组合
      if (that.data.spec_goods_price[i].key == selectGuigeId) {
        guilists = that.data.spec_goods_price[i];
      }
    }
    that.setData({
      goods_spec: goods_spec,
      arrId,
      guilist: guilists,
      selectGuigeName: arrName
    })
  },
  numChange(e) {
    this.setData({
      num: e.detail.value
    })
  },
  queDing() {
    let that = this;
    let selectguigeid = that.data.arrId.join('_');
    for (let i = 0; i < that.data.spec_goods_price.length; i++) {
      // 判断是否选择规格
      if (that.data.spec_goods_price[i].key == selectguigeid) {
        wx.showModal({
          showCancel: false,
          content: '选择成功',
          success: function(res) {}
        });
        // 判断库存是否充足
        if (selectguigeid.store_count <= 0) {
          wx.showModal({
            showCancel: false,
            content: '库存不足',
            success: function(res) {}
          });
        }
        // 两种情况满足跳转
        else {
          wx.showModal({
            showCancel: false,
            content: '跳转页面',
            success: function(res) {}
          });
        }
        return
      } else {
        wx.showModal({
          showCancel: false,
          content: '请选择规格',
          success: function(res) {
            if (res.confirm) {}
          }
        })
      }
    }
  },
  // 选择规格页面弹出   微信小程序动画
  guigeselect: function() {
    let that = this;
    let animal1 = wx.createAnimation({
      timingFunction: 'ease-in'
    }).translate(0, -600).step({
      duration: 300
    })
    that.setData({
      animationData: animal1.export(),
    })
  },
  // 选择规格页面隐藏   微信小程序动画
  guigeno: function() {
    let that = this
    let animal1 = wx.createAnimation({
      timingFunction: 'ease-in'
    }).translate(0, 600).step({
      duration: 300
    })
    that.setData({
      animationData: animal1.export()
    })
  },
  swiperChange: function(e) {
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current
      })
    }
  },

  //规格选择
  pack: function(e) {
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
          that.setData({
            price: that.data.sku[i].price,
            goodId: that.data.sku[i].id
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
  //收藏
  Collection() {
    let that = this;
    let data = {
      productId: id
    }

    app.res.req("app-web/product/collection", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
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
          spec: res.data.specificationItems
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
  //返回上一页
  navBack() {
    wx.navigateBack({
      data: 1
    })
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
  // 购买
  buy() {
    let that = this;
    that.setData({
      loading: !that.data.loading
    })
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
  onPageScroll: function(e) {

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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
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
    // a = [];
    detail_id;
    ds = false;
  },

})