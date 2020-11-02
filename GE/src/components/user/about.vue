<template>
	<div id="about">
		<div class="companyContent">
			<img src="../../../static/image/logo.png" class="logo" />
			<p class="slogan">
				水科技，G+生活
			</p>
		</div>
		<van-cell title="品牌" value="通用净水"/>
		<van-cell title="版本" value="1.6.0(20200526162030)" />
	<!--	<van-cell title="官网" is-link value="http://www.canature.com/" url="http://www.canature.com/" />-->
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
	}
</style>