// pages/e_specialty/e_specialty.js
const app = getApp();
let grade = 1;
let id = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    tar:'',
    isBang:true,
    
    currentTab: 0,  //对应样式变化
    scrollTop: 0,  //用作跳转后右侧视图回到顶部
    screenArray: [], //左侧导航栏内容
    screenId: "",  //后台查询需要的字段
    childrenArray: [], //右侧内容
  },

  onLoad: function (options) {
    var that = this;
    that.getType();

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
  getType(){
    let that = this;
    let data = {
      grade:grade
    }
    app.res.req('app-web/home/grade/type', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
        id = res.data[0].id
            that.setData({
              type:res.data,

            })
          that.getlist();
       }else if(res.status == 1004 || res.status == 1005){
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
  //商品列表
  getlist(){
    let that = this;
    let data = {
      typeId:id
    }
    app.res.req('app-web/home/choiceness/product', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
            that.setData({
              list:res.data,

            })

       }else if(res.status == 1004 || res.status == 1005){
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
   //商品切换
   tag: function (e) {
    var that = this;
    id =  e.currentTarget.dataset.id;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    console.log(e.currentTarget);
    that.getlist();
    this.setData({
      tapTime: nowTime
    });

    that.setData({
      tar: e.currentTarget.dataset.num,
    })


  },
  //绑定家乡
  bang(){
    wx.navigateTo({
      url: '../binding_hometown/binding_hometown',
    })
  }
})