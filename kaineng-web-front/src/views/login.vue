<template>
	<div v-bind:class="[partnerId ? 'partner' : '', 'login']">
		<!-- <Card class="company-card left">
	</Card> -->
		<Card class="login-card left">
			<div class="login-header">
				<img :src="logoImg" alt="logo">
			</div>
			<div class="login_title">IoT 系统管理平台</div>
			<Form ref="loginForm" :model="loginForm" :rules="rule" class="login-form">
				<FormItem prop="userName">
					<Icon type="ios-person-outline" class="icon"></Icon>
					<Input type="text" @on-enter='handleFocus("un")' v-model="loginForm.userName" id='unInput' class="loginInput"
					 placeholder="用户名"></Input>
				</FormItem>
				<FormItem prop="password">
					<Icon type="ios-lock-outline" class="icon"></Icon>
					<Input type="password" @on-enter='handleFocus("pw")' v-model="loginForm.password" id='pwdInput' class="loginInput"
					 placeholder="密码"></Input>
				</FormItem>
				<FormItem prop="code">
					<Icon type="ios-key-outline" class="icon"></Icon>
					<Input type="text" @on-enter='handleFocus("va")' v-model="loginForm.code" id='vaInput' class="loginInput code"
					 placeholder="验证码（不区分大小写）"></Input>
					<Tooltip content="点击刷新验证码" placement="right">
						<canvas @click='getValidateCode' id='validateBox'></canvas>
					</Tooltip>
				</FormItem>
				<div class="btnBox clearfloat">
					<Button type="primary" long @click="handleLogin()">登录</Button>
					<!-- 		<Button class="left" type="text" @click="handleReset()">重置</Button> -->
				</div>
			</Form>
			<p class="versions">versions1.0</p>
		</Card>
	</div>
