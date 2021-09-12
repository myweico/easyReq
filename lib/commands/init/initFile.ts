import inquirer from 'inquirer'
import Config from '@/config'
import fs from 'fs'

export default () =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'swaggerUrl',
        message: 'Input swagger url or the file path'
      },
      {
        type: 'input',
        name: 'interfacePath',
        message:
          'Input the direction to place interface files(default: ./types)',
        default: './types'
      },
      {
        type: 'input',
        name: 'functionPath',
        message: 'Input the direction path to place functions to request',
        default: './apis'
      },
      {
        type: 'input',
        name: 'requestSnippet',
        message:
          'Input snippet to import request method\n(eg. import request from "../utils/request")'
      }
    ])
    .then((answer) => {
      try {
        // 写入到文件中
        fs.writeFileSync(Config.configFileName, JSON.stringify(answer, null, 2))
        console.log(
          '🎉 Init completed! Use `easyreq generate` to generate the files.'
        )
      } catch (err) {
        console.error('Init Error:', err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
