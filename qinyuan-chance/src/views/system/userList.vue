<template>
<div id="userList">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" v-if='permission.add' @click='handleAdd'>新增</Button>
	</div>
	<div class="filterbox">
		<Input v-model="filter.accountName" placeholder="用户名称" class="input marginRight" clearable />
		<Select v-model="filter.roleId" placeholder='角色名称' class="input marginRight" clearable>
			<Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
		</Select>
	</div>
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' @on-ok="submit" @on-cancel="cancel" style="position:relative;">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="80">
			<FormItem prop="userName" label='用户名称:'>
				<Input v-model="form.userName" class="input">
				</Input>
			</FormItem>
			<FormItem prop="realName" label='真实姓名:'>
				<Input v-model="form.realName" class="input">
				</Input>
			</FormItem>
			<FormItem prop="password" label='登录密码:' v-show='act=="add"'>
				<Input v-model="form.password" type='password' class="input">
				</Input>
			</FormItem>
			<FormItem prop="repassword" label='确认密码:' v-show='act=="add"'>
				<Input v-model="form.repassword" type='password' class="input">
				</Input>
			</FormItem>
			<FormItem prop="roleId" label='用户角色:'>
				<Select v-model="form.roleId" class="input marginRight" clearable>
					<Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
				</Select>
			</FormItem>
			<FormItem prop="factoryId" label='工厂:' v-show='showFactory'>
				<Select v-model="form.factoryId" class="input marginRight" clearable>
					<Option v-for="item in factoryList" :value="item.id" :key="item.id">{{ item.factoryName }}</Option>
				</Select>
			</FormItem>
			<FormItem prop="productLineId" label='产线:' v-show='showFactory'>
				<Select :disabled='proLineDisable' v-model="form.productLineId" class="input marginRight" clearable>
					<Option v-for="item in productLineList" :value="item.id" :key="item.id">{{ item.productLineName }}</Option>
				</Select>
			</FormItem>
		</Form>
		<Spin v-if='dialogLoading' fix></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'userList',
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
			permission: {
				edit: false,
				disable: false,
				rePassword: false,
				add: false,
				delete: false,
			},
			act: '',
			dialogTitle: '',
			showFactory: false,
			proLineDisable: true,
			dialog: false,
			dialogLoading: false,
			formLoading: true,
			form: {
				factoryId: '',
				productLineId: '',
				userName: '',
				realName: '',
				password: '',
				repassword: '',
				roleId: '',
			},
			filter: {
				roleId: '',
				accountName: '',
			},
			rule: {
				userName: {
					required: true,
					message: '用户名称不能为空',
					trigger: 'blur'
				},
				realName: {
					required: true,
					message: '真实姓名不能为空',
					trigger: 'blur'
				},
				password: {
					required: true,
					message: '登陆密码不能为空',
					trigger: 'blur'
				},
				repassword: [{
					validator: validatePassCheck,
					trigger: 'blur'
				}],
				roleId: {
					required: true,
					message: '用户角色不能为空',
					trigger: 'blur'
				}
			},
			factoryList: [],
			productLineList: [],
			roleList: [],
			listData: [],
			columns: [{
					title: '序号',
					type: 'index',
				}, {
					title: '用户名称',
					key: 'userName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.userName)),
						]);
					}
				},
				{
					title: '真实姓名',
					key: 'realName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.realName)),
						]);
					}
				},
				{
					title: '角色',
					key: 'roleName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.roleName)),
						]);
					}
				},
				{
					title: '工厂',
					key: 'factoryName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.factoryName)),
						]);
					}
				},
				{
					title: '产线',
					key: 'productLineName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.productLineName)),
						]);
					}
				},
				{
					title: '最后登录时间',
					key: 'lastOnlineTime',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.lastOnlineTime)),
						]);
					}
				},
				{
					title: '状态',
					key: 'forbidden',
					render: (h, params) => {
						return h('div', [
							h('span', {
								style: {
									color: params.row.forbidden == '1' ? 'green' : 'red'
								}
							}, params.row.forbidden == '1' ? '启用' : '禁用'),
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 250,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: params.row.forbidden == 0 ? 'success' : 'error',
									disabled: params.row.roleId == 'root' ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.disable ? 'inlin-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleDisable(params.row)
									}
								}
							}, params.row.forbidden == 0 ? '启用' : '禁用'),
							h('Button', {
								props: {
									type: 'primary',
									disabled: params.row.forbidden != 0 || params.row.roleId == 'root' ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.edit ? 'inlin-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleEdit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'primary',
									disabled: params.row.forbidden != 0 || params.row.roleId == 'root' ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.rePassword ? 'inlin-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleEditPWD(params.row)
									}
								}
							}, '重置密码'),
							h('Button', {
								props: {
									type: 'error',
									disabled: params.row.forbidden != 0 || params.row.roleId == 'root' ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.delete ? 'inlin-block' : 'none',
								},
								on: {
									click: () => {
										this.handleDelete(params.row)
									}
								}
							}, '删除')
						]);
					}
				}
			],
		}
	},
	mounted() {
		this.getTableData()
		this.getRoleList()
		this.getPermissionList()
	},
	watch: {
		form: {
			handler(curVal, oldVal) {
				if (curVal.factoryId == '' || curVal.factoryId == undefined) {
					this.proLineDisable = true
				} else {
					this.proLineDisable = false
					this.getProductLineList(curVal.factoryId)
				}
				if (curVal.roleId == '' || curVal.roleId == undefined) {
					this.showFactory = false
				} else {
					this.checkRole(curVal.roleId)
				}
			},
			deep: true
		}
	},
	methods: {
		getTableData() {
			let api = this.$api.manage_userAccount_list
			this.tableLoading = true
			let para = {
				...this.filter,
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		getRoleList() {
			let api = this.$api.common_account_role_list
			let para = {
				pageNum: 1,
				pageSize: 100,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.roleList = []
				for (let i in res.data.data) {
					if (res.data.data[i].id != 'root') {
						this.roleList.push(res.data.data[i])
					}
				}
			}).catch(err => {
				console.log(err);
			})
		},
		getFactoryList() {
			let api = this.$api.manage_factory_getFactoryList
			let para = {
				pageNum: 1,
				pageSize: 100,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.factoryList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		getProductLineList(factoryId) {
			let api = this.$api.manage_productLine_getProductLineList
			let para = {
				pageNum: 1,
				pageSize: 100,
				factoryId: factoryId
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productLineList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleDelete(row) {
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认删除该用户（用户：' + row.userName + '）？</p>',
				onOk: () => {
					let api = this.$api.manage_userAccount_delete
					let para = {
						id: row.id
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('删除成功。');
							this.getTableData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消删除。');
				}
			});
		},
		handleEdit(row) {
			this.getFactoryList()
			this.cancel()
			this.dialogLoading = true
			this.dialogTitle = '编辑'
			this.dialog = true
			this.act = 'edit'
			let api = this.$api.manage_userAccount_userDetail
			let para = {
				id: row.id
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
				this.form.repassword = this.form.password
				this.dialogLoading = false
			}).catch(err => {
				console.log(err);
			})

		},
		handleDisable(row) {
			let msg = row.forbidden == 0 ? '启用' : '禁用'
			let api = (row.forbidden == 0) ? this.$api.manage_userAccount_used : this.$api.manage_userAccount_forbidden
			let para = {
				id: row.id
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认' + msg + '该用户（用户：' + row.userName + '）？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(msg + '成功。')
							this.getTableData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消。');
				}
			});
		},
		handleAdd() {
			this.getFactoryList()
			this.cancel()
			this.dialog = true
			this.dialogLoading = false
			this.dialogTitle = '添加'
			this.act = 'add'
		},
		handleEditPWD(row) {
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认重置该用户密码（用户：' + row.userName + '）？</p>',
				onOk: () => {
					let api = this.$api.manage_userAccount_reset_password
					let para = {
						id: row.id,
						password: '123456',
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('重置密码成功。');
							this.getTableData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消重置密码。');
				}
			});
		},
		submit() {
			let api = ''
			let para = ''
			let msg = ''
			if (this.act == 'add') {
				msg = '添加用户成功。'
				api = this.$api.manage_userAccount_create
				para = this.form
			} else {
				msg = '编辑用户成功。'
				api = this.$api.manage_userAccount_update
				para = this.form
			}
			this.$refs['form'].validate((valid) => {
				if (valid) {
					if (this.act == 'edit') {
						para.password = ''
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(msg);
							this.getTableData()
							this.dialog = false
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
		checkRole(roleId) {
			this.dialogLoading = true
			let api = this.$api.manage_role_detail
			let para = {
				roleId: roleId,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				if (res.data.data.roleFlag == '1') {
					this.showFactory = false
				} else {
					this.showFactory = true
				}
				this.dialogLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		dealNull(data) {
			if (data === '' || data === null) {
				return '--'
			} else {
				return data
			}
		},
		getPermissionList() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '系统管理') {
					for (let y in menu[i].children) {
						if (menu[i].children[y].name == '用户列表') {
							let menuC = menu[i].children[y].children
							for (let x in menuC) {
								if (menuC[x].name == '用户禁用') {
									this.permission.disable = menuC[x].checked
								}
								if (menuC[x].name == '用户编辑') {
									this.permission.edit = menuC[x].checked
								}
								if (menuC[x].name == '重置密码') {
									this.permission.rePassword = menuC[x].checked
								}
								if (menuC[x].name == '用户删除') {
									this.permission.delete = menuC[x].checked
								}
								if (menuC[x].name == '用户新增') {
									this.permission.add = menuC[x].checked
								}
							}
						}
					}
				}
			}
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.actBox {
	margin-bottom: 20px;
}
</style>
