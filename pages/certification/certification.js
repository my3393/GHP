// pages/certification/certification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    post1: true,
    post2: true,
    audit: 2,
    number:'36233019960918874',
    name:'刘郑国'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get();
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
  submit() {
    let that = this;
    that.setData({
      loading: !that.data.loading
    })
  },
  get(){
    let that = this;


    let result = that.plusXing( that.data.number,1,1)
    let name = that.plusXing(that.data.name,0,2)
    that.setData({
      number:result,
      name:name
    })
    console.log(result)
  },
   plusXing (str,frontLen,endLen) {
     var len = str.length-frontLen-endLen;
     var xing = '';
     for (var i=0;i<len;i++) {
     xing+='*';
    }
     return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
     }


})