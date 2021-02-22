/*
*
*   created By Xu Peng
*
*/
<template>
<div class="product-test-container">
	<div class="product-test-search">
		<searchForm ref="searchForm" @handleSearch="search" :configList="configList"></searchForm>
	</div>
	<div class="product-test-table">
		<tableComponent class="productTable" ref="tableComponent" :columns="columns"></tableComponent>
	</div>
</div>
</template>

<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
import statusTag from '@/components/statusTag.vue'
import utils from '@/utils/dealNullData.js'
export default {
	components: {
		searchForm,
		tableComponent,
		statusTag,
	},
	data() {
		return {
			configList: [{ // 筛选框配置
					plh: '产测结果',
					valName: 'result',
					type: 'select',
					labelName: 'label',
					valueName: 'value',
					keyName: 'value',
					selectList: [{
							value: 'true',
							label: '合格'
						},
						{
							value: 'false',
							label: '不合格'
						},
					],
				},
				{
					plh: '产品名称',
					valName: 'productName',
					type: 'select',
					labelName: 'productName',
					valueName: 'productName',
					keyName: 'key',
					selectList: [],
				},
				{
					plh: '产测日期',
					type: 'dateRange',
				},
				{
					plh: 'Mac地址/设备SN',
					type: 'input',
					valName: 'deviceName'
				}
			],
			columns: [{ // 表格配置
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '产品名称',
					align: 'center',
					key: 'productName',
					render: (h, params) => {
						return ( <span>{this.dealNullData(params.row.productName)}</span> )
					}
				},
				{
					title: '设备Mac地址',
					align: 'center',
					key: 'deviceName',
					render: (h, params) => {
						return ( <span>{this.dealNullData(params.row.deviceName)}</span> )
					}
				},
				{
					title: '设备SN码',
					align: 'center',
					key: 'sncode',
					render: (h, params) => {
						return ( <span>{this.dealNullData(params.row.sncode)}</span> )
					}
				},
				{
					title: '物料号',
					align: 'center',
					key: 'materialNum',
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(params.row.materialNum)
							} < /span>
						)
					}
				},
				{
					title: '产测结果',
					align: 'center',
					key: 'result',
					render: (h, params) => {
						const backgroundColor = params.row.result ? '#5fd487' : '#f5222d'
						const styleObj = {
							backgroundColor,
						}
						const action = params.row.result ? "合格" : "不合格"
						return ( <statusTag style={styleObj}> {action} </statusTag> )
					}
				},
				{
					title: '产测时间',
					align: 'center',
					key: 'createTime',
					width: 150,
					render: (h, params) => {
						return ( <span> {this.dealNullData(params.row.createTime)} </span> )
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return ( <Button class="action-btn" type="text" size="small" ghost vOn:click = {() => this.handleDetailClick(params.row)}>详情</Button> )
					}
				}
			],
		};
	},
	mounted() {
		this.search()
		this.configList[1].selectList = this.$store.state.common.productList
	},
	methods: {
		dealNullData: utils.dealNullData,
		handleDetailClick(row) {
			const query = {
				id: row.id,
			}
			this.$router.push({
				name: 'productTestDetail',
				query: query
			})
		},
		// 表单查询
		search() {
			let para = this.$refs.searchForm.handleSubmit()
			this.$refs.tableComponent.getData(this.$api.manage_qc_record_list, para, true)
		},
	},
};
</script>
<style lang='less'>
.product-test-container {
    padding: 24px 0;
    background: #fff;
    border-radius: 4px;
    .product-test-search {
        padding: 0 24px;
    }
}
</style>
