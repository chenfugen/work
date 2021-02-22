/*
*
*   created By Xu Peng
*   显示状态的标签，自定义组件上的style属性，传入color和backgroundColor
*/
<template>
  <span class="status-tag">
    <slot></slot>
  </span>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.status-tag {
  display: inline-block;
  width: 44px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 10px;
  color: #ffffff;
  border-radius: 12px;
  background: #ccc;
}
</style>