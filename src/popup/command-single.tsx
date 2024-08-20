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
import type { TGroup, TItem, TSelectedSingle, TStepSingle } from '@/lib/types'

type Props = {
  step: TStepSingle<unknown>
  onSelect: (multiple: TSelectedSingle<unknown>) => void
  onCancel: () => void
}

export default function CommandInputSingle({
  step,
  onSelect,
  onCancel,
}: Props) {
  const [search, setSearch] = useState('')
  const { placeholder, elements } = step

  useEffect(() => {
    setSearch('')
  }, [step])

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      if (search.length) return

      if (ev.key === 'Backspace') {
        ev.preventDefault()
        onCancel()
      }
    },
    [onCancel, search.length]
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

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {elements.map((elem, idx) => {
          const group = elem as TGroup<unknown>
          const item = elem as TItem<unknown>
          if (group.items) {
            return (
              <Fragment key={idx}>
                <SingleGroup group={group} onSelect={onSelect} />
              </Fragment>
            )
          } else {
            return <SingleItem key={idx} item={item} onSelect={onSelect} />
          }
        })}
      </CommandList>
    </Command>
  )
}

type SingleGroupProps = {
  group: TGroup<unknown>
  onSelect: (item: TItem<unknown>) => void
}

function SingleGroup({ group, onSelect }: SingleGroupProps) {
  return (
    <CommandGroup
      heading={group.name}
      className="my-2 [&:first-child]:mt-0 [&:last-child]:mb-0 p-0 [&_[cmdk-group-items]]:ml-4">
      {group.items.map((item, idx) => (
        <SingleItem key={idx} item={item} onSelect={onSelect} />
      ))}
    </CommandGroup>
  )
}

type SingleItemProps = {
  item: TItem<unknown>
  onSelect: (item: TItem<unknown>) => void
}

function SingleItem({ item, onSelect }: SingleItemProps) {
  return (
    <CommandItem
      onSelect={() => onSelect(item)}
      value={`${item.name}#${item.id}`}
      className="rounded-none">
      <span>{item.name}</span>
    </CommandItem>
  )
}
