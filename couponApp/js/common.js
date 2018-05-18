function tip(a) {
	var el;
	el = $.tips({
		content: a,
		stayTime: 2000,
		type: "warn"
	})
	el.on("tips:hide", function() {
		console.log("tips hide");
	})
}