<template>
	<div class="resetLog">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="复位记录"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getactivatelog" />
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
				navigation: [{
						name: "客户服务",
						path: "/customerService"
					},
					{
						name: "复位记录",
						path: ""
					}
				],
				searchList: [{
						label: "滤芯数码",
						prop: "filterCode",
						type: 'input',
					},
					{
						label: "用户号码",
						prop: "userPhone",
						type: 'input',
					},
					{
						label: "滤芯型号",
						prop: "erpItemCode",
						type: 'select',
						filterable: true,
						options: []
					}, {
						label: "操作",
						prop: "operateType",
						type: 'select',
						options: [{
							label: "复位",
							value: "ACTIVATE   "
						}, {
							label: "反复位",
							value: "ANTI_ACTIVATE"
						}]
					},
					{
						label: "方式",
						prop: "operateSource",
						type: 'select',
						options: [{
							label: "小程序",
							value: "MINI_PROGRAM"
						}, {
							label: "客服中心",
							value: "CUSTOMER_SERVICE"
						}]
					}
				],
				searchParams: {
					filterCode: this.$route.params.id,
					erpItemCode: null,
					userPhone: null,
					operateType: null,
					operateSource: null,
				},
				tableDable: [],
				columns: [{
						prop: 'encNumber',
						label: '滤芯数码',
						align: 'left',
						width: 230
					},
					{
						prop: 'numberFilterName',
						label: '滤芯型号',
						align: 'left',
						width: 150,
						render: (h, params) => {
							return h('span', params.row.numberFilterName == null || params.row.numberFilterName == 'universal' ? "万能产品" :
								params.row.numberFilterName)
						}
					},
					{
						prop: 'sn',
						label: '设备SN',
						align: 'left',
						width: 200
					},
					{
						prop: 'phone',
						label: '用户号码',
						align: 'left',
						width: 150
					},
					{
						prop: 'type',
						label: '操作',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.type === 1 ? '' : 'primary'
								}
							}, params.row.type === 1 ? '复位' : '反复位')
						}
					},
					{
						prop: 'operateTime',
						label: '操作时间',
						align: 'left',
						sortable: true,
						width: 160,
						render: (h, params) => {
							return h('span', this.formatDate(params.row.operateTime))
						}
					},
					{
						prop: 'operateFilterName',
						label: '复位型号',
						align: 'left',
					},
					{
						prop: 'operateSource',
						label: '方式',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.operateSource === 1 ? '小程序' : '客服中心')
						}
					},
					{
						prop: 'dataSource',
						label: '数据来源',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.dataSource === 1 ? '产测' : params.row.dataSource === 2 ? '客服中心' : '小程序')
						}
					},
					{
						label: '操作',
						width: 200,
						align: 'left',
						fixed: "right",
						operates: [{
							label: '重发复位码',
							type: 'primary',
							method: (index, row) => {
								this.send(row)
							}
						}]
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
			this.getactivatelog();
			this.getERPlist();
		},
		methods: {
			getERPlist() {
				let api = this.$Api.manage_getErpCodeList;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						let list = [];
						for (let i in res.data) {
							list[i] = {
								label: res.data[i].itemName + '（' + res.data[i].itemCode + '）',
								value: res.data[i].itemCode,
							}
						}
						list.unshift({
							label: '万能产品',
							value: '',
						})
						this.searchList[2].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			formatDate: res => {
				if (res == "" || res == undefined || res == null) {
					return "--";
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
			send(row) {
				this.$confirm('确定要重发复位码吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_customer_sendFilterActiveCode;
					this.$Axios.post(api, {
						filterCode: row.encNumber,
						identityId: row.mac,
						productKey: row.pk,
						deviceFilterId: row.identifier,
						sncode: row.sn,
						userPhone: row.phone,
						taskId: row.orderId,
						erpCode: row.erpItemCode,
						erpName: row.operateFilterName,
					}).then((res) => {
						if (res.success) {
							this.$confirm('<p style="font-size:25px;font-weight: bold">' + res.data.activeCode + '</p>', '复位8位码', {
								confirmButtonText: '确定',
								showCancelButton: false,
								type: 'success',
								center: true,
								dangerouslyUseHTMLString: true
							}).then(() => {

							})
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch(() => {});
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page = 1;
					this.limit = 10;
					if (this.searchParams.filterCode) {
						this.getactivatelog();
					} else {
						this.tableDable = [];
						this.total = 0;
					}
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						filterCode: this.$route.params.id,
						erpItemCode: null,
						userPhone: null,
						operateType: null,
						operateSource: null,
					}
					this.page = 1;
					this.limit = 10;
					this.getactivatelog();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			getactivatelog() {
				let api = this.$Api.manage_customer_getFilterActiveRecordList;
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
			}
		}
	}
</script>

<style lang="scss">
	.resetLog {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
		}
	}
</style>
