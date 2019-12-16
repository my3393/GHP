const util = require('../../utils/util.js')
const app = getApp();
let currentPage = 1;
let provinceId = '';
let cityId = '';
let areaId = '';
let townId = '';
let classifyId = '';
let typeId = '';
let sortType = 0;
let keyword = '';
let detail = [];
Page({
  data: {
    searchKey: "", //搜索关键词
    width: 200, //header宽度
    height: 64, //header高度
    inputTop: 0, //搜索框距离顶部距离
    arrowTop: 0, //箭头距离顶部距离
    dropScreenH: 0, //下拉筛选框距顶部距离
    attrData: [],
    attrIndex: -1,
    dropScreenShow: false,
    scrollTop: 0,
    tabIndex: 0, //顶部筛选索引
    isList: false, //是否以列表展示  | 列表或大图
    drawer: false,
    drawerH: 0, //抽屉内部scrollview高度
    selectedName: "综合",
    selectH: 0,
    dropdownList: [{
      name: "综合",
      selected: true,
      id:'0'
    }, {
      name: "价格升序",
      selected: false,
      id:'3'
    }, {
      name: "价格降序",
      selected: false,
        id: '2'
      } ,{
        name: "最新",
        selected: false,
        id: '1'
      }],

    productList: [{
      img: 1,
      name: "欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）",
      sale: 599,
      factory: 899,
      payNum: 2342
    },
    {
      img: 2,
      name: "德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒",
      sale: 29,
      factory: 69,
      payNum: 999
    },
    {
      img: 3,
      name: "【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红",
      sale: 299,
      factory: 699,
      payNum: 666
    },
    {
      img: 4,
      name: "百雀羚套装女补水保湿护肤品",
      sale: 1599,
      factory: 2899,
      payNum: 236
    },
    {
      img: 5,
      name: "百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋",
      sale: 599,
      factory: 899,
      payNum: 2399
    },
    {
      img: 6,
      name: "短袖睡衣女夏季薄款休闲家居服短裤套装女可爱韩版清新学生两件套 短袖粉色长颈鹿 M码75-95斤",
      sale: 599,
      factory: 899,
      payNum: 2399
    },
    {
      img: 1,
      name: "欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜",
      sale: 599,
      factory: 899,
      payNum: 2342
    },
    {
      img: 2,
      name: "德国DMK进口牛奶",
      sale: 29,
      factory: 69,
      payNum: 999
    },
    {
      img: 3,
      name: "【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红",
      sale: 299,
      factory: 699,
      payNum: 666
    },
    {
      img: 4,
      name: "百雀羚套装女补水保湿护肤品",
      sale: 1599,
      factory: 2899,
      payNum: 236
    }
    ],
    pageIndex: 1,
    loadding: false,
    pullUpOn: true
  },
  onLoad: function (options) {
    console.log(options)
    
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      inputTop: obj.top + (obj.height - 30) / 2,
      arrowTop: obj.top + (obj.height - 32) / 2,
      searchKey: options.searchKey || ""
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            //略小，避免误差带来的影响
            dropScreenH: this.data.height * 750 / res.windowWidth + 186,
            drawerH: res.windowHeight - res.windowWidth / 750 * 100 - this.data.height
          })
        }
      })
    });
    this.getDetail()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let loadData = JSON.parse(JSON.stringify(this.data.productList));
    loadData = loadData.splice(0, 10)
    this.setData({
      productList: loadData,
      pageIndex: 1,
      pullUpOn: true,
      loadding: false
    })
    wx.stopPullDownRefresh()
  },
  /**
  * 页面上拉触底事件的处理函数
  */

  onReachBottom: function () {
    if (!this.data.pullUpOn) return;
    this.setData({
      loadding: true
    }, () => {
      if (this.data.pageIndex == 4) {
        this.setData({
          loadding: false,
          pullUpOn: false
        })
      } else {
        let loadData = JSON.parse(JSON.stringify(this.data.productList));
        loadData = loadData.splice(0, 10)
        if (this.data.pageIndex == 1) {
          loadData = loadData.reverse();
        }
        this.setData({
          productList: this.data.productList.concat(loadData),
          pageIndex: this.data.pageIndex + 1,
          loadding: false
        })
      }
    })
  },
  getDetail() {
    let that = this;
    let data = {
      currentPage: currentPage,
      provinceId: provinceId,
      cityId: cityId,
      areaId: areaId,
      townId: townId,
      classifyId: classifyId,
      typeId: typeId,
      sortType: sortType,
      keyword: that.data.searchKey
    }

    app.res.req('app-web/product/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        detail.push(...res.data)
        that.setData({
          detail: detail,
          status: res.data.orderStatus
        })



      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
  getClass() {
    let that = this;
    let data = {

    }
    app.res.req("app-web/home/classify", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          className: res.data,

        })
        that.getDetail();
        that.getType();
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
  btnDropChange: function (e) {
    let index = e.currentTarget.dataset.index;
    let arr = JSON.parse(JSON.stringify(this.data.attrArr[index].list));
    if (arr.length === 0) {
      let isActive = `attrArr[${index}].isActive`;
      this.setData({
        [isActive]: !this.data.attrArr[index].isActive
      })
    } else {
      let isActive = `attrArr[${index}].isActive`;
      this.setData({
        attrData: arr,
        attrIndex: index,
        dropScreenShow: true,
        [isActive]: false
      }, () => {
        this.setData({
          scrollTop: 0
        })
      })
    }
  },
  btnSelected: function (e) {
    let index = e.currentTarget.dataset.index;
    let selected = `attrData[${index}].selected`;
    this.setData({
      [selected]: !this.data.attrData[index].selected
    })
  },
  reset() {
    let arr = this.data.attrData;
    for (let item of arr) {
      item.selected = false;
    }
    this.setData({
      attrData: arr
    })
  },
  btnCloseDrop() {
    this.setData({
      scrollTop: 0,
      dropScreenShow: false,
      attrIndex: -1
    })
  },
  btnSure: function () {
    let index = this.data.attrIndex;
    let arr = this.data.attrData;
    let active = false;
    let attrName = "";
    //这里只是为了展示选中效果,并非实际场景
    for (let item of arr) {
      if (item.selected) {
        active = true;
        attrName += attrName ? ";" + item.name : item.name
      }
    }
    let isActive = `attrArr[${index}].isActive`;
    let selectedName = `attrArr[${index}].selectedName`;
    this.btnCloseDrop();
    this.setData({
      [isActive]: active,
      [selectedName]: attrName
    })
  },
  showDropdownList: function () {
    this.setData({
      selectH: 320,
      tabIndex: 0
    })
  },
  hideDropdownList: function () {
    this.setData({
      selectH: 0
    })
  },
  dropdownItem: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let arr = this.data.dropdownList;
    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        arr[i].selected = true;
      } else {
        arr[i].selected = false;
      }
    }
    sortType = e.currentTarget.id
    detail =[],
    currentPage = 1
    this.setData({
      dropdownList: arr,
      selectedName: index == 0 ? '综合' : '价格',
      selectH: 0
    })
    this.getDetail();
  },
  screen: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.showDropdownList();
    } else if (index == 1) {
      this.setData({
        tabIndex: 1
      })
    } else if (index == 2) {
      this.setData({
        isList: !this.data.isList
      })
    } else if (index == 3) {
      this.setData({
        drawer: true
      })
    }
  },
  closeDrawer: function () {
    this.setData({
      drawer: false
    })
  },
  back: function () {
    if (this.data.drawer) {
      this.closeDrawer()
    } else {
      wx.navigateBack()
    }
  },
  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  detail: function (e) {
    wx.navigateTo({
      url: '../good_detail/good_detail?id='+ e.currentTarget.id
    })
  },
  //省
  getprov: function () {

   
    let that = this;
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('app-web/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

       

        that.setData({
          province: res.data
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
})