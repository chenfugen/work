<template>
<div id="keyList">
	<div class="actBox clearfloat">
		<!-- <Button type="primary" class="left" @click='getTableData'>查询</Button> -->
		<Button type="primary" class="left" @click='getListData'>查询</Button>
		<Button type="primary" class="right" v-if='permission.add' @click='handleAdd'>添加</Button>
	</div>
	<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
		<FormItem prop='productName' class="input left marginRight">
			<Select :loading='productLoading' v-model="filter.productKey" placeholder='产品名称' class="input marginRight" clearable>
				<Option v-for="item in productList" :value="item.productKey" :key="item.productKey">{{ dealNull(item.name) }}</Option>
			</Select>
		</FormItem>
	</Form>
	<div class="table clearfloat marginTop">
		<!-- <HDTable ref='HDTable' :columns='columns'></HDTable> -->
		<Table :loading='tableLoading' :row-class-name='rowClassName' :columns="columns" :data="listData" border></Table>
		<Page :current='pageNum' :total="total" :page-size='pageSize' @on-change='flip' @on-page-size-change='handleChangePageSize' size="small" :page-size-opts='[10,20,30,40]' class="right marginTop" show-total show-elevator show-sizer />
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" @on-ok="submit" :loading='formLoading' title="预警设置" @on-cancel="cancel" width='60' style="position:relative">
		<div v-show='act=="edit"'>
			<Form ref="forms" :model="form" :rules="rule" label-position="right" :label-width="120" inline>
				<FormItem label='产品名称:' style="width:45%">
					<span>{{dealNull(form.productName)}}</span>
				</FormItem>
				<FormItem label='ProductName:' style="width:45%">
					<span>{{dealNull(form.productName)}}</span>
				</FormItem>
				<FormItem label='ProductSecret:' style="width:45%">
					<span>{{dealNull(form.productSecret)}}</span>
				</FormItem>
			</Form>
			<span>当前预警阀值</span>
			<Divider />
			<div class="model_value">
				<span v-if='!showEdit' style="font-size:40px;display:block;">{{dealNull(form.warnCount)}}</span>
				<InputNumber v-else v-model="form.warnCount" size="large" class="input" placeholder="请输入阀值" style="font-size:25px;margin:0 auto;margin-bottom:20px;display:block;" :precision='0'></InputNumber>
				<Button type="primary" @click='handleEdit'>{{editTxt}}</Button>
				<Button v-if='showEdit' type="primary" @click='handleSetUp(form)'>取消</Button>
				<p class="txt">阀值说明：当改类型的秘钥剩余数量少于当前设置的数值时，系统将会在主要发出警报标志，提示管理员，该类秘钥库存不足，需要补充。</p>
			</div>
		</div>
		<div v-show='act!="edit"'>
			<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="80">
				<FormItem label='产品名称:' prop='productKey' style="width:45%">
					<Select v-model="form.productKey" placeholder='产品名称' class="input marginRight" clearable>
						<Option v-for="item in productAbleList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label='设置阀值:' prop='warnCount' style="width:45%">
					<InputNumber v-model="form.warnCount" size="large" class="input" placeholder="请输入阀值" :precision='0'></InputNumber>
				</FormItem>
			</Form>
		</div>
		<Spin v-if='modalLoading' fix large></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'keyList',
	data() {
		return {
			permission: {
				add: false,
				set: false,
				info: false,
			},
			editTxt: '修改',
			pageNum: 1,
			pageSize: 10,
			total: 0,
			dialog: false,
			showEdit: false,
			tableLoading: false,
			selectALoading: false,
			productLoading: false,
			modalLoading: false,
			formLoading: true,
			act: '',
			filter: {
				productKey: '',
			},
			form: {
				productKey: '',
				productName: '',
				productSecret: '',
				warnCount: 0,
			},
			rule: {
				productKey: [{
					required: true,
					message: '请选择产品',
					trigger: 'blur'
				}, ],
				warnCount: [{
					type: 'integer',
					required: true,
					message: '请输入阀值',
					trigger: 'blur'
				}],
			},
			productList: [],
			productAbleList: [],
			listData: [],
			columns: [{
					title: '产品名称',
					key: 'productName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									disabled: !this.permission.info
								},
								style: {
									color: '#0000FF',
								},
								on: {
									click: () => {
										this.goInfo(params.row, '0')
									}
								}
							}, params.row.productName)
						]);
					}
				},
				{
					title: 'ProductKey',
					align: 'center',
					key: 'productKey'
				},
				{
					title: 'ProductSecret',
					align: 'center',
					key: 'productSecret',
				},
				{
					title: '剩余量',
					key: 'address',
					width: 80,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									disabled: !this.permission.info
								},
								style: {
									color: '#0000FF',
								},
								on: {
									click: () => {
										this.goInfo(params.row, '0')
									}
								}
							}, params.row.leftCount)
						]);
					}
				},
				{
					title: '使用量',
					key: 'address',
					width: 80,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									disabled: !this.permission.info
								},
								style: {
									color: '#0000FF',
								},
								on: {
									click: () => {
										this.goInfo(params.row, '1')
									}
								}
							}, params.row.usedCount)
						]);
					}
				},
				{
					title: '总量',
					key: 'address',
					width: 80,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									disabled: !this.permission.info
								},
								style: {
									color: '#0000FF',
								},
								on: {
									click: () => {
										this.goInfo(params.row, '0')
									}
								}
							}, params.row.totalCount)
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
									type: 'primary',
									size: 'small',
									disabled: !this.permission.set
								},
								on: {
									click: () => {
										this.handleSetUp(params.row)
									}
								}
							}, '预警设置'),
						]);
					}
				}
			],
		}
	},
	mounted() {
		// this.getTableData()
		this.getPermissionList()
		this.getListData()
		this.getProductList()
	},
	methods: {
		getListData() {
			this.tableLoading = true
			let api = this.$api.manage_triplesConfig_getTriplesConfigList
			let para = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				...this.filter,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.listData = res.data.data
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		flip(pageNum) {
			this.pageNum = pageNum
			this.getListData()
		},
		rowClassName(row, index) {
			let a = Number(row.warnCount == null ? 0 : row.warnCount)
			let b = Number(row.leftCount == null ? 0 : row.leftCount)
			if (Number(a) >= Number(b)) {
				return 'demo-table-error-row'
			} else {
				return '';
			}
		},
		handleChangePageSize(pageSize) {
			this.pageSize = pageSize
			this.getListData()
		},
		// getTableData() { // 获取表格数据
		// 	this.tableLoading = true
		// 	let api = this.$api.manage_triplesConfig_getTriplesConfigList
		// 	let para = {
		// 		...this.filter,
		// 	}
		// 	this.$refs['HDTable'].getListData(api, para)
		// },
		handleChangePageSize() {},
		getProductList() { // 获取产品名称列表
			this.selectALoading = true
			let api = this.$api.manage_product_list
			let para = {
				pageNum: 1,
				pageSize: 100
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data.data
				this.selectALoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		getProductAbleList() { // 获取产品名称列表
			this.selectALoading = true
			let api = this.$api.manage_product_list
			let para = {
				status: 1,
				pageNum: 1,
				pageSize: 10000,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productAbleList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleSetUp(row) {
			this.act = 'edit'
			this.modalLoading = true
			this.editTxt = '修改'
			this.showEdit = false
			let api = this.$api.manage_triplesConfig_getTriplesConfigInfo
			let para = {
				id: row.id
			}
			this.dialog = true
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
				this.modalLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleEdit() {
			if (this.showEdit) {
				let api = this.$api.manage_triplesConfig_saveFirmwareTriplesConfig
				let para = this.form
				this.$Ax.post(api, para).then(res => {
					if (res.data.success) {
						this.$Message.success(res.data.data)
						this.dialog = false
					}
				}).catch(err => {
					console.log(err);
				})
			} else {
				this.showEdit = true
				this.editTxt = '确认'
			}
		},
		handleAdd() {
			this.getProductAbleList()
			this.act = 'add'
			this.dialog = true
		},
		goInfo(row, status) {
			this.$router.push({
				path: '/key/keyInfo',
				name: 'keyInfo',
				query: {
					id: row.id,
					status: status,
					productKey: row.productKey,
					productSecret: row.productSecret,
				}
			});
		},
		submit() {
			if (this.act == 'add') {
				let api = this.$api.manage_triplesConfig_saveFirmwareTriplesConfig
				let para = {
					productKey: this.form.productKey,
					warnCount: this.form.warnCount,
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$Ax.post(api, para).then(res => {
							if (res.data.success) {
								this.$Message.success(res.data.data)
								this.getListData()
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
			} else {
				this.dialog = false
				// this.getTableData()
				this.getListData()
			}
		},
		changeLoading() { // 修改表单loading状态
			this.formLoading = false;
			this.$nextTick(() => {
				this.formLoading = true;
			});
		},
		cancel() {
			this.$refs['form'].resetFields()
		},
		dealNull(data) {
			if (data === '' || data === null) {
				return '--'
			} else {
				return data
			}
		},
		getPermissionList() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '秘钥管理') {
					let menuC = menu[i].children[0].children
					for (let y in menuC) {
						if (menuC[y].name == '预警设置') {
							this.permission.set = menuC[y].checked
						}
						if (menuC[y].name == '秘钥详情') {
							this.permission.info = menuC[y].checked
						}
						if (menuC[y].name == '秘钥添加') {
							this.permission.add = menuC[y].checked
						}
					}
				}
			}
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.actBox {
	margin-bottom: 20px;
}

.model_value {
	text-align: center;
}

.txt {
	width: 40%;
	margin: 0 auto;
	margin-top: 20px;
	text-align: left;
}

.demo-table-error-row td {
	background-color: #ff6600;
	color: #fff;
}
</style>
