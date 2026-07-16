<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink dark:text-slate-100">About</h1>
      <p class="mt-1 text-sm text-ink-soft dark:text-slate-400">About this application.</p>
    </div>

    <div
      class="space-y-4 rounded-2xl border border-border bg-surface p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <p class="text-sm text-ink-soft dark:text-slate-400">
        Heroes Admin is a Vue 3 + Pinia + Tailwind front-end for a FastAPI backend. It uses the
        auto-generated TypeScript SDK from your OpenAPI spec to manage heroes and user
        authentication over the OAuth2 password bearer flow.
      </p>

      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt
            class="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-500"
          >
            Frontend
          </dt>
          <dd class="mt-1 text-sm text-ink dark:text-slate-200">Vue 3 · Pinia · Tailwind CSS</dd>
        </div>
        <div>
          <dt
            class="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-500"
          >
            Backend
          </dt>
          <dd class="mt-1 text-sm text-ink dark:text-slate-200">FastAPI on Fly.io</dd>
        </div>
        <div>
          <dt
            class="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-500"
          >
            SDK
          </dt>
          <dd class="mt-1 text-sm text-ink dark:text-slate-200">@hey-api/openapi-ts</dd>
        </div>
        <div>
          <dt
            class="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-500"
          >
            Auth
          </dt>
          <dd class="mt-1 text-sm text-ink dark:text-slate-200">OAuth2 Password Bearer</dd>
        </div>
      </dl>

      <RouterLink
        to="/"
        class="inline-block text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
      >
        ← Back to dashboard
      </RouterLink>
    </div>
  </div>
</template>
