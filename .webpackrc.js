const path = require('path');

const { ENV } = process.env;

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    // '@':path.resolve(__dirname, 'src')
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  proxy: {
    '/api': {
      target: 'http://www.yicaijituan.cn:8090/api/',
      // "target": "http://119.23.210.125:8090/api/",
      // target: 'http://test.linhy.cn:8090/api/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
};
