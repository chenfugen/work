<template>
	<div>
		<Header :title="title" to="null"></Header>
		<div class="qr-btn" node-type="qr-btn">扫描二维码1
			<input node-type="jsbridge" type="file" name="myPhoto" value="扫描二维码" />
		</div>
		<div class="result-qrcode"></div>
	</div>  
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				title:"二维码扫码"
			};
		},
		components: {
			Header
		}}
</script>

<style>
.jsbridge {
    height: 2rem;
    width: 2rem;
    background-color: red;
}

.upimg {
  height: 2rem;
  width: 2rem;
    background-color: green;
    margin-bottom:0.5rem;
}

.qr-btn{
    width:2rem;
    height:0.5rem;
	margin: 0.1rem auto;
    background-color:#157EFB ;
    line-height:0.5rem;
    text-align: center;
    color:#fff;
    border-radius: 10%  10%;
    margin-bottom:0.1rem;
	font-size: 0.14rem;
}

input[node-type=jsbridge]{
    visibility: hidden;
}
</style>
