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
	airFilter: n => {
		let res;
		if(n <= 35) {
			res = "优";
		} else if(n > 35 && n <= 75) {
			res = "良";
		} else if(n > 75 && n <= 115) {
			res = "轻度污染";
		} else if(n > 115 && n <= 150) {
			res = "中度污染";
		} else if(n > 150 && n <= 250) {
			res = "重度污染";
		} else if(n > 250) {
			res = "严重污染";
		} else {
			res = "良";
		}
		return res;
	},
	nullDeal: res => {
		if(res == "" || res == undefined || res == null) {
			return "--";
		} else {
			return res;
		}
	},
	formatTime: res => {
		res = res.split('T')[0]
		return res.replace(/\-/g, "/"); // 将格式化后的字符串输出到前端显示
	},
	foematDate: res => {
		res = res.split('T')[0] + " " + res.split('T')[1].split('.')[0]
		return res.replace(/\-/g, "/"); // 将格式化后的字符串输出到前端显示		
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
	},
	deviceTypeFilter: res => {
		let deviceType;
		if(res == "a1i8kpwPW9w" || res == "a1u3fpsU6yg"){
			deviceType = "2G";
		}else{			
			deviceType = "WIFI";
		}
		return deviceType;
	}
}
export default vFilter;