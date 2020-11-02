<template>
	<div class="factoryManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="工厂列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新建工厂" @add="add"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="factoryList"  :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getfactoryList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="工厂名称" prop="factoryName">
					<el-input v-model.trim="ruleForm.factoryName" placeholder="请输入工厂名称" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="工厂代码" prop="factoryCode">
					<el-input v-model.trim="ruleForm.factoryCode" placeholder="请输入工厂代码" autocomplete="off" clearable></el-input>
				</el-form-item>
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
					}
				],
				loading:true,
				activeName: "新建工厂",
				dialogFormVisible: false,
				rules: {
					factoryName: [{
						required: true,
						message: '请输入工厂名称',
						trigger: 'blur'
					}],
					factoryCode: [{
						required: true,
						message: '请选择工厂代码',
						trigger: 'blur'
					}],
				},
				ruleForm: {
					factoryName: "",
					factoryCode: "",
				},
				searchList: [{
						label: "工厂名称",
						prop: "factoryName",
						type: 'input',
					},
					{
						label: "工厂代码",
						prop: "factoryCode",
						type: 'input',
					},
					{
						label: "使用状态",
						prop: "status",
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
					factoryName: null,
					factoryCode: null,
					status: null
				},
				factoryList:[],
				columns: [{
						prop: 'factoryName',
						label: '工厂名称',
						align: 'left',
					},
					{
						prop: 'factoryCode',
						label: '工厂代码',
						align: 'left',
					},
					{
						prop: 'lineCount',
						label: '产线数',
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
									type: params.row.status ===1 ? '' : 'danger'
								} // 组件的props
							}, params.row.status ===1 ? '启用' : '禁用')
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
									style: {
										textDecoration: "none"
									},
									on: {
										click: () => {
											this.detail(params.row);
										}
									}
								}, "产线管理"),
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
											console.log()
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
				editId:"",
				total:0, //数据总条数
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
			this.getfactoryList();
		},
		methods: {
			submitForm(formName) {
				if (formName == "searchParams") {
					this.getfactoryList();
					
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api="";
							if (this.activeName == "新建工厂") {
								api = this.$Api.manage_factoryCreate;							
							} else {
                               api = this.$Api.manage_factoryEdit;	
							   this.ruleForm.id=this.editId;
							}
							this.$Axios.post(api,this.ruleForm).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
								this.dialogFormVisible = false;
								this.getfactoryList();
								} else {
									this.$message({
										message: res.message,
										type: 'warning'
									});
								}
							})
						}else {
							console.log('error submit!!');
							return false;
						}
					});
				}

			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						factoryName: null,
						factoryCode: null,
						status: null
					}
					this.getfactoryList();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			add(){
				this.dialogFormVisible = true;
				this.activeName = "新建工厂";
				this.ruleForm = {
						factoryName: null,
						factoryCode: null,
				}
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})
			},
			detail(row) {
				this.$router.push("/productionLine/"+row.id+"/"+row.status+"/"+row.factoryName)
			},
			edit(row) {
				this.dialogFormVisible = true;
				this.activeName = "编辑工厂";
				this.editId=row.id;
				this.ruleForm = {
					factoryName: row.factoryName,
					factoryCode: row.factoryCode,
				}
			},
			end(row) {
				let activeName = row.status == 2 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该工厂?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_factoryUpdateStatus, {
						id:row.id,
						status: row.status == 2 ? 1 : 2,
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getfactoryList();
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
				this.$confirm('确定要删除该工厂?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {			
					this.$Axios.post(this.$Api.manage_factoryDelete,{
						id:row.id
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getfactoryList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					}).catch((res) => {});
				})
			},
			getfactoryList() {
				let api = this.$Api.manage_factoryManage;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading=false;
					if (res.success) {					
						this.factoryList=res.data;
						this.total=res.total;					
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
