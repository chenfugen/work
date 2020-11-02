<template>
	<div id="login">
		<div id="login-conter">
			<img style="width: 300px; height: 100%" src="../assets/imges/login.jpg" />
			<img
				style="width: 160px; height: 38px;position: absolute;top:64px;left:70px"
				src="../assets/imges/login_logo.png"
			/>
			<div>
				<p>欢迎来到</p>
				<p>莱克物联网管理平台</p>
				<el-form
					:model="loginForm"
					style="width:300px"
					ref="loginForm"
					:rules="codeRules"
					label-width="0"
					class="demo-ruleForm"
				>
					<el-form-item prop="userName" :rules="[{required: true, message: '请填写账号', trigger: 'blur' }]">
						<el-input style="margin-top: 50px" v-model.trim="loginForm.userName" placeholder="账号"></el-input>
					</el-form-item>
					<el-form-item prop="password" :rules="[{required: true, message: '请填写密码', trigger: 'blur' }]">
						<el-input
							type="password"
							autocomplete="off"
							show-password
							style="margin-top: 16px"
							v-model.trim="loginForm.password"
							placeholder="密码"
						></el-input>
					</el-form-item>
					<el-form-item prop="code" style="float: left;">
						<el-input
							style="margin-top: 16px;width:165px;float:left"
							v-model.trim="loginForm.code"
							placeholder="验证码"
						></el-input>
					</el-form-item>
					<div id="checkCode" @click="createCode(4)">
						<span class="codeSpan" :style="'transform:rotate('+code.a.deg+'deg)'">{{code.a.val}}</span>
						<span class="codeSpan" :style="'transform:rotate('+code.b.deg+'deg)'">{{code.b.val}}</span>
						<span class="codeSpan" :style="'transform:rotate('+code.c.deg+'deg)'">{{code.c.val}}</span>
						<span class="codeSpan" :style="'transform:rotate('+code.d.deg+'deg)'">{{code.d.val}}</span>
					</div>
					<el-button @click="loginSub('loginForm')" type="danger" style="margin-top: 24px;width:100%;">登录</el-button>
				</el-form>
			</div>
		</div>
		<div id="login-footer">
			<p>©2019-2020 莱克电气股份有限公司</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		var validateCode = (rule, value, callback) => {
			var code = "";
			for (var x in this.code) {
				code += this.code[x].val;
			}
			if (value === "") {
				callback(new Error("请输入验证码"));
			} else if (
				this.loginForm.code.toLowerCase() != code.toLowerCase()
			) {
				// this.loginForm.code = '';
				callback(new Error("验证码输入有误"));
				this.createCode(4);
			} else {
				callback();
			}
		};
		return {
			code: {
				a: {
					deg: 0,
					val: "",
				},
				b: {
					deg: 0,
					val: "",
				},
				c: {
					deg: 0,
					val: "",
				},
				d: {
					deg: 0,
					val: "",
				},
			},
			loginForm: {
				userName: "",
				password: "",
				code: "",
			},
			codeRules: {
				code: [
					{
						validator: validateCode,
						trigger: "blur",
					},
				],
			},
		};
	},
	created() {
		let that = this;
		document.onkeypress = function (e) {
			var keycode = document.all ? event.keyCode : e.which;
			if (keycode == 13) {
				that.loginSub("loginForm"); // 登录方法名
				return false;
			}
		};
	},
	mounted() {
		this.createCode(4);
		this.getCookie();
		this.loginOut();
	},
	methods: {
		loginSub(formName) {
			//获取输入的验证码
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$http.login(this.loginForm).then((res) => {
						if (res.data.success) {
							this.$store.commit("add_token", res.data);
							//保存到本地
							this.setCookie(this.loginForm.userName, "", 7);
							this.$router.push("/");
						}
					});
				} else {
					return false;
				}
			});
		},
		//设置cookie
		setCookie(c_name, c_pwd, exdays) {
			var exdate = new Date(); //获取时间
			exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
			//字符串拼接cookie
			window.document.cookie =
				"userName" +
				"=" +
				c_name +
				";path=/;expires=" +
				exdate.toGMTString();
			window.document.cookie =
				"userPwd" +
				"=" +
				c_pwd +
				";path=/;expires=" +
				exdate.toGMTString();
		},
		//读取cookie
		getCookie() {
			if (document.cookie.length > 0) {
				var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
				for (var i = 0; i < arr.length; i++) {
					var arr2 = arr[i].split("="); //再次切割
					//判断查找相对应的值
					if (arr2[0] == "userName") {
						this.loginForm.userName = arr2[1]; //保存到保存数据的地方
					} else if (arr2[0] == "userPwd") {
						this.loginForm.password = arr2[1];
					}
				}
			}
		},
		createCode(length) {
			//生成验证码
			var abcd = ["a", "b", "c", "d"];
			var codeLength = parseInt(length); //验证码的长度
			// var checkCode = document.getElementById("checkCode");
			////所有候选组成验证码的字符，当然也可以用中文的
			var codeChars = new Array(
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				"a",
				"b",
				"c",
				"d",
				"e",
				"f",
				"g",
				"h",
				"i",
				"j",
				"k",
				"l",
				"m",
				"n",
				"o",
				"p",
				"q",
				"r",
				"s",
				"t",
				"u",
				"v",
				"w",
				"x",
				"y",
				"z",
				"A",
				"B",
				"C",
				"D",
				"E",
				"F",
				"G",
				"H",
				"I",
				"J",
				"K",
				"L",
				"M",
				"N",
				"O",
				"P",
				"Q",
				"R",
				"S",
				"T",
				"U",
				"V",
				"W",
				"X",
				"Y",
				"Z"
			);
			//循环组成验证码的字符串
			for (var i = 0; i < codeLength; i++) {
				//获取随机验证码下标
				var charNum = Math.floor(Math.random() * 62);
				this.code[abcd[i]].val = codeChars[charNum];
				this.code[abcd[i]].deg = this.randint(-30, 30);
				//组合成指定字符验证码
				// code += codeChars[charNum];
			}
			// if (this.code)
			// {
			//为验证码区域添加样式名
			// checkCode.className = "code";
			//将生成验证码赋值到显示区
			// this.code = code;
			// }
		},
		randint(n, m) {
			var c = m - n + 1;
			var num = Math.random() * c + n;
			return Math.floor(num);
		},
		loginOut() {
			if (sessionStorage.getItem("store")) {
				sessionStorage.removeItem("store");
				this.$store.commit("del_token", 1);
			}
		},
	},
};
</script>

