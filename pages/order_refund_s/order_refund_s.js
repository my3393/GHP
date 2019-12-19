// pages/order_refund_s/order_refund_s.js
const app = getApp();
let id;
let value = '';
let images = [];
let simages = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Couriers: [
      { name: '顺丰快递' },
      { name: '申通快递' },
      { name: '中通快递' },
      { name: '圆通快递' },
      { name: '韵达快递' },
      { name: '天天快递' },
      { name: '邮政' },
    ],
    Courier:'',
    name:'',
    phone:'',
    sum: 0,
    img_num: 0,
    isshow: false,
    progress:'00',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id
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
  bindrefund(e) {
    this.setData({
      Courier: this.data.Couriers[e.detail.value].name,  
    })
   
  },
  name(e){
    this.setData({
      name:e.detail.value
    })
  },
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //说明
  valueChange(e) {
    console.log(e.detail.value.length)
    value = e.detail.value
    this.setData({
      sum: e.detail.value.length
    })
    console.log(value)
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
  //图片上传
  chooseImage(e) {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //可选择原图或压缩后的图片
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

            images.push(datas.data.url)
            simages.push(datas.data.fileName)
            that.setData({
              simgs: images,
              img_num: images.length
            })
            if (images.length == 3) {
              that.setData({
                isshow: !that.data.isshow
              })
            }
            clearTimeout(test1);
            wx.hideLoading();
            // do something
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
  submit(){
    let that = this
     if(that.data.Courier == ''){
       wx.showToast({
         title: '请选择物流公司',
         icon:'none'
       })
     } else if (that.data.name == '') {
       wx.showToast({
         title: '请填写快递编号',
         icon: 'none'
       })
     } else if (that.data.phone == '') {
       wx.showToast({
         title: '请填写联系方式',
         icon: 'none'
       })
    }else{
       var schoolStr = JSON.stringify(simages);
       let data = {
         orderDetailId:id,
         refundExplain: that.data.value,
         refundImgJson: schoolStr,
          refundExpressNo:that.data.name,
         refundExpressName: that.data.Courier,
           refundUserPhone:that.data.phone
       }
       app.res.req('app-web/userorder/subimitrefundInfo', data, (res) => {
         console.log(res.data)
         if (res.status == 1000) {
           wx.showToast({
             title: '提交成功',
             icon: 'none',
             duration: 2000,
           })
           setTimeout(function () {
             wx.navigateBack({
               delta: 2
             })
           }, 2000)
         } else {
           wx.showToast({
             title: res.msg,
             icon: 'none'
           })
         }
       })
    }
  }
})