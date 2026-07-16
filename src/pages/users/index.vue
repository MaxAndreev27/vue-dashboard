<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { usersV1ReadUsers } from '@/api/sdk.gen'
import type { UserPublic } from '@/api/types.gen'

const users = ref<UserPublic[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null

  try {
    const { data, error: err } = await usersV1ReadUsers()
    if (err || !data) {
      error.value = 'Could not load users.'
      return
    }

    users.value = data
  } catch {
    error.value = 'Could not load users.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink dark:text-slate-100">Users</h1>
      <p class="mt-1 text-sm text-ink-soft dark:text-slate-400">Browse registered accounts.</p>
    </div>

    <div
      class="rounded-2xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="loading" class="space-y-3 p-6">
        <div
          v-for="i in 4"
          :key="i"
          class="h-12 animate-pulse rounded-lg bg-surface-muted dark:bg-slate-800"
        />
      </div>

      <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </div>

      <div
        v-else-if="users.length === 0"
        class="p-12 text-center text-sm text-ink-soft dark:text-slate-400"
      >
        No users found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-160 w-full text-left text-sm">
          <thead
            class="bg-surface-muted text-xs uppercase tracking-wide text-ink-soft dark:bg-slate-800/50 dark:text-slate-400"
          >
            <tr>
              <th class="px-6 py-3 font-semibold">ID</th>
              <th class="px-6 py-3 font-semibold">Username</th>
              <th class="px-6 py-3 font-semibold">Email</th>
              <th class="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border dark:divide-slate-800">
            <tr
              v-for="user in users"
              :key="user.id ?? user.username"
              class="transition-colors hover:bg-surface-muted dark:hover:bg-slate-800/50"
            >
              <td class="px-6 py-3 font-mono text-ink-muted dark:text-slate-500">
                #{{ user.id ?? '—' }}
              </td>
              <td class="px-6 py-3 font-medium text-ink dark:text-slate-100">
                {{ user.username }}
              </td>
              <td class="px-6 py-3 text-ink-soft dark:text-slate-400">{{ user.email }}</td>
              <td class="px-6 py-3 text-ink-soft dark:text-slate-400">
                {{ user.disabled ? 'Disabled' : 'Active' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
