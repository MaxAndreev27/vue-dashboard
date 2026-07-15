import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { client } from './api/client.gen'

export const FASTAPI_BASE_URL = 'https://fastapi-course-example.fly.dev'

const TOKEN_KEY = 'fastapi_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)

client.setConfig({
  baseUrl: FASTAPI_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  auth: () => getToken() ?? undefined,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
