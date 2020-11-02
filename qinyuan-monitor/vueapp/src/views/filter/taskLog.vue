<template>
	<div class="taskOrder">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="生产记录"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getTaskLog" />
		</div>
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
				loading: true,
				navigation: [{
						name: "滤芯产测",
						path: ""
					},
					{
						name: "生产记录",
						path: ""
					}
				],
				factoryList: [],
				searchList: [{
						label: "产品型号",
						prop: "erpCode",
						type: 'select',
						filterable: true,
						options:[]
					},					
					{
						label: "工单号",
						prop: "orderCode",
						type: 'input',
					},
					{
						label: "滤芯数码",
						prop: "filterCode",
						type: 'input',
					},
					{
						label: "检测状态",
						prop: "checkStatus",
						type: 'select',
						options: [{
							label: "成功",
							value: 1
						}, {
							label: "失败",
							value: 0
						}]
					},
					{
						label: "数码状态",
						prop: "status",
						type: 'select',
						options: [{
							label: "未生产",
							value: 100
						}, {
							label: "生产中",
							value: 200
						}, {
							label: "已生产",
							value: 300
						}]
					}
				],
				searchParams: {
					erpName: null,
					erpCode: null,
					orderCode: null,
					filterCode: null,
					checkStatus: null,
					status:null
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
					},
					{
						prop: 'encrNumber',
						label: '滤芯数码',
						align: 'left',
						width: 250
					},
					{
						prop: 'checkTime',
						label: '生产时间',
						sortable: true,
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.checkTime))
						}
					},
					{
						prop: 'checkStatus',
						label: '检测状态',
						align: 'center',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									size: 'mini',
									effect: 'dark',
									type: params.row.checkStatus == 1 ? '' : 'danger'
								} // 组件的props
							}, params.row.checkStatus == 1 ? '成功' : '失败')
						}
					},
					{
						prop: 'status',
						label: '数码状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
								type: params.row.checkStatus === 1 ? 'success':params.row.failCode==="622"?'warning':'danger'
									} //组件的props
								}, params.row.checkStatus == 1 ? '已生产':params.row.failCode==="622"?'重复检测':'非法数码')
						}
					}, {
						label: '操作',
						width: 200,
						align: 'left',
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
								}, "进入"),
								h('span', {
									style: {
										display: params.row.checkStatus == 1 && params.row.status == 200 ? "inline-block" : "none",
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
										display: params.row.checkStatus == 1 && params.row.status == 200 ? "inline-block" : "none",
									},
									on: {
										click: () => {
											this.end(params.row)
										}
									}
								}, '复位至待生产')
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
			this.getTaskLog();
			this.getErpCodeList();
		},
		methods: {
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
			submitForm(formName) {
				if (formName == "searchParams") {
					this.getTaskLog();
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						erpCode: null,
						orderCode: null,
						filterCode: null,
						checkStatus: null
					}
					this.getTaskLog();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			handleSelectionChange(val) {
				console.log('val:', val)
			},
			detail(row) {
				this.$router.push("/taskLogDetail/" + row.id + "/" + row.taskId)
			},
			end(row) {
				this.$confirm('确定要将该记录复位至待生产?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_reset;
					this.$Axios.post(api, {
						taskId: row.taskId,
						filterCode: row.encrNumber,
						source: 1,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: "操作成功",
								type: 'success'
							});
							this.getTaskLog();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch(() => {});
			},
			getErpCodeList() {
				let api = this.$Api.manage_getErpCodeList;
				this.$Ax.get(api,{
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						let list = [];
						for (let i in res.data) {
							list[i] = {
								label: res.data[i].itemName+res.data[i].itemCode,
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
			getTaskLog() {
				let api = this.$Api.manage_record;				
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					if (res.success) {
						this.loading = false;
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
