import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { client } from './api/client.gen'

client.setConfig({
  baseUrl: 'http://localhost:8000',
  headers: {
    Accept: 'application/json',
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
