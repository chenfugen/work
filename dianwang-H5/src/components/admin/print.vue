<template>
	<div class="print">
		<Header title="确认打印" to="/register"></Header>
		<ul>
			<li>
				<span class="title">资产品类：</span>
				<span class="name">办公电器</span>
			</li>
			<li>
				<span class="title">资产名录：</span>
				<span class="name">办公电器</span>
			</li>
			<li>
				<span class="title">规格/型号：</span>
				<span class="name">办公电器</span>
			</li>
			<li>
				<span class="title">计量单位：</span>
				<span class="name">办公电器</span>
			</li>
			<li>
				<span class="title">品牌/厂家：</span>
				<span class="name">办公电器</span>
			</li>
			<van-divider />
			<li>
				<span class="title">屏幕尺寸：</span>
				<span class="name">办公电器</span>
			</li>
			<li>
				<span class="title">配 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 置：</span>
				<span class="name">办公电器</span>
			</li>
			<van-divider />
			<li>
				<span class="title">资产数量：</span>
				<span class="name">100</span>
			</li>
		</ul>
		<div class="confirm_button">
			<van-button size="large" color="#229794" @click="confirm" class="confirm">打印</van-button>
		   <p class="hint">已生成二维码，请前往确认打印</p>
		</div>
		
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {

			};
		},
		components: {
			Header
		},
		methods: {
			confirm() {

			}
		}
	}
</script>

<style lang="scss">
	.print {
		ul {
			margin: 0.1rem 0 0.4rem 0;
			background: #ffffff;

			li {
				margin: 0 0.12rem;
				font-size: 0.13rem;
				line-height: 0.35rem;

				.title {
					color: #999999;

				}

				.name {
					color: #333333;
				}
			}
		}

		.van-divider {
			margin: 0.1rem;
		}

		.confirm_button {
			margin: 0.15rem 0.12rem;
			position: relative;

			.confirm {
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				top: 0px;
			}
			.hint {
				position: absolute;
				width: 100%;
				top: 0.5rem;
				line-height: 0.3rem;
				font-size: 0.13rem;
				color: #229794;
				text-align: center
			}
		}

		
	}
</style>
