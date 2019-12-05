<template>
	<van-tabbar fixed v-model="message"  style="z-index:10000;">
		<van-tabbar-item v-for="(item,index) of navbar" :key="index" :to="item.name" style="line-height:1.3"> <i  slot="icon" slot-scope="props":class="props.active ? item.active:item.normal" class="icon"></i>{{item.title}}</van-tabbar-item>
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
					normal: 'iconfont icontabbar_icon_device_n',
					active: 'iconfont icontabbar_icon_device_s',
				}, {
					title: '数据',
					name: '/datas',
					normal: 'iconfont icontabbar_icon_data_n',
					active: 'iconfont icontabbar_icon_data_s',
				}, {
					title: '水质地图',
					name: '/map',
					normal: 'iconfont icontabbar_icon_waterquality_n',
					active: 'iconfont icontabbar_icon_waterquality_s',
				}, {
					title: '我的',
					name: '/user',
					normal: 'iconfont icontabbar_icon_me_n',
					active: 'iconfont icontabbar_icon_me_s',
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
	    height: 1.2em;
		overflow: visible;
	}	
</style>