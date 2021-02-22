<template>
	<div class="userCenter">
		<Modal
			v-model="dialog"
			title="修改密码"
			@on-ok="handleSubmit()"
			:loading="dialogLoading"
		>
			<!-- 普通编辑 -->
			<!-- 普通编辑 -->
			<Form ref="formPwd" :model="form" :rules="rule" :label-width="120">
				<FormItem prop="password" label="新密码：">
					<Input
						type="password"
						v-model="form.password"
						class="Input"
					>
					</Input>
				</FormItem>
				<FormItem prop="rePassword" label="重复输入：">
					<Input
						type="password"
						v-model="form.rePassword"
						class="Input"
					>
					</Input>
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>

<script>
var md5 = require("js-md5");
export default {
	name: "userCenter",
	data() {
		// 再次输入密码表单验证
		const validateRepwd = (rule, value, callback) => {
			if (value != this.form.password) {
				callback(new Error("两次密码输入不同，请检查输入"));
			} else {
				callback();
			}
		};
		return {
			dialogLoading: true,
			dialog: false,
			edit: false,
			editPwd: false,
			form: {
				password: "",
				rePassword: "",
			},
			rule: {
				rePassword: [
					{
						// 再次输入密码表单验证
						required: true,
						message: "请再次输入密码",
						trigger: "blur",
					},
					{
						validator: validateRepwd,
						trigger: "blur",
					},
				],
				password: {
					required: true,
					message: "请输入密码",
					trigger: "blur",
				},
			},
		};
	},
	methods: {
		handleShow(flag) {
			this.dialog = flag;
			this.handleResetFields();
		},
		handleSubmit() {
			this.$refs["formPwd"].validate((valid) => {
				if (valid) {
					let api = this.$api.manage_userAccount_update_info,
						para = Object.assign({}, this.form);
					para.password = md5(para.password).toLocaleUpperCase();
					this.$Ax
						.post(api, para)
						.then((res) => {
							if (res.success) {
								this.$Message.success("修改成功,请重新登录");
								let para={
									loginUrl:sessionStorage.getItem("loginUrl"),
								}
								this.$store.dispatch("handleLogout",para);
							}
							this.handleShow(false);
						})
						.catch((err) => {
							// eslint-disable-next-line
							console.log(err);
						});
					setTimeout(() => {
						this.changeLoading();
					}, 1000);
				} else {
					return this.changeLoading();
				}
			});
		},
		changeLoading() {
			// 修改表单loading状态
			this.dialogLoading = false;
			this.$nextTick(() => {
				this.dialogLoading = true;
			});
		},
		handleResetFields() {
			this.$refs.formPwd.resetFields();
		},
	},
};
</script>

<style lang="css" scoped>
.Input {
	width: 250px;
}
</style>
