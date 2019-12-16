// pages/certification/certification.js
const app = getApp();
let img_1 = '';
let img_2 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    post1: true,
    post2: true,
    audit: 3,
    number:'',
    name:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get();
    this.getaudit();
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
  //名字
  name(e){
    this.setData({
      name:e.detail.value
    })
  },
  //身份证号
  card(e){
   this.setData({
     card_id:e.detail.value
   })
  },
  submit() {
    let that = this;
    if(that.data.id){
      let that = this;
      that.setData({
        loading: !that.data.loading
      })
      let data = {
        id:that.data.id,
        realName: that.data.name,
        identityNo: that.data.card_id,
        identityCard1: img_1,
        identityCard2: img_2,
      }
      app.res.req('app-web/user/resubmitauthentication', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          that.setData({
            loading: !that.data.loading
          })
          wx.showToast({
            title: '重新提交成功，请等待平台审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              data: 1
            })
          }, 2000)
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
    }else{
      
      that.setData({
        loading: !that.data.loading
      })
      let data = {
        realName: that.data.name,
        identityNo: that.data.card_id,
        identityCard1: img_1,
        identityCard2: img_2,
      }
      app.res.req('app-web/user/submitauthentication', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          that.setData({
            loading: !that.data.loading
          })
          wx.showToast({
            title: '提交成功，请等待平台审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              data: 1
            })
          }, 2000)
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
    }

  },
  go(){
    img_1 = this.data.audits.identityCard1,
      img_2 = this.data.audits.identityCard2
    this.setData({
      name: this.data.audits.realName,
      card_id: this.data.audits.identityNo,
      img_1: this.data.audits.identityCard1Oss,
      img_2: this.data.audits.identityCard2Oss,
      audit:3,
      post1:false,
      post2:false,
    })
  },
  //用户认证信息
  
  getaudit(){
    let that = this;
    let data = {
      
    }

    app.res.req('app-web/user/authenticationinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
          if(res.data != null){
            that.setData({
              audits: res.data,
              audit: res.data.auditStatus,
              name: res.data.realName,
              number: res.data.identityNo,
              id:res.data.id
            })
            that.get();
          }
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
  get(){
    let that = this;
    let result = that.plusXing( that.data.number,1,1)
    let name = that.plusXing(that.data.name,0,2)
    that.setData({
      number:result,
      name:name
    })
    console.log(result)
  },
  //图片上传
  chooseImages(e) {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // console.log(res.tempFilePaths[0]);
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading();
        const uploadTask = wx.uploadFile({
          url: app.data.urlmall + 'app-web/oss/xcxupload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'token': wx.getStorageSync("token")
          },
          formData: {
            // 'token': wx.getStorageSync("etoken")
          },
          // UploadTask.onProgressUpdate(function callback)
          dataType: 'json',
          success(res) {

            let datas = JSON.parse(res.data)
            console.log(datas)
            if (e.currentTarget.id == 0) {
              that.setData({
                img_1: datas.data.url,
                post1: false
              })
              img_1 = datas.data.fileName
            }else{
              that.setData({
                img_2: datas.data.url,
                post2: false
              })
              img_2 = datas.data.fileName
            } 
            wx.hideLoading();
            // do something
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          }
        })
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })
        that.setData({
          postersies: res.tempFilePaths[0]
        })
      }
    })


  },
   plusXing (str,frontLen,endLen) {
     var len = str.length-frontLen-endLen;
     var xing = '';
     for (var i=0;i<len;i++) {
     xing+='*';
    }
     return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  }


})