/*
*
*   created By Xu Peng
*
*/
<template>
<div class="product-manage-container">
	<div class="product-manage-search">
		<!-- <Button class="product-manage-search-button" @click='handleRefresh' type='primary'>刷新</Button> -->
		<searchForm ref="searchForm" @handleSearch="search" :configList="configList"></searchForm>
	</div>
	<div class="product-manage-table">
		<tableComponent class="productTable" ref="tableComponent" :columns="columns"></tableComponent>
	</div>
</div>
</template>

<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
import statusTag from '@/components/statusTag.vue'
import utils from '@/utils/dealNullData.js'
export default {
	components: {
		searchForm,
		tableComponent,
		statusTag,
	},
	data() {
		return {
			configList: [
				// {
				// 	plh: '自定义产品型号',
				// 	valName: 'ownProductModel',
				// 	type: 'select',
				// 	labelName: 'ownProductModel',
				// 	valueName: 'ownProductModel',
				// 	keyName: 'key',
				// 	selectList: [],
				// },
				{
					plh: '状态',
					valName: 'enable',
					type: 'select',
					labelName: 'label',
					valueName: 'value',
					keyName: 'productKey',
					selectList: [{
							value: 0,
							label: '停用',
						},
						{
							value: 1,
							label: '启用',
						},
					],
				},
				{
					plh: '产品名称',
					valName: 'productName',
					type: 'select',
					labelName: 'productName',
					valueName: 'productName',
					keyName: 'key',
					selectList: [],
				},
			],
			columns: [{ // 表格配置
					type: 'index',
					title: '序号',
					width: 60,
					align: 'center'
				},
				{
					title: '自定义产品型号',
					align: 'center',
					key: 'ownProductModel',
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(params.row.ownProductModel)
							} < /span>
						)
					}
				},
				{
					title: '产品名称',
					align: 'center',
					key: 'productName',
					render: (h, params) => {
						return ( <
							span > {
								this.dealNullData(params.row.productName)
							} < /span>
						)
					}
				},
				{
					title: '创建时间',
					align: 'center',
					key: 'createTime',
					width: 150,
					render: (h, params) => {
						return ( <span> {this.dealNullData(params.row.createTime)} < /span>
						)
					}
				},
				{
					title: '状态',
					align: 'center',
					key: 'enable',
					width: 150,
					render: (h, params) => {
						const backgroundColor = params.row.enable ? '#5fd487' : '#f5222d'
						const styleObj = {
							backgroundColor,
						}
						const action = params.row.enable ? "启用" : "停用"
						return ( <
							statusTag style = {
								styleObj
							}
							name = "dsss" > {
								action
							} < /statusTag>
						)
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						const action = params.row.enable ? "停用" : "启用"
						const title = `是否确定${action}${params.row.productName}?`
						return ( <div class = "table-button-group" >
							<Button class = "action-btn" type = "text" size = "small" ghost vOn: click = {() => this.handleDetailClick(params.row)} >
							详情
							</Button>
							<Poptip confirm transfer placement = 'left' vOn: on-ok = { () => this.handleStopOrStartClick(params.row)}title = {title} >
								<Button class = "action-btn" type = "text" size = "small" ghost > {action}</Button>
							</Poptip>
							</div>
						)
					}
				}
			],
		};
	},
	created() {
		this.configList[1].selectList = this.$store.state.common.productList
	},
	mounted() {
		this.search()
	},
	methods: {
		dealNullData: utils.dealNullData,
		handleDetailClick(val) {
			const temp = {
				productModel: val.productModel,
				productName: val.productName,
			}
			sessionStorage.setItem(`product_${val.productKey}`, JSON.stringify(val))
			this.$router.push({
				name: 'productManageDetail',
				query: {
					productKey: val.productKey,
					enable: val.enable,
				}
			})
		},
		// 启用/停用时弹出框确认
		handleStopOrStartClick(val) {
			const {
				enable,
				id,
			} = val
			let params = {
				enable: Number(!enable),
				id,
			}
			const api = this.$api.manage_qc_product_enable;
			this.$Ax.post(api, params).then(res => {
				if (res.success) {
					const tip = enable ? '停用' : '启用'
					this.$Message.success(`${tip}成功`)
					this.search()
				} else {
					this.$Message.error(res.message)
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// handleRefresh() {
		// 	this.search()
		// },
		// 表单查询
		search() {
			let params = this.$refs.searchForm.handleSubmit()
			this.$refs.tableComponent.getData(this.$api.manage_qc_product_list, params, true)
		},
	},
};
</script>
<style lang='less'>
.product-manage-container {
    background: #fff;
    border-radius: 4px;
    padding: 24px 0;
    .product-manage-search {
        padding: 0 24px;
        // .product-manage-search-button {
        //     margin-bottom: 16px;
        // }
    }
    .table-button-group {
        .action-btn:after {
            content: "";
            height: 12px;
            width: 1px;
            background: #E9E9E9;
            display: inline-block;
            vertical-align: middle;
            margin-left: 14px;
        }
        .ivu-btn-text:focus {
            box-shadow: none;
        }
        .ivu-btn:last-child:after {
            width: 0;
        }
    }
}
</style>
