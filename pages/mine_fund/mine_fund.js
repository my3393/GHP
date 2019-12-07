// pages/mine_fund/mine_fund.js
let status = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tag:[
       { name: '全部' },
       { name: '审核中' },
       { name: '审核通过' },
       { name:'审核驳回'},
     ],
     tar:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail();
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
  //详情
  getDetail() {
    let that = this;
    let data = {
       status:status
    }

    app.res.req('app-web/userproject/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          detail: res.data
        })

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
  tag(e) {
    console.log(e)
    let that = this;
    status = e.currentTarget.dataset.idx;
    currentPage = 1;

    that.setData({
      tar: e.currentTarget.dataset.idx
    })
  },
})