<template>
	<div class="deviceInfo clearfloat">
		<Card class="clearfloat">
			<div class="left marginTop" style="font-size: 16px;font-family:PingFang-SC-Bold;color: #3F4656;">{{infoForm.deviceName}}</div>
			<div class="left DI-deviceStatusBox DI-nice marginTop marginLeft">正常</div>
			<div class="left DI-deviceStatusBox marginTop marginLeft" :style="{'background':infoForm.status=='online'?'#2D8CF0':'#999'}">{{(infoForm.status=='online')?'在线':'离线'}}</div>
			<!-- <div class="right DI-signal-icon" style="text-align:center;">
			<div class="" style="margin-top:10px;color:#999">178</div>
			<div class="" style="color:#999;">租期剩余</div>
		</div> -->
			<!-- <i-circle :percent="80" class="right marginLeft" stroke-color='#999' :stroke-width='20' style="width:65px;height:65px;">
		</i-circle> -->
			<div class="right DI-signal-icon" style="text-align:center;">
				<div class="" style="margin-top:10px;color:#999">{{propertyInfo.rssi}}</div>
				<div class="" style="color:#999;">信号强度</div>
			</div>
			<div v-if='propertyInfo.rssi<signalScope[1]' class="right DI-signal-icon DI-signal-png-1"></div>
			<div v-if='propertyInfo.rssi>=signalScope[1]&&propertyInfo.rssi<signalScope[0]' class="right DI-signal-icon DI-signal-png-2"></div>
			<div v-if='propertyInfo.rssi>=signalScope[0]' class="right DI-signal-icon DI-signal-png-3"></div>
		</Card>
		<!-- <Card>
	</Card>
	<Card class="marginTop">
		<div>运行状态</div>
		<Row type="flex" justify="space-around" class="marginTop">
			<Col v-for='(item,index) in staticData.statusCardConfig' :key='index' :span="Math.floor(24/staticData.statusCardConfig.length)">
			<div class="status-card-item">
				<div class="status-card-lable">{{item.label}}</div>
				<div class="status-card-value">{{item.value}}</div>
			</div>
			</Col>
		</Row>
	</Card> -->
		<Card class="left marginTop" style="width:35%;">
			<div class="" slot='title'>基本信息</div>
			<Form ref="deviceForm" :model="deviceForm" :label-width='120'>
				<FormItem v-for='(item,index) in staticData.dialogInfoConf' :label='item.label' :key='index' class="formItem">
					<span v-if='item.valName!="province"&&item.valName!="status"'>{{dealNullData(infoForm[item.valName])}}</span>
					<span v-if='item.valName=="status"'>{{(infoForm.status=='online')?'在线':'离线'}}</span>
					<span v-if='item.valName=="province"'>{{dealNullData(infoForm[item.valName])}} {{dealNullData(infoForm.city)}}</span>
				</FormItem>
			</Form>
		</Card>
		<Card class="right marginTop" style="width:60%;" v-if='showProgress'>
			<div slot='title'>滤芯信息</div>
			<div class="" v-for='(item,index) in filterInfo'>
				<span class="deviceInfoFilterName">{{item.name}}：</span>
				<Progress :key='index' :percent="item.value" class="deviceInfoProgress" :status="item.status||'active'" hide-info />
				{{item.value}}%
			</div>
		</Card>
		<Card class="right marginTop" style="width:60%;">
			<div class="marginTop">
				<tableComponent ref='deviceTableComponent' :columns='staticData.columns' :showSizer='0' :showBatchDel='false'></tableComponent>
			</div>
		</Card>
		<!-- <Card class="marginTop">
		<Form v-for='(item,index) in filterInfoForm' :key='index'>
			<FormItem :label='item.label'>
				<Progress :percent="item.value" status="active" />
			</FormItem>
		</Form>
	</Card> -->
	</div>
</template>
<script>
	import staticData from '@/staticData/static_deviceInfo.js'
	import tableComponent from '@/components/tableComponent.vue'
	export default {
		name: 'deviceInfo',
		data() {
			return {
				showProgress: false,
				staticData,
				signalScope: [],
				id: '',
				netType: '',
				propertyInfo: {},
				infoForm: {},
				filterInfoForm: [],
				deviceForm: {},
				filterInfo: [],
			}
		},
		props: {
			configList: Array,
		},
		components: {
			tableComponent
		},
		// 2G 6,2  wifi 22,10
		methods: {
			// 获取设备详情
			getDeviceInfo(id, netType) {
				this.id = id
				this.netType = netType
				let api = this.$api.manage_device_detail,
					para = {
						id: this.id
					}
				this.$Ax.get(api, {
					params: para
				}).then(res => {
					this.infoForm = res.data.device
					this.filterInfoForm = res.data.filter
					for (let i in this.infoForm) {
						if (i == 'activeTime' || i == 'createTime' || i == 'onlineTime') {
							this.infoForm[i] = this.dealNullData(this.infoForm[i])
						}
					}
					this.getUserList()
					let value = ''
					this.filterInfo = []
					for (let i in res.data.property) {
						if (i.indexOf("filter") != -1) {
							value = res.data.property[i].value
							this.filterInfo.push({
								name: i,
								value: value,
								status: value < 11 ? 'wrong' : 11 <= value && 100 > value ? 'primary' : 'active'
							})
						}
						this.propertyInfo[i] = res.data.property[i].value
					}
				}).catch(err => {
					/* eslint-disable */
					console.log(err);
					/* eslint-enable */
				}).then(() => {
					this.showProgress = true
				})
			},
			// 获取设备用户数据
			getUserList() {
				let para = {
					deviceId: this.id
				}
				this.$refs.deviceTableComponent.getData(this.$api.manage_device_detail_getUserList, para, true)
			},
			// 处理空数据
			dealNullData(data) {
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
	.status-card-item {
		color: #192639;
		width: 100%;
		height: 200px;
		border: 2px solid #192639;
		border-radius: 10px;
	}

	.status-card-lable {
		width: 100%;
		height: 60px;
		border-bottom: 2px solid #192639;
		line-height: 60px;
		text-align: center;
	}

	.status-card-value {
		width: 100px;
		height: 100px;
		font-size: 18px;
		line-height: 100px;
		text-align: center;
		border: 2px solid #192639;
		border-radius: 50px;
		margin: 0 auto;
		margin-top: 20px;
	}

	.DI-signal-icon {
		width: 65px;
		height: 65px;
		margin-bottom: 16px;
		background-size: 100% 100%;
	}

	.DI-signal-png-1 {
		background-image: url(../../assets/signal_1.png)
	}

	.DI-signal-png-2 {
		background-image: url(../../assets/signal_2.png)
	}

	.DI-signal-png-3 {
		background-image: url(../../assets/signal_3.png)
	}

	.deviceInfo .demo-Circle-inner {
		display: none;
	}

	.DI-deviceStatusBox {
		width: 44px;
		height: 20px;
		border-radius: 20px;
		color: white;
		text-align: center;
		font-size: 10px;
		line-height: 20px;
	}

	.DI-nice {
		background: #5FD487 100%;
	}

	.formItem {
		margin-bottom: 0 !important;
	}

	.deviceInfoProgress {
		width: 80%;
	}

	.deviceInfoFilterName {
		display: inline-block;
		width: 10%;
	}
</style>
