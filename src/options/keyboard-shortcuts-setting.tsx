import { Button } from '@/components/ui/button'

export default function KeyboardShortcutsSetting() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-extrabold">Keyboard Shortcuts</h2>
      <div>
        <Button onClick={openShortcutsPage} variant="outline">
          Click here to customize keyboard shortcuts.
        </Button>
      </div>
    </div>
  )
}

function openShortcutsPage() {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
}
