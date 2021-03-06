// pages/store_detail/store_detail.js
const app = getApp();
let id;
let currentPage =1;
let type= 0;
let keyword = '';
let productType = 0;
let list = [];
let rich;
let userid;
let storeid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:true,
    istop: true,
    ress:'',
    istag:true,
    code: '../../images/ma.png', //如果是服务器图片一定要先下载到本地
    imgSrc: '',
    iscanvan:true,
    canva:true,
    ismask:true,
    res:'你的',
    tas:'0',
    value:'',
    tag:[
      {name:'店铺',img:'../../images/store.png',imgs:'../../images/store_active.png'},
      {name:'特产分类',img:'../../images/switch.png',imgs:'../../images/tes_active.png'},
      {name:'特色介绍',img:'../../images/tsjs.png',imgs:'../../images/tsjs_active.png'},
      // {name:'分享',img:'../../images/fenx.png',imgs:'../../images/fenx.png'},
    ],
    tar:'',
   Img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574139227810&di=19a2595df93625bf1bfcc027b4bcd79c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a22859b248a5a801211d25d63b72.jpg%401280w_1l_2o_100sh.jpg",
  },
  fenx(){

     let that =this;
   this.setData({ istag: !that.data.istag });
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
     var that = this
    if (options.storeid){
        
      id = options.storeid
    }else{
      id = options.id
    }
    if (options.userid) {
      userid = options.userid
      wx.setStorageSync('bangId', userid)
      
    }
    if (options.storeid) {
      storeid = options.storeid
      wx.setStorageSync('storeid', storeid)
      
    }
    
    wx.showLoading({
      title: '加载中',
    })
    this.getStore();

    this.setData({
      navH: app.globalData.navHeight
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
    let that = this
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        console.log(res.data)
        that.setData({
          user: res.data
        })
      },
    })
    if (wx.getStorageSync('bangId')) {
      that.Bang();
    }
    if (wx.getStorageSync('storeid')) {
      that.Bang_store();
    }
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
    list= []
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
     currentPage = currentPage + 1;
     this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '您的好友' + that.data.user.userName + '向您推荐了一个非常棒的特产店铺，点击立即进入' ,
      path: '/pages/store_detail/store_detail?storeid=' + id + '&userid=' + that.data.user.id,

    }
  },
  //分类选择

  sous(e){
    wx.navigateTo({
      url: '../productList/producList?searchKey=' + e.currentTarget.dataset.name + '&typeId=' + e.currentTarget.id + '&storeId=' + id,
    })
  },
  //搜索
  bindconfirm(e) {
    console.log(e.detail.value)
    if (e.detail.value != '') {
      wx.navigateTo({
        url: '../productList/producList?searchKey=' + e.detail.value + '&storeId=' + id + '&sea=' + 1,
      })
    }
  },
  value(e){
     console.log(e.detail.value)
     this.setData({
       value:e.detail.value
     })
  },
  dete(e){
    console.log('删除')
    this.setData({
      value:''
    })
  },

  //商品详情
  good_detail(e){
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.id,
    })
  },
  //收藏店铺
  collection(){
    let that = this;
    let data = {
      storeId: id
    }
    if (that.data.store.isCollection == 0){
      app.res.req("/store/collection", data, (res) => {
        console.log(res.data)
        if (res.status == 1016) {
          wx.showToast({
            title: '已关注',
            icon: 'none'
          })
          list = []
          that.getStore();


        } else if (res.status == 1017) {
          wx.showToast({
            title: '取消关注',
            icon: 'none'
          })
          list = []
          that.getStore();


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
    }else{
      wx.showModal({
        title: '提示',
        content: '取消关注将无法在我的收藏中快捷进入店铺',
        success(res) {
          if (res.confirm) {
            app.res.req("/store/collection", data, (res) => {
              console.log(res.data)
              if (res.status == 1016) {
                wx.showToast({
                  title: '已关注',
                  icon: 'none'
                })
                list = []
                that.getStore();


              } else if (res.status == 1017) {
                wx.showToast({
                  title: '取消关注',
                  icon: 'none'
                })
                list = []
                that.getStore();


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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  //返回上一页
  navBack(){
    wx.navigateBack({
      data:1
    })
  },
  //店铺详情
  getStore() {
    let that = this;
    let data = {
      storeId: id,
      currentPage: currentPage,
      type: type,
      keyword: keyword,
      productType: productType,
    }

    app.res.req("/store/detail", data, (res) => {
      console.log(res.data +'店铺详情' )
      if (res.status == 1000) {
        console.log('店铺详情')
        that.setData({
          store: res.data,
          Img: res.data.storeBackgroundImgOss
        })
        that.getCommed();
        that.getList();
        that.gettype();
        wx.hideLoading()
        if (res.data.introduce != null) {
          rich = res.data.introduce.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
          that.setData({
            rich: rich
          })
        }
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {

        wx.redirectTo({
          url: '../login/login?storeid=' + id + '&userid=' + userid,
          
        })
        
        var url= '../store_detail/store_detail?storeid=' + id + '&userid=' + userid
        wx.setStorageSync('url',url)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //商品分类
  gettype() {
    let that = this;
    let data = {
      storeId: id,

    }

    app.res.req("/store/producttype", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          type: res.data
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
  paix(e){
    if (e.currentTarget.id == 1 && type == 1){
      type = 2
    }else{
      type = e.currentTarget.id;
    }
    if (e.currentTarget.id == 3){
      this.setData({
        tas: 2
      })
    } else if (e.currentTarget.id == 4) {
      this.setData({
        tas: 3
      })
    }else{
      this.setData({
        tas: e.currentTarget.id
      })
    }

    currentPage = 1;
    list = [];
    this.getList();
  },
  //商品列表

  getList() {
    let that = this;
    let data = {
      storeId: id,
      currentPage: currentPage,
      type: type,
      keyword: keyword,
      productType: productType
    }

    app.res.req("/store/productlist", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        list.push(...res.data)
        that.setData({
          list: list
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
  //店铺推荐
  getCommed() {
    let that = this;
    let data = {
      storeId:id
    }

    app.res.req("/store/recommendproduct", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store_recommended: res.data,
          load:false,
        })
        wx.hideLoading()
        console.log('店铺推荐')
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
  //绘制海报
  huizi(){
    this.canvasPoster(this.data.code);
    this.setData({
      iscanvan:false,
      istag:!this.data.istag,
      ismask:false
    })
  },
  //取消分享
  qufenx(){
    this.setData({
      iscanvan:true,
      ismask:true
    })
  },
 
  canvasWorkBreak(maxWidth, fontSize, text) {
    const maxLength = maxWidth / fontSize
    const textLength = text.length
    let textRowArr = []
    let tmp = 0
    while(1) {
      textRowArr.push(text.substr(tmp, maxLength))
      tmp += maxLength
      if (tmp >= textLength) {
        return textRowArr
      }
    }
  },
  tag(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index
    if(index == 3){
       that.fenx()
    }else{
      that.setData({
        tar:e.currentTarget.dataset.index
     })
    }

  },
  onPageScroll: function (e) {
    console.log(e.scrollTop)
    let that = this
    if (e.scrollTop > 200) {

      that.setData({
        ress: '#fff',
      })
    } else {

      that.setData({
        ress:''
      })
    }

  },
  //绑定
  Bang() {
    let that = this;
    let data = {
      id: userid
    }

    app.res.req("/user/sharebinduser", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })
        wx.removeStorageSync('bangId')

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
        wx.removeStorageSync('bangId')
        console.log('----2018----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('bangId')
        console.log('----1030----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bangId')
        console.log('----已经绑定----')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //绑定
  Bang_store() {
    let that = this;
    let data = {
      storeId: storeid
    }

    app.res.req("/user/sharebindstore", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })
        wx.removeStorageSync('storeid')

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
        wx.removeStorageSync('bangId')
        console.log('----2018----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('bangId')
        console.log('----1030----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bangId')
        console.log('----已经绑定----')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
})