<template>
	<div class="resetLog">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="激活记录"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm"></search>
			<table-page :loading="loading" :page="page" :limit="limit" emptyText="暂无数据，请输入信息查询" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getActivateList" />
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
						name: "激活记录",
						path: ""
					}
				],
				searchList: [{
						label: "设备SN",
						prop: "sncode",
						type: 'input',
					},
					{
						label: "设备MAC",
						prop: "identityId",
						type: 'input',
					},
					{
						label: "用户号码",
						prop: "phone",
						type: 'input',
					},
					{
						label: "产品型号",
						prop: "productModel",
						type: 'select',
						filterable: true,
						options: []
					}, {
						label: "操作",
						prop: "operateType",
						type: 'select',
						options: [{
							label: "激活",
							value: "ACTIVATE"
						}, {
							label: "反激活",
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
				searchParams:{
					sncode: this.$route.params.sn==="null" || this.$route.params.sn==="undefined"?"":this.$route.params.sn,
					phone: null,
					productKey:null,
					productModel: null,
					operateType: null,
					operateSource: null,
					identityId:this.$cookies.get("itemIdentifyId").length==20?"":this.$route.params.id,
				},
				tableDable: [],
				columns: [{
						prop: 'sncode',
						label: '设备SN',
						align: 'left',
					},
					{
						prop: 'identityId',
						label: '设备MAC',
						align: 'left',
					},
					{
						prop: 'productModel',
						label: '产品型号',
						align: 'left',
					},
					{
						prop: 'userPhone',
						label: '用户号码',
						align: 'left',
					},
					{
						prop: 'operateType',
						label: '操作方式',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.operateType === "ACTIVATE" ? '' : 'primary'
								}
							}, params.row.operateType === "ACTIVATE" ? '激活' : '反激活')
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
						prop: 'operateSource',
						label: '方式',
						align: 'left',
						render: (h, params) => {
							return h('span', {
								style: {
									color: params.row.operateSource === "CUSTOMER_SERVICE" ? '#1F9AD6' : '#67c23a'
								}
							}, params.row.operateSource === "CUSTOMER_SERVICE" ? '客户服务' : '小程序')
						}
					},
					{
						label: '操作',
						width: 200,
						align: 'left',
						fixed: "right",
						operates: [{
							label: '重发激活码',
							type: 'primary',
							disabled: false,
							method: (index,row) => {
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
			this.getActivateList();
			this.getProductModel();
		},
		methods: {
			getProductModel() {
				let api = this.$Api.manage_getProductList;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						let list = [];
						for (let i in res.data) {
							list[i] = {
								label: res.data[i].productModel,
								value: res.data[i].productModel,
							}
						}
						this.searchList[3].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
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
			send(row) {
				this.$confirm('确定要重发激活码吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_customer_sendDeviceActiveCode;
					this.$Axios.post(api, {
						productKey: row.productKey,
						identityId: row.identityId,
						userPhone: row.userPhone,
						sncode: row.sncode,
					}).then((res) => {
						if (res.success) {
							this.$confirm('<p style="font-size:25px;font-weight: bold">'+res.data.activeCode+'</p>', '激活8位码', {
								confirmButtonText: '确定',
								type: 'success',
								showCancelButton:false,
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
					this.page=1;
					this.limit=10;
					if(this.$cookies.get("itemIdentifyId")==this.searchParams.identityId || this.$cookies.get("itemIdentifyId").length==20){
						this.getActivateList();
					}else{
				     	this.tableDable =[];	
						this.total = 0;
					}			
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						sncode:"",
						phone: null,
						productKey:null,
						productModel: null,
						operateType: null,
						operateSource: null,
						identityId:"",
					}
					this.tableDable =[];
					this.total = 0;
				} else {
					this.$refs[formName].resetFields();
				}
			},
			getActivateList() {
				let api = this.$Api.manage_customer_getDeviceActiveRecordList;
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
