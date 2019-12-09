// pages/order_complaints/order_complaints.js
const app = getApp();
let id;
let value;
let images = [];
let simages = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancels: [
      { name: '商家未按约定时间发货' },
      { name: '商家长时间不响应/拒绝退款' },
      { name: '商品存在质量问题' },
      { name: '快递物记录' },
      { name: '其他原因' },
    ],
    cancel: '',
    sum: 0,
    img_num: 0,
    isshow:false,
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
  //申请原因
  bindcancel(e) {
    console.log(e)
    this.setData({
      cancel: this.data.cancels[e.detail.value].name
    })

  },

  valueChange(e) {
    console.log(e.detail.value.length)
    value = e.detail.value
    this.setData({
      sum: e.detail.value.length
    })
  },
   submit() {
    let that = this;
    let data = {
      id:id,
      complaintReason: that.data.cancel,
      complaintExplain:value,
        complaintImgs:simages
    }

     app.res.req('app-web/userorder/complaint', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         wx.showToast({
           title: '投诉成功',
           icon:'none'
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
  //图片上传
  chooseImage(e) {
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
})