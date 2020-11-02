<template>
	<div class="search">
		<form action="/">
			<van-search v-model="content" placeholder="请输入搜索关键词" show-action @search="onSearch" @cancel="onCancel" />
		</form>
		<ul v-show="searchBox" class="searchList">
			<li>
				<div class="left">
					<p class="name">Delloo1</p>
					<p class="detail"><span>资产：3000台</span><span>在用：17台</span></p>
				</div>
				<div class="right">
					<p class="number">0</p>
					<p class="title">在库(台)</p>
				</div>
			</li>
		</ul>		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				content: "",
				searchBox:false,
			};
		},
		methods: {
			onSearch() {
				if (this.content == "" || this.content == undefined) {
					this.$toast("请输入搜索条件");
					this.searchBox = false;
					return false;
				}
				console.log(this.content);
				// 				this.address=[];
				// 				for(let i in addr) {
				// 					for(let j in addr[i].item) {
				// 						if(this.searchContent == addr[i].item[j].city || this.searchContent == addr[i].item[j].firststr || this.inputText == addr[i].item[j].firststr.toLowerCase()) {
				// 							this.address.push(addr[i].item[j]);
				// 							this.searchBox = true;
				// 						}
				// 					}
				// 				}
				// 				console.log(this.address);
			},
			onCancel() {
            this.$router.back(-1);
			}
		},
	}
</script>

<style lang="scss">
	.search {
		.searchList {
			background: white;

			li {
				padding: 0.1rem 0;
				border-bottom: 1px solid #E0E0E0;
				height: 0.35rem;

				.left {
					float: left;
					width: 60%;
					margin: 0 0.1rem;

					.name {
						color: #333;
						font-size: 0.13rem;
					}

					.detail {
						color: #969799;
						font-size: 0.12rem;
						line-height: 0.2rem;
					}
				}

				.right {
					float: right;
					width: 25%;
					margin: 0 0.1rem;
					.number {
						color: #FF0000;
						font-size: 0.12rem;
						text-align: right;
					}

					.title {
						color: #969799;
						font-size: 0.12rem;
						line-height: 0.2rem;
						text-align: right;
					}
				}
			}

		}
	}
</style>
