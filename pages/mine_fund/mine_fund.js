// pages/mine_fund/mine_fund.js
const app = getApp();
let status = 0;
let detail = [];
let currentPage = 1;
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
    detail = [];
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
  changeData(){
    detail = [];
    this.getDetail();
  },
  //申请项目
  fa_home(){
    wx.navigateTo({
      url: '../apply_fund/apply_fund',
    })
  },
   //项目详情
   detail(e){
     if (e.currentTarget.dataset.status == 0) {
       wx.showToast({
         title: '审核中',
         icon: 'none'
       })
     }else if(e.currentTarget.dataset.status == 2){
       wx.showToast({
         title: '审核驳回，请检查资料重新提交',
         icon:'none'
       })
     } else if (e.currentTarget.dataset.status == 1 || e.currentTarget.dataset.status == 3 || e.currentTarget.dataset.status == 4 ){
       wx.navigateTo({
         url: '../welfare_det/welfare_det?id=' + e.currentTarget.id,
       })
     }
   },
  //重新提交
  chongx(e){
     wx.navigateTo({
       url: '../apply_fund/apply_fund?id=' + e.currentTarget.id ,
     })
  },
  //提现
  tix(e){
    if(e.currentTarget.dataset.status == 3){
      wx.navigateTo({
        url: '../apply_menoy/apply_menoy?id=' + e.currentTarget.id + '&status=' + e.currentTarget.dataset.status + '&money=' + e.currentTarget.dataset.money,
      })
    }else{
      wx.navigateTo({
        url: '../apply_with_one/apply_with_one?id=' + e.currentTarget.id,
      })
    }
    
  },
  tix_c(e) {
    wx.navigateTo({
      url: '../apply_with_one/apply_with_one?id=' + e.currentTarget.id + '&tru=' + 1, 
    })
  },
  //详情
  getDetail() {
    let that = this;
    let data = {
       status,
      currentPage
    }

    app.res.req('app-web/userproject/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        for (var i in res.data) {
          let num = (res.data[i].raiseAmount / res.data[i].targetAmount) * 100
          res.data[i].num = num.toFixed(2)
        }
        detail.push(...res.data)
        that.setData({
          detail: detail
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
    detail =[];
    that.setData({
      tar: e.currentTarget.dataset.idx
    })
    that.getDetail();
  },
})