import * as tabActions from './tab/actions'
import * as bookmarkActions from './bookmark/actions'
import * as commandPaletteActions from './command-palette/actions'
import { loadDefinedActions } from './utils'
import type { TActionsById } from '../types'

export const actionsById: TActionsById = {
  ...loadDefinedActions(tabActions),
  ...loadDefinedActions(bookmarkActions),
  ...loadDefinedActions(commandPaletteActions),
}
