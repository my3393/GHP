// pages/certification/certification.js
const app = getApp();
let img_1 = '';
let img_2 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:true,
    loading: false,
    post1: true,
    post2: true,
    audit: 3,
    number:'',
    name:'',
    id:'',
    img_1:'',
    img_2:'',
    card_id:'',
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
  //删除个人照照片
  detels(e) {
    var that = this;
    console.log(e)
    console.log(that.data.imgs)


    if (e.currentTarget.dataset.num == 0) {
      img_1 = '';
      that.setData({
        img_1:'',
        post1:true,
      })
      
    } else if (e.currentTarget.dataset.num == 1) {
      img_2 = '';
      that.setData({
        img_2: '',
        post2: true,
      })
    }

  },
  //
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
  sub(){
    let that = this
    if (that.data.name == ''){
       wx.showToast({
         title: '请输入你的真实姓名',
         icon:'none'
       })
    } else if (that.data.card_id == '') {
       wx.showToast({
         title: '请输入你的身份证号',
         icon: 'none'
       })
    } else if (that.data.img_1 == '') {
       wx.showToast({
         title: '请上传身份证正面照',
         icon: 'none'
       })
    } else if (that.data.img_2 == '') {
       wx.showToast({
         title: '请上传身份证反面照',
         icon: 'none'
       })
     }else{
       that.submit();
     }
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
         
          wx.showToast({
            title: '重新提交成功，请等待平台审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            that.setData({
              loading: !that.data.loading
            })
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
          
          wx.showToast({
            title: '提交成功，请等待平台审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            that.setData({
              loading: !that.data.loading
            })
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
    wx.showLoading({
      title: '加载中',
    })
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
          that.setData({
            load:false,
          })
          wx.hideLoading()
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
  //绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "app-web/login/xcxbindphone",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wx.getStorageSync('sessionkey')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data,
          })
          setTimeout(function () {
            that.sub();
          }, 1000)

        } else if (res.data.status === 103) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })

        } else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
        }
      }
    })
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
        var test1 = setInterval(function () {
          that.getprogress();
        }, 1000)
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
            clearTimeout(test1);
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          }, fail(res) {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败,请检查网络',
              icon: 'none'
            })
            clearTimeout(test1);
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
  },
   getprogress() {
    let that = this;
    let data = {
    }

    app.res.req('app-web/oss/progress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          progress: res.data
        })

        if (res.data == 100) {
          wx.hideLoading();
        } else {
          wx.showLoading({
            title: res.data + '%',
            mask: true,
          });
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

})