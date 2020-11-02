<template>
<div id="deviceOnlineInfo">
	<span style="margin-bottom:50px;display:block;" class="title">{{infoData.productName}}</span>
	<div>
		<div class="clearfloat">
			<span class="title">固件信息</span>
			<Divider style='margin-bottom:30px;' />
		</div>
		<div class="clearfloat" style='position:relative;'>
			<Form label-position="right" :label-width="100" inline>
				<FormItem label="MAC地址：" style="width:45%">
					<span>{{dealData(infoData.mac)}}</span>
				</FormItem>
				<FormItem label="SN码：" style="width:45%">
					<span>{{dealData(infoData.snCode)}}</span>
				</FormItem>
				<FormItem label="通信类型：" style="width:45%">
					<span>{{dealData(infoData.netType)}}</span>
				</FormItem>
				<FormItem label="模块型号：" style="width:45%">
					<span>{{dealData(infoData.moduleType)}}</span>
				</FormItem>
				<FormItem label="固件版本：" style="width:45%">
					<span>{{dealData(infoData.firmwareVersion)}}</span>
				</FormItem>
			</Form>
		</div>
		<div class="clearfloat">
			<span class="title">秘钥信息</span>
			<Divider style='margin-bottom:30px;' />
		</div>
		<div class="clearfloat" style='position:relative;'>
			<Form label-position="right" :label-width="100" inline>
				<FormItem label="ProductKey：" style="width:45%">
					<span>{{dealData(infoData.productKey)}}</span>
				</FormItem>
				<FormItem label="ProductSecret：" style="width:45%">
					<span>{{dealData(infoData.productSecret)}}</span>
				</FormItem>
				<FormItem label="DeviceName：" style="width:45%">
					<span>{{dealData(infoData.deviceName)}}</span>
				</FormItem>
				<FormItem label="DeviceSecret：" style="width:45%">
					<span>{{dealData(infoData.deviceSecret)}}</span>
				</FormItem>
			</Form>
		</div>
		<div class="clearfloat">
			<span class="title">已配置设备属性</span>
			<Divider style='margin-bottom:30px;' />
			<Table :columns="columns" :loading='tableLoading' :data="listData" border></Table>
		</div>
	</div>
	<Spin v-if='pageLoading' fix></Spin>
</div>
</template>
<script>
export default {
	name: 'deviceOnlineInfo',
	data() {
		return {
			pageLoading: false,
			tableLoading: false,
			infoData: {
				mac: '',
				firmType: '',
				sncode: '',
				firmVersion: '',
				netType: '',
				deviceId: '',
				productSecret: '',
				deviceName: '',
				deviceSecret: '',
			},
			columns: [{
					title: '属性名称',
					align: 'center',
					key: 'name'
				},
				{
					title: '属性内容',
					key: 'name',
					align: 'center',
					width: 300,
					render: (h, params) => {
						return h('div', [
							h('div', JSON.stringify(params.row.dataType.specs)),
						]);
					}
				},
				{
					title: '属性标准值',
					key: 'standard',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', {}, (params.row.dataType.type == 'int' || params.row.dataType.type == 'enum') ? JSON.stringify(params.row.standard) : params.row.standard)
						]);
					}
				},
			],
			listData: [],
			productList: [{
					label: '产品A',
					value: 'A'
				}, {
					label: '产品B',
					value: 'B'
				},
				{
					label: '产品C',
					value: 'C'
				}
			],
			productInfo: {
				productName: '测试产品1',
			},
		}
	},
	mounted() {
		if (this.$route.query.deviceId) {
			this.deviceId = this.$route.query.deviceId
			this.getInfoData()
		} else {
			this.$router.push({
				path: '/device/deviceOnline',
				name: 'deviceOnline',
			});
		}
	},
	methods: {
		getInfoData() {
			this.pageLoading = true
			let api = this.$api.manage_device_detail
			let para = {
				id: this.deviceId
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.infoData = res.data.data.deviceDetail
				this.listData = res.data.data.filterDetail == null ? [] : res.data.data.filterDetail
				this.pageLoading = false
				this.getProductInfo()
			}).catch(err => {
				console.log(err);
			})
		},
		dealData(data) {
			if (data == null || data == '') {
				return '--'
			} else {
				return data
			}
		},
		getProductInfo() {
			this.loading = true
			let api = this.$api.manage_product_detail
			let para = {
				productKey: this.infoData.productKey
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.propertiesList = []
				if (res.data.data.properties.length > 0) {
					let list = JSON.parse(res.data.data.properties)
					this.listData = []
					for (let i in list) {
						if (list[i].check) {
							this.listData.push(list[i])
						}
					}
				}
				this.loading = false
			}).catch(err => {
				console.log(err);
			})
		}
	}
}
</script>
<style scoped>
.title {
	font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
	font-weight: 700;
	font-style: normal;
	color: #000000;
}
</style>
