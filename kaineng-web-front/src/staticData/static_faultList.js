import utils from '@/utils/dealNullData.js'

const columns = [ // 表格配置
	{
		type: 'index',
		title: '序号',
		width: 60,
		align: 'center'
	},
	{
		title: '设备名称',
		align: 'center',
		key: 'deviceName',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.deviceName))
			]);
		}
	},
	{
		title: '设备SN',
		align: 'center',
		key: 'sncode',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.sncode))
			]);
		}
	},
	{
		title: '故障名称',
		align: 'center',
		key: 'faultName',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.faultName))
			]);
		}
	},
	{
		title: '上报时间',
		align: 'center',
		key: 'reportTime',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.reportTime))
			]);
		}
	},
	{
		title: '用户手机',
		align: 'center',
		key: 'phone',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.phone))
			]);
		}
	}
]
const configList = [ // 筛选组件配置
	{
		plh: '设备名称',
		valName: 'deviceName',
		type: 'input'
	},
	{
		plh: '设备SN',
		valName: 'sncode',
		type: 'input'
	},
	{
		plh: '故障名称',
		valName: 'faultName',
		type: 'input'
	},
	{
		plh: '上报时间',
		type: 'dateRange'
	},
	{
		plh: '用户手机',
		valName: 'phone',
		type: 'input'
	},
]
const dataCardConfig = [ // 数据展示表配置
	{
		label: '今日故障数目',
		valName: 'todayFault',
	},
	{
		label: '今日新增故障',
		valName: 'todayAddFault',
	},
	{
		label: '今日解决故障',
		valName: 'todayFinish',
	},
	{
		label: '近一月上线故障设备数目',
		valName: 'monthFault',
	},
	{
		label: '故障设备总数',
		valName: 'allFaulty',
	}
]
export default {
	configList,
	columns,
	dataCardConfig
}