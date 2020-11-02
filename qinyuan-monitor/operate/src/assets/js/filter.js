const vFilter = {
	phoneFilter: n => {
		if(n == "" || n == undefined || n == null)
			return "--";
		else
			var number = new Number(n);
		var a = number.toString();
		var res = a.substr(0, 3) + "****" + a.substr(7);
		return res;
	},
	nullDeal: res => {
		if(res == "" || res == undefined || res == null) {
			return "--";
		}else{
			return res;
		}
	},
	formatTime: res => {
		res = res.split('T')[0]
		return res.replace(/\-/g, "/"); // 将格式化后的字符串输出到前端显示
	},
	formatDate: res => {
		if(res == "" || res == undefined || res == null) {
			return "--";
		}else{
			let date = new Date(res);
			let Y = date.getFullYear() + '-';
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
			let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
			let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
			let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
			return Y + M + D + h + m + s;
		}		
	},
	tofixed: res => {
		if(res == "" || res == undefined || res == null) {
			return "--";
		} else {
			return res.toFixed(0)
		}
	},
	transferTime: res => {
		if(res >= 10) {
			return res + ":00";
		} else {
			return "0" + res + ":00";
		}
	}
}
export default vFilter;