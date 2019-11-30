// pages/welfare_det/welfare_det.js
const app = getApp();
let top1 = '';
let top2 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    is_top: true,
    issrcoll: '1',
    iscanvan: true,
    code: '../../images/ma.png', //如果是服务器图片一定要先下载到本地
    ismask: true,
    istag:true,
    photos: [
      "https://graph.baidu.com/resource/11629b5b21495fc38faf001572947644.jpg",
      "https://graph.baidu.com/resource/116e3b442899944bd09e901572947676.jpg",
      "https://graph.baidu.com/resource/116b9dee63af0f77fcb8f01572947716.jpg",
      "https://graph.baidu.com/resource/1168b577d0799dcb13b6901572947760.jpg",
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.top1').boundingClientRect(function (rect) {
      console.log(rect)

      top1 = rect.top

    }).exec();
    query.select('.top2').boundingClientRect(function (rect) {
      console.log(rect)

      top2 = rect.top

    }).exec();
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
    console.log(e.scrollTop)
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
      console.log(top1)
      console.log(top2)
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