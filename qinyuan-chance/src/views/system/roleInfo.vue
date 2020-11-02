<template>
<div id="roleInfo" class="clearfloat">
	<Tabs type="card">
		<TabPane label="基本信息">
			<Table :columns="columns" :data="rolelistData" border></Table>
			<Button @click='handleEdit' v-if='permission.edit' type="primary" class="left marginTop">编辑</Button>
		</TabPane>
		<TabPane label="权限信息">
			<Tree :data="permissions" empty-text='暂无数据'></Tree>
			<Button @click='handleEditPermission' v-if='permission.edit' type="primary" class="left marginTop">编辑</Button>
		</TabPane>
	</Tabs>
	<Spin v-if='pageLoaidng' fix></Spin>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' @on-ok="submit" @on-cancel="cancel">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="120">
			<FormItem v-show='act=="edit"' prop="roleName" label='角色名称:'>
				<Input v-model="form.roleName" class="input">
				</Input>
			</FormItem>
			<FormItem v-show='act=="edit"' prop="roleFlag" label='角色类型(是否全局):'>
				<Select class="input" v-model='form.roleFlag'>
					<Option :value='"1"'>是</Option>
					<Option :value='"0"'>否</Option>
				</Select>
			</FormItem>
			<div class="" v-show='act=="permission"'>
				<Tree ref='tree' :data="menu" empty-text='暂无数据' style="margin-left:70px" show-checkbox></Tree>
			</div>
		</Form>
	</Modal>
</div>
</template>
<script>
import menuList from '@/utils/menu'
export default {
	name: 'roleInfo',
	data() {
		return {
			permission: {
				edit: false,
			},
			menu: menuList,
			pageNum: 1,
			pageSize: 10,
			dialogTitle: '',
			total: 0,
			act: '',
			roleId: '',
			dialog: false,
			pageLoaidng: false,
			formLoading: true,
			filter: {
				roleName: '',
			},
			rule: {
				roleName: {
					required: true,
					message: '角色名称不能为空',
					trigger: 'blur'
				},
			},
			form: {
				roleName: '',
				roleFlag: 1,
				permissions: [],
			},
			permissions: [],
			rolelistData: [],
			columns: [{
					title: '角色名称',
					key: 'roleName',
				},
				{
					title: '创建人',
					key: 'createBy'
				},
				{
					title: '创建时间',
					key: 'createTime'
				}
			],
		}
	},
	mounted() {
		if (this.$route.query.roleId) {
			this.roleId = this.$route.query.roleId
			this.getInfo()
			this.getPermissionList()
		} else {
			this.$router.push({
				path: '/system/roleList',
				name: 'roleList',
			});
		}
	},
	methods: {
		getInfo() {
			this.pageLoaidng = true
			let api = this.$api.manage_role_detail
			let para = {
				roleId: this.roleId,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.permissions = this.handleDealTree(res.data.data.permissions)
				this.rolelistData = []
				this.rolelistData.push({
					roleName: res.data.data.roleName,
					createBy: res.data.data.createBy,
					createTime: res.data.data.createTime,
				})
				this.pageLoaidng = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleEdit() {
			this.cancel()
			this.act = 'edit'
			let para = {
				roleId: this.roleId
			}
			let api = this.$api.manage_role_detail
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
				this.dialogTitle = '角色编辑'
				this.dialog = true
			}).catch(err => {
				console.log(err);
			})
		},
		handleEditPermission() {
			this.cancel()
			this.act = 'permission'
			let para = {
				roleId: this.roleId
			}
			let api = this.$api.manage_role_detail
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
				this.dialogTitle = '权限编辑'
				this.dialog = true
			}).catch(err => {
				console.log(err);
			})
		},
		handleDealTree(tree) {
			let count = false
			let arr = []
			for (let x in tree) {
				count = true
				if (!tree[x].checked) {
					delete tree[x].children
				} else {
					for (let y in tree[x].children) {
						if (!tree[x].children[y].checked) {
							delete tree[x].children[y].children
						} else {
							arr = []
							for (let z in tree[x].children[y].children) {
								if (!tree[x].children[y].children[z].checked) {
									arr.push(z)
								}
							}
							for (let i in arr) {
								delete tree[x].children[y].children[i]
							}
						}
					}
				}
			}
			if (count) {
				return tree
			}
		},
		submit() {
			let msg = '编辑角色成功！'
			let api = this.$api.manage_role_update
			let list = this.handleGetTree(this.$refs.tree.getCheckedNodes())
			if (list.length == 0) {
				this.$Message.error('请至少选择一个权限')
				return this.changeLoading();
			}
			let para = {
				id: this.roleId,
				roleName: this.form.roleName,
				roleFlag: this.form.roleFlag,
				permissions: JSON.stringify(list)
			}
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(msg);
							this.getInfo()
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
		handleGetTree(treeList) {
			let list = []
			let menu = this.menu
			for (let i in menu) {
				if (menu[i].checked) {
					list.push(menu[i])
				} else if (menu[i].indeterminate) {
					let arr = {
						name: menu[i].name,
						title: menu[i].title,
						path: menu[i].path,
						checked: true,
						children: []
					}
					for (let x in menu[i].children) {
						if (menu[i].children[x].checked) {
							arr.children.push(menu[i].children[x])
						} else if (menu[i].children[x].indeterminate) {
							let arrC = {
								name: menu[i].children[x].name,
								title: menu[i].children[x].title,
								path: menu[i].children[x].path,
								checked: true,
								children: []
							}
							for (let y in menu[i].children[x].children) {
								if (menu[i].children[x].children[y].checked) {
									let arrCC = {
										name: menu[i].children[x].children[y].name,
										title: menu[i].children[x].children[y].title,
										checked: true,
									}
									arrC.children.push(arrCC)
								}
							}
							arr.children.push(arrC)
						}
					}
					list.push(arr)
				}
			}
			return list
		},
		cancel() {
			this.$refs['form'].resetFields();
			this.clearTree(this.menu)
		},
		clearTree(tree) {
			for (let i in tree) {
				tree[i].checked = false
				delete tree[i].indeterminate
				for (let y in tree[i].children) {
					tree[i].children[y].checked = false
					delete tree[i].children[y].indeterminate
					for (let z in tree[i].children[y].children) {
						tree[i].children[y].children[z].checked = false
						delete tree[i].children[y].children[z].indeterminate
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
		getPermissionList() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '系统管理') {
					for (let y in menu[i].children) {
						if (menu[i].children[y].name == '角色列表') {
							let menuC = menu[i].children[y].children
							for (let x in menuC) {
								if (menuC[x].name == '角色编辑') {
									this.permission.edit = menuC[x].checked
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
</style>
