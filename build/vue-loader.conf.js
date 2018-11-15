'use strict'
// utils配置文件用来解决css相关文件loader
const utils = require('./utils')
// 生产和开发环境的相关属性
const config = require('../config')
// 判断当前是否生产环境
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  // 调用utils配置文件中的cssLoaders方法，用来返回配置好的css-loader和vue-style-loader
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,// 这一句话表示如何生成map文
    extract: isProduction// 这一项是自定义配置项，设置为true表示生成单独样式文件
  }),
  cssSourceMap: sourceMapEnabled, 
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
