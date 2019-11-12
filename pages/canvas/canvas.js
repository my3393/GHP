//canvas/canvas.js
Page({
  data: {
    code: '../../images/head.png', //如果是服务器图片一定要先下载到本地
    imgSrc: '',
    canva:true,
    res:'你的'
  },
  onLoad() {
    //此处可以结合我上一篇文章，在生成动态小程序码内调用canvasPoster(headImg); 
    this.canvasPoster(this.data.code);
  },
  
  canvasPoster(code) { //canvas绘制图片，code是动态小程序码，可看我上一篇文章
    wx.showToast({
      icon: 'loading',
      title: '海报制作中',
      duration: 1000
    })
    let that = this;
    let ctx = wx.createCanvasContext('posterCanvas', this);
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, 280, 450);
    ctx.setFontSize(14);
    ctx.setFillStyle('#ed4b33');
    ctx.fillText('用户名', 50, 40);
    ctx.setFillStyle('#41302C');
    ctx.fillText('标题', 15, 75);
    ctx.drawImage('../../images/noplay.png', 15, 90, 250, 200);
    //动态生成的小程序码（ps：网络图片一定要先下载到本地）
    ctx.drawImage(code, 20, 360, 60, 60);
    ctx.setFontSize(10);
    ctx.setFillStyle('#999');
    ctx.setTextAlign('center');
    ctx.fillText('关注【******】小程序', 140, 390);
    ctx.fillText('浏览更多精彩内容', 140, 410);
    ctx.setFillStyle('#000000');
    ctx.save();
    ctx.beginPath();
    ctx.arc(30, 35, 15, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage('../../images/head.png', 15, 20, 30, 30); //头像我是用的本地图片
    ctx.restore();
    ctx.setFontSize(30);
    ctx.setFillStyle('#e65099');
    ctx.fillText('￥28', 50, 310)
    ctx.setFontSize(20);
    ctx.fillText(that.data.res, 50, 340)
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({ //将canvas生成图片
        width: 280,
        height: 450,
        canvasId: 'posterCanvas',
        fileType: 'png',
        success: (canvasImgRes) => {
          this.setData({
            imgSrc: canvasImgRes.tempFilePath
          });
        }
      }, this);
    })
  },
  tap(){
    this.setData({
      canva:false
    })
    this.canvasPoster(this.data.code);
  },
  savePoster() {
    console.log(1111)
    var that = this
    wx.showToast({
         icon: 'loading',
         title: '正在保存图片',
         duration: 1000
      })
      //判断用户是否授权"保存到相册"
      wx.getSetting({
         success(res) {
            //没有权限，发起授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
               wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {//用户允许授权，保存图片到相册
                    wx.saveImageToPhotosAlbum({
                      filePath: that.data.imgSrc,
                      success(t) {
                        wx.showModal({
                          content: '图片已保存到相册',
                          showCancel: false,
                          confirmText: '好的',
                          success: function (t) {
                            if (t.confirm) {
                              console.log('用户确定了');
                              that.setData({
                                hidden: true
                              })
                            }
                          },

                        })
                      },
                      fail: function (t) {
                        console.log("失败", t);
                        wx.getSetting({
                          success: function (t) {
                            t.authSetting["scope.writePhotosAlbum"] || (console.log("进入信息授权开关页面"), wx.openSetting({
                              success: function (t) {
                                console.log("openSetting success", t.authSetting);
                              }
                            }));
                          }
                        });
                      }
                    })
                  },
                  fail() {//用户点击拒绝授权，跳转到设置页，引导用户授权
                     wx.openSetting({
                        success() {
                           wx.authorize({
                              scope: 'scope.writePhotosAlbum',
                              success() {
                                 that.savePhoto();
                              }
                           })
                        }
                     })
                  }
               })
            } else {//用户已授权，保存到相册
              wx.saveImageToPhotosAlbum({
                filePath: that.data.imgSrc,
                success(t) {
                  wx.showModal({
                    content: '图片已保存到相册',
                    showCancel: false,
                    confirmText: '好的',
                    success: function (t) {
                      if (t.confirm) {
                        console.log('用户确定了');
                        that.setData({
                          hidden: true
                        })
                      }
                    },

                  })
                },
                fail: function (t) {
                  console.log("失败", t);
                  wx.getSetting({
                    success: function (t) {
                      t.authSetting["scope.writePhotosAlbum"] || (console.log("进入信息授权开关页面"), wx.openSetting({
                        success: function (t) {
                          console.log("openSetting success", t.authSetting);
                        }
                      }));
                    }
                  });
                }
              })
            }
         }
      })

    
  }
})