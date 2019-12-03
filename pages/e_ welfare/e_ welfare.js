// pages/e_ welfare/e_ welfare.js
import Canvas from '../../utils/tcanvas.js';
const app = getApp();
Page({
  ...Canvas.options,
  /**
   * 页面的初始数据
   */
  data: {
    tag:[
      {name:'全部',id:"0"},
      {name:'筹集中',id:"0"},
      {name:'带筹集',id:"0"},
      {name:'已完成',id:"0"},
    ],
    tar:'0',
    photos:[
      "https://graph.baidu.com/resource/11629b5b21495fc38faf001572947644.jpg",
      "https://graph.baidu.com/resource/116e3b442899944bd09e901572947676.jpg",
      "https://graph.baidu.com/resource/116b9dee63af0f77fcb8f01572947716.jpg",
      "https://graph.baidu.com/resource/1168b577d0799dcb13b6901572947760.jpg",
    ],
    ...Canvas.data,
    shao:'80'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDateil();
    this.draw('runCanvas',this.data.shao,1000);
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


  tag(e){
    console.log(e)
    let that = this;
    that.setData({
      tar:e.currentTarget.dataset.idx
    })
  },
  //
  getDateil(){
    let that = this;
    let data = {

    }
    app.res.req('app-web/home/banner', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
            that.setData({
              detail:res.data,

            })

       }else if(res.status == 1004 || res.status == 1005 || res.status == 1018){
         console.log(1)
           wx.redirectTo({
             url: '../login/login',
           })
       } else {
         console.log(111)
         wx.showToast({
           title: res.msg,
           icon: 'none'
         })
       }
    })

  }
})