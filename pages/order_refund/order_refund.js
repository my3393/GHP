// pages/order_refund/order_refund.js
const app = getApp();
let status;
let id;
let value;
let images = [];
let simages = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refunds: [{ name: '我要退款', id: '1' }],
      refund:'我要退款',
    cancels: [
      { name: '不想买了' },
      { name: '地址信息填写有误，重新购买' },
      { name: '商家缺货' },
      { name: '其他原因' },
    ],
    cargos:[
      { name: '未收到货' },
      { name: '已收到货' }, 
    ],
    tuiks:[
      { name: '多买/买错/不想要' },
      { name: '快递无记录' },
      { name: '少货/空包裹' },
      { name: '商家发错货' },
      { name: '未按约定时间' },
      { name: '快递一直未送达' },
      { name: '商品描述与实物不符' },
      { name: '其他' },
    ],
    refundType:'',
    cancel:'',
    sum:0,
    img_num:0,
    isshow:false,
    isHuo:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
     id = options.id,
     status = options.status
     this.setData({
       z_status : options.z_status
     })
     if(options.z_status == 0){
       this.setData({
         refunds: [{ name: '我要退款',id:'1'}],
         refundType:1
       })
     }else if(options.z_status == 1){
       this.setData({
         refunds: [{ name: '退货退款', id: '3' }, { name: '仅退款',id:'2'}],
         refund: '退货退款',
         refundType:3
       })
     }
    this.getDetail(); 
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
     simages = [];
     this.setData({
       images:[]
     })
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

 
  //申请原因
  bindcancel(e) {
    console.log(e)
    this.setData({
      cancel: this.data.cancels[e.detail.value].name
    })

  },
  bindrefund(e){
    this.setData({
      refund: this.data.refunds[e.detail.value].name,
      refundType: this.data.refunds[e.detail.value].id
    })
    if(e.detail.value == 1 && this.data.z_status == 1){
       this.setData({isHuo:false})
    }
  },
  //说明
  valueChange(e){
    console.log(e.detail.value.length)
    value = e.detail.value
    this.setData({
      sum : e.detail.value.length
    })
  },
  //提交申请
  submit(){
    let that = this;
    var schoolStr = JSON.stringify(simages);
    let data = {
      refundType: that.data.refundType,
      orderDetailId:id,
      refundReason:that.data.cancel,
      refundExplain:value,
      refundImgs: schoolStr
    }
    wx.request({
      url: "http://192.168.123.171:8080/app-web/userorder/applyrefund",
      data: {
        refundType: that.data.refundType,
        orderDetailId: id,
        refundReason: that.data.cancel,
        refundExplain: value,
        refundImgs: simages
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          for (var i in res.data.data.data) {
            splayer.push(res.data.data.data[i])
          }
          that.setData({
            splayer: splayer,
            x_totalPage: res.data.data.totalPage
          })


        } else if (res.data.status === 103) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
    // app.res.req('app-web/userorder/applyrefund', data, (res) => {
    //   console.log(res.data)
    //   if (res.status == 1000) {

    //   } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
    //     wx.redirectTo({
    //       url: '../login/login',
    //     })
    //   } else {
    //     wx.showToast({
    //       title: res.msg,
    //       icon: 'none'
    //     })
    //   }
    // })
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
             if(images.length == 3){
               that.setData({
                 isshow:!that.data.isshow
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
  getDetail() {
    let that = this;
    let data = {
      id: id
    }

    app.res.req('app-web/userorder/suborderdetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          price: res.data.payPrice
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
})