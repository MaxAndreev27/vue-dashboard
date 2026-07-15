<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { heroesV1ReadHeroes } from '@/api/sdk.gen'
import type { HeroPublic } from '@/api/types.gen'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const heroes = ref<HeroPublic[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    const { data, error: err } = await heroesV1ReadHeroes({ query: { limit: 5 } })
    if (err || !data) {
      error.value = 'Could not load heroes.'
      return
    }
    heroes.value = data
  } catch {
    error.value = 'Could not load heroes.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Guest landing -->
  <div v-if="!auth.isAuthenticated" class="space-y-16">
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-20 text-center text-white shadow-lg sm:px-12">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      <div class="relative mx-auto max-w-2xl">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          FastAPI · Vue 3 · Tailwind
        </span>
        <h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Heroes Admin
        </h1>
        <p class="mt-4 text-lg text-brand-50">
          A dashboard for managing your league of heroes and users — powered by your FastAPI backend with OAuth2 password authentication.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RouterLink
            to="/login"
            class="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 sm:w-auto"
          >
            Get Started — Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
          >
            Create Account
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5l4.5 4.5m0 0L21 12m-4.5-4.5L21 12m-4.5-4.5L12 12m9 0l-4.5 4.5M12 12l4.5 4.5M12 12L7.5 7.5m9 9L12 21m4.5-4.5L21 12m-4.5 4.5L12 12m0 9l-4.5-4.5M12 12L7.5 16.5M12 12L7.5 7.5M12 3v9" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-bold text-ink">Hero management</h3>
        <p class="mt-1 text-sm text-ink-soft">
          Create, view, update, and delete heroes in your roster with a clean, responsive interface.
        </p>
      </div>
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.494M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a9.127 9.127 0 01-.118-2.57m6.5 2.372a9.035 9.035 0 01-2.57-.118M12 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-bold text-ink">User directory</h3>
        <p class="mt-1 text-sm text-ink-soft">
          Browse registered users, manage accounts, and view profile details at a glance.
        </p>
      </div>
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-bold text-ink">Secure auth</h3>
        <p class="mt-1 text-sm text-ink-soft">
          OAuth2 password bearer flow with token persistence and route guards protecting your data.
        </p>
      </div>
    </section>

    <section class="text-center">
      <RouterLink
        to="/register"
        class="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        Get started in seconds — Create an account →
      </RouterLink>
    </section>
  </div>

  <!-- Authenticated dashboard -->
  <div v-else class="space-y-8">
    <section class="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-sm">
      <h1 class="text-2xl font-bold sm:text-3xl">
        Welcome back, {{ auth.user?.username ?? 'hero' }}
      </h1>
      <p class="mt-2 max-w-xl text-brand-50">
        Manage your heroes roster, browse users, and keep the league up to date — all backed by your FastAPI service.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm font-medium text-ink-soft">Recent heroes</p>
        <p class="mt-2 text-3xl font-bold text-ink">
          {{ loading ? '—' : heroes.length }}
        </p>
      </div>
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm font-medium text-ink-soft">Signed in as</p>
        <p class="mt-2 truncate text-3xl font-bold text-ink">
          {{ auth.user?.username ?? '—' }}
        </p>
      </div>
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm font-medium text-ink-soft">Backend</p>
        <p class="mt-2 text-3xl font-bold text-ink">FastAPI</p>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <RouterLink
        to="/heroes"
        class="group flex items-center justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
      >
        <div>
          <p class="text-sm font-medium text-ink-soft">Manage</p>
          <p class="mt-1 text-xl font-bold text-ink">Heroes</p>
        </div>
        <span class="text-2xl text-ink-muted transition group-hover:text-brand-600">→</span>
      </RouterLink>
      <RouterLink
        to="/users"
        class="group flex items-center justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
      >
        <div>
          <p class="text-sm font-medium text-ink-soft">Browse</p>
          <p class="mt-1 text-xl font-bold text-ink">Users</p>
        </div>
        <span class="text-2xl text-ink-muted transition group-hover:text-brand-600">→</span>
      </RouterLink>
    </section>

    <section class="rounded-2xl border border-border bg-surface shadow-sm">
      <div class="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 class="text-lg font-bold text-ink">Recent heroes</h2>
        <RouterLink
          to="/heroes"
          class="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View all →
        </RouterLink>
      </div>

      <div v-if="loading" class="space-y-3 p-6">
        <div
          v-for="i in 3"
          :key="i"
          class="h-12 animate-pulse rounded-lg bg-surface-muted"
        />
      </div>

      <div v-else-if="error" class="p-6 text-sm text-red-600">
        {{ error }}
      </div>

      <div v-else-if="heroes.length === 0" class="p-12 text-center text-sm text-ink-soft">
        No heroes yet. Create your first hero.
      </div>

      <table v-else class="w-full text-left text-sm">
        <thead class="bg-surface-muted text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th class="px-6 py-3 font-semibold">ID</th>
            <th class="px-6 py-3 font-semibold">Name</th>
            <th class="px-6 py-3 font-semibold">Age</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr
            v-for="hero in heroes"
            :key="hero.id"
            class="transition-colors hover:bg-surface-muted"
          >
            <td class="px-6 py-3 font-mono text-ink-muted">#{{ hero.id }}</td>
            <td class="px-6 py-3 font-medium text-ink">
              <RouterLink :to="`/heroes/${hero.id}`" class="hover:text-brand-700">
                {{ hero.name }}
              </RouterLink>
            </td>
            <td class="px-6 py-3 text-ink-soft">{{ hero.age ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
