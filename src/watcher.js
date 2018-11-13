/**
 * 4.0 watcher模块负责把compile模块与observer模块关联起来,就是观察者模式
 */
class Watcher {
  constructor(vm, expr, callback) {
    this.vm = vm;
    this.expr = expr;
    this.callback = callback;

    // 新建的watcher对象,将watcher对象暂时存到target上
    Dep.target = this;
    // 先将旧值存储起来
    this.oldValue = this.getVMValue(vm, expr);
    // 清空Dep.target
    Dep.target = null;
  }

  /**
   * 核心方法
   */
  /**
   * 更新view视图层方法,对外暴露
   */
  update() {
    console.log(1);
    // 对比值是否变化,如果值变化,调用回调函数
    let oldValue = this.oldValue;
    let newValue = this.getVMValue(this.vm, this.expr);
    if (oldValue != newValue) {
      this.callback(newValue, oldValue);
    }
  }

  getVMValue(vm, expr){
    // 获取data中的值
    let data = vm.$data;
    expr.split(".").forEach(key => {
      data = data[key];
    })
    return data;
  }
}

/**
 * 4.1 一个订阅者,负责收集订阅者以及通知订阅者
 */
class Dep {
  constructor() {
    // 收集数据订阅者
    this.subs = [];
  }

  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher);
  }

  // 通知
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}