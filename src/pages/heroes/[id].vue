<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { heroesV1DeleteHero, heroesV1ReadHero, heroesV1UpdateHero } from '@/api/sdk.gen'
import type { HeroPublic } from '@/api/types.gen'

const route = useRoute()
const router = useRouter()

const heroId = Number((route.params as { id: string }).id)

const hero = ref<HeroPublic | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const editing = ref(false)
const saving = ref(false)
const deleteConfirm = ref(false)
const deleting = ref(false)

const form = ref({ name: '', secretName: '', age: '' })

function startEdit() {
  if (!hero.value) return
  form.value = {
    name: hero.value.name,
    secretName: '',
    age: hero.value.age != null ? String(hero.value.age) : '',
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function saveEdit() {
  if (!hero.value) return
  saving.value = true
  try {
    const ageNum = form.value.age === '' ? null : Number(form.value.age)
    const { data, error: err } = await heroesV1UpdateHero({
      path: { hero_id: heroId },
      body: {
        name: form.value.name,
        age: ageNum,
        secret_name: form.value.secretName || null,
      },
    })
    if (err || !data) {
      error.value = 'Could not save changes.'
      return
    }
    hero.value = data
    editing.value = false
    error.value = null
  } catch {
    error.value = 'Could not save changes.'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await heroesV1DeleteHero({ path: { hero_id: heroId } })
    await router.push('/heroes')
  } catch {
    error.value = 'Could not delete hero.'
    deleting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const { data, error: err } = await heroesV1ReadHero({ path: { hero_id: heroId } })
    if (err || !data) {
      error.value = 'Hero not found.'
      return
    }
    hero.value = data
  } catch {
    error.value = 'Hero not found.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <RouterLink
        to="/heroes"
        class="text-sm font-medium text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to heroes
      </RouterLink>
    </div>

    <div v-if="loading" class="space-y-4 rounded-2xl border border-border bg-surface p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="h-8 w-48 animate-pulse rounded bg-surface-muted dark:bg-slate-800" />
      <div class="h-5 w-32 animate-pulse rounded bg-surface-muted dark:bg-slate-800" />
      <div class="h-5 w-24 animate-pulse rounded bg-surface-muted dark:bg-slate-800" />
    </div>

    <div
      v-else-if="error && !hero"
      class="rounded-2xl border border-border bg-surface p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      <RouterLink
        to="/heroes"
        class="mt-3 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
      >
        Back to heroes →
      </RouterLink>
    </div>

    <template v-else-if="hero">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white"
          >
            {{ hero.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-ink dark:text-slate-100">{{ hero.name }}</h1>
            <p class="font-mono text-sm text-ink-muted dark:text-slate-500">#{{ hero.id }}</p>
          </div>
        </div>
        <button
          v-if="!editing"
          type="button"
          class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:text-brand-400"
          @click="startEdit"
        >
          Edit
        </button>
      </div>

      <p
        v-if="error"
        class="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
      >
        {{ error }}
      </p>

      <!-- View mode -->
      <div
        v-if="!editing"
        class="space-y-4 rounded-2xl border border-border bg-surface p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <dl class="grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-500">
              Name
            </dt>
            <dd class="mt-1 text-sm font-medium text-ink dark:text-slate-200">{{ hero.name }}</dd>
          </div>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-500">
              Age
            </dt>
            <dd class="mt-1 text-sm text-ink dark:text-slate-200">{{ hero.age ?? '—' }}</dd>
          </div>
        </dl>

        <div class="border-t border-border pt-5 dark:border-slate-800">
          <button
            v-if="!deleteConfirm"
            type="button"
            class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
            @click="deleteConfirm = true"
          >
            Delete hero
          </button>
          <div v-else class="flex items-center gap-3">
            <span class="text-sm text-ink-soft dark:text-slate-400">Delete this hero?</span>
            <button
              type="button"
              :disabled="deleting"
              class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              @click="handleDelete"
            >
              {{ deleting ? 'Deleting…' : 'Yes, delete' }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-ink dark:border-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              @click="deleteConfirm = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Edit mode -->
      <form
        v-else
        class="space-y-5 rounded-2xl border border-border bg-surface p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        @submit.prevent="saveEdit"
      >
        <div>
          <label for="edit-name" class="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">
            Name
          </label>
          <input
            id="edit-name"
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div>
          <label
            for="edit-secret"
            class="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200"
          >
            Secret name
          </label>
          <input
            id="edit-secret"
            v-model="form.secretName"
            type="text"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Leave blank to keep unchanged"
          />
        </div>

        <div>
          <label for="edit-age" class="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">
            Age
          </label>
          <input
            id="edit-age"
            v-model="form.age"
            type="number"
            min="0"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-border pt-5 dark:border-slate-800">
          <button
            type="button"
            class="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-surface-muted dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ saving ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>
