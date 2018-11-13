// 1.0 构建一个vue类,用来更新
class Vue {
  // 1.1 vue类构造函数,如果没传选项,给默认值
  constructor(options = {}) {
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods

    // 监听数据
    new Observer(this.$data);

    // 把数据代理到vm上
    this.proxy(this.$data);
    // 把methods代理到vm上
    this.proxy(this.$methods);

    // 1.2 编译模板,当root元素存在的时候,编译模板
    if (this.$el) {
      // 调用模板,传入参数,传入根元素以及Vue实例
      let compile = new Compile(this.$el, this);
    }
  }

  //通过代理,把数据代理到vm身上
  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          // 数据没有变化的话
          if (data[key] == newValue) {
            return
          }
          data[key] = newValue;
        }
      })
    });
  }
}