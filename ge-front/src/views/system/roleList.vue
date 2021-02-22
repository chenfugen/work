<!-- 角色管理 -->
<template>
<div class="roleList clearfloat">
	<div class="clearfloat">
		<searchForm ref='searchForm' @handleSearch='getTableData()' :configList='configList'></searchForm>
		<div>
			<Button type='primary' @click='handleAdd'>新增</Button>
		</div>
	</div>
	<div class="tableBox left marginTop">
		<tableComponent ref='tableComponent' :columns='columns' :showBatchDel='false'></tableComponent>
	</div>
	<Card class="roleTreeCard right relarive">
		<div class="clearfloat" style="color:#2d8cf0;">
			<span class="left">{{roleName}}</span>
			<div class="right">
				<Button type='primary' @click='getPermissionTree'>查看全部权限</Button>
			</div>
		</div>
		<Tree ref='showTree' :data="permissionList" :children-key='"child"'></Tree>
	</Card>
	<!-- 添加表单 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading="dialogLoading" :width='50' @on-ok="handleSubmit">
		<Form ref="formAdd" :model="formAdd" :rules="ruleAdd" :label-width="80">
			<FormItem prop="roleName" label='角色名'>
				<!-- eslint-disable -->
				<Input type="text" v-model="formAdd.roleName" class="formInput"></Input>
				<!-- eslint-enable -->
			</FormItem>
			<FormItem prop="permission" label='角色权限'>
			</FormItem>
			<Tree ref='formAdd' :data="addPermissionList" show-checkbox :children-key='"child"' class="marginLeft"></Tree>
		</Form>
	</Modal>
	<!-- 编辑表单 -->
	<Modal v-model="dialogEdit" :title="'编辑角色'" :loading="dialogLoading" :width='50' @on-ok="handleSubmit">
		<Form ref="formEdit" :model="formEdit" :rules="ruleAdd" :label-width="80">
			<FormItem prop="roleName" label='角色名'>
				<!-- eslint-disable -->
				<Input type="text" v-model="formEdit.roleName" class="formInput"></Input>
				<!-- eslint-enable -->
			</FormItem>
			<FormItem prop="permissions" label='角色权限'>
			</FormItem>
			<Tree ref='formEdit' :data="editPermissionList" show-checkbox :children-key='"child"' class="marginLeft"></Tree>
		</Form>
		<Spin fix v-if='editLoading'></Spin>
	</Modal>
