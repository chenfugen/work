/*
*
*   created By Xu Peng
*
*/
<template>
<div>
	<!-- <template v-for="(item, index) in range"> -->
	<template>
		<div v-for='(item,index) in data'>
			<Input disabled :key='index' size="small" :value='item' style="width: 100px" />
			<Button class='marginLeft' size="small" icon="md-remove" @click='handleSubArray(index)'></Button>
		</div>
		<Input v-if='showFormArrayStr' size="small" style="width: 100px"  v-model='formArrayStr' />
		<Button :class='showFormArrayStr?["marginLeft"]:[]' size="small" type="success" :icon='!showFormArrayStr?"md-add":"md-checkmark"' @click='handleAddArray()'></Button>
		<!-- <span :key="index" class="struct-item-title">{{ item.propertyName }}:</span>
		<component :range="item.dataRange" :is="calctype(item.dataType) + 'Component'" :standard="data[index].standard" :key="index" @change="(val) => {itemChange(index, val) }" /> -->
	</template>
</div>
</template>

<script>
// import {
// 	TYPE_MAP
// } from '../staticVariable.js'
// import numComponent from './numComponent.vue'
// import textComponent from './textComponent.vue'
// import structComponent from './structComponent.vue'
export default {
	props: {
		range: [Array, Object],
		standard: [Array, null]
	},
	// components: {
	// 	numComponent,
	// 	textComponent,
	// 	structComponent,
	// },
	data() {
		return {
			// data: this.standard || createModel(this.range)
			showFormArrayStr:false,
			formArrayStr:'',
			formArray:[],
			data: this.standard
		};
	},
	watch: {
		standard(val) {
			this.data = val
		},
		data(val) {
			this.itemChange()
		}
	},
	methods: {
		// calctype(type) {
		// 	return TYPE_MAP[type].type
		// },
		handleSubArray(index){
			this.data.splice(index,1)
		},
		handleAddArray(){
			if(this.showFormArrayStr){
				if(this.formArrayStr === ''||this.formArrayStr === null){
					this.$Message.error('数组内不可添加空数据')
				}else{
					if(this.data ==null){
						this.data = []
					}
					this.data.push(this.formArrayStr)
					this.formArrayStr = ''
					this.showFormArrayStr = false
				}
			}else{
				this.showFormArrayStr = true
			}
		},
		itemChange(index, val) {
			// this.data[index].standard = val
			this.$emit('change', this.data)
		}
	},
}
//
// function createModel(range) {
// 	if (!Array.isArray(range)) return []
// 	return range.map((el) => {
// 		return {
// 			identifier: el.identifier,
// 			dataType: el.dataType,
// 			standard: el.standard,
// 		}
// 	})
// }
</script>
<style lang='less'>
</style>
