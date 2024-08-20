import { cn } from '@/lib/utils'
import type { MouseEventHandler } from 'react'

type Props = {
  onClick: MouseEventHandler
  className?: string
}

export default function CommandPaletteOverlay({ onClick, className }: Props) {
  return (
    <div
      className={cn('h-full w-full bg-transparent', className)}
      onClick={onClick}
    />
  )
}
