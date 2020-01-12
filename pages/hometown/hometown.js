// pages/hometown/hometown.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   id:'',
   tar:9999
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getprov();
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
  open(e){
    if (e.currentTarget.id == 1) {
      this.setData({
        id:''
      })
    }else{
      if (this.data.id == '') {
        wx.showToast({
          title: '请选择省份',
          icon: 'none'
        })
      } else {

        var pages = getCurrentPages();//当前页面栈
        if (pages.length > 1) {
          var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
          var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
          beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
            provinceId: this.data.id
          })

          beforePage.changeDatas();//触发父页面中的方法
        }
        wx.navigateBack({
          delta: 1
        })

      }
    }
    
  },
  tag(e){
    this.setData({
      tar: e.currentTarget.dataset.index,
      id: e.currentTarget.id
    })
  },
  //省
  getprov: function () {


    let that = this;
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          province: res.data
        })

      } else if (res.status == 1004 || res.status == 1005) {
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