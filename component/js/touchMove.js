//多点触摸均衡
export default class TouchMove {
  touches = [];
  changedTouches = [];
  x = 0;
  y = 0;
  toucheCount = 0;
  constructor(allowScale) {
    this.allowScale = allowScale;
  }
  scaleTouch(touchesNew, touchesOld) {
    let {
      x,
      y,
      distance,
    } = this.old;
    var nd = this.getDistance(touchesNew[0], touchesNew[1]);

    return {
      scale: (nd.distance + 190) / (distance + 190),
      is_scale: true,
      x: x,
      y: y
    };
  }
  switchTouch(touchesNew) {
    let touchesOld = this.changedTouches;
    let n, o, i, x, y, minx, miny, pagex = [],
      pagey = [],
      touchesNew2 = [];
    for (i = 0; i < touchesNew.length; i++) {
      n = touchesNew[i];
      o = touchesOld.find(a => a.identifier == n.identifier);
      if (!o) {
        continue
      };
      pagex.push(o.pageX - n.pageX);
      pagey.push(o.pageY - n.pageY);
      touchesNew2.push(n);
    }

    this.changedTouches = touchesNew2;
    if (!touchesNew2.length)
      return false;
    if (this.allowScale && touchesNew2.length == 2) {
      return this.scaleTouch(touchesNew2, touchesOld);
    }
    x = Math.max(...pagex);
    y = Math.max(...pagey);
    minx = Math.min(...pagex);
    miny = Math.min(...pagey);
    if (x < 0) x = minx, minx = 0;
    if (y < 0) y = miny, miny = 0;
    if (minx < 0) x += minx;
    if (miny < 0) y += miny;
    return {
      x,
      y
    }
  }
  onMove(e) {
    switch (e.type) {
      case 'touchmove':
        var p = this.switchTouch(e.touches);
        if (!p) return {};
        if (p.is_scale) {
          return {
            type: 'scale',
            scale: p.scale,
            x: p.x,
            y: p.y
          };
        }
        this.x += p.x;
        this.y += p.y;
        this.dx = p.x;
        this.dy = p.y;
        if (this.is_first) {
          this.is_first = false;
          if (Math.abs(this.x) * .6 > Math.abs(this.y)) {
            this.first = 'x';
          } else {
            this.first = 'y';
          }
        }
        return {
          type: 'move',
          first: this.first,
          x: -this.x,
          y: -this.y
        };
        break;
      case 'touchstart':
        this.timer && (clearInterval(this.timer), this.timer = 0, this.__callback__({
          type: 'end',
          x: -this.x,
          y: -this.y
        }));
        if (this.changedTouches.length == 0) {
          this.x = 0;
          this.y = 0;
          this.is_first = true;
        }
        this.dx = 0;
        this.dy = 0;
        this.toucheCount++;
        this.changedTouches.push(...e.changedTouches);
        if (this.changedTouches.length == 2) {
          this.old = this.getDistance(this.changedTouches[0], this.changedTouches[1]);
        }
        return {
          type: 'start',
          x: 0,
          y: 0
        };
      default:
        this.toucheCount--;
        let index = this.changedTouches.findIndex(a => a.identifier == e.changedTouches[0].identifier);
        this.changedTouches.splice(0, index + 1);
        if (this.changedTouches.length == 0) {
          if (Math.abs(this.dx) > 2 || Math.abs(this.dy) > 2) {
            return this.toinertia();
          }
          return {
            type: 'end',
            first: this.first,
            x: -this.x,
            y: -this.y
          };
        }
        break;
    }
    return {};
  }
  toinertia() {
    let {
      dx,
      dy
    } = this;
    let that = this;
    return {
      inertia: function(callback, inertance = 0.86) {
        that.__callback__ = callback;
        let inertia = 0;
        that.timer = setInterval(function() {
          dx *= inertance;
          dy *= inertance;
          if (inertia & 1) dx = 0;
          if (inertia & 2) dy = 0;
          that.x += dx;
          that.y += dy;
          inertia = callback({
            type: 'move',
            y: -that.y,
            x: -that.x
          }) || 0;
          if ((Math.abs(dx) <= 1 && Math.abs(dy) <= 1)) {
            clearInterval(that.timer), that.timer = 0;
            callback({
              type: 'end',
              y: -that.y,
              x: -that.x
            })
            return;
          }
        }, 20);
      },
      type: 'end',
      first: this.first,
      x: -this.x,
      y: -this.y
    };
  }
  getDistance(touch1, touch2) {
    var x, y, newDistance;
    x = Math.round(touch2.clientX - touch1.clientX);
    y = Math.round(touch2.clientY - touch1.clientY);
    return {
      x,
      y,
      distance: Math.round(Math.sqrt(x ** 2 + y ** 2))
    };
  }
  retrnEnd() {
    this.changedTouches = [];
    return {
      type: 'end',
      first: this.first,
      x: -this.x,
      y: -this.y
    };
  }
}