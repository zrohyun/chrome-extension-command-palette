import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useStorageState } from '@/lib/hooks/use-storage-state'
import { defaultKeyToClose, defaultKeyToOpen, isKeyToIgnore } from '@/lib/keys'
import type { Keyboard } from '@/lib/types'

export default function KeymapSetting() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-black">Keymap</h1>
      <Keymap
        keyName="keyToOpen"
        description="Open command palette"
        defaultKeyboard={defaultKeyToOpen}
      />
      <Keymap
        keyName="keyToClose"
        description="Close command palette"
        defaultKeyboard={defaultKeyToClose}
      />
    </div>
  )
}

type KeymapProps = {
  keyName: string
  description: string
  defaultKeyboard: Keyboard
}

function Keymap({ keyName, description, defaultKeyboard }: KeymapProps) {
  const [listening, setListening] = useState(false)
  const [keyboard, setKeyboard] = useStorageState<Keyboard>(
    keyName,
    defaultKeyboard
  )

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (isKeyToIgnore(ev.code)) return

      setKeyboard(pickKey(ev))
      setListening(false)
    },
    [setKeyboard]
  )

  useEffect(() => {
    if (listening) {
      window.addEventListener('keydown', onKeyDown)
    } else {
      window.removeEventListener('keydown', onKeyDown)
    }

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [listening, onKeyDown])

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{description}</span>
      {listening ? (
        <div className="flex flex-row items-center gap-4">
          <span className="text-xs text-muted-foreground">Listening...</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setListening(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-4">
          <span className="text-xs">
            {keyboard == null ? 'Loading...' : display(keyboard)}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={keyboard == null}
            onClick={() => setListening(true)}>
            Change
          </Button>
        </div>
      )}
    </div>
  )
}

function display(keyboard: Keyboard) {
  const metaCtrl = keyboard.ctrlKey || keyboard.metaKey ? 'Ctrl (Cmd)' : ''
  const alt = keyboard.altKey ? 'Alt (Option)' : ''
  const shift = keyboard.shiftKey ? 'Shift' : ''
  const code = keyboard.code

  return [metaCtrl, alt, shift, code]
    .filter((s) => (s ? true : false))
    .join(' + ')
}

function pickKey(ev: KeyboardEvent): Keyboard {
  const { code, ctrlKey, metaKey, altKey, shiftKey } = ev
  return {
    code,
    ctrlKey,
    metaKey,
    altKey,
    shiftKey,
  }
}
