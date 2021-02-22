<template>
<div class="home">
	<Row :gutter="16">
		<Col span="6">
		<Card>
			<p class='cardTitle clearfloat'>
				<span class="left">设备统计</span>
				<span class="right">
					<p>{{this.faultForm.total}}</p>
					<p class="cardTipGray">在线故障设备</p>
				</span>
			</p>
			<div class="cardPic cardDevice" style="marginTop:14px;"></div>
			<div class="cardDataBox">
				<p class="cardData">{{this.deviceForm.deviceTotal}}</p>
				<p class="cardLabel">设备总计</p>
			</div>
			<div class="cardChart clearfloat" style="marginTop:50px;">
				<p class="left">售卖</p>
				<Progress class="right" style="width:80%;" :percent="this.deviceForm.salePercent">
					<span>{{this.deviceForm.sale}}</span>
				</Progress>
			</div>
			<div class="cardChart clearfloat">
				<p class="left">租赁</p>
				<Progress class="right" style="width:80%;" :percent="this.deviceForm.leasePercent">
					<span>{{this.deviceForm.lease}}</span>
				</Progress>
			</div>
			<div class="cardChart clearfloat">
				<p class="left">共享</p>
				<Progress class="right" style="width:80%;" :percent="this.deviceForm.sharePercent">
					<span>{{this.deviceForm.share}}</span>
				</Progress>
			</div>
		</Card>
		<Card class="marginTop">
			<div class="clearfloat">
				<span class="left">激活统计</span>
			</div>
			<div id='deviceActivePie' style="margin: 0 auto; width: 200px; height:200px;"></div>
		</Card>
		<Card class="marginTop">
			<div class="clearfloat">
				<span class="left">在线设备统计</span>
			</div>
			<div id='deviceOnlinePie' style="margin: 0 auto; width: 200px; height:200px;"></div>
		</Card>
		</Col>
		<Col span="18">
		<Row :gutter="16">
			<Col span="8">
			<Card style="height:180px;">
				<p class='cardTitle'>故障统计</p>
				<div class="cardPic cardFault"></div>
				<div class="cardDataBox">
					<p class="cardData">{{this.faultForm.total}}</p>
					<p class="cardLabel">故障总计</p>
				</div>
				<div class="clearfloat">
					<p class="left" style="font-size: 12px;color: #2D8CF0;">
						<span>处理中</span>
						<span style="font-size: 14px;marginLeft:8px;">{{this.faultForm.repairCount}}</span>
					</p>
					<p class="right" style="font-size: 12px;color: #5FD487;">
						<span>已处理</span>
						<span style="font-size: 14px;marginLeft:8px;">{{this.faultForm.repairCount}}</span>
					</p>
				</div>
			</Card>
			</Col>
			<Col span="8">
			<Card style="height:180px;">
				<p class='cardTitle'>告警统计</p>
				<div class="cardPic cardWarn"></div>
				<div class="cardDataBox">
					<p class="cardData">--</p>
					<p class="cardLabel">告警总计</p>
				</div>
				<div class="clearfloat">
					<p class="left" style="font-size: 12px;color: #FC8437;">
						<span>即将到期</span>
						<span style="font-size: 14px;marginLeft:8px;">--</span>
					</p>
					<p class="right" style="font-size: 12px;color: #E95454;">
						<span>已经到期</span>
						<span style="font-size: 14px;marginLeft:8px;">--</span>
					</p>
				</div>
			</Card>
			</Col>
			<Col span="8">
			<Card style="height:180px;">
				<p class='cardTitle'>订单统计</p>
				<div class="cardPic cardOrder"></div>
				<div class="cardDataBox">
					<p class="cardData">--</p>
					<p class="cardLabel">订单总计</p>
				</div>
			</Card>
			</Col>
		</Row>
		<Row :gutter="16" style="padding:8px;">
			<Card style="height:655px;">
				<maps></maps>
			</Card>
		</Row>
		</Col>
	</Row>
</div>
</template>

<script>
import maps from '@/components/maps.vue'
var echarts = require('echarts');
export default {
	name: 'home',
	data() {
		return {
			deviceForm: {
				deviceTotal: 0,
				lease: 0,
				leasePercent: 0,
				sale: 0,
				salePercent: 0,
				share: 0,
				sharePercent: 0,
			},
			faultForm: {
				deviceFaultCountDay: 0,
				faultDeviceCount: 0,
				faultDeviceCountMonth: 0,
				repairCount: 0,
				total: 0,
			}
		}
	},
	components: {
		maps
	},
	mounted() {
		this.getOnlineDeviceData()
		this.getActiveDeviceData()
		this.getTotalData()
		this.getTotalFault()
	},
	methods: {
		// 获取数据统计
		getTotalData() {
			let api = this.$api.manage_dataCenter_deviceData
			this.$Ax.get(api).then(res => {
				this.deviceForm.deviceTotal = res.data.deviceTotal
				this.deviceForm.lease = res.data.lease
				this.deviceForm.share = res.data.share
				this.deviceForm.sale = res.data.sale
				this.deviceForm.leasePercent = (res.data.lease / res.data.deviceTotal) * 100
				this.deviceForm.sharePercent = (res.data.share / res.data.deviceTotal) * 100
				this.deviceForm.salePercent = (res.data.sale / res.data.deviceTotal) * 100
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取各类故障统计
		getTotalFault() {
			let api = this.$api.manage_fault_data_count
			this.$Ax.get(api).then(res => {
				this.faultForm = res.data
			}).catch(err => {
				console.log(err);
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
		// 获取在线设备统计数据
		getActiveDeviceData() {
			let api = this.$api.manage_device_getDeviceData_online
			this.$Ax.get(api).then(res => {
				this.onlineTotal = res.data.onlineCount
				this.deviceTotal = res.data.total
				this.handleDriveActivePie(this.onlineTotal, (this.deviceTotal - this.onlineTotal))
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 绘制在线饼图
		handleDriveActivePie(onlineTotal, offLineTotal) {
			let deviceOnlinePie = echarts.init(document.getElementById('deviceActivePie'));
			let pieData = [{
				value: onlineTotal,
				name: '未激活设备'
			}, {
				value: offLineTotal,
				name: '激活设备'
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
					data: pieData
				}]
			};
			deviceOnlinePie.setOption(optionOnline);
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
	}
}
</script>

<style scope>
.cardTitle {
	font-size: 14px;
	color: #3F4656;
}

.cardPic {
	width: 40px;
	height: 40px;
	margin: 0 auto;
	margin-top: 24px;
	border-radius: 20px;
	background-size: 100% 100%;
}

.cardTipGray {
	font-size: 12px;
	color: #999999;
}

.cardDevice {
	background-image: url(../../assets/dataCenter/device.png);
}

.cardFault {
	background-image: url(../../assets/dataCenter/fault_total.png);
}

.cardWarn {
	background-image: url(../../assets/dataCenter/alarm_total.png);
}

.cardOrder {
	background-image: url(../../assets/dataCenter/order_total.png);
}

.cardDataBox {
	text-align: center;
	margin-top: 16px;
}

.cardData {
	font-size: 20px;
	color: #3F4656;
}

.cardLabel {
	font-size: 12px;
	color: #999999;
	line-height: 10px;
}

.cardChart p {
	font-size: 12px;
	color: #616B81;
	margin-left: 10px;
}
</style>
