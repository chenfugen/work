<template>
	<div id="wifiCode">
		<van-nav-bar title="净水器-新月" @click-left="onClickLeft"  left-arrow/>
		<ul class="networkTitle">
			<li>
				<p class="h3">您选择的产品为：</p>
				<p class="hint">开能集团旗下的智能净水机-新月</p>
				<p  class="hint">联网方式：WIFI</p>
			</li>
			<li class="codeBox">
				<img src="../../../static/image/wifiCode.png"/>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		data() {
			return {

			}
		},
		mounted(){},
		methods: {
			onClickLeft(){
				this.$router.push({path:"/networkFlow"});
			}		
		}
	}
</script>

<style lang="scss">
	#wifiCode{
		.van-nav-bar .van-icon{
			color:#323233;
		}
		.networkTitle{
			width:100%;
			background:white;
			margin-top:0.1rem;
			overflow: hidden;
			li{
				width:90%;
				margin:0.1rem 5%;
				.h3{		
					color: #000;		
					font-size:0.15rem;
					line-height: 0.3rem;
				}
				.hint{
					font-size:0.13rem;
					color: #666;
					line-height: 0.3rem;
				}
			}
			.codeBox{
				text-align: center;
			}
		}
		.addDevice{
			margin:0.2rem 2%;
			width:96%;
			color: white;
			background: #267CFB;
			vertical-align:top;
		}
	}

</style>