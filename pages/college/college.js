// pages/college/college.js
const app = getApp();
let img_1 = '';
let img_2 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: true,
    loading: false,
    post1: true,
    post2: true,
    audit: 3,
    number: '',
    name: '',
    phone:'',
    school:'',
    id: '',
    isg: true,
    start:'',
    end:'',
    type:[
      { name: '专科生' },
      { name: '本科生' },
      { name: '硕士生' },
      { name: '博士生' },
      
    ],
    typ:'',
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
  //协议
  web(){
     wx.navigateTo({
       url: '../agreement_store/agreement_store?src=' + 'https://www.xingtu-group.cn/sjg_xieyi/4_service.pdf' ,
     })
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
  type(e){
     this.setData({
       typ:this.data.type[e.detail.value].name
     })
  },
  phone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  school(e){
    this.setData({
      school:e.detail.value
    })
  },
  start(e){
    console.log(e)
    this.setData({
      start:e.detail.value
    })
  },
  end(e){
    console.log(e)
    this.setData({
      end: e.detail.value
    })
  },
  //名字
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
 
 
  sub(){
    let that = this;
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

    if(that.data.name == ''){
      wx.showToast({
        title: '请填写真实姓名',
        icon:'none'
      })
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none'
      })
    } else if (!idcardReg.test(that.data.phone)) {
      wx.showToast({
        title: '身份证号有误',
        icon: 'none',
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
    } else if (that.data.img_1 == '') {
      wx.showToast({
        title: '请上传学生证或学生卡正面照',
        icon: 'none'
      })
    } else if (that.data.img_2 == '') {
      wx.showToast({
        title: '请上传学生证或学生卡反面照',
        icon: 'none'
      })
    }else if (that.data.isg == false) {
      wx.showToast({
        title: '请同意服务说明',
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
        realName: that.data.name,
        identityNo: that.data.phone,

        schoolName: that.data.school,
        educationLevel: that.data.typ,
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
        identityNo: that.data.phone,

        schoolName: that.data.school,
        educationLevel: that.data.typ,
        enrollmentYear: that.data.start,
        graduationYear: that.data.end,
        studentImg1: img_1,
        studentImg2: img_2,
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
              delta: 1
            })
          }, 2000)
        } else if (res.status == 1034) {
          that.setData({
            loading: !that.data.loading
          })
          wx.showToast({
            title: '已重新提交，请等待平台审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              data: 1
            })
          }, 2000)
        }else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
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
     
    this.setData({
      name: this.data.audits.realName,
      phone: this.data.audits.identityNo,
      img_1: this.data.audits.studentImg1,
      img_2: this.data.audits.studentImg2,
      audit: 3,
      school: this.data.audits.schoolName,
      typ: this.data.audits.educationLevel,
      start: this.data.audits.enrollmentYear,
      end: this.data.audits.graduationYear,
      post1: false,
      post2: false,
      id:1
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
  },
  //勾选
  gx() {
    let that = this;
    that.setData({
      isg: !that.data.isg
    })
  },
})