import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(getInitialTheme())
  applyTheme(theme.value)

  function toggle(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(value: Theme): void {
    theme.value = value
  }

  watch(
    theme,
    (value) => {
      applyTheme(value)
      localStorage.setItem(STORAGE_KEY, value)
    },
    { immediate: true },
  )

  return { theme, toggle, setTheme }
})
