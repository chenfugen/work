<template>
	<div class="login clearfloat">
		<Card class="login-card left">
			<img class="login-header" src="../assets/login/GE_LOGO.png"></img>
			<div class="login_title">通用净水IOT管理系统</div>
			<Form
				ref="loginForm"
				:model="loginForm"
				:rules="rule"
				class="login-form"
			>
				<FormItem prop="userName" class="formItem">
					<!-- eslint-disable -->
					<Icon class="login_icon" size='22' type="ios-person-outline"></Icon>
                    <div class="login_label">用户名：</div>
					<input
                        class="loginInput"
						type="text"
						@keyup.enter="handleFocus('un')"
						v-model="loginForm.userName"
						id="unInput"
					/>
					<!-- eslint-enable -->
				</FormItem>
				<FormItem prop="password" class="formItem">
					<!-- eslint-disable -->
					<Icon class="login_icon" size='22' type="ios-lock-outline"></Icon>
                    <div class="login_label">密&nbsp&nbsp&nbsp&nbsp码：</div>
					<input
                        class="loginInput"
						type="password"
						@keyup.enter="handleFocus('pw')"
						v-model="loginForm.password"
						id="pwdInput"
					/>
					<!-- eslint-enable -->
				</FormItem>
				<FormItem prop="code" class="formItem">
					<!-- eslint-disable -->
                    <Icon class="login_icon" size='22' type="ios-key-outline"></Icon>
                    <div class="login_label">验证码：</div>
					<input
                        style="width: 100px"
                        class="loginInput"
						type="text"
						@keyup.enter="handleFocus('va')"
						v-model="loginForm.code"
						id="vaInput"
					/>
                    <Tooltip content="点击刷新验证码" placement="right">
					    <canvas @click="getValidateCode" id="validateBox" class="validateBox"> </canvas>
				    </Tooltip>
					<!-- eslint-enable -->
				</FormItem>
				<div class="btnBox clearfloat">
					<Button class="loginBtn" type="primary" @click="handleLogin()">
                        登录
                    </Button>
				</div>
                <div class="login_tips">通用净水科技（香港）有限公司</div>
			</Form>
		</Card>
	</div>
