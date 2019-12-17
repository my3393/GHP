// pages/wallet_detail/wallet_detail.js
const app = getApp();
let detail=[];
let currentPage=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:[
      { name: '全部',id:'0' },
      {name:'待结算',id:'1'},
      {name:'已结算',id:'2'},
      {name:'已提现',id:'3'},

    ],
    tar:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.id == 2){
       this.setData({tar:2})
       this.getHas();
     }
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
  getHas() {
    let that = this;
    let data = {
      currentPage
    }

    app.res.req("app-web/user/settlementlist", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       detail.push(...res.data)
       that.setData({
         detail:detail
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
})