</div>
</template>
<script>
import editTree from './funRole'
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
export default {
	name: 'roleList',
	data() {
		return {
			editLoading: false,
			act: '',
			roleName: '',
			dialog: false,
			dialogEdit: false,
			dialogTitle: '',
			dialogLoading: true,
			formAdd: {
				roleName: '',
				urls: [],
				permission: [],
			},
			formEdit: {
				roleName: '',
				urls: [],
				permissions: [],
			},
			ruleAdd: {
				roleName: [{
					required: true,
					message: '角色名不能为空',
					trigger: 'blur'
				}],
			},
			configList: [{
					plh: '角色名称',
					valName: 'roleName',
					type: 'input'
				},
				{
					plh: '创建时间',
					type: 'dateRange'
				},
				{
					plh: '状态',
					valName: 'forbidden',
					type: 'select',
					labelName: 'label',
					valueName: 'value',
					keyName: 'key',
					selectList: [{
						value: '1',
						label: '启用'
					}, {
						value: '0',
						label: '禁用'
					}],
				},
			],
			columns: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center',
				},
				{
					title: '角色名称',
					key: 'roleName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.roleName))
						]);
					}
				},
				{
					title: '创建时间',
					key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
						]);
					}
				},
				{
					title: '状态',
					key: 'forbidden',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', {
								style: {
									color: params.row.forbidden == 2 ? '#ed4014' : '#19be6b'
								}
							}, this.dealNullData(params.row.forbidden == 2 ? '禁用' : '启用'))
						]);
					}
				},
				{
					title: '权限',
					key: 'action',
					width: 80,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleShowPer(params.row)
									}
								}
							}, '查看'),
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 200,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									disabled: params.row.id == 'root' ? true : false
								},
								style: {
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
									type: 'text',
									size: 'small',
									disabled: params.row.id == 'root' ? true : false
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleForbidden(params.row)
									}
								}
							}, params.row.forbidden == 2 ? '启用' : '禁用'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									disabled: params.row.id == 'root' ? true : false
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleDelete(params.row)
									}
								}
							}, '删除'),
						]);
					}
				}
			],
			allPermission: [], // 全部权限
			permissionList: [], // 展示全部权限
			addPermissionList: [], // 表单展示权限
			editPermissionList: [], // 表单展示权限
		}
	},
	created() {
		this.getPermissionTree()
	},
	computed: {
		permissionTree() {
			return this.handleChangeTree(JSON.parse(sessionStorage.getItem('permissionTree')))
		}
	},
	mounted() {
		if (this.$store.state.user.userName == 'root') {
			this.columns.splice(2, 0, {
				title: '所属客户',
				align: 'center',
				key: 'customerName',
				render: (h, params) => {
					return h('div', [
						h('div', this.dealNullData(params.row.customerName))
					]);
				}
			})
		}
		this.getTableData()
	},
	components: {
		searchForm,
		tableComponent
	},
	methods: {
		// 获取列表数据
		getTableData() {
			let para = this.$refs.searchForm.handleSubmit()
			para.customerId = this.$store.state.user.customerId
			this.$refs.tableComponent.getData(this.$api.manage_role_list, para, true)
		},
		// 获取权限树形结构
		getPermissionTree() {
			this.roleName = '全部权限'
			let list = this.handleChangeTree(JSON.parse(sessionStorage.getItem('permissionTree')))
			list = this.handleChangeTree(list)
			this.allPermission = list
			this.permissionList = list
		},
		// 查看权限
		handleShowPer(row) {
			this.roleName = row.roleName
			if (row.id == 'root') {
				this.getPermissionTree()
			} else {
				this.permissionList = Object.assign(JSON.parse(row.permissions), {})
			}
		},
		// 编辑角色
		handleEdit(row) {
			this.dialogEdit = true
			this.editLoading = true
			this.editPermissionList = []
			this.getPermissionTree()
			this.act = 'edit'
			let api = this.$api.manage_role_detail,
				para = {
					roleId: row.id,
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.formEdit = res.data
				let nameArray = editTree.getTreeName(JSON.parse(res.data.permissions))
				let list = this.handleChangeTree(JSON.parse(sessionStorage.getItem('permissionTree')))
				this.editPermissionList = editTree.getAllTree(nameArray, list)
				this.editLoading = false
			}).catch(err => {
				/* eslint-disable */
				console.log(err);
				/* eslint-enable */
			})
		},
		// 新增权限
		handleAdd() {
			this.act = 'add'
			this.getPermissionTree()
			this.handleResetFields()
			let list = this.handleChangeTree(JSON.parse(sessionStorage.getItem('permissionTree')))
			this.addPermissionList = list
			this.dialogTitle = '新增角色'
			this.dialog = true
		},
		// 删除角色
		handleDelete(row) {
			this.$Modal.confirm({
				title: '删除',
				content: '确认删除该角色（' + row.roleName + '）？',
				onOk: () => {
					let api = this.$api.manage_role_delete
					let para = {
						id: row.id
					}
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success('删除成功');
						}
						this.getTableData()
					}).catch(err => {
						/* eslint-disable */
						console.log(err);
						/* eslint-enable */
					})
				},
				onCancel: () => {
					this.$Message.success('已取消');
				}
			});
		},
		// 重置表单
		handleResetFields() {
			this.$refs.formAdd.resetFields()
			this.$refs.formEdit.resetFields()
		},
		// 提交表单
		handleSubmit() {
			let api = '',
				para = {},
				ref = '',
				list = []
			if (this.act == 'add') {
				ref = 'formAdd'
				list = this.addPermissionList
				this.formAdd.permission = JSON.stringify(editTree.clearTree(editTree.dealTree(list)))
				this.formAdd.urls = JSON.stringify(editTree.getUrlsList(JSON.parse(this.formAdd.permission)))
				api = this.$api.manage_role_create
				para = {
					customerId: this.$store.state.user.customerId,
					...this.formAdd
				}
			} else {
				ref = 'formEdit'
				list = this.editPermissionList
				this.formEdit.permissions = JSON.stringify(editTree.clearTree(editTree.dealTree(list)))
				this.formEdit.urls = JSON.stringify(editTree.getUrlsList(JSON.parse(this.formEdit.permissions)))
				this.formEdit.roleId = this.formEdit.id
				api = this.$api.manage_role_update
				para = this.formEdit
			}
			this.$refs[ref].validate((valid) => {
				if (valid) {
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success(this.act == 'add' ? '创建成功' : '编辑成功')
						}
						this.dialog = false
						this.dialogEdit = false
						this.getPermissionTree()
						this.getTableData()
					}).catch(err => {
						/* eslint-disable */
						console.log(err);
						/* eslint-enable */
					})
				} else {
					this.changeLoading()
				}
			})
			this.changeLoading()
		},
		// 角色禁用
		handleForbidden(row) {
			this.$Modal.confirm({
				title: row.forbidden == 1 ? '禁用' : '启用',
				content: row.forbidden == 1 ? '确认禁用' : '确认启用' + '该角色（' + row.roleName + '）？',
				onOk: () => {
					let api = this.$api.manage_role_forbidden
					let para = {
						roleId: row.id,
						forbiddenType: row.forbidden == 1 ? 2 : 1
					}
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success(row.forbidden == 1 ? '禁用成功' : '启用成功');
						}
						this.getTableData()
					}).catch(err => {
						/* eslint-disable */
						console.log(err);
						/* eslint-enable */
					})
				},
				onCancel: () => {
					this.$Message.success('已取消');
				}
			});
		},
		// 修改表单loading状态
		changeLoading() {
			this.dialogLoading = false;
			this.$nextTick(() => {
				this.dialogLoading = true;
			});
		},
		// 处理空数据
		dealNullData(data) {
			return this.$Utils.dealNullData(data)
		},
		// ——————————————————————
		handleChangeTree(list) {
			for (let i in list) {
				list[i].expand = true
				if (list[i].child && list[i].child.length > 0) {
					for (let y in list[i].child) {
						list[i].child[y].expand = true
						if (list[i].child[y].child && list[i].child[y].child.length > 0) {
							for (let x in list[i].child[y].child) {
								list[i].child[y].child[x].expand = true
								if (list[i].child[y].child[x].child && list[i].child[y].child[x].child.length > 0) {
									for (let u in list[i].child[y].child[x].child) {
										list[i].child[y].child[x].child[u].expand = true
										list[i].child[y].child[x].child[u].title = list[i].child[y].child[x].child[u].name
									}
								}
							}
						}
					}
				}
			}
			return list
		},
	}
}
</script>

<style scoped>
.tableBox {
	width: 70%;
}

.roleTreeCard {
	width: 29%;
}
</style>
