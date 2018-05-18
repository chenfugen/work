<template>
	<div>
		<mt-header title="理赔流程" style="background: white;color:#3d4145" fixed>
			<mt-button icon="back" @click="back()" slot="left">返回</mt-button>
		</mt-header>
		<div class="content" style="font-size:14px;margin-top:40px;">
			<div class="content-padded">
				<p style="font-size:18px;">1、理赔方式：</p>
				<p>（1）拨打1010-9955客服电话报案，线下寄送理赔资料，寄送地址：上海市黄浦区圆明园路219号众安保险 健康险 理赔部</p>
				<p style="font-size:18px;">2、理赔资料：</p>
				<p>(1)保险金给付申请书;</p>
				<p>(2)保险合同或其他保险凭证;</p>
				<p>(3)申请人的有效身份证件;</p>
				<p>(4)被保险人病历中的手术记录; </p>
				<p>(5)公安部门或司法部门、二级及二级以上医院或保险人认可的医疗机构出具的被保险人死亡证明或验尸报告或保险人认可的医疗机构或其他鉴定机构出具的残疾鉴定诊断书; </p>
				<p>(6)若被保险人身故,被保险人的户籍注销证明; </p>
				<p>(7)保险金申请人所能提供的与确认保险事故的性质、原因、损失程度等有关的其他 证明和资料; </p>
				<p>(8)若保险金申请人委托他人申请的，还应提供授权委托书原件、委托人和受托人的身份证明等相关证明文件。受益人为无民事行为能力人或者限制民事行为能力人的，由其监 护人代为申领保险金，并需要提供监护人的身份证明等资料;  </p>
				<p>(9) 因医疗意外或麻醉意外导致保险事故发生的，申请人还需提供手术医院出具的意 外事故证明材料;</p>
				<p>(10) 因医疗事故导致保险事故发生的，申请人还需提供国家认可的医疗事故鉴定机 构出具的医疗事故技术鉴定书或人民法院出具的医疗事故认定的判决书。</p>
				<p style="font-size:18px;">3、理赔付款方式：</p>
				<p>（1）直接支付给受益人 </p>
				<p>（2）支付采用非现金</p>
				<p>（3）支付方式：转账</p>
				
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				id: this.$route.params.id
			}
		},
		methods: {
			back: function() {
				this.$router.back();
				this.$emit('back');
				this.$router.isBack = true;
			}
		}
	}
</script>
<style>

</style>