<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const authedLinks = [
  { to: '/', label: 'Home' },
  { to: '/users', label: 'Users' },
  { to: '/heroes', label: 'Heroes' },
  { to: '/profile', label: 'Profile' },
]

const guestLinks = [
  { to: '/', label: 'Home' },
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
    <header class="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <RouterLink to="/" class="flex items-center gap-2 text-lg font-bold text-ink">
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
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
            active-class="bg-brand-50 text-brand-700"
          >
            {{ link.label }}
          </RouterLink>

          <div v-if="auth.isAuthenticated" class="ml-2 flex items-center gap-3 border-l border-border pl-3">
            <span class="hidden text-sm text-ink-soft sm:inline">
              {{ auth.user?.username }}
            </span>
            <button
              type="button"
              class="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-red-300 hover:text-red-600"
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
