/*
 * @Description: 加载预加载资源的loading页面
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 10:08:43
 * @LastEditTime: 2022-01-20 17:32:59
 * @LastEditors: yang.xiaolong
 */
import Phaser from 'phaser'
import { fieLoadFunc } from '../utils'

export default class BootState extends Phaser.State {
  init () {
    console.log('预加载')
  }
  preload () {
    // 在资源加载之前，先设置一个背景色，防止网络环境问题导致页面白屏
    this.game.stage.backgroundColor = '#a8d4bf'
    // 这里可以把资源放到静态资源服务器上，以减小代码体积；也可以把公共路径提取出来，下面简写
    this.game.load.baseURL = ''
    // 接下来加载资源
    this.game.load.image('bgpreload', 'assets/images/bgpreload.png')
    this.game.load.image('logo', 'assets/images/logo.png')
    // 加载动画
    this.game.load.image('loading', 'assets/images/loading.png')
    this.game.load.image('progress', 'assets/images/progress.png')
    this.game.load.image('snail', 'assets/images/snail.png')

    fieLoadFunc(this.game)
  }
  create () {
    this.game.state.start('PreloadState')
  }
  update () {}
}
