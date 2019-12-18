// pages/apply_menoy/apply_menoy.js
let id;
const app = getApp();
let status;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'0.00',
    isshow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       id = options.id
       status = options.status
       this.setData({
         num:options.money
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

  tix(){
    if(status == 3){
      wx.navigateTo({
        url: '../apply_withdrawal/apply_withdrawal?id=' + id + '&money=' + this.data.num ,
      })
    }else{
      wx.navigateTo({
        url: '../apply_with_one/apply_with_one?id=' + id,
      })
    }
  },

  

})