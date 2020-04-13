// pages/assets_expel/assets_expel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:'',
    num:'',
    nums:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  //手机号
  number(e){
     this.setData({
       number:e.detail.value
     })
  },
  //数量
  num(e){
    this.setData({
      num: e.detail.value
    })
  },
  //全部
  all(){
    this.setData({
      num:this.data.nums
    })
  },
  //
  sub(e) {
    let that = this;
    if (that.data.nums == 0) {
      wx.showToast({
        title: '可转赠的张数为零',
        icon: 'none'
      })
    }else if(that.data.number == '' || that.data.number.length != 11){
      wx.showToast({
        title: '请输入正确手机号',
        icon:'none'
      })
    } else if (that.data.num == '' || that.data.num == 0){
      wx.showToast({
        title: '请输入转赠张数',
        icon: 'none'
      })
    }else{
      let data = {
        receiveUserPhone: that.data.number,
        cardNum: that.data.num,
        memberType: 1
      }
      app.res.req('/membercard/sendcard', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
            wx.showToast({
              title: '转赠成功',
              
            }) 
            that.getnum();

        } else {
          console.log(111)
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
    
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
          nums: res.data
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