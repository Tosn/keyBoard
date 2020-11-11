import keyBoardComp from './Index.vue'
import Vue from 'vue'
let timeOutFn = null
const isIphone = () => {
  const na = navigator.userAgent
  return na.indexOf('iPhone') >= 0
}
const ciphertext = isIphone() ? '●' : '*'
/**
 * @description -判断dom中是否已存在元素node
 * @author Tosn
 * @param {*} node
 * @returns {Boolean}
 */
function hasNode (node) {
  return document.body.contains(node)
}

function offsetPx (el) {
  // 安卓下 用css 便宜的方式 处理光标位置
  if (!isIphone()) {
    const styles = `margin-left: -${el.value.length * 1.2}px`
    const ele = el.parentNode.querySelector('.keyboard-cursorbox')
    if (ele) {
      ele.setAttribute('style', styles)
    }
  }
}

function addClass (el, className) {
  const originClass = el.getAttribute('class')
  el.setAttribute('class', `${originClass} ${className}`)
}

function removeClass (el, className) {
  const originClass = el.getAttribute('class')
  el.setAttribute('class', originClass.replace(className, ''))
}

/**
 *
 * @param {*} el input 元素
 * @description 用于创建和更新光标
 * @returns ELEMENT
 */
function createCursor (el) {
  // 判断 如果已经存在
  const oriBox = el.parentNode.querySelector('.keyboard-cursorbox')
  if (oriBox) {
    oriBox.innerHTML = ciphertext.repeat(el.value.length)
    offsetPx(el)
    return
  }
  const cBox = document.createElement('div')
  cBox.className = 'keyboard-cursorbox'
  cBox.innerHTML = ciphertext.repeat(el.value.length)
  return cBox
}

/**
 *
 * @param {*} el input 元素
 * @description 用于删除光标元素
 */
function removeCursor (el) {
  const oriBox = el.parentNode.querySelector('.keyboard-cursorbox')
  if (oriBox) {
    el.parentNode.removeChild(oriBox)
  }
}

/**
 * @description -构建keyBoard键盘
 * @author Tosn
 * @param {*} el -当前激活元素
 * @param {*} mails -邮件的类型
 * @param {*} $instance -vue虚拟dom实例
 */
function createBoardHtml (el, $instance) {
  $instance.value = el.value
  if (!hasNode($instance.$el)) {
    document.body.appendChild($instance.$el)
    setTimeout(() => {
      addClass($instance.$el, 'keyboard-up')
    })
  }
  el.parentNode.appendChild(createCursor(el))
  offsetPx(el)
}

/**
 * @description -删除键盘dom
 * @author Tosn
 * @param {*} $instance  -vue虚拟实例
 */
function removeBoardHtml ($instance) {
  if (hasNode($instance.$el)) {
    // $instance.$destroy() // 释放内存
    removeClass($instance.$el, 'keyboard-up')
    setTimeout(() => {
      if (hasNode($instance.$el)) {
        document.body.removeChild($instance.$el)
      }
    }, 500)
  }
}

export default {
  inserted (el, binding) {
    const KeyBoardContainer = Vue.extend(keyBoardComp)
    const $instance = new KeyBoardContainer().$mount()
    el.setAttribute('readonly', 'readonly')
    // 给当前input塞值
    $instance.inserValue = val => {
      el.value = val

      // 绑定值 手动触发一次@input 使其变成双向绑定
      const event = document.createEvent('HTMLEvents')
      event.initEvent('input', false, true)
      el.dispatchEvent(event)
      createCursor(el)
    }

    $instance.removeBoardHtml = function () {
      removeBoardHtml($instance)
      removeCursor(el)
    }

    // 键盘盒子点击阻塞关闭键盘盒子
    $instance.$el.addEventListener('click', function (event) {
      event.stopPropagation()
      clearTimeout(timeOutFn)
    })

    // 当前元素点击 阻塞关闭键盘盒子
    el.addEventListener('click', function (event) {
      event.stopPropagation()
    })

    // 获取焦点 打开键盘
    el.addEventListener('focus', function () {
      createBoardHtml(el, $instance)
    })

    // 失去焦点 解除绑定事件
    el.addEventListener('blur', function () {
      timeOutFn = setTimeout(() => {
        $instance.removeBoardHtml()
      }, 200)
    })

    // 默认点击其他地方关闭
    window.addEventListener('click', function () {
      timeOutFn = setTimeout(() => {
        $instance.removeBoardHtml()
      }, 200)
    })
  }
}
