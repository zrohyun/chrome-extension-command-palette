import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEventHandler,
} from 'react'
import { Input } from '@/components/ui/input'
import { Command } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import type { TSelectedText, TStepText } from '@/lib/types'

type Props = {
  step: TStepText
  onSelect: (text: TSelectedText) => void
  onCancel: () => void
}

export default function CommandInputText({ step, onSelect, onCancel }: Props) {
  const [value, setValue] = useState('')
  const { placeholder } = step

  useEffect(() => {
    setValue('')
  }, [step])

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      if (ev.key === 'Enter') onSelect(value)

      if (value.length) return

      if (ev.key === 'Backspace') {
        ev.preventDefault()
        onCancel()
      }
    },
    [onCancel, onSelect, value]
  )

  return (
    <Command
      onKeyDown={onKeyDown}
      className="focus-visible:ring-transparent focus-visible:outline-none">
      <Input
        placeholder={placeholder}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          'flex h-10 w-full py-3',
          'text-sm bg-transparent placeholder:text-muted-foreground rounded-md',
          'border-none outline-none focus-visible:ring-transparent shadow-none'
        )}
      />
      <div
        className={cn(
          'px-2 py-1.5',
          'text-xs text-muted-foreground/50 border-t',
          'flex flex-row items-center justify-evenly'
        )}>
        {value.length ? (
          <>
            <span>⏎ - confirm</span>
          </>
        ) : (
          <>
            <span>⌫ - cancel</span>
            <span>⏎ - confirm</span>
          </>
        )}
      </div>
    </Command>
  )
}
