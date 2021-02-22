<template>
<div class="product">
	<div class="productTypeWrap">
		<div class="product-content productTypeBar">
			<span class="title">型号统计</span>
			<Button type='text' @click='handleShowChart'>显示所有</Button>
			<div class="total">
				<div class="number">{{ productTotal }}</div>
				<div class="explain">设备总计</div>
			</div>
			<div class="clearfloat"></div>
			<div id='productTypeBar' style="width: 100%; height:180px;"></div>
		</div>
		<div class="product-content productTypePie">
			<div class="title">型号占比</div>
			<div id='productTypePie' style="margin: 0 auto; width: 200px; height:200px;"></div>
		</div>
	</div>
	<div class="product-content">
		<Button @click='handleRefresh()' type='primary' class="marginLeft">同步</Button>
		<div class="searchBox">
			<searchForm ref='searchForm' @handleSearch='getTableData()' :configList='configList'></searchForm>
		</div>
		<div class="marginTop">
			<tableComponent v-if='showTable' class="productTable" ref='tableComponent' :columns='columns'></tableComponent>
		</div>
	</div>
	<!-- 详情表单 -->
	<Modal v-model="detailModal" title="产品详情" class-name="detailModal" :mask-closable="false" :width="700" :footer-hide="true" @on-visible-change="closeModal">
		<div class="detailWrap">
			<Form class="detailDiv">
				<FormItem class="formDiv">
					<div class="title">产品名称：</div>
					<div class="content">{{dealNullData(productDetail.productName)}}</div>
				</FormItem>
				<FormItem class="formDiv">
					<div class="title">PK码：</div>
					<div class="content">{{dealNullData(productDetail.productKey)}}</div>
				</FormItem>
				<FormItem class="formDiv">
					<div class="title">自定义产品型号：</div>
					<div class="content">{{dealNullData(productDetail.ownProductModel)}}</div>
				</FormItem>
				<FormItem class="formDiv">
					<div class="title">创建时间：</div>
					<div class="content">{{dealNullData(productDetail.createTime)}}</div>
				</FormItem>
				<FormItem class="formDiv">
					<div class="title">设备列表显示：</div>
					<div class="content">{{dealNullData(productDetail.showProperty)}}</div>
				</FormItem>
				<FormItem class="formDiv">
					<div class="title">描述信息：</div>
					<div class="content">{{dealNullData(productDetail.description)}}</div>
				</FormItem>
			</Form>
			<div class="detailDiv" style="width:53%;">
				<Tabs :value="'netImgInfo'">
					<TabPane label="配网/绑定说明" name="netImgInfo">
						<div class="phone">
							<div class="netExplain" v-if="!dealShowImg(productDetail.network)"></div>
							<div class="netImage" v-else :style="dealShowImg(productDetail.network)"></div>
						</div>
					</TabPane>
					<TabPane label="扫码说明" name="scanImageInfo">
						<div class="phone">
							<div class="scanExplain" v-if="!dealShowImg(productDetail.describeFile)"></div>
							<div class="scanImage" v-else :style="dealShowImg(productDetail.describeFile)"></div>
						</div>
					</TabPane>
					<TabPane label="产品说明" name="productImgInfo">
						<div class="phone">
							<div class="productExplain" v-if="!dealShowImg(productDetail.productFile)"></div>
							<div class="productImage" v-else :style="dealShowImg(productDetail.productFile)"></div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		</div>
	</Modal>
	<!-- 编辑表单 -->
	<Modal v-model="editModal" title="产品编辑" class-name="editModal" :mask-closable="false" :width="700" @on-visible-change="closeModal" @on-ok="handleSubmit" @on-cancel="cancelEdit">
		<div class="detailWrap">
			<Form ref="formInline" :label-width='120' style="width:45%">
				<FormItem label='产品名称：'>
					<span class="content">{{dealNullData(productEdit.productName)}}</span>
				</FormItem>
				<FormItem label='PK码：'>
					<span class="content">{{dealNullData(productEdit.productKey)}}</span>
				</FormItem>
				<FormItem label='自定义产品型号：'>
					<Input v-model='ownProductModel' placeholder='请输入自定义产品类型' class="formInput"></Input>
				</FormItem>
				<FormItem label='设备列表显示：'>
					<Select v-model="showProperty" label-in-value style="width:100px" @on-change='handleBeforeSubmit' clearable>
						<Option :value="'waterAmount'">可用水量</Option>
						<Option :value="'waterToc'">出水Toc</Option>
						<Option :value="'waterQuality'">出水Tds</Option>
					</Select>
				</FormItem>
				<FormItem label='滤芯类型：'>
					<Select v-model="filterType" label-in-value style="width:100px" clearable>
						<Option :value="'NF'">NF</Option>
						<Option :value="'RO'">RO</Option>
					</Select>
				</FormItem>
			</Form>
			<div class="detailDiv" style="width:53%;">
				<Tabs :value="'netImg'">
					<TabPane label="配网/绑定说明" name="netImg">
						<div class="phone">
							<div class="netExplain" v-if="!dealShowImg(productEdit.network)"></div>
							<div class="netImage" v-else :style="dealShowImg(productEdit.network)"></div>
							<div class="uploadWrap">
								<!-- eslint-disable-next-line -->
								<Upload class="uploadDiv" :action="uploadUrl" :data="upLoadData" :show-upload-list="false" :format="['jpg' ,'jpeg' ,'png', 'gif', 'bmp']" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" :on-success="uploadNetSuccess" :on-error="uploadError">
									<Button>更改图片</Button>
								</Upload>
							</div>
							<div class="uploadWrap">
								<!-- eslint-disable-next-line -->
								<Upload class="uploadDiv" :action="uploadUrl" :data="upLoadData" :before-upload='uploadBefore' :max-size='1000' :show-upload-list="false" :format="['jpg','jpeg','png', 'gif', 'bmp']" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
								    :on-success="uploadNetSuccess" :on-error="uploadError">
									<Button>{{dealShowImg(productEdit.network)?'更改图片':'上传图片'}}</Button>
									<span slot="tip">未选择任何图片</span>
								</Upload>
							</div>
						</div>
					</TabPane>
					<TabPane label="扫码说明" name="scanImage">
						<div class="phone">
							<div class="scanExplain" v-if="!dealShowImg(productEdit.describeFile)"></div>
							<div class="scanImage" v-else :style="dealShowImg(productEdit.describeFile)"></div>
							<div class="uploadWrap">
								<!-- eslint-disable-next-line -->
								<Upload class="uploadDiv" :action="uploadUrl" :data="upLoadData" :before-upload='uploadBefore' :max-size='1000' :show-upload-list="false" :format="['jpg','jpeg','png', 'gif', 'bmp']" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
								    :on-success="uploadScanSuccess" :on-error="uploadError">
									<Button>{{dealShowImg(productEdit.describeFile)?'更改图片':'上传图片'}}</Button>
									<span slot="tip">未选择任何图片</span>
								</Upload>
							</div>
						</div>
					</TabPane>
					<TabPane label="产品图片" name="productImg">
						<div class="phone">
							<div class="productExplain" v-if="!dealShowImg(productEdit.productFile)"></div>
							<div class="productImage" v-else :style="dealShowImg(productEdit.productFile)"></div>
							<div class="uploadWrap">
								<!-- eslint-disable-next-line -->
								<Upload class="uploadDiv" :action="uploadUrl" :data="upLoadData" :before-upload='uploadBefore' :show-upload-list="false" :format="['jpg','jpeg','png', 'gif', 'bmp']" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" :on-success="uploadProductSuccess"
								    :on-error="uploadError">
									<Button>{{dealShowImg(productEdit.productFile)?'更改图片':'上传图片'}}</Button>
									<span slot="tip">未选择任何图片</span>
								</Upload>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		</div>
		<!-- <Spin fix></Spin> -->
	</Modal>
	<!-- 图表弹窗 -->
	<Modal v-model="dialogChart" title="型号统计" :width="1200" :footer-hide="true" @on-visible-change="closeModal">
		<div id='productTypeChart' style="width: 1200px; height:680px;"></div>
	</Modal>
	<!-- 分配属性 -->
	<propetyEdit ref='propetyEdit'></propetyEdit>
