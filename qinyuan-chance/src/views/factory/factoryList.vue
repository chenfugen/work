<template>
<div id="factoryList">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" v-if='permisson.add' class="right" @click='handleAdd'>新增</Button>
	</div>
	<div class="filterbox">
		<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
			<FormItem prop='factoryName' class="input left marginRight">
				<Input v-model="filter.factoryName" placeholder='工厂名称' class="input" clearable></Input>
			</FormItem>
		</Form>
	</div>
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' @on-ok="submit" @on-cancel="cancel" style="position:relative;">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="80">
			<FormItem prop="factoryName" label='工厂名称:'>
				<Input v-model="form.factoryName" class="input">
				</Input>
			</FormItem>
			<FormItem prop="factoryCode" label='工厂代码:'>
				<Input v-model="form.factoryCode" class="input">
				</Input>
			</FormItem>
			<FormItem prop="factoryAddress" label='工厂地址:'>
				<Input v-model="form.factoryAddress" class="input">
				</Input>
			</FormItem>
			<FormItem prop="factoryType" label='工厂类型:'>
				<Select v-model="form.factoryType" placeholder='工厂类型' class="input" clearable>
					<Option :value="'沁园'">沁园</Option>
					<Option :value="'代工厂'">代工厂</Option>
				</Select>
			</FormItem>
		</Form>
		<Spin fix v-if='dialogLoading'></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'factoryList',
	data() {
		return {
			permisson: {
				disable: false, // 禁用权限
				info: false, // 产线管理
				edit: false, // 工厂编辑
				delete: false, //
				add: false
			},
			dialogTitle: '',
			act: '',
			dialog: false, // 控制弹窗
			formLoading: true, // 控制表单状态
			dialogLoading: false, // 控制弹窗loading
			form: {
				factoryName: '',
				factoryCode: '',
				factoryAddress: '',
				factoryType: '',
				status: '',
			},
			rule: {
				factoryName: [{
					required: true,
					message: '请输入工厂名称',
					trigger: 'blur'
				}, ],
				factoryCode: [{
					required: true,
					message: '请输入工厂代码',
					trigger: 'blur'
				}],
				factoryType: [{
					required: true,
					message: '请选择工厂类型',
					trigger: 'blur'
				}],
			},
			filter: { // 筛选数据
				factory: '',
			},
			columns: [{
					type: 'index',
					title: '序号',
					align: 'center',
				},
				{
					title: '工厂名称',
					key: 'factoryName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.factoryName)),
						]);
					}
				},
				{
					title: '工厂代码',
					key: 'factoryCode',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.factoryCode)),
						]);
					}
				},
				{
					title: '工厂地址',
					key: 'factoryAddress',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.factoryAddress)),
						]);
					}
				},
				{
					title: '工厂类型',
					key: 'factoryType',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.factoryType)),
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
									color: params.row.status == '1' ? 'green' : 'red'
								}
							}, params.row.status == '1' ? '启用' : '禁用'),
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
									type: params.row.status == '1' ? 'error' : 'success',
									size: 'small'
								},
								style: {
									display: this.permisson.disable ? 'inlin-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.handleDisable(params.row)
									}
								}
							}, params.row.status == '1' ? '禁用' : '启用'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disabled: params.row.status == '1' ? true : false,
								},

								style: {
									display: this.permisson.info ? 'inlin-block' : 'none',
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.goInfo(params.row)
									}
								}
							}, '查看'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disabled: params.row.status == '1' ? true : false,
								},
								style: {
									display: this.permisson.edit,
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
									disabled: params.row.status == '1' ? true : false,
								},
								style: {
									display: this.permisson.delete
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
		this.getTableData()
		this.handleDealPermisson()
	},
	methods: {
		getTableData() { // 获取表格数据
			let api = this.$api.manage_factory_getFactoryList
			let para = {
				...this.filter
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		handleDisable(row) { // 禁用
			let api = this.$api.manage_factory_forbidden
			let para = {}
			let msg = ''
			if (row.status == 1) {
				para = {
					id: row.id,
					status: 0,
				}
				msg = '禁用'
			} else {
				para = {
					id: row.id,
					status: 1,
				}
				msg = '启用'
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认' + msg + '该工厂（工厂：' + row.factoryName + '）？</p>',
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
		handleDelete(row) { // 删除
			let api = this.$api.manage_factory_deleteFactory
			let para = {
				id: row.id
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认删除该条工厂（工厂：' + row.factoryName + '）？</p>',
				onOk: () => {
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
		handleAdd(row) { // 添加
			this.cancel()
			this.act = 'add'
			this.dialogTitle = '添加工厂'
			this.modelLoading = true
			this.dialog = true
		},
		handleEdit(row) { // 编辑
			this.act = 'edit'
			this.dialogTitle = '编辑'
			this.modelLoading = true
			this.dialog = true
			let api = this.$api.manage_factory_getFactoryInfo
			let para = {
				id: row.id,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
				this.modelLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		goInfo(row) { // 跳转到产线列表
			this.$router.push({
				path: '/factory/productionLine',
				query: {
					id: row.id
				}
			});
		},
		submit() { // 重置表单
			let api = this.$api.manage_factory_saveFactory
			let para = ''
			let msg = ''
			if (this.act == 'add') {
				msg = '添加成功。'
				para = {
					factoryName: this.form.factoryName,
					factoryCode: this.form.factoryCode,
					factoryAddress: this.form.factoryAddress,
					factoryType: this.form.factoryType,
					status: '1',
				}
			} else {
				msg = '编辑成功。'
				para = {
					id: this.form.id,
					factoryName: this.form.factoryName,
					factoryCode: this.form.factoryCode,
					factoryAddress: this.form.factoryAddress,
					factoryType: this.form.factoryType,
					status: this.form.status
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
		cancel() { // 取消去修改/添加
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
		// 权限按钮配置
		handleDealPermisson() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let x in menu) {
				if (menu[x].name == '工厂管理') {
					let menuC = menu[x].children[0].children
					for (let y in menuC) {
						if (menuC[y].name == '工厂禁用启用') {
							this.permisson.disable = menuC[y].checked
							console.log(this.permisson.disable);
						}
						if (menuC[y].name == '产线管理') {
							this.permisson.info = menuC[y].checked
						}
						if (menuC[y].name == '工厂编辑') {
							this.permisson.edit = menuC[y].checked
						}
						if (menuC[y].name == '工厂删除') {
							this.permisson.delete = menuC[y].checked
						}
						if (menuC[y].name == '工厂新增') {
							this.permisson.add = menuC[y].checked
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
</style>
