<template>
<div id="keyEnterHis" class="clearfloat" style="position:relative">
	<div class="actBox clearfloat">
		<Button type="primary" class="right" :disabled='selection.length<1' @click='handleStart'>开始烧录</Button>
	</div>
	<div class="filterbox marginTop">
		<Form :model="filter" class="clearfloat" :label-width="120">
			<FormItem label='生产型号：' class="left">
				<span>XXXXXXXXXX</span>
			</FormItem>
			<FormItem label='任务总量：' class="left">
				<span>10000</span>
			</FormItem>
			<FormItem label='已完成数量：' class="left">
				<span>999</span>
			</FormItem>
		</Form>
	</div>
	<div class="filterbox marginTop">
		<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
			<FormItem prop='productKey' class="input left marginRight">
				<Select v-model="filter.productKey" placeholder='IMEI号码' class="input marginRight" clearable>
					<Option v-for="item in productList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem prop='erpCode' class="input left marginRight">
				<Input v-model='filter.erpCode' placeholder='ProductKey' class="input"></Input>
			</FormItem>
			<FormItem prop='workOrderCode' class="input left marginRight">
				<Input v-model='filter.workOrderCode' placeholder='DeviceName' class="input"></Input>
			</FormItem>
			<FormItem prop='status' class="input left marginRight">
				<Select v-model="filter.status" placeholder='烧写时间' class="input marginRight" clearable>
					<Option :value="0">新建</Option>
					<Option :value="1">进行中</Option>
					<Option :value="2">结束</Option>
				</Select>
			</FormItem>
			<FormItem class="input left marginRight">
				<Button type="primary" class="left" @click='getTableData'>查询</Button>
			</FormItem>
		</Form>
	</div>
	<div class="" style="position:relative">
		<HDTable ref='HDTable' @changeSel='handleSelection' :columns='columns'></HDTable>
	</div>
	<Spin v-if='pageLoading' fixd></Spin>
</div>
</template>
<script>
export default {
	name: 'keyEnterHis',
	data() {
		return {
			tableLoading: false,
			pageLoading: false,
			productLoading: false,
			selection: [],
			filter: {
				productKey: '',
				erpCode: '',
				workOrderCode: '',
				status: '',
			},
			productList: [],
			ableProductList: [],
			columns: [{
					type: 'selection',
					width: 60,
					align: 'center'
				}, {
					title: '模组IMEI号',
					align: 'center',
					key: 'productName',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.productName)),
						])
					}
				},
				{
					title: '任务状态',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', {
								style: {
									color: params.row.status == 0 ? 'green' : params.row.status == 1 ? 'green' : 'red'
								}
							}, params.row.status == 0 ? '新建' : params.row.status == 1 ? '进行中' : '结束'),
						])
					}
				}
			]
		}
	},
	mounted() {
		this.pageNum = 1
		this.pageSize = 10
		this.getTableData()
		this.getProductList()
		this.remoteProductList('')
	},
	methods: {
		getTableData() { // 获取表格数据
			this.tableLoading = true
			let api = this.$api.manage_productionTask_getProductionTaskList
			let para = {
				productKey: this.filter.productKey,
				productName: this.filter.productName,
				erpCode: this.filter.erpCode,
				status: this.filter.status,
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		getProductList() { // 获取所有产品列表
			let api = this.$api.manage_product_list
			let para = {
				pageNum: 1,
				pageSize: 100,
				qcForbidden: 1,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleStart() { // 开始烧录
		},
		handleSelection(array) {
			this.selection = array
		},
		remoteProductList(query) { // 远程搜索启用状态的产品列表
			this.productLoading = true
			let api = this.$api.manage_product_productList
			let para = {
				productName: query
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				let list = res.data.data
				this.ableProductList = []
				for (let i in list) {
					let para = {
						name: list[i].split('-HadLinks-')[0],
						productKey: list[i].split('-HadLinks-')[1],
					}
					this.ableProductList.push(para)
				}
				this.productLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		dealData(data) { // 处理空数据显示
			if (data === '' || data === null) {
				return '--'
			} else {
				return data
			}
		}
	}
}
</script>
<style scoped>
</style>
