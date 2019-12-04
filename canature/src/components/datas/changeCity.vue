<template>
	<div class="changeCity">
		<div class='main'>
			<div class="view_search van-search van-search--show-action" style="background: rgb(255, 255, 255);">
				<div class="van-cell van-cell--borderless van-field">
					<div class="van-field__left-icon"><i class="van-icon van-icon-search"><!----></i></div>
					<div class="van-cell__value van-cell__value--alone">
						<div class="van-field__body"><input type="search" v-model="inputText" placeholder="请输入城市名或拼音" class="van-field__control" @search="onSearch"></div>
					</div>
				</div>
				<div class="van-search__action" @click="onSearch">
					<div>搜索</div>
				</div>
			</div>
			<div v-show="searchBox" class="searchResult">
				<div v-for="(item, index) in address" :key="index" class="sortBox">
					<div @click="add(item.N,item.E,item.city)" class="add">{{item.city}}</div>
				</div>
				<div v-show="address.length==0" style="text-align: center;line-height:0.3rem;padding:0.3rem 0px;font-size:0.13rem;color: #333;">搜不到你要的结果</div>
			</div>
			<div class="slide">
				<a v-for="(item, index) in temABC" :key='index'>
					<span class="temABC" @click="slide(item)">{{item}}</span>
				</a>
			</div>
			<div v-if="show==1">
				<div class="yin">{{strA}}</div>
			</div>
			<div class="top" :style="`height: ${screenHeight}px`" ref="topContainer">
				<div class="common">定位城市</div>
				<div class="city" v-show="position.city!=''" @click="add(position.lat,position.lng,position.city)">
					<van-icon name="location" style="font-size:0.12rem;" /> {{position.city}}
				</div>
				<div class="cityNo" v-show="position.city==''" @click="location">
					{{locationStatus}}
				</div>
				<div class="common">热门城市</div>
				<div class="hotaddr">
					<div v-for="(item, index) in hotaddr" :key="index" class="hotcityBox">
						<div @click="add(item.N,item.E,item.city)" class="cityx">{{item.city}}</div>
					</div>
				</div>
				<div class="common">排序城市</div>
				<div v-for="(item,index) in addr " :key="index" :id="item.key">
					<div class="sort">{{item.key}}</div>
					<div v-for="(item1,key) in item.item " :key="key " class="sortBox">
						<div class="add" @click="add(item1.N,item1.E,item1.city)"> {{item1.city}}</div>
					</div>
				</div>
			</div>
		</div>
		<div id="container" style="display: none;"></div>
	</div>
</template>

