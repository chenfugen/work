<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: "App",
};
</script>
<style scoped>
#app {
	width: 100vw;
	height: 100vh;
	overflow: auto;
}
</style>
