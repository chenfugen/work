<template>
<div class="userList" style='position:relative'>
	<div v-show='!showInfo' class="userList_main">
		<div class="userList-content">
			<div class="searchBox clearfloat">
				<searchForm ref='searchForm' @handleSearch='getTableData()' :configList='configList' class="left"></searchForm>
			</div>
			<div class="marginLeft">
				<DatePicker placeholder="最近登录时间" type="datetimerange" class="DatePicker" v-model='onlineTime'></DatePicker>
				<DatePicker placeholder="注册时间" type="datetimerange" class="DatePicker marginLeft" v-model='createTime'></DatePicker>
			</div>
			<div class="marginTop">
				<tableComponent v-if='showTable' ref='tableComponent' :columns='columns'></tableComponent>
			</div>
		</div>
	</div>
	<!-- 用户详情 -->
	<div v-show="showInfo" class="infoBox clearfloat">
		<div class="">
			<Button class="marginBottom" @click='showInfo = false'>
				<Icon type="ios-arrow-back" />
				列表
			</Button>
		</div>
		<Card class="left" style="width:30%;display:inline-block;">
			<div class="" slot='title'>基本信息</div>
			<div class="avatar" :style="infoForm.avatar==''?{}:{'backgroundImage':'url('+infoForm.avatar+')'}">
				<Icon type="ios-person" v-show='infoForm.avatar==""' />
			</div>
			<div class="infoBox-nickName">{{dealNullData(infoForm.userNickName)}}</div>
			<Form ref="formCustom" :model="infoForm" :label-width="100" class="infoForm marginTop">
				<FormItem label="手机账号：" class="infoFormItem">
					<span>{{dealNullData(infoForm.phone)}}</span>
				</FormItem>
				<FormItem label="性别：" class="infoFormItem">
					<span>{{dealNullData(infoForm.sex==1?'男':infoForm.sex==2?'女':'--')}}</span>
				</FormItem>
				<FormItem label="注册时间：" class="infoFormItem">
					<span>{{dealNullData(infoForm.createTime)}}</span>
				</FormItem>
				<FormItem label="最近登录时间：" class="infoFormItem">
					<span>{{dealNullData(infoForm.lastOnlineTime)}}</span>
				</FormItem>
				<FormItem label="是否绑定设备：" class="infoFormItem">
					<span class="infoItemBox" :style="{'backgroundColor':infoForm.bindStatus==1?'#2D8CF0':'#515a6e'}">{{infoForm.bindStatus==1?'是':'否'}}</span>
				</FormItem>
				<FormItem label="所在区域：" class="infoFormItem">
					<span>{{dealAddres(infoForm.province,infoForm.city,infoForm.region,infoForm.address)}}</span>
				</FormItem>
			</Form>
		</Card>
		<div class="left marginLeft" style="display:inline-block;width:68%;">
			<Card>
				<div class="" slot='title'>绑定设备</div>
				<tableComponent ref='bindTableComponent' :showSizer='0' :columns='infoColumns' class="marginTop"></tableComponent>
			</Card>
			<Card class="marginTop">
				<div class="" slot='title'>被分享设备</div>
				<tableComponent ref='shareTableComponent' :showSizer='0' :columns='infoColumns' class="marginTop"></tableComponent>
			</Card>
		</div>
	</div>
	<Spin fix v-if='pageLoading'></Spin>
</div>
</template>

