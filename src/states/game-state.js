/*
 * @Description: 游戏主界面
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 10:08:43
 * @LastEditTime: 2022-03-15 15:58:50
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
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.num = 0 // 第几关
    this.currentMusic = allMusic[this.num % 8] // 8首歌循环播放
    this.currentColumnIndex = 0
    this.gameState = 0 // 游戏状态： 0 未开始、1 成功、 -1 游戏失败
  }
  preload() {}
  create() {
    // 创建背景
    this.createBackGround()
    // 创建琴键和歌曲提示
    this.createKeyAndTips()
    // 置顶得分
    this.world.bringToTop(this.scoreText)
    this.createPanel()
  }
  update() {
    // 让琴键动起来,后续改为使用物理引擎
    // this.keyArray.forEach(item => {
    //   item.y = item.y + 1
    // })
    this.game.physics.arcade.overlap(this.panelSprite, this.keyGroup, () => {
      if (this.gameState !== -1) {
        // 所有琴键速度改为0
        this.keyGroup.setAll('body.velocity', new Phaser.Point(0, 0))
        // 游戏结束
        this.gameState = -1
        this.failTip()
      }
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

    lineGraphics.moveTo((width / 4) * 2, 0)
    lineGraphics.lineTo((width / 4) * 2, height)

    lineGraphics.moveTo((width / 4) * 3, 0)
    lineGraphics.lineTo((width / 4) * 3, height)

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
    this.beginImg = beginImg
    // 给开始按钮添加事件
    beginImg.inputEnabled = true
    beginImg.events.onInputUp.add(() => {
      // 状态置为1
      this.gameState = 1
      // 销毁歌曲名称
      this.songNameGroup.destroy()
      // 显示得分
      this.scoreText.exists = true
      // 琴键改为可点击
      this.keyGroup.setAll('inputEnabled', true)
      // 给所有琴键添加速度
      this.keyGroup.setAll('body.velocity', new Phaser.Point(0, 300 * this.currentMusic.speed / 60))
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
    this.createKeys(false)

    // 创建提示
    const songNameGroup = this.game.add.group()
    songNameGroup.position.set(width / 2, 140)
    const songNameImg = this.game.add.image(0, 0, 'bgsongname', null, songNameGroup)
    songNameImg.scale.set(1.25, 1)
    songNameImg.anchor.set(0.5, 0.5)
    songNameImg.alpha = 0.9
    const songNameText = this.game.add.text(
      0,
      0,
      '说好的幸福呢',
      {
        font: '22px',
        fill: '#ffffff',
        align: 'center'
      },
      songNameGroup
    )
    songNameImg.addChild(songNameText)
    songNameText.anchor.set(0.5, 0.5)
    const numText = this.game.add.text(
      0,
      -songNameImg.height / 2,
      '第一关',
      {
        font: '20px',
        fill: '#c04d27',
        align: 'center'
      },
      songNameGroup
    )
    numText.anchor.set(0.5, 1)
    this.songNameGroup = songNameGroup
  }
  createKeys(isNotFirst) {
    let keyArray = []
    this.keyArray = keyArray
    const keyGroup = this.game.add.group()
    this.keyGroup = keyGroup
    keyGroup.enableBody = true
    keyGroup.physicBodyType = Phaser.Physics.ARCADE
    const musics = this.currentMusic.music
    for (let i = 0; i < musics.length; i++) {
      const keyInfo = musics[i]
      const keyHeight = baseHeight * keyInfo.length * 2
      const keyGraphics = this.game.add.graphics(0, 0)
      keyGraphics.beginFill(0x036ed6)
      keyGraphics.drawRect(0, 0, width / 4, keyHeight)

      let keyY = 0
      if (keyArray.length === 0) {
        if (isNotFirst) {
          keyY = -keyHeight
        } else {
          keyY = this.beginImg.y - keyHeight
        }
      } else {
        keyY = keyArray[keyArray.length - 1].y - keyHeight
      }
      let columnIndex = this.game.rnd.integerInRange(0, 400) % 4
      if (columnIndex === this.currentColumnIndex) {
        columnIndex = (columnIndex + 1) % 4
      }
      this.currentColumnIndex = columnIndex

      // 只有精灵才可以启用物理引擎
      const keySprite = this.game.add.sprite((width / 4) * columnIndex, keyY, keyGraphics.generateTexture(), null, keyGroup)

      if (i === musics.length - 1) {
        keySprite.isLast = true
      }

      // 给琴键按钮添加事件
      keySprite.inputEnabled = false
      keySprite.keyInfo = keyInfo
      const key = keyInfo.key.toLowerCase()
      if (key !== '0') {
        keySprite.audioName = key.replace('#', 'h').replace('♭', 'l')
        keySprite.audio = this.game.add.audio(keySprite.audioName)
      }
      keySprite.events.onInputDown.add(() => {
        // 如果当前的key是数组的第一个元素，则可以点击，否则不允许点击
        if (keySprite === keyArray[0]) {
          keyArray.shift()
        } else {
          return
        }
        const timeOutLong = (this.currentMusic.speed / 60) * keyInfo.length * 1000
        this.game.time.events.add(timeOutLong, () => {
          // 销毁声音
          keySprite.audio.destroy()
          // 删除琴键
          keySprite.destroy()
          if (keySprite.isLast) {
            this.successTip()
            this.gameState = 0
          }
        })
        // 琴键录音前面有空白，所以需要截取，以便播放的时候，立刻就能播放出相应的琴键声音
        keySprite.audio.addMarker(`${keySprite.audioName}Marker`, soundSeek[key.toUpperCase()])
        keySprite.audio.play(`${keySprite.audioName}Marker`)
        // 琴键慢慢消失
        this.game.add.tween(keySprite).to({ alpha: 0 }, 400, 'Linear', true)
        this.scoreText.text = '得分：' + (parseFloat(this.scoreText.text.replace('得分：', '')) + 1)
      })
      const keyText = this.game.add.text(width / 8, keyHeight / 2, keySprite.audioName, {
        font: '40px',
        fill: '#ffffff',
        align: 'center'
      })
      keyText.anchor.set(0.5, 0.5)
      keySprite.addChild(keyText)
      keyGraphics.destroy()
      keyArray.push(keySprite)
    }
    // 删除空白琴键
    const whiteKeys = keyArray.filter((item) => item.keyInfo.key === '0')
    keyArray = keyArray.filter((item) => item.keyInfo.key !== '0')
    whiteKeys.forEach((item) => keyGroup.remove(item, true))
  }

  // 创建碰撞检测
  createPanel() {
    const panelGraphics = this.game.add.graphics(0, 0)
    panelGraphics.beginFill(0xffffff)
    panelGraphics.drawRect(0, 0, width, 20)
    panelGraphics.endFill()
    const panelSprite = this.game.add.sprite(0, height - 50, panelGraphics.generateTexture())
    panelGraphics.destroy()
    this.game.physics.enable(panelSprite, Phaser.Physics.ARCADE)
    this.panelSprite = panelSprite
  }
  // 成功的提示
  successTip() {
    const successGroup = this.game.add.group()
    successGroup.position.set(width / 2, height / 2)

    const tancengImg = this.game.add.image(0, 0, 'tanceng', null, successGroup)
    tancengImg.scale.set(0.2, 0.2)
    tancengImg.anchor.set(0.5, 0.5)

    const headText = this.game.add.text(
      0,
      -85,
      '恭喜过关',
      {
        font: '38px',
        fill: '#e41a12',
        fontWeight: 'bold',
        align: 'center'
      },
      successGroup
    )
    headText.anchor.set(0.5, 0.5)
    const midText = this.game.add.text(
      0,
      -25,
      '您的' + this.scoreText.text,
      {
        font: '30px',
        fill: '#000000',
        fontWeight: 'bold',
        align: 'center'
      },
      successGroup
    )
    midText.anchor.set(0.5, 0.5)

    const backImg = this.game.add.image(-width / 2 + 10, -height / 2 + 10, 'back', null, successGroup)
    backImg.scale.set(0.25, 0.25)

    backImg.inputEnabled = true
    backImg.events.onInputUp.add(() => {
      this.game.state.start('NavState')
    })

    const nextImg = this.game.add.image(0, 66, 'restart', null, successGroup)
    nextImg.scale.set(0.14, 0.14)
    nextImg.anchor.set(0.5, 0.5)

    nextImg.inputEnabled = true
    nextImg.events.onInputUp.add(() => {
      successGroup.destroy()
      // 状态置为1
      this.gameState = 1
      // 销毁当前琴键
      this.keyGroup.destroy()
      // 关卡+1
      this.num = this.num + 1
      this.currentMusic = allMusic[this.num % 8]
      // 重新生成琴键
      this.createKeys(true)
      // 得分置为0
      this.scoreText.text = '得分：0'
      // 琴键改为可点击
      this.keyGroup.setAll('inputEnabled', true)
      // 给所有琴键添加速度
      this.keyGroup.setAll('body.velocity', new Phaser.Point(0, 100 * (this.currentMusic.speed / 60)))
      // 开始按钮隐藏
      nextImg.exists = false
    })

    const nextText = this.game.add.text(
      0,
      66,
      '下一首',
      {
        font: '28px',
        fill: '#ffffff',
        align: 'center'
      },
      successGroup
    )
    nextText.anchor.set(0.5, 0.5)

    const saveImg = this.game.add.image(0, 140, 'save', null, successGroup)
    saveImg.scale.set(0.14, 0.14)
    saveImg.anchor.set(0.5, 0.5)

    const saveText = this.game.add.text(
      0,
      140,
      '保存',
      {
        font: '28px',
        fill: '#ffffff',
        align: 'center'
      },
      successGroup
    )
    saveText.anchor.set(0.5, 0.5)

    const nextSongText = this.game.add.text(
      0,
      66 - nextImg.y / 2 + 4,
      this.currentMusic.name,
      {
        font: '16px',
        fill: '#999999',
        align: 'center'
      },
      successGroup
    )
    nextSongText.anchor.set(0.5, 1)
  }
  // 失败的提示
  failTip() {
    const successGroup = this.game.add.group()
    successGroup.position.set(width / 2, height / 2)

    const tancengImg = this.game.add.image(0, 0, 'tanceng', null, successGroup)
    tancengImg.scale.set(0.2, 0.2)
    tancengImg.anchor.set(0.5, 0.5)

    const headText = this.game.add.text(
      0,
      -85,
      'GAME OVER',
      {
        font: '38px',
        fill: '#e41a12',
        fontWeight: 'bold',
        align: 'center'
      },
      successGroup
    )
    headText.anchor.set(0.5, 0.5)
    const midText = this.game.add.text(
      0,
      -25,
      '您的' + this.scoreText.text,
      {
        font: '30px',
        fill: '#000000',
        fontWeight: 'bold',
        align: 'center'
      },
      successGroup
    )
    midText.anchor.set(0.5, 0.5)

    const backImg = this.game.add.image(-width / 2 + 10, -height / 2 + 10, 'back', null, successGroup)
    backImg.scale.set(0.25, 0.25)

    backImg.inputEnabled = true
    backImg.events.onInputUp.add(() => {
      this.game.state.start('NavState')
    })

    const nextImg = this.game.add.image(0, 66, 'restart', null, successGroup)
    nextImg.scale.set(0.14, 0.14)
    nextImg.anchor.set(0.5, 0.5)

    nextImg.inputEnabled = true
    nextImg.events.onInputUp.add(() => {
      successGroup.destroy()
      // 状态置为1
      this.gameState = 1
      // 销毁当前琴键
      this.keyGroup.destroy()
      // 重新生成琴键
      this.createKeys(true)
      // 得分置为0
      this.scoreText.text = '得分：0'
      // 琴键改为可点击
      this.keyGroup.setAll('inputEnabled', true)
      // 给所有琴键添加速度
      this.keyGroup.setAll('body.velocity', new Phaser.Point(0, (300 * this.currentMusic.speed) / 60))
      // 开始按钮隐藏
      nextImg.exists = false
    })

    const nextText = this.game.add.text(
      0,
      66,
      '重新开始',
      {
        font: '28px',
        fill: '#ffffff',
        align: 'center'
      },
      successGroup
    )
    nextText.anchor.set(0.5, 0.5)
  }
}
