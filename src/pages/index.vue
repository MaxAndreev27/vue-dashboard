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

const recentHeroes = ref<HeroPublic[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const { data, error: err } = await heroesV1ReadHeroes({ query: { limit: 5 } })
    if (err || !data) {
      error.value = 'Could not load heroes.'
      return
    }
    heroes.value = data
    recentHeroes.value = data
  } catch {
    error.value = 'Could not load heroes.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <section
      class="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-sm"
    >
      <h1 class="text-2xl font-bold sm:text-3xl">
        Welcome back, {{ auth.user?.username ?? 'hero' }}
      </h1>
      <p class="mt-2 max-w-xl text-brand-50">
        Manage your heroes roster, view details, and keep the league up to date — all backed by your FastAPI service.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p class="text-sm font-medium text-ink-soft">Recent heroes</p>
        <p class="mt-2 text-3xl font-bold text-ink">
          {{ loading ? '—' : recentHeroes.length }}
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

    <section class="rounded-2xl border border-border bg-surface shadow-sm">
      <div
        class="flex items-center justify-between border-b border-border px-6 py-4"
      >
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

      <div
        v-else-if="error"
        class="p-6 text-sm text-red-600"
      >
        {{ error }}
      </div>

      <div
        v-else-if="recentHeroes.length === 0"
        class="p-12 text-center text-sm text-ink-soft"
      >
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
            v-for="hero in recentHeroes"
            :key="hero.id"
            class="transition-colors hover:bg-surface-muted"
          >
            <td class="px-6 py-3 font-mono text-ink-muted">#{{ hero.id }}</td>
            <td class="px-6 py-3 font-medium text-ink">
              <RouterLink
                :to="`/heroes/${hero.id}`"
                class="hover:text-brand-700"
              >
                {{ hero.name }}
              </RouterLink>
            </td>
            <td class="px-6 py-3 text-ink-soft">
              {{ hero.age ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
