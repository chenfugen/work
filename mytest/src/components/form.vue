<template>
	<div>
		<div class="tabImg">
			<mt-header style="background: rgba(0,0,0,0);border: none;position:absolute;top:0px;color:#0894EC;z-index: 100;">
				<mt-button icon="back" @click="back()" slot="left">返回</mt-button>
			</mt-header>
			<h2 class="title" v-text="home"></h2>
			<img :src="insurance.HeadImg | imgsrc" />			
			<!--<header-bar :left="left" @click="back()" ></header-bar>-->
			<p class="comments"  v-text="Name"></p>
		</div>
		<div class="tableBox" v-if="id==1003">
			<div class="buttons-tab">
				<a v-for="(item,index) in insurances" :href="'#tab'+(index-0+1)" @click="choose(index)" class="tab-link button" :class="index==0?'active':''">{{item.Name}}</a>
			</div>
			<div style="padding: 0px 10px;">
				<div class="tabs">
					<div v-for="(item,index) in insurances" :id="'tab'+(index-0+1)" class="tab" :class="index==0?'active':''">
						<div class="tableBox">
							<img :src="item.Img | imgsrc" style="width:100%;" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tableBox" v-if="id!=1003">
			<img :src="insurance.Img | imgsrc" style="width:100%;" />
		</div>
		<div class="list-block" style="margin-top:5px;">
			<ul class="applicant">
				<li>
					<div class="item-content">

						<div class="item-inner">
							<div class="item-title label">手术时间</div>
							<div class="item-input">
								<input type="date" id="date" v-model="order.surgeryDate" :class="order.surgeryDate==''?'':'full'" @change="datas()" placeholder="请选择" />
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">保障期限</div>
							<div class="item-input">
								<input type="text" v-model="insurance.Period+'天'" readonly="readonly">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">主治医生</div>
							<div class="item-input">
								<!--<input type="text" placeholder="请输入姓名" >-->
								<select class="doctor" v-model="order.DoctorName">
									<option disabled value="" >请选择</option>
									<option v-for="doctor in doctors" v-cloak>{{doctor.DoctorName}}</option>
								</select>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="list-block" style="margin-top:-30px;">
			<ul class="applicant">
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">投保人</div>
							<div class="item-input">
								<input type="text" placeholder="请输入姓名" v-model="order.policyHolder.name">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">证件类型</div>
							<div class="item-input">
								<select v-model="policyHolderCord">
									<option>身份证</option>
								</select>
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">身份证号码</div>
							<div class="item-input">
								<input type="text" placeholder="请输入身份证" v-model="order.policyHolder.certNo" @change="isLegal()">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">联系电话</div>
							<div class="item-input">
								<input type="text" placeholder="请输入手机号码" v-model="order.policyHolder.phone">
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="list-block" style="margin-top:-30px;">
			<ul class="applicant">
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label" style="width:50%;">被保险人是否为本人</div>
							<div class="item-input">
								<label class="label-switch" style="float:right;">
                                    <input type="checkbox" v-model="Check" @change="isCheck">
                                        <div class="checkbox"></div>
                                     </label>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="list-block" style="margin-top:-30px;">
			<ul class="applicant">
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">被保险人</div>
							<div class="item-input">
								<input type="text" placeholder="请输入姓名" v-model="order.insured.name">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">证件类型</div>
							<div class="item-input">
								<select v-model="insuredCord">
									<option>身份证</option>
									<option>出生证</option>
								</select>
							</div>
						</div>
					</div>
				</li>
				<li v-if="insuredCord =='身份证'">
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">身份证号码</div>
							<div class="item-input">
								<input type="text" placeholder="请输入身份证" v-model="order.insured.certNo" @change="cardCheck()">
							</div>
						</div>
					</div>
				</li>
				<li v-if="insuredCord=='出生证'">
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">出生证号码</div>
							<div class="item-input">
								<input type="text" placeholder="请输入出生证号码" v-model="order.insured.certNo">
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div class="list-block" style="margin-top:0px;">
				<div class="item-content">
					受益人为法定继承人
				</div>
			</div>
		</div>
		<div class="treaty">
			<label class="label-checkbox item-content" style="background:none;">
                <input type="checkbox" name="my-checkbox" v-model="isAgree" @change="isAgrees()">
                <div class="item-media"><i class="icon icon-form-checkbox" style="width:15px;height:15px;"></i></div>                     
                <span class="treaty-content">本人承诺投保信息的真实性，理解并同意<a :href="'#/insuranceInfro/'+id">《投保须知》</a><a href="#/insuranceAct">《保险条款》</a><a href="#/lplc">《理赔流程》</a>的全部内容</span>
               <!-- <a href="#/bxjj">《保险经纪协议》</a>-->
            </label>
		</div>
		<p style="height:70px;"></p>
		<nav class="bar bar-tab" style="position: fixed;background: white;z-index:999;">
			<div class="footer">
				<a class="tab-item phone" href="tel:1010-9955">
					<span class="icon icon-phone"></span>
					<span class="tab-label">客服</span>
				</a>
				<span class="line"></span>
				<span class="insuranceMoney"><span class="insurancePrice" style="color:#F6383A;">{{order.premium}}</span><span style="font-size:10px"> 元</span></span>
				<span class="insuranceSumbit" @touchstart="formSubmit">我要投保</span>
			</div>
		</nav>
	</div>
