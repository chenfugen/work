import dayjs from 'dayjs'
import qs from 'qs'
/**
 * @description 将时间戳格式化为指定格式
 * @export
 * @param {number} time
 * @param {string} [format='YYYY-MM-DD HH:mm']
 * @returns {string}
 */
export function formatTime(time: number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (time) {
    return dayjs(time).format(format)
  }
  return ''
}
/**
 * @description 将秒记得数字转换为友好时间 如： 6000 -> 1小时40分钟
 * @export
 * @param {number} time 单位秒
 * @returns {string} 如 1小时40分钟
 */
export function formatDisplayTime(time: number) {
  let hours = 0,
    minutes = 0,
    seconds = time
  if (time > 60) {
    minutes = (time / 60) >> 0
    seconds = time % 60
  }
  if (minutes > 60) {
    hours = (minutes / 60) >> 0
    minutes = minutes % 60
  }
  let map = ['小时', '分钟', '秒']
  let times = [hours, minutes, seconds]
  let formArr = times.map((num, index) => {
    if (num) {
      return `${num}${map[index]}`
    } else {
      return ''
    }
  })
  return formArr.join('')
}

/**
 *
 *
 * @export 通过打开新窗口下载文件，适用于get请求
 * @param {*} url
 * @param {*} params
 */
export function downloadByOpenWindow(url: string, params: any) {
  let downloadParams = {
    ...params
  }
  let origin = window.location.origin + url + '?' + qs.stringify(downloadParams)
  window.open(origin, '_blank')
}

/**
 *
 * @export - 创建一个待下载链接的A标签并下载
 * @param {*} url 绝对路径与相对路径
 * @param {*} fileName 下载文件的文件名称
 */
export function createDownloadElement(url: string, fileName: string) {
  let a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * @description 字节数转化为简短显示
 * @export
 * @param {number} byte 字节数
 * @returns {string} 优化显示的大小 kb, mb
 */
export function formatSize(byte: number): string {
  let kb = byte / 1024
  if (isNaN(kb)) return '-'
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`
  }
  let mb = (kb / 1024).toFixed(2)
  return `${mb} MB`
}
