<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)

const user = computed(() => auth.user)

onMounted(async () => {
  loading.value = true
  try {
    await auth.fetchUser()
    if (!auth.user) {
      error.value = 'Could not load profile.'
    }
  } catch {
    error.value = 'Could not load profile.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">Profile</h1>
      <p class="mt-1 text-sm text-ink-soft">Your FastAPI account details.</p>
    </div>

    <div class="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <div v-if="loading" class="space-y-4">
        <div class="h-16 w-16 animate-pulse rounded-full bg-surface-muted" />
        <div class="h-5 w-48 animate-pulse rounded bg-surface-muted" />
        <div class="h-4 w-64 animate-pulse rounded bg-surface-muted" />
      </div>

      <div v-else-if="error" class="text-sm text-red-600">
        {{ error }}
      </div>

      <div v-else-if="user" class="flex items-start gap-6">
        <div
          class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-3xl font-bold text-white"
        >
          {{ user.username.charAt(0).toUpperCase() }}
        </div>

        <div class="flex-1 space-y-4">
          <div>
            <h2 class="text-xl font-bold text-ink">{{ user.username }}</h2>
            <p class="text-sm text-ink-soft">{{ user.email }}</p>
          </div>

          <dl class="grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                User ID
              </dt>
              <dd class="mt-1 font-mono text-sm text-ink">
                {{ user.id ?? '—' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Status
              </dt>
              <dd class="mt-1">
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
              </dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Email
              </dt>
              <dd class="mt-1 text-sm text-ink">{{ user.email }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Username
              </dt>
              <dd class="mt-1 text-sm text-ink">{{ user.username }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
