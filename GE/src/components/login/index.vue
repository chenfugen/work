<template>
	<div class="login_bg">
		<div class="login_box">
			<img src="../../../static/image/logo.png" class="logo" />
			<p class="login_title">快捷登录</p>
			<!--<van-tabs @click="tab">
				<van-tab title="快捷登录">

				</van-tab>
				<van-tab title="密码登录">
					<div class="login_tab">
						<van-cell-group>
							<van-field clearable type="phone" placeholder="请输入手机号" @blur="clearScroll" clearable v-model="user.phone" />
						</van-cell-group>
					</div>
					<p class="formInput"></p>
					<div class="login_tab" v-if="showPass">
						<p class="login_title">密码</p>
						<van-field placeholder="请输入密码" type="password" clearable @blur="clearScroll" v-model="user.password" right-icon="closed-eye" @click-right-icon="showPassword" />
					</div>
					<div class="login_tab" v-if="!showPass">
						<p class="login_title">密码</p>
						<van-field placeholder="请输入密码" type="text" clearable @blur="clearScroll" v-model="user.password" right-icon="eye-o" @click-right-icon="showPassword" />
					</div>
					<p class="formInput"></p>
					<van-button round size="large" class="login_button" @click="login">登录</van-button>
					<p class="login_hint">点击登录，即代表您同意
						<a href="javascrip:;">《开能用户协议》</a>
					</p>
				</van-tab>
			</van-tabs>-->
			<div class="login_tab">
				<div class="leftPhone"></div>
				<van-cell-group>
					<van-field left-icon="../../../static/image/icon_add@2x.png" clearable placeholder="请输入手机号" @focus="inputPhone" @blur="clearScroll" v-model="user.phone" />
				</van-cell-group>
			</div>
			<p class="formInput"></p>
			<div class="login_tab">
				<div class="leftPassword"></div>
				<van-cell-group>
					<van-field left-icon="../../../static/image/icon_add@2x.png" placeholder="请输入验证码" @focus="clickCode" v-model="user.code" @input="inputCode"  @blur="clearScroll" clearable>
						<van-button slot="button" type="info" size="small" v-show="codeShow" @click="getCode" :disabled="isGetcode"><span style="color:#fff;">{{codeTxt}}</span></van-button>
						<van-button slot="button" type="info" size="small" v-show="!codeShow"><span class="count">{{count}} 秒</span></van-button>
					</van-field>
				</van-cell-group>
			</div>
			<p class="formInput"></p>
			<div class="login_button">
				<van-button size="large" @click="login" :disabled="isLogin">登录</van-button>
			</div>
		</div>
		<p class="login_hint">点击登录，即代表您同意
			<a href="#/userAgreement">《用户协议》</a>
		</p>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				codeTxt: "获取验证码",
				codeShow: true,
				count: "", //倒计时
				timer: null, //倒计时
				showPass: true, //密码
				tabName: "快捷登录", //登录方式
				isLogin: true,
				isGetcode: true,
				user: {
					phone: "",
					code: "",
					password: "",
					accessKey: this.$store.state.accessKey,
				},
				IP: this.$store.state.IP,
				openid: "",
			}
		},
		mounted() {
			this.openid = this.$cookies.get("openId");
		},
		methods: {
			tab(index, title) {
				this.tabName = title;
			},
			getCode() {
				this.user.phone = this.user.phone.replace(/\s*/g, "");
				if(this.user.phone == "") {
					this.$toast("请填写手机号码");
					return false;
				}
				if(!(/^1[345789]\d{9}$/.test(this.user.phone)) || this.user.phone.length != 11) {
					this.$toast('请填写正确的号码');
					return false;
				}
				const TIME_COUNT = 90;
				if(!this.timer) {
					this.count = TIME_COUNT;
					this.codeShow = false;
					this.timer = setInterval(() => {
						if(this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.codeShow = true;
							this.codeTxt = "重新发送",
								clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
				}
				this.$Axios.post('wechat/user/register/send/code', {
					phone: this.user.phone,
					accessKey: this.user.accessKey,
					customerId: "GE"
				}).then((res) => {
					if(res.data.success) {
						this.$toast("验证码发送成功");
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			inputCode() {
				if(this.user.code.length > 4) {
					this.user.code = this.user.code.slice(0, 4)
				}
			},
			showPassword() {
				this.showPass = !this.showPass;
			},
			clearScroll() {
				window.scroll(0, 0);
				window.scrollTo(0, document.documentElement.clientHeight);
			},
			inputPhone() {
				this.isGetcode = false;
			},
			clickCode() {
				this.isLogin = false;
			},
			login() {
				this.user.phone = this.user.phone.replace(/\s*/g, "");
				this.user.code = this.user.code.replace(/\s*/g, "");
				if(this.user.phone == "") {
					this.$toast("请填写手机号码");
					return false;
				}
				if(!(/^1[345789]\d{9}$/.test(this.user.phone)) || this.user.phone.length != 11) {
					this.$toast('请填写正确的号码');
					return false;
				}
				if(this.tabName == "快捷登录") {
					if(this.user.code == "") {
						this.$toast("请填写手机验证码");
						return false;
					}
					this.$Axios.post('/wechat/user/checkCode/login', {
						phone: this.user.phone,
						accessKey: this.user.accessKey,
						code: this.user.code,
						openId: this.openid,
						customerId: "GE"
					}).then((res) => {
						if(res.data.success) {
							this.$cookies.set('Authorization', res.data.data.Authorization);
							this.$cookies.set('userId', res.data.data.userId);
							this.$Ax.get("wechat/user/register/checkWxOpenId?accessKey=" + this.$store.state.accessKey + "&openId=" + this.openid+"&customerId=GE").then((res) => {
								this.$cookies.set('Authorization', res.data.data.Authorization);
								this.$cookies.set('isShare',false);
								if(!res.data.data.userInfo) {
									this.$router.push("/addUser");
								} else {
									this.$router.push("/device");
								}
							})
						} else {
							this.$toast(res.data.message);
						}
					})
				} else {
					if(this.user.password == "") {
						this.$toast("请填写登录密码");
						return false;
					}
					this.$Axios.post('/wechat/user/login', {
						phone: this.user.phone,
						password: this.user.password,
						accessKey: this.user.accessKey,
					}).then((res) => {
						if(res.data.success) {
							this.$cookies.set('Authorization', res.data.data.Authorization);
							this.$cookies.set('userId', res.data.data.userId);
							this.$router.push("/addUser");
						} else {
							this.$toast(res.data.message);
						}
					}).catch((res) => {
						this.$toast(res.message);
					});
				}
			}
		}
	}
</script>
<style lang="scss">
	.login_bg {
		background: white;
		.login_box {
			margin: 1rem 0.1rem 0px 0.1rem;
			height: auto;
			padding: 0.4rem 0.1rem;
			position: relative;
			.logo {
				width: 0.8rem;
				height: 0.8rem;
				border-radius: 0.4rem 0.4rem;
				overflow: hidden;
				position: absolute;
				top: -0.4rem;
				left: 50%;
				z-index: 999;
				margin-left: -0.4rem;
			}
			.login_title {
				color: #333;
				padding: 0.1rem 0.1rem;
				font-size: 0.20rem;
				color: #666;
				text-align: left;
			}
			.van-hairline--top-bottom::after {
				border-width: 0px 0px;
			}
			.van-tabs__line {
				background: #267cfb;
			}
			.login_tab {
				padding: 0.1rem 0px;
				position: relative;
				.van-cell {
					padding: 5px 15px;
				}
				.van-field__left-icon {
					margin-right: 25px;
				}
				.leftPhone {
					position: absolute;
					left: 0.1rem;
					top: 0.16rem;
					width: 0.2rem;
					height: 0.2rem;
					background: url(../../../static/image/icon_phone.png);
					background-size: 100% 100%;
					z-index: 99;
				}
				.leftPassword {
					position: absolute;
					left: 0.1rem;
					top: 0.16rem;
					width: 0.2rem;
					height: 0.2rem;
					background: url(../../../static/image/icon_password.png);
					background-size: 100% 100%;
					z-index: 99;
				}
			}
			.van-button--info {
				color: #fff;
				background-color: #005EB8;
				border: 1px solid #005EB8;
			}
			.formInput {
				margin: 0px 15px;
				width: 92%;
				height: 1px;
				background: #e9f3ff;
			}
			.login_button button {
				margin: 0.2rem 0.15rem;
				width: 92%;
				background: #005EB8;
				border: 0px;
				color: white;
				display: block;
			}
		}
		.login_hint {
			position: absolute;
			width: 100%;
			bottom: 0.2rem;
			text-align: center;
			color: #8f8f8f;
			font-size: 0.12rem;
			a {
				color: #005EB8;
			}
		}
	}
</style>
