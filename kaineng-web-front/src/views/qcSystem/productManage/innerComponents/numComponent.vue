/*
*
*   created By Xu Peng
*
*/
<template>
<div>
	<div class="">
		min：
		<InputNumber style="width:200px" :min="Number(data.min)" :max="Number(data.max)" :step="Number(data.step)" v-model="valueForm.min" @on-change='handleChange' /> {{ data.unit }}
	</div>
	<div class="marginTop">
		max：
		<InputNumber style="width:200px" :min="Number(data.min)" :max="Number(data.max)" :step="Number(data.step)" v-model="valueForm.max" @on-change='handleChange' /> {{ data.unit }}
	</div>
</div>
</template>

<script>
export default {
	props: {
		standard: [Object],
		range: [Object]
	},
	data() {
		return {
			data: this.range,
			valueForm: this.standard || {
				max: 0,
				min: 0,
			},
		};
	},
	watch: {
		standard(val) {
			if (val.max != undefined) {
				this.valueForm = val
			} else {
				this.valueForm = {
					max: 0,
					min: 0,
				}
			}
		},
	},
	methods: {
		handleChange() {
			this.$emit('change', this.valueForm)
		},
	},
}
</script>
<style lang='less'>
</style>