</div>
</template>
<script>
import apiConfig from '@/apiConfig'
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
import propetyEdit from './propetyEdit.vue'
var echarts = require('echarts');

export default {
	name: 'product',
	data() {
		return {
			apiConfig, // api配置
			filterType: '', // 滤芯类型
			productTotal: 0, // 产品型号总量
			showProperty: '',
			uploadUrl: '', // 上传地址
			networkId: '', // 上传的配网图片ID
			ownProductModel: '', //自定义产品名称
			describeId: '', // 上传的扫码图片ID
			dialogChart: false,
			productId: '', // 当前产品标示
			showTable: false,
			navActive2: false,
			detailModal: false, // 控制详情弹窗
			editModal: false, // 控制编辑弹窗
			upLoadData: { // 引入通用接口验证码
				commonKey: apiConfig.commonKey
			},
			propertyList: [],
			productDetail: [], // 产品详情
			productEdit: [], // 产品编辑
			productTypeArr: [],
			configList: [{ // 筛选框配置
					plh: '产品名称',
					valName: 'productName',
					type: 'input'
				}, {
					plh: '产品PK',
					valName: 'productKey',
					type: 'input'
				},
				{
					plh: '自定义产品型号',
					valName: 'ownProductModel',
					type: 'select',
					labelName: 'label',
					valueName: 'value',
					keyName: 'value',
					selectList: [],
				},
				{
					plh: '创建时间',
					type: 'dateRange'
				}
			],
			columns: [{ // 表格配置
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
							h('div', this.dealNullData(params.row.ownProductModel))
						]);
					}
				},
				{
					title: '创建时间',
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
					title: '设备数量',
					align: 'center',
					key: 'nums',
					render: (h, params) => {
						return h('div', [
							h('div', {
								style: {
									textAlign: 'center'
								}
							}, params.row.nums)
						]);
					}
				},
				{
					title: '描述信息',
					align: 'center',
					key: 'description',
					render: (h, params) => {
						return h('div', [
							h('div', this.dealNullData(params.row.description))
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
										this.getInfo(params.row)
									}
								}
							}, '详情'),
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
										this.handleEditProp(params.row)
									}
								}
							}, '属性分类'),
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
										this.handleEdit(params.row)
									}
								}
							}, '编辑'),
						]);
					}
				}
			],
		}
	},
	created() {
		this.uploadUrl = 'web/api/' + this.$api.common_upload_file
		this.productTypeArr = this.$store.state.common.productList
		let api = this.$api.common_getOwnProductModel,
			para = {
				customerId: this.$store.state.user.customerId
			}
		this.$Ax.get(api, {
			params: para
		}).then(res => {
			let list = []
			for (let i in res.data) {
				list.push({
					value: res.data[i],
					label: res.data[i]
				})
			}
			this.configList[2].selectList = list
		}).catch(err => {
			// eslint-disable-next-line
			console.log(err);
		})
	},
	mounted() {
		if (this.$store.state.user.userName == 'root') {
			this.columns.splice(2, 0, {
				title: '所属客户',
				align: 'center',
				key: 'customerName',
				render: (h, params) => {
					return h('div', [
						h('div', this.dealNullData(params.row.customerName))
					]);
				}
			})
		}
		this.showTable = true
		this.$nextTick(() => {
			this.getTableData()
		})
		this.handleInitChart()
	},
	components: {
		searchForm,
		tableComponent,
		propetyEdit,
	},
	methods: {
		// 获取表格数据
		getTableData() {
			let para = this.$refs.searchForm.handleSubmit()
			this.$refs.tableComponent.getData(this.$api.manage_product_list, para, true)
		},
		// 清空弹出层数据
		clearModalData() {
			this.productDetail = []
			this.productEdit = []
			this.networkId = ''
			this.describeId = ''
		},
		// 关闭弹出层
		closeModal(val) {
			if (!val) {
				this.clearModalData()
			}
		},
		// 编辑确定
		handleSubmit() {
			if (typeof this.productEdit.showProperty == 'object') {
				if (this.productEdit.showProperty != null) {
					this.productEdit.showProperty = JSON.stringify(this.productEdit.showProperty)
				} else {
					this.productEdit.showProperty = undefined
				}
			}
			this.productEdit.filterType = this.filterType
			this.productEdit.ownProductModel = this.ownProductModel
			let api = this.$api.manage_product_update,
				para = this.productEdit
			this.$Ax.post(api, para).then(res => {
				if (res.success) {
					this.$Message.success('编辑成功')
					this.getTableData()
				} else {
					this.$Message.error(res.message)
				}
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
			this.clearModalData()
		},
		// 提交表单前赋值
		handleBeforeSubmit(value) {
			if (value) {
				this.productEdit.showProperty = {
					value: value.value,
					label: value.label
				}
			}
		},
		// 编辑取消
		cancelEdit() {
			this.clearModalData()
		},
		// 上传·配网/绑定说明
		uploadNetSuccess(res) {
			if (res.success) {
				this.$Message.success('上传成功')
				this.productEdit.network = res.data
			} else {
				this.$Message.error(res.message)
			}
		},
		// 上传·扫码说明
		uploadScanSuccess(res) {
			if (res.success) {
				this.$Message.success('上传成功')
				this.productEdit.describeFile = res.data
			} else {
				this.$Message.error(res.message)
			}
		},
		// 上传·产品说明
		uploadProductSuccess(res) {
			if (res.success) {
				this.$Message.success('上传成功')
				this.productEdit.productFile = res.data
			} else {
				this.$Message.error(res.message)
			}
		},
		// 上传·失败
		uploadError(err) {
			this.$Message.error(err)
		},
		// 上传·文件超出指定大小限制时的钩子
		uploadBefore(file) {
			let size = (file.size / 1024) / 1024
			if (size > 1) {
				this.$Message.error('文件过大，图片大小请小于1M')
				return false
			} else {
				return true
			}
		},
		// 获取产品详情
		getInfo(row) {
			let api = this.$api.manage_product_detail,
				para = {
					id: row.id
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				if (res.success) {
					const data = res.data
					for (var i = 0; i < this.productTypeArr.length; i++) {
						if (this.productTypeArr[i].productKey === data.productKey) {
							data.productModel = this.productTypeArr[i].productModel
						}
					}
					this.productDetail = data
					this.productDetail.showProperty = data.showProperty == null ? '--' : JSON.parse(data.showProperty).label
					if (data.network != null) {
						this.netbgImage = 'url(' + this.apiConfig.baseURL + 'common/getFile/' + data.network + '?commonKey=' +
							apiConfig.commonKey + ')'
					}
					if (data.describeFile != null) {
						this.scanbgImage = 'url(' + this.apiConfig.baseURL + 'common/getFile/' + data.describeFile + '?commonKey=' +
							apiConfig.commonKey + ')'
					}
				} else {
					this.$Message.error(res.message)
				}
				this.detailModal = true
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 查看配网图片
		getPic(row) {
			this.$Modal.info({
				title: row.ercodeUrl == null || row.ercodeUrl == '' || row.ercodeUrl == undefined ? '暂无图片' : '配网图片',
				render: (h) => {
					return h('img', {
						attrs: {
							src: row.ercodeUrl + '?commonKey=' + this.apiConfig.commonKey
						},
						style: {
							marginLeft: '35%',
							width: '100px',
							height: '100px'
						},
					})
				}
			})
		},
		// 编辑产品信息
		handleEdit(row) {
			this.productId = row.id
			let api = this.$api.manage_product_detail,
				para = {
					id: row.id
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				if (res.success) {
					const data = res.data
					this.filterType = data.filterType ? data.filterType : ''
					this.productEdit = data
					this.ownProductModel = data.ownProductModel
					this.showProperty = (data.showProperty != '' && data.showProperty != null && data.showProperty != 'null') ?
						JSON.parse(data.showProperty).value : ''
				} else {
					this.$Message.error(res.message)
				}
				this.editModal = true
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 产品型号统计
		handleInitChart() {
			let productTypeBar = echarts.init(document.getElementById('productTypeBar'));
			let productTypePie = echarts.init(document.getElementById('productTypePie'));
			this.$Ax.get(this.$api.manage_product_getChartsData).then(res => {
				if (res.success) {
					const list = res.data.data,
						data = res.data
					let xData = []
					let yData = []
					let preData = []
					for (var i = 0; i < list.length; i++) {
						xData.push(list[i].productName)
						yData.push(list[i].num)
						preData.push({
							value: list[i].num,
							name: list[i].productName
						})
					}
					this.productTotal = data.total // 型号总数
					var option1 = {
						tooltip: {
							trigger: 'item',
							formatter: '{b}<br />设备 {c} 台'
						},
						grid: {
							top: '3%',
							left: '3%',
							right: '3%',
							bottom: '3%',
							containLabel: true
						},
						dataZoom: [{
							type: 'inside', //图表下方的伸缩条
							show: true, //是否显示
							realtime: true, //拖动时，是否实时更新系列的视图
							start: 0, //伸缩条开始位置（1-100），可以随时更改
							end: 50, //伸缩条结束位置（1-100），可以随时更改
						}],
						xAxis: {
							axisLabel: {
								interval: 0,
								// rotate: 45,
								// margin: 2,
								clickable: true, //并给图表添加单击事件  根据返回值判断点击的是哪里
								interval: 0,
								formatter: function(params, index) {
									if (index % 2 != 0) {
										return '\n\n' + params;
									} else {
										return params;
									}
								},
								textStyle: {
									color: "#222"
								}
							},
							type: 'category',
							splitLine: {
								show: false
							},
							data: xData,
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							name: '型号统计',
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#5FA1E6'
								}
							},
							barWidth: 24,
							data: yData
						}]
					};
					var option2 = {
						tooltip: {
							trigger: 'item',
							formatter: '{a} <br/>{b}: {c} ({d}%)'
						},
						series: [{
							name: '型号占比',
							type: 'pie',
							radius: ['70%', '90%'],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: false,
									position: 'center'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: preData
						}]
					};
					productTypeBar.setOption(option1);
					productTypePie.setOption(option2);
				} else {
					this.$Message.error(res.message)
				}
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 从阿里服务器拉取产品信息
		handleRefresh() {
			let value, para
			let api = this.$api.manage_product_getProduct
			this.$Modal.confirm({
				render: (h) => {
					return h('Input', {
						props: {
							autofocus: true,
							placeholder: '请输入产品PK码'
						},
						on: {
							input: (val) => {
								value = val
							}
						}
					})
				},
				onOk: () => {
					para = {
						productKey: value
					}
					this.$Ax.get(api, {
						params: para
					}).then(res => {
						if (res.success) {
							this.$Message.success('获取成功')
						} else {
							this.$Message.error(res.message)
						}
						this.getTableData()
					}).catch(err => {
						/* eslint-disable */
						console.log(err);
						/* eslint-enable */
					})
				}
			})
		},
		// 分配产品属性分类
		handleEditProp(row) {
			this.$refs.propetyEdit.getProprty(row.productKey)
		},
		// 处理图片显示
		dealShowImg(imgUrl) {
			if (imgUrl == '' || imgUrl == null || imgUrl == undefined) {
				return false
			} else {
				return {
					'backgroundImage': 'url(' + this.apiConfig.baseURL + 'common/getFile/' + imgUrl + '?commonKey=' + apiConfig.commonKey +
						')'
				}
			}
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 处理空数据
		dealNullData(data) {
			return this.$Utils.dealNullData(data)
		},
		// 展开图表弹窗
		handleShowChart() {
			this.dialogChart = true
			let productTypeChart = echarts.init(document.getElementById('productTypeChart'));
			this.$Ax.get(this.$api.manage_product_getChartsData).then(res => {
				if (res.success) {
					const data = res.data.data
					let xData = []
					let yData = []
					let preData = []
					for (var i = 0; i < data.length; i++) {
						xData.push(data[i].productName)
						yData.push(data[i].num)
					}
					var option1 = {
						tooltip: {
							trigger: 'item',
							formatter: '{b}<br />设备 {c} 台'
						},
						grid: {
							top: '3%',
							left: '3%',
							right: '3%',
							bottom: '3%',
							containLabel: true
						},
						dataZoom: [{
							type: 'inside', //图表下方的伸缩条
							show: true, //是否显示
							realtime: true, //拖动时，是否实时更新系列的视图
							start: 0, //伸缩条开始位置（1-100），可以随时更改
							end: 100, //伸缩条结束位置（1-100），可以随时更改
						}],
						xAxis: {
							axisLabel: {
								interval: 0,
								rotate: 45,
								// margin: 2,
								clickable: true, //并给图表添加单击事件  根据返回值判断点击的是哪里
								interval: 0,
								formatter: function(params, index) {
									if (index % 2 != 0) {
										return '\n\n' + params;
									} else {
										return params;
									}
								},
								textStyle: {
									color: "#222"
								}
							},
							type: 'category',
							splitLine: {
								show: false
							},
							data: xData,
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							name: '型号统计',
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#5FA1E6',
									label: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#615a5a'
										},
										formatter: function(params) {
											// if (params.value == 0) {
											// 	return '';
											// } else {
											return params.value;
											// }
										}
									}
								}
							},
							barWidth: 24,
							data: yData
						}],
					};
					productTypeChart.setOption(option1);
				} else {
					this.$Message.error(res.message)
				}
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		}
	}
}
</script>

<style scoped>
.productTypeWrap {
	display: flex;
	margin-bottom: 20px;
}

.product-content {
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.product-content.productTypeBar {
	box-sizing: border-box;
	flex: 1;
	margin-right: 24px;
	padding: 20px;
	height: 254px;
}

.product-content.productTypePie {
	box-sizing: border-box;
	padding: 20px;
	width: 370px;
	height: 254px;
}

.product-content .title {
	font-family: PingFang-SC-Bold;
	font-size: 14px;
	font-weight: bold;
	color: #3F4656;
}

.product-content .total {
	float: right;
	margin-top: -21px;
}

.product-content .total .number {
	font-family: PingFang-SC-Bold;
	font-size: 16px;
	font-weight: bold;
	color: #3F4656;
	text-align: right;
}

.product-content .total .explain {
	font-family: PingFang-SC-Medium;
	font-size: 12px;
	color: #999;
	text-align: right;
}

.marginLeft {
	margin-bottom: 20px;
}

.searchBox {
	margin-left: 20px;
}

.searchBtn {
	margin: 0 0 20px 20px;
	padding: 1px 6px;
	font-size: 18px;
}

.detailWrap {
	display: flex;
	width: 100%;
}

.detailDiv {
	flex: 1;
}

.detailDiv:last-child {
	flex: 1;
}

.detailDiv .formDiv {
	margin-bottom: 16px;
	width: 100%;
	font-size: 14px;
}

.detailDiv .formDiv .title {
	float: left;
	width: 100px;
	color: #616B81;
	text-align: right;
}

.detailDiv .formDiv .content {
	margin-left: 100px;
	color: #3F4656;
	word-wrap: break-word;
	word-break: break-all;
}

.detailDiv .headNav {
	margin: 0 auto 16px;
	width: max-content;
	height: 32px;
	line-height: 32px;
}

.detailDiv .headNav .nav {
	display: inline-block;
	height: 100%;
	font-size: 14px;
	color: #3F4656;
	cursor: pointer;
}

.detailDiv .headNav .nav.active {
	color: #2D8CF0;
	border-bottom: 2px solid #2D8CF0;
}

.detailDiv .phone {
	position: relative;
	margin: 0 auto;
	width: 259px;
	height: 533px;
	background-image: url(./phone.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.detailDiv .phone .netExplain {
	position: absolute;
	top: 242px;
	left: 17px;
	width: 225px;
	height: 168px;
	background-image: url(./pw_pic_default.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.detailDiv .phone .netImage {
	position: absolute;
	top: 242px;
	left: 17px;
	width: 225px;
	height: 168px;
	background-repeat: no-repeat;
	background-size: 100% 100%;
}


.detailModal .detailDiv .phone .scanExplain {
	position: absolute;
	top: 68px;
	left: 17px;
	width: 225px;
	height: 400px;
	background-image: url(./pw_pic_default.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.detailModal .detailDiv .phone .scanImage {
	position: absolute;
	top: 68px;
	left: 17px;
	width: 225px;
	height: 400px;
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.editModal .detailDiv .phone .scanExplain {
	position: absolute;
	top: 68px;
	left: 17px;
	width: 225px;
	height: 344px;
	background-image: url(./pw_pic_default.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.editModal .detailDiv .phone .scanImage {
	position: absolute;
	top: 68px;
	left: 17px;
	width: 225px;
	height: 344px;
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.detailDiv .phone .productExplain {
	position: absolute;
	top: 135px;
	left: 17px;
	width: 60px;
	height: 60px;
	background-image: url(./pw_pic_default.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.detailDiv .phone .productImage {
	position: absolute;
	top: 135px;
	left: 17px;
	width: 60px;
	height: 60px;
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.detailDiv .phone .uploadWrap {
	position: absolute;
	left: 17px;
	bottom: 65px;
	width: 225px;
	height: 56px;
	background-color: #fff;
}

.detailDiv .phone .uploadWrap .uploadDiv {
	margin-top: 12px;
	padding-left: 15px;
}

.detailDiv .phone .uploadWrap .uploadDiv span {
	margin-left: 8px;
}

.formInput {
	width: 150px;
}
</style>
