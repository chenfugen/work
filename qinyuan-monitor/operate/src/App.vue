<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {

			};
		},
	}
</script>

<style>
	html,
	body {
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #1F9AD6;
		width: 100%;
		height: 100%;

	}

	input[type="number"] {
		padding: 0 30px 0 15px;
	}

	textarea::-webkit-input-placeholder {
		color: #999999;
		font-size: 14px;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}

	.el-textarea__inner {
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-size: 12px;
	}

	.select {
		width: 100%;
	}
</style>
