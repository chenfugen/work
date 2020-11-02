<template>
<div id="roleInfo" class="clearfloat" style="position:relative">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" @click='handleAdd'>新建任务</Button>
	</div>
	<div class="filterbox marginTop">
		<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
			<FormItem prop='productKey' class="input left marginRight">
				<Select v-model="filter.productKey" placeholder='产品名称' class="input marginRight" clearable>
					<Option v-for="item in productList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem prop='erpCode' class="input left marginRight">
				<Input v-model='filter.erpCode' placeholder='ERP编号' class="input"></Input>
			</FormItem>
			<FormItem prop='workOrderCode' class="input left marginRight">
				<Input v-model='filter.workOrderCode' placeholder='工单号' class="input"></Input>
			</FormItem>
			<FormItem prop='factoryId' class="input left marginRight">
				<Select v-model="filter.factoryId" @on-change='getProductLineList' placeholder='所属工厂' class="input marginRight" clearable>
					<Option v-for="item in factoryList" :value="item.id" :key="item.id">{{ item.factoryName }}</Option>
				</Select>
			</FormItem>
			<FormItem prop='productLineCode' class="input left marginRight">
				<Select ref='filterSelect' v-model="filter.productLineCode" :disabled='filterProLineDisable' placeholder='所属产线' class="input marginRight" clearable>
					<Option v-for="item in productLineList" :value="item.productLineCode" :key="item.productLineCode">{{ item.productLineName }}</Option>
				</Select>
			</FormItem>
			<FormItem prop='status' class="input left marginRight">
				<Select v-model="filter.status" placeholder='任务状态' class="input marginRight" clearable>
					<Option :value="0">新建</Option>
					<Option :value="1">进行中</Option>
					<Option :value="2">结束</Option>
				</Select>
			</FormItem>
			<FormItem prop='time' class="input left marginRight">
				<DatePicker v-model="filter.time" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="最后检测时间" class="input" clearable></DatePicker>
			</FormItem>
		</Form>
	</div>
	<div class="" style="position:relative">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' width='45' @on-ok="submit" @on-cancel="cancel" style="position:relative;">
		<div v-show='act=="info"' class="infoBox">
			<Form ref="infoForm" :model="infoForm" label-position="right" :label-width="150" class="clearfloat">
				<div class="left" style="width:50%;">
					<FormItem prop="status" label='任务状态:'>
						<span>{{dealData(infoForm.status=='0'?'新建':infoForm.status=='1'?'进行中':'结束')}}</span>
					</FormItem>
					<FormItem prop="updateTime" label='状态更新时间:'>
						<span>{{dealData(infoForm.updateTime)}}</span>
					</FormItem>
					<FormItem prop="productName" label='产品名称:'>
						<span>{{dealData(infoForm.productName)}}</span>
					</FormItem>
					<FormItem prop="productKey" label='ProductKey:'>
						<span>{{dealData(infoForm.productKey)}}</span>
					</FormItem>
					<FormItem prop="erpCode" label='ERP编码:'>
						<span>{{dealData(infoForm.erpCode)}}</span>
					</FormItem>
					<FormItem prop="workOrderCode" label='工单号:'>
						<span>{{dealData(infoForm.workOrderCode)}}</span>
					</FormItem>
					<FormItem prop="productLineName" label='所属产线:'>
						<span>{{dealData(infoForm.productLineName)}}线</span>
					</FormItem>
					<FormItem prop="productLineCode" label='产线代码:'>
						<span>{{dealData(infoForm.productLineCode)}}</span>
					</FormItem>
				</div>
				<div class="left">
					<FormItem prop="factoryName" label='所属工厂:'>
						<span>{{dealData(infoForm.factoryName)}}</span>
					</FormItem>
					<FormItem prop="factoryCode" label='工厂代码:'>
						<span>{{dealData(infoForm.factoryCode)}}</span>
					</FormItem>
					<FormItem prop="planTotal" label='计划总量:'>
						<span>{{dealData(infoForm.planTotal)}}</span>
					</FormItem>
					<FormItem prop="finishedTotal" label='实际完成量:'>
						<span>{{dealData(infoForm.finishedTotal)}}</span>
					</FormItem>
					<FormItem prop="updateTime" label='最后检测时间:'>
						<span>{{dealData(infoForm.updateTime)}}</span>
					</FormItem>
					<FormItem prop="createTime" label='创建时间:'>
						<span>{{dealData(infoForm.createTime)}}</span>
					</FormItem>
					<FormItem prop="createBy" label='创建者:'>
						<span>{{dealData(infoForm.userName)}}</span>
					</FormItem>
				</div>
			</Form>
			<Spin v-if='dialogLoading' fix></Spin>
		</div>
		<div v-show='act=="add"' class="addBox">
			<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="150">
				<FormItem prop="productKey" label='产品名称:'>
					<Select v-model="form.productKey" :loading='productLoading' placeholder='产品名称' class="input marginRight" filterable remote :remote-method="remoteProductList" clearable>
						<Option v-for="item in ableProductList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem prop="workOrderCode" label='工单号:'>
					<Input v-model="form.workOrderCode" placeholder='工单号' class="input"></Input>
				</FormItem>
				<FormItem prop="planTotal" label='计划总量:'>
					<InputNumber :precision='0' v-model="form.planTotal" placeholder='计划总量' class="input"></InputNumber>
				</FormItem>
				<FormItem prop="factoryId" label='所属工厂:'>
					<Select v-model="form.factoryId" @on-change='getProductLineList' placeholder='所属工厂' class="input marginRight" clearable>
						<Option v-for="item in factoryList" :value="item.id" :key="item.id">{{ item.factoryName }}</Option>
					</Select>
				</FormItem>
				<FormItem prop="productLineId" label='所属产线:'>
					<Select ref='formSelect' v-model="form.productLineId" :disabled="formProLineDisable" placeholder='所属产线' class="input marginRight" clearable>
						<Option v-for="item in productLineList" :value="item.id" :key="item.id">{{ item.productLineName }}</Option>
					</Select>
				</FormItem>
			</Form>
		</div>
		<div class="" v-if='act=="info"' slot='footer'>
			<Button type="primary" name="button" @click='submit'>确定</Button>
		</div>
	</Modal>
	<Spin v-if='pageLoading' fixd></Spin>
