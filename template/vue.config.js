const buildConfig = require('./build-user/config.js');
const buildTool = require('./build-user/tool.js');
// const buildCopy = require('./build-user/copy.js');
const currEnv = process.env.NODE_ENV;

const IS_PROD = currEnv !== 'development';
const env = process.env.env;

// let BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
function getPublicPath() {
  if (!IS_PROD) {
    return '/';
  }
  return './';
}
module.exports = {
  //lintOnSave: true,
  pages: buildTool.getPages(env),
  publicPath: getPublicPath(),
  outputDir: 'dist',
  assetsDir: 'assets',
  productionSourceMap: false,
  css: {
    extract: IS_PROD, // 允许生成 CSS source maps?
    sourceMap: false, // pass custom options to pre-processor loaders. e.g. to pass options to // sass-loader, use { sass: { ... } }
    //requireModuleExtension: false,
  },
  // 所有 webpack-dev-server 的选项都支持。
  devServer: buildConfig.devServer,
  chainWebpack: (config) => {
    // 添加分析工具
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
          openAnalyzer: false,
        },
      ]);
  },
  configureWebpack: (config) => {
    if (IS_PROD) {
      config.devtool = 'source-map';

      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        'element-plus': 'ElementPlus',
        '@element-plus/icons-vue': 'ElementPlusIconsVue',
      };

      //   config.plugins.push({
      //     apply: (compilation) => {
      //       compilation.hooks.done.tap('succeedModule', () => {
      //         buildCopy.init(env);
      //       });
      //     },
      //   });
      //   config.plugins = [
      //     new BundleAnalyzerPlugin({
      //       analyzerMode: 'static', //可选值有server static disabled
      //       generateStatsFile: false,
      //       statsOptions: { source: false },
      //       openAnalyzer: false,
      //     }),
      //   ];
    }
  },
};
