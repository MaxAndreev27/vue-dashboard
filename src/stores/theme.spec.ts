import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { useThemeStore } from './theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.className = ''

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn<(...args: unknown[]) => void>(),
        removeListener: vi.fn<(...args: unknown[]) => void>(),
        addEventListener: vi.fn<(...args: unknown[]) => void>(),
        removeEventListener: vi.fn<(...args: unknown[]) => void>(),
        dispatchEvent: vi.fn<() => boolean>(),
      }),
    )
  })

  it('uses light theme by default when the system preference is light', () => {
    const store = useThemeStore()

    expect(store.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles theme and persists it to localStorage', async () => {
    const store = useThemeStore()

    store.toggle()
    await nextTick()

    expect(store.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    store.setTheme('light')
    await nextTick()

    expect(store.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
