<template>
<div id="completeList">
	<div class="clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" @click='handleSwichModel'>{{!sweepModel?'质检模式':'平常模式'}}</Button>
	</div>
	<!-- 筛选 -->
	<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
		<FormItem prop='identety' class="input left marginRight">
			<Input id='mac' @on-enter='handleSwichSNcode' v-model="filter.identety" placeholder="MAC地址" class="input marginRight marginTop" />
		</FormItem>
		<FormItem prop='sncode' class="input left marginRight">
			<Input id='snCode' @on-enter='getTableData' v-model="filter.sncode" placeholder="SN码" class="input marginRight marginTop" />
		</FormItem>
		<FormItem v-show='!sweepModel' prop='value' class="input left marginRight">
			<DatePicker v-model='filter.time' type="datetimerange" placeholder="日期" class="input marginRight marginTop" clearable></DatePicker>
		</FormItem>
		<FormItem v-show='!sweepModel' prop='productKey' class="input left marginRight">
			<Select v-model="filter.productKey" placeholder='产品名称' class="input marginRight marginTop" clearable>
				<Option v-for="(item,index) in productList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
			</Select>
		</FormItem>
		<FormItem v-show='!sweepModel' prop='deviceName' class="input left marginRight">
			<Input v-model="filter.deviceName" placeholder="DeviceName" class="input marginRight marginTop" />
		</FormItem>
		<FormItem v-show='!sweepModel' prop='deviceSecret' class="input left marginRight">
			<Input v-model="filter.deviceSecret" placeholder="deviceSecret" class="input marginRight marginTop" />
		</FormItem>
		<FormItem v-show='!sweepModel' prop='person' class="input left marginRight">
			<Input v-model="filter.person" placeholder="产测人员" class="input marginRight marginTop" />
		</FormItem>
	</Form>
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
</div>
</template>
<script>
export default {
	name: 'completeList',
	data() {
		return {
			permisson: {
				info: false
			},
			sweepModel: false,
			filter: {
				time: '',
				startTime: '',
				endTime: '',
				identety: '',
				sncode: '',
				ip: '',
				productKey: '',
				deviceName: '',
				deviceSecret: '',
				person: '',
			},
			productList: [],
			columns: [{
					title: 'MAC地址',
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
					title: '产品名称',
					key: 'name',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.name)),
						]);
					}
				},
				{
					title: '工单',
					key: 'userName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.workOrderCode)),
						]);
					}
				},
				{
					title: '工厂',
					key: 'userName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.factoryName)),
						]);
					}
				},
				{
					title: '产线',
					key: 'userName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.productLineName)),
						]);
					}
				},
				{
					title: '产测时间',
					key: 'userName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.updateTime)),
						]);
					}
				},
				{
					title: '产测人员',
					key: 'userName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.userName)),
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
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleUnbind(params.row)
									}
								}
							}, '解绑SN码'),
						]);
					}
				}
			]
		}
	},
	mounted() {
		this.getTableData()
		this.getProductList()
		this.handleDealPermission()
	},
	methods: {
		getTableData() { // 获取表格数据
			this.filter.startTime = (this.filter.time[0] != '') ? this.$Utils.formatDate.format(this.filter.time[0], 'yyyy-MM-dd hh:mm:ss') : ''
			this.filter.endTime = (this.filter.time[1] != '') ? this.$Utils.formatDate.format(this.filter.time[1], 'yyyy-MM-dd hh:mm:ss') : ''
			this.tableLoading = true
			let para = {
				startTime: this.filter.startTime,
				endTime: this.filter.endTime,
				identety: this.filter.identety,
				sncode: this.filter.sncode,
				ip: this.filter.ip,
				productKey: this.filter.productKey,
				deviceName: this.filter.deviceName,
				deviceSecret: this.filter.deviceSecret,
				person: this.filter.person,
				status: 3,
			}
			let api = this.$api.manage_device_finishDeviceList
			this.$refs['HDTable'].getListData(api, para)
		},
		getProductList() { // 获取产品名称列表
			let api = this.$api.manage_product_list
			let para = {
				pageNum: 1,
				pageSize: 1000
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data.data
			}).catch(err => {
				console.log(err);
			})
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
		goInfo(row) { // 前往设备详情
			this.$router.push({
				path: '/device/deviceInfo',
				name: 'deviceInfo',
				query: {
					deviceId: row.deviceId
				}
			});
		},
		dealNull(data) {
			if (data === null || data === undefined) {
				return '--'
			} else {
				return data
			}
		},
		// 处理页面权限
		// 获取页面权限
		handleDealPermission() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				for (let x in menu[i].children) {
					if (menu[i].children[x].name == '完成设备') {
						for (let z in menu[i].children[x].children) {
							if (menu[i].children[x].children[z].name == '设备详情') {
								this.permisson.info = menu[i].children[x].children[z].checked
							}
						}
					}
				}
			}
		},
		handleUnbind(row) {
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认解绑该设备（设备：' + row.identityId + '）SN码？</p>',
				onOk: () => {
					let api = this.$api.manage_device_removeDeviceSnCodeBind
					let para = {
						deviceId: row.deviceId
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(res.data.data);
							this.getTableData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消解绑。');
				}
			});
		},
	}
}
</script>
<style scoped>
.ivu-form-item {
	margin-bottom: 0px;
}
</style>