<script>
	import addr from '@../../../static/js/add'  //引用add.js
	export default {
		data() {
			return {
				position: {
					city:"",
					lat: parseFloat(22.553329),
					lng: parseFloat(113.88308)
				},
				searchBox: false,
				locationStatus:"定位中",
				temABC: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
				hotaddr: [{
					"city": "北京市 ",
					"N": "39.55",
					"E": "116.24",
					"firststr": "B"
				}, {
					"city": "广州市 ",
					"N": "23.08",
					"E": "113.14 ",
					"firststr ": "G "
				}, {
					"city": "杭州市 ",
					"N": "30.16",
					"E": "120.1",
					"firststr": "H"
				}, {
					"city": "南京市 ",
					"N": "32.03",
					"E": "118.46",
					"firststr": "N "
				}, {
					"city": "深圳市 ",
					"N": "22.33",
					"E": "114.07",
					"firststr": "S"
				}, {
					"city": "上海市 ",
					"N": "31.14",
					"E": "121.29",
					"firststr": "S"
				}],
				addr: addr,
				show: 0,
				strA: [],
				screenHeight: 0,
				inputText: '',
				address: [],
			}
		},
		created() {
			this.screenHeight = window.screen.availHeight - 100; //设置#topdiv的高度
			this.location();
		},
		watch: {
			inputText: {　　
				handler(value) {
					if(value == "") {
						this.searchBox = false;						
					}
					this.address=[];
					for(let i in addr) {
						for(let j in addr[i].item) {
							if(value == addr[i].item[j].city || value == addr[i].item[j].firststr || value == addr[i].item[j].firststr.toLowerCase()) {
								this.address.push(addr[i].item[j]);
								this.searchBox = true;
							}
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			location() {
				let that = this;
				var geocoder, marker;
				geocoder = new AMap.Geocoder({
					city: "010", //城市设为北京，默认：“全国”
					radius: 1000 //范围，默认：500
				});
				let AirImg = document.getElementsByClassName("AirImg")[0];
				that.$Axios.get("wechat/user/getWxSignature?url=" + that.$store.state.url).then((res) => {
					if(res.data.success) {
						const data = res.data.data;
						wx.config({
							beta: true,
							debug: false,
							appId: data.appId,
							timestamp: Number(data.timestamp),
							nonceStr: data.nonceStr,
							signature: data.signature,
							jsApiList: ["getLocation", "openLocation"]
						});
						wx.error(function(res) {
							that.locationStatus="定位失败,重新获取";
							that.getCity()
						});
						wx.ready(function() {
							wx.checkJsApi({
								jsApiList: ["getLocation", "openLocation"],
								success: function(res) {
									wx.getLocation({
										type: 'wgs84',
										success: function(res) {
											that.position.lat = res.latitude;
											that.position.lng = res.longitude;
											let center = [res.longitude, res.latitude];
											geocoder.getAddress(center, function(status, result) {
												if(status === 'complete' && result.regeocode) {
													let city;
													if(result.regeocode.addressComponent.city==""){
														city = result.regeocode.addressComponent.province;
													}else{
														city = result.regeocode.addressComponent.city;														
													}				
													that.position.city = city;
												} else {
													that.locationStatus="定位失败,重新获取";
													alert(JSON.stringify(result))
												}
											});
										}
									});
								}
							})
						})
					}
				})
			},
			onClickLeft() {
				this.$router.go(-1);
			},
			gitCity(){
				let that = this;
				var map, geolocation; //加载地图，调用浏览器定位服务
				map = new AMap.Map('container', {
					resizeEnable: true
				});
				map.plugin('AMap.Geolocation', function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true,
						timeout: 10000,
						buttonPosition: 'RB',
						buttonOffset: new AMap.Pixel(10, 20),
						zoomToAccuracy: true,
					});
					geolocation.getCurrentPosition(getCity);
				});
				function getCity(status, result) {
					if(status == 'complete') {
						let city = result.addressComponent.city;
						that.position.city = city;
					}
				}
			},
			slide(item) {
				let that = this;
				this.show = 1;  //弹出右侧点击的字母
				this.strA = item;
				for(let key in addr) {
					if(item == key) {  //判断城市列表中是否包含右侧点击的字母，不判断会报错
						let slideScrollHeight = document.getElementById(item).offsetTop - 60; //计算要滚动的距离
						this.$refs.topContainer.scrollTop = slideScrollHeight;  //赋值给需要滚动的盒子
					}
				}
				setTimeout(function() {
					that.show = 0;  //两秒后关闭
				}, 2000)
			},
			onSearch() { 
				if(this.inputText == "" || this.inputText == undefined) {
					this.$toast("请输入搜索条件");
					this.searchBox = false;
					return false;
				}
				this.address=[];
				for(let i in addr) {
					for(let j in addr[i].item) {
						if(this.inputText == addr[i].item[j].city || this.inputText == addr[i].item[j].firststr || this.inputText == addr[i].item[j].firststr.toLowerCase()) {
							this.address.push(addr[i].item[j]);
							this.searchBox = true;
						}
					}
				}
				console.log(this.address);
			},
			colse(){
				this.address = [];
				this.searchBox = false;
			},
			add(lat, lng, cityName) {
				cityName = cityName.replace(/\s+/g, "");
				this.$router.push({
					path: '/datas',
					query: {
						"city": cityName,
						"lng": lng,
						"lat": lat
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.changeCity {
		.main {
			width: 100%;
			height: auto;
			overflow: hidden;
			position: fixed;
			top: 0;
			left: 0;
			background-color: #fff;
			z-index: 999;
			.view_search {
				background: white;
				margin-top: 0.05rem;
				.van-cell {
					background-color: #EEF3FA;
					border-radius: 0.4rem;
				}
			}
			.van-field__left-icon {
				margin: 0 10px;
			}
			/* 当前城市 */
			.top {
				overflow-x: hidden;
				overflow-y: scroll;
				font-size: 0.13rem;
				line-height: 0.6rem;
				width: 100%;
				height: 12rem;
				display: inline-block;
				.city {
					width: 0.9rem;
					height: 0.3rem;
					text-align: center;
					margin: 0px 0.1rem 0.12rem 0.15rem;
					border-radius: 0.4rem;
					border: 1px solid #6ab3d1;
					display: inline-block;
					font-size: 0.13rem;
					line-height: 0.3rem;
					color: #267CFB;
				}
				.cityNo {
					width: 1.2rem;
					height: 0.3rem;
					text-align: center;
					margin: 0px 0.1rem 0.12rem 0.15rem;
					border-radius: 0.4rem;
					border: 1px solid #6ab3d1;
					display: inline-block;
					font-size: 0.13rem;
					line-height: 0.3rem;
					color: #267CFB;
				}
				.hotaddr {
					width: 100%;
					overflow: hidden;
					padding-left: 0.1rem;
					.hotcityBox {
						width: 0.9rem;
						height: 0.3rem;
						text-align: center;
						margin: 0px 0.05rem 0.05rem 0.05rem;
						border-radius: 0.4rem;
						background: #EEF3FA;
						display: inline-block;
						font-size: 0.13rem;
						line-height: 0.3rem;
						color: #267CFB;
					}
					.cityx {
						width: 100%;
						height: 100%;
						color: #333;
						line-height: 0.3rem;
					}
				}
			}
		}
		/*排序城市*/
		.footer1 {
			display: flex;
			flex-direction: column;
			font-size: 0.26rem;
			line-height: 0.6rem;
		}
		.searchResult {
			position: fixed;
			width: 100%;
			top: 0.5rem;
			height: auto;
			max-height: 2.75rem;
			box-shadow: 0 0.02rem 0 #eee;
			overflow-y: scroll;
			left: 0px;
			z-index: 999;
			background: white;
		}
		.sortBox {
			line-height: 0.4rem;
			font-size: 0.13rem;
			.add {
				margin-left: 0.15rem;
				height: 100%;
				border-bottom: 1px solid #eee;
			}
		}
		.sortBox:active {
			background: #eee;
		}
		/*右侧*/
		.slide {
			width: 0.2rem;
			height: 100%;
			position: fixed;
			right: 0;
			top: 0.5rem;
			color: #6ab3d1;
			display: flex;
			flex-direction: column;
			font-size: 0.12rem;
			text-align: center;
			z-index: 3;
		}
		/*阴影*/
		.yin {
			width: 0.5rem;
			height: 0.5rem;
			background-color: rgba(0, 0, 0, 0.4);
			position: fixed;
			top: 40%;
			left: 40%;
			text-align: center;
			line-height: 0.5rem;
			color: white;
			border-radius: 0.08rem;
			font-size: 0.14rem;
			z-index: 9;
		}
		.input {
			position: absolute;
			left: 1rem;
			top: 0;
			height: 0.6rem;
			background-color: #fff;
			font-size: 0.28rem;
		}
		.temABC {
			margin-top: 0.04rem;
		}
		.common {
			font-weight: bolder;
			width: 100%;
			font-size: 0.14rem;
			padding-left: 0.15rem;
			color: #333333;
			line-height: 0.3rem;
		}
		.sort {
			background: #EEF3FA;
			line-height: 0.3rem;
			font-size: 0.14rem;
			color: #333333;
			padding-left: 0.15rem;
		}
	}
</style>