</template>
<script>
	var md5 = require('js-md5');
	import apiConfig from '@/apiConfig'
	export default {
		name: 'login',
		data() {
			return {
				partnerId: null,
				img: '',
				logoImg: require('../assets/defaultLogo.jpg'),
				imgUrl: apiConfig.baseURL + this.$api.common_getFile,
				validateLoading: false,
				timer: null,
				loginForm: {
					userName: '',
					password: '',
					code: '',
					codeId: '',
				},
				rule: {
					userName: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}],
					validate: [{
						required: true,
						message: '验证码不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {				
			sessionStorage.clear()
			if ((window.location.href).split("#")[0].split('//')[1].split('/')[1]) {
				let alias = (window.location.href).split("#")[0].split('//')[1].split('/')[1];
				sessionStorage.setItem("loginUrl",(window.location.href).split("#")[0])
				this.changeLogo(alias)
			} else {
				this.logoImg = require('../assets/logo.png');
			}
			if(this.$route.query.partnerId){
				this.partnerId =this.$BASE.Decrypt(this.$route.query.partnerId) 
				sessionStorage.setItem("loginUrl",window.location.href)
				this.getLogo();
			}
			this.$store.dispatch('getValidateCode')
		},
		computed: {
			code() {
				return this.$store.state.login.code
			},
		},
		watch: {
			code(val) {
				this.handleCreated(val)
			}
		},
		methods: {
			//更换图片
			changeLogo(alias) {
				let api = this.$api.manage_businessPartner_getPartnerId
				this.$Ax.get(api, {
					params: {
						alias: alias,
						commonKey: apiConfig.commonKey,
					}
				}).then(res => {
					if (res.success) {
						this.partnerId = res.data.partnerId
						this.getLogo();
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			getLogo() {
				let api = this.$api.manage_getLogoImage
				this.$Ax.get(api, {
					params: {
						commonKey: apiConfig.commonKey,
						partnerId: this.partnerId
					}
				}).then(res => {
					if (res.success) {
						if (res.data.webLogoImage) {
							this.logoImg = this.imgUrl + res.data.webLogoImage + '?commonKey=' + apiConfig.commonKey;
							sessionStorage.setItem("webLogoImage", this.logoImg)
						    document.title = res.data.logoName+"IoT系统管理平台"
						}
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			// 获取验证码
			getValidateCode() {
				this.$store.dispatch('getValidateCode')
			},
			// 调用验证码生成
			handleCreated(code) {
				let options = {
					canvasId: "validateBox",
					txt: code,
					height: 30,
					width: 140
				}
				this.writeAuthCode(options);
			},
			// 生成验证码
			writeAuthCode(options) {
				var canvas = document.getElementById(options.canvasId);
				canvas.width = options.width || 300
				canvas.height = options.height || 150
				let ctx = canvas.getContext('2d'); /**创建一个canvas对象*/
				ctx.textBaseline = "middle";
				ctx.fillStyle = this.randomColor(180, 255); /**这个范围的颜色作背景看起来清晰一些*/
				ctx.fillRect(0, 0, options.width, options.height);
				for (let i = 0; i < options.txt.length; i++) {
					let txt = options.txt.charAt(i); /**让每个字不一样*/
					ctx.font = '20px SimHei';
					ctx.fillStyle = this.randomColor(50, 160); /**随机生成字体颜色*/
					ctx.shadowOffsetY = this.randomNum(-3, 3);
					ctx.shadowBlur = this.randomNum(-3, 3);
					ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
					let x = options.width / (options.txt.length + 1) * (i + 1);
					let y = options.height / 2;
					let deg = this.randomNum(-30, 30);
					/**设置旋转角度和坐标原点*/
					ctx.translate(x, y);
					ctx.rotate(deg * Math.PI / 180);
					ctx.fillText(txt, 0, 0);
					/**恢复旋转角度和坐标原点*/
					ctx.rotate(-deg * Math.PI / 180);
					ctx.translate(-x, -y);
				}
				/**1~4条随机干扰线随机出现*/
				for (let i = 0; i < this.randomNum(1, 4); i++) {
					ctx.strokeStyle = this.randomColor(40, 180);
					ctx.beginPath();
					ctx.moveTo(this.randomNum(0, options.width), this.randomNum(0, options.height));
					ctx.lineTo(this.randomNum(0, options.width), this.randomNum(0, options.height));
					ctx.stroke();
				}
				/**绘制干扰点*/
				for (let i = 0; i < options.width / 6; i++) {
					ctx.fillStyle = this.randomColor(0, 255);
					ctx.beginPath();
					ctx.arc(this.randomNum(0, options.width), this.randomNum(0, options.height), 1, 0, 2 * Math.PI);
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
				let userInput = document.getElementById('unInput'),
					pwdInput = document.getElementById('pwdInput'),
					vaInput = document.getElementById('vaInput')
				this.$refs['loginForm'].validate((valid) => {
					if (valid) {
						let para = Object.assign({}, this.loginForm)
						para.password = md5(para.password).toLocaleUpperCase()
						para.codeId = this.$store.state.login.codeId
						para.partnerId = this.partnerId
						this.$store.dispatch('handleLogin', para)
					} else {
						if (this.loginForm.userName == '') {
							this.timer = setTimeout(function() {
								userInput.children[2].focus()
								userInput.children[2].select()
							}, 100)
						} else if (this.loginForm.password == '') {
							this.timer = setTimeout(function() {
								pwdInput.children[2].focus()
								pwdInput.children[2].select()
							})
						} else if (this.loginForm.code == '') {
							this.timer = setTimeout(function() {
								vaInput.children[2].focus()
								vaInput.children[2].select()
							})
						}
					}
				})
			},
			// 控制焦点
			handleFocus(count) {
				let pwdInput = document.getElementById('pwdInput'),
					vaInput = document.getElementById('vaInput')
				if (count == 'un') {
					this.timer = setTimeout(function() {
						pwdInput.children[2].focus()
						// pwdInput.children[1].select()
					}, 100)
				} else if (count == 'pw') {
					this.timer = setTimeout(function() {
						vaInput.children[2].focus()
						// vaInput.children[1].select()
					}, 100)
				} else {
					this.handleLogin()
				}
			},
			// 重置表单
			handleReset() {
				this.$refs.loginForm.resetFields()
			}
		}
	}
</script>
<style lang="less" scope>
	.login {
		height: 100%;
	
		background:url(../assets/IotBg.jpg) no-repeat;
		background-size: 100% 100%;
		position: relative;

		.login-card {
			position: absolute;
			width: 500px;
			height: 500px;
			left: 50%;
			margin-left: -250px;
			top: 20%;
			border-radius: 4px 4px;
			box-shadow: 0 0 10px rgba(250, 250, 250, 0.4)
		}

		.versions {
			margin-top: 42px;
			text-align: center;
			color: #ffffff;
		}

		.icon {
			float: left;
			line-height: 30px;
			font-size: 15px;
		}

		.loginInput {
			float: left;
			width: 95%;
		}

		.code {
			width: 50%;
		}

		.ivu-form-item {
			border-bottom: 1px solid #dcdee2;
			margin-bottom: 50px;
		}

		.ivu-input {
			border: none;
			outline: none;
			border-radius: 0px;
			line-height: 40px;
		}

		.ivu-form-item-error-tip {
			margin-top: 40px;
			line-height: 20px;
			z-index: 0;
		}

		.login-header {
			width: 100px;
			height: 60px;
			margin: 0 auto;
			text-align: center;
			overflow: hidden;

			img {
				width: 100%;
			}
		}

		.login-form {
			width: 70%;
			margin: 0 auto;
		}

		.btnBox {
			width: 100%;
			margin: 0 auto;
			margin-top: 10px;

			.ivu-btn {
				line-height: 30px;
			}
		}

		.ivu-tooltip {
			float: right;
		}


		.img {
			width: 100px;
			height: 100px;
		}

		.login_title {
			text-align: center;
			line-height: 40px;
			font-size: 20px;
			color: #000000;
			margin-bottom: 20px;
		}
	}

.partner{
		background: #192233;
	}
  
	.company-card {
		width: 700px;
		height: 500px;
		background-color: gray;
		background-image: url(../assets/loginBg.png);
		background-size: 100% 100%;
	}
</style>
