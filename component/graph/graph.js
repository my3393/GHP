
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 左侧标题
    plugin_img: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '/images/cellection.png' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    introduce: {
      type: String,
      value: '大爱无疆，助力家乡'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    popView: function () {
      // 注册点击事件传给父组件
      this.triggerEvent('popView')
    }
  }
})
