// 2.0 解析编译html模板
class Compile {
  // 2.1 获取到root元素以及Vue实例对象
  constructor(el, vm) {
    // el,获取到根元素,判断是传入选择器还是传入DOM对象
    this.el = typeof el === "string" ? document.querySelector(el) : el;
    // Vue实例对象
    this.vm = vm;

    // 2.2 当有传入root元素时,编译解析模板字符串内容
    if (this.el) {
      // 2.2.1 把el中所有的子节点都放入到内存中,创建一个fragment对象
      let fragment = this.node2fragment(this.el);
      // 2.2.2 把文档碎片进行编译
      this.compile(fragment)
      // 2.2.3 把fragment添加到页面中
      this.el.appendChild(fragment);
    }
  }

  /**
   * 编译类核心方法
   */
  // 核心方法1
  node2fragment(node) {
    // 2.3.1 新建文档碎片对象
    let fragment = document.createDocumentFragment();
    // 2.3.2 获取节点的子元素,获取的子元素是类数组
    let childNodes = node.childNodes;
    this.toArray(childNodes).forEach(node => {
      fragment.appendChild(node);
    })
    return fragment;
  }

  // 核心方法2,编译文档碎片
  compile(fragment) {
    // 2.4.1 获取到文档碎片
    let childNodes = fragment.childNodes;
    // 2.4.2 遍历文档碎片下一层的子节点
    this.toArray(childNodes).forEach(node => {
      // 2.4.3 编译元素类型节点
      if (this.isElementNode(node)) {
        this.compileElement(node);
      }

      // 2.4.4 编译文本类型阶段
      if (this.isTextNode(node)) {
        this.compileText(node);
      }

      // 2.4.5 当前节点还有子节点时,递归调用解析
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 核心方法3,解析html标签
  compileElement(node) {
    // 2.5.1 获取当前节点的所有属性
    let attributes = node.attributes;
    this.toArray(attributes).forEach(attr => {
      // 2.5.2 解析vue指令
      let attrName = attr.name;


      // 2.5.3 判断是否为指令属性
      if (this.isDirective(attrName)) {
        let type = attrName;
        let expr = attr.value;
        // debugger
        // 2.5.4 解析v-on以及@指令
        if (this.isEventDirective(type)) {
          CompileUtils["eventHandler"](node, this.vm, type, expr);
        } else {
          // 为了兼容@
          type = type.slice(2);
          CompileUtils[type] && CompileUtils[type](node, this.vm, expr);
        }
      }
    });
  }

  // 核心方法4,解析文本内容
  compileText(node) {
    CompileUtils.mustache(node, this.vm);
  }


  /**
   * 编译类工具方法
   */
  // 工具方法1 类数组对象转数组对象
  toArray(likeArray) {
    return Array.prototype.slice.call(likeArray);
  }
  // 工具方法2,判断是否为元素节点
  isElementNode(node) {
    // nodeType: 节点类型 1:元素节点 3:文本节点
    return node.nodeType === 1;
  }
  // 判断是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断是否为指令
  isDirective(attrName) {
    // debugger
    // v-html/v-text
    return attrName.startsWith("v-") || attrName.startsWith("@");
  }
  // 判断是否为事件指令
  isEventDirective(type) {
    return (type.split(":")[0] === "v-on" || type.startsWith("@"));
  }
}

const CompileUtils = {
  mustache(node, vm) {
    let text = node.textContent;
    let reg = /\{\{(.+)\}\}/;
    if (reg.test(text)) {
      let expr = RegExp.$1;
      node.textContent = text.replace(reg, this.getVMValue(vm, expr));
    }
  },
  // 解析v-text指令
  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr);
  },
  // 解析v-html指令
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr);
  },
  eventHandler(node, vm, type, expr) {
    // debugger
    // 事件类型
    let eventType = (type.startsWith("v-on") && type.split(":")[1]) || type.slice(1);

    // 处理函数
    let fn = vm.$methods && vm.$methods[expr];

    // console.log(fn);
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm));
    }
  },
  getVMValue(vm, expr) {
    // 获取到data中的数据
    let data = vm.$data;
    // 修复深层对象数据格式问题
    expr.split(".").forEach(key => {
      data = data[key];
    });
    return data;
  }
}