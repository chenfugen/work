<template>
<div class="firmwareList">
	<div class="firmwareList-content">
		<div class="searchBox">
			<searchForm ref='searchForm' @handleSearch='getTableData(tabName)' v-if='createdFilter' :configList='configList'></searchForm>
		</div>
		<div class="clearfloat searchBox">
			<Button @click='handelAdd' type="primary">新增</Button>
		</div>
		<div class="marginTop">
			<Tabs value="dtu" @on-click='getTableData'>
				<TabPane label="通信模块" name="dtu">
				</TabPane>
				<TabPane label="MCU" name="mcu">
				</TabPane>
			</Tabs>
			<!-- table 组件放入tab中会导致page组件的修改页大小功能UI异常 -->
			<tableComponent v-show='this.tabName=="dtu"' ref='tableComponentdtu' :columns='columns' :showBatchDel='false'></tableComponent>
			<tableComponent v-show='this.tabName=="mcu"' ref='tableComponentmcu' :columns='columnsMCU' :showBatchDel='false'></tableComponent>
		</div>
	</div>
	<!-- 添加组件 -->
	<Modal v-model="dialog" title="增加" @on-ok="submitCompForm()" :loading='dialogLoading' @on-visible-change='handleReset'>
		<Form ref="addForm" :model="form" :rules="formRule" :labelWidth='100'>
			<FormItem prop="productKey" label='产品名称：'>
				<Select class="input" type="text" v-model="form.productKey">
					<Option v-for='item in productList' :key='item.productKey' :value='item.productKey'>{{item.productName}}</Option>
				</Select>
			</FormItem>
			<FormItem prop="firmwareType" label='固件类型：'>
				<Select class="input" type="text" v-model="form.firmwareType">
					<Option :value='"1"'>通信模块</Option>
					<Option :value='"2"'>MCU</Option>
				</Select>
			</FormItem>
			<FormItem prop="firmwareVersion" label='版本号：'>
				<Input class="input" type="text" v-model="form.firmwareVersion" placeholder='请填写' />
			</FormItem>
			<FormItem prop="moduleType" label='模组类型：' v-if='form.firmwareType == "1"'>
				<Select class="input" type="text" v-model="form.moduleType">
					<Option v-for='item in moduleTypeList' :value='item.value'>{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem prop="fileId" label='上传固件：'>
				<Upload ref='Upload' :accept='".bin"' :on-success='upLoadOnSuccess' :on-error='upLoadOnError' :before-upload='beforeUpload' :show-upload-list='false' :data='upLoadData' multiple :action="upLoadUrl">
					<Button icon="ios-cloud-upload-outline">{{form.fileName != ''?form.fileName:'选择文件'}}</Button>
				</Upload>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>

<script>
import dialogForm from '@/components/dialogForm.vue'
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
import api from '@/apiConfig/api'
import apiConfig from '@/apiConfig/index.js'
export default {
	name: 'firmwareList',
	data() {
		return {
			apiConfig,
			upLoadUrl: apiConfig.baseURL + api.common_upload_file,
			moduleTypeList: [{
				label: '乐鑫',
				value: 'M01',
			}, {
				label: '庆科',
				value: 'M02',
			}, {
				label: '中移',
				value: 'M03',
			}],
			dialog: false,
			dialogLoading: true,
			configList: [{
					plh: '产品名称',
					valName: 'productKey',
					type: 'select',
					labelName: 'productName',
					valueName: 'productKey',
					keyName: 'key',
					selectList: [],
				},
				{
					plh: '模组版本号',
					valName: 'firmwareVersion',
					type: 'input'
				},
				{
					plh: '创建时间',
					type: 'dateRange'
				}
			],
			firmwareVersion: '',
			tabName: 'dtu',
			form: {
				moduleType: '',
				productKey: '',
				firmwareType: '',
				firmwareVersion: '',
				fileId: '',
				fileName: '',
			},
			formRule: {
				productKey: {
					required: true,
					message: '请选择所属产品',
					trigger: 'blur'
				},
				firmwareType: {
					required: true,
					message: '请选择固件类型',
					trigger: 'blur'
				},
				firmwareVersion: {
					required: true,
					message: '请填写固件版本',
					trigger: 'blur'
				},
				fileId: {
					required: true,
					message: '请上传固件',
					trigger: 'blur'
				},
			},
			upLoadData: { // 引入通用接口验证码
				commonKey: apiConfig.commonKey
			},
			addSubmitUrl: '',
			createdFilter: true, // 控制筛选组件延迟加载
			productList: [],
			columns: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '产品名称',
					key: 'productKey',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.getProductName(params.row.productKey))
						]);
					}
				},
				{
					title: '文件名称',
					align: 'center',
					key: 'fileName',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.fileName))
						]);
					}
				},
				{
					title: '模组版本号',
					align: 'center',
					key: 'firmwareVersion',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.firmwareVersion))
						]);
					}
				},
				{
					title: '模组类型',
					align: 'center',
					key: 'moduleType',
					render: (h, params) => {
						return h('div', [
							h('div', this.getModuleType(params.row.moduleType))
						]);
					}
				},
				{
					title: '创建时间',
					key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
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
			columnsMCU: [{
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '产品名称',
					key: 'productKey',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.getProductName(params.row.productKey))
						]);
					}
				},
				{
					title: '文件名称',
					align: 'center',
					key: 'fileName',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.fileName))
						]);
					}
				},
				{
					title: '模组版本号',
					align: 'center',
					key: 'firmwareVersion',
					render: (h, params) => {
						return h('div', [
							h('div', this.handleDealVersion(params.row.firmwareVersion))
						]);
					}
				},
				{
					title: '创建时间',
					key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.createTime))
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
			]
		}
	},
	created() {
		this.addSubmitUrl = this.$api.manage_firmware_add
		this.configList[0].selectList = this.$store.state.common.productList
		this.getProductList()
	},
	mounted() {
		this.getTableData('dtu')
	},
	components: {
		searchForm,
		tableComponent,
		dialogForm
	},
	methods: {
		// 根据产品PK获取产品名称
		getProductName(productKey) {
			for (let i in this.productList) {
				if (this.productList[i].productKey == productKey) {
					return this.productList[i].productName
				}
			}
			return '--'
		},
		// 获取产品列表
		getProductList() {
			let api = this.$api.common_getProducts,
				para = {
					customerId: this.$store.state.user.customerId
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productList = res.data
			}).catch(err => {
				/* eslint-disable */
				console.log(err)
				/* eslint-enable */
			})
		},
		// 获取表格数据
		getTableData(tabName) {
			this.tabName = tabName
			let para = this.$refs.searchForm.handleSubmit()
			para.firmwareType = this.tabName == 'dtu' ? 1 : 2
			this.$refs['tableComponent' + tabName].getData(this.$api.manage_firmware_list, para, true)
		},
		// 删除
		handleDelete(row) {
			this.$Modal.confirm({
				title: '删除',
				content: '确认删除该固件（' + this.getProductName(row.productKey) + row.firmwareVersion + '）？',
				onOk: () => {
					let api = this.$api.manage_firmware_delete
					let para = {
						id: row.id,
						fileId: row.fileId
					}
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success('删除成功');
						}
						this.getTableData(this.tabName)
					}).catch(err => {
						/* eslint-disable */
						console.log(err);
						/* eslint-enable */
					})
				},
				onCancel: () => {
					this.$Message.success('已取消');
				}
			});
		},
		// 获取表单组件数据
		submitCompForm() {
			let api = this.$api.manage_firmware_add,
				para = this.form
			this.$refs['addForm'].validate((valid) => {
				if (valid) {
					// if (this.form.firmwareVersion != this.firmwareVersion) {
					// 	this.$Message.error('文件版本号与填写的固件版本号不一致，请重新选择上传文件或重新填写固件版本号')
					// 	this.changeLoading();
					// 	return false
					// }
					this.$Ax.post(api, para).then(res => {
						if (res.success) {
							this.$Message.success('新增成功')
						}
						this.dialog = false
						this.getTableData(this.tabName)
					}).catch(err => {
						// eslint-disable-next-line
						console.log(err);
					})
					setTimeout(() => {
						this.changeLoading();
					}, 1000);
				} else {
					return this.changeLoading();
				}
			})
		},
		// 新增固件
		handelAdd() {
			// this.$refs.addDialogForm.handleShow(true)
			this.dialog = true
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 处理空数据
		dealNullData(data) {
			return this.$Utils.dealNullData(data)
		},
		// 处理版本信息
		handleDealVersion(ver) {
			if (ver === '' || ver === null || ver === undefined) {
				return '--'
			} else {
				if (ver.indexOf('.') == -1) {
					ver = ver.split("")
					var result = Number(ver[0] + ver[1]) + '.' + Number(ver[3] + ver[4]) + '.' + Number(ver[6] + ver[7])
					return result
				} else {
					return ver
				}
			}
		},
		// 上传失败
		upLoadOnError(error) {
			this.$Message.error(error)
		},
		// 上传成功
		upLoadOnSuccess(response, file) {
			if (response.success) {
				this.form.fileId = response.data
				this.form.fileName = file.name
				this.$Message.success('上传成功')
			} else {
				this.$Message.error('上传失败')
			}
		},
		// 上传前判断固件文件名称
		beforeUpload(file) {
			// let arr = file.name.split('.bin')[0].split('_'),
			// 	str = arr[3]
			// this.form.fileName = file.name
			// this.firmwareVersion = str
			// if (this.form.firmwareVersion == '') {
			// 	this.$Message.error('请先填写固件版本号')
			// 	return false
			// }
			// if (str != this.form.firmwareVersion) {
			// 	this.$Message.error('文件版本号与填写的固件版本号不一致，请重新选择上传文件或重新填写固件版本号')
			// 	return false
			// }
			// if (arr[0] != "KNProject") {
			// 	this.$Message.error('文件名未符合命名规则')
			// 	return false
			// }
		},
		// 修改表单loading状态
		changeLoading() {
			this.dialogLoading = false;
			this.$nextTick(() => {
				this.dialogLoading = true;
			});
		},
		// 清空表单
		handleReset(value) {
			this.form.fileName = ''
			this.$refs['addForm'].resetFields();
			this.firmwareVersion = ''
		},
		getModuleType(id) {
			for (let i in this.moduleTypeList) {
				if (this.moduleTypeList[i].value === id) {
					return this.moduleTypeList[i].label
				}
			}
			return '--'
		}
	}
}
</script>

<style scope>
.firmwareList-content {
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.searchBox {
	margin-left: 20px;
}

.searchBtn {
	padding: 1px 6px;
	font-size: 18px;
}

.input {
	width: 300px;
}
</style>
