const CracoAntDesignPlugin = require('craco-antd')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = {
  // webpack: {
  //   plugins: [
  //     new AntdDayjsWebpackPlugin()
  //   ]
  // },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          'primary-color': '#7A92CC',
          'table-header-bg': '#f5f6fa',
          'table-header-sort-active-bg': '#f5f6fa',
          'table-header-color': '#999999',
          'table-row-hover-bg': '#f7f7fa',
          'table-padding-horizontal-md': '16px'
        }
      }
    }
  ]
}
