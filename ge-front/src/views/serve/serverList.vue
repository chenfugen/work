<template>
<div class="serverList">
	<div class="serverList-content">
		<div class="searchBox">
			<searchForm v-if='createdFilter' @handleSearch='getTableData()' :configList='configList'></searchForm>
		</div>
		<div class="marginTop">
			<tableComponent :columns='columns' :showBatchDel='false'></tableComponent>
		</div>
	</div>
</div>
</template>
<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
export default {
	name: 'serverList',
	data() {
		return {
			showTableBtn: false,
			createdFilter: false, // 控制筛选组件延迟加载
			configList: [{ // 筛选组件配置
					plh: '服务类型',
					valName: 'status',
					type: 'select',
					labelName: 'name',
					valueName: 'value',
					keyName: 'key',
					selectList: [],
				},
				{
					plh: '受理状态',
					valName: 'productModel',
					type: 'select',
					labelName: 'name',
					valueName: 'value',
					keyName: 'key',
					selectList: [],
				},
				{
					plh: '产品名称',
					valName: 'productName',
					type: 'input'
				},
				{
					plh: '设备编号',
					valName: 'productModel',
					type: 'input'
				},
				{
					plh: '用户手机',
					valName: 'productModel',
					type: 'input'
				},
				{
					plh: '订单编号',
					valName: 'productModel',
					type: 'input'
				}
			],
			columns: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '服务类型',
					key: 'name'
				},
				{
					title: '产品名称',
					key: 'productName'
				},
				{
					title: '设备编号',
					key: 'maintenanceTime'
				},
				{
					title: '用户手机',
					key: 'mcuVer'
				},
				{
					title: '描述',
					key: 'address'
				},
				{
					title: '受理状态',
					key: 'runStatus'
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('Poptip', {
							props: {
								confirm: true,
								title: "您确定提交审核吗?",
								okText: '确定',
								cancelText: '取消',
								width: 160,
							},
							style: {
								display: this.showTableBtn ? 'block' : 'none'
							}
						}, [
							h('Button', {
								style: {
									color: '#2d8cf0'
								},
							}, '审核'),
						]);
					}
				}
			]
		}
	},
	created() {
		this.handleGetSelectList()
	},
	components: {
		searchForm,
		tableComponent
	},
	computed: {
		dealNullData: function(data) { // 租期
			return this.$Utils.dealNullData(data)
		},
	},
	methods: {
		getTableData() {},
		// 获取筛选下拉框列表
		handleGetSelectList() {
			for (let i in this.configList) {
				this.configList[i].selectList = [{
					name: '选项A',
					value: 'a',
					key: 'a',
				}, {
					name: '选项B',
					value: 'b',
					key: 'b',
				}, {
					name: '选项C',
					value: 'c',
					key: 'c',
				}, {
					name: '选项D',
					value: 'd',
					key: 'd',
				}]
			}
			this.createdFilter = true
		},

	}
}
</script>

<style>
.serverList .serverList-content {
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.serverList .searchBox {
	margin-left: 20px;
}

.serverList .actionBox {
	margin-left: 20px;
}

.serverList .searchBtn {
	padding: 1px 6px;
	font-size: 18px;
}

.serverList .ivu-icon-ios-help-circle {
	display: none;
}
</style>
