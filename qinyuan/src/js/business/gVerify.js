/*干扰线的随机x坐标值*/
function lineX(canvasWidth) {
	var ranLineX = Math.floor(Math.random() * canvasWidth);
	return ranLineX;
}

/*干扰线的随机y坐标值*/
function lineY(canvasHeight) {
	var ranLineY = Math.floor(Math.random() * canvasHeight);
	return ranLineY;
}

function clickChange(arr, canvasWidth, canvasHeight) {
	var mycanvas = document.getElementById('mycanvas');
	var cxt = mycanvas.getContext('2d');
	cxt.fillStyle = '#fff';
	cxt.fillRect(0, 0, 105, canvasHeight);
	cxt.strokeRect(100, 100, 60, 60); //红色边框矩形
	cxt.clearRect(0, 0, 105, canvasHeight);
	/*生成干扰线20条*/
	for (var j = 0; j < 15; j++) {
		cxt.strokeStyle = bg3();
		cxt.beginPath(); //若省略beginPath，则每点击一次验证码会累积干扰线的条数
		cxt.moveTo(lineX(canvasWidth), lineY(canvasHeight));
		cxt.lineTo(lineX(canvasWidth), lineY(canvasHeight));
		cxt.lineWidth = 0.5;
		cxt.closePath();
		cxt.stroke();
	}
	/**绘制干扰点**/
	for (var i = 0; i < 15; i++) {
		cxt.fillStyle = bg3();
		cxt.beginPath();
		cxt.arc(randomNum(0, canvasWidth), randomNum(0, canvasWidth), 1, 0, 2 * Math.PI);
		cxt.fill();
	}
	for (var i = 0; i < 6; i++) {
		cxt.fillStyle = bg3();
		cxt.font = randomNum(15, 30) + 'px SimHei'; //随机生成字体大小
		var x = canvasWidth / 5 * i;
		var y = canvasHeight / 2;
		var deg = randomNum(-30, 30);
		/**设置旋转角度和坐标原点**/
		cxt.translate(x, y);
		cxt.rotate(deg * Math.PI / 180);
		cxt.fillText(arr[i], 0, Math.random() * 3);
		/**恢复旋转角度和坐标原点**/
		cxt.rotate(-deg * Math.PI / 180);
		cxt.translate(-x, -y);
	}
}

function bg3() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ',' + g + ',' + b + ")"; //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}