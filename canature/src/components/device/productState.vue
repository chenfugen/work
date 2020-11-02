<template>
	<div class="pdf" v-show="fileType=='pdf'">
		<van-pagination v-model="currentPage" :page-count="pageCount" mode="simple" @change="changePdfPage" class="arrow" />
		<pdf :src="pdfUrl" :page="currentPage" @num-pages="pageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"></pdf>
	</div>
</template>
<script>
	import * as func from '../../../static/js/func'
	import pdf from 'vue-pdf'
	export default {
		components: {
			pdf
		},
		data() {
			return {
				currentPage: 0, // pdf文件页码
				pageCount: 0, // pdf文件总页数
				fileType: 'pdf', // 文件类型
				pdfUrl:"", //pdf 
			}
		},
	mounted() {　
		this.$toast.loading({
			mask: true,
			message: '加载中...',
			duration: 1000
		});
		console.log(func.getProductNumber(this.$route.query.productKey))
		// 有时PDF文件地址会出现跨域的情况,这里最好处理一下
			switch(func.getProductNumber(this.$route.query.productKey)) {			
				case 1:
					this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/venusClean.pdf")　
					break;
				case 2:
					this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/venusSoft.pdf")　
					break;
				case 3:
					this.pdfUrl ="../../../static/productPdf/commercial.pdf"
					break;
				case 4:
					this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/separateWater.pdf")　				
					break;
				case 5:
					this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/allInOne.pdf")　
					break;
				case 6:
					this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/productState.pdf")　
					break;
				case 7:
					this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/productState.pdf")　
					break;
				default:
					break;
			}
		},
		methods: {
			changePdfPage() {
				if(this.currentPage > 0) {
					this.currentPage--
				}
				if(this.currentPage < this.pageCount) {
					this.currentPage++
				}
			},
			loadPdfHandler(e) {
				this.currentPage = 1 // 加载的时候先加载第一页
			}
		}
	}
</script>

<style lang="scss">
	.arrow {
		position: fixed;
		bottom: 0px;
		z-index: 999;
		width: 100%;
	}
</style>