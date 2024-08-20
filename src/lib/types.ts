/**
 * Theme of this extension.
 */
export type Theme = 'dark' | 'light' | 'system'

/**
 * Keyboard(actually, a 'key') object to be compared/saved.
 */
export type Keyboard = Pick<
  KeyboardEvent,
  'code' | 'shiftKey' | 'metaKey' | 'altKey' | 'ctrlKey'
>

export type Tab = chrome.tabs.Tab
export type TabGroup = chrome.tabGroups.TabGroup
export type MessageSender = chrome.runtime.MessageSender
export type QueryInfo = chrome.tabs.QueryInfo
export type Bookmark = chrome.bookmarks.BookmarkTreeNode

// =========================================================================

/**
 * Command palette item. (`<CommandItem>`)
 *
 * - name: display name
 * - data: additional data
 */
export type TItem<T> = {
  id: string
  name: string
  data: T
}

/**
 * Command palette group of items. (`<CommandGroup>`)
 *
 * - name: heading of `<CommandGroup>`
 * - items: items to be displayed as `<CommandItem>`
 */
export type TGroup<T> = {
  name: string
  items: TItem<T>[]
}

export type TStepType = 'text' | 'single' | 'multiple'

/**
 * Fields that every type of steps needs to have.
 *
 * - type: what kind of data should be selected
 * - placeholder: used in `<CommandInput placeholer={here}>`
 * - items: items to be displayed as `<CommandItem>` or `<CommandGroup>`
 */
type TStepBase = {
  type: TStepType
  placeholder: string
}

/** Select string directly from user input. */
export type TStepText = TStepBase & {
  type: 'text'
  elements: undefined
}

/** Text type step sends string to background script. */
export type TSelectedText = string

/** Select single item from 'items'. */
export type TStepSingle<T> = TStepBase & {
  type: 'single'
  elements: (TItem<T> | TGroup<T>)[]
}

/** Single type step sends single item to background script. */
export type TSelectedSingle<T> = TItem<T>

/** Select multiple items from 'items'. */
export type TStepMultiple<T> = TStepBase & {
  type: 'multiple'
  elements: (TItem<T> | TGroup<T>)[]
}

/** Multiple type step sends multiple items to background script. */
export type TSelectedMultiple<T> = TItem<T>[]

export type TStep = TStepText | TStepSingle<unknown> | TStepMultiple<unknown>
export type TSelected =
  | TSelectedText
  | TSelectedSingle<unknown>
  | TSelectedMultiple<unknown>

/** ID of the command */
export type TCommandId = string

/**
 * Command is actually an alias of step '0' item.
 *
 * - data.id: used to find command's actions
 */
export type TCommand = TItem<undefined>

/**
 * Group of commands.
 * This is for user defined list of commands.
 */
export type TCommandGroup = TGroup<undefined>

/**
 * Action is "What should do in a step.".
 *
 * [NOTE] Command = Sequence of actions
 */
export type TAction = (
  sender: chrome.runtime.MessageSender,
  ...selections: TSelected[]
) => Promise<void | TStep>

export type TActionsById = Record<TCommandId, TAction[]>

/**
 * After running all actions successfully,
 * this type of response will be sent to content script.
 */
export type TSuccess = {
  status: 'success'
}

/**
 * When error is thrown during running command's action,
 * this type of response will be sent to content script.
 */
export type TFail = {
  status: 'fail'
  reason: string
}

/**
 * When more steps are needed to finish running command's action,
 * this type of response will be sent to content script.
 * Then content script will send additional arguments through `sendMessage`.
 */
export type TIncomplete = {
  status: 'incomplete'
  step: TStep
}

/**
 * These types of response will be sent to content script
 * from background script in response of `sendMessage`.
 */
export type TResponse = TSuccess | TFail | TIncomplete