</template>

<script>
	import Vue from 'vue';
	import cookie from '../../static/js/cookie.js';
	import { Toast } from 'mint-ui';
	import headerBar from './header/index.vue'
	var address = "http://baoxian.idukou.com/";

	// 转化时间
	Date.prototype.format = function(fmt) { //author: meizz
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	Vue.prototype.isCardNo = function(card) {
		if(card == " " || card == undefined) {
			Toast('身份证号码为空!');
			return false;
		}
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if(reg.test(card) === false) {
			Toast("身份证格式不正确");
			return false;
		} else {
			return true;
		}
	}
	//姓名
	Vue.prototype.checkName = function(val, name) {
		var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
		if(val == "" || val == undefined) {
			Toast('请输入' + name + '名字！');
			return false;
		}
		if(!reg.test(val)) {
			Toast(name + '名字格式不对！');
			return false;
		} else {
			return true;
		}
	}

	//手机号码判断
	Vue.prototype.checkPhone = function(val) {
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(!myreg.test(val)) {
			Toast('请输入有效的手机号码！');
			return false;
		} else {
			return true;
		}
	}

	function num(e) {
		var rand = "";
		for(var i = 0; i < e; i++) {
			var r = Math.floor(Math.random() * 10);
			rand += r;
		}
		return rand;
	}
	export default {
		data() {
			return {
				left: {
					text: "返回",
					status: true
				},
				insurance: "",
				insurances: "",
				doctors: "",
				isAgree: false,
				policyHolderCord: "身份证",
				insuredCord: "身份证",
				order: {
					channelCode: "",
					channelAppCode: "",
					channelOrderNo: num(12),
					DoctorName: "",
					productCode: "",
					premium: "0.00",
					expireTime: "",
					surgeryDate: "",
					applyNum: "1",
					Period: "",
					policyHolder: {
						certType: "I"
					},
					insured: {
						certType: ""
					},
					extendInfos: [{
						key: "surgeryDate",
						value: ""
					}]
				},
				Check: false,
				id: this.$route.params.id,
				Name: this.$route.params.name,
				home:this.$route.params.home,
			}
		},
		components: {
			headerBar
		},
		http: {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		},
		filters: {
			imgsrc: function(value) {
				if(value != "" && value != undefined) {
					return "http://img.jidianol.cn/" + value;
				}
			}
		},
		mounted: function() {
			this.$indicator.open('加载中...');
			//this.order.surgeryDate=new Date().format("yyyy-MM-dd");
			this.$http.get(address + 'api/INSDetail/GetINSDetailList/' + this.id).then(function(res) {
				this.insurance = res.body[0];
				this.insurances = res.body;
				//console.log(this.insurance)
				this.$indicator.close();
			})
			this.$http.get(address + 'api/Doctor/GetDoctorListByOPID/' + this.id).then(function(res) {
				this.doctors = res.body;
			})
			//window.addEventListener('scroll', this.menu)
		},
		methods: {
			datas: function() {
				//console.log(new Date(this.order.surgeryDate).getTime()<new Date().getTime())
				var nowTime = new Date().format("yyyy-MM-dd");
				if(new Date(this.order.surgeryDate).getTime() < new Date(nowTime).getTime()) {
					this.$toast('请选择正确时间！');
					return false;
				}
			},
			formSubmit: function() {				
				if(this.order.surgeryDate == undefined || this.order.surgeryDate == "") {
					this.$toast('请输入手术时间！');
					return false;
				}
				var nowTime = new Date().format("yyyy-MM-dd");
				if(new Date(this.order.surgeryDate).getTime() < new Date(nowTime).getTime()) {
					this.$toast('请选择正确时间！');
					return false;
				}
				this.order.effectiveTime = this.order.surgeryDate;
				this.order.extendInfos[0].value = this.order.surgeryDate;
				if(this.checkName(this.order.policyHolder.name, "您的")) {
					if(this.isCardNo(this.order.policyHolder.certNo)) {
						if(this.checkPhone(this.order.policyHolder.phone)) {
							if(this.checkName(this.order.insured.name, "被保人")) {
								if(this.insuredCord == "身份证") {
									this.order.insured.certType = "I";
									if(this.isCardNo(this.order.insured.certNo)) {
										if(this.isAgree) {
											this.order.insName = this.Name;
											this.order.Period = this.insurance.Period;
											this.order.channelCode = this.insurance.channelCode;
											this.order.productCode = this.insurance.productCode;
											var str = JSON.stringify(this.order);
											cookie.setCookie("order", str);
											console.log(this.order);
											this.$indicator.open('正在核保中..');
											this.$http.post(address + "api/ZhonganProgram/Test", this.order).then(function(data) {
													this.$indicator.close();												
												if(data.body.msgInfo=="核保成功") {
													this.$router.push("/order/" + this.id);
												} else {
													this.$toast(data.body.msgInfo);
												}
											})
										} else {
											this.$toast('是否同意各相关协议！');
										}
									}
								} else if(this.insuredCord == "出生证") {
									this.order.insured.certType = "B";
									if(this.order.insured.certNo == "" || this.order.insured.certNo == undefined) {
										this.$toast('请填写出生证！');
										return false;
									}
									if(this.isAgree) {
										this.order.insName = this.Name;
										this.order.Period = this.insurance.Period;
										this.order.channelCode = this.insurance.channelCode;
										this.order.productCode = this.insurance.productCode;
										var str = JSON.stringify(this.order);
										cookie.setCookie("order", str);
										this.$http.post(address + "api/ZhonganProgram/Test", this.order).then(function(data) {
											this.$indicator.close();
											if(data.body.msgInfo=="核保成功") {
												this.$router.push("/order/" + this.id);
											} else {
												this.$toast(data.body.msgInfo);
											}
										})
									} else {
										this.$toast('是否同意各相关协议！');
									}
								}
							}
						}
					}
				};
			},
			isLegal: function() {
				if(this.isCardNo(this.order.policyHolder.certNo)) {
					var dd = new Date();
					var month = dd.getMonth() + 1;
					var day = dd.getDate();
					var age = dd.getFullYear() - this.order.policyHolder.certNo.substring(6, 10) - 1;
					if(this.order.policyHolder.certNo.substring(10, 12) < month || this.order.policyHolder.certNo.substring(10, 12) == month && this.order.policyHolder.certNo.substring(12, 14) <= day) {
						age++;
					};
					if(age < 18) {
						this.$toast('对不起,您未满18岁');
						this.order.policyHolder.certNo = ""
					}
				}
			},
			isCheck: function() {
				if(this.Check) {
					if(this.checkName(this.order.policyHolder.name, "您的") && this.isCardNo(this.order.policyHolder.certNo)) {
						this.order.insured.name = this.order.policyHolder.name;
						this.order.insured.certNo = this.order.policyHolder.certNo;
						var dd = new Date();
						var month = dd.getMonth() + 1;
						var day = dd.getDate();
						var age = dd.getFullYear() - this.order.insured.certNo.substring(6, 10) - 1;
						if(this.order.insured.certNo.substring(10, 12) < month || this.order.insured.certNo.substring(10, 12) == month && this.order.insured.certNo.substring(12, 14) <= day) {
							age++;
						};
					if(this.insurance.Age1 <= age && this.insurance.Age2 >= age) {
							this.order.premium = this.insurance.Price1 + '.00';
						} else {
							this.order.premium = this.insurance.Price2 + '.00';
						}
						this.order.insured.relationToPH = "1";
					} else {
						this.Check = false;
					}
				} else {
					this.order.insured.name = "";
					this.order.insured.certNo = "";
					this.order.premium = "0.00";
				}
			},
			cardCheck: function() { //判断价格				
				if(this.isCardNo(this.order.insured.certNo)) {
					var dd = new Date();
					var month = dd.getMonth() + 1;
					var day = dd.getDate();
					var age = dd.getFullYear() - this.order.insured.certNo.substring(6, 10) - 1;
					if(this.order.insured.certNo.substring(10, 12) < month || this.order.insured.certNo.substring(10, 12) == month && this.order.insured.certNo.substring(12, 14) <= day) {
						age++;
					};
					if(this.insurance.Age1 <= age && this.insurance.Age2 >= age) {
						this.order.premium = this.insurance.Price1 + '.00';
					} else {
						this.order.premium = this.insurance.Price2 + '.00';
					}
					if(age > 18) {
						this.order.insured.relationToPH = "1";
						this.order.policyHolder.name = this.order.insured.name;
						this.order.policyHolder.certNo = this.order.insured.certNo;
					} else {
						this.order.insured.relationToPH = "4";
					}

				}
			},
			isAgrees: function() {},
			back: function() {
				this.$router.push("/"+cookie.readCookie("titles")+"/"+cookie.readCookie("itemOpid"));	
				this.$emit('back');
				this.$router.isBack = true;
			},
			choose: function(e) {
				this.insurance = this.insurances[e];
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(reg.test(this.order.insured.certNo) != false) {
					this.cardCheck();
				} else {
					this.order.premium = "0.00";
				}
			}
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
	
	input[type="date"]:before {
		color: #757575;
		font-size:15px;
		font-style: inherit;
		font-weight:lighter;
		content: attr(placeholder);
	}
	
	input[type="date"].full:before {
		color: black;
		content: ""!important;
	}
	
	.tabImg {
		width: 100%;
		height: 200px;
		position: relative;		
	}
	
	.tabImg img {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	
	.tabImg .title {
		margin: 0px;
		color: #0894EC;
		letter-spacing: 10px;
		font-size: 25px;
		font-weight: bold;
		text-align: left;
		padding: 40px 0px 0px 10px;
		-webkit-text-stroke: 1px #fff;
	}
	
	.tabImg .comments {
		margin: 0px;
		position: absolute;
		top:85px;
		color: #0894EC;
		font-size: 23px;
		padding: 0px 0px 0px 10px;
		-webkit-text-stroke: 0.5px #fff;
	}
	
	.tableBox {
		width: 100%;
		height: auto;
		padding: 10px 0px;
		background: white;
	}
	
	.treaty {
		margin-top: -30px;
		height: 50px;
		padding: 0px 15px;
	}
	
	.treaty .item-media {
		width: 6%;
		float: left;
	}
	
	.treaty .treaty-content {
		font-size: 12px;
	}
	
	.footer {
		width: 100%;
		height: 100%;
		position: relative;
		padding-bottom: 5px;
	}
	
	.footer .phone {
		position: absolute;
		left: 10px;
		top: 5px;
		display: inline-block;
		width: 40px;
	}
	
	.footer .line {
		position: absolute;
		left: 55px;
		top: 12.5px;
		display: inline-block;
		width: 1px;
		height: 25px;
		background: #eee;
	}
	
	.footer .insuranceMoney {
		position: absolute;
		left: 70px;
		top: 0px;
		font-size: 20px;
		display: inline-block;
		line-height: 50px;
	}
	
	.footer .insuranceSumbit {
		position: absolute;
		right: 0px;
		top: 0px;
		padding: 0px 30px;
		line-height: 50px;
		color: white;
		background: #0894ec;
	}
	
	.footer .insuranceSumbit:active {
		background: rgba(0, 0, 0, 0.1);
	}
	
	.item-content {
		font-size: 15px;
	}
	
	input::-webkit-input-placeholder {
		font-size: 15px;
	}
</style>