<template>
	<div class="modelBar">
		<p class="model"><span class="tag"></span><span>{{title}}</span></p>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default:""
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
	.modelBar{
		.model{
			height: 30px;
			color: #333333;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
			span{
				float: left;
				font-size: 14px;
				color: #333333;
				letter-spacing: 0;
			}
			.tag{
				display: inline-block;
				width:3px;		
				height: 14px;
				border-radius: 1.5px;
				background: #1F9AD6;
				margin: 8px 10px 8px 0px;
			}		
		}
	}
</style>
