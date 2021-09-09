import fs from 'fs'
import Config from '@/config'

export default {
  description: 'init the easy request config',
  usage: 'easyreq init',
  action: () => {
    // 检测配置文件是否存在
    try {
      const data = fs.readFileSync(Config.configFileName)
      console.log('Config file existed: \n')
      console.log(JSON.stringify(data, null, 2))
    } catch (err) {
      console.log('File not exist')
    }
    // 已存在提示是否使用配置文件
    // 使用则停止程序
    // 不使用则提示配置选项
    // 不存在则提示配置选项
  }
}
