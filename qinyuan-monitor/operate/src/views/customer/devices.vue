<template>
	<div class="digitalManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="设备列表"></model-bar>
			<!-- <search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm"></search> -->
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
				isShowActiveButton:false,
				navigation: [{
						name: "客户服务",
						path: "/customerService"
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
						prop: "phone",
						type: 'input',
					},
					{
						label: "产品型号",
						prop: "productModel",
						type: 'select',
						filterable: true,
						options: []
					}
				],
				searchParams: {
					sncode: null,
					productKey: null,
					userPhone: null,
					productModel: null,
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
						prop: 'userPhone',
						label: '用户号码（激活）',
						align: 'left',
					},
					{
						prop: 'productModel',
						label: '设备型号',
						align: 'left',
					},
					{
						prop: 'devAddress',
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
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.detail(params.row)
										}
									}
								}, '激活记录'),
								h('span', {
									style: {
										display: this.isShowActiveButton? "inline-block": "none",
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
										display: this.isShowActiveButton?"inline-block": "none",
									},
									on: {
										click: () => {
											this.edit(params.row)
										}
									}
								}, '设置未激活'),								
							]);
						},				
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
			if (localStorage.getItem("isShowActiveButton")) {
				this.isShowActiveButton=localStorage.getItem("isShowActiveButton")
			}
		},
		methods: {
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
			edit(row) {
				this.$confirm('确定要将该设备设置为未激活?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_customer_updateDeviceActiveStatus;
					this.$Axios.post(api, {
						productKey: row.productKey,
						identityId: row.identityId,
						activeStatus:0,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: "操作成功",
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
			detail(row){
				this.$router.push("/activateLog/" + row.sncode+"/"+row.identityId);
			},
			getdeviceList() {
				let api = this.$Api.manage_customer_getUserDeviceList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
					    userId:this.$cookies.get("userId")
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
