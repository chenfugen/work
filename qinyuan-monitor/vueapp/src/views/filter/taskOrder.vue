<template>
	<div class="taskOrder">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="工单列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="新建工单" @add="add"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="gettaskList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="工单号" prop="orderCode">
					<el-input v-model.trim="ruleForm.orderCode" placeholder="请输入工单号" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="生产工厂" prop="factoryId">
					<el-select class="select" v-model="ruleForm.factoryId" placeholder="请选择所属工厂" @change="changeFactory" :disabled="disabled">
						<el-option v-for="(item,index) in factoryList"  :key="index" v-if="item.status==1" :label="item.factoryName" :value="item.factoryId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="生产产线" prop="productLineId">
					<el-select class="select" v-model="ruleForm.productLineId" placeholder="请选择所属产线" :disabled="disabled">
						<el-option v-for="item in productionLineList"  :key="item.value" v-if="item.status==1" :label="item.lineName" :value="item.lineId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="生产型号" prop="erpCode">
					<el-select class="select" v-model="ruleForm.erpCode" filterable placeholder="请选择生产型号">
						<el-option v-for="item in ERPList" :key="item.itemCode" :label="item.itemName+'（'+item.itemCode+'）'" :value="item.itemCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="生产数量" prop="planTotal">
					<el-input v-model.number="ruleForm.planTotal" type='number' min="0" placeholder="输入生产数量" autocomplete="off" clearable></el-input>
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
				dialogFormVisible: false,
				activeName: "新建工单",
				loading: true,
				disabled:false,
				rules: {
					orderCode: [{
						required: false,
						message: '请输入工单号',
						trigger: 'blur'
					}],
					factoryId: [{
						required: true,
						message: '请选择生产工厂',
						trigger: 'change'
					}],
					productLineId: [{
						required: true,
						message: '请选择生产产线',
						trigger: 'change'
					}],
					erpCode: [{
						required: true,
						message: '请选择生产模型',
						trigger: 'change'
					}],
					planTotal: [{
						required: false,
						message: '请输入生产数量',
						trigger: 'blur'
					}]
				},
				ruleForm: {
					orderCode: "",
					factoryId: "",
					productLineId: "",
					erpCode: "",
					repeatStatus: 1,
					planTotal: 0
				},
				navigation: [{
						name: "滤芯产测",
						path: ""
					},
					{
						name: "任务工单",
						path: ""
					}
				],
				factoryList: [],
				ERPList: [],
				productionLineList: [],
				searchList: [{
						label: "产品型号",
						prop: "erpCode",
						type: 'select',
						filterable: true,
						options: []
					},
					{
						label: "工单号",
						prop: "orderCode",
						type: 'input',
					},
					{
						label: "状态重码",
						prop: "repeatStatus",
						type: 'select',
						options: [{
							label: "允许重码",
							value: 2
						}, {
							label: "不允许重码",
							value: 1
						}]
					},
					{
						label: "生产状态",
						prop: "status",
						type: 'select',
						options: [{
							label: "未生产",
							value: 1
						}, {
							label: "生产中",
							value: 2
						}, {
							label: "结束",
							value: 3
						}]
					},
					{
						label: "产线选取",
						prop: "productLineId",
						type: 'select',
						filterable: true,
						options: []
					}
				],
				searchParams: {
					erpName: null,
					erpCode: null,
					orderCode: null,
					repeatStatus: null,
					productLineId: null,
					status: null,
				},
				tableDable: [],
				columns: [{
						prop: 'erpName',
						label: '产品型号',
						align: 'left',
					}, {
						prop: 'erpCode',
						label: 'ERP编码',
						align: 'left',
					}, {
						prop: 'orderCode',
						label: '工单号',
						align: 'left',
						render: (h, params) => {
							return h('div', [
								h('span', params.row.orderCode), h('el-tag', {
									props: {
										size: 'mini'
									},
									style: {
										"margin-left": '5px',
										display: params.row.hadRepeat === 1 ? 'inline-block' : 'none'
									}
								}, "重码")
							])
						}
					},
					{
						prop: 'productLineName',
						label: '产线',
						align: 'left',
						width: 160,
						render: (h, params) => {
							return h('span', params.row.factoryName + '（' + params.row.productLineName + '）')
						}
					},
					{
						prop: 'createTime',
						label: '新建时间',
						align: 'left',
						sortable: true,
						width: 160,
						render: (h, params) => {
							return h('span', this.formatDate(params.row.createTime))
						}
					},
					{
						prop: 'lastCheckTime',
						label: '最后检测时间',
						sortable: true,
						align: 'left',
						width: 160,
						render: (h, params) => {
							return h('span', params.row.lastCheckTime == null ? "--" : this.formatDate(params.row.lastCheckTime))
						}
					}, {
						prop: 'finishedTotal',
						label: '进度',
						align: 'left',
						width: 100,
						sortable: true,
						render: (h, params) => {
							return h('span', params.row.finishedTotal == null ? 0 + "/" + params.row.planTotal : params.row.finishedTotal +
								"/" + params.row.planTotal)
						}
					},
					{
						prop: 'repeatStatus',
						label: '重码状态',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.repeatStatus === 2 ? '允许' : '不允许')
						}
					},
					{
						prop: 'status',
						label: '生产状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.status === 1 ? 'info' : params.row.status === 2 ? '' : 'success'
								} // 组件的props
							}, params.row.status === 1 ? '未生产' : params.row.status === 2 ? '生产中' : '结束')
						}
					}, {
						label: '操作',
						width: 200,
						align: 'left',
						fixed: "right",
						operates: [{
								label: '进入',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.detail(index, row)
								}
							},
							{
								label: '编辑',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.edit(index, row)
								}
							},
							{
								label: '结束',
								type: 'primary',
								disabled: false,
								render: (h, params) => {
									return h('span', [
										h('el-link', {
											props: {
												type: 'primary',
											},
											on: {
												click: () => {
													this.end(params.row)
												}
											}
										},  params.row.status == 3 ?'开启':'结束'),
										h('span', {
											style: {
												width: "1px",
												height: "10px",
												margin: "0px 5px",
												background: "#E8E8E8",
											}
										})
									])
								}
							},
							{
								label: '更多',
								type: 'primary',
								disabled: false,
								dropdowns: [{
									name: '删除',
									method: (index, row) => {
										this.delete(index, row)
									}
								}, {
									render: (h, params) => {
										return h('span', params.row.repeatStatus === 2 ? '解除重码' : '允许重码')
									},
									method: (index, row) => {
										this.allow(index, row)
									}
								}]
							}
						]
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
			this.getFactoryList();
			this.gettaskList();
			this.getErpCodeList();
		},
		methods: {
			submitForm(formName) {
				if (formName == "searchParams") {
					this.gettaskList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = ""
							if (this.activeName == "新建工单") {
								api = this.$Api.manage_createTaskOrder;
							} else {
								api = this.$Api.manage_editTaskOrder;
								this.ruleForm.id = this.editId;
							}
							this.$Axios.post(api, this.ruleForm).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogFormVisible = false;
									this.gettaskList();
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
			formatDate(res) {
				let date = new Date(res);
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
				let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
				let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
				let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
				return Y + M + D + h + m + s;
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						erpCode: null,
						orderCode: null,
						repeatStatus: null,
						productLineId: null
					}
					this.gettaskList();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			add() {
				this.dialogFormVisible = true;
				this.actionName = "新建工单";
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})			
			},
			handleSelectionChange(val) {
				console.log('val:', val)
			},
			detail(index, row) {
				this.$router.push("/orderDetail/" + row.id)
			},
			edit(index, row) {
				this.dialogFormVisible = true;
				this.activeName = "编辑工单";
				this.editId = row.id;
				this.disabled=true;
				this.getProductLines(row.factoryId);
				this.ruleForm = {
					orderCode: row.orderCode,
					factoryId: row.factoryId,
					productLineId: row.productLineId,
					erpCode: row.erpCode,
					repeatStatus:row.repeatStatus,
					planTotal: row.planTotal,
				}
			},
			end(row) {
				let status=row.status==3 ?"开启":"结束";
				this.$confirm('确定要'+status+'该工单?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api =row.status==3?this.$Api.manage_TaskOrderOpen:this.$Api.manage_TaskOrderEnd;
					this.$Axios.post(api, {
						id: row.id,
						status:row.status==3?"":3,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: res.data,
								type: 'success'
							});
							this.gettaskList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				})
			},
			delete(index, row) {
				this.$confirm('确定要删除该工单?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_deleteTaskOrder;
					this.$Axios.post(api, {
						id: row.id,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: res.data,
								type: 'success'
							});
							this.gettaskList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch(() => {});
			},
			allow(index, row) {
				let activeName = row.repeatStatus == 2 ? "解除" : "允许";
				this.$confirm('确定要' + activeName + '该工单重码?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_updateRepeatStatus;
					this.$Axios.post(api, {
						id: row.id,
						repeatStatus: row.repeatStatus == 1 ? 2 : 1,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: res.data,
								type: 'success'
							});
							this.gettaskList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch(() => {});
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
						let productList = []
						this.factoryList = res.data;
						for (let i = 0; i < res.data.length; i++) {
							this.$Ax.get(this.$Api.manage_getProductLines, {
								params: {
									factoryId: this.factoryList[i].factoryId,
									timestamp: this.$store.state.axiosTime,
									userName: this.$cookies.get("username")
								}
							}).then((res) => {
								if (res.success) {
									for (let j = 0; j < res.data.length; j++) {
										productList.push({
											label: this.factoryList[i].factoryName + "（" + res.data[j].lineName + "）",
											value: res.data[j].lineId,
										})
										this.searchList[4].options = productList;
									}
								}
							})
						}
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getProductLines(id) {
				let api = this.$Api.manage_getProductLines;
				this.$Ax.get(api, {
					params: {
						factoryId: id,
						timestamp: this.$store.state.axiosTime,
						userName: this.$cookies.get("username")
					}
				}).then((res) => {
					if (res.success) {
						this.productionLineList = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			changeFactory(value) {
				this.getProductLines(value);
			},
			getErpCodeList() {
				let api = this.$Api.manage_getErpCodeList;
				this.$Ax.get(api,{
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.ERPList = res.data;
						let list = [];
						for (let i in res.data) {
							list[i] = {
								label: res.data[i].itemName + res.data[i].itemCode,
								value: res.data[i].itemCode,
							}
						}
						this.searchList[0].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			gettaskList() {
				let api = this.$Api.manage_getTaskOrderList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.tableDable = res.data;
						this.total = res.total;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
		}
	}
</script>
<style lang="scss">
	.taskOrder {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
		}
	}
</style>
