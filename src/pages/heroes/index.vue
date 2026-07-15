<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { heroesV1DeleteHero, heroesV1ReadHeroes } from '@/api/sdk.gen'
import type { HeroPublic } from '@/api/types.gen'

const router = useRouter()

const heroes = ref<HeroPublic[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const confirmId = ref<number | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const { data, error: err } = await heroesV1ReadHeroes()
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
}

async function handleDelete(hero: HeroPublic) {
  deletingId.value = hero.id
  try {
    await heroesV1DeleteHero({ path: { hero_id: hero.id } })
    heroes.value = heroes.value.filter((h) => h.id !== hero.id)
    confirmId.value = null
  } catch {
    error.value = `Could not delete hero "${hero.name}".`
  } finally {
    deletingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-ink">Heroes</h1>
        <p class="mt-1 text-sm text-ink-soft">Manage your league of heroes.</p>
      </div>
      <RouterLink
        to="/heroes/create"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        <span class="text-lg leading-none">+</span> New hero
      </RouterLink>
    </div>

    <div class="rounded-2xl border border-border bg-surface shadow-sm">
      <div v-if="loading" class="space-y-3 p-6">
        <div
          v-for="i in 4"
          :key="i"
          class="h-12 animate-pulse rounded-lg bg-surface-muted"
        />
      </div>

      <div v-else-if="error" class="p-6 text-sm text-red-600">
        {{ error }}
      </div>

      <div
        v-else-if="heroes.length === 0"
        class="flex flex-col items-center gap-3 p-12 text-center"
      >
        <p class="text-sm text-ink-soft">No heroes yet.</p>
        <RouterLink
          to="/heroes/create"
          class="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Create your first hero →
        </RouterLink>
      </div>

      <table v-else class="w-full text-left text-sm">
        <thead class="bg-surface-muted text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th class="px-6 py-3 font-semibold">ID</th>
            <th class="px-6 py-3 font-semibold">Name</th>
            <th class="px-6 py-3 font-semibold">Age</th>
            <th class="px-6 py-3 text-right font-semibold">Actions</th>
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
              <RouterLink
                :to="`/heroes/${hero.id}`"
                class="hover:text-brand-700"
              >
                {{ hero.name }}
              </RouterLink>
            </td>
            <td class="px-6 py-3 text-ink-soft">{{ hero.age ?? '—' }}</td>
            <td class="px-6 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <RouterLink
                  :to="`/heroes/${hero.id}`"
                  class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
                >
                  Edit
                </RouterLink>
                <button
                  v-if="confirmId !== hero.id"
                  type="button"
                  class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-red-300 hover:text-red-600"
                  @click="confirmId = hero.id"
                >
                  Delete
                </button>
                <template v-else>
                  <button
                    type="button"
                    :disabled="deletingId === hero.id"
                    class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    @click="handleDelete(hero)"
                  >
                    {{ deletingId === hero.id ? 'Deleting…' : 'Confirm' }}
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-ink"
                    @click="confirmId = null"
                  >
                    Cancel
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
