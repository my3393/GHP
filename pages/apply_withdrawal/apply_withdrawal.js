// pages/apply_withdrawal/apply_withdrawal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    ismask: true,
    isExist:true,
    money:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
      this.setData({
        z_num:options.money,
         id:options.id
      })
    this.infor();
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
  all(){
    this.setData({
      money:this.data.z_num
    })
  },
  //去绑卡
  bangd(){
    wx.navigateTo({
      url: '../apply_bind/apply_bind?id=' + this.data.id,
    })
  },
  //用户绑定银行卡信息
  infor(e) {
    let that = this;
    let data = {
      projectId: that.data.id
    }
    app.res.req('app-web/userproject/bindbankinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.bankCard != null){
          that.setData({
            detail:res.data,
            isExist:false,
            sum: res.data.bankCardNo.substr(res.data.bankCardNo.length - 4)
          })
        }


      } else {
        console.log(111)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  money(e){
    this.setData({
      money:e.detail.value
    })
  },
  submit(){
    let that = this;
   if(that.data.isExist){
     wx.showToast({
       title: '请先绑定银行卡',
       icon:'none'
     })
   }else if(that.data.money == ''){
     wx.showToast({
       title: '请输入提现金额',
       icon:'none'
     })
   }else if(that.data.money > that.data.z_num){
     wx.showToast({
       title: '当前输入金额大于可提现金额',
       icon: 'none'
     })
   }else{
     let data = {
       projectId: that.data.id,
       amount: that.data.money
     }
     app.res.req('app-web/userproject/donationwithdrawal', data, (res) => {
       console.log(res.data)
       if (res.status == 1000) {
         wx.showToast({
           title: '提现申请成功，请等待平台审核打款',
           icon: 'success',
           duration: 2000
         })
         setTimeout(function () {
           wx.navigateBack({
             delta: 2,
           })
         }, 2000)

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
  // 上个页面返回刷新
  changeData: function () {
   
    this.infor();
    //var options = { 'id': this.data.id }
    //this.onLoad(options);//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})