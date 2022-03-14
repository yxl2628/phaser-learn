/*
 * @Description: 游戏主界面
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 10:08:43
 * @LastEditTime: 2022-03-14 18:44:33
 * @LastEditors: yang.xiaolong
 */
import Phaser from 'phaser'
import allMusic from '../music'
import { getWH } from '../utils'
import soundSeek from '../utils/soundSeek'

const { width, height } = getWH()
const baseHeight = 150
export default class BootState extends Phaser.State {
  init() {
    console.log('游戏主界面')
    this.currentMusic = allMusic[0]
    this.currentColumnIndex = 0
  }
  preload() {}
  create() {
    // 创建背景
    this.createBackGround()
    // 创建琴键和歌曲提示
    this.createKeyAndTips()
    // 创建弹层
    this.createCover()
    // 置顶得分
    this.world.bringToTop(this.scoreText)
  }
  update() {
    // 让琴键动起来
    this.keyArray.forEach(item => {
      item.y = item.y + 1
    })
  }
  // 创建背景
  createBackGround() {
    const bgPreloadImg = this.game.add.image(0, 0, 'bggame')
    bgPreloadImg.width = width
    bgPreloadImg.height = height

    const lineGraphics = this.game.add.graphics(0, 0)
    lineGraphics.lineStyle(1, 0xffffff, 1)

    lineGraphics.moveTo(width / 4, 0)
    lineGraphics.lineTo(width / 4, height)

    lineGraphics.moveTo(width / 4 * 2, 0)
    lineGraphics.lineTo(width / 4 * 2, height)

    lineGraphics.moveTo(width / 4 * 3, 0)
    lineGraphics.lineTo(width / 4 * 3, height)

    // 创建得分
    this.scoreText = this.game.add.text(width - 100, 55, '得分：0', {
      font: '22px',
      fill: '#fa804d',
      align: 'center'
    })
    // 得分先隐藏
    this.scoreText.exists = false
  }
  // 创建琴键和歌曲提示
  createKeyAndTips() {
    // 创建开始按钮
    const beginGraphics = this.game.add.graphics(0, 0)
    beginGraphics.beginFill(0x8156e0)
    beginGraphics.drawRect(0, 0, width / 4, baseHeight)

    const beginImg = this.game.add.image(0, height - baseHeight * 2, beginGraphics.generateTexture())

    // 给开始按钮添加事件
    beginImg.inputEnabled = true
    beginImg.events.onInputUp.add(() => {
      // 销毁歌曲名称
      this.songNameGroup.destroy()
      // 显示得分
      this.scoreText.exists = true
      // 琴键改为可点击
      this.keyGroup.setAll('inputEnabled', true)
      // 开始按钮隐藏
      beginImg.exists = false
    })

    const beginText = this.game.add.text(width / 8, baseHeight / 2, '开始', {
      font: '40px',
      fill: '#fc92e',
      align: 'center'
    })
    beginText.anchor.set(0.5, 0.5)
    beginImg.addChild(beginText)
    beginGraphics.destroy()

    // 创建琴键
    const keyArray = []
    this.keyArray = keyArray
    const keyGroup = this.game.add.group()
    this.keyGroup = keyGroup
    const musics = this.currentMusic.music
    for (let i = 0; i < musics.length; i++) {
      const keyInfo = musics[i]
      const keyHeight = baseHeight * keyInfo.length * 2
      const keyGraphics = this.game.add.graphics(0, 0)
      keyGraphics.beginFill(0x036ed6)
      keyGraphics.drawRect(0, 0, width / 4, keyHeight)

      let keyY = 0
      if (keyArray.length === 0) {
        keyY = beginImg.y - keyHeight
      } else {
        keyY = keyArray[keyArray.length - 1].y - keyHeight
      }
      let columnIndex = this.game.rnd.integerInRange(0, 400) % 4
      if (columnIndex === this.currentColumnIndex) {
        columnIndex = (columnIndex + 1) % 4
      }
      this.currentColumnIndex = columnIndex

      const keyImg = this.game.add.image((width / 4) * columnIndex, keyY, keyGraphics.generateTexture(), null, keyGroup)

      // 给琴键按钮添加事件
      keyImg.inputEnabled = false
      const key = keyInfo.key.toLowerCase()
      if (key !== '0') {
        keyImg.audioName = key.replace('#', 'h').replace('♭', 'l')
        keyImg.audio = this.game.add.audio(keyImg.audioName)
      }
      keyImg.events.onInputDown.add(() => {
        // 如果当前的key是数组的第一个元素，则可以点击，否则不允许点击
        if (keyImg === keyArray[0]) {
          keyArray.shift()
        } else {
          return
        }
        const timeOutLong = (this.currentMusic.speed / 60) * keyInfo.length * 1000
        this.game.time.events.add(timeOutLong, () => {
          // 销毁声音
          keyImg.audio.destroy()
          // 删除琴键
          keyImg.destroy()
        })
        keyImg.audio.addMarker(`${keyImg.audioName}Marker`, soundSeek[key.toUpperCase()])
        keyImg.audio.play(`${keyImg.audioName}Marker`)
        // 琴键慢慢消失
        this.game.add.tween(keyImg).to({ alpha: 0 }, 400, 'Linear', true)
        this.scoreText.text = '得分：' + (parseFloat(this.scoreText.text.replace('得分：', '')) + 1)
      })
      const keyText = this.game.add.text(width / 8, keyHeight / 2, keyImg.audioName, {
        font: '40px',
        fill: '#ffffff',
        align: 'center'
      })
      keyText.anchor.set(0.5, 0.5)
      keyImg.addChild(keyText)
      keyGraphics.destroy()
      keyArray.push(keyImg)
    }

    // 创建提示
    const songNameGroup = this.game.add.group()
    songNameGroup.position.set(width / 2, 140)
    const songNameImg = this.game.add.image(0, 0, 'bgsongname', null, songNameGroup)
    songNameImg.scale.set(1.25, 1)
    songNameImg.anchor.set(0.5, 0.5)
    songNameImg.alpha = 0.9
    const songNameText = this.game.add.text(0, 0, '说好的幸福呢', {
      font: '22px',
      fill: '#ffffff',
      align: 'center'
    }, songNameGroup)
    songNameImg.addChild(songNameText)
    songNameText.anchor.set(0.5, 0.5)
    const numText = this.game.add.text(0, -songNameImg.height / 2, '第一关', {
      font: '20px',
      fill: '#c04d27',
      align: 'center'
    }, songNameGroup)
    numText.anchor.set(0.5, 1)
    this.songNameGroup = songNameGroup
  }
  // 创建弹层
  createCover() {
    // this.successTip()
    // this.failTip()
  }
  // 成功的提示
  successTip() {
    const successGroup = this.game.add.group()
    successGroup.position.set(width / 2, height / 2)

    const tancengImg = this.game.add.image(0, 0, 'tanceng', null, successGroup)
    tancengImg.scale.set(0.2, 0.2)
    tancengImg.anchor.set(0.5, 0.5)

    const headText = this.game.add.text(0, -85, '恭喜过关', {
      font: '38px',
      fill: '#e41a12',
      fontWeight: 'bold',
      align: 'center'
    }, successGroup)
    headText.anchor.set(0.5, 0.5)
    const midText = this.game.add.text(0, -25, '0', {
      font: '30px',
      fill: '#000000',
      fontWeight: 'bold',
      align: 'center'
    }, successGroup)
    midText.anchor.set(0.5, 0.5)

    const nextImg = this.game.add.image(0, 66, 'restart', null, successGroup)
    nextImg.scale.set(0.14, 0.14)
    nextImg.anchor.set(0.5, 0.5)

    const nextText = this.game.add.text(0, 66, '下一首', {
      font: '28px',
      fill: '#ffffff',
      align: 'center'
    }, successGroup)
    nextText.anchor.set(0.5, 0.5)

    const saveImg = this.game.add.image(0, 140, 'save', null, successGroup)
    saveImg.scale.set(0.14, 0.14)
    saveImg.anchor.set(0.5, 0.5)

    const saveText = this.game.add.text(0, 140, '保存', {
      font: '28px',
      fill: '#ffffff',
      align: 'center'
    }, successGroup)
    saveText.anchor.set(0.5, 0.5)

    const nextSongText = this.game.add.text(0, 66 - nextImg.y / 2 + 4, '蒲公英的约定', {
      font: '16px',
      fill: '#999999',
      align: 'center'
    }, successGroup)
    nextSongText.anchor.set(0.5, 1)
  }
  // 失败的提示
  failTip() {
    const successGroup = this.game.add.group()
    successGroup.position.set(width / 2, height / 2)

    const tancengImg = this.game.add.image(0, 0, 'tanceng', null, successGroup)
    tancengImg.scale.set(0.2, 0.2)
    tancengImg.anchor.set(0.5, 0.5)

    const headText = this.game.add.text(0, -85, 'GAME OVER', {
      font: '38px',
      fill: '#e41a12',
      fontWeight: 'bold',
      align: 'center'
    }, successGroup)
    headText.anchor.set(0.5, 0.5)
    const midText = this.game.add.text(0, -25, '您的得分：300', {
      font: '30px',
      fill: '#000000',
      fontWeight: 'bold',
      align: 'center'
    }, successGroup)
    midText.anchor.set(0.5, 0.5)

    const mextImg = this.game.add.image(0, 66, 'restart', null, successGroup)
    mextImg.scale.set(0.14, 0.14)
    mextImg.anchor.set(0.5, 0.5)

    const nextText = this.game.add.text(0, 66, '重新开始', {
      font: '28px',
      fill: '#ffffff',
      align: 'center'
    }, successGroup)
    nextText.anchor.set(0.5, 0.5)
  }
}