<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
export default {
	name: 'userList',
	data() {
		return {
			onlineTime: [],
			createTime: [],
			showTable: false,
			pageLoading: false,
			showInfo: false,
			dialog: false,
			infoForm: {},
			createdFilter: false, // 控制筛选组件延迟加载
			configList: [{
					plh: '手机号码',
					valName: 'phone',
					type: 'input'
				}, { // 筛选组件配置
					plh: '用户昵称',
					valName: 'nickName',
					type: 'input'
				}, {
					plh: '性别',
					width: 80,
					type: 'select',
					valName: 'sex',
					selectList: [{
						value: 1,
						label: '男',
					}, {
						value: 2,
						label: '女',
					}],
					labelName: 'label',
					valueName: 'value',
					label: '性别：',
				},
				// {
				// 	plh: '注册时间',
				// 	type: 'dateRange',
				// },
				{
					plh: '所在区域',
					valName: 'region',
					type: 'region'
				},
				{
					plh: '是否绑定设备',
					width: 120,
					type: 'select',
					valName: 'bindStatus',
					selectList: [{
						value: 0,
						label: '否',
					}, {
						value: 1,
						label: '是',
					}],
					labelName: 'label',
					valueName: 'value',
				},
			],
			columns: [{ // 用户列表h
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '手机号码',
					align: 'center',
					key: 'phone',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.phone))
						]);
					}
				},
				{
					title: '用户昵称',
					align: 'center',
					key: 'nickName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.nickName))
						]);
					}
				},
				{
					title: '性别',
					key: 'sex',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', params.row.sex == 1 ? '男' : params.row.sex == 2 ? '女' : '--')
						]);
					}
				},
				{
					title: '注册时间',
					align: 'center',
					key: 'createTime',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
						]);
					}
				},
				{
					title: '最近登录时间',
					align: 'center',
					key: 'lastOnlineTime',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.lastOnlineTime))
						]);
					}
				},
				{
					title: '所在区域',
					align: 'center',
					key: 'region',
					width: 120,
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealRegion(params.row.province, params.row.city, params.row.region))
						]);
					}
				},
				{
					title: '是否绑定设备',
					align: 'center',
					key: 'bindStatus',
					render: (h, params) => {
						return h('div', [
							h('div', {
								style: {
									margin: '0 auto',
									height: '20px',
									width: '50px',
									backgroundColor: params.row.bindStatus == 1 ? '#2D8CF0' : '#616B81',
									color: '#fff',
									borderRadius: '10px',
									lineHeight: '20px'
								}
							}, params.row.bindStatus == 1 ? '是' : '否')
						]);
					}
				}, {
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
										this.handleDelete(params.row)
									}
								}
							}, '删除'),
						]);
					}
				}
			],
			infoColumns: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '产品名称',
					key: 'productName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.productName))
						]);
					}
				},
				{
					title: '设备名称',
					key: 'deviceName',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.deviceName))
						]);
					}
				},
				{
					title: '版本号',
					key: 'firmwareVersion',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.firmwareVersion))
						]);
					}
				},
				{
					title: '添加时间',
					key: 'createTime',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
						]);
					}
				},
				{
					title: '绑定类型',
					key: 'bindType',
					render: (h, params) => {
						return h('div', [
							h('div', params.row.bindType == 1 ? '绑定' : params.row.bindType == 2 ? '分享' : '--')
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleUnBindDevice(params.row)
									}
								}
							}, '解绑'),
						]);
					}
				}
			]
		}
	},
	created() {},
	mounted() {
		if (this.$store.state.user.userName == 'root') {
			this.configList.splice(2, 0, {
				plh: '所属委托商',
				valName: 'partnerId',
				type: 'select',
				labelName: 'partnerName',
				valueName: 'partnerId',
				keyName: 'key',
				selectList:JSON.parse(sessionStorage.getItem("partners")),
			})
			this.columns.splice(2, 0, {
				title: '所属委托商商',
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
	},
	components: {
		searchForm,
		tableComponent
	},
	methods: {
		// 获取表格图片
		getTableData() {
			let para = this.$refs.searchForm.handleSubmit()
			if (this.createTime[0] != '') {
				para.startCreateTime = this.dealTime(this.createTime[0])
				para.endCreateTime = this.dealTime(this.createTime[1])
			} else {
				delete para.startCreateTime
				delete para.endCreateTime
			}
			if (this.onlineTime[0] != '') {
				para.startOnlineTime = this.dealTime(this.onlineTime[0])
				para.endOnlineTime = this.dealTime(this.onlineTime[1])
			} else {
				delete para.startOnlineTime
				delete para.endOnlineTime
			}
			this.$refs.tableComponent.getData(this.$api.manage_user_list, para, true)
		},
		// 获取详细信息
		getInfo(row) {
			this.pageLoading = true
			let api = this.$api.manage_user_detail
			let para = {
				id: row.id,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.infoForm = res.data.userDetail
				this.infoForm.userId = row.id
				this.showInfo = true
				this.getBindDeviceList()
				this.getShareDeviceList()
				this.pageLoading = false
			}).catch(err => {
				/* eslint-disable */
				console.log(err)
				/* eslint-enable */
			})
		},
		// 获取绑定设备列表
		getBindDeviceList() {
			let para = {
				userId: this.infoForm.userId,
				bindType: 1,
			}
			this.$refs.bindTableComponent.getData(this.$api.manage_user_getUserDeviceList, para, true)
		},
		// 获取分享设备列表
		getShareDeviceList() {
			let para = {
				userId: this.infoForm.userId,
				bindType: 2,
			}
			this.$refs.shareTableComponent.getData(this.$api.manage_user_getUserDeviceList, para, true)
		},
		// 解绑设备
		handleUnBindDevice(row) {
			this.$Modal.confirm({
				title: '警告',
				content: '确认解绑该设备(' + row.deviceName + ')',
				onOk: () => {
					let api = this.$api.manage_user_removeUserDevice
					let para = {
						userId: this.infoForm.userId,
						deviceId: row.deviceId,
						bindType: row.bindType
					}
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success('解绑成功');
						} else {
							this.$Message.success(res.message);
						}
						this.getBindDeviceList()
						this.getShareDeviceList()
					}).catch(err => {
						// eslint-disable-next-line
						console.log(err)
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 新增
		handleAdd() {},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 删除用户
		handleDelete(row) {
			this.$Modal.confirm({
				title: '警告',
				content: '确认删除该用户(' + row.phone + ')',
				onOk: () => {
					let api = this.$api.manage_user_delete
					let para = {
						id: row.id,
					}
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success('删除成功');
						} else {
							this.$Message.success(res.message);
						}
						this.getTableData()
					}).catch(err => {
						// eslint-disable-next-line
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.info('已取消');
				}
			});
		},
		// 处理空数据
		dealNullData(data) { // 租期
			return this.$Utils.dealNullData(data)
		},
		// 处理地区方法
		handleDealRegion(province, city, region) {
			let name = ''
			if (province == city) {
				name = province
			} else {
				name = province + city
			}
			name = name + region
			return name == 0 ? '--' : name
		},
		// 处理版本号格式
		handleDealVersion(ver) {
			if (ver.indexOf(".") != -1) {
				return ver
			} else {
				ver = Number(ver)
				if (ver == 0) {
					return '--'
				} else {
					return '0.0.' + ver
				}
			}
		},
		dealAddres(province, city, region, address) {
			let str = ''
			if (province != null) {
				str = str + province
			}
			if (city != null) {
				str = str + city
			}
			if (region != null) {
				str = str + region
			}
			if (address != null) {
				str = str + address
			}
			return str
		}
	}
}
</script>

<style scoped>
.userList-content {
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.searchBox {
	margin-left: 20px;
}

.actBox {
	margin-left: 20px;
}

.searchBtn {
	padding: 1px 6px;
	font-size: 18px;
}


.avatar {
	margin: 0 auto;
	margin-top: 32px;
	text-align: center;
	line-height: 120px;
	width: 144px;
	height: 144px;
	border-radius: 72px;
	font-size: 100px;
	border: 1px solid #ECF0F7;
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.infoBox-nickName {
	text-align: center;
}

.infoBox-nickName {
	font-size: 16px;
	color: #3F4656;
	margin-top: 16px;
}

.infoItemBox {
	display: inline-block;
	width: 32px;
	height: 20px;
	border-radius: 12px;
	color: white;
	text-align: center;
	line-height: 20px;
}
</style>