</template>
<script>
var md5 = require("js-md5");
export default {
	name: "login",
	data() {
		return {
			img: "",
			validateLoading: false,
			timer: null,
			loginForm: {
				userName: "",
				password: "",
				code: "",
				codeId: "",
			},
			rule: {
				userName: [
					{
						required: true,
						message: "用户名不能为空",
						trigger: "blur",
					},
				],
				password: [
					{
						required: true,
						message: "密码不能为空",
						trigger: "blur",
					},
				],
				validate: [
					{
						required: true,
						message: "验证码不能为空",
						trigger: "blur",
					},
				],
			},
		};
	},
	created() {
		this.$store.dispatch("getValidateCode");
	},
	computed: {
		code() {
			return this.$store.state.login.code;
		},
	},
	watch: {
		code(val) {
			this.handleCreated(val);
		},
	},
	methods: {
		// 获取验证码
		getValidateCode() {
			this.$store.dispatch("getValidateCode");
		},
		// 调用验证码生成
		handleCreated(code) {
			let options = {
				canvasId: "validateBox",
				txt: code,
				height: 34,
				width: 103,
			};
			this.writeAuthCode(options);
		},
		// 生成验证码
		writeAuthCode(options) {
			var canvas = document.getElementById(options.canvasId);
			canvas.width = options.width || 300;
			canvas.height = options.height || 150;
			let ctx = canvas.getContext("2d"); /**创建一个canvas对象*/
			ctx.textBaseline = "middle";
			ctx.fillStyle = this.randomColor(
				180,
				255
			); /**这个范围的颜色作背景看起来清晰一些*/
			ctx.fillRect(0, 0, options.width, options.height);
			for (let i = 0; i < options.txt.length; i++) {
				let txt = options.txt.charAt(i); /**让每个字不一样*/
				ctx.font = "20px SimHei";
				ctx.fillStyle = this.randomColor(50, 160); /**随机生成字体颜色*/
				ctx.shadowOffsetY = this.randomNum(-3, 3);
				ctx.shadowBlur = this.randomNum(-3, 3);
				ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
				let x = (options.width / (options.txt.length + 1)) * (i + 1);
				let y = options.height / 2;
				let deg = this.randomNum(-30, 30);
				/**设置旋转角度和坐标原点*/
				ctx.translate(x, y);
				ctx.rotate((deg * Math.PI) / 180);
				ctx.fillText(txt, 0, 0);
				/**恢复旋转角度和坐标原点*/
				ctx.rotate((-deg * Math.PI) / 180);
				ctx.translate(-x, -y);
			}
			/**1~4条随机干扰线随机出现*/
			for (let i = 0; i < this.randomNum(1, 4); i++) {
				ctx.strokeStyle = this.randomColor(40, 180);
				ctx.beginPath();
				ctx.moveTo(
					this.randomNum(0, options.width),
					this.randomNum(0, options.height)
				);
				ctx.lineTo(
					this.randomNum(0, options.width),
					this.randomNum(0, options.height)
				);
				ctx.stroke();
			}
			/**绘制干扰点*/
			for (let i = 0; i < options.width / 6; i++) {
				ctx.fillStyle = this.randomColor(0, 255);
				ctx.beginPath();
				ctx.arc(
					this.randomNum(0, options.width),
					this.randomNum(0, options.height),
					1,
					0,
					2 * Math.PI
				);
				ctx.fill();
			}
		},
		// 随机数字
		randomNum(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		// 随机颜色
		randomColor(min, max) {
			let r = this.randomNum(min, max);
			let g = this.randomNum(min, max);
			let b = this.randomNum(min, max);
			return "rgb(" + r + "," + g + "," + b + ")";
		},
		// 登录相关
		handleLogin() {
			let userInput = document.getElementById("unInput"),
				pwdInput = document.getElementById("pwdInput"),
				vaInput = document.getElementById("vaInput");
			this.$refs["loginForm"].validate((valid) => {
				if (valid) {
					let para = Object.assign({}, this.loginForm);
					para.password = md5(para.password).toLocaleUpperCase();
					para.codeId = this.$store.state.login.codeId;
					this.$store.dispatch("handleLogin", para);
				} else {
					if (this.loginForm.userName == "") {
						this.timer = setTimeout(function () {
							userInput.children[2].focus();
							userInput.children[2].select();
						}, 100);
					} else if (this.loginForm.password == "") {
						this.timer = setTimeout(function () {
							pwdInput.children[2].focus();
							pwdInput.children[2].select();
						});
					} else if (this.loginForm.code == "") {
						this.timer = setTimeout(function () {
							vaInput.children[2].focus();
							vaInput.children[2].select();
						});
					}
				}
			});
		},
		// 控制焦点
		handleFocus(count) {
			let pwdInput = document.getElementById("pwdInput"),
				vaInput = document.getElementById("vaInput");
			if (count == "un") {
				this.timer = setTimeout(function () {
					pwdInput.focus();
				}, 100);
			} else if (count == "pw") {
				this.timer = setTimeout(function () {
					vaInput.focus();
				}, 100);
			} else {
				this.handleLogin();
			}
		},
		// 重置表单
		handleReset() {
			this.$refs.loginForm.resetFields();
		},
	},
};
</script>
<style scope>
.login {
	width: 100%;
	height: 100%;
	background-image: url(../assets/login/bg.jpg);
}
.login-card {
	width: 350px;
	display: block;
	margin-left: calc(50vw - 175px);
	margin-top: 15%;
}

.login-header {
	display: block;
	width: 60px;
	height: 60px;
	margin: 0 auto;
}

.login-form {
	width: 90%;
	margin: 0 auto;
	margin-top: 20px;
}

#validateBox {
	display: inline-block;
	vertical-align: top;
	/* background-color: gray */
}

.img {
	width: 100px;
	height: 100px;
}

.login_title {
	text-align: center;
	font-weight: 500;
}
.loginBtn {
	width: 100%;
	display: block;
}
.loginInput {
	outline-color: invert;
	outline-style: none;
	outline-width: 0px;
	border: none;
	border-style: none;
	text-shadow: none;
	-webkit-appearance: none;
	-webkit-user-select: text;
	outline-color: transparent;
	box-shadow: none;
	width: 200px;
	text-indent: 10px;
	font-size: 12px;
	height: 34px;
	display: inline-block;
	vertical-align: top;
}

.formItem {
	border-bottom: 1px solid #ccc;
	vertical-align: top;
}
.login_label {
	display: inline-block;
	line-height: 34px;
	width: 48px;
	height: 34px;
	vertical-align: top;
}
.login_icon {
	width: 22px;
	display: inline-block;
	vertical-align: top;
	margin-top: 3px;
	margin-right: 10px;
}
.login_tips {
	text-align: center;
	font-size: 12px;
	color: #999;
	margin-top: 10px;
}
</style>
