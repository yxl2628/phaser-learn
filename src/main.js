/*
 * @Description: 项目主函数入口
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 10:08:43
 * @LastEditTime: 2022-01-21 10:42:53
 * @LastEditors: yang.xiaolong
 */
import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BootState from './states/boot-state'
import PreloadState from './states/preload-state'
import NavState from './states/nav-state'
import GameState from './states/game-state'
import HistoryState from './states/history-state'
import { getWH } from './utils'

class Game extends Phaser.Game {
  constructor () {
    const { width, height } = getWH()

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('BootState', BootState)
    this.state.add('PreloadState', PreloadState)
    this.state.add('NavState', NavState)
    this.state.add('GameState', GameState)
    this.state.add('HistoryState', HistoryState)

    this.state.start('BootState')
  }
}

window.game = new Game()
