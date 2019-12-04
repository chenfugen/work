<template>
	<van-tabbar fixed v-model="message"  style="z-index:10000;">
		<van-tabbar-item v-for="(item,index) of navbar" :key="index" :to="item.name" style="line-height:1.3"> <i :class="item.icon" class="icon"></i>{{item.title}}</van-tabbar-item>
	</van-tabbar>
</template>
<script>
	import '../../../static/css/iconfont.css';
	export default {
		data() {
			return {
				//选中的tabbar值message为外面页面传入的值selected
				message: this.selected,
				navbar: [{
					title: '设备',
					name: '/device',
					icon: 'iconfont iconshuiji',
				}, {
					title: '数据',
					name: '/datas',
					icon: 'iconfont iconshuju',
				}, {
					title: '水质地图',
					name: '/map',
					icon: 'iconfont iconditu',
				}, {
					title: '我的',
					name: '/user',
					icon: 'iconfont iconwode',
				}]
			}
		},
		props: {
			selected: Number,
		}
	}
</script>
<style>
	.van-tabbar-item .icon {
		display: block;
		text-align: center;
		margin: 0 auto;
		font-size: 0.15rem;
		margin-bottom:0.03rem;
	    height: 1.2em;
		overflow: visible;
	}	
	.van-tabbar-item--active .icon{		
		background-image: -webkit-linear-gradient(90deg,#30B3FC 20%, #267CFB 60%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		overflow: visible;
		height: 1.2em;
	}
</style>