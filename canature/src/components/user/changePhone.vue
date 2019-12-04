<template>
	<div>
		<van-cell-group style="margin-top:0.1rem;">
			<van-field v-model="phone" label="手机号" placeholder="请输入新手机号" />
			<van-field v-model="sms" center clearable label="短信验证码" placeholder="请输入短信验证码" @input="onblur" @focus="onfocus">
				<van-button class="button" round slot="button" size="small" v-show="codeShow" @click="getCode"><span>{{codeTxt}}</span></van-button>
				<van-button class="button" round slot="button" size="small" v-show="!codeShow"><span class="count">{{count}} 秒</span></van-button>
			</van-field>
		</van-cell-group>
		<div class="save" v-bind:class="{ active: isActive }">
			<van-button round @click="save">确认更换</van-button>
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
				isActive: false,
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
			onfocus() {
				if(this.sms == "") {
					this.isActive = false;
				}
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

<style>
	.save {
		padding: 10px 15px;
		text-align: center;
	}
	
	.save button {
		color: white;
		background: #BCD7FF;
		width: 100%;
		margin-top: 0.1rem;
		vertical-align: top;
	}
	
	.button {
		color: white;
		border: none;
		background: #BCD7FF;
	}
	
	.active button {
		background: #1E9FFF;
	}
	
	.code {
		color: white;
		background: #1E9FFF;
	}
</style>