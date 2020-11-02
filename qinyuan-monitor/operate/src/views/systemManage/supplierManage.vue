<template>
	<div class="mailManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="供应商列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新增" @add="add"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getSupplierList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogShowVisible">
			<el-form :model="supplyForm" status-icon :rules="roleRules" ref="supplyForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="供应商名称" prop="name">
					<el-input v-model.trim="supplyForm.name" placeholder="请输入供应商名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="对接人" prop="jointPerson">
					<el-input v-model.trim="supplyForm.jointPerson" placeholder="请输入对接人姓名" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="供应商邮箱" prop="mail">
					<el-input placeholder="请输入邮箱地址" v-model="supplyForm.mail">
						<!-- <template slot="append">@unilever.com</template> -->
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('supplyForm')">确认</el-button>
					<el-button @click="resetForm('supplyForm')">取消</el-button>
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
	export default {
		data() {
			return {
				navigation: [{
						name: "系统管理",
						path: ""
					},
					{
						name: "供应商管理",
						path: ""
					}
				],
				searchList: [{
						label: "供应商名称",
						prop: "name",
						type: 'input',
					},
					{
						label: "状态",
						prop: "status",
						type: 'select',
						options: [{
							label: "启用",
							value: 1
						}, {
							label: "禁用",
							value: 0
						}]
					}
				],
				searchParams: {
					name: null,
					status: null,
				},
				supplyForm: {
					name: null,
					jointPerson: null,
					mail: null
				},
				roleRules: {
					name: [{
						required: true,
						message: '请输入供应商名称',
						trigger: 'blur'
					}],
					jointPerson: [{
						required: true,
						message: '请输入对接人姓名',
						trigger: 'blur'
					}],
					mail: [{
						required: true,
						message: '请输入供应商邮箱',
						trigger: 'blur'
					}, {
						type: 'email',
						message: '请输入正确的邮箱地址',
						trigger: 'blur',
					}]
				},
				activeName: "新增供应商",
				tableDable: [],
				columns: [{
						prop: 'name',
						label: '供应商名称',
						align: 'left',
					}, {
						prop: 'mail',
						label: '邮箱地址',
						align: 'left',
					},
					{
						prop: 'jointPerson',
						label: '对接人',
						align: 'left',
					},				
					{
						prop: 'createTime',
						label: '创建时间',
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.createTime))
						}
					},
					{
						prop: 'status',
						label: '当前状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									type: params.row.status === 1 ? '' : 'danger'
								} // 组件的props
							}, params.row.status === 1 ? '启用' : '禁用')
						}
					},
					{
						prop: 'operator',
						label: '添加人',
						align: 'left',
					},
					{
						label: '操作',
						width: 200,
						align: 'left',
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.end(params.row)
										}
									}
								}, params.row.status == 0 ? '启用' : '禁用'),
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
										display: params.row.status == 0 ? "inline-block" : "none",
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
									style: {
										display: params.row.status == 0 ? "inline-block" : "none",
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
				dialogShowVisible: false,
				editId: null,
				loading: true,
				page: 1,
				limit: 10,
				total: 0
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
			this.getSupplierList();
		},
		methods: {
			formatDate(res) {
				if (res == null) {
					return '--';
				} else {
					let date = new Date(res);
					let Y = date.getFullYear() + '-';
					let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
					let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
					let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
					let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
					return Y + M + D + h + m + s;
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						name: null,
						status: null,
					}
					this.page = 1;
					this.limit = 10;
					this.getSupplierList();
				} else {
					this.$refs[formName].resetFields();
					this.supplyForm = {
						name: null,
						jointPerson: null,
						mail: null,
					}
					this.dialogShowVisible = false;
				}
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page = 1;
					this.limit = 10;
					this.getSupplierList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = "";
							if (this.activeName == "新增供应商") {
								api = this.$Api.manage_supplierManage_add;
							} else {
								api = this.$Api.manage_supplierManage_edit;
								this.supplyForm.id = this.editId;
							}
							this.$Axios.post(api, this.supplyForm).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogShowVisible = false;
									this.getSupplierList();
								} else {
									this.$message({
										message: res.msg,
										type: 'warning'
									});
								}
							})
						}
					})
				}
			},
			add() {
				this.activeName = "新增供应商";
				this.dialogShowVisible = true;
				this.editId = null;
				this.$nextTick(() => {
					this.$refs["supplyForm"].resetFields();
				})
			},
			edit(row) {
				this.activeName = "编辑供应商";
				this.dialogShowVisible = true;
				this.supplyForm.name = row.name;
				this.supplyForm.mail = row.mail;
				this.supplyForm.jointPerson = row.jointPerson;
				this.editId = row.id;
			},
			end(row) {
				let activeName = row.status == 0 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该供应商?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_supplierManage_changeStatus, {
						id: row.id,
						status: row.status == 0 ? 1 : 0,
						name:row.name
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getSupplierList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			delete(row) {
				this.$confirm('确定要删除该供应商?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_supplierManage_delete, {
						id: row.id,
						name:row.name
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getSupplierList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					}).catch((res) => {});
				})
			},
			getSupplierList() {
				let api = this.$Api.manage_supplierManage_list;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.tableDable = res.data.data;
						this.total = res.data.total;
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
		}
	}
</script>

<style lang="scss">
	.mailManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
		}
	}
</style>
