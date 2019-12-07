// plugin/imgcut/imgcut.js
import TouchMove from '../js/touchMove';
Component({
  properties: {
    src: String,
    width: {
      type: Number,
      value: 250
    },
    height: {
      type: Number,
      value: 250
    },
  },
  data: {
    scaleform: '',
    transform: '',
    img_width: 200,
    img_height: 200
  },
  ready() {
    this.mover = new TouchMove(true);
    this.x = 0;
    this.y = 0;
    this.canvas = wx.createCanvasContext('canvas', this);
  },
  methods: {
    endxy(x, y) {
      let scale = Math.min(Math.max(this.scale, 1), this.data.max_scale);
      var maxx = (this.data.img_width * scale - this.data.width) / 2 + this.data.center.x;
      var maxy = (this.data.img_height * scale - this.data.height) / 2 + this.data.center.y;
      let minx = -this.data.img_width + this.data.width - maxx;
      let miny = -this.data.img_height + this.data.height - maxy;

      this.x += x;
      this.y += y;
      if (this.x < minx) {
        this.x = minx;
      } else if (this.x > maxx) {
        this.x = maxx;
      }
      if (this.y < miny) {
        this.y = miny;
      } else if (this.y > maxy) {
        this.y = maxy;
      }
      this.setData({
        scale,
        scaleform: `transform:scale(${scale});transition: transform .3s;`,
        transform: `transform:translate3d(${this.x}px,${this.y}px,0);transition: transform .3s;`
      });
      this.t = setTimeout(() => {
        this.setData({
          opacity: true
        });
        this.t = 0;
      }, 1500)
    },
    movexy(x, y) {
      let scale = Math.min(Math.max(this.data.scale, 1), this.data.max_scale);
      var maxx = (this.data.img_width * scale - this.data.width) / 2 + this.data.center.x;
      var maxy = (this.data.img_height * scale - this.data.height) / 2 + this.data.center.y;
      let minx = -this.data.img_width + this.data.width - maxx;
      let miny = -this.data.img_height + this.data.height - maxy;
      x += this.x;
      y += this.y;
      if (x < minx) {
        x = minx - (-x + minx) ** 0.8;
        this.inertia |= 1;
      } else if (x > maxx) {
        x = maxx + (x - maxx) ** 0.8;
        this.inertia |= 1;
      }
      if (y < miny) {
        y = miny - (-y + miny) ** 0.8;
        this.inertia |= 2;
      } else if (y > maxy) {
        y = maxy + (y - maxy) ** 0.8;
        this.inertia |= 2;
      }
      this.setData({
        opacity: false,
        transform: `transform:translate3d(${x}px,${y}px,0) `
      })
    },
    onMove(e) {
      if (!this.hasImg) return;
      let r = this.mover.onMove(e);
      switch (r.type) {
        case 'move':
          this.movexy(r.x, r.y);
          if (this.t) {
            clearTimeout(this.t);
            this.t = 0;
          }
          break;
        case 'end':
          if (r.inertia) {
            this.inertia = 0;
            r.inertia(r => {
              if (r.type == 'end') {
                this.endxy(r.x, r.y);
              } else {
                this.movexy(r.x, r.y);
                return this.inertia;
              }
            })
          } else {
            this.endxy(r.x, r.y);
          }
          break;
        case "scale":
          this.scale = this.data.scale * r.scale;
          this.setData({
            opacity: false,
            scaleform: `transform:scale(${this.scale});`
          });
          if (this.t) {
            clearTimeout(this.t);
            this.t = 0;
          }
          break;
      }
    },
    onimgLoad(e) {
      let {
        width,
        height
      } = e.detail;
      this.hasImg = true;
      this.initConfig(width, height);
    },
    onimgerr(e) {
      this.hasImg = false;
      console.error(e)
    },
    cut() {
      if (!this.hasImg) {
        return Promise.reject({
          errMsg: '请先选择图片'
        })
      }
      let {
        x,
        y
      } = this;
      let {
        scale,
        max_scale
      } = this.data;
      var maxx = (this.data.img_width * scale - this.data.width) / 2 + this.data.center.x;
      var maxy = (this.data.img_height * scale - this.data.height) / 2 + this.data.center.y;
      let w = this.data.width * max_scale / scale;
      let h = this.data.height * max_scale / scale;
      x = (maxx - x) * max_scale / scale;
      y = (maxy - y) * max_scale / scale;
      wx.showLoading({
        title: '请稍后...',
      });
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          x: x,
          y: y,
          width: w,
          height: h,
          success: r => {
            wx.hideLoading();
            resolve(r.tempFilePath);
          },
          fail() {
            wx.hideLoading();
            reject({
              errMsg: '截取失败'
            })
          }
        }, this)
      })
    },
    initConfig(width, height) {
      let wr = width / this.data.width;
      let hr = height / this.data.height;
      let r = Math.min(hr, wr);
      if (hr < wr) {
        width /= hr;
        height = this.data.height;
      } else {
        height /= wr;
        width = this.data.width;
      }
      let x = (this.data.width - width) / 2;
      let y = (this.data.height - height) / 2;
      this.scale = 1;
      this.setData({
        center: {
          x,
          y
        },
        max_scale: r,
        img_width: width,
        img_height: height,
      }, () => {
        this.canvas.setFillStyle('#000000')
        this.canvas.fillRect(0, 0, width * r, height * r);
        this.canvas.drawImage(this.data.src, 0, 0, width * r, height * r);
        this.canvas.draw();
      });
      this.endxy(x, y);
    }
  }
})