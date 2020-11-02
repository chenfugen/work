<template>
	<div class="deviceCode">
		<Header title="手动输入" to="/admin"></Header>
		<div class="code">
			<van-field v-model="value" placeholder="请输入设备编码" right-icon="scan" @input="input" @click-right-icon="scan" />
		</div>
		<div class="confirm_button">
			<van-button size="large" @click="confirm" :disabled="isConfirm" class="confirmButton">确定</van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				value: "",
				isConfirm: true,
				url: this.$store.state.url,
			};
		},
		components: {
			Header
		},
		mounted() {
			window.scanResult=this.scanResult;
		},
		methods: {
			scan() {
			  window.android.skipToScan(1);
			},
			input() {
				this.isConfirm = this.value.length > 0 ? false : true;
			},
			scanResult(id){
				this.$router.push("/deviceDetail/"+id);
			},
			confirm() {
			   this.$Axios.get('/wechat/asset/detail/assetNum?assetNum=' + this.value).then((res) => {
			   	if (res.success) {
		           this.$router.push("/deviceDetail/"+res.data.id);
 					}else{
						this.$toast(res.message);
						}
			   }).catch((res) => {
			   	this.$toast(res.message);
			   });
			}
		},
	}
</script>

<style lang="scss">
	.deviceCode {
		.code {
			margin: 0.2rem 0.12rem;
		}

		.van-field__right-icon .van-icon {
			font-size: 0.2rem;
		}

		.confirm_button {
			margin: 0.15rem 0.12rem;
			position: relative;

			.confirmButton {
				background: #229794;
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				top: 0px;
			}
		}
	}
</style>
