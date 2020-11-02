<template>
<div id="edit-password">
	<Modal v-model="visible" :title="title" :loading='formLoading' @on-ok="submit" @on-cancel="cancel" style="position:relative">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="80">
			<FormItem prop='oldPassword' label='旧密码' class="input marginRight">
				<Input v-model="form.oldPassword" type='password' placeholder="请输入旧密码" class="input " />
			</FormItem>
			<FormItem prop='password' label='新密码' class="input marginRight">
				<Input v-model="form.password" type='password' placeholder="请输入新密码" class="input" />
			</FormItem>
			<FormItem prop='rePassword' label='重复密码' class="input marginRight">
				<Input v-model="form.rePassword" type='password' placeholder="请再次输入新密码" class="input" />
			</FormItem>
		</Form>
		<Spin v-if='modelLoading' fix></spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'EditPassword',
	data() {
		const validatePassCheck = (rule, value, callback) => { // 确认密码表单验证
			if (value == '') {
				callback(new Error('请确认登陆密码'));
			} else if (value !== this.form.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			title: '',
			visible: false,
			formLoading: true,
			modelLoading: false,
			form: {
				oldPassword: '',
				password: '',
				rePassword: '',
			},
			rule: {
				oldPassword: {
					required: true,
					message: '旧密码不能为空',
					trigger: 'blur'
				},
				password: {
					required: true,
					message: '新密码不能为空',
					trigger: 'blur'
				},
				rePassword: [{
					validator: validatePassCheck,
					message: '请再次输入新密码',
					trigger: 'blur'
				}],
			}
		}
	},
	methods: {
		showModal() {
			this.title = '修改密码'
			this.visible = true
			this.modelLoading = false
		},
		submit() {
			let api = this.$api.manage_userAccount_reset_userSelf_password
			let para = {
				password: this.form.password,
				oldPassword: this.form.oldPassword,
			}
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.modelLoading = true
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('密码修改成功！请重新登录！');
							this.visible = false
							this.modelLoading = false
							let that = this
							let timer = setTimeout(function() {
								that.$store.commit('MENU_RESET') // 重置菜单
							}, 2000)
						} else {
							this.modelLoading = false
							return this.changeLoading();
						}
					}).catch(err => {
						console.log(err);
					})
				} else {
					return this.changeLoading();
				}
				setTimeout(() => {
					this.changeLoading();
				}, 1000);
			})
		},
		cancel() {
			this.$refs['form'].resetFields();
		},
		changeLoading() { // 修改表单loading状态
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
	}
}
</script>
