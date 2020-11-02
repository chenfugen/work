<template>
	<div class="digitalManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="发送任务"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="发送数码" @add="send"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getDigitalSendList" />
		</div>

		<el-dialog :title="activeName" width="30%" :visible.sync="dialogShowVisible">
			<el-form :model="sendForm" status-icon :rules="sendRules" ref="sendForm" label-width="100px" class="demo-ruleForm">				
				<span v-if="activeName=='发送数码'">
					<el-form-item label="供应商" prop="supplierId">
						<el-select class="select" v-model="sendForm.supplierId" placeholder="请选择供应商">
							<el-option v-for="(item,index) in supplierList" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发送数量" prop="count">
						<el-input placeholder="请输入发送的数量" type="number" min="1" v-model="sendForm.count"></el-input>
					</el-form-item>
					<el-form-item label="备注信息" prop="remarks">
						<el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="sendForm.remarks"></el-input>
					</el-form-item>
				</span>
				<span v-else>			
					<el-form-item label="供应商:">
						<span>{{supplierName}}</span>
					</el-form-item>
					<el-form-item label="发送数量:">
						<span>{{sendForm.count}}</span>
					</el-form-item>
					<el-form-item label="备注信息:">
						<span>{{sendForm.remarks}}</span>
					</el-form-item>
				</span>
				<el-form-item label="解压密钥:">
					<span class="zipCipher">{{sendForm.zipCipher}}</span>
					<p class="hint">
						（请复制或者另外的方式记录该解压密码，并且在安全的环境下告知您需要提供的供应商）
					</p>
				</el-form-item>
				<el-form-item v-if="activeName=='发送数码'">
					<el-button type="primary" @click="submitForm('sendForm')">确认</el-button>
					<el-button @click="resetForm('sendForm')">取消</el-button>
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
			let checkNum = (rule, value, callback) => {
			
				if (!value) {
					return callback(new Error('请输入发送的数量'))
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
						name: "数码管理",
						path: ""
					},
					{
						name: "数码发送",
						path: ""
					}
				],
				activeName: "发送数码",
				supplierName:"",
				dialogShowVisible: false,
				sendTime:null,
				sendForm: {
					supplierId: null,
					remarks: null,
					count: null,
					zipCipher: null
				},
				sendRules: {
					supplierId: [{
						required: true,
						message: '请选择供应商',
						trigger: 'change'
					}],
					count: [{
						required: true,
						validator: checkNum,
						trigger: 'blur'
					}],
					remarks: [{
						required: true,
						message: '请输入备注信息',
						trigger: 'blur'
					}],
				},
				searchList: [{
						label: "发送人",
						prop: "operatorId",
						type: 'select',
						filterable: true,
						options: []
					},
					{
						label: "供应商",
						prop: "supplierId",
						type: 'select',
						filterable: true,
						options: []
					},				
					{
						label: "",
						prop: "sendTime",
						type: 'daterange',
					},					
					{
						label: "数码数量",
						prop: "count",
						type: 'input',
						typeMethod: 'number',
						min: 0,
					},
					{
						label: "备注信息",
						prop: "remarks",
						type: 'input',
					},
					{
						label: "发送状态",
						prop: "status",
						type: 'select',
						options: [{
								label: "生成中",
								value: 1
							}, {
								label: "生成失败",
								value: 2
							}, {
								label: "发送中",
								value: 3
							},
							{
								label: "发送失败",
								value: 4
							},
							{
								label: "发送成功",
								value: 5
							}
						]
					}
				],
				searchParams: {
					supplierId: null,
					operatorId: null,
					count: null,
					sendTime: null,
					startTime: null,
					endTime: null,
					remarks: null,
					status: null,
				},
				tableDable: [],
				supplierList: [],
				columns: [{
						prop: 'count',
						label: '数码数量',
						align: 'left',
					},
					{
						prop: 'supplierName',
						label: '供应商',
						align: 'left',
					},
					{
						prop: 'jointPerson',
						label: '对接人',					
						align: 'left',			
					},
					{
						prop: 'sendTime',
						label: '发送时间',
						sortable: true,
						width: 160,
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.sendTime))
						}
					},
					{
						prop: 'operator',
						label: '发送人',
						align: 'left',
					},
					{
						prop: 'status',
						label: '发送状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
									props: {
										effect: "dark",
										size: 'mini',
										type: params.row.status === 1 ? '' : params.row.status === 2 ? 'warning' : params.row.status === 3 ?
											'primary' : params.row.status === 4 ? 'danger' : 'success'
									} // 组件的props
								}, params.row.status === 1 ? '生成中' : params.row.status === 2 ? '生成失败' : params.row.status === 3 ? '发送中' :
								params.row.status === 4 ? '发送失败' : '发送成功')
						}
					},
					{
						prop: 'remarks',
						label: '备注信息',
						align: 'left',
					},
					{
						label: '操作',
						width: 250,
						align: 'left',
						fixed: "right",
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									style: {
										display: params.row.status == 2 ? 'inline-block' : 'none',
									},
									on: {
										click: () => {
											this.retry(params.row)
										}
									}
								}, '重试'),
								h('el-link', {
									props: {
										type: 'primary',
									},
									style: {
										display: params.row.status > 2 ? 'inline-block' : 'none',
									},
									on: {
										click: () => {
											this.anewSend(params.row)
										}
									}
								}, '重新发送'),
								h('span', {
									style: {
										display: params.row.status > 1 ? 'inline-block' : 'none',
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
										display: params.row.status > 2 ? 'inline-block' : 'none',
									},
									on: {
										click: () => {
											this.download(params.row)
										}
									}
								}, '下载数码'),
								h('span', {
									style: {
										display: params.row.status > 2 ? 'inline-block' : 'none',
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
										display: params.row.status > 2 ? 'inline-block' : 'none',
									},
									on: {
										click: () => {
											this.check(params.row)
										}
									}
								}, '查看密钥'),
							]);
						}
					}
				],
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
			this.getDigitalSendList();
			this.getSenderList();
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
			digitalsend(api, data) {
				this.$Axios.post(api, data).then((res) => {
					if (res.success) {
						this.$message({
							message: "操作成功",
							type: 'success'
						});
						this.dialogShowVisible = false;
						this.getDigitalSendList();
					} else {
						if (this.activeName != "发送数码") {
							this.$confirm(res.msg, '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								let parms = {
									id: data.id,
									force: true,
								}
								this.$Axios.post(api, parms).then((res) => {
									if (res.success) {
										this.$message({
											message: "操作成功",
											type: 'success'
										});
										this.dialogShowVisible = false;
										this.getDigitalSendList();
									} else {
										this.$message({
											message: res.msg,
											type: 'warning'
										});
									}
								})
							}).catch((res) => {});
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
							this.dialogShowVisible = false;
						}
					}
				})
			},
			retry(row) {
				let api = this.$Api.manage_number_retry;
				let data = {
					id: row.id,
					force: false,
				}
				this.digitalsend(api, data);
			},
			anewSend(row) {
				this.$confirm('确定要重新发送吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_number_resend;
					let data = {
						id: row.id,
						force: false,
					}
					this.digitalsend(api, data);
				}).catch((res) => {});
			},
			send() {
				this.activeName = "发送数码";
				this.sendForm = {
					supplierId: null,
					remarks: null,
					count: null,
				};
				let Num = "";
				for (let i = 0; i < 6; i++) {
					Num += Math.floor(Math.random() * 10);
				}
				this.sendForm.zipCipher = Num;
				this.dialogShowVisible = true;
				this.$nextTick(() => {
					this.$refs["sendForm"].resetFields();
				})
			},
			submitForm(formName) {
				if (formName == "searchParams") {	
					console.log(this.searchParams.sendTime)
					if (this.searchParams.sendTime) {	
						this.sendTime=this.searchParams.sendTime;
						this.searchParams.startTime = this.searchParams.sendTime[0];
						this.searchParams.endTime = this.searchParams.sendTime[1];
						delete this.searchParams.sendTime;
					}else if(this.searchParams.sendTime===undefined){
						this.searchParams.startTime = this.sendTime[0];
						this.searchParams.endTime = this.sendTime[1];
					}else if(this.searchParams.sendTime===null){		
						this.searchParams.startTime = null;
						this.searchParams.endTime = null;			
					}
					this.page = 1;
					this.limit = 10;
					this.getDigitalSendList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = "";
							let data = "";
							if (this.activeName == "发送数码") {
								api = this.$Api.manage_number_send;
								data = this.sendForm;
							} else {
								api = this.$Api.manage_number_resend;
								data = {
									id: this.editId,
									force: false,
								}
							}
							this.digitalsend(api, data);
						}
					})
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						supplierId: null,
						operatorId: null,
						count: null,
						sendTime: null,
						startTime: null,
						endTime: null,
						remarks: null,
						status: null,
					}
					this.getDigitalSendList();
				} else {
					this.$refs[formName].resetFields();
					this.dialogShowVisible = false;
				}
			},
			download(row) {
				this.activeName = "下载数码";
				this.$cookies.set("fileName", row.supplierName);
				const loading = this.$loading({
					lock: true,
					text: '下载中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let api = this.$Api.manage_number_download
				this.$Download.get(api, {
					params: {
						filename: row.filename
					}
				}).then((res) => {
					loading.close();
					this.$message({
						message: res.msg,
						type: 'success'
					});
				}).catch((res) => {
					loading.close();
				});
			},
			check(row) {
				this.activeName = "查看密钥";
				this.supplierList.forEach((item,index)=>{
					if(item.id==row.supplierId){
						this.supplierName=item.name
					}
				})			
				this.sendForm = {
					remarks: row.remarks,
					count: row.count,
					zipCipher: row.zipCipher
				};
				this.dialogShowVisible = true;
			},
			getSenderList() {
				let api = this.$Api.manage_userAccountList;
				this.$Axios.get(api, {
					params: {
						pageNum: 1,
						pageSize: 0,
					}
				}).then((res) => {
					if (res.success) {
						let list = [];
						let data = res.data.data;
						for (let i in data) {
							list[i] = {
								label: data[i].username,
								value: data[i].id,
							}
						}
						this.searchList[0].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getSupplierList() {
				let api = this.$Api.manage_supplierManage_list;
				this.$Axios.get(api, {
					params: {
						pageNum: 1,
						pageSize: 100,
					}
				}).then((res) => {
					if (res.success) {
						let list = [];
						let data = res.data.data;
						for (let i in data) {
							list[i] = {
								label: data[i].name,
								value: data[i].id,
							}
						}
						this.supplierList = data;
						this.searchList[1].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getDigitalSendList() {
				let api = this.$Api.manage_number_list;
				this.$Axios.get(api, {
					params: {
						page: this.page,
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
	.digitalManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
		}

		.zipCipher {
			letter-spacing: 4px;
			font-size: 25px;
		}

		.hint {
			color: #F06431;
			font-size: 12px;
			line-height: 20px;
		}
	}
</style>
