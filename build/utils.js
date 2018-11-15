'use strict'
// 引入nodejs路径模块
const path = require('path')
// 引入config目录下的index.js配置文件
const config = require('../config')
// 引入extract-text-webpack-plugin插件，用来将css提取到单独的css文件中
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

//多入口需要
// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
var glob = require('glob')
// 页面模板
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
var PAGE_PATH = path.resolve(__dirname, '../src/pages')
// 用于做相应的merge处理
var merge = require('webpack-merge')

const modulesDir = glob.sync(PAGE_PATH + '/*')

//多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function() {
    // var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    // var map = {}
    // entryFiles.forEach((filePath) => {
    //     var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    //     map[filename] = filePath
    // })
    // return map
    let entries = {};
    modulesDir.forEach((file) => {
      const pageDir = file.split('/')[file.split('/').length-1]
      if (pageDir !== 'main.js' && pageDir !== 'App.vue') {
        entries[pageDir] = `./src/pages/${pageDir}/index.js`
      } else {
        entries['app'] = './src/pages/main.js'
      }
      
    })

    return entries
}

//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function() {
    let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
    let arr = []
    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            // 模板来源
            template: filePath,
            // 文件名称
            filename: filename + '.html',
            // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
            chunks: ['manifest', 'vendor', filename],
            inject: true
        }
        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            })
        }
        arr.push(new HtmlWebpackPlugin(conf))
    })
    return arr
}

exports.devHttpPlugins = function () {
  let devHttpPlugin = []
  modulesDir.forEach((file) => {
    const pageDir = file.split('/')[file.split('/').length-1]
    /*let httpP = new HtmlWebpackPlugin({
      //filename: pageDir + '.html',
      filename: (pageDir !== 'main.js' && pageDir !== 'App.vue')
                ? `${pageDir}/index.html` //修改这个的目的是为了a标签跳转路径和dist下一致
                : 'index.html',
      template: 'index.html',
      chunks: [pageDir],
      inject: true
    })
    devHttpPlugin.push(httpP)*/

    if (pageDir !== 'main.js' && pageDir !== 'App.vue') {
      let httpP = new HtmlWebpackPlugin({
        //filename: pageDir + '.html',
        filename: `${pageDir}/index.html`,
        template: 'index.html',
        chunks: [pageDir],
        inject: true
      })
      devHttpPlugin.push(httpP)
    } else {
      let httpP = new HtmlWebpackPlugin({
        filename: 'index.html', // 生成的文件的名称
        template: 'index.html',//可以指定模块html文件
        chunks: ['app'],
        // 设置为true或body将js代码加到<body>元素结束前
        // 设置为head将js代码加到<head>里面
        // 设置为false所有静态资源css和JavaScript都不会注入到模板文件中
        inject: true
      })
      devHttpPlugin.push(httpP)
    }


  })
  return devHttpPlugin
}

