// pages/mine_opinion/mine_opinion.js
const app = getApp();
let images = [];
let simages = [];
let currentPage = 1;
let  detail = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: [
      { name: '我要反馈' },
      { name: '我的反馈' }
    ],
    tar: 0,
    type: [
      { name: '订单管理' },
      { name: '善家公益' },
      { name: '我的家乡' },
      { name: '特产详情' },
      { name: '特产列表' },
      { name: '特产分类' },
      { name: '其他' },

    ],
    progre: 0,
    typ: '',
    sums:'',
    img_num:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
     images = [];
     simages = []
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
  //反馈问题
  valueChanges(e){
    this.setData({
       sums:e.detail.value
    })
  },
  //删除个人照照片
  detels(e) {
    var that = this;
    console.log(e)
    console.log(that.data.imgs)



      simages.splice(e.currentTarget.dataset.index, 1)
      images.splice(e.currentTarget.dataset.index, 1)
      that.setData({
        images: images,
        img_num: that.data.img_num - 1
      })
      console.log(simages.length)
      if (simages.length < 3) {
        that.setData({
          img_show: false
        })
      }


  },
  type(e){
    console.log(e)
    this.setData({
      typ:this.data.type[e.detail.value].name
    })
  },
  //查看图片
  Preview: function (e) {
    var that = this;

    console.log(e)

      wx.previewImage({
        current: e.currentTarget.id,
        urls: that.data.images
      })

  },
  sub(){
    let that = this;
    if(that.data.typ == ''){
       wx.showToast({
         title: '请选择反馈类型',
         icon:'none'
       })
    } else if (that.data.sums == '') {
      wx.showToast({
        title: '请说明你要反馈的问题和意见',
        icon: 'none'
      })
    } else if (that.data.images == '') {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
    }else{
      that.submit()
    }
  },
  submit() {

    let that = this;
    var Str = JSON.stringify(simages);
    let data = {

        feedbackType:that.data.typ,
      feedbackContent:that.data.sums,
      feedbackImgJson: Str
    }

    app.res.req('/feedback/submit', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
          wx.showToast({
            title: '提交成功',
            icon:'none'
          })
          setTimeout(function(){
            wx.navigateBack({
              dalet:1
            })
          },1000)

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
  getprogress() {
    let that = this;
    let data = {
    }

    app.res.req('/oss/progress', data, (res) => {
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
  chooseImages(e) {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // console.log(res.tempFilePaths[0]);
        var tempFilePaths = res.tempFilePaths;
        console.log(that.data.progre)
        var test1 = setInterval(function () {
          that.getprogress();
        }, 1000)

        const uploadTask = wx.uploadFile({
          url: app.data.urlmall + '/oss/xcxupload', // 仅为示例，非真实的接口地址
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
                zhaos1: datas.data.url,
                zhao1: false
              })
              zhao1 = datas.data.fileName
            } else if (e.currentTarget.id == 1) {
              images.push(datas.data.url)
              simages.push(datas.data.fileName)
              console.log(simages)
              that.setData({
                images: images,
                img_num: images.length
              })
              if (simages.length == 3) {
                that.setData({
                  img_show: !that.data.img_show
                })
              }
            }

            clearTimeout(test1);

            // do something
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          },
          fail(res) {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败,请检查网络',
              icon: 'none'
            })
            clearTimeout(test1);
          }
        })
        uploadTask.onProgressUpdate((res) => {
          that.setData({
            progre: res.progress
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
  //切换
  tag(e) {
    let that = this;

      currentPage = 1,
      detail = [];
    that.setData({
      tar: e.currentTarget.dataset.index,

    })
    this.getDetail()
  },
  getDetail() {
    let that = this;
    let data = {
      currentPage
    }

    app.res.req('/feedback/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

       // detail.push(...res.data)
        that.setData({

          detail: res.data
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