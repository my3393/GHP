// pages/welfare_det/welfare_det.js
const app = getApp();
let top1 = '';
let top2 = '';
let id;
let ranklist = [];
let currentPage = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    isrank:true,//排名多少显示
    isvote:true,
    ranklist:[],
    buzu:true,//一杯不足
    is_top: true,
    issrcoll: '1',
    iscanvan: true,
    code: '../../images/ma.png', //如果是服务器图片一定要先下载到本地
    ismask: true,
    istag:true,
    num:0,
    list:[],
    love_num:0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id
    this.setData({
      navH: app.globalData.navHeight
    })
    this.getDetail();
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
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.top1').boundingClientRect(function (rect) {
      

      top1 = rect.top

    }).exec();
    query.select('.top2').boundingClientRect(function (rect) {
      

      top2 = rect.top

    }).exec();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    ranklist = []
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
  //去首页
  home(){
     wx.navigateTo({
       url: '../e_home/home',
     })
  },
  //取消
  cance(){
    this.setData({
      ismask: !this.data.ismask,
      isvote: !this.data.isvote
    })
  },
  //确定
  que2(){
    
    this.setData({
      ismask: !this.data.ismask,
      buzu: !this.data.buzu
    })
  },
  que() {
    this.getVote();
    this.setData({
      ismask: !this.data.ismask,
      isvote: !this.data.isvote
    })
  },
  vote(){
    this.getvalue();
    this.setData({
      ismask:!this.data.ismask,
      isvote:!this.data.isvote
    })
  },
  //艺呗值
  getvalue() {
    let that = this;
    let data = {
     

    }

    app.res.req("/app-web/member/voteyb", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         that.setData({
           yb_value: res.data.parameterValue
         })

      } else if (res.status == 1004 || res.status == 1005) {
        wx.redirectTo({
          url: '../login/login',
        })
      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  getVote(){
    let that = this;
    let data = {
      projectId: id,

    }

    app.res.req("app-web/project/projectvote", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        
        
      } else if (res.status == 1004 || res.status == 1005) {
        wx.redirectTo({
          url: '../login/login',
        })
      }else if(res.status == 1027){
         that.setData({
           buzu:!that.data.buzu,
           ismask:!that.data.ismask
         })
          
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //投票列表
  getranklist() {
    let that = this;
    let data = {
      projectId: id,
      currentPage
    }

    app.res.req("app-web/project/votelist", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        //  if(res.data.length < 3){
        //    that.setData({
        //      ranklist: res.data,
             
        //    })
        //  }else{
        //    if (that.data.currentPage == 1) {
        //      that.setData({
        //        top_1: res.data.data.splice(0, 1)[0],
        //        top_2: res.data.data.splice(0, 1)[0],
        //        top_3: res.data.data.splice(0, 1)[0],

        //      })
        //    }
        let num = 0
        for(var i in res.data){
          num = res.data[i].voteNum+ num
        }
        ranklist.push(...res.data)
           that.setData({
             ranklist: ranklist,
             love_num:num
            
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
  //商品详情
  getDetail() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req("app-web/project/detail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.raiseAmount != 0) {
          let num = ((res.data.raiseAmount) / (res.data.targetAmount) * 100)
          that.setData({
            num: num.toFixed(2)
          })
          console.log(num)
        }
        that.getList();
        that.getranklist();
        that.setData({
          detail: res.data,
        
        })
        console.log(res.data.infoImgOss)
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
  //项目公式
  
  getList() {
    let that = this;
    let data = {
      projectId: id,
      currentPage:1
    }

    app.res.req("app-web/project/publicitylist", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getPai();
        that.setData({
          list: res.data,
         
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
  //项目排名
  getPai() {
    let that = this;
    let data = {
      projectId: id,
      
    }

    app.res.req("app-web/project/projectrank", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          pai: res.data,

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
  swiperChange: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current
      })
    }
  },
  //查看更多
  gend: function (e) {
    let that = this
    this.setData({
      isduo: !that.data.isduo,
    })
  },
  //返回上一页
  navBack(){
    wx.navigateBack({
      data:1
    })
  },
  move() {

  },
  // 滚轮显示
  scrollto() {
    wx.pageScrollTo({
      scrollTop: 301,
      duration: 300
    })
  },
  scrollto1() {
    wx.pageScrollTo({
      selector: '.top1',
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
   // console.log(e.scrollTop)
    let that = this
    if (e.scrollTop > 300) {

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
    } else if (top1 - 10 < e.scrollTop && e.scrollTop < top2 - 10) {

      that.setData({
        issrcoll: 2
      })

    } else if (top2 - 10 < e.scrollTop) {
     
      that.setData({
        issrcoll: 3
      })
    }
  },
  // 分享
  fenx() {
    let that = this;
    this.setData({ istag: !that.data.istag });
  },
  //绘制海报
  huizi() {
    this.canvasPoster(this.data.code);
    this.setData({
      iscanvan: false,
      istag: !this.data.istag,
      ismask: false
    })
  },
  //取消分享
  qufenx() {
    this.setData({
      iscanvan: true,
      ismask: true
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
    ctx.fillRect(0, 0, 400, 450, 40);
    ctx.arc(360, 40, 40, Math.PI * 2, Math.PI * 1.5)
    ctx.clip();
    ctx.setFontSize(12);
    ctx.setFillStyle('#666666');
    ctx.fillText('用户名', 70, 30);
    ctx.setFillStyle('#333333');
    ctx.fillText('给您推荐了一个待资助的项目', 130, 50);
    ctx.drawImage('../../images/tui.jpg', 15, 70, 220, 200);
    //动态生成的小程序码（ps：网络图片一定要先下载到本地）
    ctx.drawImage(code, 20, 280, 60, 60);
    ctx.setFontSize(10);
    ctx.setTextAlign('center');
    ctx.setFillStyle('#333333');
    ctx.fillText('长按图片识别，立即查看', 140, 300);
    ctx.setFillStyle('#999');
    ctx.fillText('分享自 善家购', 115, 325);
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
    while (1) {
      textRowArr.push(text.substr(tmp, maxLength))
      tmp += maxLength
      if (tmp >= textLength) {
        return textRowArr
      }
    }
  },
})