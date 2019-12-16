// pages/search_name/search_name.js
const app = getApp();
let  currentPage = 1;
let provinceId
let cityId ='';
let areaId='';
let townId='';
let classifyId='';
let typeId= '';
let sortType='';
let keyword='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismask:true,
  
  open: false,
  
 },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    console.log(options)
    if(options.name){
      keyword = options.name
      that.setData({
        value:options.name,
      })
    }
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

  n_back(){
     wx.navigateBack({
       data:1
     })
  },
  //列表的操作函数
  open_list: function (opts) {
    this.setData({ text: opts.currentTarget.dataset.title, open: false });
    this.setData({ ismask: true })
  },

  //左侧导航的开关函数
  off_canvas: function () {
    this.data.open ? this.setData({ open: false }) : this.setData({ open: true });
    this.setData({ ismask: false })
  },
})