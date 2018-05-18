<template>
	<div>
		<mt-header title="环平保险经纪（上海）有限公司" style="background: white;color:#3d4145" fixed>
			<mt-button icon="back" @click="back()" slot="left">返回</mt-button>
		</mt-header>
		<div class="card demo-card-header-pic" style="margin-top:45px;">
			<div valign="bottom" class="card-header color-white no-border no-padding">
				<img class='card-cover' src="../../static/img/hp01.png" alt="">
			</div>
			<!--<div class="card-content">
				<div class="card-content-inner">
					<p>环平经纪许可证</p>
				</div>
			</div>-->
		</div>
		<div class="card demo-card-header-pic" style="margin-top:10px;">
			<div valign="bottom" class="card-header color-white no-border no-padding">
				<img class='card-cover' src="../../static/img/hp02.png" alt="">
			</div>
			<!--<div class="card-content">
				<div class="card-content-inner">
					<p>环平经纪营业执照</p>
				</div>
			</div>-->
		</div>
		<!--<img src="../../static/img/hp02.png" />-->
		<!--<div class="content" style="font-size:14px;margin-top:225px;">
			<div class="content-padded">
				<p>众安保险，由蚂蚁金服、腾讯、中国平安等知名企业发起成立。作为中国首家互联网保险公司，众安也是一家以技术创新带动金融发展的金融科技公司。 众安保险总部设在中国上海，注册资本12.40625亿人民币，不设任何分支机构，完全通过互联网进行在线承保和理赔服务。</p>
			</div>
		</div>-->
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