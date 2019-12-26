// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: true,
    statusBarHeight: 0,
    titleBarHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getbanner();
    this.setData({
      navH: app.globalData.navHeight
    })
    
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
        if (res.data.phone != null) {
          var phone = that.plusXing(res.data.phone, 3, 4)
          that.setData({
            phone: phone
          })
        }
        that.setData({
          user: res.data
        })
        console.log(that.data.user)
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
  downloadFile: function (e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let url = e.currentTarget.dataset.url;
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
  
  },
  //banner跳转
  banner(e) {
    console.log(e)
    if (e.currentTarget.dataset.xcxurl == '') {

    } else if (e.currentTarget.dataset.xcx.id == '') {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page + e.currentTarget.dataset.xcx.id,
      })
    }
  },
  //意见
  option(){
    wx.navigateTo({
      url: '../mine_opinion/mine_opinion',
    })
  },
  //修改信息
  person(){
    console.log(111)
    wx.navigateTo({
      url: '../person/person',
    })
  },
  //我的艺呗
  integral(){
     wx.navigateTo({
       url: '../mine_yb/mine_yb',
     })
  },
  //大学生认证
  college(){
     console.log(this.data.user.id == null)
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 16,
      })
    } else{
      wx.navigateTo({
        url: '../college/college',
      })
    }
   
  },
  //实名认证
  certification(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 18,
      })
    }else{
      wx.navigateTo({
        url: '../certification/certification',
      })
    }
   
  },
  //我的收藏
  collection(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 15,
      })
    } else{
      wx.navigateTo({
        url: '../mine_collection/mine_collection',
      })
    }
    
  },
  //会员
  member(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 13,
      })
    } else{
      wx.navigateTo({
        url: '../members/members',
      })
    }
   
  },
  //退款
  order_refund_list(){
    wx.navigateTo({
      url: '../order_refund_list/order_refund_list',
    })
  },
  //查看订单
  all(e){
    if (this.data.user.id == null || this.data.user.id == ''){
      wx.navigateTo({
        url: '../login/login?mine=' + 11,
      })
    }else{
      wx.navigateTo({
        url: '../order_all/order_all?id=' + e.currentTarget.id,
      })
    }
   
  },
  //资助申请
  mine_fund(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 14,
      })
    } else{
      wx.navigateTo({
        url: '../mine_fund/mine_fund',
      })
    }
   
  },
  //联系客服
  phone(){
    wx.showModal({
      title: '24小时全国免费咨询服务热线',
      content: '400-8292-878',
      confirmText:'立即拨打',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-8292-878',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  //我的钱包
  wallet(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 12,
      })
    } else{
      wx.navigateTo({
        url: '../mine_wallet/mine_wallet',
      })
    }
    
  },
  //商家入驻
  store_refund(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 19,
      })
    } else{
      wx.navigateTo({
        url: '../store_refund/store_refund',
      })
    }
    
  },
  //登录
  login(){
     wx.navigateTo({
       url: '../login/login',
     })
  },
  //收货地址
   address(){
     if (this.data.user.id == null || this.data.user.id == '') {
       wx.navigateTo({
         url: '../login/login?mine=' + 17,
       })
     } else{
       wx.navigateTo({
         url: '../address/address',
       })
     }
    
   },
   //信息大码
  plusXing(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },
  //轮播
  getbanner() {
    let that = this;
    let data = {

    }
    app.res.req('app-web/home/personalcenteradvertise', data, (res) => {
     
      if (res.status == 1000) {
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }

        that.setData({
          banner: res.data,

        })
        setTimeout(function () {
          that.getuser();
        }, 200)

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
   //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('app-web/user/info', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })
       
      }
    })
  },
  // onPageScroll: function (e) {
  //   console.log(e.scrollTop)
  //   let that = this
  //   if (e.scrollTop > 40) {
  //     that.setData({
  //       isshow: false,
  //     })
  //   } else {
  //     that.setData({
  //       isshow: true
  //     })
  //   }
  // },
})