<template>
<div id="productList">
	<div class="table clearfloat marginTop" style="position:relative;">
		<div class="actBox clearfloat">
			<Button type="primary" @click='handleEditFirm'>固件配置</Button>
			<Button :type="formKey.checkSecret?'error':'success'" @click='handleEditKey'>{{formKey.checkSecret?'关闭秘钥检测':'开启秘钥检测'}}</Button>
			<!-- <Button v-show='formKey.checkSecret' :type="burnSecret == 0?'error':'success'" @click='handleEditBurn'>{{burnSecret == 0?'关闭自动烧录':'开启自动烧录'}}</Button> -->
		</div>
		<Table :columns="columnsTop" :data="productInfo" border></Table>
		<Table :columns="columnsBottom" :data="propertiesList" class="marginTop" border></Table>
		<Spin v-if='loading' fix></Spin>
	</div>
	<!-- 弹窗 -->
	<Modal v-model="dialog" :title="dialogTitle" @on-ok="submit" :loading='formLoading' @on-cancel="cancel" style="position:relative;">
		<Form ref="form" :model="form" :rules="rule" label-position="right" :label-width="120">
			<FormItem prop="check" label='需要检测:'>
				<i-switch v-model='form.check'>
					<span slot="open">是</span>
					<span slot="close">否</span>
				</i-switch>
			</FormItem>
			<!-- int -->
			<FormItem v-if='editDataType.type=="int"' prop="check" label='检测标准:'>
				<div class="" v-for='(item,index) in intData'>
					<InputNumber v-model="intData[index].min" :precision='0' placeholder='大于等于' :max='numberLimit[index].minLimitMax' :min='numberLimit[index].minLimitMin'></InputNumber>
					<InputNumber v-model="intData[index].max" :precision='0' placeholder='小于等于' :max='numberLimit[index].maxLimitMax' :min='numberLimit[index].maxLimitMin'></InputNumber>
				</div>
				<Button type='primary' @click='handleAddIntData'>
					<Icon type="md-add" /></Button>
				<Button type='primary' :disabled='intData.length<2' @click='handleRemoveIntData'>
					<Icon type="md-remove" /></Button>
			</FormItem>
			<!-- double -->
			<FormItem v-if='editDataType.type=="double"' prop="check" label='检测标准:'>
				<div class="" v-for='(item,index) in intData'>
					<InputNumber v-model="intData[index].min" placeholder='大于等于'></InputNumber>
					<InputNumber v-model="intData[index].max" placeholder='小于等于'></InputNumber>
				</div>
				<Button type='primary' @click='handleAddIntData'>
					<Icon type="md-add" /></Button>
				<Button type='primary' :disabled='intData.length<2' @click='handleRemoveIntData'>
					<Icon type="md-remove" /></Button>
			</FormItem>
			<!-- else -->
			<FormItem v-if='(editDataType.type!="double")&&(editDataType.type!="int")' prop="check" label='检测标准:'>
				<!-- bool -->
				<Select v-if='editDataType.type=="bool"' v-model="form.standard" class="input" clearable>
					<Option :value="1">{{editDataType.specs[1]}}</Option>
					<Option :value="0">{{editDataType.specs[0]}}</Option>
				</Select>
				<!-- text -->
				<Input v-if='editDataType.type=="text"' v-model="form.standard" class="input"></Input>
				<!-- enum -->
				<Select v-if='editDataType.type=="enum"' multiple v-model="form.standard" class="input" clearable>
					<Option v-for="(item,index) in editDataType.specs" :value="index" :key="index">{{ item }}</Option>
				</Select>
			</FormItem>
			<FormItem prop="mark" label='备注:'>
				<Input v-model="form.mark" class="input"></Input>
			</FormItem>
		</Form>
		<Spin fix v-if='dialogLoading'></Spin>
	</Modal>
	<Modal v-model="firmDialog" :title="dialogTitle" @on-ok="submitFirm" :loading='formLoading' @on-cancel="cancel" style="position:relative;">
		<Form ref="formFirm" :model="formFirm" :rules="rule" label-position="right" :label-width="150">
			<FormItem prop="isCheck" label='是否需要检测:'>
				<i-switch v-model='formFirm.checkFirmware'>
					<span slot="open">是</span>
					<span slot="close">否</span>
				</i-switch>
			</FormItem>
			<FormItem prop="checkFirmwareConfig" label='检测标准(固件版本号):'>
				<div class="" v-for='(item,index) in formFirm.checkFirmwareConfig'>
					<InputNumber v-model="formFirm.checkFirmwareConfig[index].a" :max='99' :min='0' :precision='0' style="width:50px;"></InputNumber>
					<span>.</span>
					<InputNumber v-model="formFirm.checkFirmwareConfig[index].b" :max='99' :min='0' :precision='0' style="width:50px;"></InputNumber>
					<span>.</span>
					<InputNumber v-model="formFirm.checkFirmwareConfig[index].c" :max='99' :min='0' :precision='0' style="width:50px;"></InputNumber>
					<span>或</span>
				</div>
				<Button type="primary" class="marginTop" @click='handleEditFirmStandard(true)'>
					<Icon type="md-add" />
				</Button>
				<Button type="primary" class="marginTop" :disabled='formFirm.checkFirmwareConfig.length<=0' @click='handleEditFirmStandard(false)'>
					<Icon type="md-remove" />
				</Button>
			</FormItem>
		</Form>
		<Spin fix v-if='firmDialogLoading'></Spin>
	</Modal>
