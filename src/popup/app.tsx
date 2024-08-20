import CommandPalette from '@/popup/command-palette'
import { ThemeProvider } from '@/components/theme-provider'
import { useStorageState } from '@/lib/hooks/use-storage-state'
import { defaultGroups } from '@/lib/commands/default-groups'
import type { Theme } from '@/lib/types'

export default function App() {
  const [theme] = useStorageState<Theme>('theme', 'system')

  return (
    <ThemeProvider initialTheme={theme}>
      <CommandPalette
        commands={defaultGroups}
        close={() => window.close()}
        className="w-[500px] max-w-full"
      />
    </ThemeProvider>
  )
}
