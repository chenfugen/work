/*
*
*   created By Xu Peng
*
*/
<template>
<div class="product-test-detail">
	<div class="product-test-header">
		<div class="product-test-header-left">
			<img v-if="qcRecord.result" src='./pass.png' width="64px" height="64px" />
			<img v-else src='./not_pass.png' width="64px" height="64px" />
			<p :style="computedColorStyle">{{ qcRecord.result ? '通过' : '未通过' }}</p>
		</div>
		<div class="product-test-header-right">
			<p>设备SN码：{{ qcRecord.sncode }}</p>
			<p>设备Mac地址：{{ qcRecord.deviceName }}</p>
			<p>产测时间：{{ qcRecord.createTime }}</p>
		</div>
	</div>
	<div class="product-test-body">
		<frontTable ref="frontTable" :columns="columns" :loading="loading" :tableData="propertyResult"></frontTable>
	</div>
</div>
</template>

<script>
import frontTable from '@/components/frontTable.vue'
import statusTag from '@/components/statusTag.vue'
import utils from '@/utils/dealNullData'
export default {
	components: {
		frontTable,
		statusTag,
	},
	data() {
		return {
			loading: false,
			qcRecord: {},
			propertyResult: [],
			columns: [{ // 表格配置
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '属性名称',
					align: 'center',
					key: 'propertyName',
					render: (h, params) => {
						return (
							<span>{ this.dealNullData(params.row.propertyName) }</span>
						)
					}
				},
				{
					title: '合格标准',
					align: 'center',
					key: 'standardValue',
					render: (h, params) => {
						return (
							<span>{ this.dealNullData(params.row.standardValue) }</span>
						)
					}
				},
				{
					title: '上报值',
					align: 'center',
					key: 'reportValue',
					width: 150,
					render: (h, params) => {
						return (
							<span>{ this.dealNullData(params.row.reportValue) }</span>
						)
					}
				},
				{
					title: '状态',
					align: 'center',
					key: 'status',
					width: 150,
					render: (h, params) => {
						const backgroundColor = params.row.status ? '#5fd487' : '#f5222d'
						const styleObj = { backgroundColor, }
						const action = params.row.status ? "合格" : "不合格"
						return (
							<statusTag style={styleObj}>{ action }</statusTag>
						)
					}
				},
			],
		};
	},
	computed: {
		computedColorStyle() {
			const color = this.qcRecord.result ? '#5fd487' : '#e44951'
			return {
				color
			}
		},
	},
	methods: {
		dealNullData: utils.dealNullData,
	},
	mounted() {
		if (this.$route.query.id) {
			let api = this.$api.manage_qc_record_detail
			let params = {
				id: this.$route.query.id,
			}
			this.loading = true
			this.$Ax.get(api, {
				params
			}).then((res) => {
				this.loading = false
				if (res.success) {
					this.qcRecord = res.data.qcRecord
					this.propertyResult = res.data.qcRecord.propertyResult
				}
			}).catch(() => {})
		}
	},
};
</script>
<style lang='less'>
.product-test-detail {
    background: #fff;
    border-radius: 4px;
    padding: 24px 0;
    .product-test-header {
        display: flex;
        padding-bottom: 24px;
        .product-test-header-left {
            width: 136px;
            height: 100%;
            text-align: center;
        }
        .product-test-header-right {
            flex: 1;
            font-size: 14px;
            color: #616B81;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}
</style>
