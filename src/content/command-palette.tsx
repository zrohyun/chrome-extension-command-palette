import { useCallback, useRef, useState } from 'react'
import CommandText from './command-text'
import CommandSingle from './command-single'
import CommandMultiple from './command-multiple'
import type {
  TSelected,
  TCommandGroup,
  TResponse,
  TStep,
  TCommand,
} from '@/lib/types'

type Props = {
  commands: (TCommand | TCommandGroup)[]
  close?: () => void
  className?: string
}

export default function CommandPalette({ commands, close, className }: Props) {
  const [steps, setSteps] = useState<TStep[]>([
    {
      type: 'single',
      placeholder: 'Type a command...',
      elements: commands,
    },
  ])
  const selections = useRef<TSelected[]>([])
  const last = steps.length - 1
  const isHome = last === 0
  const step = steps[last]

  const onSelect = useCallback(
    async (selection: TSelected) => {
      selections.current.push(selection)
      const response = (await chrome.runtime.sendMessage(
        selections.current
      )) as TResponse

      switch (response.status) {
        case 'success':
          if (close) close()
          break

        case 'incomplete':
          setSteps((prev) => [...prev, response.step])
          break

        case 'fail':
        default:
          window.alert(response.reason)
          if (close) close()
          break
      }
    },
    [close]
  )

  const onCancel = useCallback(() => {
    selections.current.pop()
    if (isHome) return

    setSteps((prev) => {
      const arr = [...prev]
      arr.pop()
      return arr
    })
  }, [isHome])

  return (
    <div className={className}>
      {step.type === 'multiple' ? (
        <CommandMultiple step={step} onSelect={onSelect} onCancel={onCancel} />
      ) : step.type === 'single' ? (
        <CommandSingle step={step} onSelect={onSelect} onCancel={onCancel} />
      ) : (
        <CommandText step={step} onSelect={onSelect} onCancel={onCancel} />
      )}
    </div>
  )
}
