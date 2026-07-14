import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.json', // шлях до твого json (або URL http://127.0.0.1:8000/openapi.json)
  output: './src/api', // куди згенерувати готовий SDK код
  client: 'axios', // можна обрати 'fetch', 'axios', або 'angular'
})
