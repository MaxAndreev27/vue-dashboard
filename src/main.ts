import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { client } from './api/client.gen'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://fastapi-course-example.fly.dev'

client.setConfig({
  baseUrl: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
