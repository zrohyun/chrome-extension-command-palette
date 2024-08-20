import { version } from '@/../package.json'
import ThemeSetting from '@/options/theme-setting'
import KeyboardShortcutsSetting from '@/options/keyboard-shortcuts-setting'
import { ThemeProvider } from '@/components/theme-provider'
import { useStorageState } from '@/lib/hooks/use-storage-state'
import type { Theme } from '@/lib/types'

export default function App() {
  const [theme] = useStorageState<Theme>('theme', 'system')

  return (
    <ThemeProvider initialTheme={theme}>
      <div className="container min-h-dvh py-16 flex flex-col gap-8">
        <div>
          <p className="text-xs text-muted-foreground">Version {version}</p>
          <h1 className="text-2xl font-black">Command Palette Settings</h1>
        </div>
        <ThemeSetting />
        <KeyboardShortcutsSetting />
        {/* <CommandSetting /> */}
      </div>
    </ThemeProvider>
  )
}
