<template>
<div class="device">
	<div class="" v-show='act =="common"'>
		<Row class="dataBox" type="flex" justify="space-between">
			<Col span='16'>
			<Card>
				<div class="clearfloat">
					<span class="left">近七日设备新增</span>
					<span class="right">
						<span style="display:block;text-align: center;">{{todayAdd}}</span>
						<span style="display:block;font-size: 12px;color: #999999;">今日新增</span>
					</span>
				</div>
				<div id='deviceAdd' style="margin: 0 auto; width:100%; height:200px;"></div>
			</Card>
			<!--  eslint-disable-next-line -->
			</Col>
			<Col span='7' offset='1.5'>
			<Card>
				<div class="clearfloat">
					<span class="left">在线设备统计</span>
					<span class="right">
						<span style="display:block;text-align:center">{{deviceTotal}}</span>
						<span style="display:block;font-size: 12px;color: #999999;">设备总计</span>
					</span>
				</div>
				<div id='deviceOnlinePie' style="margin: 0 auto; width: 200px; height:200px;"></div>
			</Card>
			<!--  eslint-disable-next-line -->
			</Col>
			<Col span='7' offset='1.5' v-show='false'>
			<Card>
				<div class="clearfloat">
					<span class="left">故障设备统计</span>
					<span class="right">
						<span style="display:block">654399</span>
						<span style="display:block;font-size: 12px;color: #999999;">设备总计</span>
					</span>
				</div>
				<div id='deviceFaultPie' style="margin: 0 auto; width: 200px; height:200px;"></div>
			</Card>
			<!--  eslint-disable-next-line -->
			</Col>
		</Row>
		<div class="device-content marginTop">
			<div class="searchBox">
				<searchForm ref='searchForm' v-if='createdFilter' @handleSearch='getTableData' :configList='configList'></searchForm>
			</div>
			<div class="tableBox marginTop">
				<tableComponent v-if='showTable' ref='tableComponent' :columns='columns' :showBatchDel='false'></tableComponent>
			</div>
		</div>
	</div>
	<div v-if='act =="info"' class="">
		<Button icon='ios-arrow-back' class="marginBottom" @click='handleBack'>列表</Button>
		<deviceInfo ref='deviceInfo'></deviceInfo>
	</div>
	<div v-if='act =="setup"' class="marginBottom">
		<Button icon='ios-arrow-back' class="marginBottom" @click='handleBack'>列表</Button>
		<deviceSetUp ref='deviceSetUp'></deviceSetUp>
	</div>
