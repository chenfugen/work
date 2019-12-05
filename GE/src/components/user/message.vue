<template>
	<div class="message">
		<van-swipe-cell v-show='total>0' :right-width="80" :on-close="onClose" style='margin-top:0.1rem;'>
			<van-cell-group>
				<van-cell to="/faultMsg">
					<van-card :desc="deviceName"  title="故障通知" :thumb="imageURL" />
					<p class="time">{{reportTime | formatTime}}</p>
					<p class="deviceName">{{faultName}}</p>
				</van-cell>
			</van-cell-group>
			<span slot="right">删除</span>
		</van-swipe-cell>
	    <div v-show='total==0' class="nullMessage">
			<img src="../../../static/image/icon_fault_notice.png"/>
			<p class="nullTitle">暂无消息</p>
		</div>
	</div>
	
	<!--<van-swipe-cell :right-width="80" :on-close="onClose">
			<van-cell-group>
				<van-cell to="/filterMsg">
				<van-card desc="描述信息"  tag="66+" title="滤芯通知" :thumb="imageURL" />
				<p class="time">9:05</p>
				</van-cell>
			</van-cell-group>
			<span slot="right">删除</span>
		</van-swipe-cell>-->
	</div>
</template>

<script>
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				imageURL: "../../../static/image/icon_fault_notice@2x.png",
				faultName: "",
				reportTime: "",
				deviceName:"",
				total:"0",
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				let that = this;
				that.$Axios.get("wechat/device/deviceFault/list").then((res) => {
					if(res.data.success) {						
						that.total=res.data.data.length.toString();
						if(that.total>0){
							that.faultName = res.data.data[0].faultName;
						    that.reportTime = res.data.data[0].reportTime;
						    that.deviceName = res.data.data[0].deviceName;						    
						}				
					}
				})
			},
			onClose(clickPosition, instance) {

			},
			onClickLeft() {
				this.$router.push('/user')
			}
		}
	}
</script>

<style lang="scss">
	.message {
		.van-nav-bar .van-icon {
			color: #323233;
		}
		.van-swipe-cell__left,
		.van-swipe-cell__right {
			display: inline-block;
			width: 90px;
			height: 90px;
			font-size: 15px;
			line-height: 90px;
			color: #fff;
			text-align: center;
			background-color: #f44;
		}
		.van-card {
			background: white;
		}
		.van-card__thumb {
			width: 0.5rem;
		}
		.van-card__title {
			line-height: 0.25rem;
			font-size: 0.15rem
		}
		.van-card__content,
		.van-card__thumb {
			height: auto;
		}
		.time {
			position: absolute;
			top: 0.03rem;
			right: 0px;
			color: #7d7e80;
			line-height: 0.2rem;
			font-size: 0.14rem;
		}
		.deviceName{
			position: absolute;
			top: 0.43rem;
			left:0.73rem;
			color: #7d7e80;
			line-height: 0.2rem;
			font-size: 0.1rem;
		}
		.van-tag--mark {
			border-radius: 50%;
		}
		.van-card__tag {
			top:0px;
			left: -0.1rem;
		}
		.nullMessage{
			text-align: center;
			overflow: hidden;
			img{
				width:0.6rem;
				margin-top:50%;
				vertical-align:top;
			}
			.nullTitle{
				font-size:0.14rem;
				line-height:0.4rem;
				color: #333;
			}
			
		}
	}
</style>