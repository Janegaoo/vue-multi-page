'use strict'
//引入当前目录下的utils.js文件模块
const utils = require('./utils')
//内置模块
const webpack = require('webpack')
//引入config目录下的index.js文件
const config = require('../config')
//进行合并对象，相同项目会进行覆盖 
const merge = require('webpack-merge')
//node的path模块
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
//一个拷贝资源的插件，后面我会介绍用法
const CopyWebpackPlugin = require('copy-webpack-plugin')
//这个插件可以自动生成html，获取在已存在的html插入css、js等
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 下面这个插件是用来把webpack的错误和日志收集起来，漂亮的展示给用户
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
//一个自动打开可用端口的包
const portfinder = require('portfinder')
//当前环境的host
const HOST = process.env.HOST
//当前环境的port
const PORT = process.env.PORT && Number(process.env.PORT)

//开发环境的配置，将这个配置文件特有的配置添加替换到base配置文件中
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // //loader的配置，具体内容可以参考utils文件
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
    // cheap-module-eval-source-map is faster for development
// devtool是开发工具选项，用来指定如何生成sourcemap文件，cheap-module-eval-source-map
// 此款soucemap文件性价比最高
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  // devServer对象：首先在开发模式下，devServer 提供虚拟服务器，让我们进行开发和调试。
  // 其次它不是 webpack 内置插件，如果没用vue-cli搭建的话是需要手动安装的。
  devServer: {
    //重新加载server时，控制台对一些错误以warning的方式提示
    clientLogLevel: 'warning',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    /*hot—热模块更新作用。即修改代码模块后，保存会自动更新，
    页面不用刷新就呈现最新的效果。这和 webpack.HotModuleReplacementPlugin （HMR） 
    这个插件是一样功能，但是HMR 这个插件是真正实现热模块更新的。而 devServer 里配置了 hot: true ,
     webpack会自动添加 HMR 插件。所以模块热更新最终还是 HMR 这个插件起的作用。*/
    hot: true,
    /*contentBase：值可以为boolean string array三种类型。你要提供哪里的内容给虚拟服务器用。
    这里最好填 绝对路径。默认情况下，它将使用当前的工作目录来提供内容。false表示
    不使用contentBase来指定，直接使用工作目录来提供内容。*/
    contentBase: false, // since we use CopyWebpackPlugin.
    //compress: 如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用。
    compress: true,
    host: HOST || config.dev.host,//host：写主机名的，默认 localhost。
    port: PORT || config.dev.port,//port: 端口号，默认 8080。
    open: config.dev.autoOpenBrowser,//open:设置为true，则启动项目时自动打开浏览器。
    //overlay：如果为 true ，在浏览器上全屏显示编译的errors或warnings。默认 false （关闭）
    overlay: config.dev.errorOverlay//
      ? { warnings: false, errors: true }
      : false,
    /*publicPath：配置了 publicPath后， url = '主机名' + 'publicPath配置的' +'原来的url.path'。
    这个其实与 output.publicPath 用法大同小异。output.publicPath 是作用于 js, css, img 。
    而devServer.publicPath 则作用于请求路径上的。
    假如配置publicPath: "/assets/"——原本路径 --> 
    变换后的路径http://localhost:8080/app.js --> http://localhost:8080/assets/app.js。*/
    publicPath: config.dev.assetsPublicPath,
    //接口的代理
    proxy: config.dev.proxyTable,
    //启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。
    //这也意味着来自 webpack 的错误或警告在控制台不可见。
    quiet: true, // necessary for FriendlyErrorsPlugin
    //watchOptions：是一组自定义的监听模式，用来监听文件是否被改动过。
    watchOptions: {
      poll: config.dev.poll,////填以毫秒为单位的数字。每隔多少时间查一下文件是否改动。不想启用也可以填false。  
    }
  },
  // DefinePlugin内置webpack插件，专门用来定义全局变量的，下面定义一个全局变量 process.env 并且值是如下
 /* 'process.env': { NODE_ENV: '"development"' }
 这样的形式会被自动转为 'process.env': '"development"' 
各位骚年看好了，development如果不加双引号就当做变量处理，程序会报错 */
// plugins：以数组形式包住一个个 plugin 实例。每个插件实例是一个具有 apply 属性的 js 对象，
// 每个插件都有自身 options（配置）。plugins里面的常见插件：HotModuleReplacementPlugin是
// 热模块更换（HMR） 。在应用程序运行时交换，添加或删除模块，而无需完全重新加载。NoEmitOnErrorsPlugin
// 作用：跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。HtmlWebpackPlugin --第三方插件，
// 根据你提供的 html 模板 生成 html。DefinePlugin：它的作用是定义全局常量，是常量。在模块用它定义的
// 全局常量，那么你就不能改变它的值.
  plugins: [
  //DefinePlugin它的作用是定义全局常量，是常量。在模块用它定义的全局常量，那么你
  //就不能改变它的值.
  ////DefinePlugin 允许创建一个在编译时可以配置的全局常量。这里生成了一个当前环境的常量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
   //该插件可以使页面有更新时重绘变更的模块，不会重加载整个页面,在应用程序运行时交换，
   //添加或删除模块，而无需完全重新加载
    new webpack.HotModuleReplacementPlugin(),
    //当开启 HMR 的时候使用该插件会显示模块的相对路径
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),//跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
    // https://github.com/ampedandwired/html-webpack-plugin
    //html-webpack-plugin插件是用来生成html文件的，有很灵活的配置项，下面是基本的一些用法
    /*new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的文件的名称
      template: 'index.html',//可以指定模块html文件
      // 设置为true或body将js代码加到<body>元素结束前
      // 设置为head将js代码加到<head>里面
      // 设置为false所有静态资源css和JavaScript都不会注入到模板文件中
      inject: true
    }),*/
    // copy custom static assets
    // 复制到自定义静态源
    //将static的内容拷贝到开发路径，忽略这个文件夹下“.XX”的文件
    new CopyWebpackPlugin([
      {
        // 来自那里(可以是对象，可以是String)
        from: path.resolve(__dirname, '../static'),
        // 走向那里(可以是对象，可以是String)
        to: config.dev.assetsSubDirectory,
        // 忽略此类文件
        ignore: ['.*']
      }
    ])
  ].concat(utils.devHttpPlugins())
})
//webpack将运行由配置文件导出的函数，并且等待promise返回，便于需要异步地加载所需的配置变量。
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      // 发布新的端口，这是e2e测试所必需的
      process.env.PORT = port
      // add port to devServer config
      // 添加开发服务器到端口地址
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({//出错友好处理插件
        compilationSuccessInfo: {//build成功的话会执行此块
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors//如果出错就执行这块,其实是utils里面配置好的提示信息
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
