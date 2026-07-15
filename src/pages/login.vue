<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  const ok = await auth.login(username.value, password.value)
  if (ok) {
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  }
}
</script>

<template>
  <div class="mx-auto max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-ink">Sign in</h1>
      <p class="mt-1 text-sm text-ink-soft">Welcome back. Sign in to your FastAPI account.</p>
    </div>

    <div class="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="username" class="mb-1.5 block text-sm font-medium text-ink">
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label for="password" class="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-11 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
              placeholder="Enter your password"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-ink-muted hover:text-ink"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <p
          v-if="auth.error"
          class="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {{ auth.error }}
        </p>

        <button
          type="submit"
          :disabled="auth.loading"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            v-if="auth.loading"
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {{ auth.loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-ink-soft">
        Don't have an account?
        <RouterLink to="/register" class="font-semibold text-brand-700 hover:text-brand-800">
          Create one
        </RouterLink>
      </p>
    </div>

    <p class="text-center text-xs text-ink-muted">
      OAuth2 Password Bearer · FastAPI backend
    </p>
  </div>
</template>
