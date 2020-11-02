<template>
	<div class="emailManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="邮箱列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新增" @add="add"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getEmailList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogShowVisible">
			<el-form :model="emailForm" status-icon :rules="emailRules" ref="emailForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="邮箱地址" prop="mail">
					<el-input placeholder="请输入邮箱地址" v-model="emailForm.mail">
						<!-- <template slot="append">@unilever.com</template> -->
					</el-input>
				</el-form-item>
				<el-form-item label="邮箱密码" prop="password">
					<el-input placeholder="请输入邮箱密码" type="password" v-model="emailForm.password"></el-input>
				</el-form-item>
				<el-form-item >
					<span class="hint">该邮箱地址为系统发送数码邮件的统一出口，请勿随意删除邮箱，变更请联系管理员</span>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('emailForm')">确认</el-button>
					<el-button  @click="resetForm('emailForm')">取消</el-button>
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
						name: "邮箱管理",
						path: ""
					}
				],
				searchList: [{
						label: "邮箱地址",
						prop: "mailAddress",
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
					mailAddress: null,
					status: null,
				},
				tableDable: [],
				columns: [{
						prop: 'mailAddress',
						label: '邮箱地址',
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
				activeName: "新建邮箱",
				emailForm: {
					mail: null,
					password:null,
				},
				emailRules: {
					mail: [{
							required: true,
							message: '请输入邮箱地址',
							trigger: 'blur'
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger:'blur',
						}
					],
					password:[{
							required: true,
							message: '请输入邮箱密码',
							trigger: 'blur'
						}
					],
				},
				editId:null,
				dialogShowVisible: false,
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
			this.getEmailList();
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
						mailAddress: null,
						status: null,
					}
					this.page=1;
					this.limit=10;
					this.getEmailList();
				} else {				
					this.$refs[formName].resetFields();
					this.dialogShowVisible=false;
				}
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page=1;
					this.limit=10;
					this.getEmailList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = "";						
							if (this.activeName =="新增邮箱") {								
								api = this.$Api.manage_mailManage_add;							
							} else {
								api = this.$Api.manage_mailManage_edit;
								this.emailForm.id = this.editId;
								this.emailForm.mailAddress = this.emailForm.mail;					 
							}
							this.$Axios.post(api, this.emailForm).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogShowVisible = false;
									this.getEmailList();
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
			add() {
				this.activeName = "新增邮箱";
				this.dialogShowVisible = true;
				this.editId =null;
				this.$nextTick(() => {
					this.$refs["emailForm"].resetFields();
				})				
			},
			edit(row) {
				this.activeName = "编辑邮箱";
				this.dialogShowVisible = true;
				this.emailForm.mail= row.mailAddress;
				this.emailForm.password= row.pwd;
				this.editId = row.id;						
			},
			end(row) {
				let activeName = row.status == 0 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该邮箱?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_mailManage_changeStatus, {
						id: row.id,
						status: row.status == 0 ? 1 : 0,
						mailAddress:row.mailAddress,
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getEmailList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					}).catch((res) => {});
				})
			},
			delete(row) {
				this.$confirm('确定要删除该邮箱?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_mailManage_delete, {
						id: row.id,
						mailAddress:row.mailAddress,
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getEmailList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					}).catch((res) => {});
				})
			},
			getEmailList() {
				let api = this.$Api.manage_mailManage_list;
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
							message: res.msg,
							type: 'warning'
						});
					}
				}).catch((res) => {
					this.$message({
						message: res.msg,
						type: 'warning'
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	.emailManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
		}
		.hint{
			color:#F06431;
		}
	}
</style>
