// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     photos:[
       "https://graph.baidu.com/resource/11629b5b21495fc38faf001572947644.jpg",
       "https://graph.baidu.com/resource/116e3b442899944bd09e901572947676.jpg",
       "https://graph.baidu.com/resource/116b9dee63af0f77fcb8f01572947716.jpg",
       "https://graph.baidu.com/resource/1168b577d0799dcb13b6901572947760.jpg",
     ],
     tag: [
      { id: 1, name: '水果' },
      { id: 2, name: '农副产品' },
      { id: 3, name: '生鲜' },
      { id: 4, name: '赛事动态' },
     
    ],
    idx:'',
    tar:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //商品切换
  tag: function (e) {
    var that = this;
    let conut = '';
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    console.log(e.currentTarget.dataset.num);
     
   
    this.setData({ tapTime: nowTime });
    
    that.setData({
      isSearch: false,
      index: e.currentTarget.dataset.num,
      tar: e.currentTarget.dataset.num,
      tab: e.currentTarget.dataset.num,
      // player:[],
      // ranklist:[],
      // dynamic:[],
    })
    
    
    
  },
})