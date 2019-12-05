<template>
	<div class="login_box">
		<div class="login_tab">
			<div class="leftPhone"></div>
			<van-cell-group>
				<van-field left-icon="../../../static/image/logo.png" clearable placeholder="请输入手机号" type="phone" @focus="inputPhone" @blur="clearScroll" v-model="phone" />
			</van-cell-group>
		</div>
		<p class="formInput"></p>
		<div class="login_tab">
			<div class="leftPassword"></div>
			<van-cell-group>
				<van-field left-icon="../../../static/image/logo.png" placeholder="请输入验证码" @focus="inputCode" v-model="sms" @blur="clearScroll" clearable>
					<van-button slot="button" type="info" size="small" v-show="codeShow" @click="getCode" :disabled="isGetcode"><span style="color:#fff;">{{codeTxt}}</span></van-button>
					<van-button slot="button" type="info" size="small" v-show="!codeShow"><span class="count">{{count}} 秒</span></van-button>
				</van-field>
			</van-cell-group>
		</div>
		<p class="formInput"></p>
		<div class="save">
			<van-button @click="save" :disabled="isChange">确认更换</van-button>
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
				phone: "",
				sms: "",
				isChange: true,
				isGetcode: true,
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			onblur() {
				if(this.sms != "") {
					this.isActive = true;
				}
			},
			inputPhone() {
				this.isGetcode = false;
			},
			inputCode() {
				this.isChange = false;
			},
			clearScroll() {
				window.scroll(0, 0);
				window.scrollTo(0, document.documentElement.clientHeight);
			},
			getCode() {
				this.phone = this.phone.replace(/\s*/g, "");
				if(this.phone == "" || this.phone == "undefind") {
					this.$toast('请输入手机号码');
					return false;
				}
				if(!(/^1[345789]\d{9}$/.test(this.phone)) || this.phone.length != 11) {
					this.$toast('请填写正确的号码');
					return false;
				}
				const TIME_COUNT = 60;
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
					phone: this.phone,
					accessKey: this.$store.state.accessKey
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
			save() {
				this.phone = this.phone.replace(/\s*/g, "");
				this.sms = this.sms.replace(/\s*/g, "");
				if(this.phone == "" || this.phone == "undefind") {
					this.$toast('请输入手机号码');
					return false;
				}
				if(!(/^1[345789]\d{9}$/.test(this.phone)) || this.phone.length != 11) {
					this.$toast('请填写正确的号码');
					return false;
				}
				if(this.sms == "" || this.sms == "undefind") {
					this.$toast('请输入验证码');
					return false;
				}
				this.$Axios.post('wechat/user/updatePhone', {
					phone: this.phone,
					code: this.sms
				}).then((res) => {
					if(res.data.success) {
						this.$router.push({
							'path': '/'
						});
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss">
	.login_box {
		background: white;
		height: 100%;
		.van-hairline--top-bottom::after {
			border-width: 0px 0px;
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
		.save button {
			margin: 0.2rem 0.15rem;
			width: 92%;
			background: #005EB8;
			border: 0px;
			color: white;
			display: block;
		}
		.button {
			display: block;
			color: white;
			border: none;
			background: #005EB8;
		}
	}
</style>