<template>
	<div>
		<mt-header title="众安在线财产保险股份有限公司" style="background: white;color:#3d4145" fixed>
			<mt-button icon="back" @click="back()" slot="left">返回</mt-button>
		</mt-header>
		<div class="imageBox"></div>
		<div class="content" style="font-size:14px;margin-top:225px;">
			<div class="content-padded">
				<p>众安保险，由蚂蚁金服、腾讯、中国平安等知名企业发起成立。作为中国首家互联网保险公司，众安也是一家以技术创新带动金融发展的金融科技公司。 众安保险总部设在中国上海，注册资本12.40625亿人民币，不设任何分支机构，完全通过互联网进行在线承保和理赔服务。</p>
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
  .imageBox {	   	   
		width:94%;
		height: 180px;
		margin-left:3%;
		margin-top: 50px;
		background: url(../../static/img/zhongan.png) no-repeat;
		background-size: 100% 100%;
	}
	
</style>