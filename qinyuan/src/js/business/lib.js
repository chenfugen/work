'use strict';

var _extends = Object.assign || function(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];
		for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};

var libsAjax = function libsAjax(method, api, para, feedback) {
	$.ajax({
		type: method,
		url: config.webAPI.address + api,
		data: _extends({}, para),
		async: false,
		dataType: 'json',
		success: function success(res) {
			feedback ? feedback(res) : function() {};
		},
		error: function error(err) {
			console.log(err);
		}
	});
};

var dealPhone = function(num) {
	var head = num.slice(0, 3)
	var tail = num.slice(7, 12)
	return head + '****' + tail
}