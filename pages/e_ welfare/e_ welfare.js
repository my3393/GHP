// pages/e_ welfare/e_ welfare.js
import Canvas from '../../utils/tcanvas.js';
const app = getApp();
let currentPage = 1;
let status = 0;
let list = [];
let userid ='';
let cityId = '';
let areaId = '';
let townId ='';
Page({
  //...Canvas.options,
  /**
   * 页面的初始数据
   */
  data: {
    tag:[
      {name:'全部',id:"0"},
      {name:'筹集中',id:"1"},
      {name:'待筹集',id:"2"},
      {name:'已完成',id:"3"},
    ],
    tar:'0',
    photos:[
      'https://www.xingtu-group.cn/xcx_img/gy1.jpg'
    ],
    photoses:[
      'http://xt-ylsj.oss-cn-shenzhen.aliyuncs.com/sjg/2019121316331078500014.jpg'
    ],
    ...Canvas.data,
    num:'0',
    nums:'0',
    provinceId:'',
    gradientColor: {
      '0%': '#f12200',
      '100%': '#ff4e17'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDateil();
    if (options.userid) {
      userid = options.id
      wx.setStorageSync('bangId', userid)
    }
    this.getList();
    this.getRecommend();
   
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
          user: res.data
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
      title: '我是' + that.data.user.userName+'大爱无疆，助力家乡，邀你为爱前行。',
      path: '/pages/e_specialty/e_specialty?userid=' + that.data.user.id,

    }
  },
  //寻找老乡
  xun(){
    wx.navigateTo({
      url: '../hometown/hometown',
    })
  },
  //申请资助
  appl(){
    wx.navigateTo({
      url: '../apply_fund/apply_fund',
    })
  },
  //了解更多
  ljgeng(){
    wx.navigateTo({
      url: '../welfare_detail/welfare_detail',
    })
  },
  //查看详情
  detail(e){
    wx.navigateTo({
      url: '../welfare_det/welfare_det?id=' + e.currentTarget.id,
    })
  },
  tag(e){
    console.log(e)
    let that = this;
    status = e.currentTarget.dataset.idx;
    currentPage = 1;
    list = [];
    that.setData({
      tar:e.currentTarget.dataset.idx
    })
    that.getList();
  },
  //
  getDateil(){
    let that = this;
    let data = {

    }
    app.res.req('/project/sjgamount', data, (res) => {
      console.log(res.data)
       if(res.status == 1000){
         if (res.data.withdrawalTotalAmount != 0){
           let num =( (res.data.withdrawalTotalAmount) / (res.data.shareTotalAmount)*100)
           that.setData({
             nums:num.toFixed(0),
             num: num.toFixed(2)
           })
           console.log(num)
         }

            that.setData({
              money:res.data,

            })
       //  that.draw('runCanvas', this.data.num, 1000);
           console.log(that.data.num)
       }else if(res.status == 1004 || res.status == 1005 || res.status == 1018){
         console.log(1)
           wx.redirectTo({
             url: '../login/login?userid=' + userid,
           })
         wx.setStorageSync('url', '../e_ welfare/e_ welfare')
       } else {
         console.log(111)
         wx.showToast({
           title: res.msg,
           icon: 'none'
         })
       }
    })

  },
  
  changeDatas(){
    list = [];
    this.getList()
  },
  //项目列表
  getList(){
    let that = this;
    let data = {
      status:status,
      currentPage: currentPage,
      provinceId:that.data.provinceId,
      cityId: cityId,
      areaId: areaId,
      townId: townId,

    }
    app.res.req('/project/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        console.log(list)
         for(var i in res.data){
           let num = (res.data[i].raiseAmount / res.data[i].targetAmount ) * 100
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
  },
  getRecommend() {
    let that = this;
    let data = {
      isRefresh: 0
    }
    app.res.req("/home/recommend", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          recommend: res.data,

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
  //查看商品详情
  detail(e) {
    console.log(e)
    wx.navigateTo({
      url: '../good_detail/good_detail?id=' + e.currentTarget.dataset.id,
    })
  },
})