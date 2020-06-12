// packageA/pages/today/seckill/seckill.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tar:1,
     tag:[],
     latitude:'',
     longitude:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       tar:options.id
     })
   
    this.seckillstarttime()
    var i = '12'
    var j = '14:00'
    console.log(i<j)
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
     if(this.data.tar == 1){
       wx.setNavigationBarTitle({
         title: '限时秒杀'
       })
     }else{
       wx.setNavigationBarTitle({
         title: '今日特价'
       })
     }
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
  tar(e){
    var id = e.currentTarget.id
    var index = e.currentTarget.dataset.index
    var date = new Date();
    var currentHours = date.getHours();
    if (this.data.tag[index].substring(0, 2) < currentHours){
      wx.showToast({
        title: '已经过了抢购时间哦',
        icon:'none'
      })
    }else{
      this.setData({
        current_time: e.currentTarget.id,
        current: e.currentTarget.dataset.index
      }, () => {
        this.getdetail()
      })
    }
  

  },
  guang(e){
    wx.navigateBack({
      url: '/pages/community/community',
    })
  },
  detail(e){
    wx.navigateTo({
      url: '../../store_home/store_home?id=' + e.currentTarget.id,
    })
  },
  //当前时间
  current_time(){
    let that = this
    var date = new Date();
    var currentHours = date.getHours(); //获取当前时间 
   
    if (currentHours <= that.data.tag[1].substring(0, 2)){
      
      this.setData({
        current_time: that.data.tag[0],
        current:0
      })
    } else if (currentHours >= that.data.tag[1].substring(0, 2) && currentHours < that.data.tag[2].substring(0, 2)){
      this.setData({
        current_time: that.data.tag[1],
        current: 1
      })
    } else if (currentHours >= that.data.tag[2].substring(0, 2) && currentHours < that.data.tag[3].substring(0, 2)) {
      this.setData({
        current_time: that.data.tag[2],
        current: 2
      })
      console.log(that.data.tag[2])
    } else if (currentHours >= that.data.tag[3].substring(0, 2)) {
      this.setData({
        current_time: that.data.tag[3],
        current: 3
      })
    }
    console.log(that.data.tag[3])
    that.getdetail()
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.setData({
          latitude,
          longitude
        },res=>{
          if(that.data.tar == 2){
            that.setData({
              current_time:''
            })
          }
         
        })
        
      }
    })
  },
  //banner
  getdetail() {
    let that = this;
    let data = {
      promotionType:that.data.tar,
      seckillStartTime:that.data.current_time,
      longitude:'',
      latitude:''
      // longitude: that.data.longitude,
      // latitude: that.data.latitude

    }
    app.res.req('/sqproduct/allpromotion', data, (res) => {
   
      if (res.status == 1000) {
        for(var i in res.data){
          res.data[i].percentage = ((res.data[i].totalSaleNum / res.data[i].productInventory)*100).toFixed(2)
        }
        that.setData({
          list: res.data,

        })
        console.log(res.data)
      } else if (res.status == 1004 || res.status == 1005) {
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
  //秒杀时段
  seckillstarttime() {
    let that = this;
    let data = {
       
    }
    app.res.req('/sqproduct/seckillstarttime', data, (res) => {

      if (res.status == 1000) {
        that.setData({
          tag:res.data
        })
        that.current_time()
        console.log(res.data)
      } else if (res.status == 1004 || res.status == 1005) {
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
  
})