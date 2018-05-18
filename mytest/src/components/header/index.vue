<template>
	<div>
		<mt-header :title="text" style="background:rgba(0,0,0,0);color:#0894ec;border:none;">
			<div slot="left" v-show="left.status">
				<mt-button @click="back" icon="back">{{left.text}}</mt-button>
			</div>
		</mt-header>
		
	</div>
</template>
<script>
	export default {
		props: {
			text: {
				type: String,
				default: ''
			},
			left: {
				type: Object,
				default: function() {
					return {
						status: false,
						text: "返回"
					}
				}
			},
			right: {
				type: Object,
				default: function() {
					return {
						status: false,
						text: "更多"
					}
				}
			},
			icon: ""
		},
		data() {
			return {
				bgcolor: 'white'
			}
		},
		methods: {
			back() {
				this.$router.back();
				this.$emit('back');	
				this.$router.isBack = true;
			}
		},
	}
</script>
<style>
	.red {
		/* background:red; */
	}
</style>