// pages/apply_with_one/apply_with_one.js
const app = getApp();
let id;
let zhao1 = '';
let sqId;
let tru;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isdelete: false,
    ismask: false,
    zhao1: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    id = options.id
    if (options.tru) {
      tru = options.tru
      this.again();
    }
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
  //姓名
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //职位
  zhiwie(e) {
    this.setData({
      zhiwie: e.detail.value
    })
  },
  //电话
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //
  quer() {
    this.setData({
      isdelete: true,
      ismask: true,
    })
  },
  //重新提交信息
  again() {
    let that = this;
    let data = {
      projectId: id
    }

    app.res.req("app-web/userproject/donationapplyinfo", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        sqId = res.data.id;
        id = res.data.projectId;
        zhao1 =  res.data.certificateImg,
        that.setData({
          
          
             zhao1:false,
             zhaos1: res.data.certificateImgOss,
             name: res.data.proveUserName,
             zhiwie: res.data.proveUserPosition,
             phone: res.data.phone
         
        })


      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  //提交
  submit() {
    let that = this;
    if(tru){
      let data = {
        projectId: id,
        certificateImg: zhao1,
        proveUserName: that.data.name,
        proveUserPosition: that.data.zhiwie,
        phone: that.data.phone,
        id:sqId
      }

      app.res.req('app-web/userproject/resubmitdonationapply', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '重新提交成功，审核通过后即可进行提现',
            icon: 'none',
            duration: 3000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 3000)
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
    }else{
      let data = {
        projectId: id,
        certificateImg: zhao1,
        proveUserName: that.data.name,
        proveUserPosition: that.data.zhiwei,
        phone: that.data.phone,
      }

      app.res.req('app-web/userproject/donationapply', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '提交成功，审核通过后即可进行提现',
            icon: 'none',
            duration: 3000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 3000)
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
    }
    
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

            that.setData({
              zhaos1: datas.data.url,
              zhao1: false
            })
            zhao1 = datas.data.fileName


            wx.hideLoading();
            // do something
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          }
        })
        uploadTask.onProgressUpdate((res) => {
          let rm = res.progress
          console.lof(rm)
          wx.showToast({
            title: res,
            icon: 'none'
          })
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
})