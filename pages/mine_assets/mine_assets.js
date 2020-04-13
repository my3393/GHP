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
       { name: '资产状态' },
       {name:'待领取资产'},
       {name:'资产说明'}
     ],
     tar:1,
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
      if(that.data.tar == 0){
        
        that.getzhuan();
      }else if(that.data.tar == 1){
        that.getdai();
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
    if(index == 0){
      card = []
      that.getzhuan()
    }else if(index == 1){
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
  //领取
  lingqu(e) {
    let that = this;
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

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
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

})