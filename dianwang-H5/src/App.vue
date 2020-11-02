<template>
	<div id="app">
		<transition :name="transitionName">
			<router-view class="child-view"></router-view>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				transitionName: "slide-left",
			};
		},
		watch: {
			'$route'(to, from) {
				if (to.meta.level > from.meta.level) {
					this.transitionName = 'slide-left';
				} else {
					this.transitionName = 'slide-right'
				}
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	#app {
		font-family: 微软雅黑;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		padding: 0;
	}

	body::-webkit-scrollbar {
		display: none;
		opacity: 0;
	}

	body {
		margin: 0;
		padding: 0;
	}

	.child-view {
		position: absolute;
		min-height: 100%;
		height: auto;
		width: 100%;
		transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
	}

	.slide-left-enter,
	.slide-right-leave-active {
		opacity: 0;
		-webkit-transform: translate3d(100%, 0, 0);
		transform: translate3d(100%, 0, 0);
	}

	.slide-left-leave-active,
	.slide-right-enter {
		opacity: 0;
		-webkit-transform: translate3d(-100%, 0, 0);
		transform: translate3d(-100%, 0, 0);
	}

	.van-nav-bar .van-icon {
		color: #323233;
	}

	.van-nav-bar__title {
		max-width: 60%;
		margin: 0 auto;
		color: #323233;
		font-weight: 600;
		font-size: 16px;
	}
</style>
