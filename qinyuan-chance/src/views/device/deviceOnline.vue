<template>
<div id="deviceOnline">
	<!-- 操作 -->
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" @click='handleSwichModel'>{{!sweepModel?'质检模式':'平常模式'}}</Button>
	</div>
	<!-- 数据筛选 -->
	<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
		<FormItem prop='identityId' class="input left marginRight">
			<Input id='mac' @on-enter='handleSwichSNcode' v-model="filter.identityId" placeholder="MAC地址" />
		</FormItem>
		<FormItem prop='sncode' class="input left marginRight">
			<Input id='snCode' @on-enter='getTableData' v-model="filter.sncode" placeholder="SN码" />
		</FormItem>
		<FormItem v-show='!sweepModel' prop='productKey' class="input left marginRight">
			<Select v-model="filter.productKey" placeholder='产品名称' class="input marginRight" clearable>
				<Option v-for="(item,index) in productList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
			</Select>
		</FormItem>
		<FormItem v-show='!sweepModel' prop='netType' class="input left marginRight">
			<Select v-model="filter.netType" placeholder='通信类型' class="input marginRight" clearable>
				<Option :value="'NET_WIFI'">NET_WIFI</Option>
				<Option :value="'2G'">2G</Option>
			</Select>
		</FormItem>
	</Form>
	<!-- 数据展示 -->
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
</div>
</template>
<script>
export default {
	name: 'deviceOnline',
	data() {
		return {
			permisson: {
				info: false
			},
			sweepModel: false,
			filter: { // 筛选数据
				productKey: '',
				identityId: '',
				sncode: '',
				netType: '',
			},
			productList: [], // 产品类型列表
			netTypeList: [], // 通信类型列表
			columns: [{
					title: '设备MAC地址',
					key: 'identityId',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.identityId)),
						]);
					}
				},
				{
					title: 'SN码',
					key: 'sncode',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.sncode)),
						]);
					}
				},
				{
					title: '名称',
					key: 'name',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.name)),
						]);
					}
				},
				{
					title: '通信类型',
					key: 'netType',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.netType)),
						]);
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', params.row.status == '1' ? '待产测' : params.row.status == '2' ? '产测中' : params.row.status == '3' ? '产测成功' : params.row.status == '4' ? '产测失败' : '--'),
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.goInfo(params.row)
									}
								}
							}, '详情'),
						]);
					}
				}
			],
		}
	},
	mounted() {
		this.getProductList()
		this.getTableData()
		this.handleDealPermission()
	},
	methods: {
		getTableData() { // 获取表格数据
			let para = {
				...this.filter,
			}
			let api = this.$api.manage_device_onlineDeviceList
			this.$refs['HDTable'].getListData(api, para)
		},
		getProductList() { // 获取产品名称列表
			let api = this.$api.manage_product_list
			let para = {
				pageNum: 1,
				pageSize: 1000,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		goInfo(row) { // 前往设备详情
			this.$router.push({
				path: '/device/deviceInfo',
				name: 'deviceInfo',
				query: {
					deviceId: row.deviceId
				}
			});
		},
		handleSwichModel() { // 切换质检模式
			this.sweepModel = !this.sweepModel
			this.$refs['filter'].resetFields()
			if (this.sweepModel) {
				document.getElementById('mac').children[1].focus()
			}
		},
		handleSwichSNcode() { // 切换sn码输入框
			document.getElementById('snCode').children[1].focus()
		},
		dealNull(data) {
			if (data === null || data === undefined) {
				return '--'
			} else {
				return data
			}
		},
		// 获取页面权限
		handleDealPermission() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				for (let x in menu[i].children) {
					if (menu[i].children[x].name == '在线设备') {
						for (let z in menu[i].children[x].children) {
							if (menu[i].children[x].children[z].name == '设备详情') {
								this.permisson.info = menu[i].children[x].children[z].checked
							}
						}
					}
				}
			}
		}
	}
}
</script>
<style scoped>
.actBox {
	margin-bottom: 20px;
}
</style>
