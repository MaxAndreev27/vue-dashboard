<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { usersV1ReadUsers } from '@/api/sdk.gen'
import type { UserPublic } from '@/api/types.gen'

const users = ref<UserPublic[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
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
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">Users</h1>
      <p class="mt-1 text-sm text-ink-soft">Registered accounts in your FastAPI backend.</p>
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
        v-else-if="users.length === 0"
        class="p-12 text-center text-sm text-ink-soft"
      >
        No users found.
      </div>

      <table v-else class="w-full text-left text-sm">
        <thead class="bg-surface-muted text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th class="px-6 py-3 font-semibold">ID</th>
            <th class="px-6 py-3 font-semibold">Username</th>
            <th class="px-6 py-3 font-semibold">Email</th>
            <th class="px-6 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr
            v-for="user in users"
            :key="user.id ?? user.username"
            class="transition-colors hover:bg-surface-muted"
          >
            <td class="px-6 py-3 font-mono text-ink-muted">#{{ user.id ?? '—' }}</td>
            <td class="px-6 py-3 font-medium text-ink">{{ user.username }}</td>
            <td class="px-6 py-3 text-ink-soft">{{ user.email }}</td>
            <td class="px-6 py-3">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  user.disabled
                    ? 'bg-red-50 text-red-700'
                    : 'bg-brand-50 text-brand-700',
                ]"
              >
                <span
                  :class="[
                    'h-1.5 w-1.5 rounded-full',
                    user.disabled ? 'bg-red-500' : 'bg-brand-500',
                  ]"
                />
                {{ user.disabled ? 'Disabled' : 'Active' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
