<template>
<div id="chanceStart">
	<!-- —————————————————————————— 基本信息 ——————————————————————————— -->
	<Collapse style="margin-bottom:30px;">
		<Panel name="baseInfo">
			<div class="info-line" style="">
				<span>基本信息</span>
				<span style="margin-left:10%;">产品名称:<span class="blueTitle">&nbsp{{dealData(missionInfo.productName)}}</span></span>
				<span style="margin-left:10%;">生产进度:</span>
				<span class="blueTitle">&nbsp{{dealData(missionInfo.finishedTotal)}}/{{dealData(missionInfo.planTotal)}}</span>
			</div>
			<div slot="content" class="clearfloat">
				<Form :model="form" class="clearfloat" label-position="right" :label-width="120" inline>
					<div class="left" style="width:33%;">
						<FormItem label='工单号:' style="width:100%;">
							<span>{{dealData(missionInfo.workOrderCode)}}</span>
						</FormItem>
						<FormItem label='产品名称:' style="width:100%;">
							<span>{{dealData(missionInfo.productName)}}</span>
						</FormItem>
						<FormItem label='ERP编码:' style="width:100%;">
							<span>{{dealData(missionInfo.erpCode)}}</span>
						</FormItem>
						<FormItem label='计划生产数量:' style="width:100%;">
							<span>{{dealData(missionInfo.planTotal)}}</span>
						</FormItem>
					</div>
					<div class="left" style="width:33%;">
						<FormItem label='已生产数量:' style="width:100%;">
							<span>{{dealData(missionInfo.finishedTotal)}}</span>
						</FormItem>
						<FormItem label='创建时间:' style="width:100%;">
							<span>{{dealData(missionInfo.createTime)}}</span>
						</FormItem>
						<FormItem label='创建人:' style="width:100%;">
							<span>{{dealData(missionInfo.userName)}}</span>
						</FormItem>
						<FormItem label='最后生产时间:' style="width:100%;">
							<span>{{dealData(missionInfo.updateTime)}}</span>
						</FormItem>
					</div>
					<div class="left" style="width:33%;">
						<FormItem label='操作员:' style="width:100%;">
							<span>{{dealData(missionInfo.userName)}}</span>
						</FormItem>
						<FormItem label='工厂:' style="width:100%;">
							<span>{{dealData(missionInfo.factoryName)}}</span>
						</FormItem>
						<FormItem label='生产状态:' style="width:100%;">
							<span>{{missionInfo.status == 0 ? '新建' : missionInfo.status == 1 ? '进行中' : '结束'}}</span>
						</FormItem>
					</div>
				</Form>
			</div>
		</Panel>
	</Collapse>
	<div class="clearfloat">
		<div class="clearfloat infoBox">
			<div class="left" style="width:50%;text-align:center;">
				<span>今日已完成 <i class="textBlue">{{dealData(todayTotal)}}</i></span>
			</div>
			<div class="left" style="width:50%;text-align:center;">
				<span>已完成总量 <i class="textBlue">{{dealData(missionInfo.finishedTotal)}}</i></span>
			</div>
		</div>
	</div>
	<div v-show='!showMore' class="clearfloat">
		<!-- —————————————————————————— 设备检测 ——————————————————————————— -->
		<span>扫描设备</span>
		<Divider />
		<Collapse class="collapse" :style="inputBG">
			<Panel name="now" class="clearfloat" style="position:relative;">
				<Form ref="form" :model="form" :rules="rule" label-position="right" style="display:inline-block;margin-top:2px;width:95%;" :label-width="70" inline class="clearfloat">
					<FormItem prop="mac" label='MAC地址:' style="width:350px;">
						<Input ref='macInput' v-model="form.mac" :disabled='macDisable' id='macInput' class="input macInput" @on-enter='handleCheckMAC' style="height:100px;"></Input>
					</FormItem>
					<FormItem prop="snCode" label='SN码:'>
						<Input ref='snInput' v-model="form.snCode" id='snInput' :disabled='snDisable' @on-enter='handleCheckSn' class="input snInput"></Input>
					</FormItem>
					<FormItem prop="snCode" class="right" label='检测结果:'>
						<span v-if='checkStatus=="0"' style="font-size:25px;color:#fff;">未开始检测</span>
						<span v-if='checkStatus=="1"' style="font-size:20px;color:#fff;">正在检测</span>
						<span v-if='checkStatus=="2"' style="font-size:20px;color:#fff;">检测失败，设备未响应</span>
						<span v-if='checkStatus=="3"' style="color: #fff;font-size:20px">未通过</span>
						<span v-if='checkStatus=="4"' style="color: #fff;font-size:20px">通过</span>
						<span v-if='checkStatus=="3"' style="font-size:20px;color:#fff;">{{errorMSG}}</span>
					</FormItem>
				</Form>
				<div slot="content" class="clearfloat">
					<!-- —————————————————————————— 固件检测 ——————————————————————————— -->
					<span class="title">固件检测</span>
					<span class="right marginRight" style="color:blue" v-if='firmCheckStatus'>{{firmCheckTxt}}</span>
					<span class="right marginRight" style="color:red" v-else>{{firmCheckTxt}}</span>
					<Divider />
					<Form :model="form" class="clearfloat" label-position="right" style="position:relative" :label-width="100" inline>
						<FormItem label='MAC地址:' style="width:48%;">
							<span>{{form.mac}}</span>
						</FormItem>
						<FormItem label='SN码:' style="width:48%;">
							<span>{{form.snCode}}</span>
						</FormItem>
						<FormItem label='通信类型:' style="width:48%;">
							<span>{{checkNowData.profile.type}}</span>
						</FormItem>
						<FormItem prop="sncode" style="width:48%;" label='模块型号:'>
							<span>{{checkNowData.profile.moduleType}}</span>
						</FormItem>
						<FormItem prop="sncode" style="width:48%;" label='固件版本:'>
							<span>{{checkNowData.profile.softVersion}}</span>
						</FormItem>
						<Spin fix v-if='checkHardLoading'></Spin>
					</Form>
					<!-- —————————————————————————— 秘钥 ——————————————————————————— -->
					<span class="title">秘钥检测</span>
					<span class="right marginRight" style="color:blue;" v-if='keyCheckStatus'>{{keyCheckTxt}}</span>
					<span class="right marginRight" style="color:red;" v-else>{{keyCheckTxt}}</span>
					<Divider />
					<Form :model="form" class="clearfloat" style="position:relative" label-position="right" :label-width="100" inline>
						<FormItem label='ProductKey:' style="width:48%;">
							<span>{{checkNowData.quad.productKey}}</span>
						</FormItem>
						<FormItem label='ProductSecret:' style="width:48%;">
							<span>{{checkNowData.quad.productSecret}}</span>
						</FormItem>
						<FormItem prop="deviceName" style="width:48%" label='DeviceName:'>
							<span>{{checkNowData.quad.deviceName}}</span>
						</FormItem>
						<FormItem prop="deviceSecret" style="48%" label='DeviceSecret:'>
							<span>{{checkNowData.quad.deviceSecret}}</span>
						</FormItem>
						<Spin fix v-if='checkkeyLoading'></Spin>
					</Form>
					<!-- —————————————————————————— 属性 ——————————————————————————— -->
					<span class="title">设备属性</span>
					<span class="right marginRight" style="color:blue" v-if='attCheckStatus'>{{attCheckTxt}}</span>
					<span class="right marginRight" style="color:red" v-else>{{attCheckTxt}}</span>
					<Divider />
					<Table border stripe :columns="columns" :loading='checkTableLoading' :data="listData"></Table>
				</div>
			</Panel>
		</Collapse>
		<!-- —————————————————————————— 历史记录 ——————————————————————————— -->
		<div class="" style="position:relative">
			<span>历史记录</span>
			<Divider />
			<Collapse :value='activeCollapse' @on-change='handleChangePanel'>
				<Panel v-for='(item, index) in listHistory' :key='item.id' :name="item.id" style="position:relative;" class="clearfloat">
					<span class="">MAC地址:{{item.mac}}</span>
					<span class="" style="position:absolute;left:300px;">SN码:{{item.snCode}}</span>
					<span class="" style="position:absolute;left:550px;">检测时间:{{item.checkTime}}</span>
					<span v-if='item.checkStatus=="1"' style="color:blue" class="right marginRight">通过</span>
					<span v-else style="color:red" class="right marginRight">未通过</span>
					<div slot="content" class="clearfloat" style="position:relative;">
						<!-- —————————————————————————— 固件检测 ——————————————————————————— -->
						<span class="title">固件检测</span>
						<span class="right marginRight" style="color:blue" v-if='historyInfoData.result.firmCheckStatus'>{{historyInfoData.result.firmCheckTxt}}</span>
						<span class="right marginRight" style="color:red" v-else>{{historyInfoData.result.firmCheckTxt}}</span>
						<Divider />
						<Form :model="form" class="clearfloat" label-position="right" :label-width="100" inline>
							<FormItem label='MAC地址:' style="width:48%;">
								<span>{{historyInfoData.mac}}</span>
							</FormItem>
							<FormItem label='SN码:' style="width:48%;">
								<span>{{historyInfoData.snCode}}</span>
							</FormItem>
							<FormItem label='通信类型:' style="width:48%;">
								<span>{{historyInfoData.firmwareVersionDetail.type}}</span>
							</FormItem>
							<FormItem style="width:48%" label='模块型号:'>
								<span>{{historyInfoData.firmwareVersionDetail.moduleType}}</span>
							</FormItem>
							<FormItem prop="softVersion" style="width:48%;" label='固件版本:'>
								<span>{{historyInfoData.firmwareVersionDetail.softVersion}}</span>
							</FormItem>
						</Form>
						<!-- —————————————————————————— 秘钥检测 ——————————————————————————— -->
						<span class="title">秘钥检测</span>
						<span class="right marginRight" style="color:blue;" v-if='historyInfoData.result.keyCheckStatus'>{{historyInfoData.result.keyCheckTxt}}</span>
						<span class="right marginRight" style="color:red;" v-else>{{historyInfoData.result.keyCheckTxt}}</span>
						<Divider />
						<Form :model="form" class="clearfloat" label-position="right" :label-width="100" inline>
							<FormItem label='ProductKey:' style="width:48%;">
								<span>{{historyInfoData.secretCheckDetail.productKey}}</span>
							</FormItem>
							<FormItem label='ProductSecret:' style="width:48%;">
								<span>{{historyInfoData.secretCheckDetail.productSecret}}</span>
							</FormItem>
							<FormItem style="width:48%;" label='DeviceName:'>
								<span>{{historyInfoData.secretCheckDetail.deviceName}}</span>
							</FormItem>
							<FormItem style="width:48%;" label='DeviceSecret:'>
								<span>{{historyInfoData.secretCheckDetail.deviceSecret}}</span>
							</FormItem>
						</Form>
						<!-- —————————————————————————— 属性检测 ——————————————————————————— -->
						<span class="title">设备属性</span>
						<span class="right marginRight" style="color:blue" v-if='historyInfoData.result.attCheckStatus'>{{historyInfoData.result.attCheckTxt}}</span>
						<span class="right marginRight" style="color:red" v-else>{{historyInfoData.result.attCheckTxt}}</span>
						<Divider />
						<Table border stripe :columns="columns" :data="listAtt"></Table>
					</div>
				</Panel>
			</Collapse>
			<Button @click='getHistoryListTable' class="marginTop" type="text" name="button">更多记录</Button>
			<Spin fix v-if='panelLoading' large></Spin>
		</div>
	</div>
	<!-- 历史更多数据 -->
	<div v-show='showMore' class="">
		<Button @click='hanldeBack' class="marginTop" type="text" name="button">
			<Icon :size='25' type="ios-arrow-back" />返回</Button>
		<Table :loading='historyTableLoading' :columns="columnsHistory" :data="listHistory" border></Table>
		<Page :current='pageNum' :total="total" :page-size='pageSize' @on-change='flip' @on-page-size-change='handleChangePageSize' size="small" :page-size-opts='[10,20,30,40]' class="right marginTop" show-total show-elevator show-sizer />
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" title="详细信息" :loading='dialogLoading' width='80' style="position:relative;">
		<div class="clearfloat" style="position:relative;">
			<!-- —————————————————————————— 固件检测 ——————————————————————————— -->
			<span class="title">固件检测</span>
			<span class="right marginRight" style="color:blue" v-if='historyInfoData.result.firmCheckStatus'>{{historyInfoData.result.firmCheckTxt}}</span>
			<span class="right marginRight" style="color:red" v-else>{{historyInfoData.result.firmCheckTxt}}</span>
			<Divider />
			<Form :model="form" class="clearfloat" label-position="right" :label-width="100" inline>
				<FormItem label='MAC地址:' style="width:48%;">
					<span>{{historyInfoData.mac}}</span>
				</FormItem>
				<FormItem label='SN码:' style="width:48%;">
					<span>{{historyInfoData.snCode}}</span>
				</FormItem>
				<FormItem label='通信类型:' style="width:48%;">
					<span>{{historyInfoData.firmwareVersionDetail.type}}</span>
				</FormItem>
				<FormItem style="width:48%;" label='模块型号:'>
					<span>{{historyInfoData.firmwareVersionDetail.moduleType}}</span>
				</FormItem>
				<FormItem prop="softVersion" style="width:48%;" label='固件版本:'>
					<span>{{historyInfoData.firmwareVersionDetail.softVersion}}</span>
				</FormItem>
			</Form>
			<!-- —————————————————————————— 秘钥检测 ——————————————————————————— -->
			<span class="title">秘钥检测</span>
			<span class="right marginRight" style="color:blue;" v-if='historyInfoData.result.keyCheckStatus'>{{historyInfoData.result.keyCheckTxt}}</span>
			<span class="right marginRight" style="color:red;" v-else>{{historyInfoData.result.keyCheckTxt}}</span>
			<Divider />
			<Form :model="form" class="clearfloat" label-position="right" :label-width="100" inline>
				<FormItem label='ProductKey:' style="width:48%;">
					<span>{{historyInfoData.secretCheckDetail.productKey}}</span>
				</FormItem>
				<FormItem label='ProductSecret:' style="width:48%;">
					<span>{{historyInfoData.secretCheckDetail.productSecret}}</span>
				</FormItem>
				<FormItem style="width:48%;" label='DeviceName:'>
					<span>{{historyInfoData.secretCheckDetail.deviceName}}</span>
				</FormItem>
				<FormItem style="width:48%;" label='DeviceSecret:'>
					<span>{{historyInfoData.secretCheckDetail.deviceSecret}}</span>
				</FormItem>
			</Form>
			<!-- —————————————————————————— 属性检测 ——————————————————————————— -->
			<span class="title">设备属性</span>
			<span class="right marginRight" style="color:blue" v-if='historyInfoData.result.attCheckStatus'>{{historyInfoData.result.attCheckTxt}}</span>
			<span class="right marginRight" style="color:red" v-else>{{historyInfoData.result.attCheckTxt}}</span>
			<Divider />
			<Table border stripe :columns="columns" :data="listAtt"></Table>
		</div>
	</Modal>
