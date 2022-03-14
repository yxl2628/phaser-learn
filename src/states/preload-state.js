/*
 * @Description: 资源预加载的loading页面
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 16:48:32
 * @LastEditTime: 2022-03-14 17:28:10
 * @LastEditors: yang.xiaolong
 */
import Phaser from 'phaser'
import { fieLoadFunc, getWH } from '../utils'

export default class PreloadState extends Phaser.State {
  init () {
    console.log('资源预加载loading')
  }
  preload () {
    // 加载资源
    this.loadAssets()
    // 加载资源的动画
    this.loadProgress()
  }
  create () {
    this.game.state.start('NavState')
  }
  update () {}
  // 加载资源
  loadAssets () {
    this.game.load.image('bgnav', 'assets/images/bgnav.png')
    this.game.load.image('bgsongname', 'assets/images/bgsongname.png')

    this.game.load.image('bggame', 'assets/images/bggame.jpg')
    this.game.load.image('listhead', 'assets/images/listhead.png')
    this.game.load.image('backw', 'assets/images/backw.png')
    this.game.load.image('restart', 'assets/images/restart.png')
    this.game.load.image('save', 'assets/images/save.png')

    this.game.load.image('tanceng', 'assets/images/tanceng.png')
    this.game.load.image('listen', 'assets/images/listen.png')
    this.game.load.image('button', 'assets/images/button.png')
    this.game.load.image('buttonlan', 'assets/images/buttonlan.png')
    this.game.load.image('back', 'assets/images/back.png')
    this.game.load.image('btnhui', 'assets/images/btnhui.png')

    this.game.load.audio('a0', 'assets/audio/0/a0.mp3')
    this.game.load.audio('b0', 'assets/audio/0/b0.mp3')
    this.game.load.audio('lb0', 'assets/audio/0/lb0.mp3')

    const songArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'hc', 'hf', 'la', 'lb', 'le']
    for (let i = 1; i < 8; i++) {
      songArray.forEach(song => {
        this.game.load.audio(`${song}${i}`, `assets/audio/${i}/${song}${i}.mp3`)
      })
    }

    this.game.load.audio('c8', 'assets/audio/8/c8.mp3')

    fieLoadFunc(this.game, (progress) => {
      // 根据进度计算进度条遮罩的矩形的宽度
      const currentWidth = progress / 100 * this.progressImg.width
      this.maskGraphics.clear()
      // 时时创建当前宽度的举行遮罩
      this.maskGraphics.beginFill(0xffffff)
      // 画一个矩形，长宽和进度条一致，位置是-50%, -50%
      this.maskGraphics.drawRect(-this.progressImg.width / 2, -this.progressImg.height / 2, currentWidth, this.progressImg.height)
      this.maskGraphics.endFill()
    })
  }
  // 加载动画
  loadProgress () {
    // 设置背景图
    const { width, height } = getWH()
    const bgpreloadImg = this.game.add.image(0, 0, 'bgpreload')
    bgpreloadImg.width = width
    bgpreloadImg.height = height

    // 设置loading动画
    // 先设置一个group组
    const snailGroup = this.game.add.group()
    // 让group组居中
    snailGroup.position.set(width / 2, height / 2)

    // 进度条
    const progressImg = this.game.add.image(0, 0, 'progress', null, snailGroup)
    // 设置进度条的中心点为图片中心，而不是图片左上角（默认为左上角）
    progressImg.anchor.set(0.5, 0.5)
    // 让进度条显示为屏幕宽度的70%
    const progressImgScale = width * 0.7 / progressImg.width
    progressImg.scale.set(progressImgScale, progressImgScale)

    // 通过遮罩的功能来做进度条的进度
    const maskGraphics = this.game.add.graphics(0, 0, snailGroup)
    // 必须要给一个填充色，才能生效
    maskGraphics.beginFill(0xffffff)
    // 画一个矩形，长宽和进度条一致，位置是-50%, -50%
    maskGraphics.drawRect(-progressImg.width / 2, -progressImg.height / 2, progressImg.width, progressImg.height)
    maskGraphics.endFill()
    // 让这个矩形成为进度条的遮罩
    progressImg.mask = maskGraphics
    // 给当前对象赋值，方便progress进度调用
    this.progressImg = progressImg
    this.maskGraphics = maskGraphics

    // 小蜗牛
    const snailImg = this.game.add.image(0, -progressImg.height / 2, 'snail', null, snailGroup)
    // 设置小蜗牛的中心点在中下方
    snailImg.anchor.set(0.5, 1)
    // 同样让小蜗牛也缩放为宽度的70
    snailImg.scale.set(progressImgScale, progressImgScale)

    // loading文字
    const loadingImg = this.game.add.image(-15, progressImg.height / 2 + 10, 'loading', null, snailGroup)
    // 设置loading文字的中心点在中上方
    loadingImg.anchor.set(0.5, 0)
    // 同样让loading文字也缩放为宽度的70
    loadingImg.scale.set(progressImgScale, progressImgScale)

    // 设置动画
    // 先让小蜗牛上下移动
    this.game.add.tween(snailImg).to({ y: -progressImg.height / 2 - 15 }, 800, 'Linear', true, 0, -1, true)
    // 再让loading文字左右移动
    this.game.add.tween(loadingImg).to({ x: 15 }, 800, 'Linear', true, 0, -1, true)

    // 设置版权信息
    const developInfoGroup = this.game.add.group()
    // 添加logo
    const logoImg = this.game.add.image(0, 0, 'logo', null, developInfoGroup)
    logoImg.width = 35
    logoImg.height = 35
    this.game.add.text(40, 8, '钢琴方块，根据天天敲代码的课程学习而来', {
      font: '14px',
      fill: '#ffffff',
      align: 'center'
    }, developInfoGroup)

    // 此时版权信息不居中，可以把这个组生成一个图片资源，然后再把这个图片资源居中，会相对容易
    const developInfoTexture = developInfoGroup.generateTexture()
    // 设置这个图片居中，同时距离底部5px
    const developInfoTextureImg = this.game.add.image(width / 2, height - 5, developInfoTexture)
    // 让这个图片的中心点在中下方
    developInfoTextureImg.anchor.set(0.5, 1)
    // 最后销毁版权信息group，防止重复显示
    developInfoGroup.destroy()
  }
}
