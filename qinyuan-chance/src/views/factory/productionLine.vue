<template>
<div id="productionLine">
	<span class='title'>{{infoData.factoryName}}</span>
	<Divider />
	<div class="filterbox">
		<Form :model="infoData" class="clearfloat" :label-width="80" inline>
			<FormItem label='工厂代码：' class="input left marginRight">
				<span>{{dealNull(infoData.factoryCode)}}</span>
			</FormItem>
			<FormItem label='工厂类型：' class="input left marginRight">
				<span>{{dealNull(infoData.factoryType)}}</span>
			</FormItem>
			<FormItem label='工厂地址：' class="input left marginRight">
				<span>{{dealNull(infoData.factoryAddress)}}</span>
			</FormItem>
			<FormItem label='添加时间：' class="input left marginRight">
				<span>{{dealNull(infoData.createTime)}}</span>
			</FormItem>
		</Form>
	</div>
	<div class="clearfloat">
		<span class="title">产线列表</span>
		<Button type="primary" class="right" v-if='permisson.add' @click='handleAdd'>新增</Button>
	</div>
	<Divider />
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!--  弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' @on-ok="submit" @on-cancel="cancel" style="position:relative;">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="80">
			<FormItem prop="productLineName" label='产线名称:'>
				<Input v-model="form.productLineName" class="input">
				</Input>
			</FormItem>
			<FormItem prop="productLineCode" label='产线代码:'>
				<Input v-model="form.productLineCode" class="input">
				</Input>
			</FormItem>
		</Form>
		<Spin fix v-if='dialogLoading'></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'productionLine',
	data() {
		return {
			permisson: {
				disable: false,
				edit: false,
				delete: false,
				add: false,
			},
			factoryId: '',
			dialogTitle: '',
			act: '',
			dialog: false,
			formLoading: true,
			dialogLoading: false,
			form: {},
			rule: {
				productLineName: [{
					required: true,
					message: '请输入产线名称',
					trigger: 'blur'
				}, ],
				productLineCode: [{
					required: true,
					message: '请输入产线代码',
					trigger: 'blur'
				}],
			},
			infoData: { // 筛选数据
				factory: '',
			},
			listData: [], // 列表数据
			columns: [{
					type: 'index',
					title: '序号',
					align: 'center',
				},
				{
					title: '产线名称',
					key: 'productLineName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.productLineName)),
						]);
					}
				},
				{
					title: '产线代码',
					key: 'productLineCode',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.productLineCode)),
						]);
					}
				},
				{
					title: '更新时间',
					key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.createTime)),
						]);
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', params.row.status == '0' ? '禁用' : params.row.status == '1' ? '启用' : '--'),
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 250,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: params.row.status == 1 ? 'error' : 'success',
									size: 'small',
								},
								style: {
									display: this.permisson.disable ? 'inline-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleDisable(params.row)
									}
								}
							}, params.row.status == 1 ? '禁用' : '启用'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disabled: params.row.status == 1 ? true : false
								},
								style: {
									display: this.permisson.edit ? 'inlin-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleEdit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small',
									disabled: params.row.status == 1 ? true : false
								},
								style: {
									display: this.permisson.delete ? 'inlin-block' : 'none'
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
		}
	},
	mounted() {
		if (this.$route.query.id) {
			this.factoryId = this.$route.query.id
			this.getTableData()
			this.getInfoData()
			this.handleDealPermission()
		} else {
			this.$router.push({
				path: '/factory/factoryList',
			});
		}
	},
	methods: {
		getTableData() { // 获取表格数据
			this.tableLoading = true
			let api = this.$api.manage_productLine_getProductLineList
			let para = {
				factoryId: this.factoryId,
				...this.filter
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		getInfoData() {
			let api = this.$api.manage_factory_getFactoryInfo
			let para = {
				id: this.factoryId,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.infoData = res.data.data
				this.modelLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleDisable(row) { // 禁用产品
			let api = this.$api.manage_productLine_forbidden
			let para = row.status == 1 ? {
				id: row.id,
				status: 0
			} : {
				id: row.id,
				status: 1
			}
			let msg = row.status == 1 ? '禁用' : '启用'
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认' + msg + '该产品（产线：' + row.productLineName + '）？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						this.$Message.success(msg + '成功。');
						this.getTableData()
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消禁用。');
				}
			});
		},
		handleDelete(row) {
			let api = this.$api.manage_productLine_deleteProductLine
			let para = {
				id: row.id,
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认删除该产品（产线：' + row.productLineName + '）？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						this.$Message.success('删除成功。');
						this.getTableData()
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消删除。');
				}
			});
		},
		handleAdd() { // 添加
			this.cancel()
			this.act = 'add'
			this.dialogTitle = '添加产线'
			this.dialog = true
		},
		handleEdit(row) {
			this.act = 'edit'
			this.dialogTitle = '编辑'
			this.modelLoading = true
			this.dialog = true
			let api = this.$api.manage_productLine_getProductLineInfo
			let para = {
				id: row.id
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleWorker(row) {},
		submit() { // 提交表单
			let api = this.$api.manage_productLine_saveProductLine
			let para = ''
			let msg = ''
			if (this.act == 'add') {
				msg = '添加成功。'
				para = {
					productLineName: this.form.productLineName,
					productLineCode: this.form.productLineCode,
					status: 1,
					factoryId: this.factoryId,
				}
			} else {
				msg = '编辑成功。'
				para = {
					id: this.form.id,
					productLineName: this.form.productLineName,
					productLineCode: this.form.productLineCode,
					status: this.form.status,
					factoryId: this.factoryId,
				}
			}
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(msg);
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
		dealNull(data) {
			if (data === null || data === undefined) {
				return '--'
			} else {
				return data
			}
		},
		// 获取页面权限
		handleDealPermission() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '工厂管理') {
					let menuC = menu[i].children[0].children
					for (let y in menuC) {
						if (menuC[y].name == '产线禁用启用') {
							this.permisson.disable = menuC[y].checked
						}
						if (menuC[y].name == '产线编辑') {
							this.permisson.edit = menuC[y].checked
						}
						if (menuC[y].name == '产线删除') {
							this.permisson.delete = menuC[y].checked
						}
						if (menuC[y].name == '产线新增') {
							this.permisson.add = menuC[y].checked
						}
					}
				}
			}
		}
	}
}
</script>
<style scoped>
.actBox {
	margin-bottom: 20px;
}

.title {
	font-weight: 800;
}
</style>
