// pages/apply_fund/apply_fund.js
var url;
const app = getApp();
let town = [];
let province_id = '';
let city_id = '';
let area_id = '';
let town_id = '';
let zhao1 = '';
let images = [];
let simages = [];
let num = '';
let nums = '';
let id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    ismask: false,
    address: true,
    prov: '',
    city: '',
    area: '',
    town: '',
    isprov: true,
    iscity: false,
    isqu: false,
    isjie: false,
    zhao1:true,
    title:'',
    menoy:'',
    phone:'',
    addres:'',
    zhaos1:'',
    images:[],
    img_num:0,
    img_show:false,
    isdelete:false,
    ispdf:true,
    num:0,
    nums:0,
    type:[
      {name:'个人'},
      {name:'学校'},
      {name:'企业'},
      {name:'政府'},
    ],
    progre:0,
    typ:'',
    sum:'',
    sums:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
     if(options.id){
       id = options.id
       this.getagain();
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
     images = [];
     simages = [];
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
  //查看图片
  Preview: function (e) {
    var that = this;

    console.log(e)
   if(e.currentTarget.dataset.num == 0){
     var a = []
     a.push(e.currentTarget.id)
     wx.previewImage({
       current: e.currentTarget.id,
       urls: a
     })
   }else{
     wx.previewImage({
       current: e.currentTarget.id,
       urls: that.data.images
     })
   }


  },
  //删除个人照照片
  detels(e) {
    var that = this;
    console.log(e)
    console.log(that.data.imgs)


   if(e.currentTarget.dataset.num == 1){
     simages.splice(e.currentTarget.dataset.index, 1)
     images.splice(e.currentTarget.dataset.index, 1)
     that.setData({
       images: images,
       img_num: that.data.img_num - 1
     })
     console.log(simages.length)
     if (simages.length < 9) {
       that.setData({
         img_show: false
       })
     }
   } else if (e.currentTarget.dataset.num == 0){
     that.setData({
       zhao1:true,
       zhaos1:'',
     })
     zhao1 =''
   }

  },
  downloadFile: function (e) {
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        if (res.platform == "ios"){
          _this.setData({
            ismask: !_this.data.ismask,
            ispdf: !_this.data.ispdf
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '点击确认复制链接去浏览器打开',
          //   success(res) {
          //     if (res.confirm) {
          //       wx.setClipboardData({
          //         data: 'https://sjg.xcx.api.xingtu-group.cn/api-sjgxcxweb/file/download9',
          //         success: function (res) {
          //           // wx.showToast({
          //           //   title: '复制成功',
          //           //   icon:'none'
          //           // });
          //         }
          //       })
          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //     }
          //   }
          // })
        }else{
          let type = e.currentTarget.dataset.type;
          let url = e.currentTarget.dataset.url;
          wx.downloadFile({
            url: url,
            success: function (res) {
              console.log(res)
              var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
              wx.openDocument({
                filePath: Path,
                success: function (res) {
                  console.log('打开文档成功')
                }
              })
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      },
    })
    console.log(e);

    // switch (type) {
    //   case "pdf":
    //     url += 'pdf';
    //     break;
    //   case "word":
    //     url += 'docx';
    //     break;
    //   case "excel":
    //     url += 'xlsx';
    //     break;
    //   default:
    //     url += 'pptx';
    //     break;
    // }


  },
  //取消
  cancel(){
    this.setData({
      ismask:!this.data.ismask,
      ispdf:!this.data.ispdf
    })
  },
  confirm() {
    this.setData({
      ismask: !this.data.ismask,
      ispdf: !this.data.ispdf
    })
    wx.setClipboardData({
      data: 'https://sjg.xcx.api.xingtu-group.cn/api-sjgxcxweb/file/download9',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon:'none',
          duration:2500,
        });
      }
    })
  },
  //
  quer(){
    this.setData({
      isdelete:true,
      ismask:true,
    })
  },
  //取消
  detel() {
    this.setData({
      address: true,
      ismask: true,
    })
  },
  //项目标题
  title(e){
    this.setData({
      title:e.detail.value
    })
 },
  //目标金额
  menoy(e){
     this.setData({
       menoy:e.detail.value
     })
  },
  //申请人
  name(e){
    this.setData({
      name:e.detail.value
    })
 },
 //手机号码
 phone(e){
  this.setData({
    phone:e.detail.value
  })
},
  //困难
  difficult(e){
    this.setData({
      xuan:e.detail.value
    })
  },
  //主体
  type(e){
     console.log(e)
     this.setData({
       typ: this.data.type[e.detail.value].name,

     })
  },
  //困难描述
  valueChange(e) {
    console.log(e.detail.value.length)
    this.setData({
      num: e.detail.value.length,
      sum: e.detail.value,
    })

  },
  valueChanges(e) {
    console.log(e.detail.value.length)
    this.setData({
      nums: e.detail.value.length,
      sums: e.detail.value
    })

  },
  //绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "/login/xcxbindphone",
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
            that.submit();
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
  //重新提交信息
  getagain(){
    let that = this;
    let data = {
      id

    }
    app.res.req('/userproject/applydetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
         that.setData({
           title: res.data.projectTitle,
           menoy: res.data.targetAmount,
           name: res.data.applyName,
           phone: res.data.applyUserPhone,
           typ: res.data.applyBody,
           sum: res.data.projectExplain,
           sums: res.data.introduce,
           num: res.data.projectExplain.length,
           nums: res.data.introduce.length,
           city: res.data.cityName,
           area: res.data.areaName,
           town: res.data.townName,
           addres: res.data.provinceName + '-' + res.data.cityName + '-' + res.data.areaName + '-' + res.data.townName,
           zhaos1: res.data.qualificationImgOss,

           img_num: res.data.infoImgOss.length,
           zhao1:false,
           images: res.data.infoImgOss,
         })
        images = res.data.infoImgOss
          province_id = res.data.provinceId
          city_id = res.data.cityId
          area_id = res.data.areaId
          town_id = res.data.townId
          zhao1 = res.data.qualificationImg
          simages = res.data.infoImgs
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        console.log(1)
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
  //提交
  submit() {
    let that = this;
    if(that.data.title == ''){
      wx.showToast({
        title: '项目标题不能为空',
        icon:'none'
      })
    } else if (that.data.menoy == '') {
      wx.showToast({
        title: '所需目标金额不能为空',
        icon: 'none'
      })
    } else if (that.data.menoy > 100000 ) {
      wx.showToast({
        title: '所需目标金额最多10万',
        icon: 'none'
      })
    } else if (that.data.name == '') {
      wx.showToast({
        title: '请填写申请人姓名',
        icon: 'none'
      })
    } else if (that.data.phone == '') {
      wx.showToast({
        title: '请填写申请人手机号码',
        icon: 'none'
      })
    } else if (that.data.typ == '') {
      wx.showToast({
        title: '请选择申请主体',
        icon: 'none'
      })
    } else if (that.data.addres == '') {
      wx.showToast({
        title: '请选择所在地',
        icon: 'none'
      })
    } else if (that.data.zhaos1 == '') {
      wx.showToast({
        title: '请上传资助申请证明',
        icon: 'none'
      })
    } else if (that.data.images == '') {
      wx.showToast({
        title: '请上传相关图片',
        icon: 'none'
      })
    } else if (that.data.sum == '') {
      wx.showToast({
        title: '请填写求助说明',
        icon: 'none'
      })
    } else if (that.data.sums == '') {
      wx.showToast({
        title: '请填写项目介绍',
        icon: 'none'
      })
    }else{
      that.sub();
    }
  },
  sub(){
    let that = this;
    var Str = JSON.stringify(simages);
    if (id) {
      let data = {
        id: id,
        projectTitle: that.data.title,
        targetAmount: that.data.menoy,
        applyName: that.data.name,
        applyUserPhone: that.data.phone,
        applyBody: that.data.typ,
        provinceId: province_id,
        cityId: city_id,
        areaId: area_id,
        townId: town_id,
        qualificationImg: zhao1,
        infoImgJson: Str,
        projectExplain: that.data.sum,
        introduce: that.data.sums,
      }

      app.res.req('/userproject/againsubmit', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '重新提交成功，请等待审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            var pages = getCurrentPages();//当前页面栈
            if (pages.length > 1) {
              var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
              var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
              // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
              //   id: res.data.data
              // })
              beforePage.changeData();//触发父页面中的方法
            }
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
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
    } else {
      let data = {
        projectTitle: that.data.title,
        targetAmount: that.data.menoy,
        applyName: that.data.name,
        applyUserPhone: that.data.phone,
        applyBody: that.data.typ,
        provinceId: province_id,
        cityId: city_id,
        areaId: area_id,
        townId: town_id,
        qualificationImg: zhao1,
        infoImgJson: Str,
        projectExplain: that.data.sum,
        introduce: that.data.sums,
      }

      app.res.req('/project/subapply', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {
          wx.showToast({
            title: '提交成功，请等待审核',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            var pages = getCurrentPages();//当前页面栈
            if (pages.length > 1) {
              var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
              var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
              // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
              //   id: res.data.data
              // })
              beforePage.changeData();//触发父页面中的方法
            }
            wx.navigateBack({
              delta: 1
            })
          },2000)
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
   getType(){
     let that = this;
     let data = {
     }

     app.res.req('/home/classify', data, (res) => {
       console.log(res.data)
       if (res.status == 1000) {
         that.setData({
           type:res.data
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

        if(res.data == 100){
          wx.hideLoading();
        }else{
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
       var test1 =   setInterval(function(){
           that.getprogress();
        },1000)

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
                images:images,
                img_num:images.length
              })
              if (simages.length == 9) {
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
          fail(res){
            wx.hideLoading();
            wx.showToast({
              title: '上传失败,请检查网络',
              icon:'none'
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
   diz() {
    this.getprov();
    this.setData({
      address: false,
      ismask: false,
    })
  },
  //取消弹出层
  adres_all() {
    this.setData({

      address: true,
      ismask: true,

    })
  },
  x_prov() {
    let that = this;
    that.setData({
      isprov: true,
      iscity: false,
      isqu: false,
      isjie: false,
      tar: 1
    })
  },
  x_city() {
    let that = this;
    that.setData({
      isprov: false,
      iscity: true,
      isqu: false,
      isjie: false,
      tar: 2
    })
  },
  x_qu() {
    let that = this;
    that.setData({
      isprov: false,
      iscity: false,
      isqu: true,
      isjie: false,
      tar: 3
    })
  },
  x_jie() {
    let that = this;
    that.setData({
      isprov: false,
      iscity: false,
      isqu: false,
      isjie: true,
      tar: 4
    })
  },
  //省
  getprov: function () {


    let that = this;
    let data = {
      grade: 1,
      id: ''
    }
    app.res.req('/region/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          province:res.data
        })

      } else if (res.status == 1004 || res.status == 1005) {
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
  // 省跳市
  getprovs: function (e) {
    var that = this;
    console.log(e)

    province_id = e.currentTarget.id;
    that.setData({
      prov: e.currentTarget.dataset.name,
      tas1: e.currentTarget.dataset.index,
      tas2: 999,
      tas3: 999,
      tas4: 999,
      tar: 9,

    })

    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    // 获取所有市
    wx.request({
      url: app.data.urlmall + "/region/list",
      data: {
        grade: '2',
        id: province_id,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token'),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1000) {

          that.setData({
            citys: res.data.data,
            city: '',
            isprov: false,
            iscity: true,
            iscitys: true,
            isqu: false,
            isqus: false,
            isjie: false,
            isjies: false,

          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
    this.setData({ tapTime: nowTime });
  },
  // 市跳区
  getcity: function (e) {
    var that = this;

    city_id = e.currentTarget.id;;
    that.setData({
      city: e.currentTarget.dataset.name,
      tas2: e.currentTarget.dataset.index,
      tas3: 999,
      tas4: 999,
      tar: 9
    })
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    // 获取所有区
    wx.request({
      url: app.data.urlmall + "/region/list",
      data: {
        grade: '3',
        id: city_id,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token'),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1000) {
          that.setData({
            areas: res.data.data,
            area: '',
            iscity: false,
            isqu: true,
            isqus: true,
            isjie: false,
            isjies: false,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
    this.setData({ tapTime: nowTime });
  },
  // 区跳街道
  getarea: function (e) {
    var that = this;
    town = []

    area_id = e.currentTarget.id;
    that.setData({
      area: e.currentTarget.dataset.name,
      tas3: e.currentTarget.dataset.index,
      tar: 9,
      tas4: 999,
    })
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 500) {
      console.log('阻断')
      return;
    }
    // 获取所有区
    wx.request({
      url: app.data.urlmall + "/region/list",
      data: {
        grade: '4',
        id: area_id,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token'),
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1000) {

          town.push(...res.data.data)

          let a = { name: '-' }
          town.push(a)
          that.setData({
            towns: town,
            town: '',
            isjie: true,
            isjies: true,
            isqu: false,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
    this.setData({ tapTime: nowTime });
  },
  //街道
  gettown: function (e) {
    var that = this;
    town = []
    console.log(e)
    town_id = e.currentTarget.id;

    that.setData({ //给变量赋值
      ismask: true,
      tas4: e.currentTarget.dataset.index,
      addres: that.data.prov + '-' + that.data.city + '-' + that.data.area + '-' + e.currentTarget.dataset.name,
      address: true,
      town: e.currentTarget.dataset.name
    })
  },
})