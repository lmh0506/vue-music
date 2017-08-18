export function addClass(el, className) {
  // 如果有该class直接返回
  if (hasClass(el, className)) {
    return
  }
  // 没有的话先把他的class按空格分开  然后添加新的class进数组 最后用空格拼接成新的字符串赋值
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
