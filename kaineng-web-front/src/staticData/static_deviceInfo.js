import utils from '@/utils/dealNullData.js'
const dialogInfoConf = [ // 详情弹窗配置
	{
		label: '设备名称:',
		valName: 'deviceName',
	},
	{
		label: 'IOTID:',
		valName: 'iotId',
	},
	{
		label: '产品名称:',
		valName: 'productName',
	},
	{
		label: 'PK码:',
		valName: 'productKey',
	},
	{
		label: '产品类型:',
		valName: 'productModel',
	},
	// {
	// 	label: '激活时间:',
	// 	valName: 'activeTime',
	// },
	{
		label: '创建时间:',
		valName: 'createTime',
	},
	{
		label: '最近上线的时间:',
		valName: 'onlineTime',
	},
	{
		label: '在线状态:',
		valName: 'status',
	},
	{
		label: '固件版本:',
		valName: 'firmwareVersion',
	},
	{
		label: '详细地址:',
		valName: 'ip',
	},
	// {
	// 	label: '所在地区:',
	// 	valName: 'province',
	// },
]

const statusCardConfig = [{
		label: '信号强度',
		valName: 'signal'
	},
	{
		label: '运行状态',
		valName: 'status'
	},
	{
		label: '故障状态',
		valName: 'faultStatus'
	},
	{
		label: '滤芯寿命',
		valName: 'filterLife'
	},
	{
		label: '租期剩余',
		valName: 'lease'
	},
]

const columns = [{
		type: 'index',
		title: '序号',
		width: 60,
		align: 'center'
	},
	{
		title: '用户手机号',
		align: 'phone',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.phone))
			]);
		}
	},
	{
		title: '用户昵称',
		align: 'nickName',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.nickName))
			]);
		}
	},
	{
		title: '关系类型',
		align: 'bindType',
		render: (h, params) => {
			return h('div', [
				h('div', params.row.bindType == 1 ? '绑定' : params.row.bindType == 2 ? '分享' : '--')
			]);
		}
	},
	{
		title: '绑定时间',
		align: 'bindTime',
		render: (h, params) => {
			return h('div', [
				h('div', utils.dealNullData(params.row.createTime))
			]);
		}
	}
]
export default {
	dialogInfoConf,
	statusCardConfig,
	columns
}