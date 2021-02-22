/*
*
*   created By Xu Peng
*
*/
<template>
<div class="product-manage-detail">
	<div class="product-manage-detail-device">
		<span class="device-name">{{ productInfo.productName }}（{{ productInfo.productModel }}）</span>
		<statusTag :style="computedTagStyle">
			{{ enable ? '启用' : '停用' }}
		</statusTag>
		<Button type="primary" class="product-manage-detail-btn" @click="$refs['uploadInput'].click()" icon="ios-cloud-upload-outline">
			导入产品属性
			<input @input="handleImportClick" class="product-manage-detail-upload" accept="application/json" ref="uploadInput" type="file" />
		</Button>
	</div>
	<searchForm class="marginLeft" ref="searchForm" @handleSearch="getData" :configList="configList"></searchForm>
	<div class="product-manage-detail-table">
		<tableComponent class="productTable" ref="tableComponent" :columns="columns">
		</tableComponent>
	</div>
	<Modal :width="600" class-name="product-manage-modal" v-model="visible" title="属性设置">
		<div slot="footer">
			<Button @click.stop="handleCancel">取消</Button>
			<Button type="primary" @click.stop="handleSubmit(modalData)" :loading="loading">确认</Button>
		</div>
		<div>
			<div class="product-manage-modal-header">
				<span style="font-size: 16px;">{{ modalData.propertyName }}</span>
				<div class="product-manage-modal-header-right">
					<span class="text">检测</span>
					<i-switch v-model="modalData.checked" @on-change="handleSwitchChange" size="large">
						<span slot="open">ON</span>
						<span slot="close">OFF</span>
					</i-switch>
				</div>
			</div>
			<div class="product-manage-modal-header">
				<div class="product-manage-modal-header-right">
					<span class="text">手动填写</span>
					<i-switch v-model="modalData.manually" @on-change="handleSwitchChange" size="large">
						<span slot="open">ON</span>
						<span slot="close">OFF</span>
					</i-switch>
				</div>
			</div>
			<div class="product-manage-modal-body">
				<propertySet v-model="modalData" v-if="modalData.checked" />
			</div>
			<div class="product-manage-modal-footer">
				<p>数据类型：{{ modalData.dataType | formatType}}</p>
				<formatDataRange :type="modalData.dataType" :data="modalData.dataRange" />
			</div>
		</div>
	</Modal>
