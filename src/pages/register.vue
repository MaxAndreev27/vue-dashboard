<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { usersV1RegisterUser } from '@/api/sdk.gen'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const loading = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  fieldErrors.value = {}
  error.value = null

  if (!username.value.trim()) fieldErrors.value.username = 'Username is required.'
  if (!email.value.trim()) {
    fieldErrors.value.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.value.email = 'Enter a valid email address.'
  }
  if (!password.value) {
    fieldErrors.value.password = 'Password is required.'
  } else if (password.value.length < 6) {
    fieldErrors.value.password = 'Password must be at least 6 characters.'
  }
  if (Object.keys(fieldErrors.value).length > 0) return

  loading.value = true
  try {
    const { error: err } = await usersV1RegisterUser({
      body: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })
    if (err) {
      error.value = 'Registration failed. Username or email may already be taken.'
      return
    }

    const loggedIn = await auth.login(username.value, password.value)
    if (loggedIn) {
      await router.push('/')
      return
    }
    await router.push('/login')
  } catch {
    error.value = 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-ink dark:text-slate-100">Create account</h1>
      <p class="mt-1 text-sm text-ink-soft dark:text-slate-400">Register a new FastAPI account to get started.</p>
    </div>

    <div class="rounded-2xl border border-border bg-surface p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="username" class="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">
            Username <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Choose a username"
          />
          <p v-if="fieldErrors.username" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.username }}
          </p>
        </div>

        <div>
          <label for="email" class="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="you@example.com"
          />
          <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.email }}
          </p>
        </div>

        <div>
          <label for="password" class="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-11 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-ink-muted hover:text-ink dark:text-slate-500 dark:hover:text-slate-300"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.password }}
          </p>
        </div>

        <p
          v-if="error"
          class="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            v-if="loading"
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
          {{ loading ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-ink-soft dark:text-slate-400">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>
