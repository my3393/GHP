// pages/mine_wallet/mine_wallet.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     iscertfica:true,
     ismask:true,
    isdelete:true,
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
    let that = this;
    this.getinfor();
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })
        if (res.data.memberType == 0){
           that.setData({
             isdelete:false,
             ismask:false,
           })
        }
      }
    })
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
  wallet_detail(){
     wx.navigateTo({
       url: '../wallet_detail/wallet_detail',
     })
  },
  getinfor() {
    let that = this;
    let data = {

    }

    app.res.req('/user/walletinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data != null) {
          that.setData({
            detail:res.data
          })

        }
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
  //开通会员
  member(){
    wx.navigateTo({
      url: '../members/members',
    })
  },
  cancel_delete(){
    let that =this;
    that.setData({
      iscertfica: !that.data.iscertfica,
      ismask:true,
    })
  },
  // 提现
  drawal(){
    if (this.data.user.isRealName == 0){
      this.setData({
        iscertfica: !this.data.iscertfica,
        ismask:false,
      })
    } else if (this.data.detail.remainTotalAmount == 0){
      wx.showToast({
        title: '当前金额为0',
        icon:'none'
      })
    }else{
       wx.navigateTo({
         url: '../wallet_withdrawal/wallet_withdrawal?num=' + this.data.detail.remainTotalAmount,
       })
    }
  },
  //查看明细
  wallet_detail(e){
    wx.navigateTo({
      url: '../wallet_detail/wallet_detail?id=' + e.currentTarget.id,
    })
  },
  confirm_delete(){
    let that = this;
    that.setData({
      iscertfica: !that.data.iscertfica,
      ismask: true,
    })
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  cancel(){
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: true,
    })
  },
  confirm() {
    this.setData({
      isdelete: !this.data.isdelete,
      ismask: true,
    })
    wx.navigateTo({
      url: '../members/members',
    })
  }
})