<template>
<div id="productList">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" @click='handleRefresh'>刷新</Button>
	</div>
	<div class="filterbox">
		<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
			<FormItem prop='productName' class="input left marginRight">
				<Input v-model="filter.productName" placeholder='产品名称' class="input" clearable></Input>
			</FormItem>
			<FormItem prop='netType' class="input left marginRight">
				<Select v-model="filter.netType" placeholder='通信类型' class="input marginRight" clearable>
					<Option :value="'NET_WIFI'">NET_WIFI</Option>
					<Option :value="'NET_GPRS'">NET_GPRS</Option>
				</Select>
			</FormItem>
			<FormItem prop='time' class="input left marginRight">
				<DatePicker v-model="filter.time" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="时间" class="input" clearable></DatePicker>
			</FormItem>
		</Form>
	</div>
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
</div>
</template>
<script>
export default {
	name: 'productList',
	data() {
		return {
			permisson: {
				disable: false,
				info: false,
			},
			filter: { // 筛选数据
				productName: '',
				netType: '',
				time: '',
				endTime: '',
				startTime: '',
			},
			columns: [{ // 表格配置
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
					title: 'ProductKey',
					key: 'productKey',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.productKey)),
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
					title: '添加时间',
					key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.createTime)),
						]);
					}
				},
				{
					title: '状态',
					key: 'qcForbidden',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', {
								style: {
									color: params.row.qcForbidden == 1 ? 'green' : 'red'
								}
							}, params.row.qcForbidden == 1 ? '启用' : '禁用'),
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
									type: params.row.qcForbidden == 1 ? 'error' : 'success',
									size: 'small'
								},
								style: {
									marginRight: '5px',
									display: this.permisson.disable,
								},
								on: {
									click: () => {
										this.handleDisable(params.row)
									}
								}
							}, params.row.qcForbidden == 1 ? '禁用' : '启用'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disabled: params.row.qcForbidden == 1 ? true : false
								},
								style: {
									display: this.permisson.info,
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
		this.getTableData()
		this.handleDealPermisson()
	},
	methods: {
		handleRefresh() { // 刷新后台产品数据
			this.$refs['filter'].resetFields();
			let api = this.$api.manage_product_refreshProduct
			this.$Ax.get(api).then(res => {
				this.getTableData()
			}).catch(err => {
				console.log(err);
			})
		},
		getTableData() {
			this.filter.startTime = (this.filter.time[0] != '') ? this.$Utils.formatDate.format(this.filter.time[0], 'yyyy-MM-dd hh:mm:ss') : ''
			this.filter.endTime = (this.filter.time[1] != '') ? this.$Utils.formatDate.format(this.filter.time[1], 'yyyy-MM-dd hh:mm:ss') : ''
			let api = this.$api.manage_product_list
			let para = {
				productName: this.filter.productName,
				netType: this.filter.netType,
				endTime: this.filter.endTime,
				startTime: this.filter.startTime,
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		handleDisable(row) { // 禁用产品
			let api = this.$api.manage_product_qcForbidden
			let para = ''
			let msg = ''
			if (row.qcForbidden == 1) {
				para = {
					productKey: row.productKey,
					qcForbidden: 0,
				}
				msg = '禁用'
			} else {
				para = {
					productKey: row.productKey,
					qcForbidden: 1,
				}
				msg = '启用'
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认' + msg + '该产品（产品：' + row.name + '）？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(msg + '成功。');
						}
						this.getTableData()
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消禁用。');
				}
			});
		},
		goInfo(row) { // 跳转详情
			this.$router.push({
				path: '/product/productInfo',
				query: {
					productKey: row.productKey
				}
			});
		},
		dealNull(data) {
			if (data == null || data == undefined || data == '') {
				return '--'
			} else {
				return data
			}
		},
		// 获取按钮权限
		handleDealPermisson() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '产品管理') {
					let menuC = menu[i].children[0].children
					for (let y in menuC) {
						if (menuC[y].name == '产品启用禁用') {
							this.permisson.disable = menuC[y].checked
						}
						if (menuC[y].name == '产品详情') {
							this.permisson.info = menuC[y].checked
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
