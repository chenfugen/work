/*
*
*   created By Xu Peng
*
*/
<template>
<Form ref="form" :model="data" :label-width="100">
	<FormItem label="检测标准：" prop="standard">
		<component @change="handleChange" :range="data.dataRange" :standard="data.standard" :is="type + 'Component'" />
	</FormItem>
</Form>
</template>

<script>
import {
	TYPE_MAP
} from './staticVariable.js'
import numComponent from './innerComponents/numComponent.vue'
import textComponent from './innerComponents/textComponent.vue'
import enumComponent from './innerComponents/enumComponent.vue'
import boolComponent from './innerComponents/boolComponent.vue'
import arrayComponent from './innerComponents/arrayComponent.vue'
import structComponent from './innerComponents/structComponent.vue'
export default {
	props: {
		value: Object,
		default: () => {}
	},
	components: {
		numComponent,
		textComponent,
		enumComponent,
		boolComponent,
		arrayComponent,
		structComponent,
	},
	data() {
		const validateStandard = (rule, value, callback) => {
			if (!value && value !== 0) {
				callback(new Error('请输入检测标准'));
			} else {
				callback();
			}
		};
		return {
			rules: {
				standard: [{
					validator: validateStandard,
					trigger: 'blur'
				}],
			},
			data: this.value
		};
	},
	watch: {
		value(val) {
			this.data = val
		}
	},
	computed: {
		type() {
			return TYPE_MAP[this.data.dataType].type
		},
	},
	methods: {
		handleChange(val) {
			this.$emit('input', { ...this.data,
				standard: val
			})
		},
	},
}
</script>
<style lang='less'>
</style>
