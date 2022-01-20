/*
 * @Description: 项目主函数入口
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 10:08:43
 * @LastEditTime: 2022-01-20 17:04:25
 * @LastEditors: yang.xiaolong
 */
import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BootState from './states/boot-state'
import PreloadState from './states/preload-state'
import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('BootState', BootState)
    this.state.add('PreloadState', PreloadState)

    this.state.start('BootState')
  }
}

window.game = new Game()
