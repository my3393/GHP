// pages/e_specialty/e_specialty.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [
      "https://graph.baidu.com/resource/11629b5b21495fc38faf001572947644.jpg",
      "https://graph.baidu.com/resource/116e3b442899944bd09e901572947676.jpg",
      "https://graph.baidu.com/resource/116b9dee63af0f77fcb8f01572947716.jpg",
      "https://graph.baidu.com/resource/1168b577d0799dcb13b6901572947760.jpg",
    ],
    currentTab: 0,  //对应样式变化
    scrollTop: 0,  //用作跳转后右侧视图回到顶部
    screenArray: [], //左侧导航栏内容
    screenId: "",  //后台查询需要的字段
    childrenArray: [], //右侧内容
  },

  onLoad: function (options) {
    var that = this;
    //获得分类筛选
    // request.sendRrquest(API_queryClassify, 'POST', { flag: 0 })
    //   .then(function (res) {
    //     console.log("返回数据：");
    //     var screenArray = res.data.data.screenArray;
    //     var screenId = screenArray[0].screenId;
    //     that.setData({
    //       screenArray: screenArray,
    //       screenId: screenId,
    //     })
    //     console.log(screenArray);
    //     request.sendRrquest(API_queryClassify, 'POST', { flag: 1, screenId: screenId })
    //       .then(function (res) {
    //         console.log("返回数据：");
    //         that.setData({
    //           childrenArray: res.data.data.screenArray[0],
    //         })
    //         console.log(that.data.childrenArray);
    //       }, function (error) { console.log("返回失败"); });
    //   }, function (error) { console.log("返回失败"); });
  },

  navbarTap: function (e) {
    var that = this;
    console.log(e);
    this.setData({
      currentTab: e.currentTarget.id,   //按钮CSS变化
      screenId: e.currentTarget.dataset.screenid,
      scrollTop: 0,   //切换导航后，控制右侧滚动视图回到顶部
    })
    //刷新右侧内容的数据
    var screenId = this.data.screenId;
    request.sendRrquest(API_queryClassify, 'POST', { flag: 1, screenId: screenId })
      .then(function (res) {
        console.log("返回数据：");
        that.setData({
          childrenArray: res.data.data.screenArray[0],
        })
        console.log(that.data.childrenArray);
      }, function (error) { console.log("返回失败"); });
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

  }
})