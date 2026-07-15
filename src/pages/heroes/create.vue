<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { heroesV1CreateHero } from '@/api/sdk.gen'

const router = useRouter()

const name = ref('')
const secretName = ref('')
const age = ref<string>('')

const loading = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  fieldErrors.value = {}
  error.value = null

  if (!name.value.trim()) {
    fieldErrors.value.name = 'Name is required.'
  }
  if (!secretName.value.trim()) {
    fieldErrors.value.secretName = 'Secret name is required.'
  }
  if (Object.keys(fieldErrors.value).length > 0) return

  loading.value = true
  try {
    const ageNum = age.value === '' ? null : Number(age.value)
    const { error: err, data } = await heroesV1CreateHero({
      body: {
        name: name.value,
        secret_name: secretName.value,
        age: ageNum,
      },
    })
    if (err || !data) {
      error.value = 'Could not create hero. Check your input and try again.'
      return
    }
    await router.push('/heroes')
  } catch {
    error.value = 'Could not create hero. Check your input and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <RouterLink
        to="/heroes"
        class="text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to heroes
      </RouterLink>
      <h1 class="mt-2 text-2xl font-bold text-ink">Create hero</h1>
      <p class="mt-1 text-sm text-ink-soft">Add a new hero to the league.</p>
    </div>

    <form
      class="space-y-5 rounded-2xl border border-border bg-surface p-8 shadow-sm"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label for="name" class="mb-1.5 block text-sm font-medium text-ink">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
          placeholder="Spider-Man"
        />
        <p v-if="fieldErrors.name" class="mt-1 text-xs text-red-600">
          {{ fieldErrors.name }}
        </p>
      </div>

      <div>
        <label for="secretName" class="mb-1.5 block text-sm font-medium text-ink">
          Secret name <span class="text-red-500">*</span>
        </label>
        <input
          id="secretName"
          v-model="secretName"
          type="text"
          required
          class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
          placeholder="Peter Parker"
        />
        <p v-if="fieldErrors.secretName" class="mt-1 text-xs text-red-600">
          {{ fieldErrors.secretName }}
        </p>
      </div>

      <div>
        <label for="age" class="mb-1.5 block text-sm font-medium text-ink">
          Age <span class="text-ink-muted">(optional)</span>
        </label>
        <input
          id="age"
          v-model="age"
          type="number"
          min="0"
          class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
          placeholder="25"
        />
      </div>

      <p
        v-if="error"
        class="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
      >
        {{ error }}
      </p>

      <div class="flex items-center justify-end gap-3 border-t border-border pt-5">
        <RouterLink
          to="/heroes"
          class="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-surface-muted"
        >
          Cancel
        </RouterLink>
        <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Creating…' : 'Create hero' }}
        </button>
      </div>
    </form>
  </div>
</template>
