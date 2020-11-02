<template>
<div id="keyEnterList" class="clearfloat" style="position:relative">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" @click='handleAdd'>直接烧写</Button>
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
			<FormItem prop='status' class="input left marginRight">
				<Select v-model="filter.status" placeholder='任务状态' class="input marginRight" clearable>
					<Option :value="0">新建</Option>
					<Option :value="1">进行中</Option>
					<Option :value="2">结束</Option>
				</Select>
			</FormItem>
		</Form>
	</div>
	<div class="" style="position:relative">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' width='45' @on-ok="submit" @on-cancel="cancel" style="position:relative;">
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
		</Form>
	</Modal>
	<Spin v-if='pageLoading' fixd></Spin>
</div>
</template>
<script>
export default {
	name: 'keyEnterList',
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
			formProLineDisable: true,
			rule: {
				productKey: [{
					required: true,
					message: '请选择产品',
					trigger: 'blur'
				}],
				planTotal: [],
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
				status: '',
			},
			productList: [],
			ableProductList: [],
			factoryList: [],
			productLineList: [],
			columns: [{
					type: 'selection',
					width: 60,
					align: 'center'
				}, {
					title: '工单号',
					align: 'center',
					key: 'workOrderCode',
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
				}, {
					title: '产品名称',
					align: 'center',
					key: 'productName',
					width: 200,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.productName)),
						])
					}
				},
				{
					title: 'ERP编号',
					align: 'center',
					key: 'erpcode',
					width: 150,
					render: (h, params) => {
						return h('div', [
							h('span', this.dealData(params.row.erpcode)),
						])
					}
				},
				{
					title: '计划生产数量',
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
					title: '已生产数量',
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
					title: '创建时间',
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
							}, '开始烧录'),
						])
					}
				}
			]
		}
	},
	mounted() {
		this.pageNum = 1
		this.pageSize = 10
		this.getTableData()
		this.getProductList()
		this.remoteProductList('')
	},
	methods: {
		getTableData() { // 获取表格数据
			this.tableLoading = true
			let api = this.$api.manage_productionTask_getProductionTaskList
			let para = {
				productKey: this.filter.productKey,
				productName: this.filter.productName,
				erpCode: this.filter.erpCode,
				status: this.filter.status,
			}
			this.$refs['HDTable'].getListData(api, para)
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
		handleAdd() { // 添加任务
			this.dialogTitle = '新建任务'
			this.act = 'add'
			this.dialog = true
		},
		handleStart(row) { // 开始任务
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认开始烧录任务？</p>',
				onOk: () => {
					let api = this.$api.manage_productionTask_forbidden
					let para = {
						id: row.id,
						status: 1,
					}
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$router.push({
								push: '/keyEnterPage/keyEnter',
								name: 'keyEnter',
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
