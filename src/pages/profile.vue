<script setup lang="ts">
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const username = computed(() => auth.user?.username ?? '—')
const email = computed(() => auth.user?.email ?? '—')
const disabled = computed(() => (auth.user?.disabled ? 'Disabled' : 'Active'))
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink dark:text-slate-100">Profile</h1>
      <p class="mt-1 text-sm text-ink-soft dark:text-slate-400">Your account information.</p>
    </div>

    <div
      class="rounded-2xl border border-border bg-surface p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <dl class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl bg-surface-muted p-4 dark:bg-slate-800/60">
          <dt class="text-xs uppercase tracking-wide text-ink-soft dark:text-slate-400">
            Username
          </dt>
          <dd class="mt-2 text-lg font-semibold text-ink dark:text-slate-100">{{ username }}</dd>
        </div>

        <div class="rounded-xl bg-surface-muted p-4 dark:bg-slate-800/60">
          <dt class="text-xs uppercase tracking-wide text-ink-soft dark:text-slate-400">Email</dt>
          <dd class="mt-2 text-lg font-semibold text-ink dark:text-slate-100">{{ email }}</dd>
        </div>

        <div class="rounded-xl bg-surface-muted p-4 dark:bg-slate-800/60 sm:col-span-2">
          <dt class="text-xs uppercase tracking-wide text-ink-soft dark:text-slate-400">
            Account status
          </dt>
          <dd class="mt-2 text-lg font-semibold text-ink dark:text-slate-100">{{ disabled }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