</div>
</template>
<script>
let cache = null
import tableComponent from '@/components/tableComponent.vue'
import searchForm from '@/components/searchForm.vue'
import statusTag from '@/components/statusTag.vue'
import utils from '@/utils/dealNullData.js'
import {
	isPlainObject
} from "@/utils/utils.js"
import propertySet from './propertySet.vue'
import formatDataRange from './innerComponents/formatDataRange.vue'
import {
	TYPE_MAP
} from './staticVariable.js'
export default {
	components: {
		searchForm,
		tableComponent,
		statusTag,
		propertySet,
		formatDataRange
	},
	data() {
		return {
			configList: [{
				plh: '属性名称',
				valName: 'propertyName',
				type: 'input',
			}],
			enable: false,
			visible: false,
			isSwitch: false,
			loading: false,
			modalData: {},
			productInfo: {},
			columns: [{ // 表格配置
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '属性名称',
					align: 'center',
					key: 'propertyName',
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(params.row.propertyName)
							} < /span>
						)
					}
				},
				{
					title: '标识符',
					align: 'center',
					key: 'identifier',
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(params.row.identifier)
							} < /span>
						)
					}
				},
				{
					title: '数据类型',
					align: 'center',
					key: 'dataType',
					width: 150,
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(TYPE_MAP[params.row.dataType].lable)
							} < /span>
						)
					}
				},
				{
					title: '取值范围',
					align: 'center',
					key: 'dataRange',
					width: 150,
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(this.handleDataRange(params.row.dataRange, params.row))
							} < /span>
						)
					}
				},
				{
					title: '检测标准值',
					align: 'center',
					key: 'standard',
					width: 150,
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(this.handleDataRange(params.row.standard, params.row))
							} < /span>
						)
					}
				},
				{
					title: '是否检测',
					align: 'center',
					key: 'standard',
					width: 150,
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(this.handleDealCheck(params.row.checked))
							} < /span>
						)
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return ( <
							Button type = "text"
							size = "small"
							ghost vOn: click = {
								() => this.handleSetClick(params.row)
							} > 设置 < /Button>
						)
					}
				}
			],
		};
	},
	filters: {
		formatType(type) {
			return TYPE_MAP[type] && TYPE_MAP[type].lable
		}
	},
	mounted() {
		if (this.$route.query.enable) {
			this.enable = Number(this.$route.query.enable)
		}
		if (this.$route.query.productKey) {
			this.productInfo = JSON.parse(sessionStorage.getItem(`product_${this.$route.query.productKey}`)) || {}
			cache = this.$route.query.productKey
			this.getData()
		}
	},
	beforeDestroy() {
		sessionStorage.removeItem(`product_${cache}`)
		cache = null
	},
	computed: {
		computedTagStyle() {
			const backgroundColor = this.enable ? '#5fd487' : '#f5222d'
			return {
				background: backgroundColor,
			}
		},

	},
	methods: {
		dealNullData: utils.dealNullData,
		getData() {
			let params = {
				productKey: this.$route.query.productKey,
				...this.$refs.searchForm.handleSubmit()
			}
			let api = this.$api.manage_qc_product_property;
			this.$refs.tableComponent.getData(api, params)
		},
		// 导入产品属性
		handleImportClick() {
			let file = this.$refs['uploadInput'].files[0]
			let formData = new FormData()
			formData.append('productKey', cache)
			formData.append('file', file)
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				transformRequest: [
					(data) => data
				]
			}
			let api = this.$api.manage_qc_product_importJson
			this.$Ax.post(api, formData, config).then((res) => {
				if (res.success) {
					let params = {
						productKey: this.$route.query.productKey
					}
					this.$refs.tableComponent.getData(this.$api.manage_qc_product_property, params)
					this.$refs['uploadInput'].value = null
				} else {
					this.$Message.warning('同步属性失败')
				}
			}).catch(() => {})
		},
		handleDataRange(data, row) {
			if (row.dataType === 'struct' || row.dataType === 'array') return '--'
			if (isPlainObject(data) || Array.isArray(data)) {
				return JSON.stringify(data)
			}
			return data
		},
		validateForm() {
			let pass
			this.$refs['form'].validate((valid) => {
				pass = valid
			})
			return pass
		},
		// 设置属性
		handleSubmit(data) {
			// if (!this.validateForm()) return
			this.loading = true
			let api = this.$api.manage_qc_product_property;
			let params = {
				dataType: data.dataType,
				id: data.id,
				checked: data.checked,
				standard: data.standard,
				identifier: data.identifier,
				manually: data.manually
			}
			const config = {
				headers: {
					'Content-Type': 'application/json'
				},
				transformRequest: [
					(data) => JSON.stringify(data)
				]
			}
			this.$Ax.post(api, params, config).then((res) => {
				if (res.success) {
					this.loading = false
					this.visible = false
					this.$Message.success('保存成功')
					this.$refs.tableComponent.getData(api, {
						productKey: data.productKey
					})
				}
			}).catch((err) => {
				this.loading = false
			})
		},
		handleSetClick(row) {
			let standard = null
			if (row.dataType == 'double' || row.dataType == 'float') {
				if (row.standard != null) {
					standard = row.standard
				}
			}
			this.modalData = Object.assign({}, row)
			if (standard != null) {
				this.modalData.standard = standard
			}
			if (row.dataType == 'int') {
				if (this.modalData.standard == null)
					this.modalData.standard = {
						max: 0,
						min: 0
					}
				else {
					this.modalData.standard.max = Number(this.modalData.standard.max)
					this.modalData.standard.min = Number(this.modalData.standard.min)
				}
			}
			this.visible = true
		},
		handleCancel() {
			this.getData()
			this.visible = false
			this.loading = false
		},
		handleDealCheck(flag){
				return flag?'检测':'不检测'
		},
		handleSwitchChange() {},
	},
}
</script>
<style lang='less'>
.product-manage-detail {
    background: #fff;
    border-radius: 4px;
    padding-bottom: 24px;
    .product-manage-detail-device {
        position: relative;
        padding: 24px;
        line-height: 24px;
        .product-manage-detail-btn {
            position: absolute;
            right: 30px;
        }
        .product-manage-detail-upload {
            display: none;
        }
        .device-name {
            display: inline-block;
            font-size: 16px;
            color: #3F4656;
        }
    }
    .product-manage-detail-table {
        .ivu-btn-text:focus {
            box-shadow: none;
        }
    }
}
.product-manage-modal {
    &.ivu-modal-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        .ivu-modal {
            top: 0;
        }
    }
    .product-manage-modal-header {
        position: relative;
        text-align: center;
        height: 40px;
        .product-manage-modal-header-right {
            position: absolute;
            right: 0;
            top: 0;
            .text {
                display: inline-block;
                margin-right: 5px;
                font-size: 14px;
                color: #3F4656;
                height: 20px;
                vertical-align: middle;
                line-height: 20px;
            }
        }
    }
    .product-manage-modal-body {
        margin: 24px 0 32px;
        padding-left: 56px;
        .body-text {
            font-size: 14px;
            color: #616B81;
        }
    }
    .product-manage-modal-footer {
        background: #FAFAFA;
        border-radius: 4px;
        padding: 20px 0 20px 56px;
        p {
            font-size: 14px;
            color: #616B81;
            line-height: 2;
        }
    }
}
</style>
