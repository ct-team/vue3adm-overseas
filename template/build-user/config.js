module.exports = {
  checkAppId: '',
  appVersion: '1.0.0', // 项目版本

  px2rem: {
    // rootValue: 100, // 换算的基数
    // selectorBlackList: ['van-'], // 忽略转换正则匹配项 ['van-']
    // propList: ['*'],
  },
  globalSass: '', //向全局sass样式传入共享的全局变量 如`@import "~@/assets/scss/index.scss";`
  isFile: false, //是否使用文件夹
  showPage: [], //["weixin", "sdw"]
  devServer: {
    //host: 'localhost',
    disableHostCheck: true,
    port: 1506, // 端口号
    https: false,
    open: true, // 配置自动启动浏览器
    openPage: 'index.html',
    // 配置多个代理
    proxy: {
      '/api/Ydmalladm': {
        target: 'http://yapi.tcy365.org:3000/mock/1554/', // 本地模拟数据服务器
        changeOrigin: true,
        //logLevel: 'debug', //是否输出请求log
        pathRewrite: {
          '^/api/Ydmalladm/': '/api/',
        },
      },
      //   '/api/Ydmalladm': {
      //     target: 'http://site.admin.ct108.org:1507/', // 本地模拟数据服务器
      //     changeOrigin: true,
      //     logLevel: 'debug', //是否输出请求log
      //   },
    },
  },
};
