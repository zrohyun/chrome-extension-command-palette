import { name } from '@/../package.json'
import { defineActions } from '../utils'
import { disable, openOptions, reload, uninstall } from './definitions'

export const _disable = defineActions(disable, [
  // step 0: Command => void
  async () => {
    const thisExtension = await chrome.management.getSelf()
    chrome.management.setEnabled(thisExtension.id, false)
  },
])

export const _reload = defineActions(reload, [
  // step 0: Command => void
  async () => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon-128.png',
      title: name,
      message: `Command palette will be reloaded in a moment.`,
    })

    setTimeout(() => chrome.runtime.reload(), 200)
  },
])

export const _openOptions = defineActions(openOptions, [
  // step 0: Command => void
  async () => {
    await chrome.runtime.openOptionsPage()
  },
])

export const _uninstall = defineActions(uninstall, [
  // step 0: Command => void
  async () => {
    await chrome.management.uninstallSelf({ showConfirmDialog: true })
  },
])
