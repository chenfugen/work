<template>
	<div class="content">
		<header-bar :text="title" :left="left" @click="back()" style="background: white">1</header-bar>
		<div class="content" style="margin-top: 15px;">
			<div class="content-block-title">手术意外险</div>
			<div class="list-block">
				<ul>
					<li class="item-content">
						<div class="item-media"><i class="icon icon-f7"></i></div>
						<div class="item-inner">
							<div class="item-title">被保险人</div>
							<div class="item-after">{{order.insured.name}}</div>
						</div>
					</li>
					<li class="item-content">
						<div class="item-media"><i class="icon icon-f7"></i></div>
						<div class="item-inner">
							<div class="item-title">身份证号码</div>
							<div class="item-after">{{order.insured.certNo}}</div>
						</div>
					</li>
					<li class="item-content">
						<div class="item-media"><i class="icon icon-f7"></i></div>
						<div class="item-inner">
							<div class="item-title">投保期限</div>
							<div class="item-after">{{order.Period}}天</div>
						</div>
					</li>	
					<li class="item-content">
						<div class="item-media"><i class="icon icon-f7"></i></div>
						<div class="item-inner">
							<div class="item-title">手术日期</div>
							<div class="item-after">{{order.surgeryDate}}</div>
						</div>
					</li>
					<li class="item-content">
						<div class="item-media"><i class="icon icon-f7"></i></div>
						<div class="item-inner">
							<div class="item-title">保费</div>
							<div class="item-after" style="color: red;">￥{{order.premium}}</div>
						</div>
					</li>
				</ul>
				<p></p>
				<p></p>
				<!--<ul>
					<li class="item-content">
						<div class="item-media"><i class="icon icon-f7"></i></div>
						<div class="item-inner">
							<div class="item-title">保费总额</div>
							<div class="item-after" style="color: #F6383A;">{{order.premium}}元</div>
						</div>
					</li>
				</ul>
				<p style="padding:5px 15px;font-size:12px;">查看
					<a :href="'#/insuranceInfro/'+id">《投保须知》</a>
					<a href="#/insuranceAct">《保险条例》</a>
				</p>
				<p style="padding:5px 15px;font-size:12px;"><i class="iconfont icon-ti" style="color: #26a2ff;"></i> 本页面保单信息仅供参考，实际保单状态请以保险公司核心业务系统中心记载为准</p>-->
			</div>
			<div class="content-block">
				<div class="row">
					<div class="col-100">
						<a href="javascript:;" class="button button-big button-fill" @touchstart="pay">前去支付</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import headerBar from './header/index.vue';
	import cookie from '../../static/js/cookie.js';
	var address = "http://baoxian.idukou.com/";
	export default {
		data() {
			return {
				title: "确认订单",
				left: {
					text: "返回",
					status: true
				},
				id: this.$route.params.id,
				order: JSON.parse(cookie.readCookie("order")),
				payMsg: {
					out_trade_no:"",
					order_info:{},
					merchant_code:"",
					subject:"",
					expiry_time:"",
					amt:"",
					src_type:"",
					order_type:"",
					notify_url:"",
					return_url:"",
					service_name:""
				}
			}
		},
		components: {
			headerBar
		},
		http: {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		},
		mounted: function() {
			//this.$indicator.open('加载中...');			
			this.payMsg.out_trade_no=this.order.channelOrderNo;
			this.payMsg.merchant_code="10001";
			this.payMsg.subject= "众安手术意外险";
			this.payMsg.expiry_time= "30";
			this.payMsg.amt=this.order.premium;
			this.payMsg.src_type='mobile';
			this.payMsg.order_type="insurance";
			this.payMsg.notify_url= "http://baoxian.idukou.com/api/ZhonganPay/Back";
			this.payMsg.return_url="http://baoxian.idukou.com/index.html#/payResult";
			this.payMsg.order_info='{"产品名称":"'+this.order.insName+'","保障期限":"'+this.order.Period+'","保费":"'+this.order.premium+'"}';
			this.payMsg.service_name="alipayDirect";
		 	 console.log(this.payMsg);
			//this.$indicator.close();
		
		},
		methods: {
			pay: function() {
				this.$indicator.open('正在跳转中..');
				this.$http.post(address + "api/ZhonganPay/Pay",this.payMsg).then(function(data) {
					//console.log(data);
				  this.$indicator.close();	
			      window.location.href =data.body;
				    //$('.content').html(data.body);
				})
			},
			back: function() {
				this.$router.back();
				this.$emit('back');
				this.$router.isBack = true;
			},
			goLP:function(){
			    this.$router.push("/lplc");
			}
		}
	}
</script>
<style>
	.item-content .item-inner {
		font-size: 15px;
	}
	
	.list-block .item-media+.item-inner {
		margin-left: 0rem;
	}
</style>