exports.prodHttpPlugins = function () {
  let prodHttpPlugin = []
  modulesDir.forEach((file) => {
    const pageDir = file.split('/')[file.split('/').length-1]
    
    /*let httpP = new HtmlWebpackPlugin({
      filename: (pageDir !== 'main.js' && pageDir !== 'App.vue')
                ? process.env.NODE_ENV === 'testing'
                    ? 'index.html'
                    : path.resolve(__dirname, `../dist/${pageDir}/index.html`)
                : config.build.index,
      template: 'index.html',
      chunks: ['manifest', 'vendor', pageDir],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    })
    prodHttpPlugin.push(httpP)*/

    if (pageDir !== 'main.js' && pageDir !== 'App.vue') {
      let httpP = new HtmlWebpackPlugin({
        filename: process.env.NODE_ENV === 'testing'
          ? 'index.html'
          : path.resolve(__dirname, `../dist/${pageDir}/index.html`),
        template: 'index.html',
        chunks: ['manifest', 'vendor', pageDir],
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
      prodHttpPlugin.push(httpP)
    } else {
      //console.log(pageDir)
      let httpP = new HtmlWebpackPlugin({
        //非测试环境生成index.html
        filename: config.build.index,
        template: 'index.html',
        chunks: ['manifest', 'vendor', 'app'],
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
      })
      prodHttpPlugin.push(httpP)
    }
    
  })

  return prodHttpPlugin
}

/*exports.prodCopyPlugins = function () {
  let prodCopyPlugin = []
  modulesDir.forEach((file) => {
    const pageDir = file.split('/')[file.split('/').length-1]
    let copyP = new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: `${pageDir}`,
        ignore: ['.*']
      }
    ])
    prodCopyPlugin.push(copyP)
  })
  return prodCopyPlugin
}*/

// exports其实就是一个对象，用来导出方法的最终还是使用module.exports，此处导出assetsPath
exports.assetsPath = function (_path) {
  // 如果是生产环境assetsSubDirectory就是'static'，否则还是'static'，哈哈哈
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
// path.join和path.posix.join的区别就是，前者返回的是完整的路径，后者返回的是完整路径的相对根路径
// 也就是说path.join的路径是C:a/a/b/xiangmu/b，那么path.posix.join就是b
  return path.posix.join(assetsSubDirectory, _path)
  // 所以这个方法的作用就是返回一个干净的相对根路径
}
// 下面是导出cssLoaders的相关配置
exports.cssLoaders = function (options) {
  // options如果没值就是空对象
  options = options || {}
  // cssLoader的基本配置
  const cssLoader = {
    loader: 'css-loader',
    options: {
      // 是否开启cssmap，默认是false
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    // 将上面的基础cssLoader配置放在一个数组里面
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    // 如果该函数传递了单独的loader就加到这个loaders数组里面，这个loader可能是less,sass之类的
    if (loader) {
      loaders.push({
        // 加载对应的loader
        loader: loader + '-loader',
        // Object.assign是es6的方法，主要用来合并对象的，浅拷贝
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 注意这个extract是自定义的属性，可以定义在options里面，
    //主要作用就是当配置为true就把文件单独提取，false表示不单独提取，
    //这个可以在使用的时候单独配置，瞬间觉得vue作者好牛逼
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
     // 上面这段代码就是用来返回最终读取和导入loader，来处理对应类型的文件
  }

  /*extract-text-webpack-plugin插件是用来将文本从bundle中提取到一个单独的文件中
   基本使用方法如下
   const ExtractTextPlugin = require("extract-text-webpack-plugin");
   module.exports = {
       module: {
           rules: [
               {
                   test: /\.css$/, //主要用来处理css文件
                   use: ExtractTextPlugin.extract({
                       fallback: "style-loader", // fallback表示如果css文件没有成功导入就使用style-loader导入
                       use: "css-loader" // 表示使用css-loader从js读取css文件
                   })
               }
           ],
           plugins: [
               new ExtractTextPlugin("styles.css") //表示生成styles.css文件
           ]
       }
   }*/

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),// css对应 vue-style-loader 和 css-loader
    postcss: generateLoaders(),// postcss对应 vue-style-loader 和 css-loader
    less: generateLoaders('less'),// less对应 vue-style-loader 和 less-loader
    sass: generateLoaders('sass', { indentedSyntax: true }),// sass对应 vue-style-loader 和 sass-loader
    scss: generateLoaders('sass'),// scss对应 vue-style-loader 和 sass-loader
    stylus: generateLoaders('stylus'),// stylus对应 vue-style-loader 和 stylus-loader
    styl: generateLoaders('stylus')// styl对应 vue-style-loader 和 styl-loader
  }
}

// Generate loaders for standalone style files (outside of .vue)
// Generate loaders for standalone style files (outside of .vue)
// 下面这个主要处理import这种方式导入的文件类型的打包，上面的exports.cssLoaders是为这一步服务的
exports.styleLoaders = function (options) {
  const output = []
  // 下面就是生成的各种css文件的loader对象
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    // 把每一种文件的laoder都提取出来
    const loader = loaders[extension]
     // 把最终的结果都push到output数组中，大事搞定
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
//'node-notifier'是一个跨平台系统通知的页面，当遇到错误时，它能用系统原生的推送方式给你推送信息
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

