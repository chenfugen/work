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
        pdfUrl: "", //pdf
        geYa: ["a1osvT3xArq", "a1mq55FcdD1", "a1l3RRgwECJ", "a1bSi4OHYRs", "a1edMf8mfSH", "a1wG79dZYPJ"],
        geChang: ["a1yoJcSJEXJ", "a1ZL2myX6Gd", "a1QSvMW8mnD", "a1bDSJUFzbd"],
        geJu: ["a1kqLg4yTZK", "a1lR2NRXgTG"],
      }
    },
    mounted() {
      // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration: 1000
      });
      let productKey = this.$route.query.productKey
      switch (func.getProductNumber(productKey)) {
        case 1:
          this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/venusClean.pdf")
          break;
        case 2:
          this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/venusSoft.pdf")
          break;
        case 3:
          if (this.geYa.indexOf(productKey) > -1) {
            this.pdfUrl = "../../../static/productPdf/geYa.pdf"
          } else if (this.geJu.indexOf(productKey) > -1) {
            this.pdfUrl = "../../../static/productPdf/geJu.pdf"
          } else if (this.geChang.indexOf(productKey) > -1) {
            this.pdfUrl = "../../../static/productPdf/geChang.pdf"
          } else {
            this.pdfUrl = "../../../static/productPdf/commercialRO_NF.pdf"
          }
          break;
        case 4:
          this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/separateWater.pdf")
          break;
        case 5:
          this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/allInOne.pdf")
          break;
        case 6:
          this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/three-levelRo.pdf")
          break;
        case 7:
          this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/CUF.pdf")
          break;
        case 8:
          if (productKey == "a1xjge89hkA") {
            this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/P7_RO.pdf")
          } else if (productKey == "a1obsHkefOT") {
            this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/P7_CMF.pdf")
          } else {
            this.pdfUrl = pdf.createLoadingTask("../../../static/productPdf/P7_NF.pdf")
          }
          break;
        default:
          break;
      }
    },
    methods: {
      changePdfPage() {
        if (this.currentPage > 0) {
          this.currentPage--
        }
        if (this.currentPage < this.pageCount) {
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
