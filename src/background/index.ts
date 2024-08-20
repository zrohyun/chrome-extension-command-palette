import {
  TAction,
  TCommand,
  TFail,
  TIncomplete,
  TResponse,
  TSelected,
  TStep,
  TSuccess,
} from '@/lib/types'
import { name, version } from '../../package.json'
import { actionsById } from '@/lib/commands/actions-by-id'

function suggestRefreshingAllTabs() {
  chrome.notifications.create(`${name}-refresh`, {
    type: 'basic',
    iconUrl: 'icon-48.png',
    title: name,
    message: 'Click "Refresh" to refresh all tabs.',
    buttons: [{ title: 'Refresh' }, { title: 'Cancel' }],
    requireInteraction: true,
  })
}

async function refreshAllTabs(id: string, buttonIndex: number) {
  if (id !== `${name}-refresh`) return
  if (buttonIndex === 1) return

  const tabs = await chrome.tabs.query({})
  tabs
    .map(({ id }) => id)
    .filter((id) => id != null)
    .forEach((tabId) => chrome.tabs.reload(tabId))
}

function notifyVersionUpdate(previousVersion: string, currentVersion: string) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-48.png',
    title: name,
    message: `Successfully updated version from ${previousVersion} to ${currentVersion}.`,
  })
  suggestRefreshingAllTabs()
}

function notifyInstallation(extensionName: string) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-48.png',
    title: extensionName,
    message: `Successfully installed ${extensionName}.`,
  })
  suggestRefreshingAllTabs()
}

function notifyOnInstallOrUpdate(detail: chrome.runtime.InstalledDetails) {
  if (detail.previousVersion) {
    notifyVersionUpdate(detail.previousVersion, version)
  } else {
    notifyInstallation(name)
  }
}

function openOptionsPage() {
  chrome.runtime.openOptionsPage()
}

function getStep(selections: TSelected[]) {
  const step = selections.length - 1
  if (step === -1) {
    throw new Error('Received no selections.')
  }

  return step
}

function getCommand(selections: TSelected[]) {
  const command = selections.shift() as TCommand
  if (command == null) {
    throw new Error('Command not found.')
  }

  return command
}

function getActions(command: TCommand) {
  const actions = actionsById[command.id]
  if (actions == null) {
    throw new Error(`No actions found for "${command.name}(${command.id})".`)
  }

  return actions
}

function getStepAction(actions: TAction[], step: number) {
  const stepAction = actions[step]
  if (stepAction == null) {
    throw new Error(`Cannot find action to handle step ${step}.`)
  }

  return stepAction
}

function onStepAction(
  result: void | TStep,
  response: (res: TResponse) => void
) {
  if (result == null) {
    response({ status: 'success' } as TSuccess)
  } else {
    response({
      status: 'incomplete',
      step: result,
    } as TIncomplete)
  }
}

function onError(e: Error, sendResponse: (res: TFail) => void) {
  console.error(e)
  sendResponse({
    status: 'fail',
    reason: e.message,
  })
}

function runAction(
  selections: TSelected[],
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: TResponse) => void
) {
  try {
    const step = getStep(selections)
    const command = getCommand(selections)
    const actions = getActions(command)
    const stepAction = getStepAction(actions, step)

    stepAction(sender, ...selections)
      .then((result) => onStepAction(result, sendResponse))
      .catch((e) => onError(e, sendResponse))
  } catch (e) {
    onError(e as Error, sendResponse)
  }

  return true
}

// ======================================================

chrome.notifications.onButtonClicked.addListener(refreshAllTabs)
chrome.runtime.onInstalled.addListener(notifyOnInstallOrUpdate)
chrome.runtime.onMessage.addListener(runAction)
chrome.action.onClicked.addListener(openOptionsPage)
