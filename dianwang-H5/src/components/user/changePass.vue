<template>
	<div class="changePass">
		<Header title="修改密码" to="/my"></Header>
		<van-field v-model="oldPassword" class="field" type="password" placeholder="原密码" label="原密码" />
		<van-cell-group>
			<van-field v-model="newPassword" type="password" placeholder="新密码" label="新密码" />
			<van-field v-model="password" type="password" placeholder="确认新密码" label="确认新密码" @input="changeValue" />
		</van-cell-group>
		<div class="confirm">
			<van-button size="large" class="change" :disabled="isChange" block @click="change">修改</van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				oldPassword: "",
				newPassword: "",
				password: "",
				isChange: true
			};
		},
		components: {
			Header
		},
		methods: {
			CalcuMD5(pwd) {
				pwd = md5(pwd);
				pwd = pwd.toUpperCase();
				return pwd;
			},
			change() {
				if (this.oldPassword == "") {
					this.$toast("请输入原密码");
					return false;
				}
				if (this.newPassword.length<6) {
					this.$toast("请输入长度不低于6位的新密码");
					return false;
				}
				if (this.password == "") {
					this.$toast("请再次输入新密码");
					return false;
				}
				if (this.newPassword != this.password) {
					this.$toast("新密码两次输入不同");
					this.password="";
					return false;
				}
				this.$Axios.post('/manage/account/update/password', {
					"oldPassword": this.CalcuMD5(this.oldPassword),
					"newPassword": this.CalcuMD5(this.newPassword)
				}).then((res) => {
					if (res.success) {
						this.$toast("修改成功");
						this.$router.push("/");
					}else{
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			changeValue() {
				this.isChange = this.password.length > 0 ? false : true;
			}
		}
	}
</script>

<style lang="scss">
	.changePass {
		.field {
			margin: 0.1rem 0;
		}

		.confirm {
			margin: 0.2rem 0.12rem;
			position: relative;
			border-radius: 0.08rem 0.08rem;
			overflow: hidden;

			.change {
				background: #229794;
				color: white;
			}
		}
	}
</style>
