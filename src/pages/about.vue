<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">About</h1>
      <p class="mt-1 text-sm text-ink-soft">About this application.</p>
    </div>

    <div class="space-y-4 rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <p class="text-sm text-ink-soft">
        Heroes Admin is a Vue 3 + Pinia + Tailwind front-end for a FastAPI backend.
        It uses the auto-generated TypeScript SDK from your OpenAPI spec to manage
        heroes and user authentication over the OAuth2 password bearer flow.
      </p>

      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Frontend
          </dt>
          <dd class="mt-1 text-sm text-ink">Vue 3 · Pinia · Tailwind CSS</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Backend
          </dt>
          <dd class="mt-1 text-sm text-ink">FastAPI on Fly.io</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            SDK
          </dt>
          <dd class="mt-1 text-sm text-ink">@hey-api/openapi-ts</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Auth
          </dt>
          <dd class="mt-1 text-sm text-ink">OAuth2 Password Bearer</dd>
        </div>
      </dl>

      <RouterLink
        to="/"
        class="inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        ← Back to dashboard
      </RouterLink>
    </div>
  </div>
</template>
