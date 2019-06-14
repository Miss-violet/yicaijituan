const path = require('path');

const { ENV } = process.env

// let proxy = {}
// switch (ENV) {
//   case 'developmenta':
//     console.info('dev')
//     proxy = {
//       "/api": {
//         "target": "http://www.linhy.cn:8090/api/",
//         "changeOrigin": true,
//         "pathRewrite": {
//           "^/api": ""
//         }
//       }
//     }
//     break
//   case 'qa':
//     console.info('qa')
//     proxy = {
//       "/api": {
//         "target": "http://www.linhy.cn:8090/api/",
//         "changeOrigin": true,
//         "pathRewrite": {
//           "^/api": ""
//         }
//       }
//     }
//     break
//   case 'production':
//     proxy = {
//       "/api": {
//         "target": "http://www.yicaijituan.cn:8090/api/",
//         "changeOrigin": true,
//         "pathRewrite": {
//           "^/api": ""
//         }
//       }
//     }
//     break
//   default:
//     proxy = {}
//     break
// }

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
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
    "/api": {
      "target": "http://www.linhy.cn:8090/api/",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  },
};
