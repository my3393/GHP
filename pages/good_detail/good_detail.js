const App = getApp();
Page({
  data: {
     istag:true,
     is_top:true,
     issrcoll:'1',
     loading:false,
    photos: [
      "https://graph.baidu.com/resource/11629b5b21495fc38faf001572947644.jpg",
      "https://graph.baidu.com/resource/116e3b442899944bd09e901572947676.jpg",
      "https://graph.baidu.com/resource/116b9dee63af0f77fcb8f01572947716.jpg",
      "https://graph.baidu.com/resource/1168b577d0799dcb13b6901572947760.jpg",
    ],
    //数据格式
    result: {
      "goods": {
        "unit": "件",
        "goods_id": 436886,
        "store_count": 158,
        "market_price": "10.00",
        "shop_price": "0.01",
        "cost_price": "10.00",
        "goods_name": "小龙虾221",
        "original_img": "http://boweisou.oss-cn-shenzhen.aliyuncs.com/images/170/2018/06/o49599VttZZU84VkczGt1j9t5Tcu4t.jpg",
        "goods_attr_list": [],
        "goods_spec_list": [
          [{
              "spec_name": "颜色",
              "item_id": 535385,
              "item": "白色",
              "src": "",
              "isClick": 0
            },
            {
              "spec_name": "颜色",
              "item_id": 535386,
              "item": "黑色",
              "src": "",
              "isClick": 0
            }
          ],
          [{
              "spec_name": "尺寸",
              "item_id": 535692,
              "item": "170",
              "src": "",
              "isClick": 0
            },
            {
              "spec_name": "尺寸",
              "item_id": 535693,
              "item": "180",
              "src": "",
              "isClick": 0
            }
          ],
          [{
              "spec_name": "哈哈",
              "item_id": 552569,
              "item": "去",
              "src": "",
              "isClick": 0
            },
            {
              "spec_name": "哈哈",
              "item_id": 552570,
              "item": "不",
              "src": "",
              "isClick": 0
            }
          ]
        ]
      },
      "spec_goods_price": [{
          "id": 1018269,
          "key": "535385_535692_552569",
          "price": "10.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018270,
          "key": "535385_535692_552570",
          "price": "20.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018271,
          "key": "535385_535693_552569",
          "price": "30.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018272,
          "key": "535385_535693_552570",
          "price": "40.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018273,
          "key": "535386_535692_552569",
          "price": "50.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018274,
          "key": "535386_535692_552570",
          "price": "60.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018275,
          "key": "535386_535693_552569",
          "price": "70.00",
          "productprice": "0.00",
          "store_count": 20
        },
        {
          "id": 1018276,
          "key": "535386_535693_552570",
          "price": "80.00",
          "productprice": "0.00",
          "store_count": 18
        }
      ],
      "goods_attr_list": [],
      "comment": [],
    },
    //微信小程序动画
    animationData: {},
    animationisno: false,
    guilist: {},
    arrId: [],
    arrName: [],
    textStates: ["view-btns-text-normal", "view-btns-text-select"],
    num:1,
    current: 0
  },
  
  onLoad: function(options) {
    this.setData({
      navH: App.globalData.navHeight
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    let that = this;
    let guilists = that.data.guilist;
    guilists.price = that.data.result.goods.shop_price;
    guilists.store_count = that.data.result.goods.store_count;
    that.setData({
      goodsList: that.data.result.goods,
      goods_spec: that.data.result.goods.goods_spec_list,
      spec_goods_price: that.data.result.spec_goods_price,
      guilist: guilists
    })
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
  swiperChange: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current
      })
    }
  }, 
  // 查看评价
  evaluation(){
    wx.navigateTo({
      url: '../goods_evaluation/goods_evaluation',
    })
  },
  //分享弹窗
  off_order(){
    console.log(111)
    let that =this;
    this.setData({ istag: !that.data.istag });
    console.log(that.data.istag)
  },
  // 购买
  buy(){
    let that = this;
    that.setData({
      loading:!that.data.loading
    })
  },
  // 滚轮显示
  onPageScroll: function (e) {
    console.log(e.scrollTop)
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
    if(e.scrollTop < 400){
      
      that.setData({
        issrcoll:1
      })  
    }else if(400 < e.scrollTop && e.scrollTop < 700){

      that.setData({
        issrcoll:2
      })
     
    }else if(700 < e.scrollTop){
     
      that.setData({
        issrcoll:3
      })
    }
  }
})
