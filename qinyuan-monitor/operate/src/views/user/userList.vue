<template>
	<div class="factoryManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="用户列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="编辑次数" @add="editNum"></search>
			<table-page :tableDable="tableDable" :columns="columns" @changeTableSort="changeTableSort" ></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"  @pagination="getUseList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogActiveNumsVisible">
			<el-form :model="ruleForm" status-icon :rules="activateRules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="用户默认激活次数" prop="activationNumber">
					<el-input v-model="ruleForm.activationNumber" min="2" type="number" placeholder="请输入激活次数" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
					<el-button @click="resetForm('ruleForm')">取消</el-button>
				</el-form-item><strong></strong>
			</el-form>
		</el-dialog>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogEditVisible">
			<el-form :model="userForm" status-icon :rules="userRules" ref="userForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名称" prop="name">
					<el-input v-model="userForm.name" placeholder="请输入用户名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="userForm.phone" placeholder="请输入手机号码" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户性别" prop="gender">
					<el-select v-model="userForm.gender" placeholder="请选择用户性别">
						<el-option label="男" value="1"></el-option>
						<el-option label="女" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="可激活次数" prop="count">
					<el-input type="number" v-model="userForm.count" min="1" placeholder="请输入激活次数" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('userForm')">确认</el-button>
					<el-button @click="resetForm('userForm')">取消</el-button>
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
			let checkPhone = (rule, value, callback) => {
				const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
				if (!value) {
					return callback(new Error('电话号码不能为空'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('电话号码格式不正确'))
						}
					}
				}, 100)
			}
			let checkNum = (rule, value, callback) => {

				if (!value) {
					return callback(new Error('请输入激活次数'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入整数'))
					} else {
						callback()
					}
				}, 100)
			}
			return {
				navigation: [{
						name: "用户管理",
						path: ""
					},
					{
						name: "用户列表",
						path: ""
					}
				],
				activeName: "编辑次数",
				dialogEditVisible: false,
				dialogActiveNumsVisible: false,
				userRules: {
					name: [{
						required: true,
						message: '请输入用户名称',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
					gender: [{
						required: true,
						message: '请选择用户性别',
						trigger: 'change'
					}],
					count: [{
						required: true,
						validator: checkNum,
						trigger: 'blur'
					}],
				},
				ruleForm: {
					activationNumber:2,
				},
				userForm: {
					name: null,
					phone: null,
					gender: null,
					count: null,
				},
				activateRules: {
					activationNumber: [{
						required: true,
						validator: checkNum,
						trigger: 'blur'
					}]
				},
				searchList: [{
						label: "用户名称",
						prop: "name",
						type: 'input',
					},
					{
						label: "手机号码",
						prop: "phone",
						type: 'input',
					},
					{
						label: "可激活设备数",
						prop: "activationRemain",
						type: 'input',
						typeMethod:'number',
						min:0,
					}
				],
				searchParams: {
					name: null,
					phone: null,
					activationRemain: null,
				},
				tableDable: [],
				columns: [{
						prop: 'name',
						label: '用户名称',
						align: 'left',
					},
					{
						prop: 'phone',
						label: '手机号码',
						align: 'left',
					},
					{
						prop: 'gender',
						label: '性别',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.gender == "1" ? "男" : "女")
						}
					},
					{
						prop: 'activationTotalDesc',
						label: '激活次数',
						sortable: "custom",
						align: 'left',
						render: (h, params) => {
							return h('span', (params.row.activationNumber == null ? 0 : params.row.activationNumber) + "/" + (params.row.activationTotalCount ==
								null ? "0" : params.row.activationTotalCount))
						}
					},
					{
						label: '操作',
						width: 100,
						align: 'center',
						operates: [{
								label: '编辑',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.edit(row)
								}
							},
							// {
							// 	label: '删除',
							// 	type: 'primary',
							// 	disabled: false,
							// 	method: (index, row) => {
							// 		this.delete(index, row)
							// 	}
							// },
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
			this.getUseList();
		},
		methods: {
			changeTableSort(val){
				this.searchParams.activationTotalDesc=val==null?null:val=="ascending"?false:true;
				this.getUseList();
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page = 1;
					this.limit = 10;	
					if(!Number.isInteger(Number(this.searchParams.activationRemain))){
						this.$message({
							message: '可激活设备数不为整数',
							type: 'warning'
						});
						return false;
					}			
					this.getUseList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = "";
							let data = "";
							if (this.activeName == "编辑次数") {
								api = this.$Api.manage_user_updateDefaultActivationTotalNumber;
								data = {
									count: this.ruleForm.activationNumber
								};
							} else {
								if (this.userForm.count < this.userForm.activationNumber) {
									this.$message({
										message: '可激活次数不能小于已激活次数',
										type: 'warning'
									});
									return false;
								}
								api = this.$Api.manage_user_update;
								this.userForm.id = this.editId;
								data = this.userForm;
							}
							this.$Axios.post(api, data).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogActiveNumsVisible = false;
									this.dialogEditVisible = false;
									this.getUseList();
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
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						name: null,
						phone: null,
						activationRemain: null,
					}
					this.page = 1;
					this.limit = 10;
					this.getUseList();
				} else {
					this.$refs[formName].resetFields();
					this.dialogActiveNumsVisible = false;
					this.dialogEditVisible = false;
				}
			},
			editNum() {
				this.activeName= "编辑次数";
				this.ruleForm.activationNumber = 2;
				this.dialogActiveNumsVisible = true;
			},
			edit(row) {
				this.dialogEditVisible = true;
				this.activeName = "编辑用户";
				this.editId = row.id;
				this.userForm = {
					name: row.name,
					phone: row.phone,
					gender: row.gender,
					count: row.activationTotalCount == null ? 0 : row.activationTotalCount,
					activationNumber: row.activationNumber== null ? 0 : row.activationNumber,
				}
			},
			delete(index, row) {
				this.$confirm('确定要删除该用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_user_delete, {
						id: row.id,
						name:row.name,
					}).then((res) => {
						if (res.success) {
							this.$message.success("删除成功");
							this.getUseList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			getUseList() {
				let api = this.$Api.manage_user_list;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.tableDable = res.data.list;
						this.total = res.data.total;
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
		}
	}
</style>
