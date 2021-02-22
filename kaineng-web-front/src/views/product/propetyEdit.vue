<template lang="html">
<div class="propetyEdit" >
    <Modal v-model="editPropModal" width='90' title="分配产品属性" >
        <div class="" style="position:relative">
            <Collapse simple>
                <Panel name="1">
                    设备相关（{{classAList.length}}）
                    <div slot='content' class="clearfloat">
                        <Button icon='md-create' type='primary' style="margin-top:5px;" @click='hanldeClassSingle(1)'>编辑</Button>
                        <div class="">
                            <div class="left itemPart" v-for='item in classAList' :key='item.id'>{{item.propertyName}}</div>
                            <div v-if='classAList.length==0' class="noneData">暂无数据</div>
                        </div>
                    </div>
                </Panel>
                <Panel name="2">
                    服务设置（{{classBList.length}}）
                    <div slot='content' class="clearfloat">
                        <Button icon='md-create' type='primary' style="margin-top:5px;" @click='hanldeClassSingle(2)'>编辑</Button>
                        <div class="">
                            <div class="left itemPart" v-for='item in classBList' :key='item.id'>{{item.propertyName}}</div>
                            <div v-if='classBList.length==0' class="noneData">暂无数据</div>
                        </div>
                    </div>
                </Panel>
                <Panel name="3">
                    授权（{{classCList.length}}）
                    <div slot='content' class="clearfloat">
                        <Button icon='md-create' type='primary' style="margin-top:5px;" @click='hanldeClassSingle(3)'>编辑</Button>
                        <div class="">
                            <div class="left itemPart" v-for='item in classCList' :key='item.id'>{{item.propertyName}}</div>
                            <div v-if='classCList.length==0' class="noneData">暂无数据</div>
                        </div>
                    </div>
                </Panel>
                <!-- <Panel name="4" class="clearfloat">
                    未分类属性（{{classDList.length}}）
                    <div slot='content' class="clearfloat">
                        <div class="">
                            <div class="left itemPart" v-for='item in classDList' :key='item.id'>{{item.propertyName}}（{{item.dataType}}）</div>
                        </div>
                    </div>
                    <div v-if='classDList.length==0' class="noneData">暂无数据</div>
                </Panel> -->
            </Collapse>
            <Spin fix large v-if='loading'></Spin>
        </div>
        <div slot='footer'>
            <Button type='primary' style="margin-top:5px;" @click='handleClose()'>关闭</Button>
        </div>
	</Modal>
    <!-- 编辑属性弹窗 -->
    <Modal v-model="dialogEdit" title="编辑" width='80' @on-cancel='handleReset'>
        <div slot='header'>
            <p>编辑</p>
            <div class="clearfloat">
                <Select v-model="filter.dataType" style="width:200px">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input class="marginLeft" v-model="filter.propertyName" placeholder="属性名称" style="width: 200px" />
                <Button class="marginLeft" type='primary' @click='handleSearchPropety("C")'>搜索</Button>
                <Button class="marginLeft" type='primary' @click='handleResetFilter("C")'>重置</Button>
                <Button class="marginRight right" type='primary' @click='handleSubmitAdd()'>确定</Button>
                <Button class="marginRight right" @click='handleReset()'>取消</Button>
            </div>
        </div>
        <div style="position:relative">
            <Form ref="formInline" inline :label-width='130' v-if='!modalLoading'>
                <FormItem class="formItem" v-for='item in propertyList' :key='item.id' v-show='!item.disShow' prop="user" :label='item.propertyName+"："'>
                    <Checkbox v-if='item.propertyType==editNow||item.propertyType==0' v-model='item.propertyType' :true-value='editNow' :false-value='0'></Checkbox>
                    <span v-else>{{dealType(item.propertyType)}}</span>
                </FormItem>
            </Form>
        </div>
        <div slot='footer'>
        </div>
    </Modal>
</div>
</template>

