<template>
<div id="firmwareList">
	<div class="actBox clearfloat">
		<Button type="primary" class="left" @click='getTableData'>查询</Button>
		<Button type="primary" class="right" v-if='permission.add' @click='handleAdd'>新增</Button>
	</div>
	<!-- 筛选 -->
	<Form ref="filter" :model="filter" class="clearfloat" :label-width="0">
		<FormItem prop='value' class="input left marginRight">
			<Select :loading='productLoading' v-model="filter.productKey" placeholder='产品名称' class="input marginRight" clearable>
				<Option v-for="item in productList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
			</Select>
		</FormItem>
		<FormItem prop='firmwareType' class="input left marginRight">
			<Input v-model="filter.firmwareType" placeholder='模块型号' class="input">
			</Input>
		</FormItem>
		<FormItem prop='firmwareVersion' class="input left marginRight">
			<Input v-model="filter.firmwareVersion" placeholder='固件版本' class="input">
			</Input>
		</FormItem>
	</Form>
	<div class="table clearfloat marginTop">
		<HDTable ref='HDTable' :columns='columns'></HDTable>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" :loading='formLoading' @on-ok="submit" @on-cancel="cancel" style="position:relative;">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="80">
			<FormItem prop="productKey" label='产品名称:'>
				<Select :loading='productLoading' v-model="form.productKey" placeholder='产品名称' class="input marginRight" clearable>
					<Option v-for="item in productList" :value="item.productKey" :key="item.productKey">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem prop="firmwareType" label='模块型号:'>
				<Input v-model="form.firmwareType" class="input">
				</Input>
			</FormItem>
			<FormItem prop="firmwareVersion" label='固件版本:'>
				<Input v-model="form.firmwareVersion" class="input">
				</Input>
			</FormItem>
			<FormItem prop="downLoadUrl" label='文件位置:'>
				<Input :disabled='true' v-model="form.downLoadUrl" class="input">
				</Input>
				<Upload :action="upLoadUrl" :show-upload-list='false' :on-success='onUploadSuccess'>
					<Button icon="ios-cloud-upload-outline">上传固件</Button>
				</Upload>
			</FormItem>
		</Form>
		<Spin fix v-if='dialogLoading'></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'firmwareList',
	data() {
		return {
			permission: {
				edit: false,
				delete: false,
				add: false,
				downlowd: false
			},
			act: '',
			dialog: false,
			uploadSuccess: false,
			upLoadUrl: '',
			dialogTitle: '',
			dialogLoading: false,
			formLoading: true,
			productLoading: false,
			filter: {
				productKey: '',
				firmwareVersion: '',
				firmwareType: '',
			},
			form: {
				productKey: '',
				firmwareVersion: '',
				firmwareType: '',
				downLoadUrl: '',
			},
			rule: {
				productKey: [{
					required: true,
					message: '请选择产品',
					trigger: 'blur'
				}, ],
				firmwareVersion: [{
					required: true,
					message: '请输入固件版本',
					trigger: 'blur'
				}],
				firmwareType: [{
					required: true,
					message: '请输入固件类型',
					trigger: 'blur'
				}],
				downLoadUrl: [{
					required: true,
					message: '请上传固件升级文件',
					trigger: 'blur'
				}],
			},
			productList: [],
			columns: [{
					title: '产品名称',
					key: 'productName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.productName)),
						]);
					}
				},
				{
					title: '模块型号',
					key: 'firmwareType',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.firmwareType)),
						]);
					}
				},
				{
					title: '固件版本',
					key: 'firmwareVersion',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.firmwareVersion)),
						]);
					}
				},
				{
					title: '升级文件',
					key: 'firmwareVersion',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									size: 'small',
									type: 'text'
								},
								style: {
									marginRight: '5px',
									color: 'blue',
									display: this.permission.downlowd ? 'inline-block' : 'none'
								},
								on: {
									click: () => {
										this.handleDownload(params.row)
									}
								}
							}, '下载文件'),
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
									size: 'small'
								},
								style: {
									marginRight: '5px',
									display: this.permission.edit ? 'inline-block' : 'none'
								},
								on: {
									click: () => {
										this.handleEdit(params.row)
									}
								}
							}, '修改'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									display: this.permission.delete ? 'inline-block' : 'none'
								},
								on: {
									click: () => {
										this.handleDelete(params.row)
									}
								}
							}, '删除')
						]);
					}
				}
			],
		}
	},
	mounted() {
		this.handleGetPermisson()
		this.getTableData()
		this.getProductList()
		this.upLoadUrl = this.$AxConfig.baseURL + this.$api.common_uploadImg
	},
	methods: {
		getTableData() { // 获取表格数据
			this.tableLoading = true
			let api = this.$api.manage_firmwareVersion_getFirmwareVersionList
			let para = {
				...this.filter,
			}
			this.$refs['HDTable'].getListData(api, para)
		},
		getProductList() { // 获取产品名称列表
			this.productLoading = true
			let api = this.$api.manage_product_list
			let para = {
				pageNum: 1,
				pageSize: 1000,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data.data
				this.productLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleDelete(row) {
			let api = this.$api.manage_firmwareVersion_deleteFirmwareVersion
			let para = {
				id: row.id
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认删除该条数据?</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.getTableData()
						} else {
							this.$Message.error(res.data.data);
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
		handleEdit(row) {
			this.act = 'edit'
			this.getProductList()
			this.dialogTitle = '编辑'
			this.dialogLoading = true
			this.dialog = true
			let api = this.$api.manage_firmwareVersion_getFirmwareVersionInfo
			let para = {
				id: row.id
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.form = res.data.data
				this.dialogLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleAdd() {
			this.getProductList()
			this.act = 'add'
			this.dialog = true
			this.dialogTitle = '添加'
		},
		handleDownload(row) {
			window.open(row.downLoadUrl)
		},
		onUploadSuccess(response, file, fileList) {
			this.uploadSuccess = true
			this.form.downLoadUrl = this.$AxConfig.baseURL + this.$api.common_getFile + response.data.fileId
			this.$Message.success('固件升级文件上传成功。')
		},
		submit() { // 提交表单
			let api = this.$api.manage_firmwareVersion_saveFirmwareVersion
			let para = ''
			let msg = ''
			if (this.act == 'add') {
				msg = '添加成功。'
				para = {
					productKey: this.form.productKey,
					firmwareVersion: this.form.firmwareVersion,
					firmwareType: this.form.firmwareType,
					downLoadUrl: this.form.downLoadUrl,
				}
			} else {
				msg = '编辑成功。'
				para = {
					productKey: this.form.productKey,
					firmwareVersion: this.form.firmwareVersion,
					firmwareType: this.form.firmwareType,
					downLoadUrl: this.form.downLoadUrl,
					id: this.form.id,
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
			if (data === '' || data === null) {
				return '--'
			} else {
				return data
			}
		},
		handleGetPermisson() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '固件管理') {
					let menuC = menu[i].children[0].children
					for (let y in menuC) {
						if (menuC[y].name == '固件删除') {
							this.permission.delete = menuC[y].checked
						}
						if (menuC[y].name == '固件新增') {
							this.permission.add = menuC[y].checked
						}
						if (menuC[y].name == '固件修改') {
							this.permission.edit = menuC[y].checked
						}
						if (menuC[y].name == '固件文件下载') {
							this.permission.downlowd = menuC[y].checked
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
