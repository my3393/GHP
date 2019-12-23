// pages/mine_opinion/mine_opinion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: [
      { name: '我要反馈' },
      { name: '我的反馈' }
    ],
    tar: 0,
    img_num:0,
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
  //切换
  tag(e) {
    let that = this;
    
      currentPage = 1,
      detail = [];
    that.setData({
      tar: e.currentTarget.dataset.index,

    })
    this.getDetail()
  },
  getDetail() {
    let that = this;
    let data = {
      orderType: orderType,
      currentPage: currentPage
    }

    app.res.req('app-web/userorder/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
      
        detail.push(...res.data)
        that.setData({
          
          detail: detail
        })
      
        console.log(detail)
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
})