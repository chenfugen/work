<template>
	<div class="factoryManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="工装机列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新增设备" @add="add"></search>
			<table-page :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getDevice" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="设备SN" prop="snCode">
					<el-input v-model.trim="ruleForm.snCode" placeholder="请输入设备SN码" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
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
						name: "工装机列表",
						path: ""
					}
				],
				activeName: "新增设备",
				dialogFormVisible: false,
				rules: {
					snCode: [{
						required: true,
						message: '请输入设备SN码',
						trigger: 'blur'
					}],
				},
				ruleForm: {
					snCode: "",
				},
				searchList: [{
					label: "设备SN",
					prop: "snCode",
					type: 'input',
				}],
				searchParams: {
					snCode: null,
				},
				tableDable: [],
				snCode: "",
				columns: [{
						prop: 'snCode',
						label: '设备SN',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('el-input', {
									props: {
										placeholder: "请修改后回车",
										value: this.snCode
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
										change: (value) => {
											this.handleChange(params.row)
										},
									}
								}),
								h('span', {
									style: {
										display: params.row.isEdit ? 'none' : 'block'
									}
								}, params.row.snCode)
							])
						}
					},
					{
						label: '操作',
						width: 200,
						align: 'center',
						operates: [{
								label: '编辑',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.edit(index, row)
								}
							},
							{
								label: '删除',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.delete(index, row)
								}
							}
						]
					}
				],
				total: 3, //数据总条数
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
			this.getDevice();
		},
		methods: {
			submitForm(formName) {
				if (formName == "searchParams") {
					this.getDevice();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = this.$Api.manage_machineConfigcreate;							
							this.$Axios.post(api, this.ruleForm).then((res) => {
								if (res.success) {
									this.$message({
										message: res.data,
										type: 'success'
									});
									this.dialogFormVisible = false;
									this.getDevice();
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
						snCode: null,
					}
					this.getDevice();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			handleEnter(value) {			
				this.snCode = value;
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
				let api = this.$Api.manage_machineConfigEdit;
				this.$Axios.post(api, {
					id: row.id,
					snCode: this.snCode,
				}).then((res) => {
					if (res.success) {
						this.$message({
							message: res.data,
							type: 'success'
						});
						this.getDevice();
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			add() {
				this.dialogFormVisible = true;
				this.activeName = "新建设备";
				this.searchParams = {
					snCode: null,
				}
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})
			},
			edit(index, row) {
				this.snCode = row.snCode;
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
			delete(index, row) {
				this.$confirm('确定要删除该工装机配置?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_machineConfigdelete, {
						id: row.id,
						snCode: row.snCode,
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getDevice();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			getDevice() {
				let that = this;
				let api = that.$Api.manage_getFrockDevicePageList;
				this.$Axios.get(api, {
					params: {
						pageNum: that.page,
						pageSize: that.limit,
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
	.factoryManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
		}
	}
</style>
