<template>
<div id="roleList">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" v-if='permission.add' @click='handleAdd'>新增</Button>
	</div>
	<div class="filterbox">
		<Input v-model="filter.roleName" placeholder='角色名称' class="input" clearable></Input>
	</div>
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" title="编辑" :loading='formLoading' @on-ok="submit" @on-cancel="cancel">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="120">
			<FormItem prop="roleName" label='角色名称:'>
				<Input v-model="form.roleName" class="input">
				</Input>
			</FormItem>
			<FormItem prop="roleFlag" label='角色类型(是否全局):'>
				<i-switch :true-value='1' :false-value='0' v-model="form.roleFlag">
					<span slot="open">是</span>
					<span slot="close">否</span>
				</i-switch>
			</FormItem>
			<FormItem prop="permissions" label='权限列表:'>
				<Tree ref='tree' :data="menu" empty-text='暂无数据' style="margin-left:70px" show-checkbox></Tree>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>
<script>
import menuList from '@/utils/menu'
export default {
	name: 'roleList',
	data() {
		return {
			permission: {
				disable: false,
				info: false,
				delete: false,
				add: false,
			},
			menu: menuList,
			pageNum: 1,
			pageSize: 10,
			total: 0,
			proLineDisable: true,
			tableLoading: false,
			formLoading: true,
			dialog: false,
			rule: {
				roleName: {
					required: true,
					message: '角色名称不能为空',
					trigger: 'blur'
				}
			},
			form: {
				roleName: '',
				roleFlag: 0,
				permissions: [],
			},
			filter: {
				roleName: '',
			},
			listData: [],
			permissionList: [],
			roleList: [],
			columns: [{
					title: '序号',
					type: 'index',
				}, {
					title: '角色名称',
					key: 'roleName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.roleName)),
						]);
					}
				},
				{
					title: '创建时间',
					key: 'createTime',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.createTime)),
						]);
					}
				},
				{
					title: '角色属性',
					key: 'roleFlag',
					render: (h, params) => {
						return h('div', [
							h('span', params.row.roleFlag == "1" ? '全局' : params.row.roleFlag == "0" ? '非全局' : '--'),
						]);
					}
				},
				{
					title: '角色状态',
					key: 'roleFlag',
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
									type: params.row.forbidden == 1 ? 'error' : 'success',
									disabled: params.row.id == 'root' ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.disable ? 'inline-block' : 'none',
									marginLeft: '5px'
								},
								on: {
									click: () => {
										this.handleDisabled(params.row)
									}
								}
							}, params.row.forbidden == 1 ? '禁用' : '启用'),
							h('Button', {
								props: {
									type: 'primary',
									disabled: params.row.id == 'root' || params.row.forbidden == 1 ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.info ? 'inline-block' : 'none',
									marginLeft: '5px'
								},
								on: {
									click: () => {
										this.goInfo(params.row)
									}
								}
							}, '查看'),
							h('Button', {
								props: {
									type: 'error',
									disabled: params.row.id == 'root' || params.row.forbidden == 1 ? true : false,
									size: 'small'
								},
								style: {
									display: this.permission.delete ? 'inline-block' : 'none',
									marginLeft: '5px'
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
		this.getPermissionList()
	},
	methods: {
		getTableData() {
			this.tableLoading = true
			let api = this.$api.manage_role_list
			let para = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				...this.filter
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		goInfo(row) {
			this.$router.push({
				path: '/system/roleInfo',
				name: 'roleInfo',
				query: {
					roleId: row.id
				}
			});
		},
		handleAdd() {
			this.cancel()
			this.act = 'add'
			this.dialogTitle = '新增角色'
			this.dialog = true
		},
		handleDelete(row) {
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认删除该角色（角色：' + row.roleName + '）？</p>',
				onOk: () => {
					let api = this.$api.manage_role_delete
					let para = {
						roleId: row.id
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
		handleDisabled(row) {
			let api = this.$api.manage_role_forbidden
			let msg = row.forbidden == '1' ? '禁用' : '启用'
			let para = {
				id: row.id,
				forbidden: row.forbidden == '1' ? '0' : '1'
			}
			this.$Modal.confirm({
				title: '警告',
				content: '<p>确认' + msg + '该角色（角色：' + row.roleName + '）？</p>',
				onOk: () => {
					this.selectCLoading = true
					this.$Ax.post(api, para).then(res => {
						this.$Message.success(msg + '成功。');
						this.getTableData()
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消禁用。');
				}
			});
		},
		handleDealTree(data) {
			let list = []
			let count = false
			for (let i in data) {
				for (let y in menuList) {
					count = false
					if (data[i].title == menuList[y].title) {
						for (let z in list) {
							if (data[i].title == list[z].title) {
								count = true
							} else {
								continue
							}
						}
						if (!count) {
							list.push(data[i])
						}
					}
				}
			}
			return list
		},
		submit() {
			let permissionsPass = false
			let msg = '添加角色成功。'
			let api = this.$api.manage_role_create
			// this.form.permissions = JSON.stringify(this.handleDealTree(this.$refs.tree.getCheckedNodes()))
			this.form.permissions = this.handleDealTree(this.$refs.tree.getCheckedNodes())
			if (this.form.permissions.length < 1) {
				this.$Message.error('请至少选择一项权限。')
				return this.changeLoading();
			}
			let para = {
				roleName: this.form.roleName,
				permissions: JSON.stringify(this.form.permissions),
				roleFlag: this.form.roleFlag,
				factoryId: this.form.factoryId,
				productLineId: this.form.productLineId
			}
			this.$refs['form'].validate((valid) => {
				if (valid) {
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
			this.clearTree(this.menu)
		},
		clearTree(tree) {
			for (let i in tree) {
				tree[i].checked = false
				for (let y in tree[i].children) {
					tree[i].children[y].checked = false
					for (let z in tree[i].children[y].children) {
						tree[i].children[y].children[z].checked = false
					}
				}
			}
			return tree
		},
		changeLoading() { // 修改表单loading状态
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
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
						if (menu[i].children[y].name == '角色列表') {
							let menuC = menu[i].children[y].children
							for (let x in menuC) {
								if (menuC[x].name == '角色禁用') {
									this.permission.disable = menuC[x].checked
								}
								if (menuC[x].name == '角色详细') {
									this.permission.info = menuC[x].checked
								}
								if (menuC[x].name == '角色删除') {
									this.permission.delete = menuC[x].checked
								}
								if (menuC[x].name == '角色新增') {
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
