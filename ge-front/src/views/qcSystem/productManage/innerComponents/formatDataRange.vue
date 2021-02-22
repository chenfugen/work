/*
*
*   created By Xu Peng
*
*/
<script>
const TYPE_MAP = {
  'int': createNumTypeTemplate,
  'float': createNumTypeTemplate,
  'double': createNumTypeTemplate,
  'text': createTextTypeTemplate,
  'enum': createEnumTypeTemplate,
  'bool': createEnumTypeTemplate,
  'array': createArrayTypeTemplate,
  'struct': createArrayTypeTemplate,
}
export default {
  props: {
    data: {
      type: [Object, Array, null]
    },
    type: String,
  },
  data () {
    return {
    };
  },
  render() {
    return (
      this.type ? (
        <div class="range-contianer">
          <div style="line-height:2;">取值范围：</div>
          <div>
            { 
              this.data ? TYPE_MAP[this.type](this.data, this.$createElement) : void 0 
            }
          </div>
        </div>
      ) : void 0
    )
  },
}
// 需要将this.$createElement传入，否则函数内无法取得h函数生成render函数
function createNumTypeTemplate(data, h) {
  const min = `最小值: ${data.min}`
  const max = `最大值: ${data.max}`
  const step = `步长: ${data.step}`
  const unit = `单位: ${data.unit}`
  return (
    <p>
      { min },
      { max },
      { data.step ? step : void 0 },
      { data.unit ? unit : void 0}
    </p>
  )
};
function createTextTypeTemplate(data, h) {
  return (
    <p>字符串长度：0 - {data.length}</p>
  )
};
function createEnumTypeTemplate(data, h) {
  const keys = Object.keys(data)
  let str = ''
  keys.forEach((e) => {
    str += `${e}：${data[e]}, `
  })
  return (
    <p>{ str }</p>
  )
};
function createArrayTypeTemplate(data, h) {
  return data.map((e) => {
    return (
      <p>
        <span style="color:#000;">{ e.propertyName }:</span>
        { TYPE_MAP[e.dataType](e.dataRange, h) } 
      </p>
    )
  })
};
</script>
<style lang='less'>
.range-contianer {
  display: flex;
  font-size: 14px;
}
</style>