import type { TCommand, TActionsById, TAction } from '../types'

export function defineCommand(def: { id: string; name: string }): TCommand {
  return { ...def, data: undefined }
}

export function defineActions(def: TCommand, actions: TAction[]): TActionsById {
  return { [def.id]: actions }
}

export function loadDefinedActions(source: Record<string, TActionsById>) {
  return Object.assign({}, ...Object.values(source)) as TActionsById
}

export function loadDefinitions(source: Record<string, TCommand>) {
  return Object.values(source)
}

export function loadDefinitionsSorted(source: Record<string, TCommand>) {
  return loadDefinitions(source).sort(orderByNameAsc)
}

function orderByNameAsc(o1: TCommand, o2: TCommand) {
  if (o1.name > o2.name) return 1
  else if (o1.name === o2.name) return 0
  else return -1
}
