<template>
	<div class="login">
		<img src="../../../static/images/login_logo.png" class="logo" />
		<div class="from">
			<van-field left-icon="../../../static/images/account.png" type="text" clearable v-model="user.userName" placeholder="请输入用户名" />
			<p class="formInput"></p>
			<van-field left-icon="../../../static/images/password.png" type="password" clearable v-model="user.password"
			 placeholder="请输入密码" />
			<p class="formInput"></p>
			<van-field v-model="user.code" @focus="clickCode" left-icon="../../../static/images/code.png" center clearable
			 placeholder="请输入验证码">
				<van-button slot="button" class="code" @click="refreshCode">
					<Sidentify :identifyCode="identifyCode" class="codeBox"></Sidentify>
				</van-button>
			</van-field>
			<p class="formInput"></p>
			<div class="login_button">
				<van-button size="large" @click="login" :disabled="isLogin" class="loginButton">登录</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import Sidentify from "../code/identify.vue"
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				user: {
					userName: "",
					password: "",
					code: "",
					codeId: "",
					accessKey: this.$store.state.accessKey,
				},
				identifyCode: "",
				isLogin: true
			};
		},
		components: {
			Sidentify
		},
		mounted() {
			
			this.getCode();
		},
		methods: {
			getCode() {
				this.$Ax.get('/common/getCheckCode',{
					params:{
						accessKey:this.$store.state.accessKey,
					}
				}).then((res) => {
					this.identifyCode = res.data.code;
					this.user.codeId = res.data.codeId;
				}).catch((err) => {
					console.log(err);
				})
			},
			clickCode() {
				this.isLogin = false;
			},
			refreshCode() {
				this.getCode();
			},
			CalcuMD5 (pwd) {
				 pwd = md5(pwd);
				pwd=pwd.toUpperCase();
				return pwd;
			},
			login() {
				if (this.user.userName == "") {
					this.$toast("请输入用户名");
					return false;
				}
				if (this.user.password == "") {
					this.$toast("请输入密码");
					return false;
				}
				if (this.user.code == "") {
					this.$toast("请输入验证码");
					return false;
				}
				this.$Ax.post('/wechat/account/login',{
					userName: this.user.userName,
					password: this.CalcuMD5(this.user.password),
					code: this.user.code,
					codeId:this.user.codeId,
					accessKey:this.user.accessKey,
				}).then((res) => {
					if (res.success) {
						this.$cookies.set('token', res.data.token);
						this.$cookies.set('type', res.data.type);
						this.$cookies.set('verifyStatus', res.data.verifyStatus);
						if (res.data.type == 1) {
							this.$router.push("/admin");
						} else {
							this.$router.push("/person");
						}
					} else {
						this.$toast(res.message);
						if(res.message=="密码错误"){
							this.user.password="";
						}						
						this.user.code="";
						this.getCode();			
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			}
		}
	}
</script>

<style lang="scss">
	.login {
		background: white;

		.logo {
			display: block;
			width: 60%;
			margin: 0.4rem auto 0.2rem auto;
		}

		.from {
			width: 80%;
			margin: 0.4rem auto;

			.formInput {
				margin: 10px 15px;
				width: 92%;
				background: #e9f3ff;
			}

			.code {
				border: none;
				padding: 0px;
				float: right;

				.codeBox {
					float: left;
				}
			}

			.login_button {
				margin: 0.15rem auto;
				position: relative;

				.loginButton {
					background: #229794;
					color: white;
					border-radius: 0.05rem;
					position: absolute;
					top: 0px;
				}
			}
		}
	}
</style>
