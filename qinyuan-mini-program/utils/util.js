const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取wxcode
const getWxCode = () => {
	let app = getApp()
	wx.login({
		success: res => {
			app.globalData.wxCode = res.code
			wx.setStorageSync('wxCode', JSON.stringify(res.code))
		}
	})
}

// 弹窗提示
const toast = function (msg, fun) {
	wx.showModal({
		title: '',
		content: msg,
		showCancel: false,
		success: res => {
			if (fun) {
				fun()
			}
		}
	})
}

module.exports = {
  formatTime: formatTime,
}