<script>
export default {
	name: 'propetyEdit',
	data() {
		return {
			filter: {
				dataType: '',
				propertyName: '',
			},
			editNow: '',
			productKey: '',
			modalLoading: false,
			loading: true,
			dialogEdit: false,
			editPropModal: false,
			propertyList: [],
			classAList: [],
			classBList: [],
			classCList: [],
			classDList: [],
			data: [],
			typeList: [{
					value: 'int',
					label: 'int',
				},
				{
					value: 'text',
					label: 'text',
				},
				{
					value: 'array',
					label: 'array',
				},
				{
					value: 'bool',
					label: 'bool',
				},
				{
					value: 'struct',
					label: 'struct',
				},
				{
					value: 'enum',
					label: 'enum',
				}
			],
			columns: [{
					title: '属性名称',
					key: 'name'
				},
				{
					title: '标识符',
					key: 'age'
				},
				{
					title: '数据类型',
					key: 'address'
				},
				{
					title: '取值范围',
					key: 'address'
				},
				{
					title: '检测标准',
					key: 'address'
				}
			],
		}
	},
	methods: {
		// 获取所有属性
		getProprty(productKey) {
			this.loading = true
			this.productKey = productKey
			let para = {
				productKey: productKey,
			}
			this.$Ax.get(this.$api.manage_product_property_list, {
				params: para,
			}).then(res => {
				this.propertyList = res.data.data
				this.hanldeClassification()
			}).catch(err => {
				console.log(err);
			})
			this.editPropModal = true
		},
		// 分类所有属性
		hanldeClassification() {
			let list = this.propertyList,
				listA = [],
				listB = [],
				listC = [],
				listD = []
			for (let i = 0, len = list.length; i < len; i++) {
				list[i].disShow = false
				switch (list[i].propertyType) {
					case 1:
						listA.push(list[i])
						break;
					case 2:
						listB.push(list[i])
						break;
					case 3:
						listC.push(list[i])
						break;
					default:
						listD.push(list[i])
				}
			}
			this.propertyList = Object.assign(list, [])
			this.classAList = Object.assign(listA, [])
			this.classBList = Object.assign(listB, [])
			this.classCList = Object.assign(listC, [])
			this.classDList = Object.assign(listD, [])
			this.loading = false
		},
		// 编辑分类属性
		hanldeClassSingle(data) {
			this.dialogEdit = true
			this.editNow = data
		},
		// 搜索属性
		handleSearchPropety() {
			this.modalLoading = true
			for (let i in this.propertyList) {
				this.propertyList[i].disShow = false
				if (this.filter.dataType != '' && this.propertyList[i].dataType != this.filter.dataType) {
					this.propertyList[i].disShow = true
				}
				if (this.filter.propertyName != '' && this.propertyList[i].propertyName.indexOf(this.filter.propertyName) == -1) {
					this.propertyList[i].disShow = true
				}
				if (i == this.propertyList.length - 1) {
					this.modalLoading = false
				}
			}
		},
		// 重置筛选条件
		handleResetFilter() {
			this.filter.dataType = ''
			this.filter.propertyName = ''
		},
		// 重置变量
		handleReset() {
			this.filter.dataType = ''
			this.filter.propertyName = ''
			this.getProprty(this.productKey)
			this.dialogEdit = false
			for (let i in this.propertyList) {
				this.propertyList[i].disShow = false
			}
		},
		// 处理不同分类名称
		dealType(type) {
			switch (type) {
				case 1:
					return '设备相关'
					break;
				case 2:
					return '服务设置'
					break;
				case 3:
					return '授权'
					break;
				default:
					return '未分配'
			}
		},
		// 提交表单添加
		handleSubmitAdd() {
			let list = ''
			for (let i in this.propertyList) {
				if (this.propertyList[i].propertyType == this.editNow) {
					list = list + this.propertyList[i].id + ','
				}
			}
			if (list == '') {
				this.handleSubmitSub()
			} else {
				let para = {
					productKey: this.productKey,
					ids: list,
					type: this.editNow
				}
				this.$Ax.post(
					this.$api.manage_product_update_property,
					para
				).then(res => {
					this.handleSubmitSub()
				}).catch(err => {
					console.log(err);
				})
			}

		},
		// 提交表单减少
		handleSubmitSub() {
			let list = this.editNow == 1 ? this.classAList : this.editNow == 2 ? this.classBList : this.classCList,
				ids = ''
			for (let i in list) {
				if (list[i].propertyType != this.editNow) {
					ids = ids + list[i].id + ','
				}
			}
			let para = {
				productKey: this.productKey,
				ids: ids,
				type: 0
			}
			if (ids == '') {
				this.dialogEdit = false
				this.getProprty(this.productKey)
			} else {
				this.$Ax.post(
					this.$api.manage_product_update_property,
					para
				).then(res => {
					if (res.success) {
						this.$Message.success('编辑成功！')
					}
					this.dialogEdit = false
					this.getProprty(this.productKey)
				}).catch(err => {
					console.log(err);
				})
			}
		},
		// 关闭弹窗
		handleClose() {
			this.editPropModal = false
		}
	}
}
</script>

<style scoped>
.itemPart {
	width: 19%;
	margin-top: 20px;
}

.noneData {
	text-align: center;
}

.formItem {
	width: 20%;
}
</style>
