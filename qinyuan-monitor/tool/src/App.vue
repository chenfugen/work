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
	html,body{
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;	  
	}
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #1F9AD6;
		width:100%;
		height:100%;
	}
</style>
