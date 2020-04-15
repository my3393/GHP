// pages/mine_assets/mine_assets.js
const app = getApp();
let card = [];
let cards = [];
let currentPage=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tag:[
       { name: '待领取资产' },
       { name: '资产状态' },
       {name:'资产说明'}
     ],
     tar:0,
    modal: false,
    modal2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getdai();
     this.getnum();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     card = [];
     cards = [];
     currentPage = 1;
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
      let that  = this;
      currentPage = currentPage + 1
      if(that.data.tar == 1){
        
        that.getzhuan();
      }else if(that.data.tar == 0){
        that.getdai();
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jihuo() {
    this.setData({
      modal: true,
    })
  },
  hide() {
    this.setData({
      modal: false
    })

  },
  handclick() {
    this.hide()
    if (this.data.num == 0) {
      this.setData({
        modal2: true
      })
    } else {
      this.active()
    }
    
  },
  hide2() {
    this.setData({
      modal2: false
    })

  },
  handclick2(e) {
    this.setData({
      memberType: 1
    })
    

    this.hide2()
  },
  //转赠
  zhuanz() {
    wx.navigateTo({
      url: '../assets_expel/assets_expel',
    })
  },
  //明细
  minx() {
    wx.navigateTo({
      url: '../assets_mx/assets_mx',
    })
  },
  tag(e){
    let that = this;
    console.log(e)
    var index = e.currentTarget.dataset.index
    currentPage = 1
    if(index == 1){
      card = []
      that.getzhuan()
    }else if(index == 0){
      cards = []
      that.getdai();
    }
    this.setData({
      tar:e.currentTarget.dataset.index
    })
  },
  //张数
  getnum() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/findcardnum', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          num: res.data
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //激活会员卡
  active() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/activatecard', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getnum();
        that.getuser();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //领取
  lingqu(e) {
    let that = this;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 800) {
      console.log('阻断')
      return;
    }

   

    let data = {
      receiveId: e.currentTarget.id
    }

    app.res.req('/membercard/receivecard', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getnum();
        currentPage = 1;
        cards = []
        that.getdai();
        wx.showToast({
          title: '领取成功',
          icon:'none',
          mask:true
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  //状态
  getzhuan(e) {
    let that = this;
    let data = {
      memberType: 1,
      currentPage: currentPage
    }
    app.res.req('/membercard/sendcardrecord', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if(res.data == ''){
          wx.showToast({
            title: '已经没有了哦',
            icon:'none'
          })
        }else{
          card.push(...res.data)
          that.setData({
            card: card
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
  //待领取
  getdai(e) {
    let that = this;
    let data = {
      memberType:1,
      currentPage: currentPage
    }

    app.res.req('/membercard/receivecardrecord', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data == '') {
          wx.showToast({
            title: '已经没有了哦',
            icon: 'none'
          })
        } else{
          cards.push(...res.data)
          that.setData({
            cards: cards
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
  //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('/user/info', data, (res) => {
      console.log(res.data)
      wx.hideLoading()
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })
        that.setData({
          user: res.data,

        })

      }
    })
  },
})