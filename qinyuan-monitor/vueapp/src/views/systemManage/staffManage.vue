<template>
	<div class="factoryManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="员工列表"></model-bar>
			<search :searchList="staffSearchList" :searchParams="staffSearchParams" formName="staffSearch" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新建员工" @add="addStaff"></search>
			<table-page :loading="loading"  :page="page" :limit="limit" :tableDable="staffList" :columns="staffColumns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getStaffList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogStaffVisible">
			<el-form :model="staffForm" status-icon :rules="staffRules" ref="staffForm" label-width="100px" class="demo-ruleForm">
				<el-form-item v-if="activeName=='新建员工'" label="员工账号" prop="username">
					<el-input v-model.trim="staffForm.username" placeholder="请输入员工账号" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="员工姓名" prop="realName">
					<el-input v-model.trim="staffForm.realName" placeholder="请输入员工姓名" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="登陆密码" prop="password">
					<el-input v-model.trim="staffForm.password" type="password" placeholder="请输入登陆密码" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属工厂" prop="factoryIds">
					<el-select class="select" v-model="staffForm.factoryIds" multiple collapse-tags placeholder="请选择所属工厂" @change="changeFactory">
						<el-option v-for="(item,index) in factoryList" :key="index" v-if="item.status==1" :label="item.factoryName" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属产线" prop="productionLineList">
					<el-select class="select" v-model="staffForm.productionLineList" multiple collapse-tags placeholder="请选择所属产线"
					 @change="changeLine">
						<el-option v-for="item in productionLineList" :key="item.value" v-if="item.status==1" :label="item.factoryName+'-'+item.lineName"
						 :value="item.lineId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色名称" prop="roleId">
					<el-select class="select" v-model="staffForm.roleId" placeholder="请输入角色名称">
						<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('staffForm')">确认</el-button>
					<el-button @click="resetForm('staffForm')">重置</el-button>
				</el-form-item><strong></strong>
			</el-form>
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
						name: "员工管理",
						path: "/staffManage"
					}
				],
				loading: true,
				permission: "",
				factoryList: [],
				productionLineList: [],
				roles: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				activeName: "新建员工",
				dialogStaffVisible: false,
				dialogRoleVisible: false,
				staffRules: {
					username: [{
						required: true,
						message: '请输入员工账号',
						trigger: 'blur'
					}],
					realName: [{
						required: true,
						message: '请输入员工姓名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请选择登录密码',
						trigger: 'blur'
					}],
					factoryIds: [{
						required: true,
						message: '请选择所属工厂',
						trigger: 'change'
					}],
					productionLineList: [{
						required: true,
						message: '请选择所属产线',
						trigger: 'change'
					}],
					roleId: [{
						required: true,
						message: '请选择所属角色',
						trigger: 'change'
					}],
				},
				staffForm: {
					username: "",
					realName: "",
					password: "",
					roleId: "",
					productionLineList: [],
					factoryLineId: "",
					factoryIds: "",
					factoryId: "",
				},
				staffSearchList: [{
						label: "员工账号",
						prop: "username",
						type: 'input',
					},
					{
						label: "角色名称",
						prop: "roleName",
						type: 'input',
					},
					{
						label: "姓名",
						prop: "realName",
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
				staffSearchParams: {
					realName: null,
					staffName: null,
					roleName: null,
					username: null,
					status: null,
				},
				staffList: [],
				staffColumns: [{
						prop: 'username',
						label: '员工账号',
						align: 'left',
					},
					{
						prop: 'roleName',
						label: '角色',
						align: 'left',
					},
					{
						prop: 'realName',
						label: '姓名',
						align: 'left',
					},
					{
						prop: 'factoryLineNames',
						label: '所属产线',
						align: 'left',
					},
					{
						prop: 'status',
						label: '使用状态',
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
									},
									on: {
										click: () => {
											console.log()
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
			this.getStaffList();
			this.getFactoryList();
			this.getRoleList();
		},
		methods: {
			submitForm(formName) {
				if (formName == "staffSearch") {
					this.getStaffList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = ""
							this.staffForm.password = this.CalcuMD5(this.staffForm.password);
							if (this.activeName == "新建员工") {
								api = this.$Api.manage_createAccount;
							} else {
								api = this.$Api.manage_updateAccount;
								this.staffForm.id = this.editId;
							}
							this.$Axios.post(api, this.staffForm).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogStaffVisible = false;
									this.getStaffList();
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
				if (formName == "staffSearch") {
					this.staffSearchParams = {
						roleName: null,
						status: null,
					}
					this.getStaffList();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			CalcuMD5(pwd) {
				pwd = md5(pwd);
				pwd = pwd.toUpperCase();
				return pwd;
			},
			addStaff() {
				this.dialogStaffVisible = true;
				this.activeName = "新建员工";
				this.staffForm = {
					username: "",
					realName: "",
					password: "",
					roleId: "",
					productionLineList: [],
					factoryLineId: ""
				}
				this.$nextTick(() => {
					this.$refs["staffForm"].resetFields();
				})
			},
			getFactoryList() {
				let api = this.$Api.manage_getFactorys;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
						userName: this.$cookies.get("username")
					}
				}).then((res) => {
					if (res.success) {
						this.factoryList = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getRoleList() {
				let api = this.$Api.manage_getRoles;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.roles = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			changeFactory(value) {
				let factoryIds = [];
				value.forEach((item, index) => {
					factoryIds.push(this.factoryList[item].factoryId)
					this.getProductLines(this.factoryList[item]);
				})

				this.staffForm.factoryId = factoryIds.toString();
			},
			getProductLines(item) {
				let api = this.$Api.manage_getProductLines;
				this.productionLineList = [];
				this.$Ax.get(api, {
					params: {
						factoryId: item.factoryId,
						timestamp: this.$store.state.axiosTime,
						userName: this.$cookies.get("username")
					}
				}).then((res) => {
					if (res.success) {
						for (let i in res.data) {
							res.data[i].factoryName = item.factoryName;
							this.productionLineList.push(res.data[i]);
						}
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			changeLine(value) {
				this.staffForm.factoryLineId = value.toString();
			},
			detail(index, row) {
				this.$router.push("/productionLine")
			},
			edit(row) {
				this.activeName = "编辑员工";
				this.dialogStaffVisible = true;
				this.editId = row.id;
				let factoryIds = [];
				if (row.factoryIds != null) {
					this.factoryList.forEach((factory, index) => {
						if (row.factoryIds.indexOf(",") != -1) {
							row.factoryIds.split(",").forEach((item, key) => {
								if (factory.factoryId == item) {
									this.getProductLines(factory);
									factoryIds.push(index)
								}
							})
						} else {
							if (factory.factoryId == row.factoryIds) {
								this.getProductLines(factory);
								factoryIds.push(index)
							}
						}
					})
				}
				this.staffForm = {
					username: row.username,
					realName: row.realName,
					password: null,
					roleId: row.roleId,
					factoryLineId: row.lineIds,
					productionLineList: row.lineIds == null ? "" : row.lineIds.split(",").length > 0 ? row.lineIds.split(",") : row.lineIds,
					factoryIds: factoryIds,
					factoryId: row.factoryIds,
				}
			},
			end(row) {
				let activeName = row.status == 1 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该员工?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_updateUserAccountStatus, {
						id: row.id,
						status: row.status == 2 ? 1 : 2,
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功");
							this.getStaffList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					}).catch(() => {});
				})
			},
			delete(row) {
				this.$confirm('确定要删除该员工?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_deleteAccount, {
						id: row.id,
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功")
							this.getStaffList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					}).catch(() => {});
				})
			},
			getStaffList() {
				let api = this.$Api.manage_userAccountList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.staffSearchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.staffList = res.data.data;
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
			}
		}
	}
</script>

<style lang="scss">
	.factoryManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
		}
	}
</style>
