// packageA/pages/union/problem/problem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[
      { name:'账号问题',
        intro:[
         '怎么注册商家账号？',
         '忘记密码怎么办？',
         '一个账号可以开多家店铺吗？',
         '账号开过店，可以开店吗？',
         '入驻成功后，没收到商家账号密码？'
       ],
        current: 0,
        disabled: false
      },
      {
        name: '开店资费', 
      }
    ]
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
  change(e) {
    let index = e.detail.index;
    let item = this.data.dataList[index];
    this.setData({
      [`dataList[${index}].current`]: item.current == index ? -1 : index
    })
  },
})