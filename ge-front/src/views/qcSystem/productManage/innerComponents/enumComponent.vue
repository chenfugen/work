/*
*
*   created By Xu Peng
*
*/
<template>
<div>
	<Select v-model="data" multiple @on-change="handleChange" style="width:200px">
		<Option v-for="(value, key) in range" :value="key" :key="key">
			{{ key + '.' + value }}
		</Option>
	</Select>
</div>
</template>

<script>
export default {
	props: {
		standard: [Number, String],
		range: [Object]
	},
	data() {
		return {
			data: this.standard,
		};
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
