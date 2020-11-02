<template>
	<div class="digitalManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="设备列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getdeviceList" />
		</div>
	</div>
</template>

<script>
	import breadcrumb from "../../components/breadcrumb.vue"
	import modelBar from "../../components/modelBar.vue"
	import search from "../../components/searchList.vue"
	import tablePage from "../../components/table.vue"
	import pagination from "../../components/pagination.vue"
	import citys from "../../assets/js/area.js"
	export default {
		data() {
			return {
				navigation: [{
						name: "设备管理",
						path: ""
					},
					{
						name: "设备列表",
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
						prop: "userPhone",
						type: 'input',
					},
					{
						label: "设备型号",
						prop: "productKey",
						type: 'select',
						filterable: true,
						options: []
					}
				],
				searchParams: {
					sncode: null,
					identityId: null,
					userPhone: null,
					productKey: null,
				},
				tableDable: [],
				columns: [{
						prop: 'sncode',
						label: '设备SN',
						align: 'left',
						width: 200
					},
					{
						prop: 'identityId',
						label: '设备MAC',
						align: 'left',
					},
					{
						prop: 'userPhone',
						label: '用户号码（激活）',
						align: 'left',
					},
					{
						prop: 'productKey',
						label: '设备PK',
						align: 'left',
					},
					{
						prop: 'productModel',
						label: '设备型号',
						align: 'left',
					},
					{
						prop: '',
						label: '设备地址',
						align: 'left',
						render: (h, params) => {
							return h('span', this.getAddress(params.row))
						}
					},
					{
						label: '操作',
						width: 200,
						align: 'left',
						fixed: "right",
						operates: [{
								label: '详情',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.detail(row)
								}
							},
							{
								label: '删除',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.delete(row)
								}
							}
						]
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
			this.getdeviceList();
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
								value: res.data[i].productKey,
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
			detail(row) {
				this.$router.push("/deviceDetail/" + row.identityId + "/" + row.productKey + "/1")
			},
			delete(row) {
				this.$confirm('确定要删除该设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_device_delete;
					this.$Axios.post(api, {
						sncode: row.sncode
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: "删除成功",
								type: 'success'
							});
							this.getdeviceList();
						} else {
							this.$message({
								message: res.msg,
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
					this.getdeviceList();
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						sncode: null,
						identityId: null,
						userPhone: null,
						productKey: null,
					}
					this.page=1;
					this.limit=10;
					this.getdeviceList();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			getAddress(row) {
				if (row.provinceCode == null || row.cityCode == null || row.areaCode == null) {
					return "--";
				} else if (citys.province_list[Number(row.provinceCode)] == undefined || citys.city_list[Number(row.cityCode)] ==
					undefined || citys.county_list[Number(row.areaCode)] == undefined) {
					return "--";
				} else if (row.devAddress == null) {
					return citys.province_list[Number(row.provinceCode)] + citys.city_list[Number(row.cityCode)] + citys.county_list[
						Number(row.areaCode)];
				} else {
					return citys.province_list[Number(row.provinceCode)] + citys.city_list[Number(row.cityCode)] + citys.county_list[
						Number(row.areaCode)] + row.devAddress;
				}
			},
			getdeviceList() {
				let api = this.$Api.manage_device_list;
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
	.digitalManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
		}
	}
</style>
