import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  body: RefObject<HTMLElement | null>
  initialTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  body,
  initialTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    function onThemeChange(
      changes: {
        [key: string]: chrome.storage.StorageChange
      },
      areaName: chrome.storage.AreaName
    ) {
      if (
        areaName === 'sync' &&
        changes['theme'] != null &&
        changes['theme'].newValue != null
      ) {
        setTheme(changes['theme'].newValue as Theme)
      }
    }

    chrome.storage.onChanged.addListener(onThemeChange)
    return () => chrome.storage.onChanged.removeListener(onThemeChange)
  }, [initialTheme])

  useEffect(() => {
    if (body.current == null) {
      console.log('body is null')
      return
    }

    body.current.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      body.current.classList.add(systemTheme)
      return
    }

    body.current.classList.add(theme)
  }, [body, theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      chrome.storage.sync.set({ theme })
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
