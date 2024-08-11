import { name, version } from '../../package.json'

function notifyVersionUpdate(previousVersion: string, currentVersion: string) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: name,
    message: `Successfully updated version from ${previousVersion} to ${currentVersion}.`,
  })
}

function notifyInstallation(extensionName: string) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: extensionName,
    message: `Successfully installed ${extensionName}.`,
  })
}

chrome.runtime.onInstalled.addListener((detail) => {
  if (detail.previousVersion) {
    notifyVersionUpdate(detail.previousVersion, version)
  } else {
    notifyInstallation(name)
  }
})
