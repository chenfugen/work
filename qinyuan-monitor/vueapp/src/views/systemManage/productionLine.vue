<template>
	<div class="productLine">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="产线列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新建产线" @add="add"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getProductionLine" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="产线名称" prop="productLineName">
					<el-input v-model.trim="ruleForm.productLineName" placeholder="请输入产线名称" autocomplete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="产线状态" prop="productLineCode">
					<el-select v-model="ruleForm.productLineCode" placeholder="请输入产线状态">
						<el-option label="启用" :value="1"></el-option>
						<el-option label="禁用" :value="2"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
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
						name: "工厂管理",
						path: "/factoryManage"
					},
					{
						name: "产线管理",
						path: ""
					}
				],
				loading: true,
				activeName: "新建工厂",
				dialogFormVisible: false,
				rules: {
					productLineName: [{
						required: true,
						message: '请输入产线名称',
						trigger: 'blur'
					}],
					productLineCode: [{
						required: true,
						message: '请选择产线状态',
						trigger: 'change'
					}]
				},
				ruleForm: {
					productLineName: null,
					productLineCode: null,
					factoryId: this.$route.params.id,
				},
				searchList: [{
						label: "产线名称",
						prop: "productLineName",
						type: 'input',
					},
					{
						label: "使用状态",
						prop: "productLineCode",
						type: 'select',
						options: [{
								label: "启用",
								value: 1,
							},
							{
								label: "禁用",
								value: 2,
							}
						]
					}
				],
				searchParams: {
					productLineName: null,
					productLineCode: null
				},
				factoryName:this.$route.params.name,
				tableDable: [],
				lineNumber: "",
				columns: [{
						prop: 'productLineName',
						label: '产线名称',
						align: 'left',
						render: (h, params) => {
							return h('div', [
								h('el-input', {
									props: {
										placeholder: "请修改后，回车",
										value: this.lineNumber
									},
									style: {
										display: params.row.isEdit ? 'block' : 'none'
									},
									on: {
										input: (value) => {
											this.handleEnter(value)
										},
										blur: (value) => {
											this.handleBlur(value)
										},
										change: () => {
											this.handleChange(params.row)
										},
									}
								}),
								h('span', {
									style: {
										display: params.row.isEdit ? 'none' : 'block'
									}
								}, params.row.productLineName)
							])
						}
					}, {
						prop: 'factoryId',
						label: '工厂名称',
						align: 'left',
						render: (h, params) => {
							return h('span',this.factoryName)
						}
					},
					{
						prop: 'status',
						label: '使用状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									type: params.row.status === 1 ? '' : 'danger'
								} // 组件的props
							}, params.row.status === 1 ? '启用' : '禁用')
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
											this.end(params.row)
										}
									}
								}, params.row.status == 2 ? '启用' : '禁用'),
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
		mounted() {
			this.getProductionLine();
		},
		methods: {
			handleEnter(value) {
				this.lineNumber = value;
			},
			handleBlur(value) {
				const tableDate = [];
				this.tableDable.map((item, index) => {
					item.isEdit = false,
						tableDate.push(item);
					this.tableDable = tableDate;
				})
			},
			handleChange(row) {
				let api = this.$Api.manage_editProductLine;
				this.$Axios.post(api, {
					id: row.id,
					productLineName: this.lineNumber,
					productLineCode: row.status,
					factoryId: this.ruleForm.factoryId
				}).then((res) => {
					if (res.success) {
						this.$message({
							message: res.data,
							type: 'success'
						})
						this.getProductionLine();
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},		
			submitForm(formName) {
				if (formName == "searchParams") {
					this.getProductionLine();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = this.$Api.manage_createProductLine;
							this.$Axios.post(api, this.ruleForm).then((res) => {
								if (res.success) {
									this.$message({
										message: res.data,
										type: 'success'
									});
									this.dialogFormVisible = false;
									this.getProductionLine();
								} else {
									this.$message({
										message: res.message,
										type: 'warning'
									});
								}
							})
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						productLineName: null,
						productLineCode: null
					}
					this.getProductionLine();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			add() {
				this.dialogFormVisible = true;
				this.activeName = "新建产线";
				this.searchParams = {
					productLineName: null,
					productLineCode: null
				}
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})
			},
			edit(row) {
				this.lineNumber = row.productLineName;
				const tableDate = [];
				this.editId = row.id;
				this.tableDable.map((item, index) => {
					if (item.id == row.id) {
						item.isEdit = true,
							tableDate.push(item);
					} else {
						tableDate.push(item);
					}
					this.tableDable = tableDate;
				})
			},
			end(row) {
				let activeName = row.status == 2 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该工厂产线?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_productLineUpdateStatus, {
						id: row.id,
						status: row.status == 2 ? 1 : 2,
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getProductionLine();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			delete(row) {
				this.$confirm('确定要删除该工厂产线?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_productLineDelete, {
						id: row.id,
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getProductionLine();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			getProductionLine() {
				let that = this;
				let api = that.$Api.manage_getProductLinePageList;
				this.$Axios.get(api, {
					params: {
						pageNum: that.page,
						pageSize: that.limit,
						factoryId: that.$route.params.id,
						status:null,
						...that.searchParams
					}
				}).then((res) => {
					that.loading = false;
					if (res.success) {
						that.tableDable = res.data;
						that.total = res.total;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			}
		}
	}
</script>

<style lang="scss">
	.productLine {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
		}
	}
</style>
