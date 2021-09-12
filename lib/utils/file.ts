import fs, { WriteFileOptions } from 'fs'
import path from 'path'

export const writeFileSync = (
  filepath: string,
  data: string | NodeJS.ArrayBufferView,
  options?: WriteFileOptions
) => {
  const dirname = path.dirname(filepath)
  console.log(dirname)
  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filepath, data, options)
}
