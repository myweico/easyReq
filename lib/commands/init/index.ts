import fs from 'fs'
import Config from '@/config'
import inquirer from 'inquirer'
import initFile from './initFile'

export default {
  description: 'init the easy request config',
  usage: 'easyreq init',
  action: () => {
    // 检测配置文件是否存在
    try {
      const data = fs.readFileSync(Config.configFileName, 'utf-8')
      console.log('Config file existed: \n')
      console.log(data)
      // 检测配置文件是否合法
      // 合法的话询问是否采用原配置
      inquirer
        .prompt([
          {
            name: 'wouldUseInitalConfig',
            type: 'confirm',
            message:
              'The config file is existed, would you like to use this config?',
            default: true
          }
        ])
        .then((answer) => {
          const { wouldUseInitalConfig } = answer
          if (wouldUseInitalConfig) {
            console.log('User "easyreq to generate files.Gook Luck!��"')
            process.exit(1)
          } else {
            // 询问配置项，写入文件
            initFile()
          }
        })

      // 不合法或者不使用的话重新初始化配置
    } catch (err) {
      console.log('File not exist')
      // 询问问题写入文件
      initFile()
    }
  }
}
