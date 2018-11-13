// 1.0 构建一个vue类,用来更新
class Vue {
  // 1.1 vue类构造函数,如果没传选项,给默认值
  constructor(options = {}) {
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods

    // 监听数据
    new Observer(this.$data);

    // 1.2 编译模板,当root元素存在的时候,编译模板
    if (this.$el) {
      // 调用模板,传入参数,传入根元素以及Vue实例
      let compile = new Compile(this.$el, this);
    }
  }
}