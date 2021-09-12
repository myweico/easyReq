import fs from 'fs'
import is from '@/utils/is'
import Config from '@/config'
import axios from 'axios'
import generateFile from './generate'

export default {
  description: 'generate file depends on the config',
  usage: 'easyreq generate',
  action: async (...args: any[]) => {
    // 从配置文件里面读取字段
    const reqConfigStr = fs.readFileSync(Config.configFileName, 'utf-8')
    try {
      const reqConfig = JSON.parse(reqConfigStr)
      const { swaggerUrl } = reqConfig
      let swaggerSchema
      // 判断 swagger 是需要从网络获取还是本地生成
      if (is.httpUrl(swaggerUrl)) {
        const swaggerSchemaRes = await axios.get(swaggerUrl)
        swaggerSchema = swaggerSchemaRes.data
        console.log('swagger from axios', swaggerSchema)
      } else {
        // 从本地读取
        const swaggerSchemaStr = fs.readFileSync(swaggerUrl, 'utf-8')
        swaggerSchema = JSON.parse(swaggerSchemaStr)
        console.log('swagger from file: ', swaggerSchema)
      }

      generateFile(swaggerSchema, reqConfig)
      // 获取到配置文件后，根据配置文件生成模板
    } catch (err) {
      console.error(err)
    }
  }
}
