/*
 * @Description: 导航页面
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 10:08:43
 * @LastEditTime: 2022-01-21 10:26:29
 * @LastEditors: yang.xiaolong
 */
import Phaser from 'phaser'
import { getWH } from '../utils'

export default class NavState extends Phaser.State {
  init () {
    console.log('导航页面')
  }
  preload () {
    // 没有资源加载的话，这里不用写，真正的方法都写在create中
  }
  create () {
    const { width, height } = getWH()
    // 创建背景图片，背景图片宽高设置成屏幕可用宽高
    const bgpreloadImg = this.game.add.image(0, 0, 'bgnav')
    bgpreloadImg.width = width
    bgpreloadImg.height = height

    // 第一个文字按钮，并添加点击事件，跳转到GameState
    const playText = this.game.add.text(width / 2 + 5, height / 2 + 33, '弹奏吧', {
      font: '22px',
      fill: '#000000',
      align: 'center'
    })
    playText.anchor.set(0.5, 0.5)
    // 让文字可点击
    playText.inputEnabled = true
    playText.events.onInputUp.add(() => {
      console.log('跳转游戏页面')
      this.game.state.start('GameState')
    })

    // 第一个文字按钮，并添加点击事件，跳转到HistoryState
    // \n用来换行
    const historyText = this.game.add.text(82, height / 2 + 80, '我\n的\n记\n录', {
      font: '20px',
      fill: '#000000',
      align: 'center',
      stroke: '#ffffff',
      strokeThickness: 3
    })
    historyText.anchor.set(0.5, 0.5)
    // 让文字可点击
    historyText.inputEnabled = true
    historyText.events.onInputUp.add(() => {
      console.log('跳转我的记录')
      this.game.state.start('HistoryState')
    })
  }
  update () {}
}
