<template>
	<div class="login">
		<div class="loginBox">
			<img class="logo" src="../../assets/image/login_icon_logo.png" alt="logo">
			<div style="margin-top:2rem">
				<div class="box">
					<van-field v-model="ruleForm.username" name="用户名" placeholder="请输入用户名" />
					<van-field v-model="ruleForm.password" :type="passwordShow?'password':''" name="密码" :rightIcon="passwordShow?'closed-eye':'eye-o'"
					 @click-right-icon="onClickIcon" placeholder="请输入密码" />
				</div>
				<div class="loginButton" @click="onSubmit">
					<van-button round block :disabled="ruleForm.username.length==0 && ruleForm.password.length==0" type="info"
					 native-type="submit">
						登录
					</van-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				identifyCode: "4321",
				ruleForm: {
					username: '',
					password: '',
					code: ''
				},
				disabled: true,
				passwordShow: true
			};
		},
		mounted() {
			this.$store.commit('updateTime');
		},
		methods: {
			refreshCode() {
				this.identifyCode = 1234
			},
			CalcuMD5(pwd) {
				pwd = md5(pwd);
				pwd = pwd.toUpperCase();
				return pwd;
			},
			onSubmit() {
				if (this.ruleForm.username == "") {
					this.$toast('请输入用户名');
					return false;
				}
				if (this.ruleForm.password == "") {
					this.$toast('请输入密码');
					return false;
				}
				let api = this.$Api.manage_login;
				this.$Ax.post(api, {
					username: this.ruleForm.username,
					password: this.CalcuMD5(this.ruleForm.password),
					timestamp: this.$store.state.axiosTime,
				}).then((res) => {
					if (res.success) {
						this.$cookies.set('token', res.data.token);
						this.$cookies.set('username', res.data.username);
						this.$router.push("/sampling");
					} else {
						this.$toast.fail(res.message);
					}
				}).catch((res) => {});
			},
			onClickIcon() {
				this.passwordShow = !this.passwordShow;
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
		height: 100%;
		background: #F7F9FC;

		.loginBox {
			position: absolute;
			width: 86%;
			top: 50%;
			left: 50%;
			margin-left: -43%;
			margin-top: -280px;
			text-align: center;

			.logo {
				margin-bottom: 20px;
				width: 60%;
			}

			.box {
				background: #FFFFFF;
				box-shadow: 0 12px 24px 0 rgba(57, 104, 176, 0.08);
				border-radius: 24px;
				width: 80%;
				padding: 20px 50px;
				margin: 0 auto;

				.van-cell {
					line-height: 3rem;
					font-size: 1.5rem;
				}

				.van-icon {
					font-size: 1.5rem;
				}

				.code {
					height: 40px;
					float: right;

					.codeBox {
						float: left;
					}
				}

			}

			.loginButton {
				width:92%;
                margin:2rem auto;
				.van-button {
					height: 4rem;
					font-size: 1.5rem;
					line-height: 4rem;
				}
			}

		}


	}
</style>
