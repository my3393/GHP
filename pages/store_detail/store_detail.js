// pages/store_detail/store_detail.js
const app = getApp();
let id;
let currentPage =1;
let type= 0;
let keyword = '';
let productType = 0;
let list = [];
let rich;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    tag:[
      {name:'店铺',img:'../../images/store.png',imgs:'../../images/store_active.png'},
      {name:'特产分类',img:'../../images/switch.png',imgs:'../../images/tes_active.png'},
      {name:'特色介绍',img:'../../images/tsjs.png',imgs:'../../images/tsjs_active.png'},
      {name:'分享',img:'../../images/fenx.png',imgs:'../../images/fenx.png'},
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
    id = options.id
    this.getStore();
    this.getCommed();
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

  },
  sous(e){
    wx.navigateTo({
      url: '../productList/producList?searchKey=' + e.currentTarget.dataset.name + '&typeId=' + e.currentTarget.id,
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
      productId: id
    }

    app.res.req("app-web/store/collection", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       


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

    app.res.req("app-web/store/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       
        that.setData({
          store: res.data
        })
       that.getList();
        that.gettype();
        if (res.data.introduce != null) {
          rich = res.data.introduce.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
          that.setData({
            rich: rich
          })
        }
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
  //商品分类
  gettype() {
    let that = this;
    let data = {
      storeId: id,
     
    }

    app.res.req("app-web/store/producttype", data, (res) => {
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
    type = e.currentTarget.id;
    this.setData({
      tas:e.currentTarget.id
    })
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

    app.res.req("app-web/store/productlist", data, (res) => {
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
  canvasPoster(code) { //canvas绘制图片，code是动态小程序码，可看我上一篇文章
    wx.showLoading({
      icon: 'loading',
      title: '海报制作中',
    })
    let that = this;
    let ctx = wx.createCanvasContext('posterCanvas', this);
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, 400, 450,40);
    ctx.arc(360, 40, 40, Math.PI*2, Math.PI * 1.5)
    ctx.clip();
    ctx.setFontSize(12);
    ctx.setFillStyle('#666666');
    ctx.fillText('用户名', 50, 30);
    ctx.setFillStyle('#333333');
    ctx.fillText('给您推荐了一个热门的店铺', 50, 50);
    ctx.drawImage('../../images/tui.jpg', 15, 70, 220, 200);
    //动态生成的小程序码（ps：网络图片一定要先下载到本地）
    ctx.drawImage(code, 20, 280, 60, 60);
    ctx.setFontSize(10);
    ctx.setTextAlign('center');
    ctx.setFillStyle('#333333');
    ctx.fillText('长按图片识别，立即进店', 140, 300);
    ctx.setFillStyle('#999');
    ctx.fillText('分享自 善家购特产商城', 140, 325);
    ctx.setFillStyle('#000000');
    ctx.save();
    ctx.beginPath();
    ctx.arc(30, 35, 15, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage('../../images/head.png', 15, 20, 30, 30); //头像我是用的本地图片
    ctx.restore();
    ctx.setFontSize(30);
    wx.hideLoading()
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({ //将canvas生成图片
        width: 280,
        height: 450,
        canvasId: 'posterCanvas',
        fileType: 'png',
        success: (canvasImgRes) => {
         
          this.setData({
            imgSrc: canvasImgRes.tempFilePath
          });
        }
      }, this);
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
})