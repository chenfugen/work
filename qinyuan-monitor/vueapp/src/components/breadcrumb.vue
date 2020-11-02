<template>
	<div class="breadcrumb">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item v-for="(item,index) in menu" :key="index" :to="item.path"><span :class="{isLink:item.path}">{{item.name}}</span></el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script>
	export default {
		name: 'breadcrumb',
		props: {
			menu: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {

			}
		},
		created() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
    .breadcrumb{
		margin-bottom: 10px;
		.isLink{
			color: #000;
			cursor: pointer;		
		}
		.isLink:hover{
			color: #1F9AD6;				
		}
	}
</style>
