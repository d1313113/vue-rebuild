/**
 * 3.0创建一个observe类,给所有的数据添加getter和setter
 * 进行数据劫持
*/
class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }
  /**
   * 核心方法
   */
  /**
   * 3.1 遍历data中的所有数据,都添加上getter与setter
   */
  walk(data) {
    if (!data || typeof data != "object") {
      return
    }

    Object.keys(data).forEach(key => {
      // 给data对象的key设置getter和setter
      this.defineReactive(data, key, data[key]);
      // 如果是data[key]是复杂类型的数据,递归调用walk
      this.walk(data[key]);
    });
  }

  /*
   * 3.2 定义响应式数据(数据劫持)
   */
  defineReactive(data, key, value) {
    let that = this;
    let dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if (value === newValue) {
          return
        }
        // 设置传入的值
        value = newValue;
        // 如果传入的值是对象,应该进行深层递归调用,劫持数据
        that.walk(newValue);
        // 通知订阅者
        dep.notify();
      }
    })
  }

}