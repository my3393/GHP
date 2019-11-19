// pages/store_detail/store_detail.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:[
      {name:'店铺',img:'../../images/store.png',imgs:'../../images/store_active.png'},
      {name:'特产分类',img:'../../images/switch.png',imgs:'../../images/tes_active.png'},
      {name:'特色介绍',img:'../../images/tsjs.png',imgs:'../../images/tsjs_active.png'},
      {name:'分享',img:'../../images/fenx.png',imgs:'../../images/fenx.png'},
    ],
    tar:'',
   Img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574139227810&di=19a2595df93625bf1bfcc027b4bcd79c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a22859b248a5a801211d25d63b72.jpg%401280w_1l_2o_100sh.jpg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
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
  tag(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index
    if(index == 3){

    }else{
      that.setData({
        tar:e.currentTarget.dataset.index
     })
    }
    
  }
})