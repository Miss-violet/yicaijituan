const path = require('path');

const { NODE_ENV } = process.env

const proxy = () => {
  switch (NODE_ENV) {
    case 'development':
      return {
        "/api": {
          "target": "http://www.linhy.cn:8090/api/",
          "changeOrigin": true,
          "pathRewrite": {
            "^/api": ""
          }
        }
      }
    case 'qa':
      return {
        "/api": {
          "target": "http://www.linhy.cn:8090/api/",
          "changeOrigin": true,
          "pathRewrite": {
            "^/api": ""
          }
        }
      }
    case 'production':
      return {
        "/api": {
          "target": "http://www.yicaijituan.cn:8090/api/",
          "changeOrigin": true,
          "pathRewrite": {
            "^/api": ""
          }
        }
      }
    default:
      return {}
  }
}

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
  proxy: NODE_ENV === 'development' ? {
    "/api": {
      "target": "http://www.linhy.cn:8090/api/",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  } : {
      "/api": {
        "target": "http://www.yicaijituan.cn:8090/api/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }
};