</div>
</template>
<script>
var echarts = require('echarts');
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
import deviceInfo from '@/views/device/deviceInfo.vue'
import deviceSetUp from '@/views/device/deviceSetUp.vue'
export default {
	name: 'device',
	data() {
		return {
			act: 'common',
			todayAdd: 0,
			onlineTotal: 0,
			deviceTotal: 0,
			showTable: false,
			createdFilter: false, // 控制筛选组件延迟加载
			configList: [ // 筛选组件配置
				{
					plh: '设备名称',
					valName: 'deviceName',
					type: 'input'
				},
				{
					plh: '产品名称',
					valName: 'productKey',
					type: 'select',
					labelName: 'productName',
					valueName: 'productKey',
					keyName: 'key',
					selectList: [],
				},
				{
					plh: '激活时间',
					type: 'dateRange'
				},
				{
					plh: '设备状态',
					valName: 'status',
					type: 'select',
					labelName: 'label',
					valueName: 'value',
					keyName: 'key',
					selectList: [{
						label: '设备离线',
						value: 'offline'
					}, {
						label: '设备在线',
						value: 'online'
					}],
				},
				{
					plh: '地区',
					type: 'region',
					valName: 'region',
				},
			],
			columns: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center',
				},
				{
					title: '设备名称',
					align: 'center',
					key: 'deviceName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.deviceName))
						]);
					}
				},
				{
					title: '产品名称',
					align: 'center',
					key: 'productName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.productName))
						]);
					}
				},
				{
					title: '激活时间',
					align: 'center',
					key: 'createTime',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
						]);
					}
				},
				{
					title: '最近上线时间',
					align: 'center',
					key: 'onlineTime',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.onlineTime))
						]);
					}
				},
				{
					title: '经销商',
					align: 'center',
					key: 'agent',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.agent))
						]);
					}
				},
				{
					title: '设备状态',
					align: 'center',
					key: 'status',
					render: (h, params) => {
						return h('div', [
							h('div', {
								style: {
									margin: '0 auto',
									height: '20px',
									width: '50px',
									textAlign: 'center',
									backgroundColor: params.row.status == 'online' ? '#2D8CF0' : '#616B81',
									color: '#fff',
									borderRadius: '10px',
									lineHeight: '20px'
								}
							}, params.row.status == 'offline' ? '离线' : params.row.status == 'online' ? '在线' : '--')
						]);
					}
				},
				{
					title: '固件版本号',
					align: 'center',
					width: 100,
					key: 'firmwareVersion',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.firmwareVersion))
						]);
					}
				},
				{
					title: 'mcu版本号',
					align: 'center',
					width: 100,
					key: 'mcuVersion',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.mcuVersion))
						]);
					}
				},
				{
					title: '所在地区',
					key: 'city',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.province + params.row.city))
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
									type: 'text',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.getInfo(params.row)
									}
								}
							}, '详情'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.goSetUp(params.row)
									}
								}
							}, '设置'),
						]);
					}
				}
			]
		}
	},
	created() {
		this.configList[1].selectList = this.$store.state.common.productList
		this.createdFilter = true
	},
	mounted() {
		if (this.$store.state.user.userName == 'root') {
			this.configList.splice(2, 0,  {
				plh: '所属委托商',
				valName: 'partnerId',
				type: 'select',
				labelName: 'partnerName',
				valueName: 'partnerId',
				keyName: 'key',
				selectList:JSON.parse(sessionStorage.getItem("partners")),
			})		
			this.columns.splice(2, 0, {
				title: '所属委托商',
				align: 'center',
				key: 'customerName',
				render: (h, params) => {
					return h('div', [
						h('div', this.dealNullData(params.row.customerName))
					]);
				}
			})
		}
		this.showTable = true
		this.$nextTick(() => {
			this.getTableData()
		})
		this.getOnlineDeviceData()
		this.getDeviceAddData()
	},
	components: {
		searchForm,
		tableComponent,
		deviceInfo,
		deviceSetUp
	},
	methods: {
		// 获取列表数据
		getTableData() {
			let para = this.$refs.searchForm.handleSubmit()
			this.$refs.tableComponent.getData(this.$api.manage_device_list, para, true)
		},
		// 设备详情
		getInfo(row) {
			this.act = 'info'
			this.$nextTick(function() {
				this.$refs.deviceInfo.getDeviceInfo(row.id, row.netType)
			})
		},
		// 设备设置
		goSetUp(row) {
			this.act = 'setup'
			this.$nextTick(function() {
				this.$refs.deviceSetUp.handleSetInfo({
					productKey: row.productKey,
					deviceName: row.deviceName,
					id: row.id,
				})
			})
		},
		// 获取在线设备统计数据
		getOnlineDeviceData() {
			let api = this.$api.manage_device_getDeviceData_online
			this.$Ax.get(api).then(res => {
				this.onlineTotal = res.data.onlineCount
				this.deviceTotal = res.data.total
				this.handleDriveOnlinePie(this.onlineTotal, (this.deviceTotal - this.onlineTotal))
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 获取七天新增设备
		getDeviceAddData() {
			let api = this.$api.manage_device_getDeviceData
			this.$Ax.get(api).then(res => {
				let xDataList = [],
					dataList = [],
					time = new Date()
				for (let i in res.data) {
					if (this.dealTime(time).split(' ')[0] == this.dealTime(res.data[i].date).split(' ')[0]) {
						this.todayAdd = res.data[i].count
					}
					xDataList.push(this.dealTime(res.data[i].date).split(' ')[0])
					dataList.push(res.data[i].count)
				}
				this.handleDriveDeviceAdd(xDataList, dataList)
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 绘制在线饼图
		handleDriveOnlinePie(onlineTotal, offLineTotal) {
			let deviceOnlinePie = echarts.init(document.getElementById('deviceOnlinePie'));
			let pieData = [{
				value: onlineTotal,
				name: '在线设备'
			}, {
				value: offLineTotal,
				name: '离线设备'
			}]
			var optionOnline = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				series: [{
					name: '设备占比',
					type: 'pie',
					radius: ['70%', '90%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: pieData,
					color: ['#19be6b', 'gray']
				}]
			};
			deviceOnlinePie.setOption(optionOnline);
		},
		// 绘制设备新增
		handleDriveDeviceAdd(xDataList, dataList) {
			let deviceAdd = echarts.init(document.getElementById('deviceAdd'));
			let option = {
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					axisLine: {
						lineStyle: {
							color: '#57617B'
						}
					},
					// x轴
					data: xDataList
				}, ],
				dataZoom: [{
					type: "inside"
				}],
				yAxis: [{
					type: 'value',
					show: false,
				}],
				tooltip: {
					trigger: 'axis'
				},
				series: [{
					name: '新增设备',
					type: 'line',
					smooth: true,
					symbol: 'circle',
					symbolSize: 5,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(137, 189, 27, 0.3)'
							}, {
								offset: 0.8,
								color: 'rgba(137, 189, 27, 0)'
							}], false),
							shadowColor: 'rgba(0, 0, 0, 0.1)',
							shadowBlur: 10
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(137,189,27)',
							borderColor: 'rgba(137,189,2,0.27)',
							borderWidth: 12

						}
					},
					data: dataList
				}]
			};
			deviceAdd.setOption(option)
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 处理空数据
		dealNullData(data) {
			return this.$Utils.dealNullData(data)
		},
		// 处理版本号格式
		handleDealVersion(ver) {
			if (ver === '' || ver === null || ver === undefined) {
				return '--'
			} else {
				if (ver.indexOf('.') == -1) {
					ver = ver.split("")
					var result = Number(ver[0] + ver[1]) + '.' + Number(ver[3] + ver[4]) + '.' + Number(ver[6] + ver[7])
					return result
				} else {
					return ver
				}
			}
		},
		handleBack() {
			this.act = 'common'
			console.log('xxx');
		}
	}
}
</script>

<style scoped>
.device-content {
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.searchBox {
	margin-left: 20px;
}

.actionBox {

	margin-left: 20px;
}

.searchBtn {
	padding: 1px 6px;
	font-size: 18px;
}
</style>
