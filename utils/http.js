let sUrl = "https://sjg.xcx.api.xingtu-group.cn/api-sjgxcxweb";
function getData(url, data, nb) {
  wx.request({
    url: sUrl + url,
    data: data,
    method: 'post',
    header: {
      // "Content-Type": "json",   //get请求时候
      "Content-Type": "application/x-www-form-urlencoded", //POST请求的时候这样写
       'token': wx.getStorageSync('token')
    },
    success: function (res) {
      return typeof nb == "function" && nb(res.data)
    },
    fail: function (res) {
      return typeof nb == "function" && nb(res.data)
    }
  })
}
module.exports = {
  req: getData
}