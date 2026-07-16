<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

const authedLinks = [
  { to: '/', label: 'Home' },
  { to: '/users', label: 'Users' },
  { to: '/profile', label: 'Profile' },
]

const guestLinks = [
  { to: '/', label: 'Home' },
  { to: '/heroes', label: 'Heroes' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

const navLinks = computed(() => (auth.isAuthenticated ? authedLinks : guestLinks))

async function handleLogout() {
  auth.logout()
  await router.push('/')
}
</script>

<template>
  <div class="min-h-screen">
    <header
      class="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-lg font-bold text-ink dark:text-slate-100"
        >
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            H
          </span>
          Heroes Admin
        </RouterLink>

        <nav class="flex items-center gap-1 sm:gap-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            active-class="bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-400"
          >
            {{ link.label }}
          </RouterLink>

          <!-- Theme toggle -->
          <button
            type="button"
            class="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            :aria-label="theme.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="theme.toggle()"
          >
            <svg
              v-if="theme.theme === 'dark'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                stroke-linecap="round"
                d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          </button>

          <div
            v-if="auth.isAuthenticated"
            class="ml-1 flex items-center gap-3 border-l border-border pl-3 dark:border-slate-700"
          >
            <span class="hidden text-sm text-ink-soft sm:inline dark:text-slate-300">
              {{ auth.user?.username }}
            </span>
            <button
              type="button"
              class="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-500 dark:hover:text-red-400"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <RouterView />
    </main>
  </div>
</template>
