import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type KeyboardEventHandler,
} from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'
import type {
  TGroup,
  TItem,
  TSelectedMultiple,
  TStepMultiple,
} from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  step: TStepMultiple<unknown>
  onSelect: (multiple: TSelectedMultiple<unknown>) => void
  onCancel: () => void
}

export default function CommandInputMultiple({
  step,
  onSelect,
  onCancel,
}: Props) {
  const [search, setSearch] = useState('')
  const [multiple, setMultiple] = useState(new Set<TItem<unknown>>())
  const { placeholder, elements } = step

  useEffect(() => {
    setSearch('')
  }, [step])

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      if (ev.key === 'Enter' && ev.shiftKey && multiple.size > 0) {
        ev.preventDefault()
        onSelect([...multiple])
      }

      if (search.length) return

      if (ev.key === 'Backspace') {
        ev.preventDefault()
        onCancel()
      }
    },
    [multiple, onCancel, onSelect, search.length]
  )

  const toggle = useCallback(
    (item: TItem<unknown>) => {
      if (multiple.has(item)) {
        setMultiple((prev) => {
          prev.delete(item)
          return new Set(prev)
        })
      } else {
        setMultiple((prev) => new Set(prev.add(item)))
      }
    },
    [multiple]
  )

  return (
    <Command
      onKeyDown={onKeyDown}
      className="focus-visible:ring-transparent focus-visible:outline-none">
      <CommandInput
        placeholder={placeholder}
        autoFocus
        value={search}
        onValueChange={(val) => setSearch(val)}
      />

      <div
        className={cn(
          'px-2 py-1.5',
          'text-xs text-muted-foreground/50 border-b',
          'flex flex-row items-center justify-evenly'
        )}>
        {search.length ? (
          <>
            <span>⏎ - toggle</span>
            <span>⇧⏎ - confirm</span>
          </>
        ) : (
          <>
            <span>⌫ - cancel</span>
            <span>⏎ - toggle</span>
            <span>⇧⏎ - confirm</span>
          </>
        )}
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {elements.map((elem, idx) => {
          const group = elem as TGroup<unknown>
          const item = elem as TItem<unknown>
          if (group.items) {
            return (
              <Fragment key={idx}>
                <MultipleGroup
                  group={group}
                  onToggle={toggle}
                  isSelected={(i) => multiple.has(i)}
                />
              </Fragment>
            )
          } else {
            return (
              <MultipleItem
                key={idx}
                item={item}
                onToggle={toggle}
                isSelected={(i) => multiple.has(i)}
              />
            )
          }
        })}
      </CommandList>
    </Command>
  )
}

type MultipleGroupProps = {
  group: TGroup<unknown>
  isSelected: (item: TItem<unknown>) => boolean
  onToggle: (item: TItem<unknown>) => void
}

function MultipleGroup({ group, isSelected, onToggle }: MultipleGroupProps) {
  return (
    <CommandGroup
      heading={group.name}
      className="my-2 [&:first-child]:mt-0 [&:last-child]:mb-0 p-0 [&_[cmdk-group-items]]:ml-4">
      {group.items.map((item, idx) => (
        <MultipleItem
          key={idx}
          item={item}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      ))}
    </CommandGroup>
  )
}

type MultipleItemProps = {
  item: TItem<unknown>
  isSelected: (item: TItem<unknown>) => boolean
  onToggle: (item: TItem<unknown>) => void
}

function MultipleItem({ item, isSelected, onToggle }: MultipleItemProps) {
  return (
    <CommandItem
      onSelect={() => onToggle(item)}
      value={`${item.name}#${item.id}`}
      className="rounded-none">
      {isSelected(item) ? (
        <CheckCircledIcon className="mr-2 size-4 shrink-0" />
      ) : (
        <CircleIcon className="mr-2 size-4 shrink-0" />
      )}
      <span>{item.name}</span>
    </CommandItem>
  )
}
