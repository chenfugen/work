<template>
	<div>
		<van-nav-bar :title="name" fixed left-arrow  @click-left="onClickLeft" />
		<p class="box"></p>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				name:this.title,
			};
		},
		mounted() {
			
		},
		props: {
			title: String,
			to:{
				type: String,
				default:"null"
			}
		},
		methods:{
	      onClickLeft(){
			   if(this.to=="null"){
					 let fullPath=this.$cookies.get('fullPath');
					 if(fullPath=="/"){
						 this.$router.push("/admin");  
             }else{
							this.$router.back(-1);  
						}	      
				}else{
				   this.$router.push(this.to);  
				}
			}	
		}
	}
</script>

<style>
   .box{
		 height:45px;
		}
		.van-nav-bar .van-icon {
			color: #323233;
		}
</style>
