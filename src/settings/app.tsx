import Body from '@/components/body'
import { useTheme, type Theme } from '@/components/theme-provider'

type Props = {
  theme: Theme
}

export default function App({ theme }: Props) {
  return (
    <Body theme={theme}>
      <div className="w-80 p-4 flex flex-col items-center justify-center gap-2">
        <ThemeSetting />
      </div>
    </Body>
  )
}

function ThemeSetting() {
  const { setTheme } = useTheme()
  return (
    <>
      <button
        type="button"
        className="border px-4 py-2"
        onClick={() => setTheme('system')}>
        System theme
      </button>
      <button
        type="button"
        className="border px-4 py-2"
        onClick={() => setTheme('light')}>
        Light theme
      </button>
      <button
        type="button"
        className="border px-4 py-2"
        onClick={() => setTheme('dark')}>
        Dark theme
      </button>
    </>
  )
}
