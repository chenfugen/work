<template>
	<div class="login_bg">
		<div class="login_box">
			<img src="../../../static/image/kainenglogo@2x.png" class="logo" />
			<!--<van-tabs @click="tab">
				<van-tab title="快捷登录">
					
				</van-tab>
				<van-tab title="密码登录">
					<div class="login_tab">
						<p class="login_title">手机号</p>
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
				<!--<p class="login_title">手机号</p>-->
				<van-cell-group>
					<van-field clearable placeholder="请输入手机号" type="phone" @blur="clearScroll" v-model="user.phone" />
				</van-cell-group>
			</div>
			<p class="formInput"></p>
			<div class="login_tab">
				<!--<p class="login_title">验证码</p>-->
				<van-cell-group>
					<van-field placeholder="请输入验证码" v-model="user.code" @input="inputCode" @blur="clearScroll" clearable>
						<van-button round slot="button" size="small" v-show="codeShow" @click="getCode"><span style="color:#FFBF00;">{{codeTxt}}</span></van-button>
						<van-button round slot="button" size="small" v-show="!codeShow"><span class="count">{{count}} 秒</span></van-button>
					</van-field>
				</van-cell-group>
			</div>
			<p class="formInput"></p>
			<div class="login_button">
				<van-button round size="large" @click="login">登录</van-button>
			</div>
			<p class="login_hint">点击登录，即代表您同意
				<a href="#/userAgreement">《开能用户协议》</a>
			</p>
		</div>
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
					accessKey: this.user.accessKey
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
			inputCode(){			
				if(this.user.code.length>4) {
					this.user.code=this.user.code.slice(0,4)
				}
			},
			showPassword() {
				this.showPass = !this.showPass;
			},
			clearScroll() {
				window.scroll(0, 0);
				window.scrollTo(0, document.documentElement.clientHeight);
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
					}).then((res) => {
						if(res.data.success) {
							this.$cookies.set('Authorization', res.data.data.Authorization);
							this.$cookies.set('userId',res.data.data.userId);
							this.$Ax.get("wechat/user/register/checkWxOpenId?accessKey=" + this.$store.state.accessKey + "&openId=" + this.openid).then((res) => {
								this.$cookies.set('Authorization', res.data.data.Authorization);
								this.$cookies.set('userId', res.data.data.userId);
								this.$cookies.set('isShare', false);
								if(!res.data.data.userInfo){
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
							this.$cookies.set('Authorization', res.data.data.Authorization)
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
	@import "../../../static/css/login.scss";
	.van-hairline--bottom::after {
		border-bottom-width: 0px;
	}
	
	.login_bg {
		.van-nav-bar__title {
			color: white;
			font-size: 0.15rem;
		}
	}
</style>