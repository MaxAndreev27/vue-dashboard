import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const PUBLIC_ROUTES = ['/', '/login', '/register']

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  const isPublic = PUBLIC_ROUTES.includes(to.path)

  if (auth.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return { path: '/' }
  }

  if (!auth.isAuthenticated && !isPublic) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
