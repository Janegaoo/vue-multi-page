'use strict'
// 此文件是在node环境中运行的，使用webpack的nodejsAPI实现自定义构建和开发流程的
// npm和node版本检查，请看我的check-versions配置文件解释文章
require('./check-versions')()
// 设置环境变量为production
process.env.NODE_ENV = 'production'
// ora是一个命令行转圈圈动画插件，好看用的
const ora = require('ora')
// rimraf插件是用来执行UNIX命令rm和-rf的用来删除文件夹和文件，清空旧的文件
const rm = require('rimraf')
// node.js路径模块
const path = require('path')
// chalk插件，用来在命令行中输入不同颜色的文字
const chalk = require('chalk')
// 引入webpack模块使用内置插件和webpack方法
const webpack = require('webpack')
// 引入config下的index.js配置文件，主要配置的是一些通用的选项
const config = require('../config')
// 下面是生产模式的webpack配置文件
const webpackConfig = require('./webpack.prod.conf')

//作用是把每个模块分类打包到各自的目录下，不做处理的话，会统一打包到dist，static下
const fsCopy = require('fs-sync')
const pagePath = path.resolve(__dirname,'../src/pages')
const distPath = path.resolve(__dirname,'../dist')
const glob = require('glob')
const modulesDir = glob.sync(pagePath + '/*')
const zipper = require('zip-local')

// 开启转圈圈动画
const spinner = ora('building for production...')
spinner.start()

// 调用rm方法，第一个参数的结果就是 dist/static，表示删除这个路径下面的所有文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  // 如果删除的过程中出现错误，就抛出这个错误，同时程序终止
  if (err) throw err
  // 没有错误，就执行webpack编译
  webpack(webpackConfig, (err, stats) => {
    // 这个回调函数是webpack编译过程中执行
    spinner.stop()
    if (err) throw err
    // 没有错误就执行下面的代码，process.stdout.write和console.log类似，输出对象
    process.stdout.write(stats.toString({
      // stats对象中保存着编译过程中的各种消息
      colors: true,// 增加控制台颜色开关
      modules: false,// 不增加内置模块信息
      // 不增加子级信息
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,// 允许较少的输出
      chunkModules: false// 不将内置模块的信息加到包信息
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    //作用是把每个模块分类打包到各自的目录下，不做处理的话，会统一打包到dist，static下
    modulesDir.forEach((file) => {
      //console.log(file)
      let pageDir = file.split('/')[file.split('/').length-1]
      if (pageDir !== 'main.js' && pageDir !== 'App.vue') {//除了入口文件，其他文件打包移动
        fsCopy.copy(path.resolve(__dirname,'../dist/static'), path.resolve(__dirname, `../dist/${pageDir}/static`))
        glob.sync(distPath + `/${pageDir}/static/js/*`).forEach((file) => {
          var fileName = file.split('/')[file.split('/').length-1].split('.')[0]
          if (fileName != 'manifest' && fileName != 'vendor' && fileName != pageDir && !fileName.match(/^\d+$/)) {
            fsCopy.remove(file)
          }
        })
        glob.sync(distPath + `/${pageDir}/static/css/*`).forEach((file) => {
          var fileName = file.split('/')[file.split('/').length-1].split('.')[0]
          if (fileName != pageDir) {
              fsCopy.remove(file);
          }
        })
        fsCopy.copy(distPath + `/${pageDir}/`, distPath + `/zip/${pageDir}/${pageDir}/`)
        //压缩文件
        zipper.sync.zip(distPath + `/zip/${pageDir}`).compress().save(distPath + `/${pageDir}.zip`) 
      }
      
    })
    //fsCopy.remove(path.resolve(__dirname,'../dist/static'))
    //fsCopy.remove(path.resolve(__dirname,'../dist/index'))
    fsCopy.remove(path.resolve(__dirname,'../dist/zip'))
    //fsCopy.remove(path.resolve(__dirname,'../dist/index.zip'))

    // 以上就是在编译过程中，持续打印消息
    // 下面是编译成功的消息
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
// end 
// 注: 如果你想自己编写一个高质量的脚手架工具，建议你: 
// 去补习nodejs，然后补习 es6，然后再来看webpack官方文档，然后自己独立编写一个和vue-cli类似的脚手架，
//如果上面的东西看不懂，更要这样做
// vue-cli还有一部分内容是关于代码测试的，可以说这块内容的复杂度不亚于webpack，
//这些内容对nodejs要求比较熟悉，说白了就是基础弱的很难入门，但是测试这块内容也是非常有价值的，
//可以借助无界面的浏览器解析引擎，通过一句命令就可以把你的代码在不同的平台上运行，还能指出问题所在，
//所以，我会渐渐的转战nodejs去了，后续的文章将很多是关于nodejs的文章，如果感兴趣的可以关注我的文章，
//一起学习探讨