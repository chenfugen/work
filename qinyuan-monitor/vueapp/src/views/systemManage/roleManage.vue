<template>
	<div class="roleManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="角色列表"></model-bar>
			<search :searchList="roleSearchList" :searchParams="roleSearchParams" formName="roleSearch" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新建角色" @add="addRole"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="roleList" :columns="roleColumns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getRoleList" />
			</el-tab-pane>
			</el-tabs>
		</div>
		<el-dialog :title="activeName" :visible.sync="dialogRoleVisible">
			<el-form :model="roleForm" status-icon :rules="roleRules" ref="roleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model.trim="roleForm.roleName" placeholder="请输入角色名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色权限" prop="permission">
					<el-tree :props="defaultProps" node-key="moduleName" :data="permission" ref="tree" show-checkbox></el-tree>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('roleForm')">确认</el-button>
					<el-button @click="resetForm('roleForm')">重置</el-button>
				</el-form-item><strong></strong>
			</el-form>
		</el-dialog>
		<el-dialog title="权限查看" width="30%"  :visible.sync="dialogpermissionVisible" :class="{ searchTree: dialogpermissionVisible }">
			<el-tree :props="defaultProps" :default-expanded-keys="['滤芯产测', '成品抽检', '系统管理']" node-key="moduleName" ref="searchTree"
			 :data="permission" show-checkbox></el-tree>
		</el-dialog>
	</div>
</template>