<style lang="less">
#login {
	width: 100%;
	height: 100%;
	min-width: 800px;
	> #login-conter {
		width: 800px;
		height: 500px;
		margin-left: calc((100% - 800px) / 2);
		position: absolute;
		top: 50%;
		margin-top: -250px;
		background: #fff;
		float: left;
		#checkCode {
			.codeSpan {
				display: inline-block;
			}
			width: 122px;
			box-sizing: border-box;
			height: 40px;
			margin-top: 16px;
			float: right;
			font-style: italic;
			color: #226384;
			font-size: 26px;
			padding: 2px 3px;
			letter-spacing: 3px;
			font-weight: bold;
			cursor: pointer;
			line-height: 40px;
			text-align: center;
			vertical-align: middle;
			background-color: #ecf6fe;
		}
		p {
			font-family: PingFangSC-Semibold;
			text-align: center;
			font-size: 28px;
			color: #333333;
			background-image: -webkit-linear-gradient(bottom, #999999, #333333);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			font-weight: bold;
			&:first-child {
				font-family: PingFangSC-Medium;
				font-size: 14px;
				margin-bottom: 4px;
				background-image: -webkit-linear-gradient(
					bottom,
					#333333,
					#333333
				);
			}
		}
		> img {
			display: block;
			float: left;
		}
		> div {
			float: left;
			padding: 60px 100px;
			width: 500px;
			height: 100%;
			box-sizing: border-box;
		}
	}
	#login-footer {
		position: fixed;
		bottom: 20px;
		width: 100%;
		text-align: center;
		> p {
			font-size: 14px;
			color: #3f4656;
			letter-spacing: 0;
			line-height: 30px;
			transition: 0.3s all;
		}
	}
}
</style>
