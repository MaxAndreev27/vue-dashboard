import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authenticationV1LoginForAccessToken, usersV1ReadUsersMe } from '@/api/sdk.gen'
import { clearToken, getToken, setToken } from '@/lib/token'

vi.mock('@/api/sdk.gen', () => ({
  authenticationV1LoginForAccessToken: vi.fn<() => Promise<unknown>>(),
  usersV1ReadUsersMe: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@/lib/token', () => ({
  clearToken: vi.fn<() => void>(),
  getToken: vi.fn<() => string | null>(() => null),
  setToken: vi.fn<(token: string) => void>(),
}))

import { useAuthStore } from './auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.mocked(getToken).mockReturnValue(null)
  })

  it('logs in, stores token, fetches user and returns true', async () => {
    vi.mocked(authenticationV1LoginForAccessToken).mockResolvedValue({
      data: { access_token: 'abc123', token_type: 'bearer' },
      error: undefined,
    })

    vi.mocked(usersV1ReadUsersMe).mockResolvedValue({
      data: {
        username: 'alice',
        email: 'alice@example.com',
        hashed_password: 'hashed-password',
      },
      error: undefined,
    })

    const store = useAuthStore()

    await expect(store.login('alice', 'secret')).resolves.toBe(true)

    expect(authenticationV1LoginForAccessToken).toHaveBeenCalledWith({
      body: { username: 'alice', password: 'secret' },
    })
    expect(setToken).toHaveBeenCalledWith('abc123')
    expect(usersV1ReadUsersMe).toHaveBeenCalled()
    expect(store.token).toBe('abc123')
    expect(store.user?.username).toBe('alice')
    expect(store.isAuthenticated).toBe(true)
    expect(store.error).toBe(null)
    expect(store.loading).toBe(false)
  })

  it('returns false and sets a validation error when login request fails', async () => {
    vi.mocked(authenticationV1LoginForAccessToken).mockResolvedValue({
      data: undefined,
      error: { detail: [] },
    })

    const store = useAuthStore()

    await expect(store.login('alice', 'wrong')).resolves.toBe(false)

    expect(store.token).toBe(null)
    expect(store.error).toBe('Invalid username or password.')
    expect(store.loading).toBe(false)
  })

  it('logs out and clears token when fetchUser receives no data', async () => {
    vi.mocked(getToken).mockReturnValue('abc123')
    vi.mocked(usersV1ReadUsersMe).mockResolvedValue({
      data: undefined,
      error: undefined,
    })

    const store = useAuthStore()
    await store.fetchUser()

    expect(clearToken).toHaveBeenCalled()
    expect(store.token).toBe(null)
    expect(store.user).toBe(null)
  })

  it('initializes only once and loads user from token', async () => {
    vi.mocked(getToken).mockReturnValue('abc123')
    vi.mocked(usersV1ReadUsersMe).mockResolvedValue({
      data: {
        username: 'alice',
        email: 'alice@example.com',
        hashed_password: 'hashed-password',
      },
      error: undefined,
    })

    const store = useAuthStore()

    await store.init()
    await store.init()

    expect(usersV1ReadUsersMe).toHaveBeenCalledTimes(1)
    expect(store.initialized).toBe(true)
    expect(store.user?.username).toBe('alice')
  })
})
