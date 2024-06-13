import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

const routes = generatedRoutes.map((v: any) =>
  v?.meta?.layout != false ? setupLayouts([v])[0] : v
)

console.log(routes,'xxxxxxxxxxxxx')

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
