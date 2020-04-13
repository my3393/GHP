
export default class LastMayday {
  palette(res) {
    console.log(res)
    return (
     
      {
        
        "width": "654px",
        "height": "1000px",
        "background": "#fff",
        "views": [
          {
            "type": "image",
            "url": res[1],
            "css": {
              "width": "654px",
              "height": "1000px",
              "top": "0px",
              "left": "0px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "mode": "scaleToFill"
            }
          },
          {
            "type": "image",
            "url": res[0],
            "css": {
              
              "width": "120px",
              "height": "120px",
              "top": "800px",
              "left": "267px",
             
            }
          }
        ]
      }
    );
  }
}

const startTop = 10;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '40rpx',
};

function _textDecoration(decoration, index, color) {
  return ({
    type: 'text',
    text: decoration,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      color: color,
      textDecoration: decoration,
    }, common],
  });
}

function _image(index, rotate, borderRadius) {
  return (
    {
      type: 'image',
      url: '/palette/avatar.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        shadow: '10rpx 10rpx 5rpx #888888',
        rotate: rotate,
        borderRadius: borderRadius,
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
