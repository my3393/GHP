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
let region='';//地区选择的名字
let searchKey = '';//筛选字
let product_id = '';
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
    region:'地区',
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
    this.getprov();
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
      currentPage = currentPage + 1
       this.getDetail();
      // if (this.data.pageIndex == 4) {
      //   this.setData({
      //     loadding: false,
      //     pullUpOn: false
      //   })
      // } else {
      //   let loadData = JSON.parse(JSON.stringify(this.data.detail));
      //   loadData = loadData.splice(0, 10)
      //   if (this.data.pageIndex == 1) {
      //     loadData = loadData.reverse();
      //   }
      //   this.setData({
      //     productList: this.data.productList.concat(loadData),
      //     pageIndex: this.data.pageIndex + 1,
      //     loadding: false
      //   })
      // }
    })
  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {
    detail =[]
  },
  //地区筛选
  btnDropChange: function (e) {
    
    let index = e.currentTarget.dataset.index;
    //let arr = JSON.parse(JSON.stringify(this.data.province));
 
      let arr = this.data.province
      this.setData({
        attrData: arr,
        attrIndex: index,
        dropScreenShow: true,
        tabIndex: 4
      }, () => {
        this.setData({
          scrollTop: 0
        })
      })
    
  },
  //地区选择
  btnSelected: function (e) {
    let index = e.currentTarget.dataset.index;
    let selected = `attrData[${index}].selected`;
    let attrData = this.data.attrData
   
   
    for(var i in this.data.attrData){
      if(i == index){
        attrData[i].selected = !this.data.attrData[i].selected
      }else{
        attrData[i].selected = false
      }
    }
    region = this.data.attrData[index].name
    this.setData({
      // [selected]: !this.data.attrData[index].selected
      attrData:attrData,
     
    })
    console.log(attrData)
  },
  reset() {
    let arr = this.data.attrData;
    for (let item of arr) {
      item.selected = false;
    }
    provinceId  = ''
    this.setData({
      attrData: arr,
      region:'地区'
    })
  },
  btnCloseDrop() {
    this.setData({
      scrollTop: 0,
      dropScreenShow: false,
       attrIndex: -1
    })
  },
  //地区确定选择
  btnSure: function () {
    let index = this.data.attrIndex;
    let arr = this.data.attrData;
   
    let attrName = "";
    //这里只是为了展示选中效果,并非实际场景
    for (let item of arr) {
      if (item.selected) {
        
        // attrName += attrName ? ";" + item.name : item.name;
        provinceId = item.id
        currentPage = 1
        detail = []
        this.setData({
          region:item.name
        })
        this.getDetail();
      }
     
    }
    // let isActive = `attrArr[${index}].isActive`;
    // let selectedName = `attrArr[${index}].selectedName`;
     this.btnCloseDrop();
    // this.setData({
    //   [isActive]: active,
    //   [selectedName]: attrName
    // })
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
    if(index == 0){
      this.setData({
        selectedName: '综合'
      })
    }else if(index == 1 || index == 2){
      this.setData({
        selectedName: '价格'
      })
    }else{
      this.setData({
        selectedName: '最新'
      })
    }
    this.setData({
      dropdownList: arr,
      // selectedName: index == 0 ? '综合' : '价格',
      selectH: 0
    })
    this.getDetail();
  },
  screen: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.showDropdownList();
    } else if (index == 1) {
      sortType = 4
      detail = [],
       currentPage = 1
      this.setData({
        tabIndex: 1
      })
      this.getDetail();
    } else if (index == 2) {
      this.setData({
        isList: !this.data.isList
      })
    } else if (index == 3) {
      this.getClass();
      this.setData({
        drawer: true
      })
    }
  },
  //类型选择
  product(e){
    let index = e.currentTarget.dataset.index;
   
    let attrData = this.data.className


    for (var i in attrData) {
      if (i == index) {
        attrData[i].selected = !this.data.className[i].selected
      } else {
        attrData[i].selected = false
      }
    }
    searchKey = attrData[index].classifyName,
      product_id = attrData[index].id
    this.setData({
      // [selected]: !this.data.attrData[index].selected
      className: attrData,
      
    })
  },
  product_reset(){
      searchKey = '';
    let attrData = this.data.className


    for (var i in attrData) {  
        attrData[i].selected = false
    }
    this.setData({
      className: attrData,
    })
  },
  closeDrawer: function () {
    if(product_id){
      
      this.setData({
        searchKey: searchKey
      })
      detail = [];
      currentPage = 1
      this.getDetail();
    }
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
         for(var i in res.data){
           res.data[i].selected = false
         }
       

        that.setData({
          province: res.data
        })
        console.log(that.data.province)
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
        if (res.data == '') {
          this.setData({
            loadding: false,

            pullUpOn: false
          })
        } else {
          detail.push(...res.data)
          that.setData({
            detail: detail,
            status: res.data.orderStatus
          })
        }



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
        for(var i in res.data){
          res.data[i].selected = false
        }
        that.setData({
          className: res.data,

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