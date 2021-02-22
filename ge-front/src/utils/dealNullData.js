function dealNullData(data) {
	if (data === undefined || data === null || data === 0 || data === "") {
		return '--'
	} else if (typeof data == 'object' || typeof data == 'array') {
		return JSON.stringify(data)
	} else {
		return data
	}
}

function dealTime(date) {
	if (date == null || date == undefined) {
		return '--'
	} else {
		date = new Date(date)
		let y = date.getFullYear(),
			mon = Number(date.getMonth()) + 1 < 10 ? 0 + String(date.getMonth() + 1) : Number(date.getMonth()) + 1,
			d = Number(date.getDate()) < 10 ? 0 + String(date.getDate()) : date.getDate(),
			h = Number(date.getHours()) < 10 ? 0 + String(date.getHours()) : date.getHours(),
			m = Number(date.getMinutes()) < 10 ? 0 + String(date.getMinutes()) : date.getMinutes(),
			s = Number(date.getSeconds()) < 10 ? 0 + String(date.getSeconds()) : date.getSeconds()
		return y + '-' + mon + '-' + d + ' ' + h + ':' + m + ':' + s
	}
}
export default {
	dealNullData,
	dealTime
}