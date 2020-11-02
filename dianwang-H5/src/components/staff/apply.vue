<template>
	<div class="apply">
		<Header title="申请" to="null"></Header>
		<p class="hint">你正在申请<span class="device"> {{name+"("+model+")"}}</span></p>
		<van-cell-group>
			<van-field v-model="unit" placeholder="请选择" readonly label="使用单位" />
			<van-field v-model="roomNum" placeholder="请输入房间号" readonly label="房间号" is-link @click="selectRoom" />
			<van-field v-model="user" placeholder="请输入领用人" label="使用人" @input="input" />
			<van-field v-model="proposer" placeholder="申请人" label="申请人" readonly />
		</van-cell-group>
		<van-popup v-model="show" position="bottom">
			<van-cell-group>
				<van-cell v-for="(item,index) in roomList" :key="index" :title="item.number" is-link @click="getRoom(item)" />
			</van-cell-group>
		</van-popup>
		<div class="confirm_button">
			<van-button size="large" color="#229794" @click="confirm" :disabled="isConfirm" class="confirm">确认</van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				name: this.$route.params.name,
				model: this.$route.params.model,
				id: this.$route.params.id,
				userDetail: {},
				show: false,
				"unit": "",
				"user": "",
				roomNum: "",
				roomId: "",
				"proposer": "",
				"isConfirm": true,
				applyAsset: "",
				roomList: ""
			};
		},
		components: {
			Header
		},
		mounted() {
			this.init();
			if (this.$cookies.get("applyAsset") != null) {
				this.applyAsset = this.$cookies.get("applyAsset");
			} else {
				const applyAsset = {
					name: this.$route.params.name,
					model: this.$route.params.model,
				}
				this.$cookies.set("applyAsset", JSON.stringify(applyAsset));
			}
		},
		methods: {
			init() {
				this.$Axios.get('/manage/account/detail').then((res) => {
					if (res.success) {
						this.userDetail = res.data;
						this.$Axios.get('/common/room/list', {
							params: {
								accessKey: this.$store.state.accessKey,
								departmentId: this.userDetail.departmentId,
							}
						}).then((res) => {
							if (res.success) {
								this.roomList = res.data;
							}
						})
						this.proposer = res.data.realName;
						this.unit = this.userDetail.organizationName + this.userDetail.departmentName;
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			selectRoom() {
				this.show = true;
			},
			getRoom(item) {
				this.roomNum = item.number;
				this.roomId = item.id;
				this.show = false;
			},
			input() {
				this.isConfirm = this.user.length > 0 ? false : true;
			},
			selectUnit() {
				this.$router.push("/units/" + this.$route.params.id + "?type=2");
			},
			confirm() {
				if (this.unit == undefined) {
					this.$toast("请选择申请单位")
					return false
				}
				if (this.user == "") {
					this.$toast("请输入使用人姓名")
					return false
				}
				if (this.roomNum == "") {
					this.$toast("请选择房间号")
					return false
				}
				this.$Axios.post('/wechat/asset/apply', {
					organizationId: this.userDetail.organizationId,
					directoryId: this.id,
					departmentId: this.userDetail.departmentId,
					user: this.user,
					roomId: this.roomId
				}).then((res) => {
					if (res.success) {
						this.$toast("申请成功");
						this.$cookies.remove("applyAsset");
						this.$router.push("/person");
					}
				}).catch((res) => {
					this.$toast(res.message);
				});

			}
		}
	}
</script>

<style lang="scss">
	.apply {
		.hint {
			margin: 0rem 0.12rem 0 0.12rem;
			line-height: 0.3rem;
			font-size: 0.12rem;
			color: #333333;

			.device {
				color: #068b88;
			}
		}

		.van-popup--bottom {
			bottom: 0;
			left: 0;
			width: 100%;
			max-height: 2rem;
		}

		.confirm_button {
			margin: 0.15rem 0.12rem;
			position: relative;

			.confirm {
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				top: 0px;
			}
		}
	}
</style>
