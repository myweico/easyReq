import { Command } from 'commander'
import { VERSION } from './constant'

const CONFIG = require('../package.json')
const program = new Command()

interface commandConfig {
  description: string
  usage: string
  action: (...args: any[]) => void | Promise<void>
}

const commandMap: Record<string, commandConfig> = {
  init: {
    description: 'init the easy request config',
    usage: 'easyreq init',
    action: (...args) => {
      console.log('test', args[1].name())
    }
  },
  generate: {
    description: 'generate file depends on the config',
    usage: 'easyreq generate',
    action: (...args) => {
      console.log('arguments', args)
    }
  }
}

Object.keys(commandMap).forEach((command) => {
  const { description, usage, action } = commandMap[command] || {}
  program.command(command).description(description).usage(usage).action(action)
})

program.version(VERSION, '-V --version').parse(process.argv)
