import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { client } from './api/client.gen'
import App from './App.vue'
import { getToken } from './lib/token'
import router from './router'
import { useThemeStore } from './stores/theme'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://fastapi-course-example.fly.dev'

client.setConfig({
  baseUrl: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
  auth: () => getToken() ?? undefined,
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useThemeStore()

app.mount('#app')
