<template>
	<div id="about">
		<div class="companyContent">
			<img src="../../../static/image/kainenglogo@3x.png" class="logo" />
			<p class="slogan">
				天道酬勤，厚德载物
			</p>
		</div>
		<van-cell title="品牌" value="开能" />
		<van-cell title="版本" value="1.5.8(20190409153030)" />
		<van-cell title="官网" is-link  value="http://www.canature.com"  url="http://www.canature.com" />
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="scss">
	#about {
		.companyContent {
			width: 100%;
			text-align: center;
			overflow: hidden;
			margin-top: 0.4rem;
			.logo {
				display: block;
				width: 1rem;
				margin: 0 auto;
			}
			.slogan {
				font-size: 0.16rem;
				text-align: center;
				color: #333;
				margin: 0.1rem 0 0.2rem 0;
			}
		}
		.url{
			border-bottom:1px solid #30B3FC; 
		}
	}
</style>