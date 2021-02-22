<template>
<div class="logList">
	<div class="logList-content">
		<div class="searchBox">
			<searchForm v-if='createdFilter' @handleSearch='getTableData()' :configList='configList' ref='searchForm'></searchForm>
		</div>
		<div class="marginTop">
			<tableComponent :columns='columns' :showBatchDel='false' ref='tableComponent'></tableComponent>
		</div>
	</div>
</div>
</template>
<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
export default {
	name: 'logList',
	data() {
		return {
			createdFilter: false, // 控制筛选组件延迟加载
			configList: [{ // 筛选组件配置
					plh: '账号',
					valName: 'accountName',
					type: 'select',
					labelName: 'userName',
					valueName: 'userName',
					keyName: 'key',
					selectList: [],
				},
				{
					plh: 'IP',
					valName: 'ip',
					type: 'input'
				},
				{
					plh: '操作时间',
					type: 'dateRange'
				},
			],
			columns: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '账号',
					key: 'accountName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.accountName))
						]);
					}
				},
				{
					title: '登录IP',
					key: 'ip',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.ip))
						]);
					}
				},
				{
					title: '操作时间',
					key: 'createTime',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
						]);
					}
				},
				{
					title: '操作描述',
					key: 'methodName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.methodName))
						]);
					}
				},
			]
		}
	},
	created() {
		this.handleGetSelectList()
	},
	mounted() {
		this.getTableData()
	},
	components: {
		searchForm,
		tableComponent
	},
	methods: {
		// 获取筛选下拉框列表
		handleGetSelectList() {
			this.configList[0].selectList = this.$store.state.common.accounts
			this.createdFilter = true
		},
		// 获取日志列表
		getTableData() {
			let para = this.$refs.searchForm.handleSubmit()
			this.$refs.tableComponent.getData(this.$api.manage_log_list, para, true)
		},
		// 处理空数据
		dealNullData(data) { // 租期
			return this.$Utils.dealNullData(data)
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
	}
}
</script>

<style scoped>
.logList-content {
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.searchBox {
	margin-left: 20px;
}

.searchBtn {
	padding: 1px 6px;
	font-size: 18px;
}
</style>
