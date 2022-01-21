/*
 * @Description: 工具类
 * @Author: yang.xiaolong
 * @Date: 2022-01-20 17:30:08
 * @LastEditTime: 2022-01-21 10:10:45
 * @LastEditors: yang.xiaolong
 */
import config from '../config'

export function fieLoadFunc (game, completeFunc) {
  // 加载资源失败的错误捕获
  const errorList = []
  game.load.onFileError.add((key, file) => {
    errorList.push({ key, file })
  })

  // 监听资源加载完成，完成后，跳转到下一个state
  game.load.onFileComplete.add((progress) => {
    completeFunc && completeFunc(progress)
    if (progress === 100) {
      if (errorList.length > 0) {
        console.log('资源加载错误:', errorList)
      }
    }
  })
}

export function getWH () {
  const docElement = document.documentElement
  const width =
    docElement.clientWidth > config.gameWidth
      ? config.gameWidth
      : docElement.clientWidth
  const height =
    docElement.clientHeight > config.gameHeight
      ? config.gameHeight
      : docElement.clientHeight
  return { width, height }
}
