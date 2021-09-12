import template from 'art-template'
import path from 'path'
import fs from 'fs'

export default (schema: any, config) => {
  console.log('in generate')
  const str = template(
    path.resolve(__dirname, '../../templates/api.art'),
    schema
  )
  console.log(str)
  // 生成文件
  const { functionPath } = config
  fs.writeFileSync(path.resolve(functionPath, 'index.ts'), str)
}
