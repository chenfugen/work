<template>
	<div class="factoryManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="产品列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams"  formName="searchParams"  @resetForm="resetForm" @submitForm="submitForm" isAdd
			 buttonName="刷新" @add="update"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getProductList" />
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
						name: "系统管理",
						path: ""
					},
					{
						name: "产品管理",
						path: "/productManage"
					}
				],
				loading:true,
				dialogFormVisible: false,			
				searchList: [{
						label: "产品名称",
						prop: "erpName",
						type: 'input',
					},
					{
						label: "ERP编码",
						prop: "erpCode",
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
								value: 0,
							}
						]
					}
				],
				searchParams: {
					erpName: null,
					erpCode: null,
					status: null
				},
				tableDable: [],
				columns: [{
						prop: 'itemName',
						label: '产品名称',
						align: 'left',
					}, {
						prop: 'itemCode',
						label: 'ERP编码',
						align: 'left',
					},
					{
						prop: 'status',
						label: '状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									type: params.row.status === 1 ? '' : 'danger'
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
										on: {
											click: () => {
												this.end(params.row)
											}
										}
									}, params.row.status == 0 ? '启用' : '禁用')]);
							}
						}
				],
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
		mounted() {
			this.getProductList();
		},
		methods: {
			submitForm(formName) {
				if (formName == "searchParams") {				
					this.getProductList();
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						erpName: null,
						erpCode: null,
						status: null
					}
					 this.getProductList();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			update() {
				this.searchParams = {
					erpName: null,
					erpCode: null,
					status: null
				}
				let api = this.$Api.manage_productManage_refresh;
				this.$Axios.post(api).then((res) => {
					this.loading=false;
					if (res.success) {											
						this.$message({
							message:"刷新成功",
							type: 'success'
						});
						 this.getProductList();
					}
				}).catch((res) => {
					this.$message({
						message: res.message,
						type: 'warning'
					});
				});
			},		
			end(row) {
				let activeName = row.status == 0 ? "启用" : "禁用";
				this.$confirm('确定要' + activeName + '该产品?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_productForbidden, {
						erpCode:row.itemCode,
						status: row.status == 0 ? 1 : 0,
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getProductList();
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			getProductList() {
				let api = this.$Api.manage_getErpCodePageList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading=false;
					if (res.success) {					
						this.tableDable=res.data;
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
