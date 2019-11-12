const getPhone = (code, imgs, sWidth, sHeight, classNames, textStyle, successCallback, textcolor, codecolor) => {
  let that = this;
  const variableNum = sWidth / 750;
  const ctx = wx.createCanvasContext(classNames);
  ctx.drawImage(code, 250 * variableNum, 650 * variableNum, 100, 100); //绘制二维码
  ctx.drawImage(imgs, 40, 10, 600 * variableNum, 400 * variableNum);  //绘制图片
  ctx.setTextAlign(textStyle)
  ctx.setFillStyle(codecolor)
  ctx.setFontSize(28)
  ctx.fillText("我是文字部分....", 400 * variableNum, 500 * variableNum)
  ctx.setFillStyle(textcolor)
  ctx.fillText("长按二维码....", 400 * variableNum, 600 * variableNum)
  ctx.stroke()
  ctx.draw();
  setTimeout(function () {  //这里要加定时器，转成图片需要一定的时间，不然是不出来图片的哦
    // canvas画布转成图片
    var i = getCurrentPages(), a = i[i.length - 1];//获取当前引用该方法的data里面的值
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 580,
      height: 680,
      destWidth: 580,
      destHeight: 680,
      canvasId: classNames,
      fileType: 'png',
      success: (res) => {
        console.log(res);
        successCallback
        a.setData({
          imgurl: res.tempFilePath,
          hidden: false
        })
      },
      fail: function () {
        console.log("保存失败......")
      }
    })
  }, 2000)
}

module.exports = {//将此回调暴露出去
  getPhone: getPhone
}