</div>
</template>
<script>
export default {
	name: 'productList',
	data() {
		return {
			act: '',
			keyBtnTxt: '开启秘钥检测',
			productKey: '',
			dialogTitle: '',
			loading: false,
			formLoading: true,
			dialogLoading: false,
			firmDialogLoading: false,
			dialog: false,
			firmDialog: false,
			burnSecret: true,
			intData: [{
				max: null,
				min: null,
			}],
			rule: {},
			form: {
				identifier: '',
				check: false,
				standard: null,
				mark: ''
			},
			formFirm: {
				checkFirmware: false,
				checkFirmwareConfig: [{
					a: null,
					b: null,
					c: null,
				}],
			},
			formKey: {
				checkSecret: false,
			},
			numberLimit: [{
				minLimitMin: 0,
				minLimitMax: 0,
				maxLimitMin: 0,
				maxLimitMax: 0,
			}],
			editProperties: [],
			editDataType: {
				specs: {},
				type: '',
			},
			productInfo: [],
			propertiesList: [],
			columnsTop: [{
				title: '基本信息',
				align: 'left',
				children: [{
						title: '产品名称',
						key: 'name',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', this.dealNull(params.row.name)),
							]);
						}
					},
					{
						title: 'ProductKey',
						key: 'productKey',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', this.dealNull(params.row.productKey)),
							]);
						}
					},
					{
						title: '通信类型',
						key: 'netType',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', this.dealNull(params.row.netType)),
							]);
						}
					},
					{
						title: '租售类型',
						key: 'leaseType',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', params.row.leaseType == 1 ? '售卖' : params.row.leaseType == 2 ? '出租' : '--'),
							]);
						}
					},
				]
			}],
			columnsBottom: [{
				title: '基本属性',
				align: 'left',
				children: [{
						title: '属性名称',
						key: 'name',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', this.dealNull(params.row.name)),
							]);
						}
					},
					{
						title: '属性标识符',
						key: 'identifier',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', this.dealNull(params.row.identifier)),
							]);
						}
					},
					{
						title: '数据类型',
						key: 'type',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', params.row.dataType.type),
							]);
						}
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
						title: '是否需要检测',
						key: 'check',
						width: 50,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('div', {
									style: {
										color: params.row.check == '1' ? 'green' : 'red'
									},

								}, params.row.check == '1' ? '是' : '否')
							]);
						}
					},
					{
						title: '检测标准值',
						key: 'standard',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('div', {}, (params.row.dataType.type == 'int' || params.row.dataType.type == 'enum') ? JSON.stringify(params.row.standard) : params.row.standard)
							]);
						}
					},
					{
						title: '备注',
						key: 'mark',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', this.dealNull(params.row.mark)),
							]);
						}
					},
					{
						title: '操作',
						key: 'standard',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
									},
									style: {
										color: 'blue',
									},
									on: {
										click: () => {
											this.handleEdit(params.row)
										}
									}
								}, '编辑')
							]);
						}
					}
				],
			}],
		}
	},
	mounted() {
		if (this.$route.query.productKey) {
			this.productKey = this.$route.query.productKey
			this.getListData()
		} else {
			this.$router.push({
				path: '/product/productList',
				name: 'productList',
			});
		}
	},
	watch: {
		intData: {
			handler(curVal, oldVal) {
				for (let y in this.intData) {
					this.numberLimit[y].minLimitMax = Number(this.intData[y].max)
					this.numberLimit[y].maxLimitMin = Number(this.intData[y].min)
				}
			},
			deep: true
		}
	},
	methods: {
		getListData() { // 获取列表数据
			this.loading = true
			let api = this.$api.manage_product_detail
			let para = {
				productKey: this.productKey
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.propertiesList = []
				this.productInfo = [res.data.data.product]
				// 根据设备来源选择相应的编辑属性列表
				if (res.data.data.properties.length > 0) {
					this.propertiesList = JSON.parse(res.data.data.properties)
				}
				this.loading = false
				// 获取属否检查密钥
				this.formKey.checkSecret = res.data.data.product.checkSecret == 1 ? true : false
				// 获取是否开启自动烧录
				this.burnSecret = res.data.data.product.burnSecret
			}).catch(err => {
				console.log(err);
			})
		},
		handleEdit(row) { // 编辑属性标准值
			this.dialogLoading = true
			this.dialog = true
			this.dialogTitle = '编辑：' + row.name
			let api = this.$api.manage_product_detail
			let para = {
				productKey: this.productKey
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.editProperties = JSON.parse(res.data.data.properties)
				this.numberLimit = [{
					minLimitMin: 0,
					minLimitMax: 0,
					maxLimitMin: 0,
					maxLimitMax: 0,
				}]
				for (let i in this.editProperties) {
					if (this.editProperties[i].identifier == row.identifier) {
						this.form.mark = this.editProperties[i].mark
						this.form.identifier = row.identifier
						this.editDataType = this.editProperties[i].dataType
						// 初始化是否检测标识
						if (this.editProperties[i].check == undefined || this.editProperties[i].check == '0') {
							this.form.check = false
						} else {
							this.form.check = true
						}
						// 初始化标准值
						if (this.editProperties[i].standard == undefined) {
							this.form.standard = null
						} else {
							this.form.standard = this.editProperties[i].standard
						}
						// 如果类型为int或double 初始化数值范围设置表单
						if (this.editProperties[i].dataType.type == 'int' || this.editProperties[i].dataType.type == 'double') {
							this.intData = [{
								max: null,
								min: null,
							}]
							if (this.form.standard != null) {
								this.intData = this.form.standard
								for (let y in this.intData) {
									if (y > this.numberLimit.length - 1) {
										this.numberLimit.push({
											minLimitMin: 0,
											minLimitMax: 0,
											maxLimitMin: 0,
											maxLimitMax: 0,
										})
									}
									this.numberLimit[y].minLimitMin = Number(this.editProperties[i].dataType.specs.min)
									this.numberLimit[y].minLimitMax = Number(this.intData[y].max)
									this.numberLimit[y].maxLimitMin = Number(this.intData[y].min)
									this.numberLimit[y].maxLimitMax = Number(this.editProperties[i].dataType.specs.max)
								}
							} else {
								for (let y in this.intData) {
									if (y > this.numberLimit.length - 1) {
										this.numberLimit.push({
											minLimitMin: 0,
											minLimitMax: 0,
											maxLimitMin: 0,
											maxLimitMax: 0,
										})
									}
									this.numberLimit[y].minLimitMin = Number(this.editProperties[i].dataType.specs.min)
									this.numberLimit[y].minLimitMax = Number(this.editProperties[i].dataType.specs.max)
									this.numberLimit[y].maxLimitMin = Number(this.editProperties[i].dataType.specs.min)
									this.numberLimit[y].maxLimitMax = Number(this.editProperties[i].dataType.specs.max)
								}
							}
						}
						break
					}
				}
				this.dialogLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		handleAddIntData() { // 修改Int型变量
			this.numberLimit.push({
				minLimitMin: 0,
				minLimitMax: 0,
				maxLimitMin: 0,
				maxLimitMax: 0,
			})
			this.intData.push({
				max: null,
				min: null,
			})
		},
		handleRemoveIntData() { // 修改Int型变量
			this.intData = this.intData.slice(0, (this.intData.length - 1))
		},
		handleEditKey() { // 修改是否开始密钥检测
			this.loading = true
			let api = this.$api.manage_product_detail
			let para = {
				productKey: this.productKey
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.formKey.checkSecret = res.data.data.product.checkSecret == '1' ? true : false
				this.loading = false
				let msg = ''
				if (this.formKey.checkSecret) {
					msg = '关闭'
				} else {
					msg = '开启'
				}
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确认' + msg + '该产品的秘钥检测？</p>',
					onOk: () => {
						this.formKey.checkSecret = !this.formKey.checkSecret
						let url = this.$api.manage_product_productCheckConfig
						let para = {
							checkSecret: this.formKey.checkSecret ? '1' : '0',
							productKey: this.productInfo[0].productKey,
						}
						this.$Ax.post(url, para).then(res => {
							if (res.data.success) {
								this.$Message.success(res.data.data)
								this.getListData()
							}
						}).catch(err => {
							console.log(err);
						})
					},
					onCancel: () => {
						this.$Message.success('已取消' + msg + '。');
					}
				});
			}).catch(err => {
				console.log(err);
			})
		},
		handleEditFirm() { // 修改固件配置
			this.firmDialogLoading = true
			let api = this.$api.manage_product_detail
			let para = {
				productKey: this.productKey
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				let detail = res.data.data.product
				this.formFirm.checkFirmware = (detail.checkFirmware == 1) ? true : false
				if (detail.checkFirmwareConfig == null || detail.checkFirmwareConfig == []) {
					this.formFirm.checkFirmwareConfig = [{
						a: null,
						b: null,
						c: null,
					}]
				} else {
					this.formFirm.checkFirmwareConfig = []
					let arr = JSON.parse(detail.checkFirmwareConfig)
					for (let i in arr) {
						let a = arr[i].split('.')[0]
						let b = arr[i].split('.')[1]
						let c = arr[i].split('.')[2]
						this.formFirm.checkFirmwareConfig.push({
							a: Number(a),
							b: Number(b),
							c: Number(c),
						})
					}
				}
				this.firmDialog = true
				this.firmDialogLoading = false
			}).catch(err => {
				console.log(err);
			})

		},
		handleEditBurn() { // 修改是否自动烧录密钥
			this.loading = true
			let api = this.$api.manage_product_detail
			let para = {
				productKey: this.productKey
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.burnSecret = res.data.data.product.burnSecret
				this.loading = false
				let msg = ''
				if (this.burnSecret == 1) {
					msg = '关闭'
				} else {
					msg = '开启'
				}
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确认' + msg + '该产品的密钥自动烧录？</p>',
					onOk: () => {
						this.burnSecret = this.burnSecret == 1 ? 0 : 1
						let url = this.$api.manage_product_productCheckConfig
						let para = {
							burnSecret: this.burnSecret,
							productKey: this.productInfo[0].productKey,
						}
						this.$Ax.post(url, para).then(res => {
							if (res.data.success) {
								this.$Message.success(res.data.data)
								this.getListData()
							}
						}).catch(err => {
							console.log(err);
						})
					},
					onCancel: () => {
						this.$Message.success('已取消' + msg + '。');
					}
				});
			}).catch(err => {
				console.log(err);
			})
		},
		handleEditFirmStandard(count) { // 修改固件配置
			if (count) {
				this.formFirm.checkFirmwareConfig.push({
					a: null,
					b: null,
					c: null,
				})
			} else {
				this.formFirm.checkFirmwareConfig.pop()
			}
		},
		submit() { // 提交表单
			let para = {}
			let api = this.$api.manage_product_configProperties
			for (let i in this.editProperties) {
				if (this.editProperties[i].identifier == this.form.identifier) {
					this.editProperties[i].check = this.form.check
					this.editProperties[i].standard = this.editDataType.type == 'int' ? this.intData : this.form.standard
					this.editProperties[i].mark = this.form.mark
				}
			}
			para = {
				identifierConfig: JSON.stringify(this.editProperties),
				productKey: this.productKey,
			}
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
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
		},
		submitFirm() { // 修改固件表单
			let api = this.$api.manage_product_productCheckConfig
			let arr = []
			let att = this.formFirm.checkFirmwareConfig
			for (let i in att) {
				if ((att[i].a == null || att[i].b == null || att[i].c == null)) {
					this.$Message.error('请编辑完整固件版本号检测标准。')
					return this.changeLoading();
				}
				arr.push(att[i].a + '.' + att[i].b + '.' + att[i].c)
			}
			let para = {
				checkFirmware: this.formFirm.checkFirmware ? '1' : '0',
				checkFirmwareConfig: JSON.stringify(arr),
				productKey: this.productKey,
			}
			this.$refs['formFirm'].validate((valid) => {
				if (valid) {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success(res.data.data)
							this.getListData()
							this.firmDialog = false
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
		dealNull(data) { // 处理空数据显示
			if (data == null || data == '' || data == undefined) {
				return '--'
			} else {
				return data
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
