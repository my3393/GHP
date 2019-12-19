// pages/college/college.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: false,
    loading: false,
    post1: true,
    post2: true,
    audit: 3,
    number: '',
    name: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  //删除个人照照片
  detels(e) {
    var that = this;
    console.log(e)
    console.log(that.data.imgs)


    if (e.currentTarget.dataset.num == 0) {
      img_1 = '';
      that.setData({
        img_1: '',
        post1: true,
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
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //身份证号
  card(e) {
    this.setData({
      card_id: e.detail.value
    })
  },
  sub(){
    let that = this;
    if(that.data.names == ''){
      wx.showToast({
        title: '请填写真实姓名',
        icon:'none'
      })
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none'
      })
    } else if (that.data.school == '') {
      wx.showToast({
        title: '请填写学校名称',
        icon: 'none'
      })
    } else if (that.data.value == '') {
      wx.showToast({
        title: '请填写学历',
        icon: 'none'
      })
    } else if (that.data.start == '') {
      wx.showToast({
        title: '请选择入学年份',
        icon: 'none'
      })
    } else if (that.data.end == '') {
      wx.showToast({
        title: '请选择预计毕业年份',
        icon: 'none'
      })
    } else if (img_1 == '') {
      wx.showToast({
        title: '请上传学生证或学生卡正面照',
        icon: 'none'
      })
    } else if (img_2 == '') {
      wx.showToast({
        title: '请上传学生证或学生卡反面照',
        icon: 'none'
      })
    }else{
      that.submit();
    }
  },
  submit() {
    let that = this;
    if (that.data.id) {
      let that = this;
     
      let data = {
        realName: that.data.names,
        userPhone: that.data.phone,

        schoolName: that.data.school,
        educationLevel: that.data.value,
        enrollmentYear: that.data.start,
        graduationYear: that.data.end,
        studentImg1: img_1,
        studentImg2: img_2,

      }
      app.res.req('app-web/authentication/editcollege', data, (res) => {
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
    } else {

      that.setData({
        loading: !that.data.loading
      })
      let data = {
        realName: that.data.name,
        identityNo: that.data.card_id,
        identityCard1: img_1,
        identityCard2: img_2,
      }
      app.res.req('app-web/authentication/submitcollege', data, (res) => {
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
  go() {
    img_1 = this.data.audits.identityCard1,
      img_2 = this.data.audits.identityCard2
    this.setData({
      name: this.data.audits.realName,
      card_id: this.data.audits.identityNo,
      img_1: this.data.audits.identityCard1Oss,
      img_2: this.data.audits.identityCard2Oss,
      audit: 3,
      post1: false,
      post2: false,
    })
  },
  //用户认证信息

  getaudit() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let data = {

    }

    app.res.req('app-web/authentication/collegeinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data != null) {
          that.setData({
            audits: res.data,
            audit: res.data.auditStatus,

            id: res.data.id
          })

        }
        that.setData({
          load: false,
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
  get() {
    let that = this;
    let result = that.plusXing(that.data.number, 1, 1)
    let name = that.plusXing(that.data.name, 0, 2)
    that.setData({
      number: result,
      name: name
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
            } else {
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
  plusXing(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  }
})