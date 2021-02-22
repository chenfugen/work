const toString = Object.prototype.toString
// 判断是否是对象
export const isPlainObject = function (data) {
  return toString.call(data) === '[object Object]'
}
// 深拷贝
// 拷贝双向绑定对象是需要谨慎使用
export const deepCopy = function (data, target) {
  const map = new WeakMap()
  function _deepCopy(d, t) {
    let p = t || (Array.isArray(d) ? [] : {})
    if (map.get(d)) {
      return d
    }
    map.set(d,true)
    for (const key in d) {
      if (typeof d[key] === 'object' && d[key] !== null) {
        p[key] = Array.isArray(d[key]) ? _deepCopy(d[key], []) : _deepCopy(d[key], {})
      } else {
        p[key] = d[key]
      }
    }
    return p
  }
  return _deepCopy(data, target)
}