module.exports = {
	phoneFilter: function(n) {
		if (n == "" || n == undefined || n == null)
			return "--";
		else
			var number = new Number(n);
		var a = number.toString();
		var res = a.substr(0, 3) + "****" + a.substr(7);
		return res;
	},
	nullDeal: function(res) {
		if (res == "" || res == undefined || res == null) {
			return "--";
		} else {
			return res;
		}
	},
	showDate: function(res) {
		return res.split(' ')[0];
	},
	applyType: function(res){
		var applyStatus="";
		var status=res.split(",")[0];
		var refuse=res.split(",")[1];
		if(status==1 && refuse==0){
			applyStatus="待审批"
		}else if(status==2 && refuse==0){
			applyStatus="审批中"
		}else if(status==3 && refuse==0){
			applyStatus="已完成"
		}else{
			applyStatus="已拒绝";
		}
		return applyStatus;
	},
	formatTime: function(res) {
		res = res.split('T')[0]
		return res.replace(/\-/g, "/"); // 将格式化后的字符串输出到前端显示
	},
	foematDate: function(res) {
		res = res.split('T')[0] + " " + res.split('T')[1].split('.')[0]
		return res.replace(/\-/g, "/"); // 将格式化后的字符串输出到前端显示		
	},
	tofixed: function(res) {
		if (res == "" || res == undefined || res == null) {
			return "--";
		} else {
			return res.toFixed(0)
		}
	},
	transferTime: function(res) {
		if (res >= 10) {
			return res + ":00";
		} else {
			return "0" + res + ":00";
		}
	}
}