</div>
</template>
<script>
export default {
	name: 'roleInfo',
	data() {
		return {
			pageNum: 1,
			total: 0,
			pageSize: 10,
			dialogTitle: '',
			act: '',
			dialog: false,
			formLoading: true,
			tableLoading: false,
			dialogLoading: false,
			pageLoading: false,
			productLoading: false,
			filterProLineDisable: true,
			formProLineDisable: true,
			rule: {
				productKey: [{
					required: true,
					message: '请选择产品',
					trigger: 'blur'
				}],
				planTotal: [],
				factoryId: [{
					required: true,
					message: '请选择输属工厂',
					trigger: 'blur'
				}],
				productLineId: [{
					required: true,
					message: '请选择所属产线',
					trigger: 'blur'
				}],
			},
			infoForm: {
				status: '',
				updateTime: '',
				productName: '',
				productKey: '',
				erpCode: '',
				workOrderCode: '',
				productLineName: '',
				productLineCode: '',
			},
			form: {
				productKey: '',
				workOrderCode: '',
				planTotal: 0,
				factoryId: '',
				productLineId: '',
			},
			filter: {
				productKey: '',
				erpCode: '',
				workOrderCode: '',
				factoryId: '',
				productLineCode: '',
				status: '',
				time: '',
			},
			productList: [],
			ableProductList: [],
			factoryList: [],
			productLineList: [],
			columns: [{
					title: '产品名称',
					align: 'center',
					key: 'productName',
					fixed: 'left',
					width: 200,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.productName)),
						])
					}
				},
				{
					title: '工单号',
					align: 'center',
					key: 'workOrderCode',
					fixed: 'left',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									color: 'blue',
								},
								on: {
									click: () => {
										this.getInfo(params.row)
									}
								}
							}, this.dealData(params.row.workOrderCode)),
						])
					}
				},
				{
					title: 'ERP编号',
					align: 'center',
					fixed: 'left',
					key: 'erpcode',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.erpcode)),
						])
					}
				},
				{
					title: '所属产线',
					align: 'center',
					key: 'productLineName',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.productLineName)),
						])
					}
				},
				{
					title: '所属工厂',
					align: 'center',
					key: 'factoryName',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.factoryName)),
						])
					}
				},
				{
					title: '计划总量',
					align: 'center',
					key: 'planTotal',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.planTotal)),
						])
					}
				},
				{
					title: '实际量',
					align: 'center',
					key: 'finishedTotal',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.finishedTotal)),
						])
					}
				},
				{
					title: '最后检测时间',
					align: 'center',
					width: 200,
					key: 'updateTime',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.updateTime)),
						])
					}
				},
				{
					title: '任务状态',
					key: 'status',
					align: 'center',
					width: 100,
					render: (h, params) => {
						return h('div', [
							h('span', {
								style: {
									color: params.row.status == 0 ? 'green' : params.row.status == 1 ? 'green' : 'red'
								}
							}, params.row.status == 0 ? '新建' : params.row.status == 1 ? '进行中' : '结束'),
						])
					}
				},
				{
					title: '操作',
					key: 'erpCode',
					align: 'center',
					fixed: 'right',
					width: 100,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'success',
									size: 'small',
									disabled: params.row.status == '2' ? true : false,
								},
								on: {
									click: () => {
										this.handleStart(params.row)
									}
								}
							}, '开始产测'),
						])
					}
				},
				{
					title: '操作',
					key: 'action',
					align: 'center',
					fixed: 'right',
					width: 200,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								on: {
									click: () => {
										this.getInfo(params.row)
									}
								}
							}, '查看'),
							h('Button', {
								props: {
									type: params.row.status == '2' ? 'success' : 'error',
									size: 'small',
								},
								style: {
									marginLeft: '5px'
								},
								on: {
									click: () => {
										this.handleFinish(params.row)
									}
								}
							}, params.row.status == '2' ? '开启' : '结束'),
							h('Button', {
								props: {
									type: 'error',
									disabled: params.row.status == 0 ? false : true,
									size: 'small'
								},
								style: {
									marginLeft: '5px'
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
			]
		}
	},
	mounted() {
		this.pageNum = 1
		this.pageSize = 10
		this.getTableData()
		this.getFactoryList()
		this.getProductList()
		this.remoteProductList('')
	},
	watch: {
		filter: {
			handler(newVal, oldValue) {
				if (newVal.factoryId == '' || newVal.factoryId == undefined) {
					this.filterProLineDisable = true
					this.$refs['filterSelect'].clearSingleSelect()
				} else {
					this.filterProLineDisable = false
				}
			},
			deep: true
		},
		form: {
			handler(newVal, oldValue) {
				if (newVal.factoryId == '' || newVal.factoryId == undefined) {
					this.formProLineDisable = true
					this.$refs['formSelect'].clearSingleSelect()
				} else {
					this.formProLineDisable = false
				}
			},
			deep: true
		}
	},
	methods: {
		getTableData() { // 获取表格数据
			let startTime = (this.filter.time[0] != '') ? this.$Utils.formatDate.format(this.filter.time[0], 'yyyy-MM-dd hh:mm:ss') : ''
			let endTime = (this.filter.time[1] != '') ? this.$Utils.formatDate.format(this.filter.time[1], 'yyyy-MM-dd hh:mm:ss') : ''
			this.tableLoading = true
			let api = this.$api.manage_productionTask_getProductionTaskList
			let para = {
				productKey: this.filter.productKey,
				productName: this.filter.productName,
				erpCode: this.filter.erpCode,
				workOrderCode: this.filter.workOrderCode,
				productLineCode: this.filter.productLineCode,
				status: this.filter.status,
				startTime: startTime,
				endTime: endTime,
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		getInfo(row) { //获取详细信息
			this.dialogLoading = true
			this.dialogTitle = '查看任务详情'
			this.act = 'info'
			this.dialog = true
			let api = this.$api.manage_productionTask_getProductionTaskInfo
			let para = {
				id: row.id,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.infoForm = res.data.data
				this.dialogLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		getFactoryList() { // 获取工厂列表
			let api = this.$api.manage_factory_getFactoryList
			let para = {
				pageNum: 1,
				pageSize: 100,
				status: 1,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.factoryList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		getProductList() { // 获取所有产品列表
			let api = this.$api.manage_product_list
			let para = {
				pageNum: 1,
				pageSize: 100,
				qcForbidden: 1,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		getProductLineList(factoryId) { // 获取根据工厂获取产线列表
			let api = this.$api.manage_productLine_getProductLineList
			let para = {
				pageNum: 1,
				pageSize: 100,
				factoryId: factoryId,
				status: 1,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productLineList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleAdd() { // 添加任务
			this.dialogTitle = '新建任务'
			this.act = 'add'
			this.dialog = true
		},
		handleDelete(row) { // 删除任务
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认删除该任务？</p>',
				onOk: () => {
					let api = this.$api.manage_productionTask_deleteProductionTask
					let para = {
						id: row.id
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('删除成功。');
							this.getTableData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消删除。');
				}
			});
		},
		handleFinish(row) { // 结束任务
			let api = this.$api.manage_productionTask_forbidden
			let para = {}
			let msg = ''
			if (row.status == 2) {
				para = {
					id: row.id,
					status: 1,
				}
				msg = '开启'
			} else {
				para = {
					id: row.id,
					status: 2,
				}
				msg = '结束'
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认' + msg + '该任务？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('已' + msg + '任务。');
							this.getTableData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消' + msg + '。');
				}
			});
		},
		handleStart(row) { // 开始任务
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认开始产测？</p>',
				onOk: () => {
					let api = this.$api.manage_productionTask_forbidden
					let para = {
						id: row.id,
						status: 1,
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$router.push({
								push: '/ChanceStart',
								name: 'chanceStart',
								query: {
									id: row.id,
									taskProductKey: row.productKey
								}
							})
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消开启。');
				}
			});
		},
		remoteProductList(query) { // 远程搜索启用状态的产品列表
			this.productLoading = true
			let api = this.$api.manage_product_productList
			let para = {
				productName: query
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				let list = res.data.data
				this.ableProductList = []
				for (let i in list) {
					let para = {
						name: list[i].split('-HadLinks-')[0],
						productKey: list[i].split('-HadLinks-')[1],
					}
					this.ableProductList.push(para)
				}
				this.productLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		submit() { // 提交表单
			if (this.act == 'info') {
				this.dialog = false
			} else {
				let api = this.$api.manage_productionTask_saveProductionTask
				let para = {
					productKey: this.form.productKey,
					workOrderCode: this.form.workOrderCode,
					planTotal: this.form.planTotal,
					factoryId: this.form.factoryId,
					productLineId: this.form.productLineId,
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$Ax.post(api, para).then(res => {
							if (res.data.success) {
								this.$Message.success('添加任务成功。');
								this.getTableData()
								this.dialog = false
							}
						}).catch(err => {
							console.log(err);
						})
					} else {
						return this.changeLoading();
					}
					setTimeout(() => {
						this.changeLoading();
					}, 1000);
				})
			}
		},
		cancel() { // 重置表单
			this.$refs['form'].resetFields();
			this.$refs['infoForm'].resetFields();
		},
		changeLoading() { // 修改表单loading状态
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		dealData(data) { // 处理空数据显示
			if (data === '' || data === null) {
				return '--'
			} else {
				return data
			}
		}
	}
}
</script>
<style scoped>
</style>
