'use strict'
const path = require('path')
// 下面是utils工具配置文件，主要用来处理css类文件的loader
const utils = require('./utils')
// 下面引入webpack，来使用webpack内置插件
const webpack = require('webpack')
// 下面是config目录下的index.js配置文件，主要用来定义了生产和开发环境的相关基础配置
const config = require('../config')
// 下面是webpack的merger插件，主要用来处理配置对象合并的，
//可以将一个大的配置对象拆分成几个小的，合并，相同的项将覆盖
const merge = require('webpack-merge')
// 下面是webpack.base.conf.js配置文件，我其他博客文章已经解释过了，用来处理不同类型文件的loader
const baseWebpackConfig = require('./webpack.base.conf')
// copy-webpack-plugin使用来复制文件或者文件夹到指定的目录的
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html-webpack-plugin是生成html文件，可以设置模板，之前的文章将过了
const HtmlWebpackPlugin = require('html-webpack-plugin')
// extract-text-webpack-plugin这个插件是用来将bundle中的css等文件产出单独的bundle文件的，之前也详细讲过
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin插件的作用是压缩css代码的，
//还能去掉extract-text-webpack-plugin插件抽离文件产生的重复代码，
//因为同一个css可能在多个模块中出现所以会导致重复代码，换句话说这两个插件是两兄弟
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//压缩js代码。
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//设置为生产环境production
//merge方法合并模块对象，在这个文件里是将基础配置webpack.base.conf.js和生产环境配置合并
const env = require('../config/prod.env')
//merge方法合并模块对象，在这个文件里是将基础配置webpack.base.conf.js和生产环境配置合并
const webpackConfig = merge(baseWebpackConfig, {
  module: {//模块配置
    //原版注释Generate loaders for standalone style files (outside of .vue)生成独立的样式文件装载机
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,//设置sourceMap
      extract: true,
      usePostCSS: true
    })
  },
  // devtool开发工具，用来生成个sourcemap方便调试
  // 按理说这里不用生成sourcemap多次一举，这里生成了source-map类型的map文件，只用于生产环境
  devtool: config.build.productionSourceMap ? config.build.devtool : false,//指定是否使用sourceMap
  output: {//指定输出
    // 打包后的文件放在dist目录里面
    path: config.build.assetsRoot,
    // 文件名称使用 static/js/[name].[chunkhash].js, 其中name就是main,chunkhash就是模块的hash值，用于浏览器缓存的
    filename: utils.assetsPath('js/[name].[chunkhash].js'),//编译输出的js文件存放在js文件夹下，命名规则添加hash计算
    /**
     * 打包require.ensure方法中引入的模块，如果该方法中没有引入任何模块则不会生成任何chunk块文件
     *
     * 比如在main.js文件中,require.ensure([],function(require){alert(11);}),这样不会打包块文件
     * 只有这样才会打包生成块文件require.ensure([],function(require){alert(11);require('./greeter')})
     * 或者这样require.ensure(['./greeter'],function(require){alert(11);})
     * chunk的hash值只有在require.ensure中引入的模块发生变化,hash值才会改变
     * 注意:对于不是在ensure方法中引入的模块,此属性不会生效,只能用CommonsChunkPlugin插件来提取
     */
     // chunkFilename是非入口模块文件，也就是说filename文件中引用了chunckFilename
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 下面是利用DefinePlugin插件，定义process.env环境变量为env
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({//压缩js代码的插件  具体可以去npm查一下这个插件怎么用以及能设置哪些参数
      uglifyOptions: {
        compress: {
          warnings: false,// 禁止压缩时候的警告信息，给用户一种vue高大上没有错误的感觉
          drop_debugger: true,  
          drop_console: true 
        }
      },
      sourceMap: config.build.productionSourceMap,//是否生成sourceMap
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // 生成独立的css文件，下面是生成独立css文件的名称
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    /*optimize-css-assets-webpack-plugin插件
    在生产环境中使用extract-text-webpack-plugin，最好也使用这个插件
    使用方法如下
    安装 npm install --save-dev optimize-css-assets-webpack-plugin
    还要安装 cssnano 这是一个css编译器 npm install --save-dev cssnano 这个vue-cli脚手架并没有使用cssnano，但是这个插件的官方说要安装cssnano，这是不是一个bug??
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g, // 不写默认是/\.css$/g
        cssProcessor: require('cssnano'), // 编译器选项，不写默认是cssnano，所以使用这个插件不管怎样都要cssnano
        cssProcessorOptions: { discardComments: {removeAll: true } }, // 传递给编译器的参数
        canPrint: true // 是否能够输出信息
    })*/
    new OptimizeCSSPlugin({
      // 压缩css文件
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
     // 生成html页面
    /*new HtmlWebpackPlugin({
      //非测试环境生成index.html
      filename: config.build.index,
      template: 'index.html',
      // 将js文件放到body标签的结尾
      inject: true,
      minify: {
        // 压缩产出后的html页面
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 分类要插到html页面的模块
      chunksSortMode: 'dependency'
    }),*/
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 下面的插件是将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序的运行速度
    new webpack.optimize.CommonsChunkPlugin({
      // common 模块的名称
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        // 将所有依赖于node_modules下面文件打包到vendor中
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 把webpack的runtime代码和module manifest代码提取到manifest文件中，防止修改了代码但是没有
    //修改第三方库文件导致第三方库文件也打包的问题
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // 下面是复制文件的插件，我认为在这里并不是起到复制文件的作用，而是过滤掉打包过程中产生的以.开头的文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    //
    // 使用 promise 作为分割点
    // 需要使用相应的插件LimitChunkCountPlugin ==== 会注意到有一些很小的 chunk - 这产生了大量 HTTP 
    // 请求开销。幸运的是，此插件可以通过合并的方式，后处理你的 chunk，以减少请求数。
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5, // Must be greater than or equal to one
      minChunkSize: 1000
    })

  ].concat(utils.prodHttpPlugins())
})

// 开启Gzi压缩打包后的文件，老铁们知道这个为什么还能压缩吗？？，就跟你打包压缩包一样，把这个压缩包
//给浏览器，浏览器自动解压的
// 你要知道，vue-cli默认将这个神奇的功能禁用掉的，理由是Surge 和 Netlify 静态主机默认帮你把上传的文
//件gzip了
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(// 这里是把js和css文件压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  // 打包编译后的文件打印出详细的文件信息，vue-cli默认把这个禁用了，个人觉得还是有点用的，可以自行配置
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
