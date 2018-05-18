<template>
	<div>
		<mt-header :title="title" style="background: white;color:#3d4145;border-bottom: 1px solid #eee;" fixed></mt-header>
		<div class="content" style="margin-top:40px;">
			<div class="topNav">
				<div class="buttons-tab navs">
					<a v-for="(item,index) in OPList" :href="'#tab'+(index-0+1)" class="tab-link button" v-model="selected" :class="item.OPID==selected?'active':''">{{item.Name}}</a>
				</div>
			</div>
			<div class="banner"></div>
			<p class="commentAlert" @click="box">
				<i class="iconfont icon-tishi" style="color:#0894ec;"></i> 什么是手术意外险？
			</p>
			<div class="content-block" style="background: white;margin-top:0px;">
				<div class="tabs">
					<div v-for="(item,index) in OPList" :id="'tab'+(index-0+1)" class="tab" v-model="selected" :class="item.OPID==selected?'active':''">
						<ul>
							<li v-for="(ins,index) in item.options" class="list-button insuranceBox" :key="ins.id">
								<div @click="toFrom(item.Name,item.OPID,ins.INSID,ins.Name)">
									<img :src="ins.Img | imgsrc" class="imgBox" />
									<div class="insuranceMsg">
										<h5>{{ins.Name}}</h5>
										<!--<p class="comments">涵盖所有骨科类手术</p>-->
										<p style="padding-top:5px"><span class="price">￥{{ins.LowPrice}}元起</span>
											<!-- <span class="number">销量 0 份</span>--></p>
									</div>
								</div>
							</li>
						</ul>
						<div v-if="item.Length==1" class="footFixed">
							<p class="treaty-content">本产品由
								<a href="#/zhg">众安在线财产保险股份有限公司</a>提供</p>
							<p class="treaty-content">由
								<a href="#/hp">环平保险经纪（上海）有限公司</a>负责销售</p>
						</div>
						<div v-else class="footTitle">
							<p class="treaty-content">本产品由
								<a href="#/zhg">众安在线财产保险股份有限公司</a>提供</p>
							<p class="treaty-content">由
								<a href="#/hp">环平保险经纪（上海）有限公司</a>负责销售</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	//	var address = "http://insurance.idukou.com/";
	import cookie from '../../static/js/cookie.js';
	var address = "http://baoxian.idukou.com/";
	export default {
		data() {
			return {
				title:"",
				selected:"",	
				OPList: ""
			}
		},
		mounted: function() {
			var _this = this;		
			_this.$indicator.open('加载中...');			
			_this.$http.get(address+"api/Hospital/GetHospital/"+_this.$route.params.title).then(function(res) {			
				_this.title=res.body.Name;
			})			
			_this.selected=_this.$route.params.home;
			
			_this.$http.get(address + "api/OP/GetOPList/"+_this.$route.params.title).then(function(res) {
				res.body.forEach(function(item) {
					_this.$http.get(address + "api/INS/GetINSByOpID/" + item.OPID).then(function(msg) {
						_this.$set(item, "options", msg.body);
						_this.$set(item, "Length", msg.body.length);
						_this.$indicator.close();
					});
				})
				_this.OPList = res.body;
			});
		},
		methods: {
			box: function() {
				$.alert('<p>&nbsp;</p>医疗领域具有高风险性和复杂性，由于患者的个体差异和医疗水平的限制，在麻醉和手术过程中会有许多不可控的因素而导致意外发生，严重的意外会造成死亡和伤残，而更多的意外是出现许多手术并发症，给患者带来预料不到的痛苦和额外花费。手术意外保险就是针对这种可能出现的意外推出的保险方案。', "—— 手术意外险   ——")
			},
			toFrom: function(itemName,itemOpid,insId, insName) {
				if(insId == 1003 || insId == 1016 || insId == 1017 || insId == 1018 || insId == 1019) {
					this.$toast('产品涉及并发症,\n正在积极报备条款,\n稍后为您发布...');
				} else {					           
					cookie.setCookie("itemOpid",itemOpid);	
					cookie.setCookie("titles",this.$route.params.title);
					this.$router.push("/form/" + itemName + "/" + insName + "/" + insId);
				}
			}			
		},
		filters: {
			imgsrc: function(value) {
				if(value != " ") {
					return "http://img.jidianol.cn/" + value;
				}
			}
		},
		watch: {

		}
	}
</script>

<style>
	* {
		margin: 0px;
		padding: 0px;
	}
	
	ul {
		list-style: none;
	}
	
	a {
		text-decoration: none;
	}
	
	.topNav {
		width: 100%;
		height: 40px;
		overflow: hidden;
		position: fixed;
		top: 40px;
	}
	
	.navs {
		overflow-x: auto;
		padding-bottom: 20px;
	}
	
	.banner {
		width: 100%;
		height: 180px;
		margin-top: 40px;
		background: url(../../static/img/timg.jpg) no-repeat;
		background-size: 100% 100%;
	}
	
	.commentAlert {
		margin: 0px;
		padding: 3px 15px;
		font-size: 12px;
		color: #0894ec;
		background: white;
	}
	
	.modal-title {
		position: absolute;
		left: 0px;
		top: 0px;
		border-radius: .35rem .35rem 0 0;
		padding: 10px 0px;
		background: #0894ec;
		font-size: 15px;
		width: 100%;
		color: white;
	}
	
	.modal-text {
		font-size: 13px;
		line-height: 25px;
	}
	
	ul {
		margin-top: 10px;
	}
	
	ul .insuranceBox {
		width: 100%;
		height: 100px;
		border-bottom: 1px solid #eee;
		position: relative;
	}
	
	.insuranceBox a {
		color: #7f7f7f;
	}
	
	.imgBox {
		position: absolute;
		top: 10px;
		width: 40%;
		height: 80px;
	}
	
	.insuranceMsg {
		position: absolute;
		top: 10px;
		left: 40%;
		display: inline-block;
		width: 60%;
		height: 90px;
		padding: 0px 0px 0px 10px;
	}
	
	.insuranceMsg .comments {
		font-size: 12px;
	}
	
	.insuranceMsg .price {
		color: #F6383A;
		font-size: 15px;
	}
	
	.insuranceMsg .number {
		float: right;
		font-size: 12px;
		padding-top: 5px;
	}
	
	.footFixed{
		position: fixed;
		width: 100%;
		height: 50px;
		bottom:10px;
		left: 0px;
		margin-top: 18px;
		text-align: center;
	}
	.footTitle {
		position: absolute;
		width: 100%;
		height: 50px;
		left: 0px;
		margin-top:8px;
		text-align: center;
	}
	.footFixed .treaty-content {
		font-size: 10px;
	}
	.footTitle .treaty-content {
		font-size: 10px;
	}
</style>