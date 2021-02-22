<template>
	<div class="agencySet">
		<p class="title">委托商{{partner.partnerName+'('+partner.partnerId+')'}}</p>
		<Tabs type="card">
			<TabPane label="产品配置">
				<searchForm ref='productSearchForm' @handleSearch='getProductList()' :configList='productConfig'></searchForm>
				<Button @click='handleBindProduct()' type='primary' class="marginLeft">绑定产品</Button>
				<tableComponent v-if='showTable' class="productTable" ref='tableProduct' :columns='productColumns'></tableComponent>
			</TabPane>
			<TabPane label="设备配置">
				<searchForm ref='deviceNameearchForm' @handleSearch='getDeviceList()' :configList='deviceConfig'></searchForm>
				<Button @click='handleBindDevice()' type='primary' class="marginLeft">绑定设备</Button>
				<tableComponent v-if='showTable' class="productTable" ref='tableDevice' :columns='deviceColumns'></tableComponent>
			</TabPane>
			<TabPane label="推送信息配置">
				<searchForm ref='pushMsgSearchForm' @handleSearch='getPushMsg()' :configList='pushMsgConfig'></searchForm>
				<p class="pushSwitch">
					<span>全部产品推送&nbsp;&nbsp;&nbsp;</span>
					<i-switch v-model="isAllPushMsg" :before-change="beforeChange" @on-change="changePushMsg">
						<span slot="open">开</span>
						<span slot="close">关</span>
					</i-switch>
				</p>
				<tableComponent v-if='showTable' class="productTable" ref='pushMsgComponent' :columns='pushMsgColumns'></tableComponent>
			</TabPane>
			<TabPane label="微信信息配置">
				<wechatSet></wechatSet>
			</TabPane>
		</Tabs>
		<!-- 产品绑定 -->
		<Modal v-model="dialogAddProduct" title="绑定产品" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" @on-cancel="cancel">
			<Form ref="formAddProduct" :model="formAddProduct" :rules="ruleformProduct" :label-width="100">
				<div v-if="selectProduct">
					<FormItem prop="productKey">
						<Select v-model="formAddProduct.productKey" multiple filterable style="width:260px" placeholder="选择产品名称(允许多选)">
							<Option v-for="item in productList" :key="item.productKey" :value="item.productKey">{{ item.productName }}</Option>
						</Select>					
					</FormItem>
					<FormItem>
						<Button type="primary" @click="handleSubmit('formAddProduct')">下一步</Button>
					</FormItem>
				</div>
				<div v-else>
					<ul class="productList">
						<li v-for="(item,index) in productNames" :key="index">{{(index+1)+"、"+item.productName}}</li>
					</ul>
					<FormItem>
						<Button type="primary" @click="handleConfirm('formAddProduct')">确认</Button>
						<Button type="primary" @click="handleReset('formAddProduct')" style="margin-left: 8px">重选</Button>
						<Button @click="cancel" style="margin-left: 8px">取消</Button>
					</FormItem>
				</div>
			</Form>
		</Modal>
		<!-- 绑定设备 -->
		<Modal v-model="dialogAddDevice" title="绑定设备" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" @on-cancel="cancel">
			<Form ref="formAddDevice" :model="formAddDevice" :rules="ruleformDevice">
				<FormItem prop="deviceName">
					<Input v-model="formAddDevice.deviceName" type="textarea" :rows="4" placeholder="请正确填写设备名称（MAC/IMEI），多个设备信息请以'，'符号为间隔" />
					<p>
						<span>多个设备信息请以","符号为间隔，15个以上建议</span>
						<Button type="text" class="edit" @click="handleImport">txt文件导入</Button>
						<input type="file" style="opacity: 0;width: 0px;" ref="readFile" @change="readFiles" />
					</p>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formAddDevice')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 产品详情 -->
		<Modal v-model="productDetailModal" title="产品详情" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true">
			<Form class="detailDiv" :label-width="150">
				<FormItem label="产品名称：">
					<span>{{dealNullData(productDetail.productName)}}</span>
				</FormItem>
				<FormItem label="PK码：">
					<span>{{dealNullData(productDetail.productKey)}}</span>
				</FormItem>
				<FormItem label="PK自定义产品型号：">
					<span>{{dealNullData(productDetail.ownProductModel)}}</span>
				</FormItem>
				<FormItem label="创建时间：">
					<span>{{dealNullData(productDetail.createTime)}}</span>
				</FormItem>
				<FormItem label="设备列表显示：">
					<span>{{dealNullData(productDetail.showProperty)}}</span>
				</FormItem>
				<FormItem label="PK描述信息：">
					<span>{{dealNullData(productDetail.description)}}</span>
				</FormItem>
				<FormItem label="是否推送：">
					<span>{{productDetail.pushConfig?"开":"关"}}</span>
				</FormItem>
			</Form>
		</Modal>
		<!-- 设备详情 -->
		<Modal v-model="deviceDetailModal" title="设备详情" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" >
			<Form class="detailDiv" :label-width="150">
				<FormItem label="设备名称：">
					<span>{{dealNullData(deviceDetail.deviceName)}}</span>
				</FormItem>
				<FormItem label="产品名称：">
					<span>{{dealNullData(deviceDetail.productName)}}</span>
				</FormItem>
				<FormItem label="PK码：">
					<span>{{dealNullData(deviceDetail.productKey)}}</span>
				</FormItem>
				<FormItem label="设备类型：">
					<span>{{dealNullData(deviceDetail.netType)}}</span>
				</FormItem>
				<FormItem label="固件版本：">
					<span>{{dealNullData(deviceDetail.firmwareVersion)}}</span>
				</FormItem>
				<FormItem label="关联时间：">
					<span>{{dealNullData(deviceDetail.onlineTime)}}</span>
				</FormItem>
			</Form>
		</Modal>
		<!-- 推送配置 -->
		<Modal v-model="devicePushModal" title="推送配置" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true">
			<div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
				<Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
			</div>
			<Form ref="formPushMsg" :model="formPushMsg" :rules="ruleformPushMsg" :label-width="100">
				<FormItem label="故障列表" prop="ids">
					<CheckboxGroup v-model="formPushMsg.ids" @on-change="checkAllGroupChange">
						<Checkbox v-for="item in faultList" :key="item.faultId" :label="item.faultId">{{item.faultName}}</Checkbox>
					</CheckboxGroup>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formPushMsg')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 产品属性配置 -->
		<propetyEdit ref='propetyEdit'></propetyEdit>
	</div>
