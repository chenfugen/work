<template>
	<div class="filterList">
		<ul class="filters" v-if="productKey=='a1i8kpwPW9w' || productKey=='a1u3fpsU6yg'">
			<li>
				<p class="filterMsg">
					<span class="filterName">PP滤芯寿命  {{deviceMsg.filterPP.value}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
			<li v-if="productKey=='a1i8kpwPW9w'">
				<p class="filterMsg">
					<span class="filterName">RO滤芯寿命  {{deviceMsg.filterRO.value}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
			<li v-else>
				<p class="filterMsg">
					<span class="filterName">NF滤芯寿命  {{deviceMsg.filterNF.value}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
			<li>
				<p class="filterMsg">
					<span class="filterName">C1滤芯寿命  {{deviceMsg.filterC1.value}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
			<li>
				<p class="filterMsg">
					<span class="filterName">C2滤芯寿命  {{deviceMsg.filterC2.value}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
		</ul>
		<ul class="filters" v-else>
			<li>
				<p class="filterMsg">
					<span class="filterName">耗材1寿命  {{deviceMsg.material1.value.remain}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
			<li>
				<p class="filterMsg">
					<span class="filterName">耗材2寿命  {{deviceMsg.material2.value.remain}}%</span>
					<van-button round class="pay" @click="pay">购买</van-button>
				</p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				productKey: this.$route.query.productKey
			}
		},
		computed: {
			deviceMsg() {
				if(this.productKey == "a12KzXXwRii" || this.productKey == "a1ZLeXs5VCX" ) {
					return this.$store.state.deviceMsg;
				}
				if(this.productKey == "a1u3fpsU6yg" || this.productKey == "a1i8kpwPW9w") {
					return this.$store.state.device_commercialMsg;
				}else{
					return this.$store.state.newDeviceMsg;
				}				  
			}
		},
		mounted() {

		},
		methods: {
			pay() {
				this.$toast("暂无购买地址");
			}
		}
	}
</script>

<style lang="scss">
	.filterList {
		.filters {
			width: 100%;
			margin-top: 0.1rem;
			li {
				.filterMsg {
					width: 100%;
					height: 0.6rem;
					line-height: 0.6rem;
					background: white;
					margin-top: 0.01rem;
					.filterName {
						display: block;
						margin: 0rem 0.1rem;
						font-size: 0.15rem;
						float: left;
					}
					.pay {
						margin: 0.1rem 0.1rem;
						color: white;
						padding: 0 0.18rem;
						background: #267CFB;
						float: right;
						border: none;
					}
				}
				.filterTitle {
					font-size: 0.12rem;
					padding: 0.1rem 0.12rem;
				}
			}
		}
	}
</style>