</div>
</template>
<script>
export default {
	name: "chanceStart",
	data() {
		return {
			isCount: false, // 订阅标识
			checkStatus: '0', // 本次检测标识
			errorMSG: '', // 本次检测错误文档
			ws: null, // websorket对象
			timer: null, // 定时器对象
			hbTimer: null, // 心跳定时器
			snDisable: true, // 扫描取SN码输入框是否可输入
			macDisable: false, // 扫描取MAC地址输入框是否可输入
			checkStart: false, // 当前是否为检测状态
			panelLoading: false, // 历史记录折叠框内loading
			checkTableLoading: false, // 检测折叠框内————表格是否为loading
			checkkeyLoading: false, // 检测折叠框内————秘钥检测是否为loading
			checkHardLoading: false, // 检测折叠框内————固件检测是否为loading
			tableLoading: false, //历史纪录表格loading
			missionId: '', // 当前任务ID
			taskProductKey: '', // 当前任务PK
			todayTotal: '',
			checkNowData: { // 设备上报信息
				data: [],
				profile: {},
				quad: {},
			},
			activeCollapse: [], // 控制折叠框的打开
			firmCheckTxt: '', // 控制固件检测显示文本
			firmCheckStatus: true, // 控制固件检测显示文本
			keyCheckTxt: '', // 控制秘钥检测显示文本
			keyCheckStatus: true, // 控制固件检测显示文本
			attCheckTxt: '', // 控制属性检测显示文本
			attCheckStatus: true, // 控制固件检测显示文本
			rule: {}, // 表单验证规则
			inputBG: { // 输入框颜色
				marginBottom: '40px',
				minWidth: '940px',
				border: '',
			},
			missionInfo: { // 当前任务具体信息
				name: '吉祥三宝厨下机',
				readyCount: 0,
				totalCount: 0,
			},
			form: { // 扫描表单数据
				mac: '',
				snCode: '',
			},
			lastCheckForm: {
				mac: '',
				snCode: '',
			},
			historyInfoData: { // 历史记录具体信息表单
				checkStatus: '',
				checkTime: '',
				checkUserId: '',
				checkUserName: '',
				createTime: '',
				deviceId: '',
				deviceName: '',
				firmwareVersionDetail: {},
				id: '',
				mac: '',
				propertiesDetail: {},
				secretCheckDetail: {},
				snCode: '',
				updateTime: '',
				result: {},
			},
			listData: [], // 表格数据
			listAtt: [],
			columns: [{ // 表格配置
					title: '属性名称',
					key: 'propertiesKey',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.propertiesKey == '' || params.row.propertiesKey == null) ? '--' : params.row.propertiesKey),
						]);
					}
				},
				{
					title: '实际上报值',
					key: 'reportValue',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.reportValue == '' || params.row.reportValue == null) ? '--' : params.row.reportValue),
						]);
					}
				},
				{
					title: '合格值',
					key: 'standardValue',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.standardValue == '' || params.row.standardValue == null) ? '--' : params.row.standardValue),
						]);
					}
				},
				{
					title: '备注',
					key: 'mark',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.mark == '' || params.row.mark == null) ? '--' : params.row.mark),
						]);
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', {
								style: {
									color: params.row.status == '1' ? 'blue' : 'red'
								}
							}, params.row.status == '1' ? '通过' : '未通过'),
						]);
					}
				},
			],
			// ------更多历史记录变量--------
			historyTableLoading: false,
			pageNum: 1, // 隶属记录表格分页
			pageSize: 10, // 隶属记录表格分页
			total: 0, // 隶属记录表格分页
			showMore: false, // 控制显示更多历史记录
			dialog: false,
			dialogLoading: false,
			listHistory: [], // 历史记录数据
			columnsHistory: [{ // 表格配置
					title: 'MAC',
					key: 'mac',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', dealData(params.row.mac)),
						]);
					}
				},
				{
					title: 'SN',
					key: 'snCode',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', dealData(params.row.snCode)),
						]);
					}
				},
				{
					title: '检测时间',
					key: 'checkTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', dealData(params.row.checkTime)),
						]);
					}
				},
				{
					title: '检测结果',
					key: 'checkStatus',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', {
								style: {
									color: params.row.checkStatus == '1' ? 'blue' : 'red'
								}
							}, params.row.checkStatus == '1' ? '通过' : '未通过'),
						]);
					}
				},
				{
					title: '操作',
					key: 'checkStatus',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary'
								},
								on: {
									click: () => {
										this.getInfo(params.row)
									}
								},
							}, '详细'),
						]);
					}
				}
			]
		}
	},
	mounted() {
		this.changeInputStyle()
		if (this.$route.query.id) {
			this.missionId = this.$route.query.id
			this.taskProductKey = this.$route.query.taskProductKey
			this.refreshProductList()
			this.startChance()
		} else {
			this.$router.push({
				push: '/',
				name: 'chance',
			})
		}
	},
	beforeDestroy() {
		if (this.ws != null) {
			this.ws.close()
			window.clearTimeout(this.timer)
			window.clearInterval(this.hbTimer)
		}
	},
	methods: {
		changeInputStyle() { // 动态修改input样式
			let header = document.getElementsByClassName('collapse')[0].children[0].children[0]
			header.style.height = '70px'
			let macInput = document.getElementById('macInput').children[2]
			macInput.style.height = '60px'
			macInput.style.width = '300px'
			macInput.style.fontSize = '33px'
			let snInput = document.getElementById('snInput').children[2]
			snInput.style.height = '60px'
			snInput.style.width = '400px'
			snInput.style.fontSize = '33px'
		},
		refreshProductList() {
			let api = this.$api.manage_product_refreshProduct
			this.$Ax.get(api).then(res => {
				console.log(res);
			}).catch(err => {
				console.log(err);
			})
		},
		startChance() {
			this.getMissionInfo()
			this.getHistoryListHome()
			let macInput = document.getElementById('macInput')
			this.timer = setTimeout(function() {
				macInput.children[1].focus()
				macInput.children[1].select()
			}, 100)
		},
		// ———————数据获取———————
		getMissionInfo() {
			let api = this.$api.manage_productionTask_getProductionTaskInfo
			let para = {
				id: this.missionId,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.missionInfo = res.data.data
				this.getTodayCount()
			}).catch(err => {
				console.log(err);
			})
		},
		getTodayCount() {
			let para = {
				productKey: this.missionInfo.productKey,
				taskId: this.missionId,
			}
			let api = this.$api.manage_device_countTodayFinishDevice
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.todayTotal = res.data.data.todayTotal
			}).catch(err => {
				console.log(err);
			})
		},
		getHistoryListHome() {
			let api = this.$api.manage_deviceCheckRecord_getDeviceCheckRecordList
			let para = {
				pageNum: 1,
				pageSize: 5,
				taskId: this.missionId
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.listHistory = res.data.data
				this.listHistory.shift()
			})
		},
		getHistoryListTable() {
			this.showMore = true
			this.historyTableLoading = true
			let api = this.$api.manage_deviceCheckRecord_getDeviceCheckRecordList
			let para = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				taskId: this.missionId
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.listHistory = res.data.data
				this.total = res.data.total
				this.historyTableLoading = false
			})
		},
		// ———————校验mac地址sn码———————
		handleCheckMAC() { // 检测mac地址
			this.form.mac = this.form.mac.toUpperCase()
			this.activeCollapse = []
			this.macDisable = true
			let reg = /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}/;
			let str = this.form.mac
			let r = str.match(reg)
			if (r == null) {
				this.$Message.error('MAC地址格式错误！')
				this.macDisable = false
				let macInput = document.getElementById('macInput')
				this.timer = setTimeout(function() {
					macInput.children[1].focus()
					macInput.children[1].select()
				}, 100)
			} else {
				this.inputBG = {
					marginBottom: '40px',
					minWidth: '940px',
					background: 'yellow',
				}
				this.snDisable = false
				let snInput = document.getElementById('snInput')
				this.timer = setTimeout(function() {
					snInput.children[1].focus()
					snInput.children[1].select()
				}, 100)
			}
		},
		handleCheckSn() { // 检测SN码
			this.inputBG = {
				marginBottom: '40px',
				minWidth: '940px',
				background: 'blue',
			}
			this.snDisable = true
			this.$Message.info('正在检测SN码')
			let api = this.$api.manage_deviceCheck_checksnCode
			if (this.form.snCode.length > 20) {
				let SSn = this.form.snCode.split("barcode=")[1];
				this.form.snCode = SSn
			}
			let para = {
				snCode: this.form.snCode,
				mac: this.form.mac,
			}
			this.$Ax.post(api, para).then(res => {
				this.$Message.info(res.data.message)
				if (res.data.success) {
					this.snDisable = true
					this.checkStart = true
					this.firmCheckTxt = '正在检测...'
					this.keyCheckTxt = '正在检测...'
					this.attCheckTxt = '正在检测...'
					if (this.ws == null || this.ws.readyState == 3) {
						this.handleConnectWS()
					} else {
						this.handleConnectDevice()
					}
				} else {
					this.handleRestart()
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// ———————webSorket———————
		handleConnectWS() { // WS服务器
			let res = ''
			if ("WebSocket" in window) {
				this.ws = new WebSocket(this.$api.webSorket);
				let that = this
				// ws服务器连接成功后
				this.ws.onopen = function() {
					that.handleConnectService()
				}
				// 收取信息后
				this.ws.onmessage = function(event) {
					res = JSON.parse(event.data)
					if (res.cmd == 'connect' && res.returnCode == '20000') {
						that.handleKeepHeart()
						that.$Message.success('WebSocket服务连接成功！')
					}
					if (res.cmd == "disconnect" && res.moduleId == that.form.mac) {
						this.$Message.info('当前设备未连接WS服务器，正在等待设备连接...')
						// that.checkStatus = '2'
						// that.$Message.error('设备未响应，请检测设备连接')
						// that.checkHardLoading = false
						// that.checkkeyLoading = false
						// that.checkTableLoading = false
						// that.handleRestart()
					}
					if (res.cmd == 'connect' && res.moduleId == that.form.mac) {
						window.clearTimeout(that.timer)
						that.handleCheckDevice('all')
					}
					if (res.cmd == 'subscribe' && res.returnCode == '20000' && that.isCount) {
						that.$Message.success('设备订阅成功！')
						window.clearTimeout(that.timer)
						that.handleCheckDevice('all')
					}
					if (res.cmd == 'report' && that.checkStatus == '1') {
						window.clearTimeout(that.timer)
						that.$Message.success('获取设备上报信息成功！')
						that.handleDisConnectDevice()
						that.handleDealData(res)
					}
				}
				// ws服务关闭后
				this.ws.onclose = function() {
					window.clearTimeout(that.timer)
					window.clearInterval(that.hbTimer)
					that.$Message.success('WebSocket连接关闭')
					that.handleRestart()
				}
				// ws发生错误
				this.ws.onerror = function(event) {
					that.$Message.error('WebSocket连接发生错误')
				}
			} else {
				this.$Message.error('您的浏览器不支持websorket，请更换浏览器。')
			}
		},
		handleConnectService() { // 建立连接
			let para = {
				"version": 1,
				"cmd": "connect",
				"token": sessionStorage.getItem('token')
			}
			this.ws.send(JSON.stringify(para))
			this.handleConnectDevice()
		},
		handleConnectDevice() { // 订阅设备
			this.isCount = true
			let para = {
				"version": 1,
				"cmd": "subscribe",
				"flag": "on",
				"moduleId": this.form.mac
			}
			this.lastCheckForm = {
				mac: this.form.mac,
				snCode: this.form.snCode
			}
			this.ws.send(JSON.stringify(para))
			let that = this
			this.timer = setTimeout(function() {
				that.$Message.error('未检测到设备，请检测设备连接')
				that.handleRestart()
			}, 15000)
		},
		handleDisConnectDevice() { // 取消订阅
			this.isCount = false
			let para = {
				"version": 1,
				"cmd": "subscribe",
				"flag": "off",
				"moduleId": this.form.mac
			}
			this.ws.send(JSON.stringify(para))
		},
		handleCheckDevice(info) { // 下发指令
			this.checkTableLoading = true
			this.checkkeyLoading = true
			this.checkHardLoading = true
			let para = {
				version: '1',
				cmd: 'query',
				info: info,
				moduleId: this.form.mac,
			}
			this.ws.send(JSON.stringify(para) + "\r" + "\n")
			this.checkStatus = '1'
			let that = this
			this.timer = setTimeout(function() {
				that.handleDisConnectDevice()
				that.checkStatus = '2'
				that.inputBG = {
					marginBottom: '40px',
					minWidth: '940px',
					background: 'red',
				}
				that.$Message.error('设备未响应，请检测设备连接')
				this.firmCheckTxt = ''
				this.keyCheckTxt = ''
				this.attCheckTxt = ''
				that.checkHardLoading = false
				that.checkkeyLoading = false
				that.checkTableLoading = false
				that.handleRestart()
			}, 15000)
		},
		handleKeepHeart() { // 保持心跳
			let that = this
			this.hbTimer = setInterval(function() {
				let para = {
					"v": 1,
					"cmd": "hb"
				}
				that.ws.send(JSON.stringify(para))
			}, 30000)
		},
		// ———————校验数据———————
		handleDealData(res) { // 处理设备返还的数据
			this.checkNowData = res
			let paraHard = {
				taskProductKey: this.taskProductKey,
				productKey: res.quad.productKey,
				moduleType: res.profile.moduleType,
				softVersion: res.profile.softVersion,
			}
			let paraKey = {
				taskProductKey: this.taskProductKey,
				mac: this.form.mac,
				snCode: this.form.snCode,
				productKey: res.quad.productKey,
				productSecret: res.quad.productSecret,
				deviceName: res.quad.deviceName,
				deviceSecret: res.quad.deviceSecret,
			}
			let arr = []
			for (let i in this.checkNowData.data) {
				arr.push({
					propertiesKey: i,
					propertiesValue: this.checkNowData.data[i],
				})
			}
			let paraAtt = {
				taskProductKey: this.taskProductKey,
				productKey: this.missionInfo.productKey,
				deviceProperties: JSON.stringify(arr)
			}
			this.handleCheckHard(paraHard, paraKey, paraAtt)
		},
		handleCheckHard(paraHard, paraKey, paraAtt) { // 检测固件信息
			let api = this.$api.manage_deviceCheck_checkFirmwareVersion
			this.$Ax.post(api, paraHard).then(res => {
				if (res.data.success) {
					this.firmCheckStatus = true
				} else {
					this.firmCheckStatus = false
					if (this.checkStatus != '3') {
						this.errorMSG = res.data.message
					}
					this.checkStatus = '3'
				}
				this.firmCheckTxt = res.data.message
				this.checkHardLoading = false
				this.handleCheckKey(paraHard, paraKey, paraAtt)
			}).catch(err => {
				console.log(err);
			})
		},
		handleCheckKey(paraHard, paraKey, paraAtt) { // 检测秘钥信息
			let api = this.$api.manage_deviceCheck_checkTriples
			this.$Ax.post(api, paraKey).then(res => {
				if (res.data.success) {
					this.keyCheckStatus = true
				} else {
					this.keyCheckStatus = false
					if (this.checkStatus != '3') {
						this.errorMSG = res.data.message
					}
					this.checkStatus = '3'
				}
				this.keyCheckTxt = res.data.message
				this.handleCheckProperties(paraHard, paraKey, paraAtt)
				this.checkkeyLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleCheckProperties(paraHard, paraKey, paraAtt) { // 检测属性信息
			let api = this.$api.manage_deviceCheck_checkDeviceProperties
			this.$Ax.post(api, paraAtt).then(res => {
				if (res.data.success) {
					this.attCheckStatus = true
				} else {
					this.attCheckStatus = false
					if (this.checkStatus != '3') {
						this.errorMSG = res.data.message
					}
					this.checkStatus = '3'
				}
				this.attCheckTxt = res.data.message
				this.listData = res.data.data
				this.handleSaveCheck(paraHard, paraKey, paraAtt)
				this.checkTableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		// ———————校验结果处理———————
		handleSaveCheck(paraHard, paraKey, paraAtt) { // 保存检测结果
			if (this.firmCheckStatus == true && this.keyCheckStatus == true && this.attCheckStatus == true) {
				this.inputBG = {
					marginBottom: '40px',
					minWidth: '940px',
					background: '#10a54a',
				}
				this.checkStatus = '4'
			} else {
				this.inputBG = {
					marginBottom: '40px',
					minWidth: '940px',
					background: 'red',
				}
			}
			let api = this.$api.manage_deviceCheck_checkDeviceFinished
			let result = {
				firmCheckTxt: this.firmCheckTxt,
				firmCheckStatus: this.firmCheckStatus,
				keyCheckTxt: this.keyCheckTxt,
				keyCheckStatus: this.keyCheckStatus,
				attCheckTxt: this.attCheckTxt,
				attCheckStatus: this.attCheckStatus,
			}
			let para = {
				netType: this.missionInfo.netType,
				snCode: this.form.snCode,
				mac: this.form.mac,
				taskId: this.missionId,
				checkStatus: this.checkStatus == '4' ? '1' : '0',
				firmwareVersionDetail: JSON.stringify(paraHard),
				secretCheckDetail: JSON.stringify({
					paraKey: JSON.stringify(paraKey),
					result: JSON.stringify(result),
				}),
				propertiesDetail: JSON.stringify(this.listData),
			}
			this.$Ax.post(api, para).then(res => {
				if (res.data.success) {
					this.$Message.success('检测完成！')
				} else {
					this.$Message.error(res.data.data)
				}
				this.handleRestart()
			}).catch(err => {
				console.log(err);
			})
		},
		// ———————其他———————
		handleChangePanel(arr) { // 控制手风琴
			if (arr.length == 2) {
				let item = arr[1]
				this.activeCollapse = [item]
			}
			if (arr.length != 0) {
				this.panelLoading = true
				let api = this.$api.manage_deviceCheckRecord_getDeviceCheckRecordInfo
				let para = {
					id: arr[0]
				}
				this.$Ax.get(api, {
					params: para
				}).then(res => {
					this.historyInfoData = res.data.data
					this.historyInfoData.firmwareVersionDetail = JSON.parse(this.historyInfoData.firmwareVersionDetail)
					this.historyInfoData.propertiesDetail = JSON.parse(this.historyInfoData.propertiesDetail)
					this.historyInfoData.result = JSON.parse(JSON.parse(this.historyInfoData.secretCheckDetail).result)
					this.historyInfoData.secretCheckDetail = JSON.parse(JSON.parse(this.historyInfoData.secretCheckDetail).paraKey)
					this.listAtt = this.historyInfoData.propertiesDetail
					this.panelLoading = false
				}).catch(err => {
					console.log(err);
				})
			}
		},
		hanldeBack() { // 返回检测页面
			this.showMore = false
			this.getHistoryListHome()
		},
		handleRestart() { // 重新开始检测
			this.macDisable = false
			this.snDisable = true
			this.checkStart = false
			this.startChance()
		},
		handleChangePageSize(pageSize) {
			this.pageSize = pageSize
			this.getHistoryListTable()
		},
		flip(pageNum) {
			this.pageNum = pageNum
			this.getHistoryListTable()
		},
		getInfo(row) {
			this.dialogLoading = true
			this.dialog = true
			let api = this.$api.manage_deviceCheckRecord_getDeviceCheckRecordInfo
			let para = {
				id: row.id
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.historyInfoData = res.data.data
				this.historyInfoData.firmwareVersionDetail = JSON.parse(this.historyInfoData.firmwareVersionDetail)
				this.historyInfoData.propertiesDetail = JSON.parse(this.historyInfoData.propertiesDetail)
				this.historyInfoData.result = JSON.parse(JSON.parse(this.historyInfoData.secretCheckDetail).result)
				this.historyInfoData.secretCheckDetail = JSON.parse(JSON.parse(this.historyInfoData.secretCheckDetail).paraKey)
				this.listAtt = this.historyInfoData.propertiesDetail
				this.dialogLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		dealData(data) {
			if ((data === '' || data === null)) {
				return '--'
			} else {
				return data
			}
		}
	}
}
</script>
<style scoped>
.textBlue {
	font-size: 50px;
	color: blue;
}

.textRed {
	font-size: 50px;
	color: red;
}

.infoBox {
	height: 70px;
}

.title {
	font-weight: 800;
}

.info-line {
	width: 96%;
	display: inline-block;
	line-height: 18px;
}

.redTitle {
	position: relative;
	top: 5px;
	font-size: 28px;
	color: red;
	font-weight: 700;
}

.blueTitle {
	position: relative;
	top: 5px;
	font-size: 28px;
	color: blue;
	font-weight: 700;
}

.collapse {
	margin-Bottom: 40px;
	min-width: 940px;
}
</style>
