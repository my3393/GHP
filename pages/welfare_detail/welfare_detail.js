// pages/welfare_detail/welfare_detail.js
import Canvas from '../../utils/tcanvas.js';
const app = getApp();
let id ='';
let list = [];
let currentPage = 1
Page({
 // ...Canvas.options,
  /**
   * 页面的初始数据
   */
  data: {
    ...Canvas.data,
   num:'0',
   nums:'0',
    gradientColor: {
      '0%': '#f12200',
      '100%': '#ff4e17'
    },
    isduo:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // this.draw('runCanvas', this.data.shao, 1000);

    this.getDateil();
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
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          user: res.data,
        })
      },
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
    list = [];
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
    var that = this;

    return {
      title: '我是' + that.data.user.userName + that.data.user.bindCityName + that.data.user.bindAreaName + '推广家乡特产，我为家乡代言，诚邀你的评鉴。',
      path: '/pages/e_home/home?userid=' + that.data.user.id,

    }
  },
  //查看图片
  Preview: function (e) {
    var that = this;
    var urlsa = [];
    console.log(e)
    urlsa.push(e.currentTarget.id)
    console.log(urlsa)
    wx.previewImage({
      current: e.currentTarget.id,
      urls: that.data.list[e.currentTarget.dataset.num].publicityImgOss
    })
  },
  //查看更多
  gend:function(e){
    let that = this
     this.setData({
      isduo:!that.data.isduo,
     })
  },
  //
  getDateil() {
    let that = this;
    let data = {

    }
    app.res.req('/project/sjgamount', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getList();
        if (res.data.withdrawalTotalAmount != 0) {
          let num = (res.data.withdrawalTotalAmount) / (res.data.shareTotalAmount) * 100
          console.log(num)
          that.setData({
            num: num.toFixed(2),
            nums: num.toFixed(0),
          })
          console.log(num)
        }

        that.setData({
          money: res.data,

        })
       
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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

  },
  //项目列表
  getList() {
    let that = this;
    let data = {
      projectId:id,
      currentPage: currentPage
    }
    app.res.req('/project/publicitylist', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          let num = (res.data[i].raiseAmount / res.data[i].targetAmount) * 100
          res.data[i].num = num.toFixed(2)
        }
        list.push(...res.data)
        that.setData({
          list: list,

        })
        console.log(list)
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        console.log(1)
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
  }
})