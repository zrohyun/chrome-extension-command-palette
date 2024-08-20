import Body from '@/components/body'
import ThemeSetting from '@/options/theme-setting'
import KeymapSetting from '@/options/keymap-setting'
import { useStorageState } from '@/lib/hooks/use-storage-state'
import type { Theme } from '@/lib/types'
import { useDevReload } from '@/lib/hooks/use-dev-reload'

export default function App() {
  useDevReload()

  const [theme] = useStorageState<Theme>('theme', 'system')

  return (
    <Body theme={theme}>
      <div className="container min-h-dvh py-16 flex flex-col gap-8">
        <ThemeSetting />
        <KeymapSetting />
        {/* <CommandSetting /> */}
      </div>
    </Body>
  )
}
