export function info(...args: string[]) {
  console.log(COLORS.FgBlue, ...args)
}

export function error(...args: string[]) {
  console.log(COLORS.FgRed, ...args)
}

export function warning(...args: string[]) {
  console.log(COLORS.FgYellow, ...args)
}

export function success(...args: string[]) {
  console.log(COLORS.FgGreen, ...args)
}

const COLORS = {
  Reset: '\x1b[0m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
}
