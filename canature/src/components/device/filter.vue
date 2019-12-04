<template>
	<div class="filterList">
		<ul class="filters" v-if="productKey=='a1EnF8F09Au' || productKey =='a1XpqYZQgUK'||  productKey =='a14quLhzzTs'">
			<li>
				<p class="filterMsg">
					<span class="filterName">耗材1寿命 </span>			
					 <span class="life">{{deviceMsg.material1.value.remain}}%</span>
				</p>
			</li>
			<li>
				<p class="filterMsg">
					<span class="filterName">耗材2寿命  </span>
					<span class="life">{{deviceMsg.material2.value.remain}}%</span>
				</p>
			</li>
		</ul>
		<ul class="filters" v-else>
			<li>
				<p class="filterMsg">
					<span class="filterName">PP滤芯寿命  </span> 
					<span class="life">{{deviceMsg.filterPP.value}}%</span>
				</p>
			</li>
			<li v-if="productKey=='a1C6AilwYUc' || productKey =='a1EUR5GZocU'">
				<p class="filterMsg">
					<span class="filterName">RO滤芯寿命 </span>
					<span class="life">{{deviceMsg.filterRO.value}}%</span>
				</p>
			</li>
			<li v-else>
				<p class="filterMsg">
					<span class="filterName">NF滤芯寿命 </span>
					<span class="life"> {{deviceMsg.filterNF.value}}%</span>
				</p>
			</li>			
			<li>
				<p class="filterMsg">
					<span class="filterName">C1滤芯寿命  </span>
					<span class="life"> {{deviceMsg.filterC1.value}}%</span>
				</p>
			</li>
			<li>
				<p class="filterMsg">
					<span class="filterName">C2滤芯寿命 </span>
					<span class="life"> {{deviceMsg.filterC2.value}}%</span>
				<!--	<van-button round class="pay" @click="pay">购买</van-button>-->
				</p>
			</li>
		</ul>
		<p class="filterTitle">滤芯寿命过低，将会影响过滤效果，良好的水质，有助于保持健康，建议您及时更换滤芯</p>
		<div class="payFilter">
			<van-button size="large" round @click="pay">购买滤芯</van-button>
		</div>
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
				if(this.productKey == "a1EnF8F09Au" || this.productKey == "a1XpqYZQgUK" || this.productKey == "a14quLhzzTs") {
					return this.$store.state.newDeviceMsg;
				}else{
					return this.$store.state.device_commercialMsg;
				}
			}
		},
		mounted() {
            console.log(this.$store.state.device_commercialMsg)
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
						font-size: 0.14rem;
						float: left;
					}
					.life{
						float: right;
						font-size: 0.15rem;
						margin: 0rem 0.1rem;
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
			}
		}
		.filterTitle {
			margin: 0.1rem 0.15rem;
			font-size: 0.12rem;
			color: #333333;
			letter-spacing: 0;
			line-height: 0.22rem;
		}
		.payFilter {
			position: fixed;
			width: 90%;
			margin: 0 5%;
			bottom: 0.1rem;
			button {
				background: #267CFB;
				border: none;
				color: white;
			}
		}
	}
</style>