import template from 'art-template'
import path from 'path'
import fs from 'fs'
import { writeFileSync } from '@/utils/file'

export default (schema: any, config: any) => {
  console.log('in generate')
  const str = template(
    path.resolve(__dirname, '../../templates/api.art'),
    schema
  )
  try {
    // 生成文件
    const { functionPath } = config
    writeFileSync(path.resolve(functionPath, 'index.ts'), str)
  } catch (err) {
    console.error(err)
  }
}
