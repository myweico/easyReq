import { Command } from 'commander'
import { VERSION } from './constant'
import { init, generate } from './commands'

const program = new Command()

interface commandConfig {
  description: string
  usage: string
  action: (...args: any[]) => void | Promise<void>
}

const commandMap: Record<string, commandConfig> = {
  init,
  generate
}

Object.keys(commandMap).forEach((command) => {
  const { description, usage, action } = commandMap[command] || {}
  program.command(command).description(description).usage(usage).action(action)
})

program.version(VERSION, '-V --version').parse(process.argv)
