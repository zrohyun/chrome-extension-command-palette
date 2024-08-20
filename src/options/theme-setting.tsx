import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/hooks/use-theme'
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'

export default function ThemeSetting() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-black">Theme</h1>
      <div className="flex flex-row items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setTheme('system')}>
          <SelectionIndicator selected={theme === 'system'} />
          System
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setTheme('light')}>
          <SelectionIndicator selected={theme === 'light'} />
          Light
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setTheme('dark')}>
          <SelectionIndicator selected={theme === 'dark'} />
          Dark
        </Button>
      </div>
    </div>
  )
}

type SelectionIndicatorProps = {
  selected: boolean
}

function SelectionIndicator({ selected }: SelectionIndicatorProps) {
  return selected ? (
    <CheckCircledIcon className="mr-2 h-4 w-4 text-teal-500" />
  ) : (
    <CircleIcon className="mr-2 h-4 w-4 text-muted-foreground/50" />
  )
}
