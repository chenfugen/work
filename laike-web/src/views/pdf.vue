<template>
    <div id="pdf">
    　　<pdf src="./abc.pdf"></pdf>
    </div>
</template>

<script>
　　import pdf from 'vue-pdf'
　　export default {
　　　　components: {
　　　　    pdf
　　　　　}
　　　　}
</script>
<style lang="less">
#pdf{
    >span{
        width: 100%;
    }
}
@media screen and (max-width: 680px) {
    body{
        width: 100%;
    }
    #app {
        min-width: 0;
    }
}
</style>