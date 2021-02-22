/*
*
*   created By Xu Peng
*
*/
<template>
<div style="width:200px;">
	<Input v-model="data" :maxlength="range && Number(range.length)" @on-change="handleChange" />
</div>
</template>

<script>
export default {
	props: {
		range: Object,
		standard: String,
	},
	data() {
		return {
			data: this.standard,
		};
	},
	watch: {
		standard(val) {
			this.data = val
		}
	},
	methods: {
		handleChange() {
			this.$emit('change', this.data)
		},
	},
}
</script>
<style lang='less'>
</style>
