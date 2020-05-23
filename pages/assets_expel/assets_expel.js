// pages/assets_expel/assets_expel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:'',
    num:'',
    nums:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getnum();
      this.getcode()
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

  },
 
  //手机号
  number(e){
     this.setData({
       number:e.detail.value
     })
  },
  //数量
  num(e){
    this.setData({
      num: e.detail.value
    })
  },
  //全部
  all(){
    this.setData({
      num:this.data.nums
    })
  },
  //
  sub(e) {
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      wx.showToast({
        title: '你的操作太快了',
        icon:'none'
      })
      return;
    }

    
    let that = this;
    var tel = /^[1]([3-9])[0-9]{9}$/
    if (that.data.nums == 0) {
      wx.showToast({
        title: '可转赠的张数为零',
        icon: 'none'
      })
    }else if(that.data.number == '' || that.data.number.length != 11 || !tel.test(that.data.number) ){
      wx.showToast({
        title: '请输入正确手机号',
        icon:'none'
      })
    } else if (that.data.phone == that.data.user.phone) {
      wx.showToast({
        title: '不能转赠给自己',
        icon: 'none'
      })
      
    } else if (that.data.num == '' || that.data.num == 0){
      wx.showToast({
        title: '请输入转赠张数',
        icon: 'none'
      })
    } else if (that.data.num > that.data.nums) {
      wx.showToast({
        title: '转赠张数大于当前可转赠数',
        icon: 'none'
      })
    }else{
      let data = {
        receiveUserPhone: that.data.number,
        cardNum: that.data.num,
        memberType: 1
      }
      app.res.req('/membercard/sendcard', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
            wx.showToast({
              title: '转赠成功',
              
            }) 
            that.getnum();

        } else {
          console.log(111)
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
    this.setData({
      tapTime: nowTime
    });
  },
  //张数
  getnum() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/findcardnum', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          nums: res.data
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //查看图片
  Preview: function (e) {
    var that = this;

    console.log(e)
  
      var a = []
      a.push(e.currentTarget.id)
      // wx.previewImage({
      //   current: e.currentTarget.id,
      //   urls: a
      // })
      wx.navigateTo({
        url: '../zhin2/zhin?code=' + this.data.code,
      })


  },
  //二维码
  getcode() {
    let that = this;
    let data = {

    }

    app.res.req('/qrcode/xcxscancode', data, (res) => {

      if (res.status == 1000) {
        
       
        var base64 = res.data.replace(/[\r\n]/g, "")
        var array = wx.base64ToArrayBuffer(base64)
        const fsm = wx.getFileSystemManager();
        const FILE_BASE_NAME = 'mine';
        const filePath = wx.env.USER_DATA_PATH + '/' + FILE_BASE_NAME + '.png';
        fsm.writeFile({
          filePath,
          data: array,
          encoding: 'binary',
          success() {
            console.log(filePath)
            that.setData({
              errormsg: '',
              code: filePath //结果图片
            })
          },
          fail() {

          },
        });



      } else if (res.status == 1002) {

      } else if (res.status == 1018) {

      } else if (res.status == 1024) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
})