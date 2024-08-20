import type { TCommandGroup } from '../types'
import * as commandPaletteDefs from './command-palette/definitions'
import * as tabDefs from './tab/definitions'
import * as bookmarkDefs from './bookmark/definitions'
import { loadDefinitionsSorted } from './utils'

const tabCommands: TCommandGroup = {
  name: 'Tab',
  items: loadDefinitionsSorted(tabDefs),
}

const bookmarkCommands: TCommandGroup = {
  name: 'Bookmark',
  items: loadDefinitionsSorted(bookmarkDefs),
}

const commandPaletteCommands: TCommandGroup = {
  name: 'Command Palette',
  items: loadDefinitionsSorted(commandPaletteDefs),
}

export const defaultGroups: TCommandGroup[] = [
  bookmarkCommands,
  tabCommands,
  commandPaletteCommands,
]