<script>
	import breadcrumb from "../../components/breadcrumb.vue"
	import modelBar from "../../components/modelBar.vue"
	import search from "../../components/searchList.vue"
	import tablePage from "../../components/table.vue"
	import pagination from "../../components/pagination.vue"
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				navigation: [{
						name: "系统管理",
						path: ""
					},
					{
						name: "角色管理",
						path: "/roleManage"
					}
				],
				loading: true,
				rolePermission: [],
				permission: [],
				roles: [],
				defaultProps: {
					children: 'child',
					label: 'moduleName',
				},
				activeName: "新建角色",
				dialogRoleVisible: false,
				dialogpermissionVisible: false,
				roleRules: {
					roleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}],
					permission: [{
						required: false,
						message: '请选择角色对应权限',
					}]
				},
				roleForm: {
					roleName: "",
					permission: [],
					urls: [],
					roleId: ""
				},
				roleSearchList: [{
						label: "角色名称",
						prop: "roleName",
						type: 'input',
					},
					{
						label: "状态",
						prop: "status",
						type: 'select',
						options: [{
								label: "启用",
								value: 2,
							},
							{
								label: "禁用",
								value: 1,
							}
						]
					}
				],
				roleSearchParams: {
					roleName: null,
					status: null,
				},
				roleList: [],
				roleColumns: [{
						prop: 'roleName',
						label: '角色名称',
						align: 'left',
					},
					{
						prop: 'permission',
						label: '权限管理',
						align: 'left',
						render: (h, params) => {
							return h('el-link', {
								props: {
									type: "primary"
								},
								on: {
									click: () => {
										this.search(params.row)
									},
								}
							}, '查看')
						}
					},
					{
						prop: 'status',
						label: '状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									type: params.row.status === 2 ? '' : 'danger'
								} // 组件的props
							}, params.row.status === 2 ? '启用' : '禁用')
						}
					}, {
						label: '操作',
						width: 200,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
										disabled: params.row.roleName == '超级角色' ? true : false,
									},
									on: {
										click: () => {
											this.end(params.row)
										}
									}
								}, params.row.status == 1 ? '启用' : '禁用'),
								h('span', {
									style: {
										display: "inline-block",
										width: "1px",
										height: "10px",
										margin: "0px 5px",
										background: "#E8E8E8",
									}
								}),
								h('el-link', {
									props: {
										type: 'primary',
										disabled: params.row.roleName == '超级角色' ? true : false,
									},
									on: {
										click: () => {
											this.edit(params.row)
										}
									}
								}, '编辑'),
								h('span', {
									style: {
										display: "inline-block",
										width: "1px",
										height: "10px",
										margin: "0px 5px",
										background: "#E8E8E8",
									}
								}),
								h('el-link', {
									props: {
										type: 'primary',
										disabled: params.row.roleName == '超级角色' ? true : false,
									},
									on: {
										click: () => {
											this.delete(params.row)
										}
									}
								}, '删除'),
							]);
						}
					}
				],
				editId: "",
				total: 0, //数据总条数
				page: 1, //默认显示第1页
				limit: 10 //默认一次显示10条数据
			}
		},
		components: {
			breadcrumb,
			modelBar,
			search,
			tablePage,
			pagination
		},
		created() {
			this.$store.commit('updateTime');
			this.getRoleList();
			this.getuserTree();
		},
		methods: {
			handleCheckChange(data, checked, indeterminate) {
				if (checked) {
					this.roleForm.permission.push(data);
				} else {
					this.roleForm.permission.forEach((item, index) => {
						if (item.sort == data.sort) {
							this.roleForm.permission.splice(index, 1);
						}
					})
				}
			},
			submitForm(formName) {
				if (formName == "roleSearch") {
					this.getRoleList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let urls = [];
							let HalfChecke = []
							let treeDate = this.$refs.tree.getCheckedNodes();
							let treeHalfDate = this.$refs.tree.getHalfCheckedNodes();
							if (treeDate.length == 0 && treeHalfDate.length == 0) {
								this.$message({
									message: "权限值不能为空",
									type: 'warning'
								});
								return false;
							}
							//获取urls
							treeDate.forEach((item, index) => {
								if (item.url != undefined) {
									urls.push(item.url)
								}
							})
							//获取权限
							treeHalfDate.forEach((item, index) => {
								if (item.menuSort != undefined) {
									item.child = undefined;
									HalfChecke.push(item)
								}
							})

							this.roleForm.urls = JSON.stringify(urls);
							this.roleForm.permission = JSON.stringify(treeDate.concat(HalfChecke));
							let api = "";
							if (this.activeName == "新建角色") {
								api = this.$Api.manage_createRole;
							} else {
								api = this.$Api.manage_updateRole;
								this.roleForm.roleId = this.editId;
							}
							this.$Axios.post(api, this.roleForm).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogRoleVisible = false;
									this.permission = JSON.parse(sessionStorage.getItem("permission"));
									this.getRoleList();
								} else {
									this.$message({
										message: res.message,
										type: 'warning'
									});
								}
							})
						}
					})
				}
			},
			resetForm(formName) {
				if (formName == "roleSearch") {
					this.roleSearchParams = {
						roleName: null,
						status: null,
					}
					this.getRoleList();
				} else {
					this.$refs[formName].resetFields();
                    this.$nextTick(() => {
                    	this.$refs.tree.setCheckedKeys([]);
                    })
				}
			},
			search(row) {
				if (row.permission == null) {
					this.$message({
						message: "暂无权限数据",
						type: 'warning'
					});
				} else {
					this.dialogpermissionVisible = true;
					this.$nextTick(() => {
						this.$refs.searchTree.setCheckedNodes(JSON.parse(row.permission).filter((item, index) => {
							return item.menuSort == undefined;
						}));
					})
				}
			},
			addRole() {
				this.activeName = "新建角色";
				this.dialogRoleVisible = true;
				this.roleForm = {
					roleName: "",
					permission: [],
					urls: [],
					roleId: ""
				}
				this.$nextTick(() => {
					this.$refs.tree.setCheckedKeys([]);
				})
			},
			getRoles() {
				let api = this.$Api.manage_getRoles;
				this.$Axios.get(api).then((res) => {
					if (res.success) {
						this.roles = res.data.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {
					this.$message({
						message: res.message,
						type: 'warning'
					});
				});
			},
			detail(index, row) {
				this.$router.push("/productionLine")
			},
			edit(row) {
				this.activeName = "编辑角色";
				this.dialogRoleVisible = true;
				this.roleForm.roleName = row.roleName;
				this.editId = row.id;
				if (row.permission != null) {
					this.$nextTick(() => {
						this.$refs.tree.setCheckedNodes(JSON.parse(row.permission).filter((item, index) => {
							return item.menuSort == undefined;
						}));
					})
				} else {
					this.$nextTick(() => {
						this.$refs.tree.setCheckedKeys([]);
					})
				}
			},
			end(row) {
				let activeName = row.status == 1 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该角色?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_updateRoleStatus, {
						roleId: row.id,
						status: row.status == 2 ? 1 : 2,
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getRoleList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					}).catch((res) => {});
				})
			},
			delete(row) {
				this.$confirm('确定要删除该角色?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_deleteRole, {
						roleId: row.id,
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getRoleList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					}).catch((res) => {});
				})
			},
			getRoleList() {
				let api = this.$Api.manage_roleList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.roleSearchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.roleList = res.data.data;
						this.total = res.data.count;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {
					this.$message({
						message: res.message,
						type: 'warning'
					});
				});
			},
			getuserTree() {
				let api = this.$Api.manage_tree;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.permission = res.data;
						for (let j = 0; j < this.permission.length; j++) {
							this.permission[j].child.sort((a, b) => {
								return a.menuSort - b.menuSort
							})
						}
						sessionStorage.setItem("permission", JSON.stringify(this.permission));
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {
					this.$message({
						message: res.message,
						type: 'warning'
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	.roleManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);

			
		}
		.searchTree {
			label.el-checkbox{
				pointer-events: none;
			}			
		}
	}
</style>