</template>

<script>
	import searchForm from '@/components/searchForm.vue'
	import tableComponent from '@/components/tableComponent.vue'
	import wechatSet from './wechatSet.vue'
	import propetyEdit from '../product/propetyEdit.vue'
	import apiConfig from '@/apiConfig/index.js'
	export default {
		data() {
			return {
				partnerId:this.$BASE.Decrypt(this.$route.query.partnerId),
				partner: {
					partnerName: sessionStorage.getItem("partnerName"),
					partnerId: this.$BASE.Decrypt(this.$route.query.partnerId),
				},				
				isAllPushMsg: true, //是否全部推送
				productList: [],
				productNames: [],
				faultList: [],
				selectProduct: true,
				dialogAddProduct: false,
				dialogAddDevice: false,
				productDetailModal: false,
				deviceDetailModal: false,
				devicePushModal: false,
				productDetail: {},
				deviceDetail: {},
				indeterminate: true, //全选状态
				checkAll: false, //是否全选
				formAddProduct: {
					productKey: ''
				},
				ruleformProduct: {
					productKey: [{
						required: true,
						type: 'array',
						message: '请选择需要绑定的产品',
						trigger: 'change'
					}],
				},
				showTable: false,
				formPushMsg: {
					productKey: null,
					ids: []
				},
				ruleformPushMsg: {
					ids: [{
						required: true,
						type: 'array',
						min: 1,
						message: '请选择推送故障',
						trigger: 'change'
					}]
				},
				ruleformProduct: {
					productKey: [{
						required: true,
						type: 'array',
						message: '请选择需要绑定的产品',
						trigger: 'change'
					}],
				},
				formAddDevice: {
					deviceName: ''
				},
				ruleformDevice: {
					deviceName: [{
						required: true,
						message: '请选择需要绑定的设备',
						trigger: 'blur'
					}],
				},
				pushMsgConfig: [{ // 筛选框配置
					plh: '产品名称',
					valName: 'productName',
					type: 'input'
				}, {
					plh: '产品PK',
					valName: 'productKey',
					type: 'input'
				}],
				productConfig: [{ // 筛选框配置
					plh: '产品名称',
					valName: 'productName',
					type: 'input'
				}, {
					plh: '产品PK',
					valName: 'productKey',
					type: 'input'
				}],
				deviceConfig: [{ // 筛选框配置
					plh: '设备MAC/IMEI',
					valName: 'productName',
					type: 'input'
				}, {
					plh: '产品PK',
					valName: 'productKey',
					type: 'input'
				}],
				pushMsgColumns: [{ // 表格配置
						type: 'index',
						title: '序号',
						width: 60,
						align: 'center'
					},
					{
						title: '产品名称',
						align: 'center',
						key: 'productName',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.productName))
							]);
						}
					},
					{
						title: '产品PK',
						align: 'center',
						key: 'productKey',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.productKey))
							]);
						}
					},
					{
						title: '自定义产品型号',
						align: 'center',
						key: 'ownProductModel',
						render: (h, params) => {
							return h('div', [
								h('div', params.row.ownProductModel)
							]);
						}
					},
					{
						title: '是否推送',
						align: 'center',
						key: 'pushConfig',
						width: 150,
						render: (h, params) => {
							return h('i-switch', {
								props: {
									value: params.row.pushConfig == 1 ? true : false,
									beforeChange: this.handlebeforeChange
								},
								scopedSlots: {
									open: () => h('span', '开'),
									close: () => h('span', '关')
								},
								on: {
									'on-change': (value) => {
										this.handleSwicth(params.row, value)
									}
								}
							})
						}
					},
					{
						title: '操作',
						key: 'action',
						width: 200,
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
											this.getInfo(params.row, "pushMsg")
										}
									}
								}, '查看'),
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
											this.handleEdit(params.row, "pushMsg")
										}
									}
								}, '推送配置'),
							]);
						}
					}
				],
				deviceColumns: [{ // 设备表格配置
						type: 'index',
						title: '序号',
						width: 60,
						align: 'center'
					},
					{
						title: '设备名称',
						align: 'center',
						key: 'deviceName',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.deviceName))
							]);
						}
					},
					{
						title: '产品PK',
						align: 'center',
						key: 'productKey',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.productKey))
							]);
						}
					},
					{
						title: '产品名称',
						align: 'center',
						key: 'productName',
						render: (h, params) => {
							return h('div', [
								h('div', params.row.productName)
							]);
						}
					},
					{
						title: '关联时间',
						align: 'center',
						key: 'onlineTime',
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.onlineTime))
							]);
						}
					},
					{
						title: '操作',
						key: 'action',
						width: 200,
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
											this.getInfo(params.row, "device")
										}
									}
								}, '查看'),
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
											this.unbind(params.row, "device")
										}
									}
								}, '解绑'),
							]);
						}
					}
				],
				productColumns: [{ //产品表格配置
						type: 'index',
						title: '序号',
						width: 60,
						align: 'center'
					},
					{
						title: '产品名称',
						align: 'center',
						key: 'productName',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.productName))
							]);
						}
					},
					{
						title: '产品PK',
						align: 'center',
						key: 'productKey',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.productKey))
							]);
						}
					},
					{
						title: '自定义产品类型',
						align: 'center',
						key: 'productModel',
						render: (h, params) => {
							return h('div', [
								h('div', params.row.ownProductModel)
							]);
						}
					},
					{
						title: '同步时间',
						align: 'center',
						key: 'createTime',
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.createTime))
							]);
						}
					},
					{
						title: '操作',
						key: 'action',
						width: 200,
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
											this.getInfo(params.row, "product")
										}
									}
								}, '查看'),
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
											this.handleEdit(params.row, "product")
										}
									}
								}, '属性配置'),
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
											this.unbind(params.row, "product")
										}
									}
								}, '解绑'),
							]);
						}
					}
				],
			}
		},
		components: {
			searchForm,
			tableComponent,
			wechatSet,
			propetyEdit
		},
		mounted() {
			this.showTable = true
			this.$nextTick(() => {
				this.getProductList()
				this.getProducts()
				this.getDeviceList()
				this.getDeviceFault()
			})
		},
		methods: {
			//推送配置
			handleCheckAll() {
				if (this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;

				if (this.checkAll) {
					let list = [];
					for (let i in this.faultList) {
						list[i] = (this.faultList)[i].faultId
					}
					this.formPushMsg.ids = list;
				} else {
					this.formPushMsg.ids = [];
				}
			},
			checkAllGroupChange(data) {
				if (data.length === this.faultList.length) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if (data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
			},
			// 处理空数据
			dealNullData(data) {
				return this.$Utils.dealNullData(data)
			},
			// 获取产品列表
			getProducts() {
				let api = this.$api.manage_businessPartner_bindProductList;
				this.$Ax.get(api).then(res => {
					this.productList = res.data
				}).catch(err => {
					/* eslint-disable */
					console.log(err)
					/* eslint-enable */
				})
			},
			beforeChange() {
				let activeName = this.isAllPushMsg ? "关闭" : "开启";
				return new Promise((resolve, reject) => {
					this.$Modal.confirm({
						title: '提示',
						content: '<p>确定要将全部产品推送' + activeName + '</p>',
						onOk: () => {
							resolve();
						},
						onCancel: () => {
							reject();
						}
					});
				});
			},
			//推送开关
			changePushMsg(status) {
				let api = this.$api.manage_businessPartner_setting;
				let para = {
					partnerId: this.partnerId,
					enable: status ? 1 : 0
				}
				this.$Ax.post(api, para).then(res => {
					if (res.success) {
						this.$Message.success(status ? "开启成功" : "关闭成功")
						this.isAllPushMsg = status;
						this.getProductList()
					} else {
						this.$Message.error(res.message)
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 关闭弹出层
			cancel() {
				this.dialogAddProduct = false;
				this.dialogAddDevice = false;
				this.devicePushModal = false;
				this.selectProduct = true;
			},
			handleReset(formName) {
				this.selectProduct = true;
			},
			handleConfirm(formName) {
				let api = this.$api.manage_businessPartner_bindProduct;
				this.$Ax.post(api, {
					partnerId: this.partnerId,
					productKey: (this.formAddProduct.productKey).toString(),
				}).then(res => {
					if (res.success) {
						this.cancel();
						this.$Message.success("绑定成功")
						this.getProductList()
					} else {
						this.$Message.error(res.message)
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (formName == "formAddProduct") {
							this.selectProduct = false;
							this.productNames = [];
							for (let i = 0; i < this.productList.length; i++) {
								for (let j = 0; j < this.formAddProduct.productKey.length; j++) {
									if (this.productList[i].productKey == this.formAddProduct.productKey[j]) {
										this.productNames[j] = this.productList[i]
									}
								}
							}
						}
						if (formName == "formAddDevice") {
							let api = this.$api.manage_businessPartner_bindDevice;
							this.$Ax.post(api, {
								partnerId: this.partnerId,
								deviceName: this.formAddDevice.deviceName,
							}).then(res => {
								if (res.success) {
									this.cancel();
									this.$Message.success("绑定成功")
									this.getDeviceList()
								}
							})
						}
						if (formName == "formPushMsg") {
							let api = this.$api.manage_businessPartner_pushSetting;
							this.$Ax.post(api, {
								productKey: this.formPushMsg.productKey,
								ids: (this.formPushMsg.ids).toString(),
							}).then(res => {
								if (res.success) {
									this.cancel();
									this.$Message.success("设置成功");
									this.getProductList()
								}
							})
						}
					}
				})
			},
			// 获取设备列表
			getDeviceList() {
				let para = {
					partnerId: this.partnerId,
					...this.$refs.deviceNameearchForm.handleSubmit()
				}
				this.$refs.tableDevice.getData(this.$api.manage_device_list, para, true)
			},
			// 获取产品列表
			getProductList() {
				let productPara = {
					partnerId: this.partnerId,
					...this.$refs.productSearchForm.handleSubmit()
				}
				let pushMsgPara = {
					partnerId: this.partnerId,
					...this.$refs.pushMsgSearchForm.handleSubmit()
				}
				this.$refs.tableProduct.getData(this.$api.manage_product_list, productPara, true)
				this.$refs.pushMsgComponent.getData(this.$api.manage_product_list, pushMsgPara, true)
			},
			getDeviceFault() {
				let api = this.$api.manage_faultDescription_list;
				this.$Ax.get(api, {
					commonKey: apiConfig.commonKey,
				}).then(res => {
					if (res.success) {
						this.faultList = res.data
					}
				})
			},
			//绑定产品
			handleBindProduct() {
				this.dialogAddProduct = true;
				this.formAddProduct.productKey = null;
			},
			//设备绑定
			handleBindDevice() {
				this.dialogAddDevice = true;
				this.formAddDevice.deviceName = null;
			},
			//文件导入
			handleImport() {
				this.$refs.readFile.dispatchEvent(new MouseEvent('click'));
			},
			readFiles(e) {
				let that = this;
				const selectedFile = e.target.files[0]
				const reader = new FileReader();
				reader.onload = function() {
					if (reader.result) {
						that.formAddDevice.deviceName = reader.result;
					}
				};
				reader.readAsText(selectedFile, 'GBK')
			},
			//解绑
			unbind(row, type) {
				let api;
				let para;
				let activeName;
				if (type == "product") {
					activeName = "产品"
					api = this.$api.manage_businessPartner_unbindProduct;
					para = {
						partnerId: row.customerId,
						productKey: row.productKey
					}
				}
				if (type == "device") {
					activeName = "设备"
					api = this.$api.manage_businessPartner_unbindDevice;
					para = {
						partnerId: row.customerId,
						deviceName: row.deviceName
					}
				}
				this.$Modal.confirm({
					title: '提示',
					content: '<p>确定要将该' + activeName + '与委托商解绑</p>',
					onOk: () => {
						this.$Ax.post(api, para).then(res => {
							if (res.success) {
								this.dialogAdd = false;
								this.$Message.success('解绑成功')
								this.getProductList()
							} else {
								this.$Message.error(res.message)
							}
						}).catch(err => {
							console.log(err);
						})
					},
					onCancel: () => {}
				});
			},
			//单个产品	
			handlebeforeChange() {
				return new Promise((resolve, reject) => {
					this.$Modal.confirm({
						title: '提示',
						content: '您确认要切换单个产品开关状态吗',
						onOk: () => {
							resolve();
						},
						onCancel: () => {
							reject();
						}
					});
				});
			},
			handleSwicth(row, status) {
				let api = this.$api.manage_businessPartner_enable;
				let para = {
					productKey: row.productKey,
					enable: status ? 1 : 0
				}
				let activeName = status ? "开启" : "关闭";
				this.$Ax.post(api, para).then(res => {
					if (res.success) {
						this.$Message.success(activeName + '成功')
						this.getProductList()
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			handleEdit(row, type) {
				if (type == "pushMsg") {
					this.devicePushModal = true;
					this.indeterminate = false;
					let api = this.$api.manage_businessPartner_getPushDetailSetting;
					let para = {
						productKey: row.productKey,
					}
					this.$Ax.get(api, {
						params: para
					}).then(res => {
						if (res.success) {
							this.formPushMsg = {
								productKey: row.productKey,
								ids: res.data == null ? [] : res.data,
							}
						} else {
							this.$Message.error(res.message)
						}
					}).catch(err => {
						console.log(err);
					})
				}
				// 分配产品属性分类
				if (type == "product") {
					this.$refs.propetyEdit.getProprty(row.productKey)
				}
			},
			getInfo(row, type) {
				if (type == "product" || type == "pushMsg") {
					this.productDetailModal = true;
					this.productDetail = row
				}
				if (type == "device") {
					this.deviceDetailModal = true;
					this.deviceDetail = row
				}
			},
		}
	}
</script>

<style lang="less">
	.agencySet {
		padding: 20px 15px;
		background-color: #fff;
		border-radius: 4px;
		position: relative;

		.title {
			line-height: 30px;
			font-size: 13px;
			font-weight: bold;
			position: absolute;
			top: 20px;
			right: 15px
		}

		.marginLeft {
			float: right;
			display: inline-block;
		}

		.searchForm {
			display: inline-block;
			width: 80%;
		}

		.pushSwitch {
			float: right;
			line-height: 40px;
		}
	}

	.productList {
		list-style: none;
		margin-bottom: 20px;

		li {
			padding-left: 80px;
			line-height: 40px;
		}
	}
</style>
